<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useMatrizStore } from '../../stores/matriz'
import { useMatriz } from '../../composables/useMatriz'
import MatrizCelda from './MatrizCelda.vue'
import MatrizControles from './MatrizControles.vue'
import MatrizEjemplos from './MatrizEjemplos.vue'

const matrizStore = useMatrizStore()
const {
  editor,
  agregarFila, eliminarFila,
  agregarColumna, eliminarColumna,
  renombrarAlternativa, renombrarEstado,
  nuevaMatriz,
} = useMatriz()

const mostrarEjemplos = ref(false)

defineEmits<{
  nombreCambio: [nombre: string]
  tipoCambio: [tipo: string]
}>()

// Cuando se carga un ejemplo, cerrar el modal automáticamente
watch(() => editor.value.nombreProblema, (nuevo, viejo) => {
  if (nuevo !== viejo && mostrarEjemplos.value) {
    mostrarEjemplos.value = false
  }
})

function onActualizarCelda(fila: number, col: number, valor: number | null) {
  matrizStore.setCelda(fila, col, valor)
}

function onNombreProblema(e: Event) {
  matrizStore.setNombreProblema((e.target as HTMLInputElement).value)
}

function onTipoValores(e: Event) {
  matrizStore.setTipoValores((e.target as HTMLSelectElement).value as any)
}

const celdasVacias = computed(() => {
  let count = 0
  for (const fila of editor.value.grilla) {
    for (const valor of fila) {
      if (valor === null) count++
    }
  }
  return count
})
</script>

<template>
  <div class="editor">
    <!-- Encabezado -->
    <div class="editor__header">
      <div class="editor__meta">
        <div class="editor__nombre-wrap">
          <input
            class="editor__nombre"
            :class="{ 'editor__nombre--error': !editor.nombreProblema.trim() }"
            type="text"
            placeholder="Nombre del problema..."
            :value="editor.nombreProblema"
            @input="onNombreProblema"
          />
          <span v-if="!editor.nombreProblema.trim()" class="editor__nombre-error">
            El nombre es obligatorio para calcular
          </span>
        </div>
        <select
          class="editor__tipo"
          :value="editor.tipoValores"
          @change="onTipoValores"
        >
          <option value="utilidades">Utilidades (mayor = mejor)</option>
          <option value="costos">Costos (menor = mejor)</option>
        </select>
      </div>
      <div class="editor__acciones">
        <button class="editor__btn-ejemplo" @click="mostrarEjemplos = true">
          📂 Cargar ejemplo
        </button>
        <button class="editor__btn-limpiar" @click="nuevaMatriz()">
          🗑 Nueva matriz
        </button>
      </div>
    </div>

    <!-- Controles de dimensión -->
    <MatrizControles
      :filas="editor.filas"
      :columnas="editor.columnas"
      @agregar-fila="agregarFila"
      @eliminar-fila="eliminarFila"
      @agregar-columna="agregarColumna"
      @eliminar-columna="eliminarColumna"
    />

    <!-- Banner de estado -->
    <div v-if="matrizStore.esValida" class="banner banner--ok">
      🟢 Matriz lista — podés calcular
    </div>
    <div v-else-if="!editor.nombreProblema.trim()" class="banner banner--error">
      🔴 Falta ingresar el nombre del problema
    </div>
    <div v-else-if="celdasVacias > 0" class="banner banner--warning">
      🟡 {{ celdasVacias }} celda{{ celdasVacias !== 1 ? 's' : '' }} sin completar
    </div>

    <!-- Tabla de la matriz -->
    <div class="editor__tabla-wrap">
      <table class="editor__tabla">
        <thead>
          <tr>
            <th class="editor__th editor__th--esquina">Alt. / Estado</th>
            <th
              v-for="(nombre, j) in editor.nombresEstados"
              :key="`estado-${j}`"
              class="editor__th"
            >
              <input
                class="editor__th-input"
                type="text"
                :value="nombre"
                @change="e => renombrarEstado(j, (e.target as HTMLInputElement).value)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fila, i) in editor.grilla" :key="`fila-${i}`">
            <td class="editor__td editor__td--label">
              <input
                class="editor__td-input"
                type="text"
                :value="editor.nombresAlternativas[i]"
                @change="e => renombrarAlternativa(i, (e.target as HTMLInputElement).value)"
              />
            </td>
            <td v-for="(val, j) in fila" :key="`celda-${i}-${j}`" class="editor__td">
              <MatrizCelda
                :key="`mc-${i}-${j}-${val}`"
                :fila="i"
                :columna="j"
                :valor="val"
                @actualizar="onActualizarCelda"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Panel de ejemplos (inline, no modal) -->
    <div v-if="mostrarEjemplos" class="editor__ejemplos-panel">
      <div class="editor__ejemplos-header">
        <span class="editor__ejemplos-titulo">Ejemplos del libro (Peñaloza, 2010)</span>
        <button class="editor__ejemplos-cerrar" @click="mostrarEjemplos = false">✕</button>
      </div>
      <MatrizEjemplos @cerrar="mostrarEjemplos = false" />
    </div>
  </div>
</template>

<style scoped>
.editor { display: flex; flex-direction: column; gap: 14px; }

.editor__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
.editor__meta { display: flex; flex-direction: column; gap: 6px; flex: 1; }

.editor__nombre-wrap { display: flex; flex-direction: column; width: 100%; position: relative; }
.editor__nombre {
  font-size: 15px; font-weight: 500;
  border: none; border-bottom: 2px solid var(--color-border);
  background: transparent; color: var(--color-text-primary);
  padding: 4px 0; width: 100%; transition: border-color 0.15s;
}
.editor__nombre:focus { outline: none; border-bottom-color: var(--color-primary); }
.editor__nombre::placeholder { color: var(--color-text-muted); }
.editor__nombre--error { border-bottom-color: var(--color-danger); }
.editor__nombre-error { font-size: 11px; color: var(--color-danger); margin-top: 4px; }

.banner {
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
}
.banner--ok {
  background: var(--color-success-light);
  border-left: 3px solid var(--color-success);
  color: var(--color-success);
}
.banner--warning {
  background: var(--color-warning-light);
  border-left: 3px solid var(--color-warning);
  color: var(--color-warning);
}
.banner--error {
  background: var(--color-danger-light);
  border-left: 3px solid var(--color-danger);
  color: var(--color-danger);
}

.editor__tipo {
  font-size: 12px; color: var(--color-text-secondary);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  padding: 4px 8px; background: var(--color-surface); cursor: pointer;
  width: fit-content;
}

.editor__acciones { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }

.editor__btn-ejemplo, .editor__btn-limpiar {
  padding: 6px 12px; border-radius: var(--radius-sm); font-size: 12px;
  cursor: pointer; border: 1px solid var(--color-border);
  background: var(--color-surface); color: var(--color-text-secondary);
  transition: all 0.15s; white-space: nowrap;
}
.editor__btn-ejemplo:hover { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-light); }
.editor__btn-limpiar:hover { border-color: var(--color-danger); color: var(--color-danger); background: var(--color-danger-light); }

.editor__tabla-wrap { overflow-x: auto; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.editor__tabla { border-collapse: collapse; width: 100%; min-width: 300px; }

.editor__th {
  padding: 8px 10px; background: var(--color-primary-light);
  border: 1px solid var(--color-border); font-size: 12px;
  font-weight: 500; color: var(--color-text-secondary); min-width: 90px;
}
.editor__th--esquina { min-width: 130px; text-align: left; }

.editor__th-input {
  background: transparent; border: none; width: 100%;
  text-align: center; font-size: 12px; font-weight: 500;
  color: var(--color-text-primary); cursor: pointer;
}
.editor__th-input:focus { outline: 1px solid var(--color-primary); border-radius: 2px; }

.editor__td { padding: 4px 6px; border: 1px solid var(--color-border); }
.editor__td--label { background: var(--color-primary-light); padding: 4px 8px; }

.editor__td-input {
  background: transparent; border: none; width: 100%;
  font-size: 12px; font-weight: 500; color: var(--color-text-primary); cursor: pointer;
}
.editor__td-input:focus { outline: 1px solid var(--color-primary); border-radius: 2px; }

/* Panel de ejemplos inline — visible debajo del editor */
.editor__ejemplos-panel {
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  animation: slideDown 0.2s ease;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.editor__ejemplos-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px;
  background: var(--color-primary-light);
  border-bottom: 1px solid var(--color-border);
}
.editor__ejemplos-titulo { font-size: 12px; font-weight: 600; color: var(--color-primary); }
.editor__ejemplos-cerrar {
  background: none; border: none; cursor: pointer;
  color: var(--color-text-muted); font-size: 14px; padding: 2px 6px;
  border-radius: var(--radius-sm); transition: all 0.15s;
}
.editor__ejemplos-cerrar:hover { background: var(--color-danger-light); color: var(--color-danger); }
</style>
