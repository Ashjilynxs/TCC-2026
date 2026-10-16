import styles from "./Sobre_nos.module.css";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

function Sobre_nos() {

    return (
        <>
            <Navbar />

            <main className={styles.container}>
                <section className={styles.intro}>
                    <h1>  Sobre nós </h1>
                    <p>
                        O Instituto Recomeçar é uma plataforma criada para apoiar mulheres
                        na conquista da independência financeira através do empreendedorismo,
                        capacitação profissional e apoio psicológico.
                    </p>
                </section>
                <section className={styles.card}>
                    <h2> Nossa missão</h2>
                    <p>
                        Nossa missão é oferecer ferramentas e oportunidades para que mulheres
                        em situação de vulnerabilidade possam desenvolver seus talentos,
                        criar seus próprios negócios e alcançar maior autonomia em suas vidas.
                    </p>
                </section>
                <section className={styles.card}>
                    <h2> O que fazemos</h2>
                    <p>
                        A plataforma conecta mulheres empreendedoras a clientes, permitindo
                        a divulgação e venda de produtos. Além disso, oferece cursos
                        profissionalizantes gratuitos através de parceiros e possibilita
                        acesso ao acolhimento psicológico com profissionais voluntários.
                    </p>
                </section>
                <div className={styles.cards}>
                    <div className={styles.item}>
                        <h3>  Empreendedorismo</h3>
                        <p>
                            Incentivamos mulheres a transformarem suas ideias e habilidades
                            em oportunidades de geração de renda.
                        </p>
                    </div>
                    <div className={styles.item}>
                        <h3>  Capacitação</h3>
                        <p>
                            Disponibilizamos cursos e conhecimentos para ajudar no crescimento
                            pessoal e profissional.
                        </p>
                    </div>
                    <div className={styles.item}>
                        <h3> Apoio Psicológico</h3>
                        <p>
                            Oferecemos acolhimento inicial e suporte emocional para auxiliar
                            mulheres durante sua jornada.
                        </p>
                    </div>
                </div>
                <section className={styles.final}>
                    <h2> Nosso Objetivo</h2>
                    <p>
                        Acreditamos que, com apoio adequado, conhecimento e oportunidades,
                        é possível transformar dificuldades em novos caminhos e contribuir
                        para uma sociedade mais igualitária e com mais autonomia feminina.
                    </p>
                </section>
            </main>
            <Footer />
        </>
    );

}


export default Sobre_nos;