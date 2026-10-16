Cores site 

\#FBEFF3 (cor do fundo)

/#E4BCC9 (fundo cards)

\#E2CAD2 (bordas)

\#7A5A9A (botões)

\#4A2D6B (botões:hover)
box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
/#4A2D6B(textos em geral)

paginas
Dashboard (pronta)
Sobre nós (pronta) 
Login (pronto)
cadastre-se (pronto)
recuperar senha (recuperar senha)
Dashboard Logado/vend(pronto)
Perfil(pronto)
Carrinho(pronto)
Catalogo(pronto)
Meus Pedidos(pronto)
Quero ser voluntário(pronto)
Gerenciar Loja(pronto)
Cursos(pronto)
comece a empreender(pronto)
gerenciar atendimentos()
detalhes produto(pronto)

ADM(pronto)

margin-left: 200px;
  padding: 0 40px;

$env:JAVA_HOME = "C:\Java\jdk-21.0.12.1+1"        
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

em casa
 $env:DB_URL = "jdbc:sqlserver://localhost;instanceName=SQLEXPRESS01;databaseName=bd_instituto_recomencar;encrypt=true;trustServerCertificate=true"

 $env:DB_USER = "instituto_api"

 $env:DB_PASSWORD = Read-Host "Digite a senha do SQL Server"

na escola
$env:DB_USER = "sa"
$env:DB_PASSWORD = Read-Host "Digite a senha fornecida pelo professor"

.\mvnw.cmd spring-boot:run

  function aumentarQuantidade() {
    setQuantidade((anterior) => anterior + 1);
  }

  function diminuirQuantidade() {
    setQuantidade((anterior) =>
      Math.max(1, anterior - 1)
    );
  }