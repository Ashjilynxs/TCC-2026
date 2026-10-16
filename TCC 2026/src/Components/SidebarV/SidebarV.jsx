import styles from "./SidebarV.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


function SidebarV() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/usuarios/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((usuario) => {
        setNomeUsuario(usuario.nome);
      })
      .catch((erro) => {
        console.error("Erro ao buscar usuário:", erro);
      });
  }, []);

  return (
    <>
      <button
        className={styles.hamburguer}
        onClick={() => setMenuAberto(!menuAberto)}
      >
        <i className="bi bi-list"></i>
      </button>

      <aside
        className={`${styles.sidebar} ${menuAberto ? styles.aberto : ""
          }`}
      >

        <section className={styles.logo}>
          <div className={styles.logoIcon}>
            <Link to="/vendedora">
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
          <Link to="/vendedora"><i class="bi bi-house-door"></i> Inicio</Link>

          <Link to="/perfilV">
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

          <Link to="/gerenciarLoja">
            <i className="bi bi-people"></i> Gerenciar loja
          </Link>

          <Link to="/cursos">
            <i class="bi bi-book"></i> Cursos Profissionalizantes
          </Link>

          <Link to="/agenda_psicologo">
            <i class="bi bi-calendar"></i> Agenda de consultas
          </Link>

          <Link to="/suporte">
            <i className="bi bi-headphones"></i> Suporte
          </Link>
        </nav>
        <section className={styles.rodapeSidebar}>
          <Link to="/">
            <button className={styles.botaoSair}>
              <i className="bi bi-box-arrow-left"></i>
              Sair
            </button>
          </Link>

          <div className={styles.usuario}>

            <div className={styles.dadosUsuario}>
              <span className={styles.nomeUsuario}>
                {nomeUsuario}
              </span>
            </div>

          </div>

        </section>

      </aside>
    </>
  );
}

export default SidebarV;