package br.itb.projeto.pizzaria.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Psicologo")
public class Psicologo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "usuario_id", unique = true)
    private Usuario usuario;

    @Column(name = "crp", nullable = false, unique = true, length = 20)
    private String crp;

    @Column(name = "especialidade", length = 150)
    private String especialidade;

    @Column(name = "resumo", length = 2000)
    private String resumo;

    @Column(name = "statusCadastro", nullable = false, length = 20)
    private String statusCadastro = "PENDENTE"; // PENDENTE / APROVADO / REJEITADO

    @Column(name = "motivoRejeicao", length = 500)
    private String motivoRejeicao;

    @Column(name = "dataCadastro", nullable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "dataAprovacao")
    private LocalDateTime dataAprovacao;

    /* Data da decisão administrativa (aprovação ou recusa) */
    @Column(name = "dataDecisao")
    private LocalDateTime dataDecisao;

    /* Administrador responsável pela decisão (aprovou ou recusou) */
    @OneToOne
    @JoinColumn(name = "adminResponsavel_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "password", "foto" })
    private Usuario adminResponsavel;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getCrp() { return crp; }
    public void setCrp(String crp) { this.crp = crp; }

    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }

    public String getResumo() { return resumo; }
    public void setResumo(String resumo) { this.resumo = resumo; }

    public String getStatusCadastro() { return statusCadastro; }
    public void setStatusCadastro(String statusCadastro) { this.statusCadastro = statusCadastro; }

    public String getMotivoRejeicao() { return motivoRejeicao; }
    public void setMotivoRejeicao(String motivoRejeicao) { this.motivoRejeicao = motivoRejeicao; }

    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }

    public LocalDateTime getDataAprovacao() { return dataAprovacao; }
    public void setDataAprovacao(LocalDateTime dataAprovacao) { this.dataAprovacao = dataAprovacao; }

    public LocalDateTime getDataDecisao() { return dataDecisao; }
    public void setDataDecisao(LocalDateTime dataDecisao) { this.dataDecisao = dataDecisao; }

    public Usuario getAdminResponsavel() { return adminResponsavel; }
    public void setAdminResponsavel(Usuario adminResponsavel) { this.adminResponsavel = adminResponsavel; }

}
