// ─────────────────────────────────────────────────────────────
//  composables/useExportar.ts
//  Exportación a Excel (.xlsx) usando SheetJS
// ─────────────────────────────────────────────────────────────

import { ref } from 'vue'
import { useMatrizStore } from '../stores/matriz'
import { useResultadosStore } from '../stores/resultados'
import { exportarExcel } from '../utils/exportarExcel'

export type FormatoExporte = 'excel' | 'pdf'

export function useExportar() {
  const matrizStore = useMatrizStore()
  const resultadosStore = useResultadosStore()

  const exportando = ref(false)
  const error = ref<string | null>(null)
  const exitoMsg = ref<string | null>(null)

  async function exportar(_formato: FormatoExporte = 'excel'): Promise<boolean> {
    if (!resultadosStore.hayResultados) {
      error.value = 'Calculá los criterios antes de exportar.'
      return false
    }
    if (!resultadosStore.resumen) return false

    exportando.value = true
    error.value = null
    exitoMsg.value = null

    try {
      const savedPath = await exportarExcel(
        matrizStore.editor,
        resultadosStore.resumen,
        resultadosStore.alphaHurwicz,
        resultadosStore.ganadorGlobal,
      )
      if (savedPath) {
        exitoMsg.value = `Archivo guardado correctamente en: ${savedPath}`
        return true
      }
      return false
    } catch (e) {
      error.value = `Error al exportar: ${e instanceof Error ? e.message : String(e)}`
      return false
    } finally {
      exportando.value = false
    }
  }

  return { exportando, error, exitoMsg, exportar }
}

