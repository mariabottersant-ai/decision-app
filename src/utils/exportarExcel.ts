// ─────────────────────────────────────────────────────────────
//  utils/exportarExcel.ts
//  Genera un archivo Excel (.xlsx) con la matriz de pagos
//  y los resultados de todos los criterios.
//  Usa SheetJS (xlsx) — npm install xlsx
// ─────────────────────────────────────────────────────────────

import * as XLSX from 'xlsx'
import { save } from '@tauri-apps/plugin-dialog'
import { writeFile } from '@tauri-apps/plugin-fs'
import type { EstadoEditor } from '../types/matriz.types'
import type { ResumenCriterios } from '../types/criterios.types'
import { formatearNumero, formatearAlpha, etiquetaOptimismo } from './formateo'

// ─── Helpers ──────────────────────────────────────────────────

// ─── Hoja 1: Matriz de Pagos ──────────────────────────────────

function crearHojaMatriz(editor: EstadoEditor): XLSX.WorkSheet {
  const filas: any[][] = []

  // Título
  filas.push([`Problema: ${editor.nombreProblema || 'Sin nombre'}`])
  filas.push([`Tipo de valores: ${editor.tipoValores === 'utilidades' ? 'Utilidades (mayor = mejor)' : 'Costos (menor = mejor)'}`])
  filas.push([]) // espacio

  // Encabezado de la tabla
  filas.push(['Alternativa / Estado', ...editor.nombresEstados])

  // Filas de datos
  editor.grilla.forEach((fila, i) => {
    filas.push([editor.nombresAlternativas[i], ...fila.map(v => v ?? 0)])
  })

  const ws = XLSX.utils.aoa_to_sheet(filas)

  // Anchos de columna
  ws['!cols'] = [
    { wch: 24 },
    ...editor.nombresEstados.map(() => ({ wch: 14 })),
  ]

  // Merge del título
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: editor.nombresEstados.length } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: editor.nombresEstados.length } },
  ]

  return ws
}

// ─── Hoja 2: Resultados por criterio ─────────────────────────

function crearHojaResultados(
  editor: EstadoEditor,
  resumen: ResumenCriterios,
  alpha: number,
): XLSX.WorkSheet {
  const filas: any[][] = []
  const criterios = [
    { key: 'laplace' as const, nombre: 'Laplace' },
    { key: 'hurwicz' as const, nombre: `Hurwicz (α=${formatearAlpha(alpha)} — ${etiquetaOptimismo(alpha)})` },
    { key: 'maximax' as const, nombre: editor.tipoValores === 'utilidades' ? 'MaxiMax (Optimista)' : 'MiniMin (Optimista)' },
    { key: 'maximin' as const, nombre: editor.tipoValores === 'utilidades' ? 'MaxiMin (Pesimista)' : 'MiniMax (Pesimista)' },
    { key: 'savage' as const, nombre: 'Savage (Arrepentimiento)' },
  ]

  filas.push([`Resultados — ${editor.nombreProblema || 'Sin nombre'}`])
  filas.push([])

  criterios.forEach(({ key, nombre }) => {
    const resultado = resumen[key]
    if (!resultado) return

    // Encabezado del criterio
    filas.push([`CRITERIO: ${nombre}`])
    filas.push(['Alternativa', 'Desarrollo / Cálculo', 'Resultado', '¿Ganador?'])

    resultado.pasos.forEach((paso, i) => {
      const v = resultado.valores[i]
      filas.push([
        v?.nombreAlternativa ?? '',
        paso.descripcion.includes(': ') ? paso.descripcion.split(': ').slice(1).join(': ') : paso.descripcion,
        paso.resultado,
        v?.esGanador ? '★ GANADOR' : '',
      ])
    })

    filas.push([`→ Mejor alternativa: ${resultado.ganador.nombreAlternativa}`, '', resultado.ganador.valor, ''])
    filas.push([]) // espacio entre criterios
  })

  const ws = XLSX.utils.aoa_to_sheet(filas)
  ws['!cols'] = [{ wch: 26 }, { wch: 42 }, { wch: 14 }, { wch: 12 }]

  return ws
}

// ─── Hoja 3: Tabla comparativa ────────────────────────────────

function crearHojaComparativa(
  editor: EstadoEditor,
  resumen: ResumenCriterios,
  alpha: number,
  ganadorGlobal: string | null,
): XLSX.WorkSheet {
  const filas: any[][] = []
  const criterios = ['Laplace', `Hurwicz α=${formatearAlpha(alpha)}`, 'MaxiMax', 'MaxiMin', 'Savage']
  const keys = ['laplace', 'hurwicz', 'maximax', 'maximin', 'savage'] as const

  filas.push([`Comparativa de Criterios — ${editor.nombreProblema || 'Sin nombre'}`])
  filas.push([])
  filas.push(['Alternativa', ...criterios])

  editor.nombresAlternativas.forEach((nombre, i) => {
    const fila: (string | number)[] = [nombre]
    keys.forEach(k => {
      const val = resumen[k]?.valores[i]
      fila.push(val ? val.valor : '—')
    })
    filas.push(fila)
  })

  filas.push([])
  filas.push(['GANADOR POR CRITERIO'])
  const ganadoresFila: string[] = ['']
  keys.forEach(k => {
    ganadoresFila.push(resumen[k]?.ganador.nombreAlternativa ?? '—')
  })
  filas.push(ganadoresFila)

  filas.push([])
  filas.push([`ALTERNATIVA MÁS CONVENIENTE (mayoría de criterios): ${ganadorGlobal ?? '—'}`])

  const ws = XLSX.utils.aoa_to_sheet(filas)
  ws['!cols'] = [{ wch: 26 }, ...criterios.map(() => ({ wch: 16 }))]
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: criterios.length } },
  ]

  return ws
}

// ─── Hoja 4: Savage — Matriz de arrepentimiento ───────────────

function crearHojaSavage(
  editor: EstadoEditor,
  resumen: ResumenCriterios,
): XLSX.WorkSheet | null {
  const savage = resumen.savage
  if (!savage?.matrizArrepentimiento) return null

  const filas: any[][] = []
  filas.push([`Savage — Matriz de Arrepentimiento`])
  filas.push([])
  filas.push(['Alternativa', ...editor.nombresEstados, 'MiniMax'])

  savage.valores.forEach((v, i) => {
    const fila = [v.nombreAlternativa, ...savage.matrizArrepentimiento![i], v.valor]
    filas.push(fila)
  })

  filas.push([])
  filas.push([`→ Menor arrepentimiento: ${savage.ganador.nombreAlternativa} (${formatearNumero(savage.ganador.valor)})`])

  const ws = XLSX.utils.aoa_to_sheet(filas)
  ws['!cols'] = [{ wch: 24 }, ...editor.nombresEstados.map(() => ({ wch: 14 })), { wch: 12 }]

  return ws
}

// ─── Función principal ────────────────────────────────────────

export async function exportarExcel(
  editor: EstadoEditor,
  resumen: ResumenCriterios,
  alpha: number,
  ganadorGlobal: string | null,
): Promise<string | null> {
  const wb = XLSX.utils.book_new()

  // Hoja 1: Matriz
  const hojaMatriz = crearHojaMatriz(editor)
  XLSX.utils.book_append_sheet(wb, hojaMatriz, 'Matriz de Pagos')

  // Hoja 2: Resultados detallados
  const hojaResultados = crearHojaResultados(editor, resumen, alpha)
  XLSX.utils.book_append_sheet(wb, hojaResultados, 'Resultados')

  // Hoja 3: Comparativa
  const hojaComp = crearHojaComparativa(editor, resumen, alpha, ganadorGlobal)
  XLSX.utils.book_append_sheet(wb, hojaComp, 'Comparativa')

  // Hoja 4: Savage (si existe)
  const hojaSavage = crearHojaSavage(editor, resumen)
  if (hojaSavage) {
    XLSX.utils.book_append_sheet(wb, hojaSavage, 'Savage - Arrepentimiento')
  }

  // Generar nombre del archivo
  const nombre = (editor.nombreProblema || 'decision')
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-_]/g, '')
    .trim()
    .replace(/\s+/g, '_')

  const fecha = new Date().toISOString().slice(0, 10)
  const nombreArchivo = `${nombre}_${fecha}.xlsx`

  // Descargar con Tauri dialog
  try {
    const filePath = await save({
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
      defaultPath: nombreArchivo
    });
    if (filePath) {
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      await writeFile(filePath, new Uint8Array(excelBuffer));
      return filePath;
    }
    return null;
  } catch (error) {
    // Fallback nativo web
    XLSX.writeFile(wb, nombreArchivo);
    return null;
  }
}
