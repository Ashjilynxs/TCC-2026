import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <>
            <Navbar />
            <div className={styles.container}>
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

                                <div className={styles.card}>
                                    <div className="card-body">
                                        <div className={styles.cardIcon}><i class="bi bi-suitcase-lg"></i></div>
                                        <h3 className="card-title">Empreendedoras</h3>
                                        <p className="card-text">
                                            <ul>
                                                <li>Cursos Profissionalizantes</li>
                                                <li>Local especifico para vendas</li>
                                                <li>Apoio Psicológico</li>
                                            </ul>
                                        </p>

                                    </div>
                                </div>

                            </div>
                            <div className="col">

                                <div className={styles.card}>
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

                                <div className={styles.card}>
                                    <div className="card-body">
                                        <div className={styles.cardIcon}><i class="bi bi-buildings"></i></div>
                                        <h3 className="card-title">Empresas</h3>
                                        <p className="card-text">Ao oferecer cursos e capacitações por meio do Instituto Recomeçar, sua empresa contribui para o desenvolvimento profissional de mulheres que buscam mais autonomia, novas oportunidades e espaço no mercado de trabalho.</p>
                                        <button className={styles.botao}><Link to="/parceiros" className="card-link">Torne-se parceiro</Link></button>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.parceiros}>
                    
                </section>
            </div>
            <Footer />
        </>
    );
}

export default Dashboard;