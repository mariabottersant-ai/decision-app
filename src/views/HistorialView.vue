<script setup lang="ts">
import { onMounted } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import HistorialItem from '../components/historial/HistorialItem.vue'
import { useRouter } from 'vue-router'
import { useHistorialStore } from '../stores/historial'

const router = useRouter()
const historialStore = useHistorialStore()

onMounted(async () => {
  await historialStore.cargarHistorial()
})

function irACalculadora() {
  router.push('/calculadora')
}

function eliminar(id: string) {
  if (confirm('¿Eliminar este problema del historial?')) {
    historialStore.eliminarProblema(id)
  }
}

function seleccionar(id: string) {
  router.push({ path: '/calculadora', query: { id } })
}
</script>

<template>
  <MainLayout>
    <div class="historial-container">

      <!-- Barra de filtros -->
      <div class="filters-bar">
        <div class="search-wrap">
          <input
            class="search-input"
            type="text"
            placeholder="Buscar problema..."
            :value="historialStore.filtro.texto"
            @input="e => historialStore.setFiltro({ texto: (e.target as HTMLInputElement).value })"
          />
        </div>
        <div class="filters-right">
          <select
            class="filtro-select"
            :value="historialStore.filtro.ordenarPor"
            @change="e => historialStore.setFiltro({ ordenarPor: (e.target as HTMLSelectElement).value as any })"
          >
            <option value="fecha_desc">Más reciente</option>
            <option value="fecha_asc">Más antiguo</option>
            <option value="nombre_asc">Nombre A-Z</option>
          </select>
          <BaseButton variant="primary" @click="irACalculadora">
            + Nuevo problema
          </BaseButton>
        </div>
      </div>

      <!-- Cargando -->
      <div v-if="historialStore.cargando" class="estado-cargando">
        <div class="spinner" />
        <p>Cargando historial...</p>
      </div>

      <!-- Vacío: ningún problema guardado todavía -->
      <div v-else-if="!historialStore.hayProblemas" class="estado-vacio">
        <div class="estado-vacio__icono">📋</div>
        <h3 class="estado-vacio__titulo">No hay problemas guardados</h3>
        <p class="estado-vacio__desc">
          Resolvé un problema en la calculadora y guardalo con el botón
          <strong>"Guardar"</strong> para verlo aquí.
        </p>
        <BaseButton variant="primary" @click="irACalculadora">
          Crear primer problema
        </BaseButton>
      </div>

      <!-- Vacío: búsqueda sin resultados -->
      <div v-else-if="historialStore.problemasFiltrados.length === 0" class="estado-vacio">
        <div class="estado-vacio__icono">🔍</div>
        <h3 class="estado-vacio__titulo">Sin resultados</h3>
        <p class="estado-vacio__desc">No se encontraron problemas con ese nombre.</p>
        <BaseButton variant="secondary" @click="historialStore.limpiarFiltro()">
          Limpiar búsqueda
        </BaseButton>
      </div>

      <!-- Lista de problemas guardados -->
      <div v-else class="historial-lista">
        <p class="historial-count">
          {{ historialStore.totalProblemas }}
          problema{{ historialStore.totalProblemas !== 1 ? 's' : '' }} guardado{{ historialStore.totalProblemas !== 1 ? 's' : '' }}
        </p>
        <HistorialItem
          v-for="problema in historialStore.problemasFiltrados"
          :key="problema.id"
          :problema="problema"
          @seleccionar="seleccionar"
          @eliminar="eliminar"
        />
      </div>

    </div>
  </MainLayout>
</template>

<style scoped>
.historial-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: var(--color-surface);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
}
.search-wrap { flex: 1; min-width: 200px; }
.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-size: 13px;
}
.search-input:focus { outline: none; border-color: var(--color-primary); }
.filters-right { display: flex; gap: 8px; align-items: center; }
.filtro-select {
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 12px;
  cursor: pointer;
}
.estado-cargando {
  display: flex; flex-direction: column; align-items: center;
  padding: 4rem; gap: 12px; color: var(--color-text-muted); font-size: 13px;
}
.spinner {
  width: 28px; height: 28px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.estado-vacio {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 5rem 2rem; gap: 12px; text-align: center;
  background: var(--color-surface); border-radius: var(--radius-md);
  border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);
}
.estado-vacio__icono { font-size: 48px; }
.estado-vacio__titulo {
  font-size: 1.1rem; font-weight: 600;
  color: var(--color-text-primary); margin: 0;
}
.estado-vacio__desc {
  font-size: 13px; color: var(--color-text-secondary);
  max-width: 320px; line-height: 1.6; margin: 0;
}
.historial-lista { display: flex; flex-direction: column; gap: 8px; }
.historial-count {
  font-size: 12px; color: var(--color-text-muted); margin: 0 0 4px 2px;
}
</style>
