// ─────────────────────────────────────────────────────────────
//  models/resultado.rs
//  Estructuras para los resultados de los criterios
// ─────────────────────────────────────────────────────────────

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PasoCriterio {
    pub descripcion: String,
    pub resultado: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValorCriterio {
    pub alternativa_id: String,
    pub nombre_alternativa: String,
    pub valor: f64,
    pub es_ganador: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResultadoCriterio {
    pub criterio: String,
    pub valores: Vec<ValorCriterio>,
    pub ganador: ValorCriterio,
    pub pasos: Vec<PasoCriterio>,
    pub alpha: Option<f64>,
    pub matriz_arrepentimiento: Option<Vec<Vec<f64>>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResumenResultados {
    pub laplace:  Option<ResultadoCriterio>,
    pub hurwicz:  Option<ResultadoCriterio>,
    pub maximax:  Option<ResultadoCriterio>,
    pub maximin:  Option<ResultadoCriterio>,
    pub savage:   Option<ResultadoCriterio>,
    pub ganador_global: Option<String>,
}

impl ResumenResultados {
    /// Determina qué alternativa gana más veces entre todos los criterios
    pub fn calcular_ganador_global(&mut self) {
        let mut conteo: std::collections::HashMap<String, usize> = Default::default();

        let criterios: Vec<&ResultadoCriterio> = [
            self.laplace.as_ref(),
            self.hurwicz.as_ref(),
            self.maximax.as_ref(),
            self.maximin.as_ref(),
            self.savage.as_ref(),
        ]
        .into_iter()
        .flatten()
        .collect();

        for c in criterios {
            *conteo.entry(c.ganador.nombre_alternativa.clone()).or_insert(0) += 1;
        }

        self.ganador_global = conteo
            .into_iter()
            .max_by_key(|(_, v)| *v)
            .map(|(k, _)| k);
    }
}
