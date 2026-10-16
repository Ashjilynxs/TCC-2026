import styles from "./Cursos.module.css"
import SidebarV from "../../Components/SidebarV/SidebarV";
import { listaCursos } from "../../shared/cursos";

function Cursos() {
    const cursos = listaCursos.slice(0, 6);
    return (
        <>
            <SidebarV />

            <main className={styles.main}>
                <div className="d-flex mt-4">
                    <div className={styles.title}>
                        <h1>Cursos Profissionalizantes</h1>
                        <h6>Capacitação para transformar oportunidades em novos caminhos.</h6>

                    </div>
                </div>
                <section className={` mt-4 ${styles.cursos}`}>
                    <div className=" text-center">
                        <div className="row">

                            {cursos.map((curso) => (
                                <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                                    <div className={styles.cardCurso}>

                                        <div className={styles.imagemCurso}>
                                            <img src={curso.imagem} alt={curso.nome} />

                                            <span className={styles.modalidade}>
                                                <i className="bi bi-laptop"></i>
                                            </span>
                                        </div>

                                        <div className={styles.conteudoCurso}>

                                            <h2>{curso.nome}</h2>

                                            <h6>{curso.empresa}</h6>

                                            <p className={styles.descricao}>{curso.descricao}</p>

                                            <div className={styles.informacoes}>

                                                <span>
                                                    <i className="bi bi-clock"></i>{curso.cargaHoraria}
                                                </span>

                                                <span>
                                                    <i className="bi bi-geo-alt"></i>
                                                    {curso.modalidade}
                                                </span>

                                            </div>

                                            <a
                                                href=""
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.btnCurso}
                                            >
                                                Acessar curso
                                                <i className="bi bi-box-arrow-up-right"></i>
                                            </a>

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

export default Cursos