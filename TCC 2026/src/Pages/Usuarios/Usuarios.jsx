import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Usuarios.module.css";
import SidebarA from "../../Components/SidebarA/SidebarA";
import NavbarAdm from "../../Components/NavbarA/NavbarAdm";

const API = "http://localhost:8080";

const NOMES_PAPEIS = {
  ADMIN: "Administrador",
  USER: "Usuário",
  VENDEDORA: "Vendedora",
  PSICOLOGO: "Psicólogo",
};

function formatarNivelAcesso(nivelAcesso) {
  const papeis = String(nivelAcesso || "")
    .split(",")
    .map((papel) => papel.trim())
    .filter(Boolean)
    .map((papel) => NOMES_PAPEIS[papel.toUpperCase()] || papel);

  return papeis.length > 0 ? papeis.join(", ") : "—";
}

function formatarData(dataCadastro) {
  if (!dataCadastro) return "—";

  const data = new Date(dataCadastro);

  if (Number.isNaN(data.getTime())) return "—";

  return data.toLocaleDateString("pt-BR");
}

function statusAtual(statusUsuario) {
  switch (String(statusUsuario || "").trim().toUpperCase()) {
    case "ATIVO":
      return { texto: "Ativa", classe: styles.ativo };
    case "INATIVO":
      return { texto: "Inativa", classe: styles.inativo };
    case "TROCAR_SENHA":
      return { texto: "Trocar senha", classe: styles.pendente };
    default:
      return {
        texto: statusUsuario || "—",
        classe: styles.pendente,
      };
  }
}

function Usuarios() {

  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarUsuarios() {
      try {
        const respostaSessao = await fetch(`${API}/usuarios/me`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!respostaSessao.ok) {
          if (ativo) {
            navigate("/login", { replace: true });
          }
          return;
        }

        const sessao = await respostaSessao.json();

        const papeis = String(sessao.nivelAcesso || "")
          .split(",")
          .map((papel) => papel.trim().toUpperCase())
          .filter(Boolean);

        if (!papeis.includes("ADMIN")) {
          if (ativo) {
            navigate("/Logado", { replace: true });
          }
          return;
        }
        
        const resposta = await fetch(`${API}/admin/usuarios`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        const tipo = resposta.headers.get("content-type") || "";

        if (!resposta.ok) {
          throw new Error(
            `Erro HTTP ${resposta.status} ao consultar os usuários`
          );
        }

        if (!tipo.includes("application/json")) {
          throw new Error(
            "A API retornou HTML em vez de JSON. Verifique a autenticação e o endereço da API."
          );
        }

        const dados = await resposta.json();

        if (ativo) {
          setUsuarios(Array.isArray(dados) ? dados : []);
        }
      } catch (erroCarregamento) {
        console.error("Erro ao carregar usuárias:", erroCarregamento);

        if (ativo) {
          setErro(
            "Não foi possível carregar as usuárias. Verifique se a API está em execução e tente novamente."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarUsuarios();

    return () => {
      ativo = false;
    };
  }, [navigate, tentativa]);

  function tentarNovamente() {
    setErro("");
    setCarregando(true);
    setTentativa((anterior) => anterior + 1);
  }

  return (
    <>
      <SidebarA />
      <main className={styles.pagina}>
        <NavbarAdm />

        <section className={styles.titulo}>

          <h1>Gestão de Usuárias</h1>

          <p>
            Visualize e gerencie as usuárias cadastradas.
          </p>

        </section>

        <section className={styles.tabela}>


          <div className={styles.cabecalho}>

            <span>Usuária</span>
            <span>Tipo</span>
            <span>Cadastro</span>
            <span>Status</span>

          </div>





          {carregando && (
            <p className={styles.mensagem}>Carregando usuárias...</p>
          )}


          {!carregando && erro && (
            <div className={styles.mensagem}>
              <p className={styles.erro}>{erro}</p>
              <button
                type="button"
                className={styles.botaoTentar}
                onClick={tentarNovamente}
              >
                Tentar novamente
              </button>
            </div>
          )}


          {!carregando && !erro && usuarios.length === 0 && (
            <p className={styles.mensagem}>
              Nenhuma usuária cadastrada até o momento.
            </p>
          )}


          {!carregando &&
            !erro &&
            usuarios.map((usuario) => {
              const status = statusAtual(usuario.statusUsuario);

              return (
                <div className={styles.linha} key={usuario.id}>

                  <div>
                    <strong>{usuario.nome}</strong>
                    <small>{usuario.username}</small>
                  </div>


                  <span>{formatarNivelAcesso(usuario.nivelAcesso)}</span>

                  <span>{formatarData(usuario.dataCadastro)}</span>

                  <span className={status.classe}>{status.texto}</span>
                </div>
              );
            })}
        </section>
      </main>
    </>
  );

}


export default Usuarios;