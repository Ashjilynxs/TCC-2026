import styles from "./SidebarA.module.css";

function SidebarA () {

    return(<>
    <main className={styles.sidebarAdm}>
        <div className={styles.logo}>
          <img
            src="/logoIR1.png"
            alt="Logo Instituto Recomeçar"
          />

          <div>
            <strong>Instituto</strong>
            <span>Recomeçar</span>
          </div>
        </div>

        <nav className={styles.menu}>
          <a
            href="#"
            className={`${styles.menuItem} ${styles.menuAtivo}`}
          >
            <i className="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span>
          </a>

          <a href="#" className={styles.menuItem}>
            <i className="bi bi-file-earmark-text"></i>
            <span>Páginas</span>
          </a>

          <a href="#" className={styles.menuItem}>
            <i className="bi bi-people"></i>
            <span>Usuárias</span>
          </a>

          <a href="#" className={styles.menuItem}>
            <i className="bi bi-person-heart"></i>
            <span>Parceiros</span>
          </a>

          <a href="#" className={styles.menuItem}>
            <i className="bi bi-cart3"></i>
            <span>Vendas</span>
          </a>

          <a href="#" className={styles.menuItem}>
            <i className="bi bi-headset"></i>
            <span>Suporte</span>
          </a>

          <a href="#" className={styles.menuItem}>
            <i className="bi bi-person-circle"></i>
            <span>Perfil</span>
          </a>
        </nav>

        <div className={styles.rodape}>
          <span>
            <i className="bi bi-shield-check"></i>
            Área administrativa
          </span>
        </div>
      </main>
    </>);
}
export default SidebarA