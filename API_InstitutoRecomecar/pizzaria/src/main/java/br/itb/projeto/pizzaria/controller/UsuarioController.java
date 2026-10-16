package br.itb.projeto.pizzaria.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.itb.projeto.pizzaria.dto.UsuarioDTO;
import br.itb.projeto.pizzaria.model.entity.Usuario;
import br.itb.projeto.pizzaria.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Usuario usuario) {
        try {
            Usuario createdUsuario = usuarioService.create(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUsuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("erro", e.getMessage()));
        }
    }

    /* Dados da usuária logada */
    @GetMapping("/me")
    public UsuarioDTO me(Authentication authentication) {
        return usuarioService.findByUsername(authentication);
    }

    /* Status de confirmação do e-mail da usuária logada */
    @GetMapping("/confirmacao-email/status")
    public java.util.Map<String, Object> statusConfirmacao(Authentication authentication) {
        boolean confirmado = usuarioService.isEmailConfirmado(authentication);
        return java.util.Map.of("confirmado", confirmado);
    }

    /* (Re)enviar o CÓDIGO de confirmação de e-mail — público.
     * Resposta sempre genérica: não revela se o e-mail existe. */
    @PostMapping("/confirmacao-email/enviar-codigo")
    public ResponseEntity<?> enviarCodigoConfirmacao(@RequestParam String email) {
        try {
            usuarioService.enviarCodigoConfirmacao(email);
        } catch (RuntimeException e) {
            /* Silencia o erro para não expor contas cadastradas */
        }
        return ResponseEntity.ok(java.util.Map.of("mensagem",
                "Se existir uma conta pendente de confirmação, enviaremos "
                        + "um código de 6 dígitos para o e-mail informado."));
    }

    /* Confirmar o e-mail com o CÓDIGO de 6 dígitos — público.
     * Mensagens distintas: incorreto / expirado / já utilizado. */
    @PostMapping("/confirmacao-email/confirmar")
    public ResponseEntity<?> confirmarEmail(Authentication authentication,
            @RequestBody ConfirmarCodigoRequest dados) {

        /* Um usuário já autenticado nunca confirma o e-mail de outra
         * conta: o e-mail informado precisa ser o dele. No fluxo normal
         * (conta recém-criada) não há sessão e a regra não se aplica.
         * getName() funciona para principal String e UserDetails. */
        if (authentication != null && authentication.isAuthenticated()) {
            String nome = authentication.getName();
            if (nome != null && !"anonymousUser".equals(nome)
                    && dados != null && dados.email() != null
                    && !nome.equalsIgnoreCase(dados.email().trim())) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                        "erro", "Não é possível confirmar o e-mail de outra conta."));
            }
        }

        try {
            usuarioService.confirmarEmailPorCodigo(dados.email(), dados.codigo());
            return ResponseEntity.ok(
                    java.util.Map.of("mensagem", "E-mail confirmado com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("erro", e.getMessage()));
        }
    }

    public record ConfirmarCodigoRequest(String email, String codigo) {}

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    /* Editar o próprio perfil (nome e foto) */
    @PutMapping(
            value = "/me",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UsuarioDTO> editar(
            Authentication authentication,
            @RequestPart(required = false) MultipartFile file,
            @RequestPart Usuario usuario) {

        Long id = usuarioService.findByUsername(authentication).getId();
        usuarioService.editar(file, id, usuario);
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    /* Alterar a própria senha */
    @PutMapping("/me/alterar-senha")
    public ResponseEntity<?> alterarSenha(
            Authentication authentication,
            @RequestBody AlterarSenhaRequest dados) {

        try {
            usuarioService.alterarSenha(
                    authentication,
                    dados.senhaAtual(),
                    dados.novaSenha()
            );

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "mensagem", "Senha alterada com sucesso"
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("erro", e.getMessage())
            );
        }
    }

    public record AlterarSenhaRequest(
            String senhaAtual,
            String novaSenha
    ) {}

    @GetMapping("/me/foto")
    public ResponseEntity<byte[]> buscarFoto(
            Authentication authentication) {

        byte[] foto = usuarioService.buscarFoto(authentication);

        if (foto == null || foto.length == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(foto);
    }

}