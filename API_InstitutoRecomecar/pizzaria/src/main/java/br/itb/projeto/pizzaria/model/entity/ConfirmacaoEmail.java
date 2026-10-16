package br.itb.projeto.pizzaria.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/* Controla o código de confirmação de e-mail enviado à usuária.
 * Espelha o padrão da tabela RecuperarSenha já existente. */
@Entity
@Table(name = "ConfirmacaoEmail")
public class ConfirmacaoEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "codigo", nullable = false, length = 6)
    private String codigo;

    /* Token aleatório de uso único enviado por link no e-mail (B2).
     * Fica nulo apenas em registros antigos, anteriores a esta migração. */
    @Column(name = "token", length = 64)
    private String token;

    @Column(name = "geradoEm", nullable = false)
    private LocalDateTime geradoEm;

    @Column(name = "expiraEm", nullable = false)
    private LocalDateTime expiraEm;

    @Column(name = "confirmado", nullable = false)
    private boolean confirmado = false;

    /* Limite de tentativas de digitação do código (confirmação por
     * código de 6 dígitos). Registros antigos ficam com 0. */
    @Column(name = "tentativas", nullable = false)
    private int tentativas = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public LocalDateTime getGeradoEm() { return geradoEm; }
    public void setGeradoEm(LocalDateTime geradoEm) { this.geradoEm = geradoEm; }

    public LocalDateTime getExpiraEm() { return expiraEm; }
    public void setExpiraEm(LocalDateTime expiraEm) { this.expiraEm = expiraEm; }

    public boolean isConfirmado() { return confirmado; }
    public void setConfirmado(boolean confirmado) { this.confirmado = confirmado; }

    public int getTentativas() { return tentativas; }
    public void setTentativas(int tentativas) { this.tentativas = tentativas; }

}