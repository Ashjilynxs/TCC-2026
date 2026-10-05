import styles from "./GerenciarLoja.module.css";
import SidebarV from "../../Components/SidebarV/SidebarV";
import { listaProdutos } from "../../shared/produtos";

function GerenciarLoja() {
    const produtos = listaProdutos.slice(0, 1);
    return (
        <>
            <SidebarV />

            <main className={styles.main}>
                <div className="d-flex mt-4">
                    <div className={styles.title}>
                        <h1><i class="bi bi-shop-window"></i> Gerenciar Loja</h1>
                        <h6>Controle seus produtos, estoque e visualize seu desempenho.</h6>
                    </div>
                    <div className={`d-flex gap-2 ${styles.buttonMais}`}>
                        <button
                            type="button"
                            className={styles.btnNovoProduto}
                            data-bs-toggle="modal"
                            data-bs-target="#modalNovoProduto"
                        >
                            <i className="bi bi-plus-lg"></i> Novo Produto
                        </button>
                    </div>
                </div>
                <section className="row g-4 mt-2">

                    <div className="col-12 col-md-6 col-lg-4">
                        <div className={styles.card}>
                            <i className="bi bi-bag"></i>
                            <h6>Vendas totais</h6>
                            <p>R$ 350,00</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <div className={styles.card}>
                            <i className="bi bi-box"></i>
                            <h6>Produtos ativos</h6>
                            <p>1</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <div className={styles.card}>
                            <i className="bi bi-bag"></i>
                            <h6>Novos pedidos</h6>
                            <p>5</p>
                        </div>
                    </div>

                </section>

                <section className={`d-flex  ${styles.cardMeusProdutos} col-12 mt-4`}>
                    {produtos.map((produto) => (
                        <div className={` d-flex gap-3  ${styles.cardProdutos}`}>
                            <img
                                src="/logoIR1.png"
                                alt="Sabonete artesanal"
                            />

                            <div className="d-flex flex-column">
                                <span className={styles.tituloInfo}>
                                    {produto.nome}
                                </span>

                                <span className={` ${styles.descricaoInfo}`}>
                                    <span className={styles.valorInfo}>
                                        R$ 35,00
                                    </span>
                                    <span className={styles.estoqueInfo}>
                                        Estoque: 10
                                    </span>
                                    <span className={styles.vendasInfo}>
                                        <i className="bi bi-star-fill"></i> 4.5
                                    </span>
                                </span>
                            </div>

                            <div className={`d-flex gap-2  ${styles.botoes}`}>
                                <button
                                    type="button"
                                    className={styles.btnEditar}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalEditarProduto"
                                >
                                    <i className="bi bi-pencil"></i> Editar
                                </button>
                                <button className={styles.btnExcluir}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    )
                    )}
                </section >

            </main >
            <div
                className="modal fade"
                id="modalEditarProduto"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className={`modal-content ${styles.modalEditar}`}>

                        <div className={styles.modalCabecalho}>
                            <h2>Editar Produto</h2>
                            <p>Editando: Sabonete artesanal</p>
                        </div>

                        <div className="row g-4">

                            <div className="col-md-6">

                                <div className={styles.campo}>
                                    <label>Nome do Produto</label>

                                    <input
                                        type="text"
                                        defaultValue="Sabonete artesanal"
                                    />
                                </div>

                                <div className={styles.campo}>
                                    <label>Categoria</label>

                                    <input
                                        type="text"
                                        defaultValue="Beleza"
                                    />
                                </div>

                                <div className="row">

                                    <div className="col-6">
                                        <div className={styles.campo}>
                                            <label>Preço (R$)</label>

                                            <input
                                                type="text"
                                                defaultValue="35,00"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className={styles.campo}>
                                            <label>Estoque Inicial</label>

                                            <input
                                                type="number"
                                                defaultValue="12"
                                            />
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-6">

                                <div className={styles.campo}>
                                    <label>Descrição</label>

                                    <textarea
                                        defaultValue="Produto de alta qualidade feito artesanalmente com ingredientes selecionados."
                                    />
                                </div>

                                <div className={styles.campo}>
                                    <label>Foto do Produto</label>

                                    <label className={styles.uploadImagem}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                        />

                                        <i className="bi bi-image"></i>

                                        <span>
                                            Clique para trocar a imagem
                                        </span>
                                    </label>
                                </div>

                            </div>

                        </div>

                        <div className={styles.botoesModal}>

                            <button
                                type="button"
                                className={styles.btnCancelar}
                                data-bs-dismiss="modal"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className={styles.btnSalvar}
                            >
                                Salvar Alterações
                            </button>

                        </div>

                    </div>
                </div>
            </div>
            <div
                className="modal fade"
                id="modalNovoProduto"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-xl modal-dialog-centered">

                    <div className={`modal-content ${styles.modalEditar}`}>

                        <div className={styles.modalCabecalho}>
                            <h2>Novo Produto</h2>

                            <p>
                                Preencha os dados abaixo para cadastrar um novo item em sua loja.
                            </p>
                        </div>

                        <div className="row g-4">

                            <div className="col-12 col-md-6">

                                <div className={styles.campo}>
                                    <label>Nome do Produto</label>

                                    <input
                                        type="text"
                                        placeholder="Ex: Bolo de Pote"
                                    />
                                </div>

                                <div className={styles.campo}>
                                    <label>Categoria</label>

                                    <input
                                        type="text"
                                        placeholder="Ex: Gastronomia"
                                    />
                                </div>

                                <div className="row g-3">

                                    <div className="col-6">
                                        <div className={styles.campo}>
                                            <label>Preço (R$)</label>

                                            <input
                                                type="text"
                                                placeholder="0,00"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className={styles.campo}>
                                            <label>Estoque Inicial</label>

                                            <input
                                                type="number"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                </div>

                            </div>


                            <div className="col-12 col-md-6">

                                <div className={styles.campo}>
                                    <label>Descrição</label>

                                    <textarea
                                        placeholder="Descreva detalhes do seu produto..."
                                    />
                                </div>


                                <div className={styles.campo}>

                                    <label>Foto do Produto</label>

                                    <label className={styles.uploadImagem}>

                                        <input
                                            type="file"
                                            accept="image/*"
                                        />

                                        <i className="bi bi-image"></i>

                                        <span>
                                            Clique para fazer upload ou arraste uma imagem
                                        </span>

                                    </label>

                                </div>

                            </div>

                        </div>


                        <div className={styles.botoesModal}>

                            <button
                                type="button"
                                className={styles.btnCancelar}
                                data-bs-dismiss="modal"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className={styles.btnSalvar}
                            >
                                Cadastrar Produto
                            </button>

                        </div>

                    </div>

                </div>
            </div>


        </>

    );
}

export default GerenciarLoja