<script setup lang="ts">
import { computed } from 'vue'
import { useCriterios } from '../../composables/useCriterios'
import { formatearNumero } from '../../utils/formateo'
import { useMatrizStore } from '../../stores/matriz'

const { resumen } = useCriterios()
const matrizStore = useMatrizStore()
const resultado = computed(() => resumen.value?.maximin)
const esUtilidades = computed(() => matrizStore.editor.tipoValores === 'utilidades')
</script>

<template>
  <div v-if="resultado" class="resultado">
    <div class="resultado__header">
      <div>
        <h3 class="resultado__titulo">{{ esUtilidades ? 'MaxiMin' : 'MiniMax' }}</h3>
        <p class="resultado__subtitulo">Criterio pesimista — {{ esUtilidades ? 'máximo de los mínimos' : 'mínimo de los máximos' }}</p>
      </div>
      <span class="resultado__ganador-badge">★ {{ resultado.ganador.nombreAlternativa }}</span>
    </div>

    <table class="resultado__tabla">
      <thead>
        <tr>
          <th>Alternativa</th>
          <th>Peor caso</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(v, i) in resultado.valores"
          :key="i"
          :class="{ 'fila-ganador': v.esGanador }"
        >
          <td class="td-nombre">{{ v.nombreAlternativa }}</td>
          <td class="td-valor" :class="v.valor < 0 ? 'negativo' : 'positivo'">
            {{ formatearNumero(v.valor) }}
          </td>
        </tr>
      </tbody>
    </table>

    <p class="resultado__conclusion">
      Con el criterio pesimista, la alternativa más segura es
      <strong>{{ resultado.ganador.nombreAlternativa }}</strong>
      (peor caso: {{ formatearNumero(resultado.ganador.valor) }}).
    </p>
  </div>
</template>

<style scoped>
.resultado { display: flex; flex-direction: column; gap: 12px; }
.resultado__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.resultado__titulo { font-size: 15px; font-weight: 600; color: var(--color-text-primary); }
.resultado__subtitulo { font-size: 11px; color: var(--color-text-muted); margin-top: 2px; }
.resultado__ganador-badge {
  background: var(--color-danger-light); color: var(--color-danger);
  font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; white-space: nowrap;
}
.resultado__tabla { width: 100%; border-collapse: collapse; font-size: 13px; }
.resultado__tabla th {
  padding: 6px 10px; background: var(--color-danger-light);
  color: var(--color-text-secondary); font-weight: 500;
  border: 1px solid var(--color-border); text-align: left;
}
.resultado__tabla td { padding: 6px 10px; border: 1px solid var(--color-border); }
.td-valor { text-align: right; font-weight: 600; font-family: var(--font-mono); }
.td-nombre { font-weight: 500; color: var(--color-text-primary); }
.fila-ganador td { background: var(--color-danger-light); }
.positivo { color: var(--color-success); }
.negativo { color: var(--color-danger); }
.resultado__conclusion {
  font-size: 12px; color: var(--color-text-secondary); padding: 8px 12px;
  background: var(--color-danger-light); border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-danger);
}
</style>
