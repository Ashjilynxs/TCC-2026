import styles from "./DashboardLogado.module.css";

function DashboardLogado() {
  return (
    <aside className={styles.sidebar}>

      <section className={styles.logo}>
        <div className={styles.logoIcon}>
          <img src="/logoIR1.png" alt="Logo Instituto Recomeçar" />
        </div>

        <div className={styles.logoTexto}>
          Instituto
          <span>Recomeçar</span>
        </div>
      </section>

      <nav className={styles.menu}>
        <a href="#">Perfil</a>
        <a href="#">Meus pedidos</a>
        <a href="#">Quero ser voluntário</a>
        <a href="#">Mensagens</a>
        <a href="#">Suporte</a>
      </nav>

    </aside>
  );
}

export default DashboardLogado;