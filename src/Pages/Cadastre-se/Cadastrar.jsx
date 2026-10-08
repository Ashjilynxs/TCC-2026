import styles from "./Cadastrar.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";

function Cadastrar() {
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
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
                            <p>Comece sua jornada com o Instituto Recomeçar.</p>
                        </div>
                    </div>
                    <div className={styles.campos}>
                        <div className={styles.campoEmail}>
                            <h6>Email</h6>
                            <input
                                type="email"
                                placeholder="Digite seu email"
                                className={styles.input} />
                        </div>

                        <div className={styles.campoSenha}>
                            <h6>Crie sua senha</h6>

                            <div className={styles.inputSenha}>
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    className={styles.input}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}/>

                                <button
                                    type="button"
                                    className={styles.botaoOlho}
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}>
                                    <i className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`}></i>
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
                                    onChange={(e) => setConfirmarSenha(e.target.value)}/>

                                <button
                                    type="button"
                                    className={styles.botaoOlho}
                                    onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                                    aria-label={mostrarConfirmacao ? "Ocultar senha" : "Mostrar senha"}>
                                    <i className={`bi ${mostrarConfirmacao ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </button>
                            </div>

                            {confirmarSenha && senha !== confirmarSenha && (
                                <p className={styles.erroSenha}>As senhas não coincidem.</p>)}
                        </div>

                    </div>

                    <div className={styles.botao}>
                        <button
                            type="button"
                            className={styles.entrar}
                            disabled={!senha || senha !== confirmarSenha}>
                            Criar conta
                        </button>

                    </div>
                </div>

            </main>
        </>
    );
}

export default Cadastrar