// ─────────────────────────────────────────────────────────────
//  stores/historial.ts
//  Estado global del historial de problemas guardados
// ─────────────────────────────────────────────────────────────

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ResumenProblema, FiltroHistorial } from '../types/historial.types'
import type { EstadoEditor } from '../types/matriz.types'

const LISTA_KEY   = 'historial_decision_app'
const DATOS_KEY   = 'historial_datos_completos'

export const useHistorialStore = defineStore('historial', () => {
  // ── Estado ────────────────────────────────────────────────
  const problemas = ref<ResumenProblema[]>([])
  const cargando  = ref(false)
  const error     = ref<string | null>(null)
  const filtro    = ref<FiltroHistorial>({
    texto: '',
    tipoValores: 'todos',
    ordenarPor: 'fecha_desc',
  })

  // ── Getters ───────────────────────────────────────────────

  const problemasFiltrados = computed<ResumenProblema[]>(() => {
    let lista = [...problemas.value]

    const texto = filtro.value.texto?.toLowerCase().trim()
    if (texto) {
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(texto) ||
          p.descripcion?.toLowerCase().includes(texto),
      )
    }

    if (filtro.value.tipoValores && filtro.value.tipoValores !== 'todos') {
      lista = lista.filter((p) => p.tipoValores === filtro.value.tipoValores)
    }

    switch (filtro.value.ordenarPor) {
      case 'fecha_desc':
        lista.sort((a, b) => b.fechaModificado.localeCompare(a.fechaModificado))
        break
      case 'fecha_asc':
        lista.sort((a, b) => a.fechaModificado.localeCompare(b.fechaModificado))
        break
      case 'nombre_asc':
        lista.sort((a, b) => a.nombre.localeCompare(b.nombre))
        break
    }

    return lista
  })

  const totalProblemas = computed(() => problemas.value.length)
  const hayProblemas   = computed(() => problemas.value.length > 0)

  // ── Acciones ──────────────────────────────────────────────

  async function cargarHistorial() {
    cargando.value = true
    error.value    = null
    try {
      const guardado = localStorage.getItem(LISTA_KEY)
      if (guardado) problemas.value = JSON.parse(guardado)
    } catch (e) {
      error.value = `No se pudo cargar el historial: ${e instanceof Error ? e.message : String(e)}`
    } finally {
      cargando.value = false
    }
  }

  /** Guarda el resumen Y los datos completos de la matriz */
  function agregarProblema(problema: ResumenProblema, editorData?: EstadoEditor) {
    const idx = problemas.value.findIndex((p) => p.id === problema.id)
    if (idx >= 0) {
      problemas.value[idx] = problema
    } else {
      problemas.value.unshift(problema)
    }
    persistirLocal()

    // Guardar datos completos si se proveen
    if (editorData) {
      const datos = cargarDatosCompletos()
      datos[problema.id] = editorData
      localStorage.setItem(DATOS_KEY, JSON.stringify(datos))
    }
  }

  /** Devuelve el editor completo de un problema por id */
  function obtenerDatosCompletos(id: string): EstadoEditor | null {
    const datos = cargarDatosCompletos()
    return datos[id] ?? null
  }

  function eliminarProblema(id: string) {
    problemas.value = problemas.value.filter((p) => p.id !== id)
    persistirLocal()
    // Limpiar datos completos también
    const datos = cargarDatosCompletos()
    delete datos[id]
    localStorage.setItem(DATOS_KEY, JSON.stringify(datos))
  }

  function setFiltro(nuevoFiltro: Partial<FiltroHistorial>) {
    filtro.value = { ...filtro.value, ...nuevoFiltro }
  }

  function limpiarFiltro() {
    filtro.value = { texto: '', tipoValores: 'todos', ordenarPor: 'fecha_desc' }
  }

  function persistirLocal() {
    localStorage.setItem(LISTA_KEY, JSON.stringify(problemas.value))
  }

  function cargarDatosCompletos(): Record<string, EstadoEditor> {
    try {
      const raw = localStorage.getItem(DATOS_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  return {
    problemas, cargando, error, filtro,
    problemasFiltrados, totalProblemas, hayProblemas,
    cargarHistorial, agregarProblema, obtenerDatosCompletos,
    eliminarProblema, setFiltro, limpiarFiltro,
  }
})
