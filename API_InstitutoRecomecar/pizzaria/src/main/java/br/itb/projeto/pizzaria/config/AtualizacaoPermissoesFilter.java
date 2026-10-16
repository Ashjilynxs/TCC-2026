package br.itb.projeto.pizzaria.config;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import br.itb.projeto.pizzaria.model.entity.Usuario;
import br.itb.projeto.pizzaria.model.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/* Recarrega os papéis (nivelAcesso) do banco a cada requisição.
 * Garante que a aprovação feita pelo admin valha imediatamente também
 * para sessões já abertas, sem exigir novo login, e que uma conta
 * inativada perca o acesso na hora. A autorização continua sendo
 * decidida pelo backend (Spring Security), nunca pelo frontend. */
@Component
public class AtualizacaoPermissoesFilter extends OncePerRequestFilter {

    private final UsuarioRepository usuarioRepository;

    public AtualizacaoPermissoesFilter(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null
                && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof String username
                && !"anonymousUser".equals(username)) {

            Usuario usuario = usuarioRepository
                    .findByUsername(username)
                    .orElse(null);

            if (usuario == null || !"ATIVO".equals(usuario.getStatusUsuario())) {
                /* Conta removida ou inativada: derruba a sessão atual */
                SecurityContextHolder.clearContext();
            } else {
                Set<GrantedAuthority> novos = new HashSet<>();
                for (String papel : papeis(usuario.getNivelAcesso())) {
                    novos.add(new SimpleGrantedAuthority("ROLE_" + papel));
                }

                Set<GrantedAuthority> antigos =
                        new HashSet<>(authentication.getAuthorities());

                if (!novos.equals(antigos)) {
                    UsernamePasswordAuthenticationToken atualizado =
                            new UsernamePasswordAuthenticationToken(
                                    authentication.getPrincipal(),
                                    authentication.getCredentials(),
                                    novos);
                    SecurityContextHolder.getContext()
                            .setAuthentication(atualizado);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String[] papeis(String nivelAcesso) {
        if (nivelAcesso == null || nivelAcesso.trim().isEmpty()) {
            return new String[] { "USER" };
        }
        return java.util.Arrays.stream(nivelAcesso.split(","))
                .map(String::trim)
                .filter(papel -> !papel.isEmpty())
                .toArray(String[]::new);
    }
}
