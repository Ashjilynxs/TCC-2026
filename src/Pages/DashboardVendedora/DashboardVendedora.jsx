import Sidebar from "../../Components/Sidebar/Sidebar";
import styles from "./DashboardVendedora.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function DashboardVendedora() {
  
  return (
    <>
    <Sidebar /> 
    <section className={styles.main}> 
    <div className={styles.areaCompras}>
      <div className={styles.texto}>
        Bem-vindo (a)!
        <span> Área de compras</span>
      </div>
      <div className={styles.button}>
        <button className={styles.carrinho}><Link to="/carrinho"><i className="bi bi-cart"></i> Carrinho</Link></button>
        <button className={styles.empreender}>Começe a empreender</button>
      </div>
    </div>
    </section>
    
    <section className={styles.estatisticas}>

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

  <div className={styles.card}>
    <i className="bi bi-heart"></i>
    <h6>3</h6>
    <p>Favoritos</p>
  </div>

</section>
<section className={styles.RankingCatalogo}> 

<section className={styles.ranking}>
    <div className={styles.tituloRanking}>
      <i className="bi bi-trophy"></i> Ranking de vendedoras
    </div>
    <div className={styles.listaRanking}>
      <div className={styles.cardRanking}>
<span className={styles.medalha1}><i class="bi bi-award"></i></span>
    <img
      src="/bordado.jpg"
      alt="Bordado Floral"
      className={styles.imagemFavorito}
    />

    <div className={styles.infoRanking}>
      <span className={styles.vendedoraRanking}>Fernanda Lima</span>
    </div>

    <div className={styles.detalhesRanking}>
          <span className={styles.avaliacaoRanking}>
        <i className="bi bi-star-fill"></i> 4.9
      </span>
    </div>

  </div>
    </div>

    <div className={styles.listaRanking}>
      <div className={styles.cardRanking}>
<span className={styles.medalha2}><i class="bi bi-award"></i></span>
    <img
      src="/bordado.jpg"
      alt="Bordado Floral"
      className={styles.imagemFavorito}
    />

    <div className={styles.infoRanking}>
      <span className={styles.vendedoraRanking}>Ana Silva</span>
    </div>

    <div className={styles.detalhesRanking}>
          <span className={styles.avaliacaoRanking}>
        <i className="bi bi-star-fill"></i> 4.4
      </span>
    </div>

  </div>
    </div>

    <div className={styles.listaRanking}>
      <div className={styles.cardRanking}>
<span className={styles.medalha3}><i class="bi bi-award"></i></span>
    <img
      src="/bordado.jpg"
      alt="Bordado Floral"
      className={styles.imagemFavorito}
    />

    <div className={styles.infoRanking}>
      <span className={styles.vendedoraRanking}>Juliana Souza</span>
    </div>

    <div className={styles.detalhesRanking}>
          <span className={styles.avaliacaoRanking}>
        <i className="bi bi-star-fill"></i> 4.1
      </span>
    </div>

  </div>
    </div>

    <div className={styles.listaRanking}>
      <div className={styles.cardRanking}>
<span className={styles.medalha}>4°</span>
    <img
      src="/bordado.jpg"
      alt="Bordado Floral"
      className={styles.imagemFavorito}
    />

    <div className={styles.infoRanking}>
      <span className={styles.vendedoraRanking}>Adriana Gimenes</span>
    </div>

    <div className={styles.detalhesRanking}>
          <span className={styles.avaliacaoRanking}>
        <i className="bi bi-star-fill"></i> 3.9
      </span>
    </div>

  </div>
    </div>

    <div className={styles.listaRanking}>
      <div className={styles.cardRanking}>
<span className={styles.medalha}>5°</span>
    <img
      src="/bordado.jpg"
      alt="Bordado Floral"
      className={styles.imagemFavorito}
    />

    <div className={styles.infoRanking}>
      <span className={styles.vendedoraRanking}>Heloisa Queiroz</span>
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
    <div className="col">
      
      <div className={styles.card} >
              <div className={styles.areaImg}>
        <img src="/sabonetes.jpg" className="card-img-top" alt="..."/>
      
        <span className={styles.etiqueta}>
            Beleza
          </span>
        </div>
        <div className={styles.cardBody}>
          <h5 className={styles.cardTitle}>Sabonetes artesanais</h5>
          <div className={styles.cardText}>
              <div className={styles.vendedoraNome}>
                  <img src="/sabonetes.jpg" alt="."/><p>Juliana Matos</p>
                  </div>
      
                   <div className={styles.detalhesProdutos}>
                        <span className={styles.preco}>R$ 145,00</span>
                  
                        <span className={styles.avaliacao}>
                          <i className="bi bi-star-fill"></i> 5
                        </span>
                      </div>
          </div>
          <button className={styles.btn}>
          <Link to="#">Adicionar ao carrinho</Link>
          </button>
        </div>
      </div>

    </div>
    <div className="col">
      
      <div className={styles.card} >
              <div className={styles.areaImg}>
        <img src="/sabonetes.jpg" className="card-img-top" alt="..."/>
      
        <span className={styles.etiqueta}>
            Beleza
          </span>
        </div>
        <div className={styles.cardBody}>
          <h5 className={styles.cardTitle}>Sabonetes artesanais</h5>
          <div className={styles.cardText}>
              <div className={styles.vendedoraNome}>
                  <img src="/sabonetes.jpg" alt="."/><p>Juliana Matos</p>
                  </div>
      
                   <div className={styles.detalhesProdutos}>
                        <span className={styles.preco}>R$ 145,00</span>
                  
                        <span className={styles.avaliacao}>
                          <i className="bi bi-star-fill"></i> 5
                        </span>
                      </div>
          </div>
          <button className={styles.btn}>
          <Link to="#">Adicionar ao carrinho</Link>
          </button>
        </div>
      </div>
    </div>
    <div className="col">
      
      <div className={styles.card} >
              <div className={styles.areaImg}>
        <img src="/sabonetes.jpg" className="card-img-top" alt="..."/>
      
        <span className={styles.etiqueta}>
            Beleza
          </span>
        </div>
        <div className={styles.cardBody}>
          <h5 className={styles.cardTitle}>Sabonetes artesanais</h5>
          <div className={styles.cardText}>
              <div className={styles.vendedoraNome}>
                  <img src="/sabonetes.jpg" alt="."/><p>Juliana Matos</p>
                  </div>
      
                   <div className={styles.detalhesProdutos}>
                        <span className={styles.preco}>R$ 145,00</span>
                  
                        <span className={styles.avaliacao}>
                          <i className="bi bi-star-fill"></i> 5
                        </span>
                      </div>
          </div>
          <button className={styles.btn}>
          <Link to="#">Adicionar ao carrinho</Link>
          </button>
        </div>
      </div>

    </div>
    
  </div>
</div>
      </div>
    </section>
    
  </>
  );
}

export default DashboardVendedora;