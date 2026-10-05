import Sidebar from "../../Components/SidebarV/SidebarV";
import styles from "./DashboardVendedora.module.css";
import Carrinho from "../Carrinho/Carrinho";
import { Link } from "react-router-dom";
import { useState } from "react";
import { listaProdutos } from "../../shared/produtos";
import GerenciarLoja from "../GerenciarLoja/GerenciarLoja";

function DashboardVendedora() {

  const produtos = listaProdutos.slice(0, 3);
  return (
    <>

      <Sidebar />
      <main className={styles.main}>
        <section className={styles.header}>
          <div className={`d-flex justify-content-between ${styles.areaCompras}`}>
            <div className={styles.texto}>
              Bem-vindo (a)!
              <span> Área de compras</span>
            </div>
            <div className={styles.button}>
              <button className={styles.carrinho}><Link to="/carrinho"><i className="bi bi-cart"></i> Carrinho</Link></button>
              <button className={styles.empreender}><Link to="/gerenciarLoja">Gerencie sua loja</Link></button>
            </div>
          </div>
        </section>

        <section className={`d-flex justify-content-around ${styles.estatisticas}`}>

          <div className={styles.card}>
            <i className="bi bi-bag"></i>
            <h6>8</h6>
            <p>Pedidos realizados</p>
          </div>

          <div className={styles.card}>
            <i className="bi bi-box-seam"></i>
            <h6>1</h6>
            <p>Em trânsito</p>
          </div>



        </section>
        <section className={styles.RankingCatalogo}>

          <section className={` ${styles.ranking}`}>
            <div className={styles.tituloRanking}>
              <i className="bi bi-trophy"></i> Ranking de vendedoras
            </div>
            <div className={styles.listaRanking}>
              <div className={`d-flex justify-content-between ${styles.cardRanking}`}>
                <div className="d-flex gap-3 align-items-center">
                  <span className={` ${styles.medalha1}`}><i className="bi bi-award"></i></span>
                  
                  <img
                    src="/bordado.jpg"
                    alt="Bordado Floral"
                    className={styles.imagemFavorito}
                  />

                  <div className={styles.infoRanking}>
                    <span className={styles.vendedoraRanking}>Fernanda Lima</span>
                  </div>
                </div>

                <div className={styles.detalhesRanking}>

                  <span className={styles.avaliacaoRanking}>
                    <i className="bi bi-star-fill"></i> 4.9
                  </span>
                </div>

              </div>
            </div>

            <div className={styles.listaRanking}>
              <div className={`d-flex justify-content-between ${styles.cardRanking}`}>
                <div className="d-flex gap-3 align-items-center">
                <span className={styles.medalha2}><i class="bi bi-award"></i></span>
                <img
                  src="/bordado.jpg"
                  alt="Bordado Floral"
                  className={styles.imagemFavorito}
                />

                <div className={styles.infoRanking}>
                  <span className={styles.vendedoraRanking}>Ana Silva</span>
                </div>
                </div>

                <div className={styles.detalhesRanking}>
                  <span className={styles.avaliacaoRanking}>
                    <i className="bi bi-star-fill"></i> 4.4
                  </span>
                </div>

              </div>
            </div>

            <div className={styles.listaRanking}>
             <div className={`d-flex justify-content-between ${styles.cardRanking}`}>
                <div className="d-flex gap-3 align-items-center">
                <span className={styles.medalha3}><i class="bi bi-award"></i></span>
                <img
                  src="/bordado.jpg"
                  alt="Bordado Floral"
                  className={styles.imagemFavorito}
                />

                <div className={styles.infoRanking}>
                  <span className={styles.vendedoraRanking}>Juliana Souza</span>
                </div>
                </div>

                <div className={styles.detalhesRanking}>
                  <span className={styles.avaliacaoRanking}>
                    <i className="bi bi-star-fill"></i> 4.1
                  </span>
                </div>

              </div>
            </div>

            <div className={styles.listaRanking}>
              <div className={`d-flex justify-content-between ${styles.cardRanking}`}>
                <div className="d-flex gap-3 align-items-center">
                <span className={styles.medalha}>4°</span>
                <img
                  src="/bordado.jpg"
                  alt="Bordado Floral"
                  className={styles.imagemFavorito}
                />

                <div className={styles.infoRanking}>
                  <span className={styles.vendedoraRanking}>Adriana Gimenes</span>
                </div>
                </div>

                <div className={styles.detalhesRanking}>
                  <span className={styles.avaliacaoRanking}>
                    <i className="bi bi-star-fill"></i> 3.9
                  </span>
                </div>

              </div>
            </div>

            <div className={styles.listaRanking}>
              <div className={`d-flex justify-content-between ${styles.cardRanking}`}>
                <div className="d-flex gap-3 align-items-center">
                <span className={styles.medalha}>5°</span>
                <img
                  src="/bordado.jpg"
                  alt="Bordado Floral"
                  className={styles.imagemFavorito}
                />

                <div className={styles.infoRanking}>
                  <span className={styles.vendedoraRanking}>Heloisa Queiroz</span>
                </div>
                </div>

                <div className={styles.detalhesRanking}>
                  <span className={styles.avaliacaoRanking}>
                    <i className="bi bi-star-fill"></i> 3.7
                  </span>
                </div>

              </div>
            </div>
          </section>
        </section>

        <section className={styles.catalogo}>
          <div className={styles.tituloCatalogo}><i class="bi bi-cart-plus"></i> Catálogo
            <div className={styles.verMais}><Link to="/catalogo">Ver mais <i class="bi bi-arrow-right"></i></Link></div>
          </div>
          <div className={styles.listaCatalogo}>
            <div className="container text-center">
              <div className="row">
                {produtos.map((produto) => (
                  <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                    <div className={styles.cardProduto} >
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
          </div>
        </section>
      </main>

    </>
  );
}

export default DashboardVendedora;