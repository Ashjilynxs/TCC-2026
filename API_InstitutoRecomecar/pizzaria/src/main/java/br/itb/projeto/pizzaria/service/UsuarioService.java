package br.itb.projeto.pizzaria.service;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.itb.projeto.pizzaria.dto.UsuarioDTO;
import br.itb.projeto.pizzaria.model.entity.ConfirmacaoEmail;
import br.itb.projeto.pizzaria.model.entity.Usuario;
import br.itb.projeto.pizzaria.model.repository.ConfirmacaoEmailRepository;
import br.itb.projeto.pizzaria.model.repository.UsuarioRepository;

@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ConfirmacaoEmailRepository confirmacaoEmailRepository;
    private final JavaMailSender mailSender;

    /* Confirmação de e-mail por CÓDIGO de 6 dígitos */
    private static final int VALIDADE_CODIGO_MINUTOS = 10;
    private static final int MAXIMO_TENTATIVAS = 5;
    private static final long INTERVALO_REENVIO_SEGUNDOS = 60;

    public UsuarioService(UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            ConfirmacaoEmailRepository confirmacaoEmailRepository,
            JavaMailSender mailSender) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.confirmacaoEmailRepository = confirmacaoEmailRepository;
        this.mailSender = mailSender;
    }

    /* ================= LOGIN ================= */
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        /* C1: contas criadas a partir de agora nascem NAO_CONFIRMADO e
         * só conseguem entrar depois de confirmar o e-mail. Contas
         * antigas (ATIVO / DESATIVO) não são afetadas por esta regra. */
        if ("NAO_CONFIRMADO".equals(usuario.getStatusUsuario())) {
            throw new DisabledException(
                    "E-mail ainda não confirmado. Verifique sua caixa de entrada.");
        }

        if (!"ATIVO".equals(usuario.getStatusUsuario())) {
            throw new DisabledException("Usuário inativo ou precisa trocar senha");
        }

        // Suporta um ou mais papéis separados por vírgula (ex.: "USER,VENDEDORA")
        String[] papeis = splitPapeis(usuario.getNivelAcesso());

        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .roles(papeis)
                .build();
    }

    /* ================= CREATE ================= */
    public Usuario create(Usuario usuario) {

        if (usuario.getNome() == null || usuario.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Informe o nome.");
        }
        if (usuario.getUsername() == null || usuario.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Informe o e-mail.");
        }
        if (usuario.getPassword() == null || usuario.getPassword().length() < 8) {
            throw new IllegalArgumentException("A senha deve ter pelo menos 8 caracteres.");
        }
        if (usuarioRepository.findByUsername(usuario.getUsername().trim()).isPresent()) {
            throw new IllegalArgumentException("Já existe uma conta com este e-mail.");
        }

        Usuario _usuario = new Usuario();
        _usuario.setNome(usuario.getNome().trim());
        _usuario.setUsername(usuario.getUsername().trim());
        _usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        // Cadastro público sempre cria usuária comum (ADMIN só via seed/administração)
        _usuario.setNivelAcesso("USER");
        // C1: nova conta só pode entrar depois de confirmar o e-mail
        _usuario.setStatusUsuario("NAO_CONFIRMADO");
        _usuario.setDataCadastro(LocalDateTime.now());
        // A conta só é ativada para solicitações após confirmar o e-mail
        _usuario.setEmailConfirmado(Boolean.FALSE);

        Usuario salvo = usuarioRepository.save(_usuario);

        // Envia o código de confirmação (falha de e-mail não impede o cadastro)
        try {
            enviarCodigoConfirmacao(salvo.getUsername());
        } catch (Exception e) {
            // SMTP pode não estar configurado em ambiente de teste
        }

        return salvo;
    }

    /* ================= CONFIRMAÇÃO DE E-MAIL =================
     * Envia um CÓDIGO numérico de 6 dígitos por e-mail (sem link,
     * funciona de qualquer dispositivo). O código expira em 10
     * minutos, é de uso único, tem limite de tentativas e o reenvio
     * respeita um intervalo mínimo entre envios. */
    public void enviarCodigoConfirmacao(String email) {

        Usuario usuario = usuarioRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (Boolean.TRUE.equals(usuario.getEmailConfirmado())) {
            throw new IllegalArgumentException("Este e-mail já está confirmado.");
        }

        /* Intervalo mínimo entre envios: se o último código foi enviado
         * há menos de 60 segundos, não dispara novo e-mail (a resposta
         * do endpoint continua sempre genérica). */
        boolean reenvioRapido = confirmacaoEmailRepository
                .findTopByEmailOrderByGeradoEmDesc(usuario.getUsername())
                .filter(ultimo -> ultimo.getGeradoEm().isAfter(
                        LocalDateTime.now().minusSeconds(INTERVALO_REENVIO_SEGUNDOS)))
                .isPresent();

        if (reenvioRapido) {
            return;
        }

        String codigo = gerarCodigo();
        LocalDateTime agora = LocalDateTime.now();

        ConfirmacaoEmail registro = new ConfirmacaoEmail();
        registro.setEmail(usuario.getUsername());
        registro.setCodigo(codigo);
        registro.setGeradoEm(agora);
        /* Validade de 10 minutos */
        registro.setExpiraEm(agora.plusMinutes(VALIDADE_CODIGO_MINUTOS));
        registro.setConfirmado(false);
        registro.setTentativas(0);
        confirmacaoEmailRepository.save(registro);

        /* O código segue APENAS no corpo do e-mail:
         * nunca é registrado em log nem devolvido pela API. */
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(usuario.getUsername());
        mensagem.setSubject("Confirme seu e-mail - Instituto Recomeçar");
        mensagem.setText("Olá, " + usuario.getNome() + "!\n\n"
                + "Seu código de confirmação é: " + codigo + "\n\n"
                + "O código tem 6 dígitos, é de uso único e expira em "
                + VALIDADE_CODIGO_MINUTOS + " minutos.\n"
                + "Se você não criou esta conta, ignore este e-mail.\n"
                + "Não responda este e-mail.");
        mailSender.send(mensagem);
    }

    /* Confirma o e-mail com o CÓDIGO de 6 dígitos (uso único).
     * O código pertence a um único e-mail: a validação sempre
     * considera o e-mail informado e o código mais recente enviado
     * para ele — um código não confirma outra conta. */
    public void confirmarEmailPorCodigo(String email, String codigo) {

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Informe o e-mail e o código.");
        }

        if (codigo == null || !codigo.trim().matches("\\d{6}")) {
            throw new RuntimeException("O código deve ter 6 dígitos.");
        }

        ConfirmacaoEmail registro = confirmacaoEmailRepository
                .findTopByEmailOrderByGeradoEmDesc(email.trim())
                .orElseThrow(() -> new RuntimeException(
                        "Código inválido ou expirado. Solicite um novo."));

        if (registro.isConfirmado()) {
            throw new RuntimeException("Código já utilizado. Solicite um novo.");
        }

        if (registro.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Código expirado. Solicite um novo.");
        }

        if (registro.getTentativas() >= MAXIMO_TENTATIVAS) {
            /* Esgotou as tentativas: invalida o código */
            registro.setExpiraEm(LocalDateTime.now());
            confirmacaoEmailRepository.save(registro);
            throw new RuntimeException("Número máximo de tentativas atingido."
                    + " Solicite um novo código.");
        }

        if (!registro.getCodigo().equals(codigo.trim())) {
            registro.setTentativas(registro.getTentativas() + 1);
            confirmacaoEmailRepository.save(registro);

            int restantes =
                    Math.max(0, MAXIMO_TENTATIVAS - registro.getTentativas());
            throw new RuntimeException("Código incorreto."
                    + " Tentativas restantes: " + restantes + ".");
        }

        /* Marca o código como usado — impede a reutilização */
        registro.setConfirmado(true);
        confirmacaoEmailRepository.save(registro);

        Usuario usuario = usuarioRepository.findByUsername(registro.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setEmailConfirmado(Boolean.TRUE);
        /* Libera a entrada da conta recém-criada */
        if ("NAO_CONFIRMADO".equals(usuario.getStatusUsuario())) {
            usuario.setStatusUsuario("ATIVO");
        }
        usuario.setDataAtualizacao(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    /* ================= EDITAR ================= */
    public Usuario editar(MultipartFile file, Long id, Usuario usuario) {

        Usuario usuarioBanco = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));

        if (usuario.getNome() == null ||
                usuario.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "O nome não pode ficar vazio");
        }

        usuarioBanco.setNome(usuario.getNome().trim());

        // Não permitir alteração do nível de acesso
        // nem da senha por este método.

        usuarioBanco.setDataAtualizacao(LocalDateTime.now());

        if (file != null && !file.isEmpty()) {
            try {
                usuarioBanco.setFoto(file.getBytes());
            } catch (IOException e) {
                throw new RuntimeException(
                        "Erro ao processar a foto", e);
            }
        }

        return usuarioRepository.save(usuarioBanco);
    }

    /* ================= ALTERAR SENHA ================= */
    public void alterarSenha(
            Authentication authentication,
            String senhaAtual,
            String novaSenha) {

        Usuario usuario = usuarioRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(
                senhaAtual, usuario.getPassword())) {

            throw new IllegalArgumentException(
                    "A senha atual está incorreta");
        }

        if (novaSenha == null || novaSenha.length() < 8) {
            throw new IllegalArgumentException(
                    "A nova senha deve ter pelo menos 8 caracteres");
        }

        usuario.setPassword(passwordEncoder.encode(novaSenha));
        usuario.setDataAtualizacao(LocalDateTime.now());

        usuarioRepository.save(usuario);
    }

    public byte[] buscarFoto(Authentication authentication) {
        Usuario usuario = usuarioRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));

        return usuario.getFoto();
    }

    /* ================= INATIVAR ================= */
    public Usuario inativar(Long id) {
        Usuario _usuario = usuarioRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException("Usuário não encontrado"));

        _usuario.setStatusUsuario("INATIVO");
        _usuario.setDataAtualizacao(LocalDateTime.now());
        return usuarioRepository.save(_usuario);
    }

    /* ================= ATIVAR ================= */
    public Usuario ativar(Long id) {
        Usuario _usuario = usuarioRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException("Usuário não encontrado"));

        _usuario.setStatusUsuario("ATIVO");
        _usuario.setDataAtualizacao(LocalDateTime.now());
        return usuarioRepository.save(_usuario);
    }

    public UsuarioDTO findByUsername(Authentication authentication) {
        Usuario usuario = usuarioRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return toDTO(usuario);
    }

    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public UsuarioDTO findById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException("Usuário não encontrado"));

        return toDTO(usuario);
    }

    /* Retorna o emailConfirmado da usuária logada */
    public boolean isEmailConfirmado(Authentication authentication) {
        Usuario usuario = usuarioRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return Boolean.TRUE.equals(usuario.getEmailConfirmado());
    }

    private String[] splitPapeis(String nivelAcesso) {
        if (nivelAcesso == null || nivelAcesso.trim().isEmpty()) {
            return new String[] { "USER" };
        }
        String[] partes = nivelAcesso.split(",");
        List<String> limpos = new java.util.ArrayList<>();
        for (String p : partes) {
            String t = p.trim();
            if (!t.isEmpty()) {
                limpos.add(t);
            }
        }
        if (limpos.isEmpty()) {
            return new String[] { "USER" };
        }
        return limpos.toArray(new String[0]);
    }

    private String gerarCodigo() {
        return String.format("%06d", new SecureRandom().nextInt(1_000_000));
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getUsername(),
                usuario.getNivelAcesso(),
                usuario.getDataCadastro(),
                usuario.getStatusUsuario()
        );
    }
}