-- Colunas para suporte ao pipeline n8n
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS source        TEXT,
  ADD COLUMN IF NOT EXISTS source_id     TEXT,
  ADD COLUMN IF NOT EXISTS source_url    TEXT,
  ADD COLUMN IF NOT EXISTS employees     INTEGER;

-- Índice para evitar duplicados por source + source_id
CREATE UNIQUE INDEX IF NOT EXISTS businesses_source_unique
  ON businesses (source, source_id)
  WHERE source IS NOT NULL AND source_id IS NOT NULL;

-- Status 'imported' já deve existir mas garantimos que o check aceita
-- (adaptar se a coluna status tiver enum constraint)
