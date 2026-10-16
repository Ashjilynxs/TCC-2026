package br.itb.projeto.pizzaria.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.pizzaria.model.entity.Psicologo;
import br.itb.projeto.pizzaria.service.PsicologoService;

/* Apoio psicológico - cadastro de psicólogas, CRP e horários */
@RestController
@RequestMapping("/psicologos")
public class PsicologoController {

    private final PsicologoService psicologoService;

    public PsicologoController(PsicologoService psicologoService) {
        this.psicologoService = psicologoService;
    }

    /* ---- Psicóloga ---- */
    @PostMapping("/cadastro")
    public ResponseEntity<Psicologo> cadastrar(Authentication authentication,
            @RequestBody Psicologo psicologo) {
        Psicologo criado = psicologoService.cadastrar(authentication.getName(), psicologo);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping("/me")
    public Psicologo meuCadastro(Authentication authentication) {
        return psicologoService.meuCadastro(authentication.getName());
    }

    /* ---- Consulta (usuárias) ---- */
    @GetMapping
    public List<Psicologo> aprovados() {
        return psicologoService.aprovados();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Psicologo> findById(@PathVariable Long id) {
        return ResponseEntity.ok(psicologoService.findById(id));
    }

}
