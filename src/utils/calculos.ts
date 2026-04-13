// ─────────────────────────────────────────────────────────────
//  calculos.ts
//  Implementación pura de los 5 criterios de decisión.
//  Sin estado, sin Vue — solo funciones matemáticas.
//  Basado en: Peñaloza Palomeque, M. (2010). Teoría de las
//  Decisiones. PERSPECTIVAS, Núm. 25, pp. 227–240.
// ─────────────────────────────────────────────────────────────

import type {
  ResultadoCriterio,
  ValorCriterio,
  PasoCriterio,
} from '../types/criterios.types'
import type { TipoValores } from '../types/matriz.types'

// ─── Tipos internos de entrada ────────────────────────────────

export interface FilaMatriz {
  id: string
  nombre: string
  valores: number[]   // un valor por cada estado de la naturaleza
}

// ─── Helpers internos ─────────────────────────────────────────

function maxFila(fila: number[]): number {
  return Math.max(...fila)
}

function minFila(fila: number[]): number {
  return Math.min(...fila)
}

function redondear(n: number, decimales = 4): number {
  return Math.round(n * 10 ** decimales) / 10 ** decimales
}

/**
 * Decide cuál es el "mejor" valor según el tipo.
 * Utilidades → el mayor. Costos → el menor.
 */
function esMejor(a: number, b: number, tipo: TipoValores): boolean {
  return tipo === 'utilidades' ? a > b : a < b
}

function construirGanador(
  valores: ValorCriterio[],
  tipo: TipoValores,
): ValorCriterio {
  return valores.reduce((mejor, actual) =>
    esMejor(actual.valor, mejor.valor, tipo) ? actual : mejor,
  )
}

// ─────────────────────────────────────────────────────────────
//  1. LAPLACE — Modelo del Equilibrio
//     Asigna igual probabilidad a todos los estados.
//     Calcula el promedio de cada fila y elige el mejor.
// ─────────────────────────────────────────────────────────────

export function calcularLaplace(
  filas: FilaMatriz[],
  tipo: TipoValores,
): ResultadoCriterio {
  const pasos: PasoCriterio[] = []

  const valores: ValorCriterio[] = filas.map((fila) => {
    const suma = fila.valores.reduce((a, b) => a + b, 0)
    const promedio = redondear(suma / fila.valores.length)

    const calculo = `(${fila.valores.join(' + ')}) / ${fila.valores.length}`
    pasos.push({ descripcion: `${fila.nombre}: ${calculo}`, resultado: promedio })

    return {
      alternativaId: fila.id,
      nombreAlternativa: fila.nombre,
      valor: promedio,
      esGanador: false,
    }
  })

  const ganador = construirGanador(valores, tipo)
  valores.forEach((v) => { v.esGanador = v.alternativaId === ganador.alternativaId })

  return { criterio: 'laplace', valores, ganador, pasos }
}

// ─────────────────────────────────────────────────────────────
//  2. HURWICZ
//     H(Di) = α × Máx(fila) + (1 − α) × Mín(fila)
//     α cercano a 1 → optimista | α cercano a 0 → pesimista
// ─────────────────────────────────────────────────────────────

export function calcularHurwicz(
  filas: FilaMatriz[],
  tipo: TipoValores,
  alpha: number,
): ResultadoCriterio {
  // Para costos se invierte la fórmula:
  // H = α × Mín(fila) + (1 − α) × Máx(fila)
  const pasos: PasoCriterio[] = []

  const valores: ValorCriterio[] = filas.map((fila) => {
    const maximo = maxFila(fila.valores)
    const minimo = minFila(fila.valores)

    let h: number
    let calculo: string

    if (tipo === 'utilidades') {
      h = redondear(alpha * maximo + (1 - alpha) * minimo)
      calculo = `${alpha} × ${maximo} + ${1 - alpha} × ${minimo}`
    } else {
      h = redondear(alpha * minimo + (1 - alpha) * maximo)
      calculo = `${alpha} × ${minimo} + ${1 - alpha} × ${maximo}`
    }

    pasos.push({ descripcion: `${fila.nombre}: ${calculo}`, resultado: h })

    return {
      alternativaId: fila.id,
      nombreAlternativa: fila.nombre,
      valor: h,
      esGanador: false,
    }
  })

  const ganador = construirGanador(valores, tipo)
  valores.forEach((v) => { v.esGanador = v.alternativaId === ganador.alternativaId })

  return { criterio: 'hurwicz', valores, ganador, pasos, alpha }
}

// ─────────────────────────────────────────────────────────────
//  3. MAXIMAX (utilidades) / MININIM (costos)
//     Criterio optimista puro.
//     Elige el máximo de los máximos (o mínimo de mínimos).
// ─────────────────────────────────────────────────────────────

export function calcularMaxiMax(
  filas: FilaMatriz[],
  tipo: TipoValores,
): ResultadoCriterio {
  const pasos: PasoCriterio[] = []

  const valores: ValorCriterio[] = filas.map((fila) => {
    const extremo = tipo === 'utilidades' ? maxFila(fila.valores) : minFila(fila.valores)
    const etiqueta = tipo === 'utilidades' ? 'Máx' : 'Mín'

    pasos.push({
      descripcion: `${fila.nombre}: ${etiqueta}(${fila.valores.join(', ')})`,
      resultado: extremo,
    })

    return {
      alternativaId: fila.id,
      nombreAlternativa: fila.nombre,
      valor: extremo,
      esGanador: false,
    }
  })

  const ganador = construirGanador(valores, tipo)
  valores.forEach((v) => { v.esGanador = v.alternativaId === ganador.alternativaId })

  return { criterio: 'maximax', valores, ganador, pasos }
}

// ─────────────────────────────────────────────────────────────
//  4. MAXIMIN (utilidades) / MINIMAX (costos)
//     Criterio pesimista.
//     Elige el máximo de los mínimos (o mínimo de máximos).
// ─────────────────────────────────────────────────────────────

export function calcularMaxiMin(
  filas: FilaMatriz[],
  tipo: TipoValores,
): ResultadoCriterio {
  const pasos: PasoCriterio[] = []

  const valores: ValorCriterio[] = filas.map((fila) => {
    // Para utilidades: toma el mínimo de la fila (el peor caso)
    // Para costos: toma el máximo de la fila (el peor caso = más caro)
    const peorCaso = tipo === 'utilidades' ? minFila(fila.valores) : maxFila(fila.valores)
    const etiqueta = tipo === 'utilidades' ? 'Mín' : 'Máx'

    pasos.push({
      descripcion: `${fila.nombre}: ${etiqueta}(${fila.valores.join(', ')})`,
      resultado: peorCaso,
    })

    return {
      alternativaId: fila.id,
      nombreAlternativa: fila.nombre,
      valor: peorCaso,
      esGanador: false,
    }
  })

  // Ahora de esos "peores casos", elige el mejor
  const ganador = construirGanador(valores, tipo)
  valores.forEach((v) => { v.esGanador = v.alternativaId === ganador.alternativaId })

  return { criterio: 'maximin', valores, ganador, pasos }
}

// ─────────────────────────────────────────────────────────────
//  5. SAVAGE — Modelo del Arrepentimiento
//     1. Construye la matriz de arrepentimiento:
//        Para utilidades: mejor_columna − valor_casilla
//        Para costos:     valor_casilla − mejor_columna
//     2. Toma el máximo de cada fila (máx arrepentimiento)
//     3. Elige la alternativa con el mínimo de esos máximos
// ─────────────────────────────────────────────────────────────

export function calcularSavage(
  filas: FilaMatriz[],
  tipo: TipoValores,
): ResultadoCriterio {
  const numEstados = filas[0].valores.length

  // Paso 1: calcular el mejor valor de cada columna
  const mejoresPorColumna: number[] = Array.from({ length: numEstados }, (_, j) => {
    const columna = filas.map((f) => f.valores[j])
    return tipo === 'utilidades' ? Math.max(...columna) : Math.min(...columna)
  })

  // Paso 2: construir matriz de arrepentimiento
  const matrizArrepentimiento: number[][] = filas.map((fila) =>
    fila.valores.map((val, j) => {
      const arrepentimiento =
        tipo === 'utilidades'
          ? mejoresPorColumna[j] - val
          : val - mejoresPorColumna[j]
      return redondear(arrepentimiento)
    }),
  )

  // Paso 3: MiniMax — máximo arrepentimiento de cada fila, luego el mínimo
  const pasos: PasoCriterio[] = []

  const valores: ValorCriterio[] = filas.map((fila, i) => {
    const fila_arr = matrizArrepentimiento[i]
    const maxArrepentimiento = Math.max(...fila_arr)

    pasos.push({
      descripcion: `${fila.nombre}: Máx(${fila_arr.join(', ')})`,
      resultado: maxArrepentimiento,
    })

    return {
      alternativaId: fila.id,
      nombreAlternativa: fila.nombre,
      valor: maxArrepentimiento,
      esGanador: false,
    }
  })

  // Elige el mínimo de los máximos arrepentimientos (siempre, independiente del tipo)
  const ganador = valores.reduce((mejor, actual) =>
    actual.valor < mejor.valor ? actual : mejor,
  )
  valores.forEach((v) => { v.esGanador = v.alternativaId === ganador.alternativaId })

  return { criterio: 'savage', valores, ganador, pasos, matrizArrepentimiento }
}

// ─────────────────────────────────────────────────────────────
//  calcularTodos — Calcula los 5 criterios de una vez
// ─────────────────────────────────────────────────────────────

export function calcularTodos(
  filas: FilaMatriz[],
  tipo: TipoValores,
  alpha = 0.5,
) {
  return {
    laplace:  calcularLaplace(filas, tipo),
    hurwicz:  calcularHurwicz(filas, tipo, alpha),
    maximax:  calcularMaxiMax(filas, tipo),
    maximin:  calcularMaxiMin(filas, tipo),
    savage:   calcularSavage(filas, tipo),
  }
}
