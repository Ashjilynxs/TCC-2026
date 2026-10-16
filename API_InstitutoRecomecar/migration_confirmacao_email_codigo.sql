/* ====================================================================
   MIGRACAO: Confirmacao email por CODIGO de 6 digitos (substitui o link)
   ====================================================================
   - Adiciona a coluna de controle de tentativas (limite de 5).
   - NAO apaga nem altera registros existentes: a migration e apenas
     ADITIVA (DEFAULT 0 preserva as linhas ja gravadas).
   - A coluna 'codigo' (CHAR(6)) ja existe e passa a ser o codigo
     efetivamente enviado por e-mail (validade 10 minutos, uso unico).
   - A coluna 'token' e mantida (registros antigos); novos registros
     deixam de preenche-la.
   ==================================================================== */
USE bd_instituto_recomencar;
GO

/* Exigido para ALTER TABLE com constraint em sessões sqlcmd/ODBC */
SET QUOTED_IDENTIFIER ON;
GO


IF COL_LENGTH('dbo.ConfirmacaoEmail', 'tentativas') IS NULL
BEGIN
    ALTER TABLE dbo.ConfirmacaoEmail ADD tentativas INT NOT NULL
        CONSTRAINT DF_ConfirmacaoEmail_tentativas DEFAULT 0;
    PRINT 'ConfirmacaoEmail.tentativas criada (DEFAULT 0).';
END
ELSE
BEGIN
    PRINT 'ConfirmacaoEmail.tentativas ja existe. Nada a fazer.';
END
GO
