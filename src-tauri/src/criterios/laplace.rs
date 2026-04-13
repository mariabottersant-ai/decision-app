use crate::models::matriz::{Alternativa, TipoValores};
use crate::models::resultado::{PasoCriterio, ResultadoCriterio, ValorCriterio};

pub fn calcular_laplace(
    grilla: &[Vec<f64>],
    alternativas: &[Alternativa],
    tipo: &TipoValores,
) -> ResultadoCriterio {
    let mut pasos = Vec::new();
    let mut valores: Vec<ValorCriterio> = grilla
        .iter()
        .zip(alternativas.iter())
        .map(|(fila, alt)| {
            let suma: f64 = fila.iter().sum();
            let promedio = redondear(suma / fila.len() as f64);
            let calculo = fila
                .iter()
                .map(|v| format!("{:.2}", v))
                .collect::<Vec<_>>()
                .join(" + ");
            pasos.push(PasoCriterio {
                descripcion: format!("{}: ({}) / {}", alt.nombre, calculo, fila.len()),
                resultado: promedio,
            });
            ValorCriterio {
                alternativa_id: alt.id.clone(),
                nombre_alternativa: alt.nombre.clone(),
                valor: promedio,
                es_ganador: false,
            }
        })
        .collect();

    let ganador_idx = mejor_indice(&valores, tipo);
    valores[ganador_idx].es_ganador = true;
    let ganador = valores[ganador_idx].clone();

    ResultadoCriterio {
        criterio: "laplace".into(),
        valores,
        ganador,
        pasos,
        alpha: None,
        matriz_arrepentimiento: None,
    }
}

fn mejor_indice(valores: &[ValorCriterio], tipo: &TipoValores) -> usize {
    valores
        .iter()
        .enumerate()
        .max_by(|(_, a), (_, b)| {
            match tipo {
                TipoValores::Utilidades => a.valor.partial_cmp(&b.valor).unwrap(),
                TipoValores::Costos     => b.valor.partial_cmp(&a.valor).unwrap(),
            }
        })
        .map(|(i, _)| i)
        .unwrap_or(0)
}

fn redondear(n: f64) -> f64 {
    (n * 10000.0).round() / 10000.0
}
