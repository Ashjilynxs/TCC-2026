
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./DetalhesProduto.module.css";
import { listaProdutos } from "../../shared/produtos";

function DetalhesProduto() {
  const { id } = useParams();

  const [imagemAtiva, setImagemAtiva] = useState(0);

  const produto = listaProdutos.find(
    (item) => String(item.id) === String(id)
  );

  if (!produto) {
    return (
      <main className={styles.pagina}>
        <h2>Produto não encontrado</h2>
        <Link to="/catalogo">
          Voltar ao Marketplace
        </Link>
      </main>
    );
  }


  const imagens = Array.isArray(produto.imagens)
    ? produto.imagens
    : produto.image
      ? [produto.image]
      : produto.imagem
        ? [produto.imagem]
        : produto.imagemUrl
          ? [produto.imagemUrl]
          : [];


  const nomeVendedora =
    typeof produto.vendedora === "string"
      ? produto.vendedora
      : produto.vendedora?.nome || "Vendedora";

  const preco = Number(produto.preco) || 0;

  const precoFormatado = preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <main className={styles.pagina}>
      <div className={styles.container}>
        <Link
          to="/catalogo"
          className={styles.voltar}
        >
          <i className="bi bi-arrow-left"></i>
          Voltar ao catálogo
        </Link>

        <div className={styles.conteudo}>
          <section className={styles.galeria}>
            <div className={styles.imagemPrincipal}>
              {imagens.length > 0 ? (

                <img
                  src={imagens[imagemAtiva]}
                  alt={produto.nome}
                />

              ) : (
                <p>Imagem não disponível</p>
              )}

            </div>

            {imagens.length > 1 && (
              <div className={styles.miniaturas}>
                {imagens.map((imagem, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`${styles.miniatura} ${imagemAtiva === index
                      ? styles.miniaturaAtiva
                      : ""
                      }`}
                    onClick={() => setImagemAtiva(index)}
                  >
                    <img
                      src={imagem}
                      alt={produto.nome}
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className={styles.informacoes}>
            <div className={styles.classificacao}>
              <span className={styles.categoria}>
                {produto.etiqueta || "Produto"}
              </span>
            </div>

            <h1>{produto.nome}</h1>

            <h2 className={styles.preco}>
              {precoFormatado}
            </h2>

            <div className={styles.vendedora}>
              <div className={styles.dadosVendedora}>
                <img src={produto.vendedoraImage} alt="" />

                <div className={styles.textoVendedora}>
                  <strong>{nomeVendedora}</strong>
                </div>
              </div>

            </div>

            <div className={styles.comprar}>

              <button
                type="button"
                className={styles.adicionar}
                onClick={() =>
                  setMensagem("Carrinho em desenvolvimento.")
                }
              >
                <i className="bi bi-bag"></i>
                Adicionar ao Carrinho
              </button>
            </div>

            <div className={styles.descricao}>
              <h3>Descrição</h3>

              <p>
                {produto.descricao ||
                  "Descrição não disponível."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default DetalhesProduto;
