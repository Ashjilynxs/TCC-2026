USE master;
GO

CREATE LOGIN instituto_api
WITH PASSWORD = 'Daniele_2906';
GO

USE bd_instituto_recomencar;
GO

CREATE USER instituto_api FOR LOGIN instituto_api;
GO

ALTER ROLE db_datareader ADD MEMBER instituto_api;
ALTER ROLE db_datawriter ADD MEMBER instituto_api;
GO

alter LOGIN instituto_api
WITH PASSWORD = 'Daniele_2906';