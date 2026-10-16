
import styles from "./Cadastrar.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";

function Cadastrar() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function criarConta(e) {
        e.preventDefault();
        setErro("");

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setCarregando(true);

        try {
            const resposta = await fetch(
                "http://localhost:8080/usuarios/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome: nome.trim(),
                        username: email.trim(),
                        password: senha,
                    }),
                }
            );

            if (!resposta.ok) {
                let mensagemErro =
                    "Não foi possível criar a conta. Verifique os dados informados.";
                try {
                    const corpo = await resposta.json();
                    if (corpo.erro) {
                        mensagemErro = corpo.erro;
                    }
                } catch {
                    /* resposta sem JSON: mantém a mensagem padrão */
                }
                console.error("Erro no cadastro:", mensagemErro);
                throw new Error(mensagemErro);
            }

            /* Redireciona para a página de confirmação de e-mail:
             * a conta só poderá ser usada após digitar o código
             * de 6 dígitos recebido por e-mail. */
            navigate(
                "/confirmar-email?email=" + encodeURIComponent(email.trim())
            );
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
                            Cadastrar-se
                        </div>

                        <div className={styles.cabecalhoText}>
                            <p>
                                Comece sua jornada com o Instituto Recomeçar.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={criarConta}>
                        <div className={styles.campos}>

                            <div className={styles.campoEmail}>
                                <h6>Nome completo</h6>
                                <input
                                    type="text"
                                    placeholder="Digite seu nome"
                                    className={styles.input}
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>

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
                                <h6>Crie sua senha</h6>

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
                                            className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"
                                                }`}
                                        ></i>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.campoSenha}>
                                <h6>Confirmar senha</h6>

                                <div className={styles.inputSenha}>
                                    <input
                                        type={mostrarConfirmacao ? "text" : "password"}
                                        placeholder="Confirme sua senha"
                                        className={styles.input}
                                        value={confirmarSenha}
                                        onChange={(e) =>
                                            setConfirmarSenha(e.target.value)
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        className={styles.botaoOlho}
                                        onClick={() =>
                                            setMostrarConfirmacao(!mostrarConfirmacao)
                                        }
                                        aria-label={
                                            mostrarConfirmacao
                                                ? "Ocultar senha"
                                                : "Mostrar senha"
                                        }
                                    >
                                        <i
                                            className={`bi ${mostrarConfirmacao
                                                    ? "bi-eye-slash"
                                                    : "bi-eye"
                                                }`}
                                        ></i>
                                    </button>
                                </div>

                                {confirmarSenha && senha !== confirmarSenha && (
                                    <p className={styles.erroSenha}>
                                        As senhas não coincidem.
                                    </p>
                                )}
                            </div>
                        </div>

                        {erro && (
                            <p className={styles.erroSenha}>{erro}</p>
                        )}

                        <div className={styles.botao}>
                            <button
                                type="submit"
                                className={styles.entrar}
                                disabled={
                                    carregando ||
                                    !nome.trim() ||
                                    !email.trim() ||
                                    !senha ||
                                    senha !== confirmarSenha
                                }
                            >
                                {carregando ? "Cadastrando..." : "Criar conta"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

export default Cadastrar;
