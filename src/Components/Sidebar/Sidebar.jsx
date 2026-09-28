import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";


function Sidebar() {
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

        <nav className={styles.menu}>
          <Link to="/"><i class="bi bi-house-door"></i> Inicio</Link>

          <Link to="/perfil">
            <i className="bi bi-person-circle"></i> Perfil
          </Link>

          <Link to="/carrinho">
            <i class="bi bi-cart"></i> Carrinho
          </Link>

          <a href="#">
            <i class="bi bi-cart-plus"></i> Catálogo
          </a>

          <a href="#">
            <i className="bi bi-box-seam"></i> Meus pedidos
          </a>

          <a href="#">
            <i className="bi bi-people"></i> Quero ser voluntário
          </a>

          <a href="#">
            <i className="bi bi-chat"></i> Mensagens
          </a>

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

      <span className={styles.tipoUsuario}>
        Empreendedora
      </span>
    </div>

  </div>

</section>

      </aside>
    </>
  );
}

export default Sidebar;