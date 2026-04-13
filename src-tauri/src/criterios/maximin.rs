use crate::models::matriz::{Alternativa, TipoValores};
use crate::models::resultado::{PasoCriterio, ResultadoCriterio, ValorCriterio};

pub fn calcular_maximin(
    grilla: &[Vec<f64>],
    alternativas: &[Alternativa],
    tipo: &TipoValores,
) -> ResultadoCriterio {
    let mut pasos = Vec::new();

    // Paso 1: tomar el peor caso de cada fila
    let mut valores: Vec<ValorCriterio> = grilla
        .iter()
        .zip(alternativas.iter())
        .map(|(fila, alt)| {
            let peor = match tipo {
                TipoValores::Utilidades => fila.iter().cloned().fold(f64::INFINITY, f64::min),
                TipoValores::Costos     => fila.iter().cloned().fold(f64::NEG_INFINITY, f64::max),
            };
            let etiqueta = match tipo {
                TipoValores::Utilidades => "Mín",
                TipoValores::Costos     => "Máx",
            };
            let lista = fila.iter().map(|v| format!("{:.2}", v)).collect::<Vec<_>>().join(", ");
            pasos.push(PasoCriterio {
                descripcion: format!("{}: {}({})", alt.nombre, etiqueta, lista),
                resultado: peor,
            });
            ValorCriterio {
                alternativa_id: alt.id.clone(),
                nombre_alternativa: alt.nombre.clone(),
                valor: peor,
                es_ganador: false,
            }
        })
        .collect();

    // Paso 2: elegir el mejor de los peores
    let ganador_idx = match tipo {
        TipoValores::Utilidades => valores.iter().enumerate()
            .max_by(|(_, a), (_, b)| a.valor.partial_cmp(&b.valor).unwrap())
            .map(|(i, _)| i).unwrap_or(0),
        TipoValores::Costos => valores.iter().enumerate()
            .min_by(|(_, a), (_, b)| a.valor.partial_cmp(&b.valor).unwrap())
            .map(|(i, _)| i).unwrap_or(0),
    };

    valores[ganador_idx].es_ganador = true;
    let ganador = valores[ganador_idx].clone();

    ResultadoCriterio {
        criterio: "maximin".into(),
        valores, ganador, pasos,
        alpha: None,
        matriz_arrepentimiento: None,
    }
}
