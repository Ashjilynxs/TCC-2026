import NavbarAdm from "../../Components/NavbarA/NavbarAdm";
import SidebarA from "../../Components/SidebarA/SidebarA";
import styles from "./Psicologos.module.css";
import { listaProfissionais } from "../../shared/profissionais";

function Psicologos() {

const profissionais =listaProfissionais 


 return (
    <>
    <SidebarA />

  <main className={styles.container}>
   <NavbarAdm />

   <header className={styles.topo}>

    <div>
     <h1>Gestão de Psicólogos</h1>
     <p>
      Veja os psicólogos disponiveis.
     </p>
    </div>
   </header>



   <section className={styles.cards}>


    {profissionais.map((psicologo,index)=>(

     <article 
      className={styles.card}
      key={index}
     >
      <h2>
       {psicologo.nome}
      </h2>


      <span className={styles.area}>
       {psicologo.area}
      </span>



      <span
       className={
        psicologo.status === "Pendente"
        ? styles.pendente
        : styles.verificado
       }
      >
       {psicologo.status}
      </span>




      <div className={styles.infos}>


       <div>
        <small>CONSULTAS</small>
        <strong>{psicologo.consultas}</strong>
       </div>


       <div>
        <small>MEMBRO</small>
        <strong>{psicologo.membro}</strong>
       </div>


      </div>



      <footer>

       <button className={styles.remover}>
        Remover
       </button>

      </footer>


     </article>

    ))}


   </section>


  </main>
</>
 );

}


export default Psicologos;