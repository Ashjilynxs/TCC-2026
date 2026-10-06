import Navbar from "../../Components/Navbar/Navbar";
import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Empreendedorismo Feminino com Apoio e Oportunidades</h1>

        <p>
          Uma plataforma desenvolvida para conectar mulheres empreendedoras a
          oportunidades de venda, capacitação profissional e apoio psicológico.
        </p>

        <button className={styles.botao}>
          Criar Conta
        </button>
      </section>

      <section className={styles.destaques}>
        <h2>Recursos da Plataforma</h2>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Marketplace</h3>
            <p>
              Cadastre seus produtos, gerencie pedidos e amplie suas vendas.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Cursos Profissionalizantes</h3>
            <p>
              Tenha acesso a cursos oferecidos por empresas parceiras para o
              desenvolvimento profissional.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Apoio Psicológico</h3>
            <p>
              Agende atendimentos com psicólogos voluntários e acompanhe sua
              evolução.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.destaques}>
        <h2>Por que utilizar a plataforma?</h2>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Capacitação</h3>
            <p>
              Desenvolva habilidades para fortalecer seu negócio.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Comunidade</h3>
            <p>
              Conecte-se com outras mulheres empreendedoras e compartilhe
              experiências.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Oportunidades</h3>
            <p>
              Divulgue seus produtos e alcance novos clientes.
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

export default Dashboard;