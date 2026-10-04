import { useState } from "react";
import styles from "./MeusPedidos.module.css";
import SideBar from "../../Components/SideBar/SideBar";

function MeusPedidos() {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");

  function enviarAvaliacao() {
    if (nota === 0) {
      alert("Selecione uma nota antes de enviar.");
      return;
    }

    console.log("Nota:", nota);
    console.log("Comentário:", comentario);
  }

  return (
    <>
      <SideBar />

      <main className={styles.main}>
        <div className="d-flex mt-4">
          <div className={styles.title}>
            <h1>Meus Pedidos</h1>
            <h6>Acompanhe o status e histórico de suas compras</h6>
          </div>
        </div>

        <section className={`mt-3 ${styles.cards}`}>
          <div className={`d-flex gap-5 ${styles.cardTitle}`}>
            <div className="d-flex flex-column">
              <span className={styles.tituloInfo}>
                PEDIDO REALIZADO
              </span>

              <span className={styles.valorInfo}>
                03 Set, 2026
              </span>
            </div>

            <div className="d-flex flex-column">
              <span className={styles.tituloInfo}>
                TOTAL
              </span>

              <span className={styles.valorInfo}>
                R$ 35,00
              </span>
            </div>

            <div className="d-flex flex-column">
              <span className={styles.tituloInfo}>
                NÚMERO
              </span>

              <span className={styles.valorInfo}>
                #001
              </span>
            </div>

            <div className="d-flex flex-column">
              <span className={styles.tituloInfo}>
                STATUS
              </span>

              <span className={styles.valorInfo}>
                Entregue
              </span>
            </div>
          </div>

          <div className="d-flex gap-3 mt-3">
            <div className={`d-flex gap-3 ${styles.cardProdutos}`}>
              <img
                src="/sabonetes.jpg"
                alt="Sabonete artesanal"
              />

              <div className="d-flex flex-column">
                <span className={styles.tituloInfo}>
                  Sabonete artesanal
                </span>

                <span className={styles.valorInfo}>
                  R$ 35,00
                </span>
              </div>
            </div>

            <div className={styles.cardEntrega}>
              <div className="d-flex justify-content-between">
                <span>Rastreio:</span>
                <strong>BR7263541829</strong>
              </div>

              <div className="d-flex justify-content-between">
                <span>Status:</span>
                <strong>Entregue</strong>
              </div>

              <div className="d-flex justify-content-between">
                <span>Data:</span>
                <strong>03 Set, 2026</strong>
              </div>

              <button className={styles.rastreio}>
                Acompanhar Rastreio
              </button>
            </div>
          </div>

          <button
            type="button"
            className={styles.avaliar}
            data-bs-toggle="modal"
            data-bs-target="#modalAvaliacao"
          >
            <i className="bi bi-bag-check"></i>
            Avaliar Compra
          </button>
        </section>
      </main>

      <div
        className="modal fade"
        id="modalAvaliacao"
        tabIndex="-1"
        aria-labelledby="modalAvaliacaoLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${styles.modalAvaliacao}`}>
            <div className={styles.modalTopo}>
              <div className="d-flex align-items-center gap-2">
                <i className={`bi bi-star-fill ${styles.estrelaTitulo}`}></i>

                <h2 id="modalAvaliacaoLabel">
                  Avaliar seu pedido
                </h2>
              </div>

              <button
                type="button"
                className={styles.fechar}
                data-bs-dismiss="modal"
                aria-label="Fechar"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <p className={styles.descricao}>
              Sua avaliação ajuda outras compradoras e incentiva o
              trabalho da empreendedora.
            </p>

            <div className={styles.areaEstrelas}>
              <p>O que você achou dos produtos?</p>

              <div className="d-flex justify-content-center gap-2">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <button
                    key={estrela}
                    type="button"
                    className={styles.botaoEstrela}
                    onClick={() => setNota(estrela)}
                  >
                    <i
                      className={
                        estrela <= nota
                          ? "bi bi-star-fill"
                          : "bi bi-star"
                      }
                    ></i>
                  </button>
                ))}
              </div>

              {nota > 0 && (
                <p className={styles.notaSelecionada}>
                  {nota} de 5 estrelas
                </p>
              )}
            </div>

            <div className={styles.comentario}>
              <label htmlFor="comentarioAvaliacao">
                <i className="bi bi-chat-left"></i>
                Conte-nos mais (opcional)
              </label>

              <textarea
                id="comentarioAvaliacao"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Como foi sua experiência? O produto atendeu suas expectativas?"
              />
            </div>

            <div className={styles.aviso}>
              Ao enviar, sua avaliação ficará visível publicamente no
              perfil da vendedora e na página dos produtos adquiridos
              neste pedido.
            </div>

            <div className={styles.botoesModal}>
              <button
                type="button"
                className={styles.cancelarAvaliacao}
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>

              <button
                type="button"
                className={styles.enviarAvaliacao}
                onClick={enviarAvaliacao}
              >
                Enviar Avaliação
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MeusPedidos;