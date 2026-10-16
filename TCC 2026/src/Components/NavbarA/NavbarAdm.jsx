import styles from "./NavbarAdm.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function NavbarAdm() {
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
      <nav className={styles.navbar}>
        <div className={styles.cabecalho}>
          <div className={styles.titulo}>
            <span>Menu de </span>
            <h1>Administrador</h1>
          </div>

          <div className={styles.usuario}>
            <div className={styles.usuarioInfo}>
              <strong>{nomeUsuario}</strong>
              <span>Administrador</span>
            </div>

            <div className={styles.avatar}>
              <i className="bi bi-person-fill"></i>
            </div>

            <button
              className={styles.botaoLogout}
              title="Sair"
            >
              <Link to="/">
              <i className="bi bi-box-arrow-right"></i></Link>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
export default NavbarAdm;