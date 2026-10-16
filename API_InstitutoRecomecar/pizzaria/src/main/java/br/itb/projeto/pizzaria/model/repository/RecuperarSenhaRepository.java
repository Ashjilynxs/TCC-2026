package br.itb.projeto.pizzaria.model.repository;

import br.itb.projeto.pizzaria.model.entity.RecuperarSenha;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecuperarSenhaRepository extends JpaRepository<RecuperarSenha, Long> {
    Optional<RecuperarSenha> findByEmailAndCodigoAndStatusCodigoTrue(String email, String codigo);

    /* Busca pelo token de uso único enviado no link (não pode ter sido usado) */
    Optional<RecuperarSenha> findByTokenAndStatusCodigoTrue(String token);

    /* Busca pelo token, qualquer que seja o status (para mensagens distintas) */
    Optional<RecuperarSenha> findByToken(String token);
}
