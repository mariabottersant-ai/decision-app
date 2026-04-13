<script setup lang="ts">
import { computed } from 'vue'
import { useCriterios } from '../../composables/useCriterios'
import { formatearNumero, etiquetaOptimismo } from '../../utils/formateo'

const { resumen, alpha, cambiarAlpha } = useCriterios()
const resultado = computed(() => resumen.value?.hurwicz)
const etiqueta = computed(() => etiquetaOptimismo(alpha.value))

function onSlider(e: Event) {
  cambiarAlpha(Number((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div v-if="resultado" class="resultado">
    <div class="resultado__header">
      <div>
        <h3 class="resultado__titulo">Hurwicz</h3>
        <p class="resultado__subtitulo">α × Máx + (1−α) × Mín</p>
      </div>
      <span class="resultado__ganador-badge">★ {{ resultado.ganador.nombreAlternativa }}</span>
    </div>

    <!-- Slider α -->
    <div class="slider-wrap">
      <div class="slider-labels">
        <span class="slider-label-left">Pesimista (0)</span>
        <span class="slider-label-center">
          α = <strong>{{ alpha.toFixed(2) }}</strong>
          — <em>{{ etiqueta }}</em>
        </span>
        <span class="slider-label-right">Optimista (1)</span>
      </div>
      <input
        class="slider"
        type="range"
        min="0" max="1" step="0.01"
        :value="alpha"
        @input="onSlider"
      />
    </div>

    <table class="resultado__tabla">
      <thead>
        <tr>
          <th>Alternativa</th>
          <th>Cálculo</th>
          <th>Hurwicz</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(paso, i) in resultado.pasos"
          :key="i"
          :class="{ 'fila-ganador': resultado.valores[i]?.esGanador }"
        >
          <td class="td-nombre">{{ resultado.valores[i]?.nombreAlternativa }}</td>
          <td class="td-calculo">{{ paso.descripcion.split(': ')[1] }}</td>
          <td class="td-valor" :class="paso.resultado < 0 ? 'negativo' : 'positivo'">
            {{ formatearNumero(paso.resultado) }}
          </td>
        </tr>
      </tbody>
    </table>

    <p class="resultado__conclusion">
      Con α = {{ alpha.toFixed(2) }} ({{ etiqueta.toLowerCase() }}), la mejor alternativa es
      <strong>{{ resultado.ganador.nombreAlternativa }}</strong>
      con H = <strong>{{ formatearNumero(resultado.ganador.valor) }}</strong>.
    </p>
  </div>
</template>

<style scoped>
.resultado { display: flex; flex-direction: column; gap: 12px; }
.resultado__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.resultado__titulo { font-size: 15px; font-weight: 600; color: var(--color-text-primary); }
.resultado__subtitulo { font-size: 11px; color: var(--color-text-muted); font-family: var(--font-mono); }
.resultado__ganador-badge {
  background: var(--color-success-light); color: var(--color-success);
  font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; white-space: nowrap;
}
.slider-wrap {
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
  padding: 10px 14px;
}
.slider-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--color-text-muted); margin-bottom: 6px; }
.slider-label-center { color: var(--color-primary); font-size: 12px; }
.slider { width: 100%; accent-color: var(--color-primary); cursor: pointer; }
.resultado__tabla { width: 100%; border-collapse: collapse; font-size: 13px; }
.resultado__tabla th {
  padding: 6px 10px; background: var(--color-primary-light);
  color: var(--color-text-secondary); font-weight: 500;
  border: 1px solid var(--color-border); text-align: left;
}
.resultado__tabla td { padding: 6px 10px; border: 1px solid var(--color-border); color: var(--color-text-primary); }
.td-calculo { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-secondary); }
.td-valor { text-align: right; font-weight: 600; font-family: var(--font-mono); }
.td-nombre { font-weight: 500; }
.fila-ganador td { background: var(--color-success-light); }
.positivo { color: var(--color-success); }
.negativo { color: var(--color-danger); }
.resultado__conclusion {
  font-size: 12px; color: var(--color-text-secondary);
  padding: 8px 12px; background: var(--color-primary-light);
  border-radius: var(--radius-sm); border-left: 3px solid var(--color-primary);
}
</style>
