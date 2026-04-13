// ─────────────────────────────────────────────────────────────
//  historial.types.ts
//  Tipos para el módulo de problemas guardados
// ─────────────────────────────────────────────────────────────

import type { MatrizPagos } from './matriz.types'
import type { ResumenCriterios } from './criterios.types'

/** Un problema guardado en la base de datos */
export interface ProblemaGuardado {
  id: string
  nombre: string
  descripcion?: string
  fechaCreado: string    // ISO 8601: "2026-04-12T10:30:00"
  fechaModificado: string
  /** La matriz completa del problema */
  matriz: MatrizPagos
  /** Los resultados calculados (puede ser null si solo se guardó la matriz) */
  resultados?: ResumenCriterios
}

/** Versión resumida para mostrar en la lista del historial (sin la matriz completa) */
export interface ResumenProblema {
  id: string
  nombre: string
  descripcion?: string
  fechaCreado: string
  fechaModificado: string
  cantidadAlternativas: number
  cantidadEstados: number
  tipoValores: 'utilidades' | 'costos'
  ganadorGlobal?: string   // alternativa que más ganó
}

/** Filtros disponibles para buscar en el historial */
export interface FiltroHistorial {
  texto?: string           // busca en nombre y descripción
  tipoValores?: 'utilidades' | 'costos' | 'todos'
  ordenarPor?: 'fecha_desc' | 'fecha_asc' | 'nombre_asc'
}

/** Estado del store de historial */
export interface EstadoHistorial {
  problemas: ResumenProblema[]
  cargando: boolean
  error: string | null
  filtro: FiltroHistorial
}
