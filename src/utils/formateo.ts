// ─────────────────────────────────────────────────────────────
//  formateo.ts
//  Funciones para mostrar números de forma clara en la UI
// ─────────────────────────────────────────────────────────────

/**
 * Formatea un número para mostrarlo en la matriz o en resultados.
 * - Máximo 2 decimales (quita ceros innecesarios)
 * - Usa coma como separador decimal (estilo boliviano/español)
 * - Los negativos se muestran con signo −
 */
export function formatearNumero(n: number, decimales = 2): string {
  if (!isFinite(n)) return '—'
  return n.toLocaleString('es-BO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimales,
  })
}

/**
 * Devuelve la clase CSS según si el número es positivo, negativo o cero.
 * Usada para colorear celdas en la matriz y en los resultados.
 */
export function claseNumero(n: number): 'positivo' | 'negativo' | 'neutro' {
  if (n > 0) return 'positivo'
  if (n < 0) return 'negativo'
  return 'neutro'
}

/**
 * Formatea el coeficiente α de Hurwicz para mostrarlo como porcentaje.
 * 0.7 → "70%"
 */
export function formatearAlpha(alpha: number): string {
  return `${Math.round(alpha * 100)}%`
}

/**
 * Devuelve una etiqueta legible del nivel de optimismo según α.
 */
export function etiquetaOptimismo(alpha: number): string {
  if (alpha >= 0.8) return 'Muy optimista'
  if (alpha >= 0.6) return 'Optimista'
  if (alpha >= 0.4) return 'Equilibrado'
  if (alpha >= 0.2) return 'Pesimista'
  return 'Muy pesimista'
}

/**
 * Formatea una fecha ISO para mostrarla en el historial.
 * "2026-04-12T10:30:00" → "12/04/2026 10:30"
 */
export function formatearFecha(iso: string): string {
  const fecha = new Date(iso)
  if (isNaN(fecha.getTime())) return '—'
  return fecha.toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Devuelve "hace X minutos/horas/días" para una fecha ISO.
 */
export function tiempoRelativo(iso: string): string {
  const ahora = Date.now()
  const fecha = new Date(iso).getTime()
  const diff = Math.floor((ahora - fecha) / 1000) // en segundos

  if (diff < 60)      return 'Hace un momento'
  if (diff < 3600)    return `Hace ${Math.floor(diff / 60)} min`
  if (diff < 86400)   return `Hace ${Math.floor(diff / 3600)} h`
  if (diff < 2592000) return `Hace ${Math.floor(diff / 86400)} días`
  return formatearFecha(iso)
}
