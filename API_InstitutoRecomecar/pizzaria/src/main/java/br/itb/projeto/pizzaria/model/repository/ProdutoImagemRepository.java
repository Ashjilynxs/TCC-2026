package br.itb.projeto.pizzaria.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.itb.projeto.pizzaria.model.entity.ProdutoImagem;

@Repository
public interface ProdutoImagemRepository extends JpaRepository<ProdutoImagem, Long> {

    List<ProdutoImagem> findByProdutoId(Long produtoId);

}
