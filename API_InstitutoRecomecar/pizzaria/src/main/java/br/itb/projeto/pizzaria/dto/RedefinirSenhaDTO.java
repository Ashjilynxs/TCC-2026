package br.itb.projeto.pizzaria.dto;

/* Corpo do POST /recuperar-senha/redefinir-senha.
 * token = token aleatório de uso único enviado no link por e-mail. */
public class RedefinirSenhaDTO {
    private String token;
    private String novaSenha;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNovaSenha() {
        return novaSenha;
    }

    public void setNovaSenha(String novaSenha) {
        this.novaSenha = novaSenha;
    }
}
