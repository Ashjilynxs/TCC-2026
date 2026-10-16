/* ============================================================
   SCRIPT 2 — REMOÇÃO DAS 16 TABELAS (executar SOMENTE após o
   script 01 de backup e após autorização do responsável)

   Tabelas removidas:
     Agendamento, Avaliacao, Conversa, Curso, EmpresaParceira,
     HorarioAtendimento, InscricaoCurso, ItemPedido, Loja, Mensagem,
     MensagemConversa, Notificacao, Pagamento, Pagina, Pedido, Reembolso

   O script:
     1. Remove TODAS as chaves estrangeiras que apontam PARA essas
        tabelas (inclui a FK legada Produto.loja_id -> Loja, cuja
        coluna não existe mais na entidade JPA Produto);
     2. Remove as 16 tabelas (ordem irrelevante após passo 1);
     3. Remove a coluna órfã Produto.loja_id;
     4. Mostra o estado final (tabelas e FKs remanescentes).

   As tabelas mantidas (Usuario, Produto, ProdutoImagem, Psicologo,
   SolicitacaoVendedora, ConfirmacaoEmail, RecuperarSenha) NÃO são
   alteradas — nenhum dado nelas é afetado.
   ============================================================ */

USE [bd_instituto_recomencar];
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

DECLARE @tabelas TABLE (nome SYSNAME PRIMARY KEY);
INSERT INTO @tabelas (nome) VALUES
 ('Agendamento'), ('Avaliacao'), ('Conversa'), ('Curso'),
 ('EmpresaParceira'), ('HorarioAtendimento'), ('InscricaoCurso'),
 ('ItemPedido'), ('Loja'), ('Mensagem'), ('MensagemConversa'),
 ('Notificacao'), ('Pagamento'), ('Pagina'), ('Pedido'), ('Reembolso');

DECLARE @sql NVARCHAR(MAX) = N'';

/* ---- 1. Chaves estrangeiras que apontam para tabelas removidas ---- */
SELECT @sql = @sql
    + N'ALTER TABLE ' + QUOTENAME(OBJECT_NAME(fk.parent_object_id))
    + N' DROP CONSTRAINT ' + QUOTENAME(fk.name) + N';' + CHAR(13)
FROM sys.foreign_keys fk
WHERE OBJECT_NAME(fk.referenced_object_id) IN (SELECT nome FROM @tabelas)
ORDER BY OBJECT_NAME(fk.parent_object_id), fk.name;

IF @sql <> N''
BEGIN
    PRINT N'---- Chaves estrangeiras removidas ----';
    PRINT @sql;
    EXEC sys.sp_executesql @sql;
END

/* ---- 2. Remoção das tabelas ---- */
SET @sql = N'';
SELECT @sql = @sql
    + N'DROP TABLE ' + QUOTENAME(name) + N';' + CHAR(13)
FROM sys.tables
WHERE name IN (SELECT nome FROM @tabelas)
ORDER BY name;

IF @sql <> N''
BEGIN
    PRINT N'---- Tabelas removidas ----';
    PRINT @sql;
    EXEC sys.sp_executesql @sql;
END

/* ---- 3. Coluna legada órfã Produto.loja_id (sem correspondência
       na entidade JPA Produto; tabela Produto sem registros) ---- */
IF COL_LENGTH('Produto', 'loja_id') IS NOT NULL
   AND NOT EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE parent_object_id = OBJECT_ID('Produto')
          AND referenced_object_id = OBJECT_ID('Loja'))
BEGIN
    ALTER TABLE dbo.Produto DROP COLUMN loja_id;
    PRINT N'Coluna legada Produto.loja_id removida (FK ja removida no passo 1).';
END

COMMIT TRANSACTION;
GO

/* ---- 4. Validação final ---- */
PRINT N'---- Tabelas restantes ----';
SELECT t.name AS tabela, SUM(p.rows) AS linhas
FROM sys.tables t
JOIN sys.partitions p ON t.object_id = p.object_id AND p.index_id IN (0, 1)
GROUP BY t.name
ORDER BY t.name;

PRINT N'---- Chaves estrangeiras restantes ----';
SELECT fk.name AS fk,
       OBJECT_NAME(fk.parent_object_id) AS tabela_filha,
       OBJECT_NAME(fk.referenced_object_id) AS tabela_pai
FROM sys.foreign_keys fk
ORDER BY tabela_filha, fk;
GO
