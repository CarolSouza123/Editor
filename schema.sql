-- Corta Silêncio, banco D1 da nuvem.
-- A API cria esta tabela sozinha na primeira chamada.
-- Este arquivo fica só como referência, não precisa rodar na mão.
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT,
  meta TEXT,
  updated_at INTEGER
);
