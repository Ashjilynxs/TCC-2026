
import SidebarV from "../../Components/SidebarV/SidebarV";
import styles from "./PerfilV.module.css";
import { useState, useEffect } from "react";

const API = "http://localhost:8080";

async function lerJSON(resposta) {
  const tipo = resposta.headers.get("content-type") || "";
  const dados = tipo.includes("application/json")
    ? await resposta.json()
    : null;

  if (!resposta.ok) {
    throw new Error(
      dados?.mensagem ||
      dados?.erro ||
      `Erro HTTP ${resposta.status}`
    );
  }

  if (!dados) {
    throw new Error("A API não retornou dados válidos.");
  }

  return dados;
}

function PerfilV() {
  const [abaAtiva, setAbaAtiva] = useState("pessoais");

  const [nome, setNome] = useState("");
  const [nomeSalvo, setNomeSalvo] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");

  const [alterarSenha, setAlterarSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [tipoConta, setTipoConta] = useState("");
  const [titular, setTitular] = useState("");
  const [chavePix, setChavePix] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      try {
        const resposta = await fetch(`${API}/usuarios/me`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        const usuario = await lerJSON(resposta);

        if (!ativo) return;

        setNome(usuario.nome || "");
        setNomeSalvo(usuario.nome || "");
        setEmail(usuario.username || "");
        setTelefone(usuario.telefone || "");
        setEndereco(usuario.endereco || "");
      } catch (error) {
        if (ativo) {
          console.error("Erro ao carregar perfil:", error);
          setErro(error.message);
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, []);

  function mudarAba(aba) {
    setAbaAtiva(aba);
    setErro("");
    setMensagem("");
  }

  function limparSenhas() {
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  }

  function cancelarAlteracaoSenha() {
    setAlterarSenha(false);
    limparSenhas();
    setErro("");
  }

  function validarAlteracoes() {
    setErro("");
    setMensagem("");

    if (abaAtiva === "bancarios") {
      setErro(
        "Os dados bancários ainda não podem ser salvos. É necessário integrar essa aba à API."
      );
      return false;
    }

    if (!nome.trim()) {
      setErro("O nome não pode ficar vazio.");
      return false;
    }

    if (alterarSenha) {
      if (!senhaAtual) {
        setErro("Informe sua senha atual.");
        return false;
      }

      if (novaSenha.length < 8) {
        setErro("A nova senha deve ter pelo menos 8 caracteres.");
        return false;
      }

      if (novaSenha !== confirmarSenha) {
        setErro("As senhas não coincidem.");
        return false;
      }
    }

    return true;
  }

  function abrirModal() {
    if (validarAlteracoes()) {
      setModalAberto(true);
    }
  }

  function fecharModal() {
    if (!salvando) {
      setModalAberto(false);
    }
  }

  async function salvarAlteracoes() {
    if (!validarAlteracoes()) {
      setModalAberto(false);
      return;
    }

    setSalvando(true);
    let perfilSalvo = false;

    try {
      const formData = new FormData();

      formData.append(
        "usuario",
        new Blob(
          [JSON.stringify({ nome: nome.trim() })],
          { type: "application/json" }
        )
      );

      const respostaPerfil = await fetch(`${API}/usuarios/me`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const usuarioAtualizado = await lerJSON(respostaPerfil);

      perfilSalvo = true;

      const novoNome = usuarioAtualizado.nome || nome.trim();

      setNome(novoNome);
      setNomeSalvo(novoNome);

      window.dispatchEvent(new Event("usuarioAtualizado"));

      if (alterarSenha) {
        const respostaSenha = await fetch(
          `${API}/usuarios/me/alterar-senha`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              senhaAtual,
              novaSenha,
            }),
          }
        );

        await lerJSON(respostaSenha);

        limparSenhas();
        setAlterarSenha(false);
      }

      setModalAberto(false);
      setMensagem("Perfil atualizado com sucesso!");
      setErro("");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);

      setErro(
        perfilSalvo
          ? "O perfil foi salvo, mas houve um erro ao alterar a senha: " +
              error.message
          : error.message
      );

      setModalAberto(false);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
    <SidebarV />
    <main className={styles.tudo}>
      <section className={styles.perfil}>
        <div className={styles.infoPerfil}>
          <div className={styles.foto}>
            <div className={styles.semFoto}>
              <i className="bi bi-person-circle"></i>
            </div>

            <span>
              {carregando ? "Carregando..." : nomeSalvo}
            </span>
          </div>

          <div className={styles.salvarTudo}>
            <button
              type="button"
              onClick={abrirModal}
              disabled={
                carregando ||
                salvando ||
                abaAtiva === "bancarios"
              }
            >
              Salvar alterações <i className="bi bi-floppy"></i>
            </button>
          </div>
        </div>
      </section>

      <nav className={styles.abas}>
        <button
          type="button"
          className={
            abaAtiva === "pessoais" ? styles.ativa : ""
          }
          onClick={() => mudarAba("pessoais")}
        >
          <i className="bi bi-person"></i> Informações Pessoais
        </button>

        <button
          type="button"
          className={
            abaAtiva === "bancarios" ? styles.ativa : ""
          }
          onClick={() => mudarAba("bancarios")}
        >
          <i className="bi bi-bank"></i> Dados bancários
        </button>
      </nav>

      <section className={styles.conteudo}>
        {erro && (
          <p role="alert" className={styles.mensagemErro}>
            {erro}
          </p>
        )}

        {mensagem && (
          <p role="status" className={styles.mensagemSucesso}>
            {mensagem}
          </p>
        )}

        {abaAtiva === "pessoais" && (
          <div className={styles.formulario}>
            <h2>
              <i className="bi bi-person"></i>
              {" "}Dados de cadastro
            </h2>

            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              readOnly
            />

            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <label htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <div className={styles.seguranca}>
              <h2>
                <i className="bi bi-shield-lock"></i>
                {" "}Segurança da conta
              </h2>

              {!alterarSenha ? (
                <button
                  type="button"
                  className={styles.segurancaBotao}
                  onClick={() => setAlterarSenha(true)}
                >
                  <i className="bi bi-key"></i>
                  {" "}Alterar senha
                </button>
              ) : (
                <>
                  <label htmlFor="senhaAtual">
                    Senha atual
                  </label>
                  <input
                    id="senhaAtual"
                    type="password"
                    value={senhaAtual}
                    onChange={(e) =>
                      setSenhaAtual(e.target.value)
                    }
                    autoComplete="current-password"
                  />

                  <label htmlFor="novaSenha">
                    Nova senha
                  </label>
                  <input
                    id="novaSenha"
                    type="password"
                    value={novaSenha}
                    onChange={(e) =>
                      setNovaSenha(e.target.value)
                    }
                    autoComplete="new-password"
                  />

                  <label htmlFor="confirmarSenha">
                    Confirmar nova senha
                  </label>
                  <input
                    id="confirmarSenha"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) =>
                      setConfirmarSenha(e.target.value)
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className={styles.segurancaBotao}
                    onClick={cancelarAlteracaoSenha}
                  >
                    Cancelar alteração de senha
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {abaAtiva === "bancarios" && (
          <div className={styles.formulario}>
            <h2>
              <i className="bi bi-bank"></i>
              {" "}Dados bancários
            </h2>

            <p className={styles.descricao}>
              Informe os dados da conta que será utilizada
              para receber pagamentos.
            </p>

            <label htmlFor="banco">Banco</label>
            <input
              id="banco"
              type="text"
              placeholder="Nome ou código do banco"
              value={banco}
              onChange={(e) => setBanco(e.target.value)}
            />

            <div className={styles.linhaCampos}>
              <div>
                <label htmlFor="agencia">Agência</label>
                <input
                  id="agencia"
                  type="text"
                  placeholder="Número da agência"
                  value={agencia}
                  onChange={(e) => setAgencia(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="conta">Conta com dígito</label>
                <input
                  id="conta"
                  type="text"
                  placeholder="Número da conta"
                  value={conta}
                  onChange={(e) => setConta(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="titular">
              Nome do titular da conta
            </label>
            <input
              id="titular"
              type="text"
              placeholder="Nome completo do titular"
              value={titular}
              onChange={(e) => setTitular(e.target.value)}
            />

            <label htmlFor="chavePix">Chave Pix</label>
            <input
              id="chavePix"
              type="text"
              placeholder="CPF, e-mail, telefone ou chave aleatória"
              value={chavePix}
              onChange={(e) => setChavePix(e.target.value)}
            />
          </div>
        )}
      </section>

      {modalAberto && (
        <div
          className="modal fade show"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalSalvarLabel"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={fecharModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`modal-content ${styles.modalConteudo}`}
            >
              <div className="modal-header">
                <h5
                  className={`modal-title ${styles.modalTitle}`}
                  id="modalSalvarLabel"
                >
                  Salvar alterações
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={fecharModal}
                  aria-label="Fechar"
                ></button>
              </div>

              <div className={`modal-body ${styles.modalBody}`}>
                <p>
                  Deseja salvar as alterações realizadas
                  no seu perfil?
                </p>

                {alterarSenha && (
                  <p>Sua senha também será alterada.</p>
                )}
              </div>

              <div className={`modal-footer ${styles.modalFooter}`}>
                <button
                  type="button"
                  className={`btn btn-secondary ${styles.btnSecondary}`}
                  onClick={fecharModal}
                  disabled={salvando}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className={`btn btn-primary ${styles.btnPrimary}`}
                  onClick={salvarAlteracoes}
                  disabled={salvando}
                >
                  {salvando
                    ? "Salvando..."
                    : "Salvar alterações"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
    </>
  );
}

export default PerfilV;
