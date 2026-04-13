// ─────────────────────────────────────────────────────────────
//  models/problema.rs
//  Estructura para el historial de problemas guardados
// ─────────────────────────────────────────────────────────────

use serde::{Deserialize, Serialize};

/// Versión resumida para la lista del historial
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResumenProblema {
    pub id: String,
    pub nombre: String,
    pub descripcion: Option<String>,
    pub fecha_creado: String,
    pub fecha_modificado: String,
    pub cantidad_alternativas: i32,
    pub cantidad_estados: i32,
    pub tipo_valores: String,
    pub ganador_global: Option<String>,
}

/// Para crear o actualizar un problema
#[derive(Debug, Clone, Deserialize)]
pub struct NuevoProblema {
    pub nombre: String,
    pub descripcion: Option<String>,
    pub tipo_valores: String,
    pub nombres_alternativas: Vec<String>,
    pub nombres_estados: Vec<String>,
    pub grilla: Vec<Vec<f64>>,
}
