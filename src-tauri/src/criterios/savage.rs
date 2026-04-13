use crate::models::matriz::{Alternativa, TipoValores};
use crate::models::resultado::{PasoCriterio, ResultadoCriterio, ValorCriterio};

pub fn calcular_savage(
    grilla: &[Vec<f64>],
    alternativas: &[Alternativa],
    tipo: &TipoValores,
) -> ResultadoCriterio {
    let num_estados = grilla[0].len();

    // Paso 1: mejor valor de cada columna
    let mejores_col: Vec<f64> = (0..num_estados)
        .map(|j| {
            let col: Vec<f64> = grilla.iter().map(|f| f[j]).collect();
            match tipo {
                TipoValores::Utilidades => col.iter().cloned().fold(f64::NEG_INFINITY, f64::max),
                TipoValores::Costos     => col.iter().cloned().fold(f64::INFINITY, f64::min),
            }
        })
        .collect();

    // Paso 2: matriz de arrepentimiento
    let matriz_arr: Vec<Vec<f64>> = grilla
        .iter()
        .map(|fila| {
            fila.iter()
                .enumerate()
                .map(|(j, &val)| {
                    let arr = match tipo {
                        TipoValores::Utilidades => mejores_col[j] - val,
                        TipoValores::Costos     => val - mejores_col[j],
                    };
                    (arr * 10000.0).round() / 10000.0
                })
                .collect()
        })
        .collect();

    // Paso 3: MiniMax — máximo arrepentimiento de cada fila
    let mut pasos = Vec::new();
    let mut valores: Vec<ValorCriterio> = matriz_arr
        .iter()
        .zip(alternativas.iter())
        .map(|(fila_arr, alt)| {
            let max_arr = fila_arr.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
            let lista = fila_arr.iter().map(|v| format!("{:.2}", v)).collect::<Vec<_>>().join(", ");
            pasos.push(PasoCriterio {
                descripcion: format!("{}: Máx({})", alt.nombre, lista),
                resultado: max_arr,
            });
            ValorCriterio {
                alternativa_id: alt.id.clone(),
                nombre_alternativa: alt.nombre.clone(),
                valor: max_arr,
                es_ganador: false,
            }
        })
        .collect();

    // Elige el mínimo de los máximos (siempre, independiente del tipo)
    let ganador_idx = valores
        .iter()
        .enumerate()
        .min_by(|(_, a), (_, b)| a.valor.partial_cmp(&b.valor).unwrap())
        .map(|(i, _)| i)
        .unwrap_or(0);

    valores[ganador_idx].es_ganador = true;
    let ganador = valores[ganador_idx].clone();

    ResultadoCriterio {
        criterio: "savage".into(),
        valores,
        ganador,
        pasos,
        alpha: None,
        matriz_arrepentimiento: Some(matriz_arr),
    }
}
