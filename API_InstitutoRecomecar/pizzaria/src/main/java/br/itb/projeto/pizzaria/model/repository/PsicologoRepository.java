package br.itb.projeto.pizzaria.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.itb.projeto.pizzaria.model.entity.Psicologo;

@Repository
public interface PsicologoRepository extends JpaRepository<Psicologo, Long> {

    Optional<Psicologo> findByUsuarioId(Long usuarioId);

    List<Psicologo> findByStatusCadastro(String statusCadastro);

    boolean existsByCrp(String crp);

}
