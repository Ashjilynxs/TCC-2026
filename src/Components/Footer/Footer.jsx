import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className="container text-center">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-3">

              <section className={styles.logoSection}>
                <div className={styles.logo}>
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
                </div>
                <div className={styles.logoDescricao}>
                  Empoderamento, formação e comunidade para mulheres que querem recomeçar com força e dignidade.
                </div>
              </section>

            </div>
            <div className="col-12 col-md-6 col-lg-3">

              <div className={styles.linksArea}>
                <div className={styles.column}>
                  <h3>Navegação</h3>
                  <Link to="/">Início</Link>
                  <Link to="/sobre_nos">Sobre nós</Link>
                  <Link to="/parceiro">Vire nosso parceiro</Link>
                </div>
              </div>

            </div>
            <div className="col-12 col-md-6 col-lg-3">

              <div>
                <div className={styles.column}>
                  <h3>Fale conosco</h3>
                  <div className={styles.faleConosco}>
                    <h6><i class="bi bi-envelope"></i> Email</h6>
                    <span>instituto.recomecar2026@gmail.com</span>
                    <div className={styles.faleConosco}>
                      <h6><i class="bi bi-telephone"></i> Telefone</h6>
                      <span>(11) 1234-5678</span>
                    </div>
                    <div className={styles.faleConosco}>
                      <h6><i class="bi bi-instagram"></i> Instagram</h6>
                      <span>@institutorecomecar</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <hr></hr>
        <p>&copy; {new Date().getFullYear()} Instituto Recomeçar. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;