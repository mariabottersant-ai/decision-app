// ─────────────────────────────────────────────────────────────
//  models/matriz.rs
//  Estructuras de datos que representan la matriz de pagos
// ─────────────────────────────────────────────────────────────

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Alternativa {
    pub id: String,
    pub nombre: String,
    pub orden: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EstadoNaturaleza {
    pub id: String,
    pub nombre: String,
    pub orden: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValorCasilla {
    pub alternativa_id: String,
    pub estado_id: String,
    pub valor: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum TipoValores {
    Utilidades,
    Costos,
}

/// Matriz completa lista para calcular
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MatrizPagos {
    pub id: Option<String>,
    pub nombre: String,
    pub descripcion: Option<String>,
    pub tipo_valores: TipoValores,
    pub alternativas: Vec<Alternativa>,
    pub estados: Vec<EstadoNaturaleza>,
    pub valores: Vec<ValorCasilla>,
}

impl MatrizPagos {
    /// Convierte la lista plana de valores a una grilla 2D [fila][columna]
    pub fn como_grilla(&self) -> Vec<Vec<f64>> {
        self.alternativas
            .iter()
            .map(|alt| {
                self.estados
                    .iter()
                    .map(|est| {
                        self.valores
                            .iter()
                            .find(|v| v.alternativa_id == alt.id && v.estado_id == est.id)
                            .map(|v| v.valor)
                            .unwrap_or(0.0)
                    })
                    .collect()
            })
            .collect()
    }
}
