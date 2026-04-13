// ─────────────────────────────────────────────────────────────
//  commands/criterios.rs
//  Comandos Tauri que Vue llama via invoke()
// ─────────────────────────────────────────────────────────────

use tauri::command;
use crate::criterios::calcular_todos;
use crate::models::matriz::MatrizPagos;
use crate::models::resultado::ResumenResultados;

/// Calcula los 5 criterios para una matriz dada.
/// Vue lo llama así:
///   invoke('calcular_criterios', { matriz, alpha })
#[command]
pub fn calcular_criterios(matriz: MatrizPagos, alpha: f64) -> Result<ResumenResultados, String> {
    if matriz.alternativas.is_empty() {
        return Err("La matriz no tiene alternativas.".into());
    }
    if matriz.estados.is_empty() {
        return Err("La matriz no tiene estados de la naturaleza.".into());
    }

    let grilla = matriz.como_grilla();
    if grilla.iter().any(|f| f.iter().any(|v| v.is_nan() || v.is_infinite())) {
        return Err("La matriz contiene valores inválidos.".into());
    }

    Ok(calcular_todos(&matriz, alpha))
}
