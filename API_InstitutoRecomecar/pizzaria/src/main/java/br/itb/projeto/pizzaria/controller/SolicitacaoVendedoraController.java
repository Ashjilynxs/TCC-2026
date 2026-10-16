package br.itb.projeto.pizzaria.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.pizzaria.model.entity.SolicitacaoVendedora;
import br.itb.projeto.pizzaria.service.SolicitacaoVendedoraService;

/* Fluxo da compradora: enviar e acompanhar a solicitação para empreender.
 * A análise (aprovar/rejeitar) fica em AdminController (ROLE_ADMIN). */
@RestController
@RequestMapping("/solicitacoes-vendedora")
public class SolicitacaoVendedoraController {

    private final SolicitacaoVendedoraService solicitacaoService;

    public SolicitacaoVendedoraController(
            SolicitacaoVendedoraService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    /* Enviar nova solicitação (compradora autenticada) */
    @PostMapping
    public ResponseEntity<?> enviar(Authentication authentication,
            @RequestBody SolicitacaoVendedora dados) {
        try {
            SolicitacaoVendedora criada =
                    solicitacaoService.solicitar(authentication.getName(), dados);
            return ResponseEntity.status(HttpStatus.CREATED).body(criada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("erro", e.getMessage()));
        }
    }

    /* Consultar a própria solicitação (última) */
    @GetMapping("/minha")
    public ResponseEntity<?> minha(Authentication authentication) {
        SolicitacaoVendedora sol =
                solicitacaoService.minhaSolicitacao(authentication.getName());
        if (sol == null) {
            return ResponseEntity.ok(java.util.Map.of("existe", false));
        }
        return ResponseEntity.ok(sol);
    }

}