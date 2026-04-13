<script setup lang="ts">
import { tiempoRelativo } from '../../utils/formateo'
import type { ResumenProblema } from '../../types/historial.types'

const props = defineProps<{ problema: ResumenProblema }>()
void props
const emit = defineEmits<{ seleccionar: [id: string], eliminar: [id: string] }>()
</script>

<template>
  <div class="item" @click="emit('seleccionar', problema.id)">
    <div class="item__info">
      <span class="item__nombre">{{ problema.nombre }}</span>
      <span v-if="problema.descripcion" class="item__desc">{{ problema.descripcion }}</span>
      <div class="item__meta">
        <span class="item__badge" :class="problema.tipoValores === 'utilidades' ? 'badge--blue' : 'badge--orange'">
          {{ problema.tipoValores }}
        </span>
        <span class="item__dim">{{ problema.cantidadAlternativas }}×{{ problema.cantidadEstados }}</span>
        <span class="item__fecha">{{ tiempoRelativo(problema.fechaModificado) }}</span>
      </div>
    </div>
    <div class="item__ganador" v-if="problema.ganadorGlobal">
      <span class="item__ganador-label">★ {{ problema.ganadorGlobal }}</span>
    </div>
    <button
      class="item__btn-eliminar"
      title="Eliminar"
      @click.stop="emit('eliminar', problema.id)"
    >✕</button>
  </div>
</template>

<style scoped>
.item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border: 1px solid var(--color-border);
  border-radius: var(--radius-md); background: var(--color-surface);
  cursor: pointer; transition: all 0.15s;
}
.item:hover { border-color: var(--color-primary); box-shadow: var(--shadow-sm); }
.item__info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.item__nombre { font-weight: 500; font-size: 13px; color: var(--color-text-primary); }
.item__desc { font-size: 11px; color: var(--color-text-muted); }
.item__meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.item__badge {
  font-size: 10px; padding: 1px 6px; border-radius: 10px; font-weight: 500;
}
.badge--blue { background: var(--color-primary-light); color: var(--color-primary); }
.badge--orange { background: var(--color-warning-light); color: var(--color-warning); }
.item__dim, .item__fecha { font-size: 11px; color: var(--color-text-muted); }
.item__ganador-label {
  font-size: 11px; font-weight: 600; color: var(--color-success);
  background: var(--color-success-light); padding: 3px 8px; border-radius: 10px;
}
.item__btn-eliminar {
  background: none; border: none; color: var(--color-text-muted);
  cursor: pointer; font-size: 12px; padding: 4px 6px; border-radius: var(--radius-sm);
  transition: all 0.15s; opacity: 0;
}
.item:hover .item__btn-eliminar { opacity: 1; }
.item__btn-eliminar:hover { background: var(--color-danger-light); color: var(--color-danger); }
</style>
