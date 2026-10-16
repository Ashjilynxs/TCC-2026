/* ====================================================================
   MIGRACAO: Recuperacao de senha por token + registro de decisao
   administrativa de psicologas
   Instituto Recomecar - BD: bd_instituto_recomencar (SQL Server)

   SCRIPT SEGURO e IDEMPOTENTE:
   - NAO apaga tabelas, colunas nem dados existentes.
   - Cada passo so executa se a estrutura ainda nao existir.
   - Pode ser executado mais de uma vez sem erro.
   - Nenhuma linha de Usuario ou outra tabela e alterada.

   TABELAS MODIFICADAS (somente adicao de colunas):
   1) Psicologo          + adminResponsavel_id (FK -> Usuario.id)
   2) Psicologo          + dataDecisao
   3) RecuperarSenha     + token (link seguro de uso unico)
   4) ConfirmacaoEmail   + token (link seguro de uso unico)
   ==================================================================== */
USE bd_instituto_recomencar;
GO

/* 1) Psicologo.adminResponsavel: qual administrador decidiu. */
IF COL_LENGTH('dbo.Psicologo', 'adminResponsavel_id') IS NULL
BEGIN
    ALTER TABLE dbo.Psicologo ADD adminResponsavel_id INT NULL;
    ALTER TABLE dbo.Psicologo ADD CONSTRAINT FK_Psicologo_AdminResponsavel
        FOREIGN KEY (adminResponsavel_id) REFERENCES dbo.Usuario(id);
    PRINT '1) Psicologo.adminResponsavel_id criado (FK -> Usuario).';
END
GO

/* 2) Psicologo.dataDecisao: data da aprovacao / recusa. */
IF COL_LENGTH('dbo.Psicologo', 'dataDecisao') IS NULL
BEGIN
    ALTER TABLE dbo.Psicologo ADD dataDecisao DATETIME NULL;
    PRINT '2) Psicologo.dataDecisao criado.';
END
GO

/* 3) RecuperarSenha.token: token aleatorio de uso unico enviado por link. */
IF COL_LENGTH('dbo.RecuperarSenha', 'token') IS NULL
BEGIN
    ALTER TABLE dbo.RecuperarSenha ADD token VARCHAR(64) NULL;
    PRINT '3) RecuperarSenha.token criado.';
END
GO
IF COL_LENGTH('dbo.RecuperarSenha', 'token') IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM sys.indexes
                   WHERE name = 'UX_RecuperarSenha_token'
                     AND object_id = OBJECT_ID('dbo.RecuperarSenha'))
BEGIN
    SET QUOTED_IDENTIFIER ON;
    CREATE UNIQUE INDEX UX_RecuperarSenha_token
        ON dbo.RecuperarSenha(token)
        WHERE token IS NOT NULL;
    PRINT '3b) Indice unico UX_RecuperarSenha_token criado.';
END
GO

/* 4) ConfirmacaoEmail.token: token aleatorio de uso unico enviado por link. */
IF COL_LENGTH('dbo.ConfirmacaoEmail', 'token') IS NULL
BEGIN
    ALTER TABLE dbo.ConfirmacaoEmail ADD token VARCHAR(64) NULL;
    PRINT '4) ConfirmacaoEmail.token criado.';
END
GO
IF COL_LENGTH('dbo.ConfirmacaoEmail', 'token') IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM sys.indexes
                   WHERE name = 'UX_ConfirmacaoEmail_token'
                     AND object_id = OBJECT_ID('dbo.ConfirmacaoEmail'))
BEGIN
    SET QUOTED_IDENTIFIER ON;
    CREATE UNIQUE INDEX UX_ConfirmacaoEmail_token
        ON dbo.ConfirmacaoEmail(token)
        WHERE token IS NOT NULL;
    PRINT '4b) Indice unico UX_ConfirmacaoEmail_token criado.';
END
GO

PRINT '=== Migracao recuperacao/verificacoes concluida ===';
GO
