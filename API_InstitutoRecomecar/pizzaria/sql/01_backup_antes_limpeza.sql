/* ============================================================
   SCRIPT 1 — BACKUP COMPLETO do banco bd_instituto_recomencar
   Executar ANTES de qualquer exclusão.
   Gera um .bak recuperável no diretório de backup padrão do
   SQL Server (com fallback para a pasta Backup da instância).
   Em caso de falha, o script aborta com erro (RAISERROR).
   ============================================================ */

USE [master];
GO

SET NOCOUNT ON;

DECLARE @dir NVARCHAR(400);
DECLARE @arquivo NVARCHAR(500);
DECLARE @erro INT;

/* 1) Diretório padrão configurado, se existir */
SELECT @dir = CAST(SERVERPROPERTY('BackupDirectory') AS NVARCHAR(400));

/* 2) Fallback: pasta Backup oficial da instância SQLEXPRESS01 */
IF @dir IS NULL OR @dir = N''
    SET @dir = N'C:\Program Files\Microsoft SQL Server\MSSQL17.SQLEXPRESS01\MSSQL\Backup';

IF RIGHT(@dir, 1) <> N'\'
    SET @dir = @dir + N'\';

SET @arquivo = @dir
    + N'bd_instituto_recomencar_pre_limpeza_'
    + REPLACE(CONVERT(NVARCHAR(8), GETDATE(), 112), N'-', N'')
    + N'_' + REPLACE(CONVERT(NVARCHAR(8), GETDATE(), 108), N':', N'')
    + N'.bak';

PRINT N'Destino do backup: ' + @arquivo;

/* 3) BACKUP com verificação de erro */
BACKUP DATABASE [bd_instituto_recomencar]
TO DISK = @arquivo
WITH INIT,
     NAME = N'Backup pre-limpeza estrutural - antes de remover tabelas',
     DESCRIPTION = N'Backup completo gerado antes da remocao das tabelas: Agendamento, Avaliacao, Conversa, Curso, EmpresaParceira, HorarioAtendimento, InscricaoCurso, ItemPedido, Loja, Mensagem, MensagemConversa, Notificacao, Pagamento, Pagina, Pedido, Reembolso.';

SET @erro = @@ERROR;
IF @erro <> 0
BEGIN
    RAISERROR (N'FALHA NO BACKUP - nenhum script de exclusao pode ser executado.', 16, 1);
    RETURN;
END

PRINT N'BACKUP CONCLUIDO COM SUCESSO: ' + @arquivo;

/* 4) Verificação de integridade do arquivo gerado */
RESTORE VERIFYONLY FROM DISK = @arquivo;

SET @erro = @@ERROR;
IF @erro <> 0
BEGIN
    RAISERROR (N'FALHA NA VERIFICACAO DO BACKUP.', 16, 1);
    RETURN;
END

PRINT N'VERIFICACAO DO BACKUP OK - arquivo utilizavel para restauracao.';
GO
