import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
function Sidebar () {
    return(
<aside className={styles.sidebar}>

      <section className={styles.logo}>
        <div className={styles.logoIcon}>
          <Link to="/"><img src="/logoIR1.png" alt="Logo Instituto Recomeçar" /></Link>
        </div>

        <div className={styles.logoTexto}>
          Instituto
          <span>Recomeçar</span>
        </div>
      </section>

      <nav className={styles.menu}>
        <a href="#">Inicio</a>
        <a href="#"><i class="bi bi-person-circle"></i> Perfil</a>
        <a href="#"><i class="bi bi-box-seam"></i> Meus pedidos</a>
        <a href="#"><i class="bi bi-people"></i> Quero ser voluntário</a>
        <a href="#"><i class="bi bi-chat"></i> Mensagens</a>
        <a href="#"><i class="bi bi-headphones"></i> Suporte</a>
      </nav>

      <section className={styles.sair}>
        <div className={styles.sairIcon}>
        <button> <i class="bi bi-box-arrow-left"></i> Sair</button>
        <img src="#" alt="foto" />
        </div>
        <div className={styles.sairTexto}>
            Nome
        </div>
      </section>

    </aside>
    );
    }
    export default Sidebar