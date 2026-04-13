use crate::models::matriz::{Alternativa, TipoValores};
use crate::models::resultado::{PasoCriterio, ResultadoCriterio, ValorCriterio};

pub fn calcular_hurwicz(
    grilla: &[Vec<f64>],
    alternativas: &[Alternativa],
    tipo: &TipoValores,
    alpha: f64,
) -> ResultadoCriterio {
    let alpha = alpha.clamp(0.0, 1.0);
    let mut pasos = Vec::new();

    let mut valores: Vec<ValorCriterio> = grilla
        .iter()
        .zip(alternativas.iter())
        .map(|(fila, alt)| {
            let max = fila.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
            let min = fila.iter().cloned().fold(f64::INFINITY, f64::min);

            let h = match tipo {
                TipoValores::Utilidades => redondear(alpha * max + (1.0 - alpha) * min),
                TipoValores::Costos     => redondear(alpha * min + (1.0 - alpha) * max),
            };

            let (a_val, b_val) = match tipo {
                TipoValores::Utilidades => (max, min),
                TipoValores::Costos     => (min, max),
            };

            pasos.push(PasoCriterio {
                descripcion: format!(
                    "{}: {:.2} × {:.2} + {:.2} × {:.2}",
                    alt.nombre, alpha, a_val, 1.0 - alpha, b_val
                ),
                resultado: h,
            });

            ValorCriterio {
                alternativa_id: alt.id.clone(),
                nombre_alternativa: alt.nombre.clone(),
                valor: h,
                es_ganador: false,
            }
        })
        .collect();

    let ganador_idx = mejor_indice(&valores, tipo);
    valores[ganador_idx].es_ganador = true;
    let ganador = valores[ganador_idx].clone();

    ResultadoCriterio {
        criterio: "hurwicz".into(),
        valores,
        ganador,
        pasos,
        alpha: Some(alpha),
        matriz_arrepentimiento: None,
    }
}

fn mejor_indice(valores: &[ValorCriterio], tipo: &TipoValores) -> usize {
    valores
        .iter()
        .enumerate()
        .max_by(|(_, a), (_, b)| match tipo {
            TipoValores::Utilidades => a.valor.partial_cmp(&b.valor).unwrap(),
            TipoValores::Costos     => b.valor.partial_cmp(&a.valor).unwrap(),
        })
        .map(|(i, _)| i)
        .unwrap_or(0)
}

fn redondear(n: f64) -> f64 {
    (n * 10000.0).round() / 10000.0
}
