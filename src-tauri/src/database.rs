// ─────────────────────────────────────────────────────────────
//  database.rs
//  Abre la base de datos SQLite y ejecuta las migraciones
// ─────────────────────────────────────────────────────────────

use rusqlite::{Connection, Result};
use std::path::Path;

pub fn abrir_bd(ruta: &Path) -> Result<Connection> {
    let conn = Connection::open(ruta)?;

    // Configuración de rendimiento
    conn.execute_batch("
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
    ")?;

    // Ejecutar migraciones (crear tablas si no existen)
    let schema = include_str!("../migrations/schema.sql");
    conn.execute_batch(schema)?;

    Ok(conn)
}
