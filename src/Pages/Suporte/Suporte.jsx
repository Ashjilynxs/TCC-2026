import styles from "./Suporte.module.css";
import Sidebar from "../../Components/Sidebar/Sidebar";

function Suporte() {
    return (
        <>
        <Sidebar />
        <main className={styles.pagina}>
            <section className={styles.container}>
                <header className={styles.cabecalho}>
                    <h1>Suporte e canais de contato</h1>

                    <p>
                        Estamos aqui para ajudar você em sua jornada.
                        Escolha a melhor forma de falar conosco.
                    </p>
                </header>

                <section className={styles.cards}>
                    <article className={styles.card}>
                        <div className={styles.icone}>
                            <i className="bi bi-envelope"></i>
                        </div>

                        <h2>E-mail de Suporte</h2>

                        <p>
                            Envie suas dúvidas e
                            <br />
                            responderemos em até 24h.
                        </p>

                        <a href="mailto:instituto.recomecar2026@gmail.com" className={styles.botaoSecundario}>
                            Enviar E-mail
                        </a>
                    </article>

                    <article className={styles.card}>
                        <div className={styles.icone}>
                            <i className="bi bi-telephone"></i>
                        </div>

                        <h2>Central WhatsApp</h2>

                        <p>
                            Suporte rápido e prático direto
                            <br />
                            no seu celular.
                        </p>

                        <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className={styles.botaoSecundario}>
                            Chamar no Zap
                        </a>
                    </article>
                </section>
            </section>
        </main>
        </>
    );
}

export default Suporte;