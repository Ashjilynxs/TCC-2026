import styles from "./Catalogo.module.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listaProdutos } from "../../shared/produtos";

const API_URL = "http://localhost:8080";
const ROTA_PRODUTOS = `${API_URL}/produtos`;
function obterLista(resposta) {
  if (Array.isArray(resposta)) {
    return resposta;
  }
  if (Array.isArray(resposta?.content)) {
    return resposta.content;
  }
  if (Array.isArray(resposta?.produtos)) {
    return resposta.produtos;
  }
  return [];
}

function obterImagem(produto) {
  const imagem =
    produto.imagemUrl ||
    produto.urlImagem ||
    produto.image ||
    produto.imagem ||
    produto.foto ||
    "";

  if (typeof imagem !== "string" || !imagem.trim()) {
    return "/logoIR1.png";
  }

  if (
    imagem.startsWith("http://") ||
    imagem.startsWith("https://") ||
    imagem.startsWith("data:") ||
    imagem.startsWith("blob:")
  ) {
    return imagem;
  }

  if (imagem.startsWith("/")) {
    if (imagem.startsWith("/uploads/")) {
      return `${API_URL}${imagem}`;
    }

    return imagem;
  }

  return `${API_URL}/${imagem}`;
}

function obterNomeVendedora(produto) {
  if (typeof produto.vendedora === "string") {
    return produto.vendedora;
  }

  if (produto.vendedora?.nome) {
    return produto.vendedora.nome;
  }

  if (produto.nomeVendedora) {
    return produto.nomeVendedora;
  }

  return "";
}

function normalizarProduto(produto, origem) {
  return {
    ...produto,
    id: produto.id,
    chaveCatalogo: `${origem}-${produto.id}`,
    origem,
    nome: produto.nome || "Produto sem nome",
    categoria: produto.categoria || "Outros",
    preco: Number(produto.preco ?? 0),
    image: obterImagem(produto),
    vendedora: obterNomeVendedora(produto),
    etiqueta: produto.etiqueta || "",
  };
}

function Catalogo() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [produtosBanco, setProdutosBanco] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarProdutos() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await fetch(ROTA_PRODUTOS, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!resposta.ok) {
          throw new Error(
            `Erro HTTP ${resposta.status} ao buscar produtos`
          );
        }
        const dados = await resposta.json();
        const lista = obterLista(dados);
        if (ativo) {
          setProdutosBanco(lista);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar produtos cadastrados:",
          error
        );

        if (ativo) {
          setErro(
            "Não foi possível carregar os produtos das vendedoras."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }
    carregarProdutos();
    return () => {
      ativo = false;
    };
  }, []);

  const todosProdutos = useMemo(() => {
    const fixos = (Array.isArray(listaProdutos)
      ? listaProdutos
      : []
    ).map((produto) =>
      normalizarProduto(produto, "fixo")
    );

    const cadastrados = produtosBanco
      .filter((produto) => {
        const status = String(
          produto.status ?? ""
        ).toUpperCase();

        return (
          produto.ativo !== false &&
          status !== "INATIVO" &&
          status !== "INATIVA"
        );
      })
      .map((produto) =>
        normalizarProduto(produto, "banco")
      );

    return [...fixos, ...cadastrados];
  }, [produtosBanco]);

  const categorias = useMemo(() => {
    return [
      ...new Set(
        todosProdutos
          .map((produto) => produto.categoria)
          .filter(Boolean)
      ),
    ].sort((a, b) =>
      a.localeCompare(b, "pt-BR")
    );
  }, [todosProdutos]);

  const produtosFiltrados = useMemo(() => {
    const texto = busca.trim().toLowerCase();
    return todosProdutos.filter((produto) => {
      const nome = String(
        produto.nome ?? ""
      ).toLowerCase();
      const nomeVendedora = String(
        produto.vendedora ?? ""
      ).toLowerCase();
      const correspondeBusca =
        nome.includes(texto) ||
        nomeVendedora.includes(texto);
      const correspondeCategoria =
        !categoria ||
        produto.categoria === categoria;

      return (
        correspondeBusca &&
        correspondeCategoria
      );
    });
  }, [todosProdutos, busca, categoria]);

  function formatarPreco(valor) {
    return Number(valor ?? 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }


  function adicionarAoCarrinho(produto) {
    try {
      const salvo = JSON.parse(
        localStorage.getItem("carrinho") || "[]"
      );

      const carrinhoAtual = Array.isArray(salvo)
        ? salvo
        : [];

      const chave = produto.chaveCatalogo;

      const existente = carrinhoAtual.find(
        (item) =>
          (item.chaveCatalogo ||
            `fixo-${item.id}`) === chave
      );
      let novoCarrinho;
      if (existente) {
        novoCarrinho = carrinhoAtual.map(
          (item) =>
            (item.chaveCatalogo ||
              `fixo-${item.id}`) === chave
              ? {
                ...item,
                quantidade:
                  Number(item.quantidade || 1) + 1,
              }
              : item
        );
      } else {
        novoCarrinho = [
          ...carrinhoAtual,
          {
            ...produto,
            quantidade: 1,
          },
        ];
      }

      localStorage.setItem(
        "carrinho",
        JSON.stringify(novoCarrinho)
      );

      window.dispatchEvent(
        new Event("carrinhoAtualizado")
      );

      alert(
        `${produto.nome} adicionado ao carrinho!`
      );
    } catch (error) {
      console.error(
        "Erro ao adicionar ao carrinho:",
        error
      );

      alert(
        "Não foi possível adicionar o produto ao carrinho."
      );
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.linha1}>
        <span>Catálogo</span>
        <h6>
          Compre produtos de empreendedoras do
          Instituto Recomeçar
        </h6>
      </section>

      <section className={styles.linha2}>
        <div className={styles.searchBar}>
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={(e) =>
              setBusca(e.target.value)
            }
          />
        </div>
      </section>
      {erro && (
        <p role="alert">
          {erro} Os produtos fixos continuam
          disponíveis.
        </p>
      )}

      {carregando && (
        <p>
          Carregando produtos das vendedoras...
        </p>
      )}

      <section className={styles.produtos}>
        {produtosFiltrados.length === 0 &&
          !carregando ? (
          <p>
            Nenhum produto encontrado.
          </p>
        ) : (
          produtosFiltrados.map((produto) => (
            <div className={styles.card}
              key={produto.chaveCatalogo}>
              <Link to={`/produto/${produto.id}`} className={styles.linkProduto} >
                <div className={styles.areaImg}>
                  <img
                    src={produto.image}
                    alt={produto.nome}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/logoIR1.png";
                    }} />
                  {produto.etiqueta && (
                    <span className={styles.etiqueta}>
                      {produto.etiqueta}
                    </span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h5 className={styles.cardTitle}>
                    {produto.nome}
                  </h5>
                  {produto.vendedora && (
                    <div className={styles.vendedoraNome}>
                      <img src={produto.vendedoraImage} alt="" />
                      <h5>
                        {produto.vendedora}
                      </h5>
                    </div>
                  )}
                  <div className={styles.detalhesProdutos} >
                    <span className={styles.preco}>
                      {formatarPreco(
                        produto.preco)}
                    </span>
                  </div>
                </div>
              </Link>
              <button
                type="button"
                className={styles.btn}
                onClick={() =>
                  adicionarAoCarrinho(produto)}>
                Adicionar ao carrinho
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
export default Catalogo;
