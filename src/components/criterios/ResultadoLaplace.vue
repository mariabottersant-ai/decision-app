<script setup lang="ts">
import { computed } from 'vue'
import { useCriterios } from '../../composables/useCriterios'
import { formatearNumero } from '../../utils/formateo'

const { resumen } = useCriterios()
const resultado = computed(() => resumen.value?.laplace)
</script>

<template>
  <div v-if="resultado" class="resultado">
    <div class="resultado__header">
      <div>
        <h3 class="resultado__titulo">Laplace</h3>
        <p class="resultado__subtitulo">Modelo del Equilibrio — promedio de cada fila</p>
      </div>
      <span class="resultado__ganador-badge">
        ★ {{ resultado.ganador.nombreAlternativa }}
      </span>
    </div>

    <table class="resultado__tabla">
      <thead>
        <tr>
          <th>Alternativa</th>
          <th>Cálculo</th>
          <th>Laplace</th>
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
      Con el criterio de Laplace la mejor alternativa es
      <strong>{{ resultado.ganador.nombreAlternativa }}</strong>
      con un promedio de <strong>{{ formatearNumero(resultado.ganador.valor) }}</strong>.
    </p>
  </div>
</template>

<style scoped>
.resultado { display: flex; flex-direction: column; gap: 12px; }
.resultado__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.resultado__titulo { font-size: 15px; font-weight: 600; color: var(--color-text-primary); }
.resultado__subtitulo { font-size: 11px; color: var(--color-text-muted); margin-top: 2px; }
.resultado__ganador-badge {
  background: var(--color-success-light);
  color: var(--color-success);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.resultado__tabla { width: 100%; border-collapse: collapse; font-size: 13px; }
.resultado__tabla th {
  padding: 6px 10px;
  background: var(--color-primary-light);
  color: var(--color-text-secondary);
  font-weight: 500;
  border: 1px solid var(--color-border);
  text-align: left;
}
.resultado__tabla td {
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}
.td-calculo { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-secondary); }
.td-valor { text-align: right; font-weight: 600; font-family: var(--font-mono); }
.td-nombre { font-weight: 500; }
.fila-ganador td { background: var(--color-success-light); }
.positivo { color: var(--color-success); }
.negativo { color: var(--color-danger); }
.resultado__conclusion {
  font-size: 12px;
  color: var(--color-text-secondary);
  padding: 8px 12px;
  background: var(--color-primary-light);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-primary);
}
</style>
