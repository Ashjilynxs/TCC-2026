import styles from "./Cursos.module.css"
import Sidebar from "../../Components/Sidebar/Sidebar"

function Cursos () {
    return(
        <>
        <Sidebar />

        <main className={styles.main}>
                    <div className="d-flex mt-4">
                        <div className={styles.title}>
                            <h1>Cursos Profissionalizantes</h1>
                    <h6>Confira os produtos que você adicionou ao carrinho</h6>

                        </div>
                        </div>
                        </main>
        </>
    );
}

export default Cursos