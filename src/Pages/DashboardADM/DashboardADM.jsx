import SidebarA from "../../Components/SidebarA/SidebarA";
import styles from "./DashboardADM.module.css";

export function DashboardADM () {
    return(
    <>
    <SidebarA />
    <main className={styles.conteudo}>
        <header className={styles.cabecalho}>
          <div className={styles.titulo}>
            <span>Administrador</span>
            <h1>Dashboard</h1>
          </div>

          <div className={styles.usuario}>
            <div className={styles.usuarioInfo}>
              <strong>Administrador</strong>
              <span>Administrador</span>
            </div>

            <div className={styles.avatar}>
              <i className="bi bi-person-fill"></i>
            </div>

            <button
              className={styles.botaoLogout}
              title="Sair"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </header>

        <section className={styles.areaDashboard}>
          <div className={styles.introducao}>
            <h2>Visão geral</h2>

            <p>
              Acompanhe os principais indicadores da
              plataforma.
            </p>
          </div>

          <div className={styles.cards}>
            <div className={styles.card}>
              <div
                className={`${styles.icone} ${styles.iconeRoxo}`}
              >
                <i className="bi bi-eye-fill"></i>
              </div>

              <div className={styles.cardTexto}>
                <span>Acessos</span>

                <strong>128</strong>

                <small>Este mês</small>
              </div>
            </div>

            <div className={styles.card}>
              <div
                className={`${styles.icone} ${styles.iconeRosa}`}
              >
                <i className="bi bi-person-plus-fill"></i>
              </div>

              <div className={styles.cardTexto}>
                <span>Novos cadastros</span>

                <strong>12</strong>

                <small>Este mês</small>
              </div>
            </div>

            <div className={styles.card}>
              <div
                className={`${styles.icone} ${styles.iconeVerde}`}
              >
                <i className="bi bi-people-fill"></i>
              </div>

              <div className={styles.cardTexto}>
                <span>Usuárias ativas</span>

                <strong>9</strong>

                <small>Atualmente</small>
              </div>
            </div>

            <div className={styles.card}>
              <div
                className={`${styles.icone} ${styles.iconeLaranja}`}
              >
                <i className="bi bi-person-heart"></i>
              </div>

              <div className={styles.cardTexto}>
                <span>Parceiros cadastrados</span>

                <strong>4</strong>

                <small>Total</small>
              </div>
            </div>
          </div>

          <section className={styles.resumo}>
            <div className={styles.resumoCabecalho}>
              <div>
                <h2>Resumo do período</h2>

                <p>
                  Confira os principais números da
                  plataforma neste início.
                </p>
              </div>

              <span className={styles.periodo}>
                Este mês
              </span>
            </div>

            <div className={styles.resumoItens}>
              <div className={styles.resumoItem}>
                <span>Acessos</span>
                <strong>128</strong>
              </div>

              <div className={styles.linha}></div>

              <div className={styles.resumoItem}>
                <span>Novos cadastros</span>
                <strong>12</strong>
              </div>

              <div className={styles.linha}></div>

              <div className={styles.resumoItem}>
                <span>Usuárias ativas</span>
                <strong>9</strong>
              </div>

              <div className={styles.linha}></div>

              <div className={styles.resumoItem}>
                <span>Parceiros</span>
                <strong>4</strong>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
    );
}