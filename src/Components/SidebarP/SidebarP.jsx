import styles from "./SidebarP.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";


function SidebarP() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <button
        className={styles.hamburguer}
        onClick={() => setMenuAberto(!menuAberto)}
      >
        <i className="bi bi-list"></i>
      </button>

      <aside
        className={`${styles.sidebar} ${
          menuAberto ? styles.aberto : ""
        }`}
      >

        <section className={styles.logo}>
          <div className={styles.logoIcon}>
            <Link to="/psicologo">
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

        <nav className={styles.menu}>
          <Link to="/psicologo"><i class="bi bi-house-door"></i> Inicio</Link>

          <Link to="/perfil">
            <i className="bi bi-person-circle"></i> Perfil
          </Link>

          <Link to="/carrinho">
            <i class="bi bi-cart"></i> Carrinho
          </Link>

          <Link to="/catalogo">
            <i class="bi bi-cart-plus"></i> Catálogo
          </Link>

          <Link to="/meusPedidos">
            <i className="bi bi-box-seam"></i> Meus pedidos
          </Link>

          <Link to="/qSvoluntario">
            <i className="bi bi-people"></i> Definir horários
          </Link>

          <a href="#">
            <i className="bi bi-headphones"></i> Suporte
          </a>
        </nav>
<section className={styles.rodapeSidebar}>

  <button className={styles.botaoSair}>
    <i className="bi bi-box-arrow-left"></i>
    Sair
  </button>

  <div className={styles.usuario}>

    <img
      src="/ana.jpg"
      alt="Ana Paula"
      className={styles.fotoUsuario}
    />

    <div className={styles.dadosUsuario}>
      <span className={styles.nomeUsuario}>
        Ana Paula
      </span>
    </div>

  </div>

</section>

      </aside>
    </>
  );
}

export default SidebarP;