import style from "./footer.module.css";

function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <div className={style.logoArea}>
          <h2>Instituto Recomeçar</h2>
          <p>Plataforma dedicada ao empreendedorismo feminino e emancipação profissional.</p>
        </div>
        
        <div className={style.linksArea}>
          <div className={style.column}>
            <h3>Navegação</h3>
            <a href="/Inicial">Início</a>
            <a href="/Sobre">Sobre nós</a>
          </div>
        </div>
      </div>
      
      <div className={style.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Instituto Recomeçar. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;