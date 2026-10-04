import styles from "./Carrinho.module.css"
import Sidebar from "../../Components/Sidebar/Sidebar";
function Carrinho() {

    return (
        <>
            <Sidebar />

            <main className={styles.main}>
                <div className="d-flex mt-4">
                    <div className={styles.title}>
                        <h1>Carrinho</h1>
                        <h6>Confira os produtos que você adicionou ao carrinho</h6>
                    </div>
                </div>

                <section className={`mt-3 ${styles.cards}`}>


                    <div className="d-flex gap-3 mt-3 ">
                        <div className="d-flex gap-3 flex-column flex-grow-1">
                            <div className={` d-flex gap-3  ${styles.cardProdutos}`}>
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
                            <div className={` d-flex gap-3  ${styles.cardProdutos}`}>
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
                        </div>

                        <div className={styles.cardEntrega}>
                            <div className="d-flex justify-content-between">
                                <span>Subtotal</span>
                                <strong>R$ 35,00</strong>
                            </div>

                            <div className="d-flex justify-content-between">
                                <span>Frete</span>
                                <strong>Grátis</strong>
                            </div>
                            <hr></hr>

                            <div className="d-flex justify-content-between">
                                <span>Total</span>
                                <strong>R$ 35,00</strong>
                            </div>

                            <button className={styles.rastreio}>
                                Finalizar compra
                            </button>
                        </div>
                    </div>

                </section>

            </main>
        </>
    );
}

export default Carrinho