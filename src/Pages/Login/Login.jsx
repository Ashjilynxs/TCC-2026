import styles from "./Login.module.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {

    const [mostrarSenha, setMostrarSenha] = useState(false);

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
                    <div className={styles.campos}>
                        <div className={styles.campoEmail}>
                            <h6>Email</h6>
                            <input
                                type="email"
                                placeholder="Digite seu email"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.campoSenha}>
                            <h6>Senha</h6>

                            <div className={styles.inputSenha}>
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    className={styles.input}/>

                                <button
                                    type="button"
                                    className={styles.botaoOlho}
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}>
                                    <i className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className={styles.esqueci}>
                            <Link to="/esquecerSenha">Esqueceu a senha?</Link>
                        </div>

                    </div>

                    <div className={styles.botao}>
                        <button className={styles.entrar}><Link to="/Logado">Entrar</Link></button>
                        <button
                            type="button"
                            className={styles.btnGoogle}
                            onClick={() => {
                                window.location.href =
                                    "http://localhost:8080/oauth2/authorization/google";}}>
                            <i className="bi bi-google"></i>
                            Continuar com Google
                        </button>
                       
                            <Link to="/cadastrar" className={styles.cadastrar}>Não tem conta? Cadastre-se</Link>
                   
                    </div>
                </div>

            </main>
        </>
    );
}

export default Login;