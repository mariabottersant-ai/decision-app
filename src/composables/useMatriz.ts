// ─────────────────────────────────────────────────────────────
//  composables/useMatriz.ts
//  Lógica de interacción con el editor de matriz.
//  Los componentes usan este composable en vez de llamar
//  al store directamente — centraliza la lógica de UI.
// ─────────────────────────────────────────────────────────────

import { computed } from 'vue'
import { useMatrizStore } from '../stores/matriz'
import { useResultadosStore } from '../stores/resultados'
import { validarCelda } from '../utils/validaciones'

export function useMatriz() {
  const matrizStore = useMatrizStore()
  const resultadosStore = useResultadosStore()

  // ── Accesos directos al estado ────────────────────────────
  const editor = computed(() => matrizStore.editor)
  const esValida = computed(() => matrizStore.esValida)
  const errores = computed(() => matrizStore.erroresValidacion)
  const modificado = computed(() => matrizStore.modificado)

  // ── Edición de celdas ─────────────────────────────────────

  /**
   * Llamado cuando el usuario escribe en una celda.
   * Convierte el string del input a número y actualiza el store.
   * Devuelve el mensaje de error o null si es válido.
   */
  function editarCelda(fila: number, col: number, texto: string): string | null {
    const error = validarCelda(texto)
    if (error) return error

    matrizStore.setCelda(fila, col, Number(texto))
    // Limpia resultados anteriores cuando cambia la matriz
    if (resultadosStore.hayResultados) resultadosStore.limpiar()
    return null
  }

  // ── Gestión de filas y columnas ───────────────────────────

  function agregarFila() {
    matrizStore.agregarFila()
    if (resultadosStore.hayResultados) resultadosStore.limpiar()
  }

  function eliminarFila() {
    if (editor.value.filas <= 2) return
    matrizStore.eliminarUltimaFila()
    if (resultadosStore.hayResultados) resultadosStore.limpiar()
  }

  function agregarColumna() {
    matrizStore.agregarColumna()
    if (resultadosStore.hayResultados) resultadosStore.limpiar()
  }

  function eliminarColumna() {
    if (editor.value.columnas <= 2) return
    matrizStore.eliminarUltimaColumna()
    if (resultadosStore.hayResultados) resultadosStore.limpiar()
  }

  // ── Nombres ───────────────────────────────────────────────

  function renombrarAlternativa(indice: number, nombre: string) {
    matrizStore.setNombreAlternativa(indice, nombre)
  }

  function renombrarEstado(indice: number, nombre: string) {
    matrizStore.setNombreEstado(indice, nombre)
  }

  // ── Ejemplos precargados ──────────────────────────────────

  const ejemplos = [
    {
      nombre: 'Panadería (del PDF)',
      descripcion: 'Peñaloza (2010) — Ejemplo pastelería',
      tipoValores: 'utilidades' as const,
      nombresAlternativas: ['Hornear 50', 'Hornear 80', 'Hornear 110'],
      nombresEstados: ['Dem. Baja', 'Dem. Media', 'Dem. Alta'],
      grilla: [
        [250, 250, 250],
        [70,  400, 400],
        [-110, 220, 550],
      ],
    },
    {
      nombre: 'Campaña publicitaria',
      descripcion: 'Peñaloza (2010) — Medios de comunicación',
      tipoValores: 'utilidades' as const,
      nombresAlternativas: ['Radio', 'TV', 'Prensa'],
      nombresEstados: ['Dem. Alta', 'Dem. Media', 'Dem. Baja'],
      grilla: [
        [10000, 4000, 2000],
        [8000,  2000,  500],
        [9000,  3500, 2500],
      ],
    },
    {
      nombre: 'Pozos petroleros',
      descripcion: 'Peñaloza (2010) — Inversión en pozos',
      tipoValores: 'utilidades' as const,
      nombresAlternativas: ['P. Grande', 'P. Mediano', 'P. Pequeño'],
      nombresEstados: ['8.000 b.', '6.000 b.', '4.000 b.', '2.500 b.'],
      grilla: [
        [240000, 150000,  60000, -7500],
        [140000, 140000, 100000, 40000],
        [ 75000,  75000,  75000, 57500],
      ],
    },
  ]

  function cargarEjemplo(indice: number) {
    const ej = ejemplos[indice]
    if (!ej) return
    matrizStore.cargarProblema(ej)
    resultadosStore.limpiar()
  }

  // ── Reset ─────────────────────────────────────────────────

  function nuevaMatriz(filas = 3, columnas = 3) {
    matrizStore.limpiar(filas, columnas)
    resultadosStore.limpiar()
  }

  return {
    // estado
    editor,
    esValida,
    errores,
    modificado,
    ejemplos,
    // acciones
    editarCelda,
    agregarFila,
    eliminarFila,
    agregarColumna,
    eliminarColumna,
    renombrarAlternativa,
    renombrarEstado,
    cargarEjemplo,
    nuevaMatriz,
  }
}
