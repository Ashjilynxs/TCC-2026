
package br.itb.projeto.pizzaria.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import br.itb.projeto.pizzaria.model.entity.Produto;
import br.itb.projeto.pizzaria.model.entity.ProdutoImagem;
import br.itb.projeto.pizzaria.model.entity.Usuario;
import br.itb.projeto.pizzaria.model.repository.ProdutoImagemRepository;
import br.itb.projeto.pizzaria.model.repository.ProdutoRepository;
import br.itb.projeto.pizzaria.model.repository.UsuarioRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final ProdutoImagemRepository produtoImagemRepository;
    private final UsuarioRepository usuarioRepository;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            ProdutoImagemRepository produtoImagemRepository,
            UsuarioRepository usuarioRepository) {

        this.produtoRepository = produtoRepository;
        this.produtoImagemRepository = produtoImagemRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // PERMISSOES

    public void validarPermissaoProduto(String username, Long id) {
        Produto produto = findById(id);
        validarDono(username, produto.getVendedora());
    }

    // CADASTRAR PRODUTO

    public Produto criar(String username, Produto produto) {

        Usuario vendedora = usuarioLogado(username);

        if (!temPapel(vendedora, "VENDEDORA")) {
            throw new IllegalArgumentException(
                "Apenas vendedoras aprovadas podem cadastrar produtos."
            );
        }

        validarDados(produto);

        Produto novo = new Produto();

        novo.setVendedora(vendedora);
        copiarDados(produto, novo);

        novo.setStatus("ATIVO");
        novo.setDataCadastro(LocalDateTime.now());

        return produtoRepository.save(novo);
    }

    // EDITAR PRODUTO

    public Produto editar(String username, Long id, Produto dados) {

        Produto produto = findById(id);

        validarDono(username, produto.getVendedora());
        validarDados(dados);

        copiarDados(dados, produto);

        if (dados.getImagemUrl() != null) {
            produto.setImagemUrl(dados.getImagemUrl());
        }

        produto.setDataAtualizacao(LocalDateTime.now());

        return produtoRepository.save(produto);
    }

    // IMAGEM PRINCIPAL

    public Produto atualizarImagem(
            String username,
            Long id,
            String imagemUrl) {

        Produto produto = findById(id);

        validarDono(username, produto.getVendedora());

        produto.setImagemUrl(imagemUrl);
        produto.setDataAtualizacao(LocalDateTime.now());

        return produtoRepository.save(produto);
    }

    // ATIVAR E INATIVAR

    public Produto inativar(Long id) {

        Produto produto = findById(id);

        produto.setStatus("INATIVO");
        produto.setDataAtualizacao(LocalDateTime.now());

        return produtoRepository.save(produto);
    }

    public Produto inativarProprio(String username, Long id) {

        Produto produto = findById(id);

        validarDono(username, produto.getVendedora());

        return inativar(id);
    }

    public Produto ativar(Long id) {

        Produto produto = findById(id);

        produto.setStatus("ATIVO");
        produto.setDataAtualizacao(LocalDateTime.now());

        return produtoRepository.save(produto);
    }

    // IMAGENS ADICIONAIS

    public ProdutoImagem adicionarImagem(
            String username,
            Long produtoId,
            String url) {

        Produto produto = findById(produtoId);

        validarDono(username, produto.getVendedora());

        ProdutoImagem imagem = new ProdutoImagem();
        imagem.setProduto(produto);
        imagem.setUrl(url);

        return produtoImagemRepository.save(imagem);
    }

    public void removerImagem(String username, Long imagemId) {

        ProdutoImagem imagem = produtoImagemRepository.findById(imagemId)
                .orElseThrow(() ->
                    new RuntimeException("Imagem nao encontrada")
                );

        validarDono(
            username,
            imagem.getProduto().getVendedora()
        );

        produtoImagemRepository.delete(imagem);
    }

    public List<ProdutoImagem> imagens(Long produtoId) {
        return produtoImagemRepository.findByProdutoId(produtoId);
    }

    // CATALOGO PUBLICO

    public List<Produto> catalogo() {
        return produtoRepository
                .findByStatusOrderByDataCadastroDesc("ATIVO");
    }

    // PRODUTOS DE UMA VENDEDORA

    public List<Produto> produtosPublicosDaVendedora(Long vendedoraId) {
        return produtoRepository
                .findByVendedoraIdAndStatus(vendedoraId, "ATIVO");
    }

    // MEUS PRODUTOS

    public List<Produto> meusProdutos(String username) {

        Usuario usuario = usuarioLogado(username);

        if (!temPapel(usuario, "VENDEDORA")
                && !temPapel(usuario, "ADMIN")) {
            throw new IllegalArgumentException(
                "Usuario sem permissao para consultar produtos de vendedora."
            );
        }

        return produtoRepository.findByVendedoraId(usuario.getId());
    }

    // CONSULTAS GERAIS

    public Produto findById(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Produto nao encontrado")
                );
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    // AUXILIARES

    private void copiarDados(Produto origem, Produto destino) {

        destino.setNome(origem.getNome());
        destino.setDescricao(origem.getDescricao());
        destino.setCategoria(origem.getCategoria());
        destino.setPreco(origem.getPreco());
        destino.setEstoque(origem.getEstoque());
        destino.setPrazoProducaoDias(origem.getPrazoProducaoDias());
        destino.setModalidadesEntrega(origem.getModalidadesEntrega());
        destino.setValorFreteFixo(origem.getValorFreteFixo());

        if (origem.getImagemUrl() != null) {
            destino.setImagemUrl(origem.getImagemUrl());
        }
    }

    private void validarDados(Produto produto) {

        if (produto.getNome() == null ||
                produto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException(
                "Informe o nome do produto."
            );
        }

        if (produto.getDescricao() == null ||
                produto.getDescricao().trim().isEmpty()) {
            throw new IllegalArgumentException(
                "Informe a descricao do produto."
            );
        }

        if (produto.getCategoria() == null ||
                produto.getCategoria().trim().isEmpty()) {
            throw new IllegalArgumentException(
                "Informe a categoria do produto."
            );
        }

        if (produto.getPreco() == null ||
                produto.getPreco().signum() <= 0) {
            throw new IllegalArgumentException(
                "Informe um preco valido."
            );
        }

        if (produto.getEstoque() < 0) {
            throw new IllegalArgumentException(
                "O estoque nao pode ser negativo."
            );
        }

        if (produto.getPrazoProducaoDias() == null ||
                produto.getPrazoProducaoDias() < 0) {
            throw new IllegalArgumentException(
                "Informe o prazo de producao em dias."
            );
        }

        if (produto.getModalidadesEntrega() == null ||
                produto.getModalidadesEntrega().trim().isEmpty()) {
            throw new IllegalArgumentException(
                "Informe ao menos uma modalidade de entrega."
            );
        }
    }

    private Usuario usuarioLogado(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() ->
                    new RuntimeException("Usuario nao encontrado")
                );
    }

    private boolean temPapel(Usuario usuario, String papel) {

        if (usuario.getNivelAcesso() == null) {
            return false;
        }

        return Arrays.stream(usuario.getNivelAcesso().split(","))
                .map(String::trim)
                .anyMatch(papel::equalsIgnoreCase);
    }

    private void validarDono(String username, Usuario vendedora) {

        Usuario usuario = usuarioLogado(username);

        boolean dono = vendedora != null
                && vendedora.getId().equals(usuario.getId());

        boolean admin = temPapel(usuario, "ADMIN");

        if (!dono && !admin) {
            throw new RuntimeException(
                "Voce nao tem permissao para alterar este produto."
            );
        }
    }
}
