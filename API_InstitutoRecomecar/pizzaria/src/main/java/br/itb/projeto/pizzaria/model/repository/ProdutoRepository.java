package br.itb.projeto.pizzaria.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.itb.projeto.pizzaria.model.entity.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByStatusOrderByDataCadastroDesc(String status);

    List<Produto> findByVendedoraId(Long vendedoraId);

    List<Produto> findByVendedoraIdAndStatus(
        Long vendedoraId,
        String status
    );
}