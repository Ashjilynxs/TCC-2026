import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdm from "../../Components/NavbarA/NavbarAdm";
import SidebarA from "../../Components/SidebarA/SidebarA";
import styles from "./Verificacao.module.css";

const API = "http://localhost:8080";

function formatarData(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "—";
  return (
    data.toLocaleDateString("pt-BR") +
    " às " +
    data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

function normalizarStatus(status) {
  switch (String(status || "").trim().toUpperCase()) {
    case "PENDENTE":
      return { texto: "Pendente", classe: styles.statusPendente };
    case "APROVADA":
    case "APROVADO":
      return { texto: "Aprovada", classe: styles.statusAprovada };
    case "REJEITADA":
    case "REJEITADO":
      return { texto: "Recusada", classe: styles.statusRecusada };
    default:
      return { texto: status || "—", classe: styles.statusPendente };
  }
}

function Verificacao() {
  const navigate = useNavigate();
  const [atualizando, setAtualizando] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("TODAS");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [detalhes, setDetalhes] = useState(null);
  const [recusa, setRecusa] = useState(null);
  const [versao, setVersao] = useState(0);
  const carregar = useCallback(async () => {
    try {

      const sessao = await fetch(`${API}/usuarios/me`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!sessao.ok) {
        navigate("/login", { replace: true });
        return;
      }

      const usuario = await sessao.json();
      const papeis = String(usuario.nivelAcesso || "")
        .split(",")
        .map((papel) => papel.trim().toUpperCase())
        .filter(Boolean);

      if (!papeis.includes("ADMIN")) {
        navigate("/Logado", { replace: true });
        return;
      }

      const [resPendentes, resAnalizadas, resPsicologas] = await Promise.all([
        fetch(`${API}/admin/solicitacoes-vendedora/pendentes`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        }),
        fetch(`${API}/admin/solicitacoes-vendedora/analizadas`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        }),
        fetch(`${API}/admin/psicologos`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        }),
      ]);

      if (!resPendentes.ok || !resAnalizadas.ok || !resPsicologas.ok) {
        throw new Error(
          "Erro ao consultar as solicitações. Verifique se você é administradora."
        );
      }

      const vendedorasPendentes = await resPendentes.json();
      const vendedorasAnalizadas = await resAnalizadas.json();
      const psicologas = await resPsicologas.json();

      const lista = [];

      [...vendedorasPendentes, ...vendedorasAnalizadas].forEach((item) => {
        lista.push({
          chave: "V-" + item.id,
          tipo: "VENDEDORA",
          tipoTexto: "Vendedora",
          id: item.id,
          nome: item.usuario?.nome || "—",
          email: item.usuario?.username || "—",
          data: item.dataSolicitacao,
          status: item.status,
          dados: item,
        });
      });

      psicologas.forEach((item) => {
        lista.push({
          chave: "P-" + item.id,
          tipo: "PSICOLOGA",
          tipoTexto: "Psicóloga",
          id: item.id,
          nome: item.usuario?.nome || "—",
          email: item.usuario?.username || "—",
          data: item.dataCadastro,
          status: item.statusCadastro,
          dados: item,
        });
      });

      lista.sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));

      setErro("");
      setSolicitacoes(lista);
    } catch (erroCarregamento) {
      console.error("Erro ao carregar verificações:", erroCarregamento);
      setErro(
        "Não foi possível carregar as solicitações. Verifique se a API está em execução."
      );
    } finally {
      setCarregando(false);
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void carregar();
    }, 0);
    return () => clearTimeout(timer);
  }, [carregar, versao]);

  function recarregar() {
    setCarregando(true);
    setVersao((v) => v + 1);
  }
  function urlDecisao(item, acao) {
    if (item.tipo === "VENDEDORA") {
      return `${API}/admin/solicitacoes-vendedora/${item.id}/${acao}`;
    }
    return `${API}/admin/psicologos/${item.id}/${acao}`;
  }

  async function aprovar(item) {
    const confirmado = window.confirm(
      `Confirmar a APROVAÇÃO da solicitação de ${item.tipoTexto.toLowerCase()} de "${item.nome}"?\n\n` +
      "A usuária receberá o nível de acesso correspondente e um e-mail comunicando a decisão."
    );

    if (!confirmado) return;
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(urlDecisao(item, "aprovar"), {
        method: "PUT",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const corpo = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(corpo.erro || "Não foi possível aprovar a solicitação.");
      }

      setMensagem(`Solicitação de ${item.nome} APROVADA com sucesso.`);
      setDetalhes(null);
      recarregar();
    } catch (erroAprovacao) {
      setErro(erroAprovacao.message);
    }
  }

  async function recusar() {
    if (!recusa) return;

    const { item, motivo } = recusa;

    if (!motivo || !motivo.trim()) {
      setErro("Informe o motivo da recusa.");
      return;
    }
    setErro("");
    setMensagem("");

    try {
      const parametro = item.tipo === "VENDEDORA" ? "justificativa" : "motivo";
      const resposta = await fetch(
        `${urlDecisao(item, "rejeitar")}?${parametro}=${encodeURIComponent(
          motivo.trim()
        )}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );

      const corpo = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(corpo.erro || "Não foi possível recusar a solicitação.");
      }

      setMensagem(`Solicitação de ${item.nome} RECUSADA.`);
      setRecusa(null);
      setDetalhes(null);
      recarregar();
    } catch (erroRecusa) {
      setErro(erroRecusa.message);
    }
  }

  const listaFiltrada = solicitacoes.filter((item) => {
    const status = String(item.status || "").toUpperCase();
    const bateTipo =
      filtroTipo === "TODAS" || item.tipo === filtroTipo;
    const bateStatus =
      filtroStatus === "TODOS" || status === filtroStatus;
    return bateTipo && bateStatus;
  });

  return (
    <>
      <SidebarA />
      <main className={styles.container}>
        <NavbarAdm />
        <header className={styles.topo}>
          <div>
            <h1>Central de Verificações</h1>
            <p>
              Analise as solicitações de psicólogas e vendedoras,
              aprove ou recuse com justificativa.
            </p>
          </div>
        </header>

        <section className={styles.filtros}>
          <label>
            Tipo
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="TODAS">Todas</option>
              <option value="PSICOLOGA">Psicóloga</option>
              <option value="VENDEDORA">Vendedora</option>
            </select>
          </label>

          <label>
            Status
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="TODOS">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="APROVADA">Aprovada</option>
              <option value="REJEITADA">Recusada</option>
            </select>
          </label>
        </section>

        {mensagem && (
          <p className={styles.mensagemSucesso} role="status">
            {mensagem}
          </p>
        )}
        {erro && (
          <p className={styles.mensagemErro} role="alert">
            {erro}
          </p>
        )}

        {carregando && <p className={styles.mensagem}>Carregando solicitações...</p>}

        {!carregando && listaFiltrada.length === 0 && (
          <p className={styles.mensagem}>
            Nenhuma solicitação encontrada para os filtros selecionados.
          </p>
        )}
        <section className={styles.lista}>
          {listaFiltrada.map((item) => {
            const status = normalizarStatus(item.status);
            const pendente = String(item.status).toUpperCase() === "PENDENTE";

            return (
              <article className={styles.card} key={item.chave}>
                <div className={styles.usuario}>
                  <div>
                    <h2>
                      {item.nome}
                      <span>{item.tipoTexto}</span>
                      <span className={status.classe}>{status.texto}</span>
                    </h2>
                    <p>{item.email}</p>
                    <p>Solicitação enviada em {formatarData(item.data)}</p>
                  </div>
                </div>

                <aside className={styles.acoes}>
                  <button
                    type="button"
                    className={styles.verDetalhes}
                    onClick={() => setDetalhes(item)}
                  >
                    <i className="bi bi-eye"></i>
                    Ver detalhes
                  </button>

                  {pendente && (
                    <>
                      <button
                        type="button"
                        className={styles.aprovar}
                        onClick={() => aprovar(item)}
                        disabled={atualizando}
                      >
                        <i className="bi bi-check-circle"></i>
                        Aprovar
                      </button>
                      <button
                        type="button"
                        className={styles.recusar}
                        onClick={() => setRecusa({ item, motivo: "" })}
                        disabled={atualizando}
                      >
                        <i className="bi bi-x"></i>
                        Recusar
                      </button>
                    </>
                  )}
                </aside>
              </article>
            );
          })}
        </section>
        {detalhes && (
          <div className={styles.overlay} onClick={() => setDetalhes(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalTitulo}>
                <h2>
                  {detalhes.nome} — {detalhes.tipoTexto}
                </h2>
                <button
                  type="button"
                  className={styles.fechar}
                  onClick={() => setDetalhes(null)}
                  aria-label="Fechar"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className={styles.modalCorpo}>
                <p><b>E-mail:</b> {detalhes.email}</p>
                <p><b>Data da solicitação:</b> {formatarData(detalhes.data)}</p>
                <p>
                  <b>Status:</b> {normalizarStatus(detalhes.status).texto}
                </p>

                {detalhes.dados.adminResponsavel && (
                  <p>
                    <b>Decidida por:</b> {detalhes.dados.adminResponsavel.nome}{" "}
                    em{" "}
                    {formatarData(
                      detalhes.dados.dataDecisao ||
                      detalhes.dados.dataAnalise ||
                      detalhes.dados.dataAprovacao
                    )}
                  </p>
                )}

                {detalhes.tipo === "VENDEDORA" ? (
                  <>
                    <p><b>Nome da loja:</b> {detalhes.dados.nomeLoja}</p>
                    <p><b>CPF/CNPJ:</b> {detalhes.dados.cpfCnpj}</p>
                    <p><b>Telefone:</b> {detalhes.dados.telefone || "—"}</p>
                    <p>
                      <b>Cidade/UF:</b>{" "}
                      {[detalhes.dados.cidade, detalhes.dados.estado]
                        .filter(Boolean)
                        .join(" / ") || "—"}
                    </p>
                    <p>
                      <b>Categoria:</b>{" "}
                      {detalhes.dados.categoriaAtividade || "—"}
                    </p>
                    <p><b>Descrição da atividade:</b></p>
                    <div className={styles.caixa}>
                      {detalhes.dados.descricaoAtividade || "—"}
                    </div>
                    {detalhes.dados.justificativaRejeicao && (
                      <p>
                        <b>Motivo da recusa:</b>{" "}
                        {detalhes.dados.justificativaRejeicao}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p><b>CRP:</b> {detalhes.dados.crp}</p>
                    <p>
                      <b>Especialidade:</b>{" "}
                      {detalhes.dados.especialidade || "—"}
                    </p>
                    <p><b>Resumo / observações:</b></p>
                    <div className={styles.caixa}>
                      {detalhes.dados.resumo || "—"}
                    </div>
                    {detalhes.dados.motivoRejeicao && (
                      <p>
                        <b>Motivo da recusa:</b>{" "}
                        {detalhes.dados.motivoRejeicao}
                      </p>
                    )}
                  </>
                )}
              </div>

              {String(detalhes.status).toUpperCase() === "PENDENTE" && (
                <div className={styles.modalAcoes}>
                  <button
                    type="button"
                    className={styles.aprovar}
                    onClick={() => aprovar(detalhes)}
                    disabled={atualizando}
                  >
                    <i className="bi bi-check-circle"></i>
                    Aprovar
                  </button>
                  <button
                    type="button"
                    className={styles.recusar}
                    onClick={() => setRecusa({ item: detalhes, motivo: "" })}
                    disabled={atualizando}
                  >
                    <i className="bi bi-x"></i>
                    Recusar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {recusa && (
          <div className={styles.overlay} onClick={() => setRecusa(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalTitulo}>
                <h2>
                  Recusar solicitação de{" "}
                  {recusa.item.tipoTexto.toLowerCase()}
                </h2>
                <button
                  type="button"
                  className={styles.fechar}
                  onClick={() => setRecusa(null)}
                  aria-label="Fechar"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className={styles.modalCorpo}>
                <p>
                  Solicitação de <b>{recusa.item.nome}</b> (
                  {recusa.item.email}). A conta não será excluída e nenhum
                  nível de acesso será concedido.
                </p>

                <label className={styles.campoMotivo}>
                  Motivo da recusa (será enviado por e-mail):
                  <textarea
                    rows={4}
                    value={recusa.motivo}
                    onChange={(e) =>
                      setRecusa((anterior) => ({
                        ...anterior,
                        motivo: e.target.value,
                      }))
                    }
                    placeholder="Explique de forma clara e respeitosa o motivo da recusa."
                  />
                </label>
              </div>

              <div className={styles.modalAcoes}>
                <button
                  type="button"
                  className={styles.recusar}
                  onClick={recusar}
                  disabled={atualizando || !recusa.motivo.trim()}
                >
                  {atualizando ? "Enviando..." : "Confirmar recusa"}
                </button>
                <button
                  type="button"
                  className={styles.verDetalhes}
                  onClick={() => setRecusa(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Verificacao;