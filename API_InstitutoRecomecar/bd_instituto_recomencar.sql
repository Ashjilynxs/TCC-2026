Use bd_instituto_recomencar 
-- ============================================================
-- SCHEMA DO BANCO - Instituto Recomeçar
-- Atualizado na limpeza estrutural (15/10/2026):
--   REMOVIDAS as tabelas: Agendamento, Avaliacao, Conversa, Curso,
--   EmpresaParceira, HorarioAtendimento, InscricaoCurso, ItemPedido,
--   Loja, Mensagem, MensagemConversa, Notificacao, Pagamento,
--   Pagina, Pedido e Reembolso - junto com todas as FKs que
--   apontavam para elas (inclusive a coluna legada Produto.loja_id).
--
--   TABELAS RESTANTES: Usuario, RecuperarSenha, ConfirmacaoEmail*,
--   Produto, ProdutoImagem, Psicologo, SolicitacaoVendedora*
--   (* criadas em migration_solicitacao_vendedora.sql)
--
--   Observação: o Hibernate NÃO recria as tabelas removidas
--   (spring.jpa.hibernate.ddl-auto=none).
-- ============================================================

-- ============================================================
-- USUARIAS (também usadas para login)
-- ============================================================
CREATE TABLE Usuario
(
   id                INT             IDENTITY,
   nome              VARCHAR(254)    NOT NULL,
   username          VARCHAR(255)    NOT NULL UNIQUE,
   password          VARCHAR(100)    NOT NULL,
   nivelAcesso       VARCHAR(10)     NOT NULL DEFAULT 'USER', -- ADMIN ou USER
   dataCadastro      SMALLDATETIME   NOT NULL DEFAULT GETDATE(),
   dataAtualizacao   SMALLDATETIME   NULL,
   statusUsuario     VARCHAR(20)     NOT NULL, -- ATIVO / INATIVO / TROCAR_SENHA
   PRIMARY KEY (id)
);
GO
-- '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi' = 12345678
INSERT Usuario (nome, username, password, nivelAcesso, dataCadastro, statusUsuario) VALUES
('Instituto Recomeçar - Administração', 'admin@institutorecomencar.org', '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'ADMIN', GETDATE(), 'ATIVO'),
('Maria da Silva', 'maria@email.com.br', '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'USER', GETDATE(), 'ATIVO'),
('Joana Pereira', 'joana@email.com.br', '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'USER', GETDATE(), 'ATIVO'),
('Ana Costa', 'ana.costa@email.com.br', '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'USER', GETDATE(), 'ATIVO');
GO

-- ============================================================
-- RECUPERAÇÃO DE SENHA
-- ============================================================
CREATE TABLE RecuperarSenha
(
   id              INT             IDENTITY,
   email           VARCHAR(254)    NOT NULL, -- username
   codigo          CHAR(6)         NOT NULL,
   geradoEm        SMALLDATETIME   NOT NULL DEFAULT GETDATE(),
   expiraEm        SMALLDATETIME   NOT NULL,
   statusCodigo    BIT             NOT NULL DEFAULT 1, -- 1 = ATIVO, 0 = INATIVO
   PRIMARY KEY (id)
);
GO

-- ============================================================
-- MARKETPLACE - PRODUTOS (vinculados à vendedora responsável)
-- ============================================================
CREATE TABLE Produto
(
   id                  INT             IDENTITY,
   nome                VARCHAR(200)    NOT NULL,
   descricao           VARCHAR(2000)   NULL,
   categoria           VARCHAR(100)    NULL,
   preco               DECIMAL(10,2)   NOT NULL,
   estoque             INT             NOT NULL DEFAULT 0,
   prazoProducaoDias   INT             NULL,
   modalidadesEntrega  VARCHAR(100)    NULL,
   valorFreteFixo      DECIMAL(10,2)   NULL,
   imagemUrl           VARCHAR(500)    NULL,
   status              VARCHAR(10)     NOT NULL DEFAULT 'ATIVO', -- ATIVO ou INATIVO
   dataCadastro        SMALLDATETIME   NOT NULL DEFAULT GETDATE(),
   dataAtualizacao     SMALLDATETIME   NULL,
   vendedora_id        INT             NOT NULL,
   PRIMARY KEY (id),
   FOREIGN KEY (vendedora_id) REFERENCES Usuario(id)
);

CREATE TABLE ProdutoImagem
(
   id           INT            IDENTITY,
   produto_id   INT            NOT NULL,
   url          VARCHAR(500)   NOT NULL,
   PRIMARY KEY (id),
   FOREIGN KEY (produto_id) REFERENCES Produto(id)
);
GO

-- ============================================================
-- APOIO PSICOLÓGICO
-- Os psicólogos precisam ter o CRP validado/aprovado pelo admin
-- ============================================================
CREATE TABLE Psicologo
(
   id                 INT             IDENTITY,
   usuario_id         INT             NOT NULL UNIQUE,
   crp                VARCHAR(20)     NOT NULL UNIQUE,
   especialidade      VARCHAR(150)    NULL,
   resumo             VARCHAR(2000)   NULL,
   statusCadastro     VARCHAR(20)     NOT NULL DEFAULT 'PENDENTE', -- PENDENTE / APROVADO / REJEITADO
   motivoRejeicao     VARCHAR(500)    NULL,
   dataCadastro       SMALLDATETIME   NOT NULL DEFAULT GETDATE(),
   dataAprovacao      SMALLDATETIME   NULL,
   PRIMARY KEY (id),
   FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);
GO
INSERT Psicologo (usuario_id, crp, especialidade, resumo, statusCadastro, dataCadastro, dataAprovacao)
VALUES (4, '06/123456', 'Psicologia positiva', 'Atendimento acolhedor para mulheres empreendedoras.', 'APROVADO', GETDATE(), GETDATE());
GO

-- ============================================================
-- Tabelas ConfirmacaoEmail e SolicitacaoVendedora:
-- ver migration_solicitacao_vendedora.sql
-- ============================================================
