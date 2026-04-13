<script setup lang="ts">
import { computed } from 'vue'
import { useCriterios } from '../../composables/useCriterios'

const { resumen, ganadorGlobal, tablaComparativa, alpha } = useCriterios()

const criterios = [
  { key: 'laplace',  label: 'Laplace' },
  { key: 'hurwicz',  label: computed(() => `Hurwicz (α=${alpha.value.toFixed(2)})`) },
  { key: 'maximax',  label: 'MaxiMax' },
  { key: 'maximin',  label: 'MaxiMin' },
  { key: 'savage',   label: 'Savage'  },
]
</script>

<template>
  <div v-if="resumen" class="resumen">
    <!-- Ganador global -->
    <div class="resumen__global">
      <span class="resumen__global-label">Alternativa más conveniente (mayoría de criterios):</span>
      <span class="resumen__global-valor">{{ ganadorGlobal ?? '—' }}</span>
    </div>

    <!-- Tabla comparativa -->
    <div class="resumen__tabla-wrap">
      <table class="resumen__tabla">
        <thead>
          <tr>
            <th class="th-alt">Alternativa</th>
            <th v-for="c in criterios" :key="c.key">
              {{ typeof c.label === 'string' ? c.label : c.label.value }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fila in tablaComparativa" :key="String(fila.alternativa)">
            <td class="td-alt">{{ fila.alternativa }}</td>
            <td
              v-for="c in criterios"
              :key="c.key"
              :class="[
                'td-val',
                fila[`${c.key}_ganador`] ? 'td-ganador' : '',
                String(fila[c.key]).startsWith('-') ? 'negativo' : ''
              ]"
            >
              {{ fila[c.key] }}
              <span v-if="fila[`${c.key}_ganador`]" class="td-estrella">★</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.resumen { display: flex; flex-direction: column; gap: 14px; }
.resumen__global {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 12px 16px; background: var(--color-success-light);
  border-radius: var(--radius-md); border: 1px solid var(--color-success);
}
.resumen__global-label { font-size: 12px; color: var(--color-text-secondary); }
.resumen__global-valor {
  font-size: 15px; font-weight: 700; color: var(--color-success);
}
.resumen__tabla-wrap { overflow-x: auto; }
.resumen__tabla { width: 100%; border-collapse: collapse; font-size: 12px; }
.resumen__tabla th {
  padding: 7px 10px; background: var(--color-primary-light);
  color: var(--color-text-secondary); font-weight: 500;
  border: 1px solid var(--color-border); text-align: center; white-space: nowrap;
}
.resumen__tabla td { padding: 7px 10px; border: 1px solid var(--color-border); text-align: center; }
.th-alt, .td-alt { text-align: left; font-weight: 500; color: var(--color-text-primary); }
.td-val { font-family: var(--font-mono); color: var(--color-text-primary); position: relative; }
.td-ganador { background: var(--color-success-light); font-weight: 700; color: var(--color-success); }
.negativo { color: var(--color-danger); }
.td-estrella { margin-left: 4px; font-size: 10px; }
</style>
