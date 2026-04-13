// ─────────────────────────────────────────────────────────────
//  commands/historial.rs
//  CRUD de problemas en SQLite
// ─────────────────────────────────────────────────────────────

use tauri::{command, State};
use rusqlite::params;
use uuid::Uuid;
use chrono::Utc;
use std::sync::Mutex;
use rusqlite::Connection;

use crate::models::problema::{NuevoProblema, ResumenProblema};

pub struct DbState(pub Mutex<Connection>);

/// Lista todos los problemas guardados (solo el resumen)
#[command]
pub fn listar_problemas(db: State<DbState>) -> Result<Vec<ResumenProblema>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare("
        SELECT
            p.id, p.nombre, p.descripcion,
            p.fecha_creado, p.fecha_modificado, p.tipo_valores,
            (SELECT COUNT(*) FROM alternativas WHERE problema_id = p.id) AS cant_alt,
            (SELECT COUNT(*) FROM estados_naturaleza WHERE problema_id = p.id) AS cant_est,
            (SELECT r.alternativa_ganadora
             FROM resultados r
             WHERE r.problema_id = p.id
             GROUP BY r.alternativa_ganadora
             ORDER BY COUNT(*) DESC LIMIT 1) AS ganador
        FROM problemas p
        ORDER BY p.fecha_modificado DESC
    ").map_err(|e| e.to_string())?;

    let problemas = stmt.query_map([], |row| {
        Ok(ResumenProblema {
            id:                   row.get(0)?,
            nombre:               row.get(1)?,
            descripcion:          row.get(2)?,
            fecha_creado:         row.get(3)?,
            fecha_modificado:     row.get(4)?,
            tipo_valores:         row.get(5)?,
            cantidad_alternativas: row.get(6)?,
            cantidad_estados:     row.get(7)?,
            ganador_global:       row.get(8)?,
        })
    })
    .map_err(|e| e.to_string())?
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| e.to_string())?;

    Ok(problemas)
}

/// Guarda un nuevo problema en la base de datos
#[command]
pub fn guardar_problema(
    db: State<DbState>,
    problema: NuevoProblema,
) -> Result<String, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let ahora = Utc::now().to_rfc3339();
    let id_problema = Uuid::new_v4().to_string();

    // Insertar problema
    conn.execute(
        "INSERT INTO problemas (id, nombre, descripcion, tipo_valores, fecha_creado, fecha_modificado)
         VALUES (?1, ?2, ?3, ?4, ?5, ?5)",
        params![id_problema, problema.nombre, problema.descripcion, problema.tipo_valores, ahora],
    ).map_err(|e| e.to_string())?;

    // Insertar alternativas
    for (i, nombre) in problema.nombres_alternativas.iter().enumerate() {
        let id_alt = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO alternativas (id, problema_id, nombre, orden) VALUES (?1, ?2, ?3, ?4)",
            params![id_alt, id_problema, nombre, i as i32],
        ).map_err(|e| e.to_string())?;
    }

    // Insertar estados
    for (j, nombre) in problema.nombres_estados.iter().enumerate() {
        let id_est = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO estados_naturaleza (id, problema_id, nombre, orden) VALUES (?1, ?2, ?3, ?4)",
            params![id_est, id_problema, nombre, j as i32],
        ).map_err(|e| e.to_string())?;
    }

    // Insertar valores de la grilla
    // Necesitamos los IDs recién insertados
    let ids_alt: Vec<String> = {
        let mut s = conn.prepare(
            "SELECT id FROM alternativas WHERE problema_id = ?1 ORDER BY orden"
        ).map_err(|e| e.to_string())?;
        let resultado = s.query_map(params![id_problema], |r| r.get(0))
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string())?;
        resultado
    };

    let ids_est: Vec<String> = {
        let mut s = conn.prepare(
            "SELECT id FROM estados_naturaleza WHERE problema_id = ?1 ORDER BY orden"
        ).map_err(|e| e.to_string())?;
        let resultado = s.query_map(params![id_problema], |r| r.get(0))
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string())?;
        resultado
    };

    for (i, fila) in problema.grilla.iter().enumerate() {
        for (j, &valor) in fila.iter().enumerate() {
            let id_val = Uuid::new_v4().to_string();
            conn.execute(
                "INSERT INTO valores_matriz (id, problema_id, alternativa_id, estado_id, valor)
                 VALUES (?1, ?2, ?3, ?4, ?5)",
                params![id_val, id_problema, ids_alt[i], ids_est[j], valor],
            ).map_err(|e| e.to_string())?;
        }
    }

    Ok(id_problema)
}

/// Elimina un problema y todo lo relacionado (CASCADE)
#[command]
pub fn eliminar_problema(db: State<DbState>, id: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM problemas WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
