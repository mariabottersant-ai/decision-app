<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '../components/layout/MainLayout.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseModal from '../components/ui/BaseModal.vue'
import BaseInput from '../components/ui/BaseInput.vue'

import MatrizEditor     from '../components/matriz/MatrizEditor.vue'
import ResultadoLaplace from '../components/criterios/ResultadoLaplace.vue'
import ResultadoHurwicz from '../components/criterios/ResultadoHurwicz.vue'
import ResultadoMaxiMax from '../components/criterios/ResultadoMaxiMax.vue'
import ResultadoMaxiMin from '../components/criterios/ResultadoMaxiMin.vue'
import ResultadoSavage  from '../components/criterios/ResultadoSavage.vue'
import ResumenCriterios from '../components/criterios/ResumenCriterios.vue'
import ExportarModal    from '../components/exportar/ExportarModal.vue'
import BaseToast        from '../components/ui/BaseToast.vue'

import { useMatrizStore }     from '../stores/matriz'
import { useHistorialStore }  from '../stores/historial'
import { useCriterios }       from '../composables/useCriterios'
import type { ResumenProblema } from '../types/historial.types'

const matrizStore    = useMatrizStore()
const historialStore = useHistorialStore()
const route          = useRoute()
const { calcular, hayResultados, cargando, error, ganadorGlobal } = useCriterios()

// ── Cargar problema del historial si viene con ?id= ───────
onMounted(() => {
  const id = route.query.id as string | undefined
  if (id) {
    const datos = historialStore.obtenerDatosCompletos(id)
    if (datos) {
      matrizStore.cargarProblema({
        nombre:               datos.nombreProblema,
        descripcion:          datos.descripcion,
        tipoValores:          datos.tipoValores,
        nombresAlternativas:  datos.nombresAlternativas,
        nombresEstados:       datos.nombresEstados,
        grilla:               datos.grilla.map(f => f.map(v => v ?? 0)),
      })
    }
  }
})

// ── Modales ───────────────────────────────────────────────
const modalGuardar  = ref(false)
const modalExportar = ref(false)
const toastMsg      = ref('')
const showToast     = ref(false)
const nombreGuardar = ref('')

// ── Tabs de resultados ────────────────────────────────────
type Tab = 'resumen' | 'laplace' | 'hurwicz' | 'maximax' | 'maximin' | 'savage'
const tabActivo = ref<Tab>('resumen')
const tabs: { key: Tab; label: string }[] = [
  { key: 'resumen', label: 'Resumen'  },
  { key: 'laplace', label: 'Laplace'  },
  { key: 'hurwicz', label: 'Hurwicz'  },
  { key: 'maximax', label: 'MaxiMax'  },
  { key: 'maximin', label: 'MaxiMin'  },
  { key: 'savage',  label: 'Savage'   },
]

// Al llegar resultados, mostrar resumen automáticamente
watch(hayResultados, (val) => { if (val) tabActivo.value = 'resumen' })

// ── Acciones ──────────────────────────────────────────────
async function onCalcular() {
  await calcular()
}

function onGuardar() {
  nombreGuardar.value = matrizStore.editor.nombreProblema
  modalGuardar.value = true
}

function onExportarExito(msg: string) {
  toastMsg.value = msg
  showToast.value = true
}

function confirmarGuardar() {
  if (!nombreGuardar.value.trim()) return
  matrizStore.setNombreProblema(nombreGuardar.value)

  const problema: ResumenProblema = {
    id: `prob_${Date.now()}`,
    nombre: nombreGuardar.value,
    descripcion: matrizStore.editor.descripcion,
    fechaCreado: new Date().toISOString(),
    fechaModificado: new Date().toISOString(),
    cantidadAlternativas: matrizStore.editor.filas,
    cantidadEstados: matrizStore.editor.columnas,
    tipoValores: matrizStore.editor.tipoValores,
    ganadorGlobal: ganadorGlobal.value ?? undefined,
  }
  // Guarda el resumen Y la matriz completa para poder recargarla
  historialStore.agregarProblema(problema, { ...matrizStore.editor })
  matrizStore.marcarGuardado()
  modalGuardar.value = false
}
</script>

<template>
  <MainLayout>
    <div class="calculadora-layout">

      <!-- ── Columna izquierda: Editor ─────────────────── -->
      <div class="columna-editor">
        <div class="panel-header">
          <h2>Matriz de Pagos</h2>
          <div class="acciones">
            <BaseButton
              variant="secondary" size="sm"
              :disabled="!hayResultados"
              @click="modalExportar = true"
            >Exportar</BaseButton>
            <BaseButton
              variant="secondary" size="sm"
              @click="onGuardar"
            >Guardar</BaseButton>
            <BaseButton
              size="sm"
              :loading="cargando"
              :disabled="!matrizStore.esValida"
              @click="onCalcular"
            >Calcular</BaseButton>
          </div>
        </div>

        <div v-if="error" class="panel-error">{{ error }}</div>

        <div class="editor-wrap">
          <MatrizEditor
            @nombre-cambio="matrizStore.setNombreProblema"
            @tipo-cambio="(t: any) => matrizStore.setTipoValores(t)"
          />
        </div>
      </div>

      <!-- ── Columna derecha: Resultados ───────────────── -->
      <div class="columna-resultados">

        <div v-if="!hayResultados" class="estado-vacio">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" class="icono-vacio">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          <h3>Aún no hay resultados</h3>
          <p>Completá la matriz y hacé clic en<br><strong>Calcular</strong> para ver el análisis.</p>
        </div>

        <template v-else>
          <div class="tabs">
            <button
              v-for="tab in tabs" :key="tab.key"
              class="tab" :class="{ 'tab--activo': tabActivo === tab.key }"
              @click="tabActivo = tab.key"
            >{{ tab.label }}</button>
          </div>
          <div class="tab-contenido">
            <ResumenCriterios v-if="tabActivo === 'resumen'" />
            <ResultadoLaplace v-if="tabActivo === 'laplace'" />
            <ResultadoHurwicz v-if="tabActivo === 'hurwicz'" />
            <ResultadoMaxiMax v-if="tabActivo === 'maximax'" />
            <ResultadoMaxiMin v-if="tabActivo === 'maximin'" />
            <ResultadoSavage  v-if="tabActivo === 'savage'"  />
          </div>
        </template>
      </div>
    </div>

    <!-- Modal guardar -->
    <BaseModal v-model="modalGuardar" titulo="Guardar problema">
      <div style="margin: 1rem 0">
        <BaseInput
          v-model="nombreGuardar"
          label="Nombre del problema"
          placeholder="Ej: Tarea 2 Unidad 1"
        />
      </div>
      <template #footer>
        <BaseButton variant="ghost" @click="modalGuardar = false">Cancelar</BaseButton>
        <BaseButton variant="primary" :disabled="!nombreGuardar.trim()" @click="confirmarGuardar">
          Guardar
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Modal exportar -->
    <ExportarModal 
      :visible="modalExportar" 
      @cerrar="modalExportar = false" 
      @exito="onExportarExito"
    />

    <!-- Toast de éxito 10s -->
    <BaseToast
      :mensaje="toastMsg"
      tipo="success"
      :visible="showToast"
      :duracion="10000"
      @cerrar="showToast = false"
    />

  </MainLayout>
</template>

<style scoped>
.calculadora-layout {
  display: flex;
  gap: 1.5rem;
  height: calc(100vh - 64px - 3rem);
}
@media (max-width: 900px) {
  .calculadora-layout { flex-direction: column; height: auto; }
}
.columna-editor {
  flex: 3;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.columna-resultados {
  flex: 2;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.panel-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.panel-header h2 { font-size: 1.1rem; font-weight: 600; color: var(--color-text-primary); margin: 0; }
.acciones { display: flex; gap: 0.5rem; }
.panel-error {
  padding: 8px 20px;
  background: var(--color-danger-light);
  color: var(--color-danger);
  font-size: 12px;
  flex-shrink: 0;
}
.editor-wrap { flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem; }
.estado-vacio {
  flex: 1;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 2rem; gap: 10px; text-align: center;
}
.icono-vacio { color: var(--color-text-muted); margin-bottom: 4px; }
.estado-vacio h3 { font-size: 15px; font-weight: 600; color: var(--color-text-primary); margin: 0; }
.estado-vacio p { font-size: 13px; color: var(--color-text-secondary); margin: 0; line-height: 1.6; }
.tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
  flex-shrink: 0;
}
.tab {
  padding: 10px 14px;
  font-size: 12px; font-weight: 500;
  color: var(--color-text-secondary);
  background: none; border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer; white-space: nowrap;
  transition: all 0.15s;
}
.tab:hover { color: var(--color-primary); background: var(--color-primary-light); }
.tab--activo { color: var(--color-primary); border-bottom-color: var(--color-primary); }
.tab-contenido { flex: 1; overflow-y: auto; padding: 1.25rem; }
</style>
