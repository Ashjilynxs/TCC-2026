package br.itb.projeto.pizzaria.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.itb.projeto.pizzaria.model.entity.Psicologo;
import br.itb.projeto.pizzaria.model.entity.Usuario;
import br.itb.projeto.pizzaria.model.repository.PsicologoRepository;
import br.itb.projeto.pizzaria.model.repository.UsuarioRepository;

@Service
public class PsicologoService {

    private final PsicologoRepository psicologoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    public PsicologoService(PsicologoRepository psicologoRepository,
            UsuarioRepository usuarioRepository,
            EmailService emailService) {
        this.psicologoRepository = psicologoRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    /* ================= CADASTRO (psicóloga) ================= */
    public Psicologo cadastrar(String username, Psicologo dados) {

        Usuario usuario = usuarioLogado(username);

        if (psicologoRepository.findByUsuarioId(usuario.getId()).isPresent()) {
            throw new RuntimeException("Você já possui um cadastro de psicóloga");
        }
        if (dados.getCrp() == null || dados.getCrp().isBlank()) {
            throw new RuntimeException("Informe o número do CRP");
        }
        if (psicologoRepository.existsByCrp(dados.getCrp())) {
            throw new RuntimeException("Este CRP já está cadastrado");
        }

        Psicologo psicologo = new Psicologo();
        psicologo.setUsuario(usuario);
        psicologo.setCrp(dados.getCrp());
        psicologo.setEspecialidade(dados.getEspecialidade());
        psicologo.setResumo(dados.getResumo());
        psicologo.setStatusCadastro("PENDENTE"); // aguardando aprovação do admin
        psicologo.setDataCadastro(LocalDateTime.now());

        return psicologoRepository.save(psicologo);
    }

    public Psicologo meuCadastro(String username) {
        return psicologoRepository.findByUsuarioId(usuarioLogado(username).getId())
                .orElseThrow(() -> new RuntimeException("Você ainda não possui cadastro de psicóloga"));
    }

    public Psicologo findById(Long id) {
        return psicologoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Psicóloga não encontrada"));
    }

    public List<Psicologo> aprovados() {
        return psicologoRepository.findByStatusCadastro("APROVADO");
    }

    /* ================= ADMINISTRAÇÃO ================= */
    public List<Psicologo> listar(String status) {
        return (status == null || status.isBlank())
                ? psicologoRepository.findAll()
                : psicologoRepository.findByStatusCadastro(status);
    }

    /* ================= ADMINISTRAÇÃO: APROVAR (transacional) =========
     * Concede o papel PSICOLOGO preservando os demais, grava o admin
     * responsável e a data da decisão e envia e-mail. */
    @Transactional
    public Psicologo aprovar(Long id, String adminUsername) {

        Psicologo psicologo = findById(id);

        if (!"PENDENTE".equals(psicologo.getStatusCadastro())) {
            throw new IllegalArgumentException("Este cadastro já foi analisado.");
        }

        Usuario admin = adminLogado(adminUsername);
        Usuario usuario = psicologo.getUsuario();
        LocalDateTime agora = LocalDateTime.now();

        /* 1. Concede permissão de psicóloga preservando as demais */
        concederPapelPsicologa(usuario);
        usuario.setDataAtualizacao(agora);
        usuarioRepository.save(usuario);

        /* 2. Grava a análise */
        psicologo.setStatusCadastro("APROVADO");
        psicologo.setDataAprovacao(agora);
        psicologo.setDataDecisao(agora);
        psicologo.setAdminResponsavel(admin);
        psicologo.setMotivoRejeicao(null);
        Psicologo salvo = psicologoRepository.save(psicologo);

        /* 3. Notifica por e-mail */
        try {
            emailService.enviarResultadoCadastroPsicologa(
                    usuario.getUsername(), true, null, psicologo.getCrp());
        } catch (Exception e) {
            // falha de e-mail não pode desfazer a aprovação
        }

        return salvo;
    }

    /* ================= ADMINISTRAÇÃO: REJEITAR (transacional) ========
     * Não concede nenhum papel; registra admin, data e motivo. */
    @Transactional
    public Psicologo rejeitar(Long id, String adminUsername, String motivo) {

        Psicologo psicologo = findById(id);

        if (!"PENDENTE".equals(psicologo.getStatusCadastro())) {
            throw new IllegalArgumentException("Este cadastro já foi analisado.");
        }

        if (motivo == null || motivo.trim().isEmpty()) {
            throw new IllegalArgumentException("Informe o motivo da recusa.");
        }

        Usuario admin = adminLogado(adminUsername);
        Usuario usuario = psicologo.getUsuario();
        LocalDateTime agora = LocalDateTime.now();

        psicologo.setStatusCadastro("REJEITADO");
        psicologo.setMotivoRejeicao(motivo.trim());
        psicologo.setDataDecisao(agora);
        psicologo.setAdminResponsavel(admin);
        Psicologo salvo = psicologoRepository.save(psicologo);

        /* Não concede papel algum na recusa */
        try {
            emailService.enviarResultadoCadastroPsicologa(
                    usuario.getUsername(), false, motivo.trim(), psicologo.getCrp());
        } catch (Exception e) {
            // falha de e-mail não pode desfazer a rejeição
        }

        return salvo;
    }

    /* ================= AUXILIARES ================= */
    private Usuario usuarioLogado(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    /* Só administradores autenticados podem decidir cadastros.
     * Complementa a regra ROLE_ADMIN do SecurityConfig. */
    private Usuario adminLogado(String username) {
        Usuario admin = usuarioLogado(username);
        if (admin.getNivelAcesso() == null
                || !admin.getNivelAcesso().contains("ADMIN")) {
            throw new RuntimeException(
                    "Apenas administradores podem analisar cadastros.");
        }
        return admin;
    }

    /* Concede o papel PSICOLOGO preservando os demais (ex.: "USER,PSICOLOGO") */
    private void concederPapelPsicologa(Usuario usuario) {
        String nivel = usuario.getNivelAcesso();
        if (nivel == null || nivel.trim().isEmpty()) {
            usuario.setNivelAcesso("USER,PSICOLOGO");
            return;
        }
        if (!nivel.contains("PSICOLOGO")) {
            usuario.setNivelAcesso(nivel.trim() + ",PSICOLOGO");
        }
    }

}

