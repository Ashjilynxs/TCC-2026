package br.itb.projeto.pizzaria.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import br.itb.projeto.pizzaria.model.entity.Produto;
import br.itb.projeto.pizzaria.model.entity.ProdutoImagem;
import br.itb.projeto.pizzaria.service.ProdutoService;

@RestController
public class ProdutoController {
    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping("/produtos")
    public List<Produto> catalogo() { return produtoService.catalogo(); }

    @GetMapping("/produtos/{id}")
    public ResponseEntity<Produto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.findById(id));
    }

    @GetMapping("/produtos/{id}/imagens")
    public List<ProdutoImagem> imagens(@PathVariable Long id) {
        return produtoService.imagens(id);
    }

    @GetMapping("/produtos/meus")
    public List<Produto> meusProdutos(Authentication authentication) {
        return produtoService.meusProdutos(authentication.getName());
    }

    @GetMapping("/produtos/vendedora/{vendedoraId}")
    public List<Produto> produtosDaVendedora(@PathVariable Long vendedoraId) {
        return produtoService.produtosPublicosDaVendedora(vendedoraId);
    }

    @PostMapping("/produtos")
    public ResponseEntity<Produto> criar(Authentication authentication, @RequestBody Produto produto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(produtoService.criar(authentication.getName(), produto));
    }

    @PutMapping("/produtos/{id}")
    public ResponseEntity<Produto> editar(@PathVariable Long id, Authentication authentication,
            @RequestBody Produto produto) {
        return ResponseEntity.ok(produtoService.editar(authentication.getName(), id, produto));
    }

    @PutMapping("/produtos/{id}/inativar")
    public ResponseEntity<Produto> inativar(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(produtoService.inativarProprio(authentication.getName(), id));
    }

    @PostMapping(value = "/produtos/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImagem(@PathVariable Long id, Authentication authentication,
            @RequestPart("imagem") MultipartFile imagem) throws IOException {
        if (imagem.isEmpty()) return ResponseEntity.badRequest().body("Selecione uma imagem.");
        if (imagem.getSize() > 5 * 1024 * 1024) return ResponseEntity.badRequest().body("Máximo de 5 MB.");
        String tipo = imagem.getContentType();
        if (!"image/jpeg".equals(tipo) && !"image/png".equals(tipo) && !"image/webp".equals(tipo))
            return ResponseEntity.badRequest().body("Envie JPG, PNG ou WEBP.");
        produtoService.validarPermissaoProduto(authentication.getName(), id);
        String extensao = "image/jpeg".equals(tipo) ? ".jpg" : "image/png".equals(tipo) ? ".png" : ".webp";
        Path pasta = Paths.get("uploads", "produtos");
        Files.createDirectories(pasta);
        Path destino = pasta.resolve(UUID.randomUUID().toString() + extensao);
        Files.copy(imagem.getInputStream(), destino);
        String url = "/uploads/produtos/" + destino.getFileName();
        produtoService.atualizarImagem(authentication.getName(), id, url);
        return ResponseEntity.ok(Map.of("imagemUrl", url));
    }

    @PostMapping("/produtos/{id}/imagens")
    public ResponseEntity<ProdutoImagem> adicionarImagem(@PathVariable Long id,
            Authentication authentication, @RequestParam String url) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(produtoService.adicionarImagem(authentication.getName(), id, url));
    }

    @DeleteMapping("/produtos/{id}/imagens/{imagemId}")
    public ResponseEntity<Void> removerImagem(@PathVariable Long id,
            @PathVariable Long imagemId, Authentication authentication) {
        produtoService.validarPermissaoProduto(authentication.getName(), id);
        produtoService.removerImagem(authentication.getName(), imagemId);
        return ResponseEntity.noContent().build();
    }
}
