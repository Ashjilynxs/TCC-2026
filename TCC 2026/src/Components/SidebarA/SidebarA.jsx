import styles from "./SidebarA.module.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function SidebarA() {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  const classeAtiva = (caminho) =>
    location.pathname === caminho ? styles.menuAtivo : "";

  return (
    <>
      <button className={styles.hamburguer} onClick={() => setMenuAberto(!menuAberto)} >
        <i className="bi bi-list"></i>
      </button>
      <aside className={`${styles.sidebar} ${menuAberto ? styles.aberto : ""}`}>

        <main className={styles.sidebarAdm}>
          <div className={styles.logo}>
            <Link to="/adm">
              <img
                src="/logoIR1.png"
                alt="Logo Instituto Recomeçar"
              />
            </Link>
            <div className={styles.logoTexto}>
              <strong>Instituto</strong>
              <span>Recomeçar</span>
            </div>

          </div>

          <nav className={styles.menu}>
            <Link to="/adm" className={`${styles.menuItem} ${classeAtiva("/adm")}`}>
              <i className="bi bi-grid-1x2-fill"></i>
              <span>Início</span>
            </Link>

            <Link to="/usuarios" className={`${styles.menuItem} ${classeAtiva("/usuarios")}`}>
              <i className="bi bi-people"></i>
              <span>Usuários</span>
            </Link>

            <Link to="/monitoramentoVendas" className={`${styles.menuItem} ${classeAtiva("/monitoramentoVendas")}`}>
              <i className="bi bi-cart3"></i>
              <span>Monitoramento de vendas</span>
            </Link>

            <Link to="/verificacao" className={`${styles.menuItem} ${classeAtiva("/verificacao")}`}>
              <i className="bi bi-patch-check"></i>
              <span>Verificações</span>
            </Link>

            <Link to="/psicologos" className={`${styles.menuItem} ${classeAtiva("/psicologos")}`}>
              <i className="bi bi-clipboard2-plus"></i>
              <span>Psicólogos</span>
            </Link>
          </nav>

          <div className={styles.rodape}>
            <span>
              <i className="bi bi-shield-check"></i> Área administrativa
            </span>
          </div>
        </main>
      </aside>
    </>);
}
export default SidebarA