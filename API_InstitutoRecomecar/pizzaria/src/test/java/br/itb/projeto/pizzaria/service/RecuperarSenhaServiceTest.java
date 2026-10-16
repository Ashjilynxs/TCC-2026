package br.itb.projeto.pizzaria.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.itb.projeto.pizzaria.model.entity.RecuperarSenha;
import br.itb.projeto.pizzaria.model.entity.Usuario;
import br.itb.projeto.pizzaria.model.repository.RecuperarSenhaRepository;
import br.itb.projeto.pizzaria.model.repository.UsuarioRepository;

/* Testes da RECUPERAÇÃO DE SENHA: token de uso único, validade,
 * não revelação de conta inexistente e gravação com BCrypt.
 * Não acessa banco de dados. */
@ExtendWith(MockitoExtension.class)
class RecuperarSenhaServiceTest {

    @Mock
    private RecuperarSenhaRepository recuperarSenhaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private SessaoService sessaoService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private RecuperarSenhaService recuperarSenhaService;

    @BeforeEach
    void setUp() {
        recuperarSenhaService = new RecuperarSenhaService(
                recuperarSenhaRepository,
                usuarioRepository,
                mailSender,
                passwordEncoder,
                sessaoService);
    }

    private Usuario usuario(String email) {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Maria da Silva");
        usuario.setUsername(email);
        usuario.setPassword(passwordEncoder.encode("12345678"));
        usuario.setNivelAcesso("USER");
        usuario.setStatusUsuario("ATIVO");
        return usuario;
    }

    private RecuperarSenha registroAtivo(String token, String email) {
        RecuperarSenha registro = new RecuperarSenha();
        registro.setEmail(email);
        registro.setCodigo("123456");
        registro.setToken(token);
        registro.setGeradoEm(LocalDateTime.now());
        registro.setExpiraEm(LocalDateTime.now().plusMinutes(15));
        registro.setStatusCodigo(true);
        return registro;
    }

    @Test
    void solicitarRecuperacaoParaEmailInexistenteNaoLancaErroNaoEnviaNada() {
        when(usuarioRepository.findByUsername("nao@existe.com"))
                .thenReturn(Optional.empty());

        /* Não lança exceção e não envia e-mail: a resposta é a mesma
         * de uma conta existente (não revela se a conta existe). */
        recuperarSenhaService.solicitarCodigo("nao@existe.com");

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
        verify(recuperarSenhaRepository, never()).save(any());
    }

    @Test
    void solicitarRecuperacaoParaEmailExistenteGeraTokenEUmicoEEnviaLink() {
        Usuario usuario = usuario("maria@email.com.br");
        when(usuarioRepository.findByUsername("maria@email.com.br"))
                .thenReturn(Optional.of(usuario));
        when(recuperarSenhaRepository.save(any()))
                .thenAnswer(invocacao -> invocacao.getArgument(0));

        recuperarSenhaService.solicitarCodigo("maria@email.com.br");

        verify(recuperarSenhaRepository).save(any());
        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void redefinirSenhaComTokenValidoGravaHashECancelaOToken() {
        Usuario usuario = usuario("maria@email.com.br");
        RecuperarSenha registro = registroAtivo("token-valido", usuario.getUsername());

        when(recuperarSenhaRepository
                .findByTokenAndStatusCodigoTrue("token-valido"))
                .thenReturn(Optional.of(registro));
        when(usuarioRepository.findByUsername(usuario.getUsername()))
                .thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any())).thenReturn(usuario);
        when(recuperarSenhaRepository.save(any())).thenReturn(registro);

        recuperarSenhaService.redefinirSenha("token-valido", "NovaSenha123");

        /* Senha gravada com BCrypt e diferente da original */
        assertTrue(passwordEncoder.matches("NovaSenha123", usuario.getPassword()));
        /* Token invalidado: impede a reutilização */
        assertFalse(registro.isStatusCodigo());
        /* Sessões abertas da usuária são invalidadas */
        verify(sessaoService).expirarSessoes(usuario.getUsername());
    }

    @Test
    void redefinirSenhaComTokenJaUtilizadoFalha() {
        RecuperarSenha registro = registroAtivo("token-usado", "maria@email.com.br");
        registro.setStatusCodigo(false);

        when(recuperarSenhaRepository
                .findByTokenAndStatusCodigoTrue("token-usado"))
                .thenReturn(Optional.empty());

        RuntimeException erro = assertThrows(RuntimeException.class,
                () -> recuperarSenhaService.redefinirSenha("token-usado", "NovaSenha123"));
        assertTrue(erro.getMessage().contains("Solicite um novo"));
    }

    @Test
    void redefinirSenhaComTokenExpiradoFalha() {
        RecuperarSenha registro = registroAtivo("token-expirado", "maria@email.com.br");
        registro.setExpiraEm(LocalDateTime.now().minusMinutes(1));

        when(recuperarSenhaRepository
                .findByTokenAndStatusCodigoTrue("token-expirado"))
                .thenReturn(Optional.of(registro));

        RuntimeException erro = assertThrows(RuntimeException.class,
                () -> recuperarSenhaService.redefinirSenha("token-expirado", "NovaSenha123"));
        assertTrue(erro.getMessage().contains("expirado"));
    }

    @Test
    void redefinirSenhaComSenhaCurtaFalha() {
        RecuperarSenha registro = registroAtivo("token-valido", "maria@email.com.br");

        when(recuperarSenhaRepository
                .findByTokenAndStatusCodigoTrue("token-valido"))
                .thenReturn(Optional.of(registro));

        IllegalArgumentException erro = assertThrows(IllegalArgumentException.class,
                () -> recuperarSenhaService.redefinirSenha("token-valido", "123"));
        assertTrue(erro.getMessage().contains("8 caracteres"));
    }

    @Test
    void tokenValidoRefleteStatusDoBanco() {
        when(recuperarSenhaRepository
                .findByTokenAndStatusCodigoTrue("bom-token"))
                .thenReturn(Optional.of(registroAtivo("bom-token", "maria@email.com.br")));
        when(recuperarSenhaRepository
                .findByTokenAndStatusCodigoTrue("ruim-token"))
                .thenReturn(Optional.empty());

        assertTrue(recuperarSenhaService.tokenValido("bom-token"));
        assertFalse(recuperarSenhaService.tokenValido("ruim-token"));
        assertFalse(recuperarSenhaService.tokenValido(" "));
    }

    @Test
    void novaSenhaEGravadaComBCrypt() {
        Usuario usuario = usuario("maria@email.com.br");
        RecuperarSenha registro = registroAtivo("token-valido", usuario.getUsername());

        when(recuperarSenhaRepository
                .findByTokenAndStatusCodigoTrue("token-valido"))
                .thenReturn(Optional.of(registro));
        when(usuarioRepository.findByUsername(usuario.getUsername()))
                .thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any())).thenReturn(usuario);
        when(recuperarSenhaRepository.save(any())).thenReturn(registro);

        String senhaAntes = usuario.getPassword();
        recuperarSenhaService.redefinirSenha("token-valido", "OutraSenha123");

        assertEquals(60, usuario.getPassword().length());
        assertFalse(usuario.getPassword().equals(senhaAntes));
        assertFalse(passwordEncoder.matches("12345678", usuario.getPassword()));
    }
}