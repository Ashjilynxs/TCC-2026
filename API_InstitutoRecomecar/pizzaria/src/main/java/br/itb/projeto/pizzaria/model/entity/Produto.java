package br.itb.projeto.pizzaria.model.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
@JoinColumn(name = "vendedora_id", nullable = false)
private Usuario vendedora;

    @Column(name = "nome", nullable = false, length = 200)
    private String nome;

    @Column(name = "descricao", length = 2000)
    private String descricao;

    @Column(name = "categoria", length = 100)
    private String categoria;

    @Column(name = "preco", nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(name = "estoque", nullable = false)
    private int estoque;

    @Column(name = "prazoProducaoDias")
    private Integer prazoProducaoDias;

    /* Modalidades de entrega disponiveis, separadas por virgula:
     * RETIRADA_LOCAL, FRETE_GRATUITO, FRETE_FIXO, ENTREGA_COMBINAR */
    @Column(name = "modalidadesEntrega", length = 100)
    private String modalidadesEntrega;

    /* Valor do frete quando a modalidade FRETE_FIXO estiver habilitada */
    @Column(name = "valorFreteFixo", precision = 10, scale = 2)
    private BigDecimal valorFreteFixo;

    @Column(name = "imagemUrl", length = 500)
    private String imagemUrl;

    @Column(name = "status", nullable = false, length = 10)
    private String status = "ATIVO"; // ATIVO / INATIVO

    @Column(name = "dataCadastro", nullable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "dataAtualizacao")
    private LocalDateTime dataAtualizacao;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getVendedora() {
    return vendedora;
}

public void setVendedora(Usuario vendedora) {
    this.vendedora = vendedora;
}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    public int getEstoque() { return estoque; }
    public void setEstoque(int estoque) { this.estoque = estoque; }

    public Integer getPrazoProducaoDias() { return prazoProducaoDias; }
    public void setPrazoProducaoDias(Integer prazoProducaoDias) { this.prazoProducaoDias = prazoProducaoDias; }

    public String getModalidadesEntrega() { return modalidadesEntrega; }
    public void setModalidadesEntrega(String modalidadesEntrega) { this.modalidadesEntrega = modalidadesEntrega; }

    public BigDecimal getValorFreteFixo() { return valorFreteFixo; }
    public void setValorFreteFixo(BigDecimal valorFreteFixo) { this.valorFreteFixo = valorFreteFixo; }

    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }

    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }

}