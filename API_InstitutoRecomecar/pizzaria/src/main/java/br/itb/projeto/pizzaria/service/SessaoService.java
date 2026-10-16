package br.itb.projeto.pizzaria.service;

import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.InteractiveAuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpSession;

/* Controla as sessões em memória: registra a sessão no login e permite
 * invalidar todas as sessões abertas de uma usuária (ex.: depois que ela
 * redefine a senha pelo fluxo de recuperação). */
@Service
public class SessaoService {

    private final SessionRegistry sessionRegistry;

    public SessaoService(SessionRegistry sessionRegistry) {
        this.sessionRegistry = sessionRegistry;
    }

    /* Registra a sessão criada no login no SessionRegistry */
    @EventListener
    public void aoEntrar(InteractiveAuthenticationSuccessEvent evento) {

        Authentication authentication = evento.getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal() instanceof String)) {
            return;
        }

        var attributes = RequestContextHolder.getRequestAttributes();

        if (attributes instanceof ServletRequestAttributes servletAttributes) {
            HttpSession sessao = servletAttributes.getRequest().getSession(false);
            if (sessao != null) {
                sessionRegistry.registerNewSession(
                        sessao.getId(), authentication.getPrincipal());
            }
        }
    }

    /* Invalida todas as sessões abertas da usuária (força novo login) */
    public void expirarSessoes(String username) {

        List<Object> principais = sessionRegistry.getAllPrincipals();

        for (Object principal : principais) {
            if (principal instanceof String nome
                    && nome.equalsIgnoreCase(username)) {
                sessionRegistry.getAllSessions(principal, false)
                        .forEach(sessao -> sessao.expireNow());
            }
        }
    }
}
