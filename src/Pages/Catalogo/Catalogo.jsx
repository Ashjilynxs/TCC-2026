import styles from "./Catalogo.module.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { listaProdutos } from "../../shared/produtos";

function Catalogo() {

  const [filtroAberto, setFiltroAberto] = useState(false);

  const produtos = listaProdutos;
  return (
    <>
      <Sidebar />

      <main className={styles.main}>

        <section className={styles.linha1}>
          <span>Catálogo</span>
          <h6>
            Compre produtos de empreendedoras do Instituto Recomeçar
          </h6>
        </section>

        <section className={styles.linha2}>

          <div className={styles.searchBar}>
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Buscar produtos..."
            />
          </div>

          <div className={styles.areaFiltro}>

            <button
              className={styles.botaoFiltro}
              onClick={() => setFiltroAberto(!filtroAberto)}
            >
              <i className="bi bi-funnel"></i>
              Filtro
            </button>

            {filtroAberto && (
              <div className={styles.filtros}>

                <select>
                  <option value="">Categoria</option>
                  <option value="beleza">Beleza</option>
                  <option value="artesanato">
                    Artesanato
                  </option>
                  <option value="moda">
                    Moda
                  </option>
                  <option value="decoração">
                    Decoração
                  </option>
                  <option value="decoração">
                    Alimentos
                  </option>
                </select>

              </div>
            )}

          </div>

        </section>
        <section className={styles.produtos}>
          <div className=" text-center">
            <div className="row">

              {produtos.map((produto) => (
                <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                  <div className={styles.card} >
                    <div className={styles.areaImg}>
                      <img src="/sabonetes.jpg" className="card-img-top" alt="..." />

                      <span className={styles.etiqueta}>
                        {produto.etiqueta}
                      </span>
                    </div>
                    <div className={styles.cardBody}>
                      <h5 className={styles.cardTitle}>{produto.nome}</h5>
                      <div className={styles.cardText}>
                        <div className={styles.vendedoraNome}>
                          <img src="/sabonetes.jpg" alt="." /><p>{produto.vendedor}</p>
                        </div>

                        <div className={styles.detalhesProdutos}>
                          <span className={styles.preco}>R$ {produto.preco.toFixed(2)}</span>

                          <span className={styles.avaliacao}>
                            <i className="bi bi-star-fill"></i> {produto.avaliacao}
                          </span>
                        </div>
                      </div>
                      <button className={styles.btn}>
                        <Link to="#">Adicionar ao carrinho</Link>
                      </button>
                    </div>
                  </div>
                </div>
              )
              )}



            </div>
          </div>


        </section>

      </main>
    </>
  );
}

export default Catalogo;