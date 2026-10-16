
package br.itb.projeto.pizzaria.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.itb.projeto.pizzaria.model.entity.SolicitacaoVendedora;
import br.itb.projeto.pizzaria.model.entity.SolicitacaoVendedora.StatusSolicitacao;
import br.itb.projeto.pizzaria.model.entity.Usuario;
import br.itb.projeto.pizzaria.model.repository.SolicitacaoVendedoraRepository;
import br.itb.projeto.pizzaria.model.repository.UsuarioRepository;

@Service
public class SolicitacaoVendedoraService {

    private final SolicitacaoVendedoraRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    public SolicitacaoVendedoraService(
            SolicitacaoVendedoraRepository solicitacaoRepository,
            UsuarioRepository usuarioRepository,
            EmailService emailService) {

        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    // SOLICITAR CADASTRO COMO VENDEDORA

    @Transactional
    public SolicitacaoVendedora solicitar(
            String username,
            SolicitacaoVendedora dados) {

        Usuario usuario = usuarioLogado(username);

        /*
if (!usuario.isEmailConfirmado()) {
    throw new RuntimeException("Confirme seu e-mail antes de continuar.");
}
*/

        if (temPapel(usuario, "VENDEDORA")) {
            throw new IllegalArgumentException(
                "Você já é vendedora aprovada."
            );
        }

        if (solicitacaoRepository.existsByUsuarioIdAndStatus(
                usuario.getId(), StatusSolicitacao.PENDENTE)) {
            throw new IllegalArgumentException(
                "Você já possui uma solicitação pendente em análise."
            );
        }

        if (solicitacaoRepository.existsByUsuarioIdAndStatus(
                usuario.getId(), StatusSolicitacao.APROVADA)) {
            throw new IllegalArgumentException(
                "Você já foi aprovada como vendedora anteriormente."
            );
        }

        validarFormulario(dados);

        String cpfCnpj = normalizarCpfCnpj(dados.getCpfCnpj());

        if (solicitacaoRepository.existsByCpfCnpj(cpfCnpj)) {
            throw new IllegalArgumentException(
                "Este CPF/CNPJ já está vinculado a outra solicitação."
            );
        }

        SolicitacaoVendedora sol = new SolicitacaoVendedora();

        sol.setUsuario(usuario);
        sol.setNomeLoja(null);
        sol.setCpfCnpj(cpfCnpj);
        sol.setTelefone(trimOuNulo(dados.getTelefone()));
        sol.setCidade(trimOuNulo(dados.getCidade()));
        sol.setEstado(trimOuNulo(dados.getEstado()));
        sol.setCategoriaAtividade(
            trimOuNulo(dados.getCategoriaAtividade())
        );
        sol.setDescricaoAtividade(
            trimOuNulo(dados.getDescricaoAtividade())
        );
        sol.setStatus(StatusSolicitacao.PENDENTE);
        sol.setDataSolicitacao(LocalDateTime.now());

        return solicitacaoRepository.save(sol);
    }

    // CONSULTAR MINHA SOLICITACAO

    public SolicitacaoVendedora minhaSolicitacao(String username) {

        Usuario usuario = usuarioLogado(username);

        return solicitacaoRepository
            .findTopByUsuarioIdOrderByDataSolicitacaoDesc(
                usuario.getId()
            )
            .orElse(null);
    }

    // ADMINISTRACAO

    public List<SolicitacaoVendedora> listarPendentes() {
        return solicitacaoRepository
            .findByStatusOrderByDataSolicitacaoDesc(
                StatusSolicitacao.PENDENTE
            );
    }

    public List<SolicitacaoVendedora> listarAnalizadas() {
        return solicitacaoRepository
            .findByStatusNotOrderByDataAnaliseDesc(
                StatusSolicitacao.PENDENTE
            );
    }

    public SolicitacaoVendedora findById(Long id) {
        return solicitacaoRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("Solicitação não encontrada")
            );
    }

    // APROVAR VENDEDORA

    @Transactional
    public SolicitacaoVendedora aprovar(
            Long id,
            String adminUsername) {

        SolicitacaoVendedora sol = findById(id);

        if (sol.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new IllegalArgumentException(
                "Esta solicitação já foi analisada."
            );
        }

        Usuario admin = adminLogado(adminUsername);
        Usuario usuario = sol.getUsuario();
        LocalDateTime agora = LocalDateTime.now();

        // Concede o papel VENDEDORA sem criar loja
        concederPapelVendedora(usuario);

        usuario.setDataAtualizacao(agora);
        usuarioRepository.save(usuario);

        sol.setStatus(StatusSolicitacao.APROVADA);
        sol.setDataAnalise(agora);
        sol.setAdminResponsavel(admin);
        sol.setJustificativaRejeicao(null);

        SolicitacaoVendedora salvo =
            solicitacaoRepository.save(sol);

        try {
           emailService.enviarResultadoSolicitacao(
    usuario.getUsername(),
    true,
    null
            );
        } catch (Exception e) {
            // Falha de e-mail não impede a aprovação.
        }

        return salvo;
    }

    // REJEITAR SOLICITACAO

    @Transactional
    public SolicitacaoVendedora rejeitar(
            Long id,
            String adminUsername,
            String justificativa) {

        SolicitacaoVendedora sol = findById(id);

        if (sol.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new IllegalArgumentException(
                "Esta solicitação já foi analisada."
            );
        }

        if (justificativa == null ||
                justificativa.trim().isEmpty()) {
            throw new IllegalArgumentException(
                "Informe a justificativa da rejeição."
            );
        }

        Usuario admin = adminLogado(adminUsername);
        Usuario usuario = sol.getUsuario();
        LocalDateTime agora = LocalDateTime.now();

        sol.setStatus(StatusSolicitacao.REJEITADA);
        sol.setDataAnalise(agora);
        sol.setAdminResponsavel(admin);
        sol.setJustificativaRejeicao(justificativa.trim());

        SolicitacaoVendedora salvo =
            solicitacaoRepository.save(sol);

        try {
            emailService.enviarResultadoSolicitacao(
    usuario.getUsername(),
    false,
    justificativa.trim()
);
        } catch (Exception e) {
            // Falha de e-mail não impede a rejeição.
        }

        return salvo;
    }

    // METODOS AUXILIARES

    private void concederPapelVendedora(Usuario usuario) {

        String nivel = usuario.getNivelAcesso();

        if (nivel == null || nivel.trim().isEmpty()) {
            usuario.setNivelAcesso("USER,VENDEDORA");
            return;
        }

        if (!temPapel(usuario, "VENDEDORA")) {
            usuario.setNivelAcesso(
                nivel.trim() + ",VENDEDORA"
            );
        }
    }

    private boolean temPapel(Usuario usuario, String papel) {

        if (usuario.getNivelAcesso() == null) {
            return false;
        }

        return Arrays.stream(
                usuario.getNivelAcesso().split(",")
            )
            .map(String::trim)
            .anyMatch(papel::equalsIgnoreCase);
    }

    private Usuario adminLogado(String username) {

        Usuario admin = usuarioLogado(username);

        if (!temPapel(admin, "ADMIN")) {
            throw new RuntimeException(
                "Apenas administradores podem analisar solicitações."
            );
        }

        return admin;
    }

    private void validarFormulario(SolicitacaoVendedora dados) {

        if (dados == null) {
            throw new IllegalArgumentException(
                "Informe os dados da solicitação."
            );
        }

        if (dados.getCpfCnpj() == null ||
                dados.getCpfCnpj().trim().isEmpty()) {
            throw new IllegalArgumentException(
                "Informe o CPF ou CNPJ."
            );
        }

        String digitos = normalizarCpfCnpj(
            dados.getCpfCnpj()
        );

        if (digitos.length() != 11 &&
                digitos.length() != 14) {
            throw new IllegalArgumentException(
                "CPF deve ter 11 dígitos ou CNPJ 14 dígitos."
            );
        }
    }

    private String normalizarCpfCnpj(String valor) {
        return valor.replaceAll("[^0-9]", "");
    }

    private String trimOuNulo(String valor) {

        if (valor == null) {
            return null;
        }

        String texto = valor.trim();

        return texto.isEmpty() ? null : texto;
    }

    private Usuario usuarioLogado(String username) {
        return usuarioRepository.findByUsername(username)
            .orElseThrow(() ->
                new RuntimeException("Usuário não encontrado")
            );
    }
}
