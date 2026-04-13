<script setup lang="ts">
import { useMatriz } from '../../composables/useMatriz'

const { ejemplos, cargarEjemplo } = useMatriz()

const emit = defineEmits<{ cerrar: [] }>()

function seleccionar(i: number) {
  cargarEjemplo(i)
  emit('cerrar')
}
</script>

<template>
  <div class="ejemplos">
    <p class="ejemplos__desc">Cargá un problema de ejemplo del libro de Peñaloza (2010):</p>
    <div class="ejemplos__lista">
      <button
        v-for="(ej, i) in ejemplos"
        :key="i"
        class="ejemplos__item"
        @click="seleccionar(i)"
      >
        <span class="ejemplos__nombre">{{ ej.nombre }}</span>
        <span class="ejemplos__detalle">{{ ej.descripcion }}</span>
        <span class="ejemplos__badge">
          {{ ej.nombresAlternativas.length }}×{{ ej.nombresEstados.length }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.ejemplos__desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}
.ejemplos__lista { display: flex; flex-direction: column; gap: 6px; }
.ejemplos__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}
.ejemplos__item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}
.ejemplos__nombre {
  font-weight: 500;
  font-size: 13px;
  color: var(--color-text-primary);
  flex: 1;
}
.ejemplos__detalle {
  font-size: 11px;
  color: var(--color-text-muted);
  flex: 2;
}
.ejemplos__badge {
  font-size: 11px;
  font-family: var(--font-mono);
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}
</style>
