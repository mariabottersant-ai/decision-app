pub mod laplace;
pub mod hurwicz;
pub mod maximax;
pub mod maximin;
pub mod savage;

pub use laplace::calcular_laplace;
pub use hurwicz::calcular_hurwicz;
pub use maximax::calcular_maximax;
pub use maximin::calcular_maximin;
pub use savage::calcular_savage;

use crate::models::matriz::MatrizPagos;
use crate::models::resultado::ResumenResultados;

/// Calcula los 5 criterios de una vez
pub fn calcular_todos(matriz: &MatrizPagos, alpha: f64) -> ResumenResultados {
    let grilla = matriz.como_grilla();
    let tipo   = &matriz.tipo_valores;
    let alts   = &matriz.alternativas;

    let mut resumen = ResumenResultados {
        laplace:  Some(calcular_laplace(&grilla, alts, tipo)),
        hurwicz:  Some(calcular_hurwicz(&grilla, alts, tipo, alpha)),
        maximax:  Some(calcular_maximax(&grilla, alts, tipo)),
        maximin:  Some(calcular_maximin(&grilla, alts, tipo)),
        savage:   Some(calcular_savage(&grilla, alts, tipo)),
        ganador_global: None,
    };

    resumen.calcular_ganador_global();
    resumen
}
