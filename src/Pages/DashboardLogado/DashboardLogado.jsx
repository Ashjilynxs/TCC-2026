import Sidebar from "../../Components/Sidebar/Sidebar";
import styles from "./DashboardLogado.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function DashboardLogado() {
  
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
<section className={styles.favoritosRankingCatalogo}> 
<section className={styles.favoritos}>
  <div className={styles.linha1}>
    <i className="bi bi-heart"></i> Favoritos
    <div className={styles.verTodos}>
    <Link to="/catalogo">Ver mais produtos <i class="bi bi-arrow-right"></i></Link>
    </div>
  
  </div>

  <div className={styles.linha2}>
  <div className={styles.cardFavorito}>

    <img
      src="/bordado.jpg"
      alt="Bordado Floral"
      className={styles.imagemFavorito}
    />

    <div className={styles.infoFavorito}>
      <span className={styles.nomeProduto}>Bordado Floral</span>

      <span className={styles.vendedora}>
        Fernanda Lima
      </span>
    </div>

    <div className={styles.detalhesFavorito}>
      <span className={styles.preco}>R$ 145,00</span>

      <span className={styles.avaliacao}>
        <i className="bi bi-star-fill"></i> 5
      </span>
    </div>

  </div>

  <div className={styles.cardFavorito}>

    <img
      src="/bordado.jpg"
      alt="Bordado Floral"
      className={styles.imagemFavorito}
    />

    <div className={styles.infoFavorito}>
      <span className={styles.nomeProduto}>Bordado Floral</span>

      <span className={styles.vendedora}>
        Fernanda Lima
      </span>
    </div>

    <div className={styles.detalhesFavorito}>
      <span className={styles.preco}>R$ 145,00</span>

      <span className={styles.avaliacao}>
        <i className="bi bi-star-fill"></i> 5
      </span>
    </div>

  </div>

  <div className={styles.cardFavorito}>

    <img
      src="/bordado.jpg"
      alt="Bordado Floral"
      className={styles.imagemFavorito}
    />

    <div className={styles.infoFavorito}>
      <span className={styles.nomeProduto}>Bordado Floral</span>

      <span className={styles.vendedora}>
        Fernanda Lima
      </span>
    </div>

    <div className={styles.detalhesFavorito}>
      <span className={styles.preco}>R$ 145,00</span>

      <span className={styles.avaliacao}>
        <i className="bi bi-star-fill"></i> 5
      </span>
    </div>

  </div>

  <div className={styles.cardFavorito}>

    <img
      src="/bordado.jpg"
      alt="Bordado Floral"
      className={styles.imagemFavorito}
    />

    <div className={styles.infoFavorito}>
      <span className={styles.nomeProduto}>Bordado Floral</span>

      <span className={styles.vendedora}>
        Fernanda Lima
      </span>
    </div>

    <div className={styles.detalhesFavorito}>
      <span className={styles.preco}>R$ 145,00</span>

      <span className={styles.avaliacao}>
        <i className="bi bi-star-fill"></i> 5
      </span>
    </div>

  </div>

  <div className={styles.cardFavorito}>

    <img
      src="/bordado.jpg"
      alt="Bordado Floral"
      className={styles.imagemFavorito}
    />

    <div className={styles.infoFavorito}>
      <span className={styles.nomeProduto}>Bordado Floral</span>

      <span className={styles.vendedora}>
        Fernanda Lima
      </span>
    </div>

    <div className={styles.detalhesFavorito}>
      <span className={styles.preco}>R$ 145,00</span>

      <span className={styles.avaliacao}>
        <i className="bi bi-star-fill"></i> 5
      </span>
    </div>

  </div>
</div>
</section>

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
      
      <div className={styles.card} style={{width: "18rem;"}}>
  <img src="..." className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">Bordado floral</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
    <a href="#" className="btn btn-primary">Go somewhere</a>
  </div>
</div>

    </div>
    <div className="col">
      
      <div className={styles.card} style={{width: "18rem;"}}>
  <img src="..." className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">Card title</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
    <a href="#" className="btn btn-primary">Go somewhere</a>
  </div>
</div>

    </div>
    <div className="col">
      
      <div className={styles.card} style={{width: "18rem;"}}>
  <img src="..." className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">Card title</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
    <a href="#" className="btn btn-primary">Go somewhere</a>
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

export default DashboardLogado;