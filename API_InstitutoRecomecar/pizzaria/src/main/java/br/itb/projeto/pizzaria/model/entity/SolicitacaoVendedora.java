package br.itb.projeto.pizzaria.model.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/* Solicitação de uma compradora para se tornar vendedora.
 * Fluxo: PENDENTE -> APROVADA | REJEITADA */
@Entity
@Table(name = "SolicitacaoVendedora")
public class SolicitacaoVendedora {

    public enum StatusSolicitacao {
        PENDENTE, APROVADA, REJEITADA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    @JsonIgnoreProperties({ "password", "foto", "nivelAcesso", "dataCadastro", "dataAtualizacao", "statusUsuario" })
    private Usuario usuario;

    /* ================= DADOS DO FORMULÁRIO ================= */
    @Column(name = "nomeLoja", nullable = true, length = 200)
    private String nomeLoja;

    @Column(name = "cpfCnpj", nullable = false, length = 20)
    private String cpfCnpj;

    @Column(name = "telefone", length = 20)
    private String telefone;

    @Column(name = "cidade", length = 100)
    private String cidade;

    @Column(name = "estado", length = 50)
    private String estado;

    @Column(name = "categoriaAtividade", length = 100)
    private String categoriaAtividade;

    @Column(name = "descricaoAtividade", length = 2000)
    private String descricaoAtividade;

    /* ================= CONTROLE / ANÁLISE ================= */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StatusSolicitacao status = StatusSolicitacao.PENDENTE;

    @Column(name = "dataSolicitacao", nullable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "dataAnalise")
    private LocalDateTime dataAnalise;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "adminResponsavel_id")
    @JsonIgnoreProperties({ "password", "foto", "nivelAcesso", "dataCadastro", "dataAtualizacao", "statusUsuario" })
    private Usuario adminResponsavel;

    @Column(name = "justificativaRejeicao", length = 500)
    private String justificativaRejeicao;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getNomeLoja() { return nomeLoja; }
    public void setNomeLoja(String nomeLoja) { this.nomeLoja = nomeLoja; }

    public String getCpfCnpj() { return cpfCnpj; }
    public void setCpfCnpj(String cpfCnpj) { this.cpfCnpj = cpfCnpj; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCategoriaAtividade() { return categoriaAtividade; }
    public void setCategoriaAtividade(String categoriaAtividade) { this.categoriaAtividade = categoriaAtividade; }

    public String getDescricaoAtividade() { return descricaoAtividade; }
    public void setDescricaoAtividade(String descricaoAtividade) { this.descricaoAtividade = descricaoAtividade; }

    public StatusSolicitacao getStatus() { return status; }
    public void setStatus(StatusSolicitacao status) { this.status = status; }

    public LocalDateTime getDataSolicitacao() { return dataSolicitacao; }
    public void setDataSolicitacao(LocalDateTime dataSolicitacao) { this.dataSolicitacao = dataSolicitacao; }

    public LocalDateTime getDataAnalise() { return dataAnalise; }
    public void setDataAnalise(LocalDateTime dataAnalise) { this.dataAnalise = dataAnalise; }

    public Usuario getAdminResponsavel() { return adminResponsavel; }
    public void setAdminResponsavel(Usuario adminResponsavel) { this.adminResponsavel = adminResponsavel; }

    public String getJustificativaRejeicao() { return justificativaRejeicao; }
    public void setJustificativaRejeicao(String justificativaRejeicao) { this.justificativaRejeicao = justificativaRejeicao; }

}