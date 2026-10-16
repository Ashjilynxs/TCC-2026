package br.itb.projeto.pizzaria.config;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/* Respostas de erro em JSON (evita erro 500 "genérico" para o frontend) */
@RestControllerAdvice
public class ApiExceptionHandler {

    private Map<String, String> corpo(String mensagem) {
        Map<String, String> mapa = new LinkedHashMap<>();
        mapa.put("erro", mensagem);
        return mapa;
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> runtime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(corpo(ex.getMessage()));
    }

    @ExceptionHandler({ DisabledException.class, BadCredentialsException.class })
    public ResponseEntity<Map<String, String>> autenticacao(Exception ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(corpo("Usuário ou senha inválidos"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> negado(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(corpo("Acesso negado"));
    }

}
