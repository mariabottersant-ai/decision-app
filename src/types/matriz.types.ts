// ─────────────────────────────────────────────────────────────
//  matriz.types.ts
//  Tipos base que representan una matriz de pagos
// ─────────────────────────────────────────────────────────────

/** Una fila de la matriz: representa una alternativa de decisión */
export interface Alternativa {
  id: string
  nombre: string   // ej: "Hornear 50 panes", "D1"
  orden: number
}

/** Una columna de la matriz: representa un estado de la naturaleza */
export interface EstadoNaturaleza {
  id: string
  nombre: string   // ej: "Demanda alta", "E1"
  orden: number
}

/** El valor numérico de una casilla (fila i, columna j) */
export interface ValorCasilla {
  alternativaId: string
  estadoId: string
  valor: number
}

/** Indica si los valores son utilidades (mayor = mejor) o costos (menor = mejor) */
export type TipoValores = 'utilidades' | 'costos'

/** La matriz completa lista para calcular */
export interface MatrizPagos {
  id?: string                        // presente solo si está guardada en BD
  nombre: string                     // nombre del problema
  descripcion?: string
  tipoValores: TipoValores
  alternativas: Alternativa[]
  estados: EstadoNaturaleza[]
  valores: ValorCasilla[]
}

/** Estado del editor de matriz en la UI */
export interface EstadoEditor {
  filas: number
  columnas: number
  tipoValores: TipoValores
  nombreProblema: string
  descripcion: string
  nombresAlternativas: string[]
  nombresEstados: string[]
  /** grilla[i][j] = valor de la alternativa i en el estado j */
  grilla: (number | null)[][]
}

/** Helpers para construir una grilla vacía */
export function crearGrillaVacia(filas: number, columnas: number): (number | null)[][] {
  return Array.from({ length: filas }, () => Array(columnas).fill(null))
}

export function editorInicial(filas = 3, columnas = 3): EstadoEditor {
  return {
    filas,
    columnas,
    tipoValores: 'utilidades',
    nombreProblema: '',
    descripcion: '',
    nombresAlternativas: Array.from({ length: filas }, (_, i) => `D${i + 1}`),
    nombresEstados: Array.from({ length: columnas }, (_, j) => `E${j + 1}`),
    grilla: crearGrillaVacia(filas, columnas),
  }
}
