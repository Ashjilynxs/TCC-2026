package br.itb.projeto.pizzaria.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.pizzaria.dto.UsuarioDTO;
import br.itb.projeto.pizzaria.model.entity.Produto;
import br.itb.projeto.pizzaria.model.entity.Psicologo;
import br.itb.projeto.pizzaria.model.entity.SolicitacaoVendedora;
import br.itb.projeto.pizzaria.service.ProdutoService;
import br.itb.projeto.pizzaria.service.PsicologoService;
import br.itb.projeto.pizzaria.service.SolicitacaoVendedoraService;
import br.itb.projeto.pizzaria.service.UsuarioService;

import org.springframework.security.core.Authentication;

/* Ãrea administrativa - restrita a ROLE_ADMIN (ver SecurityConfig) */
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UsuarioService usuarioService;
    private final ProdutoService produtoService;
    private final PsicologoService psicologoService;
    private final SolicitacaoVendedoraService solicitacaoVendedoraService;

    public AdminController(UsuarioService usuarioService,
            ProdutoService produtoService,
            PsicologoService psicologoService,
            SolicitacaoVendedoraService solicitacaoVendedoraService) {
        this.usuarioService = usuarioService;
        this.produtoService = produtoService;
        this.psicologoService = psicologoService;
        this.solicitacaoVendedoraService = solicitacaoVendedoraService;
    }

    /* ================= USUÃRIAS ================= */
    @GetMapping("/usuarios")
    public List<UsuarioDTO> usuarios() {
        return usuarioService.findAll();
    }

    @PutMapping("/usuarios/{id}/ativar")
    public ResponseEntity<UsuarioDTO> ativarUsuario(@PathVariable Long id) {
        usuarioService.ativar(id);
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    @PutMapping("/usuarios/{id}/inativar")
    public ResponseEntity<UsuarioDTO> inativarUsuario(@PathVariable Long id) {
        usuarioService.inativar(id);
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    /* ================= SOLICITAÃ‡Ã•ES DE VENDEDORAS ================= */
    @GetMapping("/solicitacoes-vendedora/pendentes")
    public List<SolicitacaoVendedora> solicitacoesPendentes() {
        return solicitacaoVendedoraService.listarPendentes();
    }

    @GetMapping("/solicitacoes-vendedora/analizadas")
    public List<SolicitacaoVendedora> solicitacoesAnalizadas() {
        return solicitacaoVendedoraService.listarAnalizadas();
    }

    @PutMapping("/solicitacoes-vendedora/{id}/aprovar")
    public ResponseEntity<?> aprovarSolicitacao(
            @PathVariable Long id, Authentication authentication) {
        try {
            return ResponseEntity.ok(
                solicitacaoVendedoraService.aprovar(id, authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/solicitacoes-vendedora/{id}/rejeitar")
    public ResponseEntity<?> rejeitarSolicitacao(
            @PathVariable Long id,
            Authentication authentication,
            @RequestParam(required = false) String justificativa) {
        try {
            return ResponseEntity.ok(
                solicitacaoVendedoraService.rejeitar(
                    id, authentication.getName(), justificativa));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }

    /* ================= PRODUTOS ================= */
    @GetMapping("/produtos")
    public List<Produto> produtos() {
        return produtoService.listarTodos();
    }

    @PutMapping("/produtos/{id}/inativar")
    public ResponseEntity<Produto> inativarProduto(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.inativar(id));
    }

    @PutMapping("/produtos/{id}/ativar")
    public ResponseEntity<Produto> ativarProduto(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.ativar(id));
    }

    /* ================= PSICÃ“LOGAS (CRP) ================= */
    @GetMapping("/psicologos")
    public List<Psicologo> psicologos(@RequestParam(required = false) String status) {
        return psicologoService.listar(status);
    }

    @PutMapping("/psicologos/{id}/aprovar")
    public ResponseEntity<?> aprovarPsicologo(@PathVariable Long id,
            Authentication authentication) {
        try {
            return ResponseEntity.ok(
                psicologoService.aprovar(id, authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/psicologos/{id}/rejeitar")
    public ResponseEntity<?> rejeitarPsicologo(@PathVariable Long id,
            Authentication authentication,
            @RequestParam(required = false) String motivo) {
        try {
            return ResponseEntity.ok(
                psicologoService.rejeitar(id, authentication.getName(), motivo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }

}
