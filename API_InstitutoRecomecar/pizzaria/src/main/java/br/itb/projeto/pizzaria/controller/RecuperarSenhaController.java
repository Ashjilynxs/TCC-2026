package br.itb.projeto.pizzaria.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.pizzaria.dto.RedefinirSenhaDTO;
import br.itb.projeto.pizzaria.service.RecuperarSenhaService;

/* Recuperação de senha por LINK seguro (público - ver SecurityConfig).
 * As respostas são genéricas para não revelar se o e-mail existe. */
@RestController
@RequestMapping("/recuperar-senha")
public class RecuperarSenhaController {

    private final RecuperarSenhaService recuperarSenhaService;

    public RecuperarSenhaController(RecuperarSenhaService recuperarSenhaService) {
        this.recuperarSenhaService = recuperarSenhaService;
    }

    /* Envia o link seguro de redefinição (não revela conta inexistente) */
    @PostMapping("/solicitar-codigo")
    public ResponseEntity<?> solicitarCodigo(@RequestParam String email) {
        recuperarSenhaService.solicitarCodigo(email);
        return ResponseEntity.ok(Map.of("mensagem",
                "Se existir uma conta com este e-mail, enviaremos um link "
                        + "de recuperação. Verifique sua caixa de entrada."));
    }

    /* Valida o token do link antes de exibir o formulário de nova senha */
    @PostMapping("/validar-token")
    public ResponseEntity<?> validarToken(@RequestParam String token) {
        if (recuperarSenhaService.tokenValido(token)) {
            return ResponseEntity.ok(Map.of("valido", true));
        }
        return ResponseEntity.badRequest()
                .body(Map.of("erro", "Link inválido ou expirado."));
    }

    /* Cadastra a nova senha usando o token de uso único */
    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody RedefinirSenhaDTO dto) {
        try {
            recuperarSenhaService.redefinirSenha(dto.getToken(), dto.getNovaSenha());
            return ResponseEntity.ok(
                    Map.of("mensagem", "Senha redefinida com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }
}
