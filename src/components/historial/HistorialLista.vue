<script setup lang="ts">
import { useHistorialStore } from '../../stores/historial'
import HistorialItem from './HistorialItem.vue'

const store = useHistorialStore()

function eliminar(id: string) {
  if (confirm('¿Eliminar este problema del historial?')) {
    store.eliminarProblema(id)
  }
}
</script>

<template>
  <div class="lista">
    <!-- Barra de búsqueda y filtros -->
    <div class="lista__filtros">
      <input
        class="lista__busqueda"
        type="text"
        placeholder="Buscar problema..."
        :value="store.filtro.texto"
        @input="e => store.setFiltro({ texto: (e.target as HTMLInputElement).value })"
      />
      <select
        class="lista__select"
        :value="store.filtro.tipoValores"
        @change="e => store.setFiltro({ tipoValores: (e.target as HTMLSelectElement).value as any })"
      >
        <option value="todos">Todos</option>
        <option value="utilidades">Utilidades</option>
        <option value="costos">Costos</option>
      </select>
      <select
        class="lista__select"
        :value="store.filtro.ordenarPor"
        @change="e => store.setFiltro({ ordenarPor: (e.target as HTMLSelectElement).value as any })"
      >
        <option value="fecha_desc">Más reciente</option>
        <option value="fecha_asc">Más antiguo</option>
        <option value="nombre_asc">Nombre A-Z</option>
      </select>
    </div>

    <!-- Estado vacío -->
    <div v-if="!store.hayProblemas" class="lista__vacio">
      <div class="lista__vacio-icono">📋</div>
      <p class="lista__vacio-titulo">No hay problemas guardados</p>
      <p class="lista__vacio-desc">Resolvé un problema en la calculadora y guardalo aquí.</p>
    </div>

    <!-- Sin resultados de búsqueda -->
    <div v-else-if="store.problemasFiltrados.length === 0" class="lista__vacio">
      <div class="lista__vacio-icono">🔍</div>
      <p class="lista__vacio-titulo">Sin resultados</p>
      <p class="lista__vacio-desc">Probá con otros términos de búsqueda.</p>
    </div>

    <!-- Lista de problemas -->
    <div v-else class="lista__items">
      <HistorialItem
        v-for="p in store.problemasFiltrados"
        :key="p.id"
        :problema="p"
        @seleccionar="id => $router.push({ name: 'calculadora', query: { id } })"
        @eliminar="eliminar"
      />
    </div>
  </div>
</template>

<style scoped>
.lista { display: flex; flex-direction: column; gap: 14px; }
.lista__filtros { display: flex; gap: 8px; flex-wrap: wrap; }
.lista__busqueda {
  flex: 1; min-width: 180px; padding: 8px 12px;
  border: 1px solid var(--color-border); border-radius: var(--radius-md);
  background: var(--color-surface); color: var(--color-text-primary); font-size: 13px;
}
.lista__busqueda:focus { outline: none; border-color: var(--color-primary); }
.lista__select {
  padding: 8px 10px; border: 1px solid var(--color-border);
  border-radius: var(--radius-md); background: var(--color-surface);
  color: var(--color-text-secondary); font-size: 12px; cursor: pointer;
}
.lista__vacio {
  display: flex; flex-direction: column; align-items: center;
  padding: 48px 24px; gap: 8px; text-align: center;
}
.lista__vacio-icono { font-size: 40px; }
.lista__vacio-titulo { font-size: 15px; font-weight: 500; color: var(--color-text-primary); }
.lista__vacio-desc { font-size: 13px; color: var(--color-text-muted); }
.lista__items { display: flex; flex-direction: column; gap: 8px; }
</style>
