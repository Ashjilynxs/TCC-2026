/* ====================================================================
   MIGRACAO: Fluxo de solicitacao de vendedora
   Instituto Recomecar - BD: bd_instituto_recomencar (SQL Server)

   SCRIPT SEGURO e IDEMPOTENTE:
   - NAO apaga tabelas nem dados existentes.
   - Cada passo so executa se a estrutura ainda nao existir.
   - Pode ser executado mais de uma vez sem erro.

   EXECUTE COM AUTORIZACAO DA ADMINISTRACAO.
   ==================================================================== */
USE bd_instituto_recomencar;
GO

/* 1) Usuario.nivelAcesso: ampliar para suportar multiplos papeis
      (ex.: "USER,VENDEDORA"). Estava VARCHAR(10). */
IF COL_LENGTH('dbo.Usuario', 'nivelAcesso') IS NOT NULL
BEGIN
    ALTER TABLE dbo.Usuario ALTER COLUMN nivelAcesso VARCHAR(50) NULL;
    PRINT '1) Usuario.nivelAcesso ampliado para VARCHAR(50).';
END
GO

/* 2) Usuario.emailConfirmado: exigido para enviar solicitacao de vendedora.
      Padrao 0 (nao confirmado) para novos cadastros. AS CONTAS EXISTENTES
      NAO sao marcadas como confirmadas automaticamente: permanecem com 0 e
      precisam passar pelo fluxo normal de confirmacao de e-mail. */
IF COL_LENGTH('dbo.Usuario', 'emailConfirmado') IS NULL
BEGIN
    ALTER TABLE dbo.Usuario
        ADD emailConfirmado BIT NOT NULL
        CONSTRAINT DF_Usuario_emailConfirmado DEFAULT 0;

    PRINT '2) Usuario.emailConfirmado criado (contas existentes permanecem NAO confirmadas).';
END
GO

/* 3) Tabela de codigos de confirmacao de e-mail
      (espelha o padao da tabela RecuperarSenha). */
IF OBJECT_ID('dbo.ConfirmacaoEmail', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ConfirmacaoEmail
    (
        id          INT            IDENTITY,
        email       VARCHAR(255)   NOT NULL,
        codigo      CHAR(6)        NOT NULL,
        geradoEm    SMALLDATETIME  NOT NULL DEFAULT GETDATE(),
        expiraEm    SMALLDATETIME  NOT NULL,
        confirmado  BIT            NOT NULL DEFAULT 0,
        PRIMARY KEY (id)
    );
    PRINT '3) Tabela ConfirmacaoEmail criada.';
END
GO

/* 4) Tabela de solicitacoes de vendedora */
IF OBJECT_ID('dbo.SolicitacaoVendedora', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.SolicitacaoVendedora
    (
        id                     INT            IDENTITY,
        usuario_id             INT            NOT NULL,
        nomeLoja               VARCHAR(150)   NOT NULL,
        cpfCnpj                VARCHAR(20)    NOT NULL,
        telefone               VARCHAR(20)    NULL,
        cidade                 VARCHAR(100)   NULL,
        estado                 VARCHAR(50)    NULL,
        categoriaAtividade     VARCHAR(100)   NULL,
        descricaoAtividade     VARCHAR(2000)  NULL,
        status                 VARCHAR(20)    NOT NULL DEFAULT 'PENDENTE',
        dataSolicitacao        SMALLDATETIME  NOT NULL DEFAULT GETDATE(),
        dataAnalise            SMALLDATETIME  NULL,
        adminResponsavel_id    INT            NULL,
        justificativaRejeicao  VARCHAR(500)   NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (usuario_id)          REFERENCES dbo.Usuario(id),
        FOREIGN KEY (adminResponsavel_id) REFERENCES dbo.Usuario(id)
    );
    PRINT '4) Tabela SolicitacaoVendedora criada.';
END
GO

/* 5) Produto: categoria e modalidades de entrega
      (retirada, frete gratuito, frete fixo, a combinar). */
IF COL_LENGTH('dbo.Produto', 'categoria') IS NULL
BEGIN
    ALTER TABLE dbo.Produto ADD categoria VARCHAR(100) NULL;
    PRINT '5) Produto.categoria criada.';
END
GO

IF COL_LENGTH('dbo.Produto', 'modalidadesEntrega') IS NULL
BEGIN
    ALTER TABLE dbo.Produto ADD modalidadesEntrega VARCHAR(100) NULL;
    PRINT '5) Produto.modalidadesEntrega criada.';
END
GO

IF COL_LENGTH('dbo.Produto', 'valorFreteFixo') IS NULL
BEGIN
    ALTER TABLE dbo.Produto ADD valorFreteFixo DECIMAL(10,2) NULL;
    PRINT '5) Produto.valorFreteFixo criada.';
END
GO

PRINT '=== Migracao concluida com sucesso ===';
GO