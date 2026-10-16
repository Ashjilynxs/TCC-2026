package br.itb.projeto.pizzaria.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

import java.util.Locale;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /* Sessões em memória: usadas para expirar as sessões abertas de uma
     * usuária quando ela redefine a senha pelo fluxo de recuperação. */
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            SessionRegistry sessionRegistry,
            AtualizacaoPermissoesFilter atualizacaoPermissoesFilter)
            throws Exception {

        http
            // ================= CSRF / CORS =================
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())

            // ================= AUTORIZAÇÃO =================
            .authorizeHttpRequests(auth -> auth
                // Área administrativa (somente ADMIN)
                .requestMatchers("/admin/**").hasRole("ADMIN")

                // Público (sem login)
                .requestMatchers(HttpMethod.POST, "/usuarios/create").permitAll()
                .requestMatchers("/login").permitAll()
                .requestMatchers("/recuperar-senha/**").permitAll()

                // Confirmação de e-mail (pública, como recuperação de senha)
                .requestMatchers(HttpMethod.POST,
                        "/usuarios/confirmacao-email/enviar-codigo",
                        "/usuarios/confirmacao-email/confirmar").permitAll()

                // Imagens estáticas de produtos (catálogo público)
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()

                // Catálogo público do marketplace
                .requestMatchers(HttpMethod.GET,
                        "/produtos", "/produtos/{id}",
                        "/produtos/{id}/imagens").permitAll()

                // Todo o resto exige login
                .anyRequest().authenticated()
            )

            // ================= SESSÕES =================
            // Registra as sessões no SessionRegistry (permite forçar novo
            // login após troca de senha) e mantém o comportamento padrão.
            .sessionManagement(session -> session
                .sessionConcurrency(concorrencia ->
                    concorrencia.sessionRegistry(sessionRegistry))
            )

            // Recarrega os papéis do banco a cada requisição: aprovações
            // do admin valem imediatamente, mesmo com sessões abertas.
            .addFilterBefore(atualizacaoPermissoesFilter, AuthorizationFilter.class)

            // ================= LOGIN =================
            // ================= ERROS DE AUTENTICAÇÃO =================
.exceptionHandling(ex -> ex
    .authenticationEntryPoint((request, response, authException) -> {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(
            "{\"error\":\"Usuário não autenticado\"}"
        );
    })
    .accessDeniedHandler((request, response, accessDeniedException) -> {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(
            "{\"error\":\"Acesso negado\"}"
        );
    })
)
            .formLogin(form -> form
                .loginProcessingUrl("/login")
                .successHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentType("application/json");
                    response.getWriter().write("""
                        {
                          "message": "Login realizado com sucesso"
                        }
                    """);
                })
                .failureHandler((request, response, exception) -> {
                    /* Conta recém-criada ainda sem confirmação de e-mail:
                     * devolve a mensagem específica para orientar a usuária */
                    if (exception instanceof org.springframework.security.authentication.DisabledException
                            && exception.getMessage() != null
                            && exception.getMessage().toLowerCase(Locale.ROOT).contains("e-mail")) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\": \""
                                + exception.getMessage().replace("\"", "'") + "\"}");
                        return;
                    }
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("""
                        {
                          "error": "Usuário ou senha inválidos"
                        }
                    """);
                })
            )

            // ================= LOGOUT =================
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentType("application/json");
                    response.getWriter().write("""
                        {
                          "message": "Logout realizado com sucesso"
                        }
                    """);
                })
            );

        return http.build();
    }

    // ================= PASSWORD ENCODER =================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}