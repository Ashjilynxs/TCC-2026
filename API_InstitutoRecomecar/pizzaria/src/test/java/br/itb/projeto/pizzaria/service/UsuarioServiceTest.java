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
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.itb.projeto.pizzaria.model.entity.ConfirmacaoEmail;
import br.itb.projeto.pizzaria.model.entity.Usuario;
import br.itb.projeto.pizzaria.model.repository.ConfirmacaoEmailRepository;
import br.itb.projeto.pizzaria.model.repository.UsuarioRepository;

/* Testes do LOGIN (autenticação): papéis USER / VENDEDORA / ADMIN,
 * múltiplos papéis ("USER,VENDEDORA"), senha original e exigências
 * de status/e-mail. Não acessa banco de dados. */
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    /* Hash real do seed do banco — a senha original é "12345678". */
    private static final String SENHA_ORIGINAL = "12345678";
    private static final String HASH_GUARDADO_NO_BANCO =
            "$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi";

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ConfirmacaoEmailRepository confirmacaoEmailRepository;

    @Mock
    private JavaMailSender mailSender;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        usuarioService = new UsuarioService(
                usuarioRepository,
                passwordEncoder,
                confirmacaoEmailRepository,
                mailSender);
    }

    private Usuario contaAtiva(String nivelAcesso) {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Maria da Silva");
        usuario.setUsername("maria@email.com.br");
        usuario.setPassword(HASH_GUARDADO_NO_BANCO);
        usuario.setNivelAcesso(nivelAcesso);
        usuario.setStatusUsuario("ATIVO");
        usuario.setEmailConfirmado(Boolean.FALSE);
        return usuario;
    }

    private void usuarioExisteNoBanco(Usuario usuario) {
        when(usuarioRepository.findByUsername(usuario.getUsername()))
                .thenReturn(Optional.of(usuario));
    }

    private List<String> papeisDe(UserDetails details) {
        return details.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .sorted()
                .toList();
    }

    @Test
    void loginContaAntigaComPapelUser() {
        Usuario usuario = contaAtiva("USER");
        usuarioExisteNoBanco(usuario);

        UserDetails details = usuarioService
                .loadUserByUsername("maria@email.com.br");

        assertEquals(List.of("ROLE_USER"), papeisDe(details));
    }

    @Test
    void loginContaAntigaComPapelAdmin() {
        Usuario usuario = contaAtiva("ADMIN");
        usuarioExisteNoBanco(usuario);

        UserDetails details = usuarioService
                .loadUserByUsername("maria@email.com.br");

        assertEquals(List.of("ROLE_ADMIN"), papeisDe(details));
    }

    @Test
    void loginContaAntigaComPapelVendedora() {
        Usuario usuario = contaAtiva("VENDEDORA");
        usuarioExisteNoBanco(usuario);

        UserDetails details = usuarioService
                .loadUserByUsername("maria@email.com.br");

        assertEquals(List.of("ROLE_VENDEDORA"), papeisDe(details));
    }

    @Test
    void loginContaComMultiplosPapeisReconheceTodos() {
        Usuario usuario = contaAtiva("USER,VENDEDORA");
        usuarioExisteNoBanco(usuario);

        UserDetails details = usuarioService
                .loadUserByUsername("maria@email.com.br");

        /* Mantém ROLE_USER: a conta continua com acesso de compradora. */
        assertEquals(List.of("ROLE_USER", "ROLE_VENDEDORA"), papeisDe(details));
    }

    @Test
    void loginContaComMultiplosPapeisEComEspacoAposVirgula() {
        Usuario usuario = contaAtiva("ADMIN, USER");
        usuarioExisteNoBanco(usuario);

        UserDetails details = usuarioService
                .loadUserByUsername("maria@email.com.br");

        assertEquals(List.of("ROLE_ADMIN", "ROLE_USER"), papeisDe(details));
    }

    @Test
    void loginContaSemNivelAcessoUsaPapelPadraoUser() {
        Usuario usuario = contaAtiva(null);
        usuarioExisteNoBanco(usuario);

        UserDetails details = usuarioService
                .loadUserByUsername("maria@email.com.br");

        assertEquals(List.of("ROLE_USER"), papeisDe(details));
    }

    @Test
    void loginAceitaASenhaOriginalSemRedefinir() {
        Usuario usuario = contaAtiva("USER");
        usuarioExisteNoBanco(usuario);

        UserDetails details = usuarioService
                .loadUserByUsername("maria@email.com.br");

        /* O hash devolvido é exatamente o que está no banco e continua
         * validando a senha original (é assim que o DaoAuthenticationProvider
         * compara durante o POST /login). */
        assertEquals(HASH_GUARDADO_NO_BANCO, details.getPassword());
        assertTrue(passwordEncoder.matches(SENHA_ORIGINAL, details.getPassword()));
        assertFalse(passwordEncoder.matches("senha-errada", details.getPassword()));
    }

    @Test
    void loginNaoDependeDeEmailConfirmado() {
        /* Regra de negócio: emailConfirmado só é exigido para enviar a
         * solicitação de vendedora — NÃO bloqueia o login. */
        Usuario usuario = contaAtiva("USER");
        usuario.setEmailConfirmado(Boolean.FALSE);
        usuarioExisteNoBanco(usuario);

        UserDetails details = usuarioService
                .loadUserByUsername("maria@email.com.br");

        assertTrue(details.isEnabled());
        assertEquals(List.of("ROLE_USER"), papeisDe(details));
    }

    @Test
    void loginBloqueadoParaContaInativa() {
        Usuario usuario = contaAtiva("USER");
        usuario.setStatusUsuario("DESATIVO");
        usuarioExisteNoBanco(usuario);

        assertThrows(DisabledException.class, () -> usuarioService
                .loadUserByUsername("maria@email.com.br"));
    }

    @Test
    void loginComEmailInexistenteFalhaComUsernameNotFound() {
        when(usuarioRepository.findByUsername("nao@existe.com"))
                .thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> usuarioService
                .loadUserByUsername("nao@existe.com"));
    }

    /* ====== CONFIRMAÇÃO DE E-MAIL (código de 6 dígitos, uso único) ====== */

    @Test
    void loginBloqueadoParaContaAguardandoConfirmacaoDeEmail() {
        /* C1: contas novas nascem NAO_CONFIRMADO e só conseguem entrar
         * depois de confirmar o e-mail pelo código. Contas antigas
         * (ATIVO / DESATIVO) continuam funcionando normalmente. */
        Usuario usuario = contaAtiva("USER");
        usuario.setStatusUsuario("NAO_CONFIRMADO");
        usuarioExisteNoBanco(usuario);

        assertThrows(DisabledException.class, () -> usuarioService
                .loadUserByUsername("maria@email.com.br"));
    }

    private ConfirmacaoEmail codigoPendente(Usuario usuario, String codigo) {
        ConfirmacaoEmail registro = new ConfirmacaoEmail();
        registro.setEmail(usuario.getUsername());
        registro.setCodigo(codigo);
        registro.setGeradoEm(LocalDateTime.now());
        registro.setExpiraEm(LocalDateTime.now().plusMinutes(10));
        registro.setConfirmado(false);
        registro.setTentativas(0);
        return registro;
    }

    @Test
    void confirmarEmailComCodigoValidoConfirmaEAtivaConta() {
        Usuario usuario = contaAtiva("USER");
        usuario.setStatusUsuario("NAO_CONFIRMADO");
        usuario.setEmailConfirmado(Boolean.FALSE);
        usuarioExisteNoBanco(usuario);

        ConfirmacaoEmail registro = codigoPendente(usuario, "123456");

        when(confirmacaoEmailRepository
                .findTopByEmailOrderByGeradoEmDesc(usuario.getUsername()))
                .thenReturn(Optional.of(registro));
        when(confirmacaoEmailRepository.save(any())).thenReturn(registro);
        when(usuarioRepository.save(any())).thenReturn(usuario);

        usuarioService.confirmarEmailPorCodigo(usuario.getUsername(), "123456");

        assertTrue(usuario.getEmailConfirmado());
        assertEquals("ATIVO", usuario.getStatusUsuario());
        /* O código é marcado como usado — impede a reutilização */
        assertTrue(registro.isConfirmado());
    }

    @Test
    void confirmarEmailComCodigoIncorretoRegistraTentativa() {
        Usuario usuario = contaAtiva("USER");
        usuario.setEmailConfirmado(Boolean.FALSE);

        ConfirmacaoEmail registro = codigoPendente(usuario, "123456");

        when(confirmacaoEmailRepository
                .findTopByEmailOrderByGeradoEmDesc(usuario.getUsername()))
                .thenReturn(Optional.of(registro));
        when(confirmacaoEmailRepository.save(any())).thenReturn(registro);

        RuntimeException erro = assertThrows(RuntimeException.class,
                () -> usuarioService.confirmarEmailPorCodigo(
                        usuario.getUsername(), "654321"));

        assertTrue(erro.getMessage().contains("incorreto"));
        /* Conta uma tentativa e NÃO confirma a conta */
        assertEquals(1, registro.getTentativas());
        assertFalse(registro.isConfirmado());
        assertFalse(Boolean.TRUE.equals(usuario.getEmailConfirmado()));
    }

    @Test
    void confirmarEmailAlemDoLimiteDeTentativasFalhaECodigoFicaInvalido() {
        Usuario usuario = contaAtiva("USER");
        usuario.setEmailConfirmado(Boolean.FALSE);

        ConfirmacaoEmail registro = codigoPendente(usuario, "123456");
        registro.setTentativas(5);

        when(confirmacaoEmailRepository
                .findTopByEmailOrderByGeradoEmDesc(usuario.getUsername()))
                .thenReturn(Optional.of(registro));
        when(confirmacaoEmailRepository.save(any())).thenReturn(registro);

        RuntimeException erro = assertThrows(RuntimeException.class,
                () -> usuarioService.confirmarEmailPorCodigo(
                        usuario.getUsername(), "123456"));

        assertTrue(erro.getMessage().contains("máximo de tentativas"));
        assertFalse(registro.isConfirmado());
    }

    @Test
    void confirmarEmailComCodigoExpiradoFalha() {
        Usuario usuario = contaAtiva("USER");
        ConfirmacaoEmail registro = codigoPendente(usuario, "123456");
        registro.setExpiraEm(LocalDateTime.now().minusMinutes(1));

        when(confirmacaoEmailRepository
                .findTopByEmailOrderByGeradoEmDesc(usuario.getUsername()))
                .thenReturn(Optional.of(registro));

        RuntimeException erro = assertThrows(RuntimeException.class,
                () -> usuarioService.confirmarEmailPorCodigo(
                        usuario.getUsername(), "123456"));

        assertTrue(erro.getMessage().contains("expirado"));
        assertFalse(registro.isConfirmado());
    }

    @Test
    void confirmarEmailComCodigoJaUtilizadoFalha() {
        Usuario usuario = contaAtiva("USER");
        ConfirmacaoEmail registro = codigoPendente(usuario, "123456");
        registro.setConfirmado(true);

        when(confirmacaoEmailRepository
                .findTopByEmailOrderByGeradoEmDesc(usuario.getUsername()))
                .thenReturn(Optional.of(registro));

        RuntimeException erro = assertThrows(RuntimeException.class,
                () -> usuarioService.confirmarEmailPorCodigo(
                        usuario.getUsername(), "123456"));

        assertTrue(erro.getMessage().contains("já utilizado"));
    }

    @Test
    void confirmarEmailComCodigoDeOutraContaFalha() {
        /* O código pertence a um único e-mail: a validação busca o
         * registro pelo e-mail informado — o código de maria não
         * confirma a conta de outra pessoa. */
        when(confirmacaoEmailRepository
                .findTopByEmailOrderByGeradoEmDesc("outra@email.com"))
                .thenReturn(Optional.empty());

        RuntimeException erro = assertThrows(RuntimeException.class,
                () -> usuarioService.confirmarEmailPorCodigo(
                        "outra@email.com", "123456"));
        assertTrue(erro.getMessage().contains("inválido"));
    }

    @Test
    void confirmarEmailComCodigoDeMenosDeSeisDigitosFalha() {
        RuntimeException erro = assertThrows(RuntimeException.class,
                () -> usuarioService.confirmarEmailPorCodigo(
                        "maria@email.com.br", "12345"));
        assertTrue(erro.getMessage().contains("6 dígitos"));
    }

    @Test
    void enviarCodigoConfirmacaoEnviaCodigoDeSeisDigitosQueExpiraEm10Minutos() {
        Usuario usuario = contaAtiva("USER");
        usuario.setStatusUsuario("NAO_CONFIRMADO");
        usuario.setEmailConfirmado(Boolean.FALSE);
        usuarioExisteNoBanco(usuario);

        when(confirmacaoEmailRepository
                .findTopByEmailOrderByGeradoEmDesc(usuario.getUsername()))
                .thenReturn(Optional.empty());

        usuarioService.enviarCodigoConfirmacao(usuario.getUsername());

        ArgumentCaptor<ConfirmacaoEmail> registroCaptor =
                ArgumentCaptor.forClass(ConfirmacaoEmail.class);
        verify(confirmacaoEmailRepository).save(registroCaptor.capture());
        ConfirmacaoEmail registro = registroCaptor.getValue();

        /* Código de 6 dígitos com validade de 10 minutos */
        assertTrue(registro.getCodigo().matches("\\d{6}"));
        assertEquals(0, registro.getTentativas());
        assertFalse(registro.isConfirmado());
        assertTrue(registro.getExpiraEm()
                .isAfter(LocalDateTime.now().plusMinutes(9)));
        assertTrue(registro.getExpiraEm()
                .isBefore(LocalDateTime.now().plusMinutes(11)));

        /* O código segue apenas no e-mail — nunca em log ou resposta */
        ArgumentCaptor<SimpleMailMessage> emailCaptor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(emailCaptor.capture());
        assertEquals(usuario.getUsername(), emailCaptor.getValue().getTo()[0]);
        assertTrue(emailCaptor.getValue().getText()
                .contains(registro.getCodigo()));
    }

    @Test
    void enviarCodigoConfirmacaoRespeitaIntervaloMinimoDeReenvio() {
        Usuario usuario = contaAtiva("USER");
        usuario.setEmailConfirmado(Boolean.FALSE);
        usuarioExisteNoBanco(usuario);

        ConfirmacaoEmail registro = codigoPendente(usuario, "123456");

        when(confirmacaoEmailRepository
                .findTopByEmailOrderByGeradoEmDesc(usuario.getUsername()))
                .thenReturn(Optional.of(registro));

        usuarioService.enviarCodigoConfirmacao(usuario.getUsername());

        /* Reenvio dentro do intervalo de 60s: não grava novo código
         * nem envia novo e-mail */
        verify(confirmacaoEmailRepository, never()).save(any());
        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void enviarCodigoConfirmacaoParaEmailJaConfirmadoFalha() {
        Usuario usuario = contaAtiva("USER");
        usuario.setEmailConfirmado(Boolean.TRUE);
        usuarioExisteNoBanco(usuario);

        assertThrows(IllegalArgumentException.class,
                () -> usuarioService.enviarCodigoConfirmacao(
                        usuario.getUsername()));
        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }
}
