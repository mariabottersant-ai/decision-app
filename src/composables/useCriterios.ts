// ─────────────────────────────────────────────────────────────
//  composables/useCriterios.ts
//  Lógica de presentación de resultados.
//  Orquesta el cálculo y expone los datos listos para la UI.
// ─────────────────────────────────────────────────────────────

import { computed } from 'vue'
import { useResultadosStore } from '../stores/resultados'
import { useMatrizStore } from '../stores/matriz'
import { useHistorialStore } from '../stores/historial'
import { formatearNumero, formatearAlpha, etiquetaOptimismo } from '../utils/formateo'
import type { ResumenProblema } from '../types/historial.types'

export function useCriterios() {
  const resultadosStore = useResultadosStore()
  const matrizStore = useMatrizStore()
  const historialStore = useHistorialStore()

  // ── Estado ────────────────────────────────────────────────
  const cargando      = computed(() => resultadosStore.cargando)
  const error         = computed(() => resultadosStore.error)
  const hayResultados = computed(() => resultadosStore.hayResultados)
  const resumen       = computed(() => resultadosStore.resumen)
  const ganadorGlobal = computed(() => resultadosStore.ganadorGlobal)
  const alpha         = computed(() => resultadosStore.alphaHurwicz)
  const alphaLabel    = computed(() => formatearAlpha(alpha.value))
  const optimismoLabel = computed(() => etiquetaOptimismo(alpha.value))

  // ── Calcular ──────────────────────────────────────────────

  async function calcular() {
    await resultadosStore.calcular()
  }

  function cambiarAlpha(nuevoAlpha: number) {
    resultadosStore.setAlpha(nuevoAlpha)
  }

  // ── Datos para las tarjetas de resultados ─────────────────

  /**
   * Devuelve las filas formateadas de un criterio para
   * mostrar en una BaseTable. Incluye clase CSS según valor.
   */
  function filasTabla(criterio: 'laplace' | 'hurwicz' | 'maximax' | 'maximin' | 'savage') {
    const resultado = resumen.value?.[criterio]
    if (!resultado) return []

    return resultado.valores.map((v) => ({
      alternativa: v.nombreAlternativa,
      valor: formatearNumero(v.valor),
      valorRaw: v.valor,
      esGanador: v.esGanador,
      claseValor: v.valor < 0 ? 'negativo' : v.valor > 0 ? 'positivo' : 'neutro',
    }))
  }

  /**
   * Datos para la tabla comparativa final (ResumenCriterios).
   * Una fila por alternativa, una columna por criterio.
   */
  const tablaComparativa = computed(() => {
    if (!resumen.value) return []

    const criterios = ['laplace', 'hurwicz', 'maximax', 'maximin', 'savage'] as const
    const alternativas = matrizStore.editor.nombresAlternativas

    return alternativas.map((nombre, i) => {
      const fila: Record<string, string | boolean> = { alternativa: nombre }
      criterios.forEach((c) => {
        const resultado = resumen.value![c]
        if (!resultado) { fila[c] = '—'; return }
        const val = resultado.valores[i]
        fila[c] = val ? formatearNumero(val.valor) : '—'
        fila[`${c}_ganador`] = val?.esGanador ?? false
      })
      return fila
    })
  })

  /**
   * Datos para el gráfico de barras (Chart.js).
   * Un dataset por criterio, una barra por alternativa.
   */
  const datosGrafico = computed(() => {
    if (!resumen.value) return null

    const labels = matrizStore.editor.nombresAlternativas
    const colores = ['#4F6AF0', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6']
    const criterios = [
      { key: 'laplace',  label: 'Laplace'  },
      { key: 'hurwicz',  label: `Hurwicz (α=${alphaLabel.value})` },
      { key: 'maximax',  label: 'MaxiMax'  },
      { key: 'maximin',  label: 'MaxiMin'  },
      { key: 'savage',   label: 'Savage'   },
    ] as const

    const datasets = criterios.map((c, i) => {
      const resultado = resumen.value![c.key]
      return {
        label: c.label,
        data: resultado?.valores.map((v) => v.valor) ?? [],
        backgroundColor: colores[i] + 'CC',
        borderColor: colores[i],
        borderWidth: 1,
      }
    })

    return { labels, datasets }
  })

  // ── Guardar en historial ──────────────────────────────────

  function guardarEnHistorial() {
    if (!hayResultados.value) return

    const editor = matrizStore.editor
    const problema: ResumenProblema = {
      id: `prob_${Date.now()}`,
      nombre: editor.nombreProblema || `Problema ${new Date().toLocaleDateString('es-BO')}`,
      descripcion: editor.descripcion,
      fechaCreado: new Date().toISOString(),
      fechaModificado: new Date().toISOString(),
      cantidadAlternativas: editor.filas,
      cantidadEstados: editor.columnas,
      tipoValores: editor.tipoValores,
      ganadorGlobal: ganadorGlobal.value ?? undefined,
    }

    historialStore.agregarProblema(problema)
    matrizStore.marcarGuardado()
  }

  return {
    // estado
    cargando,
    error,
    hayResultados,
    resumen,
    ganadorGlobal,
    alpha,
    alphaLabel,
    optimismoLabel,
    tablaComparativa,
    datosGrafico,
    // acciones
    calcular,
    cambiarAlpha,
    filasTabla,
    guardarEnHistorial,
  }
}
