import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
     <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
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
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-3">
            <li className="nav-item">
            </li>
            <li className="nav-item">
            </li>
          </ul>
        </div>
        <Link to="/login" className={styles.btnEntrar}>
          Entrar
        </Link>
        <Link to="/cadastrar" className={styles.btnCadastro}>
          Cadastrar-se
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;