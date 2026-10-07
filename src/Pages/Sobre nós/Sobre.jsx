import styles from "./Sobre.module.css";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

function Sobre() {
  return (
    <>
    <Navbar />
    <div className={styles.container}>


      <section className={styles.hero}>
        <h1>Empreender é transformar vidas</h1>
        <p>
          Uma plataforma dedicada ao fortalecimento do empreendedorismo feminino,
          oferecendo capacitação profissional, apoio psicológico e oportunidades
          de crescimento.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Quem Somos</h2>
        <p>
          Somos uma iniciativa que apoia mulheres a desenvolverem sua autonomia
          financeira e emocional por meio da educação, do empreendedorismo e da
          conexão com oportunidades reais de mercado.
        </p>
      </section>


      <section className={styles.cardsSection}>
        <h2>Nossos Pilares</h2>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Capacitação</h3>
            <p>
              Cursos profissionalizantes e treinamentos para desenvolvimento de habilidades
              técnicas e comportamentais.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Empreendedorismo</h3>
            <p>
              Incentivo à criação e crescimento de negócios liderados por mulheres.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Apoio Psicológico</h3>
            <p>
              Suporte emocional para fortalecer confiança, autoestima e bem-estar.
            </p>
          </div>
        </div>
      </section>


      <section className={styles.section}>
        <h2>Nossos Objetivos</h2>
        <ul className={styles.list}>
          <li>Promover autonomia financeira feminina</li>
          <li>Oferecer cursos profissionalizantes acessíveis</li>
          <li>Incentivar liderança e inovação</li>
          <li>Fortalecer redes de apoio entre mulheres</li>
          <li>Reduzir barreiras no mercado de trabalho</li>
        </ul>
      </section>

      <section className={styles.cta}>
        <h2>Faça parte dessa transformação</h2>
        <p>
          Aprenda, cresça e construa seu futuro com apoio e conhecimento.
        </p>
        <button>Quero me inscrever</button>
      </section>


    </div>
    <Footer />
    </>
  );
}

export default Sobre;