// ─────────────────────────────────────────────────────────────
//  stores/matriz.ts
//  Estado global de la matriz activa en el editor
// ─────────────────────────────────────────────────────────────

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EstadoEditor, TipoValores } from '../types/matriz.types'
import type { FilaMatriz } from '../utils/calculos'
import { editorInicial } from '../types/matriz.types'
import { validarEditor } from '../utils/validaciones'

export const useMatrizStore = defineStore('matriz', () => {
  // ── Estado ────────────────────────────────────────────────
  const editor = ref<EstadoEditor>(editorInicial())
  const modificado = ref(false)   // true si hay cambios sin guardar

  // ── Getters ───────────────────────────────────────────────

  /** ¿La matriz tiene todos los valores completos y es válida? */
  const esValida = computed(() => {
    const { valido } = validarEditor(editor.value)
    return valido
  })

  /** Convierte el estado del editor al formato que usan los algoritmos */
  const filasParaCalculo = computed<FilaMatriz[]>(() => {
    return editor.value.grilla.map((fila, i) => ({
      id: `alt_${i}`,
      nombre: editor.value.nombresAlternativas[i] || `D${i + 1}`,
      valores: fila.map((v) => v ?? 0),
    }))
  })

  /** Errores de validación actuales */
  const erroresValidacion = computed(() => {
    return validarEditor(editor.value).errores
  })

  // ── Acciones ──────────────────────────────────────────────

  function setNombreProblema(nombre: string) {
    editor.value.nombreProblema = nombre
    modificado.value = true
  }

  function setDescripcion(descripcion: string) {
    editor.value.descripcion = descripcion
    modificado.value = true
  }

  function setTipoValores(tipo: TipoValores) {
    editor.value.tipoValores = tipo
    modificado.value = true
  }

  function setCelda(fila: number, columna: number, valor: number | null) {
    editor.value.grilla[fila][columna] = valor
    modificado.value = true
  }

  function setNombreAlternativa(indice: number, nombre: string) {
    editor.value.nombresAlternativas[indice] = nombre
    modificado.value = true
  }

  function setNombreEstado(indice: number, nombre: string) {
    editor.value.nombresEstados[indice] = nombre
    modificado.value = true
  }

  /** Agrega una fila (alternativa) nueva al final */
  function agregarFila() {
    const { filas, columnas } = editor.value
    editor.value.filas++
    editor.value.nombresAlternativas.push(`D${filas + 1}`)
    editor.value.grilla.push(Array(columnas).fill(null))
    modificado.value = true
  }

  /** Elimina la última fila si hay más de 2 */
  function eliminarUltimaFila() {
    if (editor.value.filas <= 2) return
    editor.value.filas--
    editor.value.nombresAlternativas.pop()
    editor.value.grilla.pop()
    modificado.value = true
  }

  /** Agrega una columna (estado) nueva al final */
  function agregarColumna() {
    const { columnas } = editor.value
    editor.value.columnas++
    editor.value.nombresEstados.push(`E${columnas + 1}`)
    editor.value.grilla.forEach((fila) => fila.push(null))
    modificado.value = true
  }

  /** Elimina la última columna si hay más de 2 */
  function eliminarUltimaColumna() {
    if (editor.value.columnas <= 2) return
    editor.value.columnas--
    editor.value.nombresEstados.pop()
    editor.value.grilla.forEach((fila) => fila.pop())
    modificado.value = true
  }

  /** Carga un problema del historial en el editor */
  function cargarProblema(data: {
    nombre: string
    descripcion?: string
    tipoValores: TipoValores
    nombresAlternativas: string[]
    nombresEstados: string[]
    grilla: number[][]
  }) {
    const filas = data.nombresAlternativas.length
    const columnas = data.nombresEstados.length
    editor.value = {
      filas,
      columnas,
      tipoValores: data.tipoValores,
      nombreProblema: data.nombre,
      descripcion: data.descripcion ?? '',
      nombresAlternativas: [...data.nombresAlternativas],
      nombresEstados: [...data.nombresEstados],
      grilla: data.grilla.map((fila) => [...fila]),
    }
    modificado.value = false
  }

  /** Reinicia el editor a un estado vacío */
  function limpiar(filas = 3, columnas = 3) {
    editor.value = editorInicial(filas, columnas)
    modificado.value = false
  }

  /** Marca el estado como guardado (sin cambios pendientes) */
  function marcarGuardado() {
    modificado.value = false
  }

  return {
    // estado
    editor,
    modificado,
    // getters
    esValida,
    filasParaCalculo,
    erroresValidacion,
    // acciones
    setNombreProblema,
    setDescripcion,
    setTipoValores,
    setCelda,
    setNombreAlternativa,
    setNombreEstado,
    agregarFila,
    eliminarUltimaFila,
    agregarColumna,
    eliminarUltimaColumna,
    cargarProblema,
    limpiar,
    marcarGuardado,
  }
})
