// ─────────────────────────────────────────────────────────────
//  lib.rs
//  Setup de Tauri: registra comandos e inicializa la BD
// ─────────────────────────────────────────────────────────────

mod commands;
mod criterios;
mod database;
mod models;

use commands::DbState;
use std::sync::Mutex;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Ruta a la BD: ~/.local/share/decision-app/decision.db (Linux)
            //               %APPDATA%\decision-app\decision.db (Windows)
            let data_dir = app
                .path()
                .app_data_dir()
                .expect("No se pudo obtener el directorio de datos");

            std::fs::create_dir_all(&data_dir)
                .expect("No se pudo crear el directorio de datos");

            let ruta_bd = data_dir.join("decision.db");
            let conn = database::abrir_bd(&ruta_bd)
                .expect("No se pudo abrir la base de datos");

            app.manage(DbState(Mutex::new(conn)));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::criterios::calcular_criterios,
            commands::historial::listar_problemas,
            commands::historial::guardar_problema,
            commands::historial::eliminar_problema,
            commands::exportar::exportar_txt,
        ])
        .run(tauri::generate_context!())
        .expect("Error al iniciar DecisionApp");
}
