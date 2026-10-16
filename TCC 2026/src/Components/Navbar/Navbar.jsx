import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className={`navbar ${styles.navbar}`}>
      <div className="container-fluid px-5">

        <section className={styles.logo}>
          <div className={styles.logoIcon}>
            <Link to="/">
              <img
                src="/logoIR1.png"
                alt="Logo Instituto Recomeçar"
              />
            </Link>
          </div>

          <div className={styles.logoTexto}>
            Instituto
            <span>Recomeçar</span>
          </div>
        </section>


        <button
          className={`navbar-toggler ${styles.hamburguer}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        <div
          className={`collapse ${styles.menu}`}
          id="navbarNav"
        >
          <ul className={`navbar-nav ${styles.botoes}`}>

            <li className="nav-item">
              <Link to="/login" className={styles.btnEntrar}>
                Entrar
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/cadastrar" className={styles.btnCadastro}>
                Cadastrar-se
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;