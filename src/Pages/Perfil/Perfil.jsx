import Sidebar from "../../Components/Sidebar/Sidebar";
import styles from "./Perfil.module.css";
import { useState } from "react";

function Perfil() {
  const [abaAtiva, setAbaAtiva] = useState("pessoais");
  const [fotoPerfil, setFotoPerfil] = useState(null);

  function trocarFoto(event) {
    const arquivo = event.target.files[0];

    if (arquivo) {
      const imagem = URL.createObjectURL(arquivo);
      setFotoPerfil(imagem);
    }
  }

  return (
    <>
      <Sidebar />

      <main className={styles.tudo}>

        <section className={styles.perfil}>
          <div className={styles.infoPerfil}>

            <div className={styles.foto}>

              <label
                htmlFor="fotoPerfil"
                className={styles.fotoContainer}
              >

                {fotoPerfil ? (
                  <img
                    src={fotoPerfil}
                    alt="Foto de perfil"
                  />
                ) : (
                  <div className={styles.semFoto}>
                    <i className="bi bi-person"></i>
                  </div>
                )}

                <div className={styles.editarFoto}>
                  <i className="bi bi-camera"></i>
                </div>

              </label>

              <input
                id="fotoPerfil"
                type="file"
                accept="image/*"
                onChange={trocarFoto}
                className={styles.inputFoto}
              />

              <span>Ana Paula</span>

            </div>

            <div className={styles.salvarTudo}>
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#modalSalvar"
              >
                Salvar tudo
                <i className="bi bi-floppy"></i>
              </button>
            </div>

          </div>
        </section>


        <nav className={styles.abas}>

          <button
            className={
              abaAtiva === "pessoais"
                ? styles.ativa
                : ""
            }
            onClick={() => setAbaAtiva("pessoais")}
          >
            Informações Pessoais
          </button>

        </nav>


        <section className={styles.conteudo}>

          {abaAtiva === "pessoais" && (
            <div>

              <h2>
                <i className="bi bi-person"></i>
                Dados de cadastro
              </h2>

              <label>Nome</label>
              <input type="text" />

              <label>Email</label>
              <input type="email" />

              <label>Senha</label>
              <input type="password" />

              <label>Telefone</label>
              <input type="tel" />

              <label>Endereço</label>
              <input type="text" />

            </div>
          )}

        </section>

      </main>


      <div
        className="modal fade"
        id="modalSalvar"
        tabIndex="-1"
        aria-labelledby="modalSalvarLabel"
        aria-hidden="true"
      >

        <div className="modal-dialog modal-dialog-centered">

          <div className={`modal-content ${styles.modalConteudo}`}>

            <div className="modal-header">

              <h5
                className={`modal-title ${styles.modalTitle}`}
                id="modalSalvarLabel"
              >
                Salvar alterações
              </h5>

              <button
                type="button"
                className={`btn-close ${styles.btnClose}`}
                data-bs-dismiss="modal"
                aria-label="Fechar"
              ></button>

            </div>


            <div className={`modal-body ${styles.modalBody}`}>

              <p>
                Deseja salvar as alterações realizadas no seu perfil?
              </p>

            </div>


            <div className={`modal-footer ${styles.modalFooter}`}>

              <button
                type="button"
                className={`btn btn-secondary ${styles.btnSecondary}`}
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>

              <button
                type="button"
                className={`btn btn-primary ${styles.btnPrimary}`}
                data-bs-dismiss="modal"
              >
                Salvar alterações
              </button>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}

export default Perfil;