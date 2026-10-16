use bd_instituto_recomencar

SELECT name
FROM sys.tables
ORDER BY name;

SELECT *
FROM Usuario;

UPDATE Usuario
SET nivelAcesso = 'VENDEDORA'
WHERE id = 5;

SELECT * FROM Loja;

UPDATE Usuario
SET nivelAcesso = 'PSICOLOGO'
WHERE id = 7;