-- ─────────────────────────────────────────────────────────────
--  schema.sql
--  Base de datos SQLite para DecisionApp
--  Se ejecuta automáticamente al arrancar la app
-- ─────────────────────────────────────────────────────────────

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- Problema: el contenedor principal de cada ejercicio
CREATE TABLE IF NOT EXISTS problemas (
    id                TEXT PRIMARY KEY,   -- UUID generado en Rust
    nombre            TEXT NOT NULL,
    descripcion       TEXT,
    tipo_valores      TEXT NOT NULL CHECK(tipo_valores IN ('utilidades', 'costos')),
    fecha_creado      TEXT NOT NULL,      -- ISO 8601
    fecha_modificado  TEXT NOT NULL
);

-- Alternativas: las filas de la matriz (decisiones posibles)
CREATE TABLE IF NOT EXISTS alternativas (
    id           TEXT PRIMARY KEY,
    problema_id  TEXT NOT NULL REFERENCES problemas(id) ON DELETE CASCADE,
    nombre       TEXT NOT NULL,
    orden        INTEGER NOT NULL
);

-- Estados de la naturaleza: las columnas de la matriz
CREATE TABLE IF NOT EXISTS estados_naturaleza (
    id           TEXT PRIMARY KEY,
    problema_id  TEXT NOT NULL REFERENCES problemas(id) ON DELETE CASCADE,
    nombre       TEXT NOT NULL,
    orden        INTEGER NOT NULL
);

-- Valores: cada casilla de la matriz
CREATE TABLE IF NOT EXISTS valores_matriz (
    id               TEXT PRIMARY KEY,
    problema_id      TEXT NOT NULL REFERENCES problemas(id) ON DELETE CASCADE,
    alternativa_id   TEXT NOT NULL REFERENCES alternativas(id) ON DELETE CASCADE,
    estado_id        TEXT NOT NULL REFERENCES estados_naturaleza(id) ON DELETE CASCADE,
    valor            REAL NOT NULL
);

-- Resultados guardados por criterio
CREATE TABLE IF NOT EXISTS resultados (
    id                    TEXT PRIMARY KEY,
    problema_id           TEXT NOT NULL REFERENCES problemas(id) ON DELETE CASCADE,
    criterio              TEXT NOT NULL CHECK(criterio IN ('laplace','hurwicz','maximax','maximin','savage')),
    alpha                 REAL,           -- solo para Hurwicz
    alternativa_ganadora  TEXT NOT NULL,
    valor_ganador         REAL NOT NULL,
    detalle_json          TEXT NOT NULL   -- JSON con pasos y valores completos
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_alternativas_problema  ON alternativas(problema_id);
CREATE INDEX IF NOT EXISTS idx_estados_problema       ON estados_naturaleza(problema_id);
CREATE INDEX IF NOT EXISTS idx_valores_problema       ON valores_matriz(problema_id);
CREATE INDEX IF NOT EXISTS idx_resultados_problema    ON resultados(problema_id);
CREATE INDEX IF NOT EXISTS idx_problemas_fecha        ON problemas(fecha_modificado DESC);
