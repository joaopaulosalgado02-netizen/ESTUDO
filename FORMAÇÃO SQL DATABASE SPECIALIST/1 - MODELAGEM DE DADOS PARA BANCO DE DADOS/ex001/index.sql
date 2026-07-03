DROP DATABASE IF EXISTS registro_de_alunos;

CREATE DATABASE registro_de_alunos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE registro_de_alunos;

CREATE TABLE editoras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_editora VARCHAR(120) NOT NULL UNIQUE,
  pais CHAR(2) NOT NULL
);

CREATE TABLE periodicos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_periodico VARCHAR(120) NOT NULL,
  issn CHAR(9) NOT NULL UNIQUE,
  id_editora INT NOT NULL,
  CONSTRAINT fk_periodicos_editoras
    FOREIGN KEY (id_editora)
    REFERENCES editoras(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

INSERT INTO editoras (nome_editora, pais)
VALUES
  ('IEEE', 'BR'),
  ('dataScience', 'US');

INSERT INTO periodicos (nome_periodico, issn, id_editora)
VALUES
  ('Revista de Ciência', '1234-5678', 1),
  ('Revista de Tecnologia', '8765-4321', 2);

SELECT
  p.id,
  p.nome_periodico,
  p.issn,
  e.nome_editora,
  e.pais
FROM periodicos p
JOIN editoras e ON p.id_editora = e.id;