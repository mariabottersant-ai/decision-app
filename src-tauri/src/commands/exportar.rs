// ─────────────────────────────────────────────────────────────
//  commands/exportar.rs
//  Exportación a PDF y Word (Fase 4)
//  Por ahora es un placeholder — se implementa después
// ─────────────────────────────────────────────────────────────

use tauri::command;

#[command]
pub fn exportar_txt(contenido: String, nombre_archivo: String) -> Result<(), String> {
    // Por ahora la exportación se maneja en el frontend
    // Este comando se usará cuando integremos printpdf y docx-rs
    let _ = (contenido, nombre_archivo);
    Ok(())
}
