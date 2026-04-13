// ─────────────────────────────────────────────────────────────
//  stores/resultados.ts
//  Estado global de los resultados calculados
// ─────────────────────────────────────────────────────────────

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ResumenCriterios } from '../types/criterios.types'
import { calcularTodos, calcularHurwicz } from '../utils/calculos'
import { useMatrizStore } from './matriz'

export const useResultadosStore = defineStore('resultados', () => {
  // ── Estado ────────────────────────────────────────────────
  const resumen = ref<ResumenCriterios | null>(null)
  const cargando = ref(false)
  const error = ref<string | null>(null)
  const alphaHurwicz = ref(0.5)   // valor actual del slider

  // ── Getters ───────────────────────────────────────────────

  const hayResultados = computed(() => resumen.value !== null)

  /** Alternativa que más veces aparece como ganadora entre todos los criterios */
  const ganadorGlobal = computed<string | null>(() => {
    if (!resumen.value) return null

    const conteo: Record<string, number> = {}
    const criterios = [
      resumen.value.laplace,
      resumen.value.hurwicz,
      resumen.value.maximax,
      resumen.value.maximin,
      resumen.value.savage,
    ]

    criterios.forEach((r) => {
      if (!r) return
      const nombre = r.ganador.nombreAlternativa
      conteo[nombre] = (conteo[nombre] ?? 0) + 1
    })

    if (Object.keys(conteo).length === 0) return null

    return Object.entries(conteo).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
  })

  // ── Acciones ──────────────────────────────────────────────

  /** Calcula todos los criterios con la matriz activa */
  async function calcular() {
    const matrizStore = useMatrizStore()

    if (!matrizStore.esValida) {
      error.value = 'La matriz tiene errores. Verificá los datos antes de calcular.'
      return
    }

    cargando.value = true
    error.value = null

    try {
      // Los cálculos son síncronos pero los envolvemos en una
      // pequeña pausa para que la UI pueda mostrar el spinner
      await new Promise((r) => setTimeout(r, 50))

      const resultados = calcularTodos(
        matrizStore.filasParaCalculo,
        matrizStore.editor.tipoValores,
        alphaHurwicz.value,
      )

      resumen.value = resultados
    } catch (e) {
      error.value = `Error al calcular: ${e instanceof Error ? e.message : String(e)}`
    } finally {
      cargando.value = false
    }
  }

  /**
   * Recalcula SOLO Hurwicz cuando el usuario mueve el slider α.
   * Mucho más rápido que recalcular todo.
   */
  function recalcularHurwicz(nuevoAlpha: number) {
    const matrizStore = useMatrizStore()
    if (!matrizStore.esValida || !resumen.value) return

    alphaHurwicz.value = nuevoAlpha
    resumen.value = {
      ...resumen.value,
      hurwicz: calcularHurwicz(
        matrizStore.filasParaCalculo,
        matrizStore.editor.tipoValores,
        nuevoAlpha,
      ),
    }
  }

  function setAlpha(alpha: number) {
    alphaHurwicz.value = Math.max(0, Math.min(1, alpha))
    recalcularHurwicz(alphaHurwicz.value)
  }

  function limpiar() {
    resumen.value = null
    error.value = null
    cargando.value = false
    alphaHurwicz.value = 0.5
  }

  return {
    // estado
    resumen,
    cargando,
    error,
    alphaHurwicz,
    // getters
    hayResultados,
    ganadorGlobal,
    // acciones
    calcular,
    recalcularHurwicz,
    setAlpha,
    limpiar,
  }
})
