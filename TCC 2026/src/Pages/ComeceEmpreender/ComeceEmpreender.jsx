
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ComeceEmpreender.module.css";

const API = "http://localhost:8080";

const categorias = [
  "Artesanato",
  "Moda",
  "Beleza",
  "Alimentos",
  "Decoração",
  "Bijuterias",
  "Outro",
];

const formasPagamento = [
  "Pix",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Boleto Bancário",
  "Dinheiro",
];

const etapas = [
  "Sobre Você",
  "Termos & Acordo",
  "Pronto!",
];

const inicial = {
  nomeCompleto: "",
  cpfCnpj: "",
  email: "",
  telefone: "",
  categoriaAtividade: "",
  descricaoAtividade: "",
  cidade: "",
  estado: "",
  formasPagamento: [],
};

function ComeceEmpreender() {
  const [passo, setPasso] = useState(0);
  const [dados, setDados] = useState(inicial);
  const [aceitou, setAceitou] = useState(false);

  const [usuario, setUsuario] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  /* A solicitação exige uma conta logada (o e-mail vem da conta) */
  useEffect(() => {
    let ativo = true;

    fetch(`${API}/usuarios/me`, { credentials: "include" })
      .then((resposta) => (resposta.ok ? resposta.json() : null))
      .then((dadosUsuario) => {
        if (ativo) setUsuario(dadosUsuario);
      })
      .catch(() => {
        if (ativo) setUsuario(null);
      });

    return () => {
      ativo = false;
    };
  }, []);

  function alterar(e) {
    const { name, value } = e.target;

    setDados((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function selecionarCategoria(categoria) {
    setDados((prev) => ({
      ...prev,
      categoriaAtividade: categoria,
    }));
  }

  function selecionarPagamento(forma) {
    setDados((prev) => ({
      ...prev,
      formasPagamento: prev.formasPagamento.includes(forma)
        ? prev.formasPagamento.filter((item) => item !== forma)
        : [...prev.formasPagamento, forma],
    }));
  }

  function avancar() {
    setPasso((p) => Math.min(p + 1, 2));
  }

  function voltar() {
    setPasso((p) => Math.max(p - 1, 0));
  }

  /* Monta a descrição preservando todos os campos do formulário
   * (D1: campos extras anexados ao texto, sem novas colunas). */
  function montarDescricao() {
    const partes = [];

    if (dados.descricaoAtividade) {
      partes.push(dados.descricaoAtividade);
    }
    if (dados.nomeCompleto) {
      partes.push("Nome informado no formulário: " + dados.nomeCompleto);
    }
    if (dados.email && dados.email.trim().toLowerCase() !==
        String(usuario?.username || "").trim().toLowerCase()) {
      partes.push("E-mail informado no formulário: " + dados.email);
    }
    if (dados.formasPagamento.length > 0) {
      partes.push("Formas de pagamento aceitas: " + dados.formasPagamento.join(", "));
    }

    return partes.join("\n\n").slice(0, 2000);
  }

  async function enviar(e) {
    e.preventDefault();
    setErro("");

    if (!usuario) {
      setErro("Faça login com a sua conta para enviar a solicitação.");
      return;
    }
    if (!dados.cpfCnpj.trim()) {
      setErro("Informe o CPF ou CNPJ.");
      return;
    }

    setEnviando(true);

    try {
      const resposta = await fetch(`${API}/solicitacoes-vendedora`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          cpfCnpj: dados.cpfCnpj.trim(),
          telefone: dados.telefone.trim(),
          cidade: dados.cidade.trim(),
          estado: dados.estado.trim(),
          categoriaAtividade: dados.categoriaAtividade,
          descricaoAtividade: montarDescricao(),
        }),
      });

      const corpo = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          corpo.erro || "Não foi possível enviar a solicitação."
        );
      }

      setPasso(2);
    } catch (erroEnvio) {
      setErro(erroEnvio.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className={styles.pagina}>
      <div className={styles.conteudo}>

        <header className={styles.topo}>
          <Link to="/Logado">
            ← Voltar ao Painel
          </Link>

          <strong>
            <span className={styles.logo}>
              <img
                src="/logoIR2.png"
                alt="Logo Instituto Recomeçar"
              />
            </span>
            Instituto Recomeçar
          </strong>
        </header>

        <div className={styles.cabecalho}>

          <h1>
            {[
              "Comece a Empreender",
              "Acordo de Vendedora",
              "Simulação concluída!",
            ][passo]}
          </h1>

          <p>
            {[
              "Conte sobre você e sua loja",
              "Leia os termos para se tornar vendedora",
              "Você concluiu as etapas do formulário",
            ][passo]}
          </p>
        </div>

        <div className={styles.etapas}>
          {etapas.map((etapa, i) => (
            <div
              className={styles.etapa}
              key={etapa}
            >
              <span
                className={`${styles.bolinha} ${
                  i <= passo ? styles.ativa : ""
                }`}
              >
                {i < passo
                  ? "✓"
                  : ["✧", "▤", "✓"][i]}
              </span>

              <small>{etapa}</small>
            </div>
          ))}
        </div>

        <section className={styles.cartao}>

          {passo === 0 && (
            <>
              <h2>Sobre você</h2>

              <div className={styles.grade}>
                <label>
                  Nome completo
                  <input
                    name="nomeCompleto"
                    value={dados.nomeCompleto}
                    onChange={alterar}
                    placeholder="Ana Paula Silva"/>
                </label>

                <label>
                  CPF ou CNPJ
                  <input
                    name="cpfCnpj"
                    value={dados.cpfCnpj}
                    onChange={alterar}
                    placeholder="000.000.000-00"/>
                </label>

                <label>
                  E-mail
                  <input
                    type="email"
                    name="email"
                    value={dados.email}
                    onChange={alterar}
                    placeholder="seu@email.com"/>
                </label>

                <label>
                  WhatsApp
                  <input
                    name="telefone"
                    value={dados.telefone}
                    onChange={alterar}
                    placeholder="(11) 99999-9999"/>
                </label>
              </div>

              <div className={styles.grupo}>
                <h2>Sua loja</h2>
              </div>

              <div className={styles.grade}>
    
                <label>
                  Cidade
                  <input
                    name="cidade"
                    value={dados.cidade}
                    onChange={alterar}
                    placeholder="Sua cidade"/>
                </label>

                <label>
                  Estado (UF)
                  <input
                    name="estado"
                    value={dados.estado}
                    onChange={alterar}
                    maxLength={2}
                    placeholder="SP"/>
                </label>
              </div>

              <div className={styles.grupo}>
                <strong>
                  Tipo de produto que você vende
                </strong>

                <div className={styles.chips}>
                  {categorias.map((categoria) => (
                    <button
                      type="button"
                      key={categoria}
                      className={`${styles.chip} ${
                        dados.categoriaAtividade === categoria
                          ? styles.selecionado
                          : ""
                      }`}
                      onClick={() =>
                        selecionarCategoria(categoria)
                      }
                    >
                      {categoria}
                    </button>
                  ))}
                </div>
              </div>

              <label className={styles.campo}>
                Conte o porquê de você querer vender no site.

                <textarea
                  name="descricaoAtividade"
                  value={dados.descricaoAtividade}
                  onChange={alterar}
                  rows={3}
                  placeholder="Conte um pouco sobre você e seus produtos..."
                />
              </label>

              <div className={styles.grupo}>
                <h2>Formas de pagamento aceitas</h2>

                <p>
                  Selecione as formas de pagamento
                  que você aceita.
                  Você pode escolher mais de uma opção.
                </p>

                <div className={styles.chips}>
                  {formasPagamento.map((forma) => (
                    <button
                      type="button"
                      key={forma}
                      aria-pressed={dados.formasPagamento.includes(forma)}
                      className={`${styles.chip} ${
                        dados.formasPagamento.includes(forma)
                          ? styles.selecionado
                          : ""
                      }`}
                      onClick={() =>
                        selecionarPagamento(forma)
                      }
                    >
                      {dados.formasPagamento.includes(forma)
                        ? "✓ "
                        : ""}
                      {forma}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={styles.primario}
                onClick={avancar}
              >
                Continuar →
              </button>
            </>
          )}

          {passo === 1 && (
            <>
              <div className={styles.aviso}>
                Leia o acordo abaixo. Para enviar a
                solicitação, é necessário aceitar os
                termos.
              </div>

              <div className={styles.termos}>
                <h3>
                  Acordo de Vendedora — Instituto Recomeçar
                </h3>

                <p>
                  <b>1. Cadastro e aprovação</b>
                </p>
                <p>
                  Ao responder esse formulário, ele será enviado para a administração que escolherá te aprovar ou não.
                </p>

                <p>
                  <b>2. Produtos</b>
                </p>
                <p>
                  A vendedora deve fornecer informações
                  verdadeiras, imagens reais, preço e
                  estoque dos
                  produtos artesanais.
                </p>

                <p>
                  <b>3. Entrega e responsabilidade</b>
                </p>
                <p>
                  Após a confirmação do pagamento, a
                  vendedora será responsável pela
                  produção, embalagem e envio, conforme
                  as modalidades de entrega informadas.
                </p>

                <p>
                  <b>4. Qualidade e autenticidade</b>
                </p>
                <p>
                  Todas as fotos e descrições devem
                  representar o produto real.
                  Práticas enganosas podem resultar
                  em penalidades.
                </p>

                <p>
                  <b>5. Pagamentos</b>
                </p>
                <p>
                  A plataforma descontará uma comissão
                  de 10% sobre o valor de cada venda,
                  destinada à manutenção do sistema.
                  As demais condições de pagamento
                  e repasse seguirão as políticas vigentes.
                </p>

                <p className={styles.fim}>
                  — Fim do Acordo de Vendedora —
                </p>
              </div>

              <div className={styles.aceite}>
                <label>
                  <input
                    type="checkbox"
                    checked={aceitou}
                    onChange={(e) =>
                      setAceitou(e.target.checked)
                    }
                  />

                  <span>
                    Li e aceito os termos do{" "}
                    <b>
                      Acordo de vendedora do
                      Instituto Recomeçar
                    </b>
                    , incluindo a comissão de 10%.
                  </span>
                </label>
              </div>

              {erro && (
                <p role="alert" style={{ color: "#c0392b" }}>
                  {erro}
                </p>
              )}

              <div className={styles.acoes}>
                <button
                  type="button"
                  className={styles.secundario}
                  onClick={voltar}
                >
                  Voltar
                </button>

                <button
                  type="button"
                  className={styles.primario}
                  onClick={enviar}
                  disabled={enviando || !aceitou}
                >
                  {enviando
                    ? "Enviando..."
                    : "Enviar solicitação →"}
                </button>
              </div>
            </>
          )}

          {passo === 2 && (
            <div className={styles.sucesso}>
              <div className={styles.iconeSucesso}>
                ✓
              </div>

              <h2>
                Solicitação enviada com sucesso!
              </h2>

              <p>
                Sua solicitação para se tornar vendedora
                do Instituto Recomeçar foi recebida
                e está <b>aguardando a análise da
                administração</b>.
              </p>

              <p>
                Você receberá um e-mail com o resultado.
                Até lá, sua conta continua com acesso
                normal de compradora.
              </p>

              <Link
                className={styles.primario}
                to="/Logado"
              >
                Voltar ao Painel
              </Link>
            </div>
          )}

        </section>

        <p className={styles.rodape}>
          ♧ &nbsp; Seus dados são protegidos
          conforme a LGPD.
        </p>

      </div>
    </main>
  );
}

export default ComeceEmpreender;
