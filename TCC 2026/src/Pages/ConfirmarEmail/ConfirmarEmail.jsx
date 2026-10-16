import styles from "./ConfirmarEmail.module.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API = "http://localhost:8080";
const INTERVALO_REENVIO_SEGUNDOS = 60;
const PADRAO_CODIGO = /^\d{6}$/;

function ConfirmarEmail() {
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [codigo, setCodigo] = useState("");
  const [status, setStatus] = useState("inicial"); 
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  useEffect(() => {
    if (segundosRestantes <= 0) return;
    const timer = setInterval(
      () => setSegundosRestantes((s) => s - 1),
      1000
    );
    return () => clearInterval(timer);
  }, [segundosRestantes]);
  async function enviarCodigo() {
    if (!email.trim()) return;

    setCarregando(true);
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(
        `${API}/usuarios/confirmacao-email/enviar-codigo?email=${encodeURIComponent(
          email.trim()
        )}`,
        { method: "POST", headers: { Accept: "application/json" } }
      );

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível enviar o código.");
      }

      setStatus("digitando");
      setMensagem(
        dados.mensagem ||
          "Se existir uma conta pendente de confirmação, enviaremos um código de 6 dígitos."
      );
      setCodigo("");
      setSegundosRestantes(INTERVALO_REENVIO_SEGUNDOS);
    } catch (erroEnvio) {
      setErro(erroEnvio.message);
    } finally {
      setCarregando(false);
    }
  }

  async function enviarCodigoForm(e) {
    e.preventDefault();
    await enviarCodigo();
  }

  async function confirmar(e) {
    e.preventDefault();
    setErro("");

    if (!PADRAO_CODIGO.test(codigo)) {
      setErro("Digite o código de 6 dígitos recebido por e-mail.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(
        `${API}/usuarios/confirmacao-email/confirmar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: email.trim(), codigo }),
        }
      );

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        setErro(dados.erro || "Código inválido. Solicite um novo.");
        return;
      }

      setStatus("confirmado");
      setMensagem(dados.mensagem || "E-mail confirmado com sucesso.");
    } catch {
      setErro(
        "Não foi possível falar com o servidor. Verifique se a API está em execução."
      );
    } finally {
      setCarregando(false);
    }
  }

  function trocarEmail() {
    setStatus("inicial");
    setCodigo("");
    setErro("");
    setMensagem("");
    setSegundosRestantes(0);
  }

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.caixa}>
          <div className={styles.cabecalho}>
            <div className={styles.cabecalhoTitle}>Confirmação de e-mail</div>
            <div className={styles.cabecalhoText}>
              <p>
                {status === "confirmado"
                  ? "Sua conta está pronta."
                  : status === "digitando"
                  ? "Digite o código de 6 dígitos que enviamos para o seu e-mail."
                  : "Informe seu e-mail para receber o código de confirmação."}
              </p>
            </div>
          </div>

          {status === "confirmado" && (
            <div>
              <p style={{ color: "#18A957", fontWeight: "bold" }}>{mensagem}</p>
              <p style={{ color: "#4A2D6B" }}>
                Agora você já pode entrar com seu e-mail e senha.
              </p>
              <div className={styles.botao}>
                <Link to="/login" className={styles.entrar}>
                  Ir para o login
                </Link>
              </div>
            </div>
          )}

          {status === "inicial" && (
            <form onSubmit={enviarCodigoForm}>
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
                  {carregando ? "Enviando..." : "Enviar código"}
                </button>

                <Link to="/login" className={styles.cadastrar}>
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}

          {status === "digitando" && (
            <form onSubmit={confirmar}>
              <div className={styles.campos}>
                <div className={styles.campoEmail}>
                  <h6>Código de verificação</h6>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="000000"
                    className={styles.input}
                    style={{
                      textAlign: "center",
                      letterSpacing: "0.4em",
                      fontSize: "1.3rem",
                    }}
                    value={codigo}
                    onChange={(e) =>
                      setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    required
                  />
                  <p style={{ color: "#4A2D6B", fontSize: "0.85rem" }}>
                    Enviamos um código para <strong>{email}</strong>. Ele expira
                    em 10 minutos.
                  </p>
                </div>
              </div>

              {mensagem && <p style={{ color: "#4A2D6B" }}>{mensagem}</p>}
              {erro && (
                <p role="alert" style={{ color: "#c0392b" }}>
                  {erro}
                </p>
              )}

              <div className={styles.botao}>
                <button
                  type="submit"
                  className={styles.entrar}
                  disabled={carregando || codigo.length !== 6}
                >
                  {carregando ? "Confirmando..." : "Confirmar e-mail"}
                </button>

                <button
                  type="button"
                  className={styles.cadastrar}
                  onClick={enviarCodigo}
                  disabled={carregando || segundosRestantes > 0}
                >
                  {segundosRestantes > 0
                    ? `Reenviar código em ${segundosRestantes}s`
                    : "Reenviar código"}
                </button>

                <button
                  type="button"
                  className={styles.cadastrar}
                  onClick={trocarEmail}
                  disabled={carregando}
                >
                  Usar outro e-mail
                </button>

                <Link to="/login" className={styles.cadastrar}>
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

export default ConfirmarEmail;
