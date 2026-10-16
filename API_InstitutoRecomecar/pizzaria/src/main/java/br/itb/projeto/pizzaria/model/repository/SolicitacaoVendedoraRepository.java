package br.itb.projeto.pizzaria.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.itb.projeto.pizzaria.model.entity.SolicitacaoVendedora;
import br.itb.projeto.pizzaria.model.entity.SolicitacaoVendedora.StatusSolicitacao;

@Repository
public interface SolicitacaoVendedoraRepository
        extends JpaRepository<SolicitacaoVendedora, Long> {

    boolean existsByUsuarioIdAndStatus(Long usuarioId, StatusSolicitacao status);

    Optional<SolicitacaoVendedora> findTopByUsuarioIdOrderByDataSolicitacaoDesc(Long usuarioId);

    boolean existsByCpfCnpj(String cpfCnpj);

    List<SolicitacaoVendedora> findByStatusOrderByDataSolicitacaoDesc(StatusSolicitacao status);

    List<SolicitacaoVendedora> findByStatusNotOrderByDataAnaliseDesc(StatusSolicitacao status);

}