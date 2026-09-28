import Sidebar from "../../Components/Sidebar/Sidebar";
import styles from "./Perfil.module.css"
import { useState } from "react";

function Perfil () {
    const [abaAtiva, setAbaAtiva] = useState("pessoais");

    return(
        <>
        <Sidebar />
        <main className={styles.tudo}>
            <section className={styles.perfil}>
                <div className={styles.infoPerfil}>
                    <div className={styles.foto}>
                    <img src="#" alt="" /> Ana Beatriz
                    </div>
                    <div className={styles.salvarTudo}> 
                        <button> Salvar tudo <i class="bi bi-floppy"></i></button>
                    </div>
                </div>
            </section>
            <nav className={styles.abas}>

        <button
          className={abaAtiva === "pessoais" ? styles.ativa : ""}
          onClick={() => setAbaAtiva("pessoais")}
        >
          Informações Pessoais
        </button>


      </nav>
       <section className={styles.conteudo}>

        {abaAtiva === "pessoais" && (
          <div>
            <h2><i class="bi bi-person"></i> Dados de cadastro</h2>

            <label>Nome</label>
            <input type="text" />

            <label>Email</label>
            <input type="email" />

            <label>Telefone</label>
            <input type="text" />

            <label>Endereço</label>
            <input type="text" />
          </div>
        )}
</section>

        </main>
        </>
    );
}

export default Perfil