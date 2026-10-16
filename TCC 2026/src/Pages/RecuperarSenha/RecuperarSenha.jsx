import styles from "./RecuperarSenha.module.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API = "http://localhost:8080";

/* Recuperação de senha:
 * - sem token: pede o e-mail e o backend envia um LINK seguro;
 * - com token (?token=... vindo do e-mail): cadastra a nova senha. */
function RecuperarSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [redefinida, setRedefinida] = useState(false);

  async function enviarEmail(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setCarregando(true);

    try {
      const resposta = await fetch(
        `${API}/recuperar-senha/solicitar-codigo?email=${encodeURIComponent(
          email.trim()
        )}`,
        { method: "POST", headers: { Accept: "application/json" } }
      );

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível enviar o e-mail.");
      }

      /* O backend responde sempre de forma genérica,
       * para não revelar se o e-mail está cadastrado. */
      setMensagem(
        dados.mensagem ||
          "Se existir uma conta com este e-mail, enviaremos um link de recuperação."
      );
      setEnviado(true);
    } catch (erroEnvio) {
      setErro(erroEnvio.message);
    } finally {
      setCarregando(false);
    }
  }

  async function redefinirSenha(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`${API}/recuperar-senha/redefinir-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token, novaSenha }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.erro ||
            "Não foi possível redefinir a senha. Solicite um novo link."
        );
      }

      setMensagem(dados.mensagem || "Senha redefinida com sucesso.");
      setRedefinida(true);
    } catch (erroRedefinicao) {
      setErro(erroRedefinicao.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.caixa}>
          <div className={styles.cabecalho}>
            <div className={styles.cabecalhoTitle}>
              {token ? "Cadastrar nova senha" : "Recuperar senha"}
            </div>
            <div className={styles.cabecalhoText}>
              <p>
                {token
                  ? "Informe uma nova senha para a sua conta. O link é de uso único."
                  : "Informe seu e-mail e enviaremos um link seguro para redefinir sua senha."}
              </p>
            </div>
          </div>

          {/* -------- Etapa: redefinir senha (token no link) -------- */}
          {token && !redefinida && (
            <form onSubmit={redefinirSenha}>
              <div className={styles.campos}>
                <div className={styles.campoSenha}>
                  <h6>Nova senha</h6>
                  <input
                    type="password"
                    placeholder="Digite a nova senha (mínimo 8 caracteres)"
                    className={styles.input}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.campoSenha}>
                  <h6>Confirmar nova senha</h6>
                  <input
                    type="password"
                    placeholder="Repita a nova senha"
                    className={styles.input}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />
                </div>
              </div>

              {erro && (
                <p role="alert" style={{ color: "#c0392b" }}>
                  {erro}
                </p>
              )}

              <div className={styles.botao}>
                <button
                  type="submit"
                  className={styles.entrar}
                  disabled={carregando}
                >
                  {carregando ? "Salvando..." : "Salvar nova senha"}
                </button>
              </div>
            </form>
          )}

          {/* -------- Sucesso na redefinição -------- */}
          {token && redefinida && (
            <div>
              <p style={{ color: "#4A2D6B" }}>{mensagem}</p>
              <p style={{ color: "#4A2D6B" }}>
                Por segurança, todas as sessões abertas foram encerradas.
                Entre com a nova senha.
              </p>
              <div className={styles.botao}>
                <Link to="/login" className={styles.entrar}>
                  Ir para o login
                </Link>
              </div>
            </div>
          )}

          {/* -------- Etapa: pedir o e-mail -------- */}
          {!token && !enviado && (
            <form onSubmit={enviarEmail}>
              <div className={styles.campos}>
                <div className={styles.campoEmail}>
                  <h6>Email</h6>
                  <input
                    type="email"
                    placeholder="Digite seu email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {erro && (
                <p role="alert" style={{ color: "#c0392b" }}>
                  {erro}
                </p>
              )}

              <div className={styles.botao}>
                <button
                  type="submit"
                  className={styles.entrar}
                  disabled={carregando || !email.trim()}
                >
                  {carregando ? "Enviando..." : "Enviar instruções"}
                </button>

                <Link to="/login" className={styles.cadastrar}>
                  Lembrou a senha? Entre
                </Link>
              </div>
            </form>
          )}

          {/* -------- Confirmação de envio -------- */}
          {!token && enviado && (
            <div>
              <p style={{ color: "#4A2D6B" }}>{mensagem}</p>
              <p style={{ color: "#4A2D6B" }}>
                O link expira em 15 minutos e só pode ser usado uma vez.
              </p>
              <div className={styles.botao}>
                <Link to="/login" className={styles.entrar}>
                  Voltar para o login
                </Link>
                <button
                  type="button"
                  className={styles.cadastrar}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => {
                    setEnviado(false);
                    setMensagem("");
                  }}
                >
                  Usar outro e-mail
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default RecuperarSenha;