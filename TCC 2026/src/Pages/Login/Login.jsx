
import styles from "./Login.module.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const dados = new URLSearchParams();
      dados.append("username", email);
      dados.append("password", senha);

      const resposta = await fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: dados.toString(),
      });

      if (!resposta.ok) {
        let mensagemErro = "Email ou senha incorretos.";
        try {
          const corpo = await resposta.json();
          if (corpo.error) {
            mensagemErro = corpo.error;
          }
        } catch {

        }
        throw new Error(mensagemErro);
      }

      const respostaUsuario = await fetch(
        "http://localhost:8080/usuarios/me",
        {
          credentials: "include",
        }
      );

      if (!respostaUsuario.ok) {
        throw new Error("Não foi possível identificar seu perfil.");
      }

      const usuario = await respostaUsuario.json();
      const papeis = String(usuario.nivelAcesso || "")
        .split(",")
        .map((papel) => papel.trim().toUpperCase())
        .filter(Boolean);
      window.dispatchEvent(new Event("usuarioAtualizado"));

      if (papeis.includes("ADMIN")) {
        navigate("/adm", { replace: true });
      } else if (papeis.includes("PSICOLOGO")) {
        navigate("/psicologo", { replace: true });
      } else if (papeis.includes("VENDEDORA")) {
        navigate("/vendedora", { replace: true });
      } else if (papeis.includes("USER")) {
        navigate("/Logado", { replace: true });
      } else {
        setErro("Perfil de usuário não reconhecido.");
      }
    } catch (error) {
      setErro(error.message);
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
              Entrar
            </div>

            <div className={styles.cabecalhoText}>
              <p>Acesse sua conta para continuar sua jornada.</p>
            </div>
          </div>

          <form onSubmit={fazerLogin}>
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

              <div className={styles.campoSenha}>
                <h6>Senha</h6>

                <div className={styles.inputSenha}>
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite sua senha"
                    className={styles.input}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className={styles.botaoOlho}
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    aria-label={
                      mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    <i
                      className={`bi ${
                        mostrarSenha ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              <div className={styles.esqueci}>
                <Link to="/esquecerSenha">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            {erro && (
              <p role="alert" style={{ color: "red" }}>
                {erro}
              </p>
            )}

            <div className={styles.botao}>
              <button
                type="submit"
                className={styles.entrar}
                disabled={carregando}
              >
                {carregando ? "Entrando..." : "Entrar"}
              </button>

              <button
                type="button"
                className={styles.btnGoogle}
              >
                <i className="bi bi-google"></i>
                Continuar com Google
              </button>

              <Link
                to="/cadastrar"
                className={styles.cadastrar}
              >
                Não tem conta? Cadastre-se
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default Login;
