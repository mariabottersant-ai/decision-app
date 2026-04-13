// ─────────────────────────────────────────────────────────────
//  validaciones.ts
//  Verifica que los datos de la matriz sean correctos
//  antes de calcular o guardar.
// ─────────────────────────────────────────────────────────────

import type { EstadoEditor } from '../types/matriz.types'

export interface ErrorValidacion {
  campo: string
  mensaje: string
}

export interface ResultadoValidacion {
  valido: boolean
  errores: ErrorValidacion[]
}

/**
 * Valida el estado completo del editor antes de calcular.
 */
export function validarEditor(editor: EstadoEditor): ResultadoValidacion {
  const errores: ErrorValidacion[] = []

  // Nombre del problema
  if (!editor.nombreProblema.trim()) {
    errores.push({ campo: 'nombreProblema', mensaje: 'El nombre del problema es obligatorio.' })
  }

  // Dimensiones mínimas
  if (editor.filas < 2) {
    errores.push({ campo: 'filas', mensaje: 'Necesitás al menos 2 alternativas (filas).' })
  }
  if (editor.columnas < 2) {
    errores.push({ campo: 'columnas', mensaje: 'Necesitás al menos 2 estados de la naturaleza (columnas).' })
  }

  // Nombres de alternativas no vacíos
  editor.nombresAlternativas.forEach((nombre, i) => {
    if (!nombre.trim()) {
      errores.push({ campo: `alternativa_${i}`, mensaje: `El nombre de la alternativa ${i + 1} está vacío.` })
    }
  })

  // Nombres de estados no vacíos
  editor.nombresEstados.forEach((nombre, j) => {
    if (!nombre.trim()) {
      errores.push({ campo: `estado_${j}`, mensaje: `El nombre del estado ${j + 1} está vacío.` })
    }
  })

  // Todos los valores de la grilla deben estar completos
  let celdasVacias = 0
  editor.grilla.forEach((fila) => {
    fila.forEach((val) => {
      if (val === null || val === undefined || isNaN(val as number)) {
        celdasVacias++
      }
    })
  })
  if (celdasVacias > 0) {
    errores.push({
      campo: 'grilla',
      mensaje: `Hay ${celdasVacias} celda${celdasVacias > 1 ? 's' : ''} sin valor. Completá toda la matriz.`,
    })
  }

  return { valido: errores.length === 0, errores }
}

/**
 * Valida un valor numérico individual al escribir en una celda.
 * Devuelve null si es válido, o un mensaje de error.
 */
export function validarCelda(texto: string): string | null {
  if (texto.trim() === '') return 'Valor requerido'
  const n = Number(texto)
  if (isNaN(n)) return 'Debe ser un número'
  if (!isFinite(n)) return 'Número inválido'
  return null
}

/**
 * Valida el coeficiente α de Hurwicz.
 */
export function validarAlpha(alpha: number): string | null {
  if (alpha < 0 || alpha > 1) return 'α debe estar entre 0 y 1'
  return null
}

/**
 * Valida el nombre de un problema antes de guardarlo.
 */
export function validarNombreProblema(nombre: string): string | null {
  if (!nombre.trim()) return 'El nombre no puede estar vacío'
  if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
  if (nombre.length > 100) return 'El nombre es demasiado largo (máx. 100 caracteres)'
  return null
}
