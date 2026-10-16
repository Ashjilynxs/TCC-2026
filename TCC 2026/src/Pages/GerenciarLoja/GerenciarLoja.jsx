

import { useEffect, useState } from "react";

import styles from "./GerenciarLoja.module.css";

import SidebarV from "../../Components/SidebarV/SidebarV";



const API_URL = "http://localhost:8080";



const formularioVazio = {

    nome: "",

    categoria: "",

    descricao: "",

    preco: "",

    estoque: "",

    prazoProducaoDias: "",

    modalidadesEntrega: [],

};



const opcoesEntrega = [

    { valor: "RETIRADA", texto: "Retirada" },

    { valor: "ENTREGA", texto: "Entrega" },

];



function normalizarModalidades(valor) {

    if (Array.isArray(valor)) return valor;



    if (typeof valor === "string") {

        return valor

            .split(",")

            .map((item) => item.trim())

            .filter(Boolean);

    }



    return [];

}



function GerenciarLoja() {

    const [produtos, setProdutos] = useState([]);

    const [novoProduto, setNovoProduto] = useState({

        ...formularioVazio,

    });





    const [carregandoProdutos, setCarregandoProdutos] = useState(true);

    const [erroProdutos, setErroProdutos] = useState("");



    useEffect(() => {

        let ativo = true;



        async function carregarMeusProdutos() {

            try {

                setCarregandoProdutos(true);

                setErroProdutos("");



                const resposta = await fetch(

                    "http://localhost:8080/produtos/meus",

                    {

                        method: "GET",

                        credentials: "include",

                        headers: {

                            Accept: "application/json",

                        },

                    }

                );



                if (!resposta.ok) {

                    throw new Error(

                        `Erro HTTP ${resposta.status} ao carregar produtos`

                    );

                }



                const dados = await resposta.json();



                if (!Array.isArray(dados)) {

                    throw new Error("A API não retornou uma lista de produtos.");

                }



                if (ativo) {

                    setProdutos(dados);

                }

            } catch (erro) {

                console.error("Erro ao buscar meus produtos:", erro);



                if (ativo) {

                    setErroProdutos(

                        "Não foi possível carregar seus produtos cadastrados."

                    );

                }

            } finally {

                if (ativo) {

                    setCarregandoProdutos(false);

                }

            }

        }



        carregarMeusProdutos();



        return () => {

            ativo = false;

        };

    }, []);





    const [produtoEditando, setProdutoEditando] = useState(null);

    const [imagemProduto, setImagemProduto] = useState(null);

    const [imagemEdicao, setImagemEdicao] = useState(null);



    const [salvando, setSalvando] = useState(false);

    const [erroCadastro, setErroCadastro] = useState("");

    const [erroEdicao, setErroEdicao] = useState("");



    function alterarCampo(event) {

        const { name, value } = event.target;



        setNovoProduto((anterior) => ({

            ...anterior,

            [name]: value,

        }));

    }



    function alterarCampoEdicao(event) {

        const { name, value } = event.target;



        setProdutoEditando((anterior) => ({

            ...anterior,

            [name]: value,

        }));

    }



    function alterarModalidade(event, edicao = false) {

        const { value, checked } = event.target;



        const atualizar = (anterior) => {

            const modalidades = normalizarModalidades(

                anterior.modalidadesEntrega

            );



            return {

                ...anterior,

                modalidadesEntrega: checked

                    ? [...new Set([...modalidades, value])]

                    : modalidades.filter((item) => item !== value),

            };

        };



        if (edicao) {

            setProdutoEditando(atualizar);

        } else {

            setNovoProduto(atualizar);

        }

    }



    function prepararEdicao(produto) {

        setProdutoEditando({

            ...produto,

            categoria: produto.categoria ?? "",

            preco: String(produto.preco ?? "").replace(".", ","),

            estoque: String(produto.estoque ?? 0),

            prazoProducaoDias: String(

                produto.prazoProducaoDias ?? ""

            ),

            modalidadesEntrega: normalizarModalidades(

                produto.modalidadesEntrega

            ),

        });



        setImagemEdicao(null);

        setErroEdicao("");

    }



    function validarProduto(produto) {

        const preco = Number(

            String(produto.preco ?? "").replace(",", ".")

        );



        const estoque = Number(produto.estoque);

        const prazo = Number(produto.prazoProducaoDias);



        const modalidades = normalizarModalidades(

            produto.modalidadesEntrega

        );



        if (!produto.nome?.trim()) {

            throw new Error("Informe o nome do produto.");

        }



        if (!produto.categoria?.trim()) {

            throw new Error("Informe a categoria do produto.");

        }



        if (

            String(produto.preco ?? "").trim() === "" ||

            !Number.isFinite(preco) ||

            preco <= 0

        ) {

            throw new Error("Informe um preço válido.");

        }



        if (

            String(produto.estoque ?? "").trim() === "" ||

            !Number.isInteger(estoque) ||

            estoque < 0

        ) {

            throw new Error("Informe um estoque válido.");

        }



        if (

            String(produto.prazoProducaoDias ?? "").trim() === "" ||

            !Number.isInteger(prazo) ||

            prazo < 0

        ) {

            throw new Error(

                "Informe um prazo de produção válido."

            );

        }



        if (modalidades.length === 0) {

            throw new Error(

                "Selecione ao menos uma modalidade de entrega."

            );

        }



        return {

            nome: produto.nome.trim(),

            categoria: produto.categoria.trim(),

            descricao: produto.descricao ?? "",

            preco,

            estoque,

            prazoProducaoDias: prazo,

            modalidadesEntrega: modalidades.join(","),

        };

    }



    function validarImagem(imagem) {

        if (!imagem) return;



        const tiposPermitidos = [

            "image/jpeg",

            "image/png",

            "image/webp",

        ];



        if (!tiposPermitidos.includes(imagem.type)) {

            throw new Error(

                "Selecione uma imagem JPG, PNG ou WEBP."

            );

        }



        if (imagem.size > 5 * 1024 * 1024) {

            throw new Error(

                "A imagem deve ter no máximo 5 MB."

            );

        }

    }



    async function lerErro(resposta) {

        const texto = await resposta.text();



        try {

            const dados = JSON.parse(texto);

            return dados.erro || dados.message || texto;

        } catch {

            return texto || "Erro inesperado.";

        }

    }



    async function enviarImagem(produtoId, imagem) {

        if (!imagem) return null;



        validarImagem(imagem);



        const formData = new FormData();

        formData.append("imagem", imagem);



        const resposta = await fetch(

            `${API_URL}/produtos/${produtoId}/upload`,

            {

                method: "POST",

                credentials: "include",

                body: formData,

            }

        );



        if (!resposta.ok) {

            throw new Error(

                "Produto salvo, mas não foi possível enviar a imagem: " +

                (await lerErro(resposta))

            );

        }



        return await resposta.json();

    }



    async function cadastrarProduto() {

        if (salvando) return;



        setErroCadastro("");



        try {

            const dados = validarProduto(novoProduto);

            validarImagem(imagemProduto);



            setSalvando(true);



            const resposta = await fetch(

                `${API_URL}/produtos`,

                {

                    method: "POST",

                    credentials: "include",

                    headers: {

                        "Content-Type": "application/json",

                        Accept: "application/json",

                    },

                    body: JSON.stringify(dados),

                }

            );



            if (!resposta.ok) {

                throw new Error(

                    `Erro ${resposta.status}: ${await lerErro(resposta)}`

                );

            }



            let produtoCriado = await resposta.json();



            produtoCriado = {

                ...produtoCriado,

                categoria:

                    produtoCriado.categoria ?? dados.categoria,

                modalidadesEntrega:

                    produtoCriado.modalidadesEntrega ??

                    dados.modalidadesEntrega,

            };



            setProdutos((anteriores) => [

                produtoCriado,

                ...anteriores,

            ]);



            if (imagemProduto) {

                const resultadoImagem = await enviarImagem(

                    produtoCriado.id,

                    imagemProduto

                );



                produtoCriado = {

                    ...produtoCriado,

                    imagemUrl: resultadoImagem.imagemUrl,

                };



                setProdutos((anteriores) =>

                    anteriores.map((produto) =>

                        produto.id === produtoCriado.id

                            ? produtoCriado

                            : produto

                    )

                );

            }



            setNovoProduto({ ...formularioVazio });

            setImagemProduto(null);

            alert("Produto cadastrado com sucesso!");

        } catch (erro) {

            setErroCadastro(erro.message);

        } finally {

            setSalvando(false);

        }

    }



    async function salvarEdicao() {

        if (!produtoEditando || salvando) return;



        setErroEdicao("");



        try {

            const dados = validarProduto(produtoEditando);

            validarImagem(imagemEdicao);



            setSalvando(true);



            const resposta = await fetch(

                `${API_URL}/produtos/${produtoEditando.id}`,

                {

                    method: "PUT",

                    credentials: "include",

                    headers: {

                        "Content-Type": "application/json",

                        Accept: "application/json",

                    },

                    body: JSON.stringify({

                        ...dados,

                        imagemUrl:

                            produtoEditando.imagemUrl ?? null,

                    }),

                }

            );



            if (!resposta.ok) {

                throw new Error(

                    `Erro ${resposta.status}: ${await lerErro(resposta)}`

                );

            }



            let produtoAtualizado = await resposta.json();



            if (imagemEdicao) {

                const resultadoImagem = await enviarImagem(

                    produtoAtualizado.id,

                    imagemEdicao

                );



                produtoAtualizado = {

                    ...produtoAtualizado,

                    imagemUrl: resultadoImagem.imagemUrl,

                };

            }



            setProdutos((anteriores) =>

                anteriores.map((produto) =>

                    produto.id === produtoAtualizado.id

                        ? {

                            ...produtoAtualizado,

                            categoria: dados.categoria,

                            modalidadesEntrega:

                                dados.modalidadesEntrega,

                        }

                        : produto

                )

            );



            alert("Produto atualizado com sucesso!");

        } catch (erro) {

            setErroEdicao(erro.message);

        } finally {

            setSalvando(false);

        }

    }



    async function excluirProduto(id) {

        if (!window.confirm("Deseja inativar este produto?")) {

            return;

        }



        try {

            const resposta = await fetch(

                `${API_URL}/produtos/${id}/inativar`,

                {

                    method: "PUT",

                    credentials: "include",

                }

            );



            if (!resposta.ok) {

                throw new Error(await lerErro(resposta));

            }



            setProdutos((anteriores) =>

                anteriores.filter((produto) => produto.id !== id)

            );

        } catch (erro) {

            alert(erro.message);

        }

    }



    function formatarPreco(valor) {

        return Number(valor ?? 0).toLocaleString("pt-BR", {

            style: "currency",

            currency: "BRL",

        });

    }



    function urlImagem(produto) {

        if (!produto.imagemUrl) {

            return "/logoIR1.png";

        }



        if (produto.imagemUrl.startsWith("http")) {

            return produto.imagemUrl;

        }



        return `${API_URL}${produto.imagemUrl}`;

    }



    function CampoModalidades({ produto, edicao = false }) {

        const selecionadas = normalizarModalidades(

            produto.modalidadesEntrega

        );



        return (

            <div className={styles.campo}>

                <label>Modalidade de Entrega</label>



                <div className="d-flex flex-wrap gap-4 mt-2">

                    {opcoesEntrega.map((opcao) => (

                        <label

                            key={opcao.valor}

                            className="d-flex align-items-center gap-2"

                        >

                            <input

                                type="checkbox"

                                value={opcao.valor}

                                checked={selecionadas.includes(

                                    opcao.valor

                                )}

                                onChange={(event) =>

                                    alterarModalidade(event, edicao)

                                }

                            />

                            {opcao.texto}

                        </label>

                    ))}

                </div>

            </div>

        );

    }



    return (

        <>

            <SidebarV />



            <main className={styles.main}>

                <div className="d-flex mt-4">

                    <div className={styles.title}>

                        <h1>

                            <i className="bi bi-box-seam"></i>{" "}

                            Gerenciar Produtos

                        </h1>



                        <h6>

                            Cadastre seus produtos e controle seu

                            estoque no Instituto Recomeçar.

                        </h6>

                    </div>



                    <div

                        className={`d-flex gap-2 ${styles.buttonMais}`}

                    >

                        <button

                            type="button"

                            className={styles.btnNovoProduto}

                            data-bs-toggle="modal"

                            data-bs-target="#modalNovoProduto"

                        >

                            <i className="bi bi-plus-lg"></i>{" "}

                            Novo Produto

                        </button>

                    </div>

                </div>



                <section className="row g-4 mt-2">

                    <div className="col-12 col-md-6 col-lg-4">

                        <div className={styles.card}>

                            <i className="bi bi-box"></i>

                            <h6>Produtos cadastrados</h6>

                            <p>{produtos.length}</p>

                        </div>

                    </div>



                    <div className="col-12 col-md-6 col-lg-4">

                        <div className={styles.card}>

                            <i className="bi bi-check-circle"></i>

                            <h6>Produtos ativos</h6>

                            <p>

                                {

                                    produtos.filter(

                                        (produto) =>

                                            produto.status !== "INATIVO"

                                    ).length

                                }

                            </p>

                        </div>

                    </div>

                </section>



                <section

                    className={`d-flex ${styles.cardMeusProdutos} col-12 mt-4`}

                >

                    {carregandoProdutos && <p>Carregando seus produtos...</p>}
                    {erroProdutos && <p role="alert" style={{ color: "red" }}>{erroProdutos}</p>}
                    {!carregandoProdutos && !erroProdutos && produtos.length === 0 && (

                        <p>

                            Nenhum produto cadastrado até o momento.

                        </p>

                    )}



                    {produtos.map((produto) => (

                        <div

                            key={produto.id}

                            className={`d-flex gap-3 ${styles.cardProdutos}`}

                        >

                            <img

                                src={urlImagem(produto)}

                                alt={produto.nome}

                            />



                            <div className="d-flex flex-column">

                                <span className={styles.tituloInfo}>

                                    {produto.nome}

                                </span>



                                <span className={styles.descricaoInfo}>

                                    <span className={styles.valorInfo}>

                                        {formatarPreco(produto.preco)}

                                    </span>



                                    <span className={styles.estoqueInfo}>

                                        Estoque: {produto.estoque}

                                    </span>



                                    <span>

                                        Categoria: {produto.categoria}

                                    </span>



                                    <span>

                                        Prazo de produção:{" "}

                                        {produto.prazoProducaoDias} dias

                                    </span>



                                    <span>

                                        Entrega:{" "}

                                        {normalizarModalidades(

                                            produto.modalidadesEntrega

                                        ).join(", ")}

                                    </span>

                                </span>

                            </div>



                            <div

                                className={`d-flex gap-2 ${styles.botoes}`}

                            >

                                <button

                                    type="button"

                                    className={styles.btnEditar}

                                    data-bs-toggle="modal"

                                    data-bs-target="#modalEditarProduto"

                                    onClick={() => prepararEdicao(produto)}

                                >

                                    <i className="bi bi-pencil"></i>{" "}

                                    Editar

                                </button>



                                <button

                                    type="button"

                                    className={styles.btnExcluir}

                                    onClick={() =>

                                        excluirProduto(produto.id)

                                    }

                                >

                                    <i className="bi bi-trash"></i>

                                </button>

                            </div>

                        </div>

                    ))}

                </section>

            </main>



            {/* MODAL EDITAR PRODUTO */}

            <div

                className="modal fade"

                id="modalEditarProduto"

                tabIndex="-1"

                aria-hidden="true"

            >

                <div className="modal-dialog modal-xl modal-dialog-centered">

                    <div

                        className={`modal-content ${styles.modalEditar}`}

                    >

                        <div className={styles.modalCabecalho}>

                            <h2>Editar Produto</h2>

                            <p>

                                Editando: {produtoEditando?.nome ?? ""}

                            </p>

                        </div>



                        {produtoEditando && (

                            <>

                                <div className="row g-4">

                                    <div className="col-md-6">

                                        <div className={styles.campo}>

                                            <label>Nome do Produto</label>

                                            <input

                                                type="text"

                                                name="nome"

                                                value={produtoEditando.nome}

                                                onChange={alterarCampoEdicao}

                                            />

                                        </div>



                                        <div className={styles.campo}>

                                            <label>Categoria</label>

                                            <input

                                                type="text"

                                                name="categoria"

                                                value={

                                                    produtoEditando.categoria ?? ""

                                                }

                                                onChange={alterarCampoEdicao}

                                            />

                                        </div>



                                        <div className="row g-3">

                                            <div className="col-6">

                                                <div className={styles.campo}>

                                                    <label>Preço (R$)</label>

                                                    <input

                                                        type="text"

                                                        name="preco"

                                                        value={produtoEditando.preco}

                                                        onChange={alterarCampoEdicao}

                                                    />

                                                </div>

                                            </div>



                                            <div className="col-6">

                                                <div className={styles.campo}>

                                                    <label>Estoque</label>

                                                    <input

                                                        type="number"

                                                        min="0"

                                                        name="estoque"

                                                        value={produtoEditando.estoque}

                                                        onChange={alterarCampoEdicao}

                                                    />

                                                </div>

                                            </div>

                                        </div>



                                        <div className={styles.campo}>

                                            <label>

                                                Prazo de Produção (dias)

                                            </label>

                                            <input

                                                type="number"

                                                min="0"

                                                step="1"

                                                name="prazoProducaoDias"

                                                placeholder="Ex: 5"

                                                value={

                                                    produtoEditando.prazoProducaoDias ??

                                                    ""

                                                }

                                                onChange={alterarCampoEdicao}

                                            />

                                        </div>



                                        <CampoModalidades

                                            produto={produtoEditando}

                                            edicao={true}

                                        />

                                    </div>



                                    <div className="col-md-6">

                                        <div className={styles.campo}>

                                            <label>Descrição</label>

                                            <textarea

                                                name="descricao"

                                                value={

                                                    produtoEditando.descricao ?? ""

                                                }

                                                onChange={alterarCampoEdicao}

                                            />

                                        </div>



                                        <div className={styles.campo}>

                                            <label>Foto do Produto</label>



                                            <label

                                                className={styles.uploadImagem}

                                            >

                                                <input

                                                    type="file"

                                                    accept="image/jpeg,image/png,image/webp"

                                                    onChange={(event) =>

                                                        setImagemEdicao(

                                                            event.target.files?.[0] ??

                                                            null

                                                        )

                                                    }

                                                />



                                                <i className="bi bi-image"></i>



                                                <span>

                                                    {imagemEdicao

                                                        ? imagemEdicao.name

                                                        : "Clique para trocar a imagem"}

                                                </span>

                                            </label>

                                        </div>

                                    </div>

                                </div>



                                {erroEdicao && (

                                    <p role="alert" style={{ color: "red" }}>

                                        {erroEdicao}

                                    </p>

                                )}



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

                                        onClick={salvarEdicao}

                                        disabled={salvando}

                                    >

                                        {salvando

                                            ? "Salvando..."

                                            : "Salvar Alterações"}

                                    </button>

                                </div>

                            </>

                        )}

                    </div>

                </div>

            </div>



            {/* MODAL NOVO PRODUTO */}

            <div

                className="modal fade"

                id="modalNovoProduto"

                tabIndex="-1"

                aria-hidden="true"

            >

                <div className="modal-dialog modal-xl modal-dialog-centered">

                    <div

                        className={`modal-content ${styles.modalEditar}`}

                    >

                        <div className={styles.modalCabecalho}>

                            <h2>Novo Produto</h2>

                            <p>

                                Preencha os dados abaixo para cadastrar

                                um novo produto no Instituto Recomeçar.

                            </p>

                        </div>



                        <div className="row g-4">

                            <div className="col-12 col-md-6">

                                <div className={styles.campo}>

                                    <label>Nome do Produto</label>

                                    <input

                                        type="text"

                                        name="nome"

                                        placeholder="Ex: Bolsa artesanal"

                                        value={novoProduto.nome}

                                        onChange={alterarCampo}

                                        required

                                    />

                                </div>



                                <div className={styles.campo}>

                                    <label>Categoria</label>

                                    <input

                                        type="text"

                                        name="categoria"

                                        placeholder="Ex: Artesanato"

                                        value={novoProduto.categoria}

                                        onChange={alterarCampo}

                                        required

                                    />

                                </div>



                                <div className="row g-3">

                                    <div className="col-6">

                                        <div className={styles.campo}>

                                            <label>Preço (R$)</label>

                                            <input

                                                type="text"

                                                name="preco"

                                                placeholder="0,00"

                                                value={novoProduto.preco}

                                                onChange={alterarCampo}

                                                required

                                            />

                                        </div>

                                    </div>



                                    <div className="col-6">

                                        <div className={styles.campo}>

                                            <label>Estoque Inicial</label>

                                            <input

                                                type="number"

                                                min="0"

                                                name="estoque"

                                                placeholder="0"

                                                value={novoProduto.estoque}

                                                onChange={alterarCampo}

                                                required

                                            />

                                        </div>

                                    </div>

                                </div>



                                <div className={styles.campo}>

                                    <label>

                                        Prazo de Produção (dias)

                                    </label>

                                    <input

                                        type="number"

                                        min="0"

                                        step="1"

                                        name="prazoProducaoDias"

                                        placeholder="Ex: 5"

                                        value={novoProduto.prazoProducaoDias}

                                        onChange={alterarCampo}

                                        required

                                    />

                                </div>



                                <CampoModalidades

                                    produto={novoProduto}

                                />

                            </div>



                            <div className="col-12 col-md-6">

                                <div className={styles.campo}>

                                    <label>Descrição</label>

                                    <textarea

                                        name="descricao"

                                        placeholder="Descreva detalhes do seu produto..."

                                        value={novoProduto.descricao}

                                        onChange={alterarCampo}

                                    />

                                </div>



                                <div className={styles.campo}>

                                    <label>Foto do Produto</label>
                                    <label
                                        className={styles.uploadImagem}>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(event) =>
                                                setImagemProduto(
                                                    event.target.files?.[0] ??
                                                    null
                                                )} />
                                        <i className="bi bi-image"></i>
                                        <span>
                                            {imagemProduto
                                                ? imagemProduto.name
                                                : "Clique para fazer upload ou arraste uma imagem"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {erroCadastro && (
                            <p role="alert" style={{ color: "red" }}>
                                {erroCadastro}
                            </p>
                        )}
                        <div className={styles.botoesModal}>
                            <button
                                type="button"
                                className={styles.btnCancelar}
                                data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className={styles.btnSalvar}
                                onClick={cadastrarProduto}
                                disabled={salvando}>
                                {salvando
                                    ? "Cadastrando..."
                                    : "Cadastrar Produto"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default GerenciarLoja;
