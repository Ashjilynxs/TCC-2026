import NavbarA from "../../Components/NavbarA/NavbarAdm";
import SidebarA from "../../Components/SidebarA/SidebarA";
import styles from "./DashboardADM.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardADM() {
  const navigate = useNavigate();
  const [permitido, setPermitido] = useState(false);

  useEffect(() => {
    let ativo = true;

    fetch("http://localhost:8080/usuarios/me", { credentials: "include" })
      .then((resposta) => (resposta.ok ? resposta.json() : null))
      .then((usuario) => {
        if (!ativo) return;
        const papeis = String(usuario?.nivelAcesso || "")
          .split(",")
          .map((papel) => papel.trim().toUpperCase());
        if (!usuario || !papeis.includes("ADMIN")) {
          navigate("/login", { replace: true });
        } else {
          setPermitido(true);
        }
      })
      .catch(() => {
        if (ativo) navigate("/login", { replace: true });
      });

    return () => {
      ativo = false;
    };
  }, [navigate]);

  if (!permitido) return null;

  return (
    <>

      <SidebarA />
      <main className={styles.conteudo}>
        <NavbarA />
        <section className={styles.areaDashboard}>
          <div className={styles.introducao}>
            <h2>Visão geral </h2>
            <p> Acompanhe os principais indicadores da plataforma.</p>
          </div>

          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={`${styles.icone} ${styles.iconeRoxo}`}>
                <i className="bi bi-eye-fill"></i>
              </div>
              <div className={styles.cardTexto}>
                <span> Acessos</span>
                <strong>128</strong>
                <small> Este mês</small>
              </div>
            </div>
            <div className={styles.card}>
              <div className={`${styles.icone} ${styles.iconeRosa}`}>
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <div className={styles.cardTexto}>
                <span>
                  Novos cadastros
                </span>
                <strong>
                  12
                </strong>
                <small>
                  Este mês
                </small>
              </div>
            </div>
            <div className={styles.card}>
              <div className={`${styles.icone} ${styles.iconeVerde}`}>
                <i className="bi bi-people-fill"></i>
              </div>
              <div className={styles.cardTexto}>
                <span> Usuárias ativas</span>
                <strong>9 </strong>
                <small>Atualmente</small>
              </div>
            </div>
            <div className={styles.card}>
              <div className={`${styles.icone} ${styles.iconeLaranja}`}>
                <i className="bi bi-person-heart"></i>
              </div>
              <div className={styles.cardTexto}>
                <span> Parceiros</span>
                <strong>4</strong>
                <small>Total</small>
              </div>
            </div>
          </div>
          <section className={styles.informacoes}>
            <div className={styles.infoBox}>
              <h2>Status da plataforma </h2>
              <p>Sistema funcionando normalmente.</p>
              <span> Última atualização: hoje</span>
            </div>
            <div className={styles.infoBox}>
              <h2>Atividades recentes</h2>
              <p>3 novas solicitações aguardando verificação.</p>
              <span>5 vendas realizadas este mês.</span>
            </div>
          </section>
        </section>
      </main>
    </>
  );

}
export default DashboardADM;