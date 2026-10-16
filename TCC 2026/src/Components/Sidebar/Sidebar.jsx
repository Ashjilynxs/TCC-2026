
import styles from "./Sidebar.module.css";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Sidebar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const location = useLocation();

  const classeAtiva = (caminho) =>
    location.pathname === caminho ? styles.menuAtivo : "";

  useEffect(() => {
    let ativo = true;

    async function carregarUsuario() {
      try {
        const resposta = await fetch(
          "http://localhost:8080/usuarios/me",
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const tipo =
          resposta.headers.get("content-type") || "";

        if (
          !resposta.ok ||
          !tipo.includes("application/json")
        ) {
          throw new Error(
            "Não foi possível carregar o usuário. Verifique sua sessão."
          );
        }

        const usuario = await resposta.json();

        if (!ativo) return;

        setNomeUsuario(usuario.nome || "");

      } catch (erro) {
        console.error("Erro ao buscar usuário:", erro);
      }
    }

    carregarUsuario();

    // Atualizar Sidebar depois de salvar o Perfil
    window.addEventListener(
      "usuarioAtualizado",
      carregarUsuario
    );

    return () => {
      ativo = false;

      window.removeEventListener(
        "usuarioAtualizado",
        carregarUsuario
      );
    };
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
        className={`${styles.sidebar} ${
          menuAberto ? styles.aberto : ""
        }`}
      >
        <section className={styles.logo}>
          <div className={styles.logoIcon}>
            <Link to="/Logado">
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
          <Link to="/Logado" className={classeAtiva("/Logado")}>
            <i className="bi bi-house-door"></i> Inicio
          </Link>

          <Link to="/perfil" className={classeAtiva("/perfil")}>
            <i className="bi bi-person-circle"></i> Perfil
          </Link>

          <Link to="/carrinho" className={classeAtiva("/carrinho")}>
            <i className="bi bi-cart"></i> Carrinho
          </Link>

          <Link to="/catalogo" className={classeAtiva("/catalogo")}>
            <i className="bi bi-cart-plus"></i> Catálogo
          </Link>

          <Link to="/meusPedidos" className={classeAtiva("/meusPedidos")}>
            <i className="bi bi-box-seam"></i> Meus pedidos
          </Link>

          <Link to="/qSvoluntario" className={classeAtiva("/qSvoluntario")}>
            <i className="bi bi-people"></i> Quero ser voluntário
          </Link>

          <Link to="/suporte" className={classeAtiva("/suporte")}>
            <i className="bi bi-headphones"></i> Suporte
          </Link>
        </nav>

        <section className={styles.rodapeSidebar}>
          <button className={styles.botaoSair}>
            <i className="bi bi-box-arrow-left"></i>
            <Link to="/"> Sair</Link>
          </button>

          <div className={styles.usuario}>
            <i className="bi bi-person-circle"></i>

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

export default Sidebar;
