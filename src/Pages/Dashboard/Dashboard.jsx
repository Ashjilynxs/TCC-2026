import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Carousel } from "bootstrap";
import { listaProdutos } from "../../shared/produtos";

function Dashboard() {
    const produtos = listaProdutos.slice(0, 3);

    useEffect(() => {

        const elemento = document.querySelector("#carouselparceirosPsi");

        if (elemento) {
            const carousel = new Carousel(elemento, {
                interval: 5000,
                ride: "carousel",
                wrap: true,
                pause: false
            });

            carousel.cycle();
        }

    }, []);

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <section className={styles.hero}>
                    <div className={styles.heroTitle}>
                        <h1>Seu novo <span>começo</span> está aqui!</h1>
                    </div>

                    <p>
                        O Instituto Recomeçar é um espaço seguro onde mulheres encontram formação profissional, apoio psicológico e uma comunidade solidária para construir sua independência.
                    </p>

                    <button className={styles.botao}>
                        <Link to="/cadastrar">Crie sua conta agora <i class="bi bi-arrow-right"></i></Link>

                    </button>
                </section>

                <section className={styles.destaques}>
                    <div className="container text-center">
                        <div className="row">
                            <div className="col">

                                <div className={styles.cardDestaques}>
                                    <div className="card-body">
                                        <div className={styles.cardIcon}><i class="bi bi-suitcase-lg"></i></div>
                                        <h3 className="card-title">Empreendedoras</h3>
                                        <p className="card-text">
                                            Desenvolva seu negócio e conquiste novas oportunidades. No Instituto Recomeçar, você encontra um espaço para divulgar seus produtos, ampliar suas vendas e fortalecer sua autonomia financeira, além de ter acesso a capacitação e apoio durante sua jornada empreendedora.
                                        </p>

                                    </div>
                                </div>

                            </div>
                            <div className="col">

                                <div className={styles.cardDestaques}>
                                    <div className="card-body">
                                        <div className={styles.cardIcon}><i class="bi bi-file-earmark-medical"></i></div>
                                        <h3 className="card-title">Psicólogos</h3>
                                        <p className="card-text">
                                            Ofereça seu trabalho para transformar vidas. Acreditamos que acolhimento e escuta podem transformar trajetórias. Como psicólogo voluntário, você poderá dedicar parte do seu tempo para apoiar mulheres em busca de fortalecimento emocional, autonomia e novas oportunidades.


                                        </p>

                                    </div>
                                </div>

                            </div>
                            <div className="col">

                                <div className={styles.cardDestaques}>
                                    <div className="card-body">
                                        <div className={styles.cardIcon}><i class="bi bi-buildings"></i></div>
                                        <h3 className="card-title">Empresas</h3>
                                        <p className="card-text">Ao oferecer cursos e capacitações por meio do Instituto Recomeçar, sua empresa contribui para o desenvolvimento profissional de mulheres que buscam mais autonomia, novas oportunidades e espaço no mercado de trabalho.</p>


                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
                <section className={styles.parceirosPsi}>
                    <div
                        id="carouselparceirosPsi"
                        className="carousel slide"
                        data-bs-ride="carousel"
                        data-bs-interval="3000"
                        data-bs-wrap="true"
                        data-bs-pause="false"
                    >

                        <div className="carousel-inner">

                            <div className="carousel-item active">
                                <section className={styles.parceiros}>
                                    <div className={styles.parceirosConteudo}>
                                        <span className={styles.parceirosEtiqueta}>
                                            Para Psicólogos
                                        </span>
                                        <h2 className={styles.parceirosTitle}>
                                            Seu conhecimento pode ser o apoio que transforma um recomeço.
                                        </h2>
                                        <p className={styles.parceirosTexto}>
                                            Acreditamos que o cuidado com a saúde emocional é essencial para fortalecer a confiança e a autonomia de mulheres que estão construindo novos caminhos. Como psicólogo voluntário, você pode contribuir oferecendo acolhimento, escuta e apoio profissional durante essa jornada.
                                            OBS: Para participar do programa de voluntariado e disponibilizar seus atendimentos, é necessário possuir uma conta e estar logado na plataforma.
                                        </p>
                                        <Link
                                            to="/cadastrar"
                                            className={styles.btnParceiros}
                                        >
                                            Entrar para ser voluntário
                                        </Link>
                                    </div>
                                </section>

                            </div>


                            <div className="carousel-item">
                                <section className={styles.parceiros}>
                                    <div className={styles.parceirosConteudo}>
                                        <span className={styles.parceirosEtiqueta}>
                                            Para Empresas
                                        </span>
                                        <h2 className={styles.parceirosTitle}>
                                            Sua empresa pode ser o motor dessa mudança.
                                        </h2>
                                        <p className={styles.parceirosTexto}>
                                            Acreditamos que o setor privado tem um papel fundamental na
                                            construção de uma sociedade mais justa. Sua empresa pode oferecer
                                            cursos profissionalizantes, mentorias técnicas ou apoio financeiro
                                            direto para nossos programas de capacitação.
                                        </p>
                                        <Link
                                            to="/parceiros"
                                            className={styles.btnParceiros}
                                        >
                                            Entrar em contato para parceria
                                        </Link>
                                    </div>
                                </section>
                            </div>
                        </div>

                        <button
                            className={`carousel-control-prev ${styles.setaEsquerda}`}
                            type="button"
                            data-bs-target="#carouselparceirosPsi"
                            data-bs-slide="prev"
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <button
                            className={`carousel-control-next ${styles.setaDireita}`}
                            type="button"
                            data-bs-target="#carouselparceirosPsi"
                            data-bs-slide="next"
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>

                    </div>
                </section>

                <section className={styles.miniCatalogo}>
                    <div className={styles.catalogoConteudo}>

                        <div className={styles.cabecalhoTitle}>

                            <div>
                                <h2>Produtos vendidos</h2>
                                <p>
                                    Cada compra é um passo em direção à autonomia financeira de uma mulher. Cadastre-se para ver mais.
                                </p>
                            </div>

                        </div>
                        <div className="d-flex row">
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
                                                <div className={styles.vendedoraNome}><h5>{produto.vendedor}</h5>

                                                    <img src="/sabonetes.jpg" alt="." />
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
            <Footer />
        </>
    );
}

export default Dashboard;