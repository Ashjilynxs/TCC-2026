package br.itb.projeto.pizzaria.model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.itb.projeto.pizzaria.model.entity.ConfirmacaoEmail;

@Repository
public interface ConfirmacaoEmailRepository extends JpaRepository<ConfirmacaoEmail, Long> {

    /* Código mais recente enviado para um e-mail (é sempre o único
     * considerado na validação — códigos antigos deixam de valer). */
    Optional<ConfirmacaoEmail> findTopByEmailOrderByGeradoEmDesc(String email);

}