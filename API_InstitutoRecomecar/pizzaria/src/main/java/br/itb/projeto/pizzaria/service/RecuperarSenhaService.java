package br.itb.projeto.pizzaria.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.itb.projeto.pizzaria.model.entity.RecuperarSenha;
import br.itb.projeto.pizzaria.model.entity.Usuario;
import br.itb.projeto.pizzaria.model.repository.RecuperarSenhaRepository;
import br.itb.projeto.pizzaria.model.repository.UsuarioRepository;

/* Recuperação de senha:
 * - gera token aleatório de uso único com validade de 15 minutos;
 * - envia por LINK no e-mail (nunca revela se o e-mail está cadastrado);
 * - valida o token no backend e impede sua reutilização;
 * - grava a nova senha com BCrypt;
 * - invalida todas as sessões abertas da usuária após a redefinição. */
@Service
public class RecuperarSenhaService {

    private static final Logger log =
            LoggerFactory.getLogger(RecuperarSenhaService.class);

    private final RecuperarSenhaRepository recuperarSenhaRepository;
    private final UsuarioRepository usuarioRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final SessaoService sessaoService;

    /* URL do frontend para montar o link de redefinição.
     * Configurável por variável de ambiente (APP_FRONTEND_URL). */
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl = "http://localhost:5173";

    public RecuperarSenhaService(RecuperarSenhaRepository recuperarSenhaRepository,
            UsuarioRepository usuarioRepository,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder,
            SessaoService sessaoService) {
        this.recuperarSenhaRepository = recuperarSenhaRepository;
        this.usuarioRepository = usuarioRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
        this.sessaoService = sessaoService;
    }

    /* ================= SOLICITAR RECUPERAÇÃO =================
     * Nunca revela se o e-mail existe: se não houver conta, nada é
     * enviado e a resposta do controller é sempre a mesma. */
    public void solicitarCodigo(String email) {

        if (email == null || email.trim().isEmpty()) {
            return;
        }

        usuarioRepository.findByUsername(email.trim())
                .ifPresent(usuario -> {
                    try {
                        gerarEEnviarLink(usuario);
                    } catch (Exception e) {
                        /* Falha de SMTP não revela erro ao usuário
                         * nem quebra o fluxo (o token fica salvo). */
                        log.warn("Falha ao enviar e-mail de recuperação para {}: {}",
                                usuario.getUsername(), e.getMessage());
                    }
                });
    }

    private void gerarEEnviarLink(Usuario usuario) {

        String token = gerarToken();
        LocalDateTime agora = LocalDateTime.now();

        RecuperarSenha registro = new RecuperarSenha();
        registro.setEmail(usuario.getUsername());
        /* Mantém a coluna codigo preenchida (compatibilidade com a tabela) */
        registro.setCodigo(gerarCodigo());
        registro.setToken(token);
        registro.setGeradoEm(agora);
        registro.setExpiraEm(agora.plusMinutes(15));
        registro.setStatusCodigo(true);
        recuperarSenhaRepository.save(registro);

        String link = frontendUrl + "/esquecerSenha?token=" + token;

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(usuario.getUsername());
        mensagem.setSubject("Recuperação de senha - Instituto Recomeçar");
        mensagem.setText("Olá, " + usuario.getNome() + "!\n\n"
                + "Recebemos uma solicitação para redefinir sua senha.\n"
                + "Acesse o link abaixo para cadastrar uma nova senha:\n"
                + link + "\n\n"
                + "O link é de uso único e expira em 15 minutos.\n"
                + "Se você não solicitou esta recuperação, ignore este e-mail: "
                + "sua senha continuará a mesma.\n"
                + "Não responda este e-mail.");

        mailSender.send(mensagem);
    }

    /* ================= VALIDAR LINK ================= */
    public boolean tokenValido(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }
        return recuperarSenhaRepository
                .findByTokenAndStatusCodigoTrue(token.trim())
                .filter(r -> r.getExpiraEm().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    /* ================= REDEFINIR SENHA (uso único) ================= */
    public void redefinirSenha(String token, String novaSenha) {

        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Link inválido.");
        }

        RecuperarSenha registro = recuperarSenhaRepository
                .findByTokenAndStatusCodigoTrue(token.trim())
                .orElseThrow(() -> new RuntimeException(
                        "Link inválido ou já utilizado. Solicite um novo."));

        if (registro.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Link expirado. Solicite um novo.");
        }

        if (novaSenha == null || novaSenha.length() < 8) {
            throw new IllegalArgumentException(
                    "A nova senha deve ter pelo menos 8 caracteres.");
        }

        Usuario usuario = usuarioRepository.findByUsername(registro.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        usuario.setPassword(passwordEncoder.encode(novaSenha));
        usuario.setDataAtualizacao(LocalDateTime.now());
        usuarioRepository.save(usuario);

        /* Impede a reutilização do token */
        registro.setStatusCodigo(false);
        recuperarSenhaRepository.save(registro);

        /* Invalida todas as sessões já abertas da usuária */
        sessaoService.expirarSessoes(usuario.getUsername());
    }

    /* ================= AUXILIARES ================= */
    private String gerarToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private String gerarCodigo() {
        return String.format("%06d", new SecureRandom().nextInt(1_000_000));
    }
}
