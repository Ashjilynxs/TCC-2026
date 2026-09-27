import Sidebar from "../../Components/Sidebar/Sidebar";
import styles from "./DashboardLogado.module.css";
import { Link } from "react-router-dom";

function DashboardLogado() {
  return (
    <>
    <Sidebar /> 
    <section className={styles.main}> 
    <div className={styles.areaCompras}>
      <div className={styles.texto}>
        Bem-vinda!
        <span> Área de compras</span>
      </div>
      <div className={styles.button}>
        <button className={styles.carrinho}><i className="bi bi-cart"></i> Carrinho</button>
        <button className={styles.catalogo}>Catalogo</button>
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

<section className={styles.favoritos}>
  <div className={styles.linha1}>
  <div className={styles.meusPedidos}>
    <i className="bi bi-box-seam"></i> Meus pedidos
    <div className={styles.verTodos}>
    <a href="#">Ver todos <i class="bi bi-arrow-right"></i></a>
    </div>
    </div>
  </div>

  <div className={styles.linha2}>
    <div></div>
  </div>
</section>
    
  </>
  );
}

export default DashboardLogado;