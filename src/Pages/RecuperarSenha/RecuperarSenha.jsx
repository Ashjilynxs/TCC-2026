import styles from "./RecuperarSenha.module.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";

function RecuperarSenha () {
    return(
        <>
        <Navbar />
            <main className={styles.container}>
                <div className={styles.caixa}>
                    <div className={styles.cabecalho}>
                        <div className={styles.cabecalhoTitle}>
                            Recuperar senha
                        </div>
                        <div className={styles.cabecalhoText}>
                            <p>Informe seu e-mail e enviaremos instruções para redefinir sua senha.</p>
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
                    </div>

                    <div className={styles.botao}>
                        <button className={styles.entrar}>Enviar instruções</button>
                       
                            <Link to="/login" className={styles.cadastrar}>Lembrou a senha? Entre</Link>
                   
                    </div>
                </div>

            </main>
        </>
    );
}

export default RecuperarSenha