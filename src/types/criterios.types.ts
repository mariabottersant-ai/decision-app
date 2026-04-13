// ─────────────────────────────────────────────────────────────
//  criterios.types.ts
//  Tipos para los resultados de cada criterio de decisión
// ─────────────────────────────────────────────────────────────

/** Nombres posibles de criterios */
export type NombreCriterio =
  | 'laplace'
  | 'hurwicz'
  | 'maximax'
  | 'maximin'
  | 'savage'

/** El resultado de aplicar un criterio a UNA alternativa */
export interface ValorCriterio {
  alternativaId: string
  nombreAlternativa: string
  valor: number
  esGanador: boolean
}

/** Resultado completo de un criterio (incluye el desarrollo paso a paso) */
export interface ResultadoCriterio {
  criterio: NombreCriterio
  valores: ValorCriterio[]
  ganador: ValorCriterio
  /** Pasos del desarrollo para mostrar en la UI */
  pasos: PasoCriterio[]
  /** Solo Hurwicz: el coeficiente α usado */
  alpha?: number
  /** Solo Savage: la matriz de arrepentimiento */
  matrizArrepentimiento?: number[][]
}

/** Un paso del desarrollo matemático (para mostrar el "cómo se calculó") */
export interface PasoCriterio {
  descripcion: string   // ej: "Hornear 80 panes: (70 + 400 + 400) / 3"
  resultado: number
}

/** Resumen de todos los criterios calculados para un mismo problema */
export interface ResumenCriterios {
  laplace?: ResultadoCriterio
  hurwicz?: ResultadoCriterio
  maximax?: ResultadoCriterio
  maximin?: ResultadoCriterio
  savage?: ResultadoCriterio
  /** Alternativa que más veces ganó entre todos los criterios */
  ganadorGlobal?: string
}

/** Opciones para el cálculo de Hurwicz */
export interface OpcionesHurwicz {
  alpha: number   // 0 = pesimista puro, 1 = optimista puro
}

/** Estado de la UI de resultados */
export interface EstadoResultados {
  cargando: boolean
  error: string | null
  resumen: ResumenCriterios | null
  alphaHurwicz: number   // valor actual del slider
}
