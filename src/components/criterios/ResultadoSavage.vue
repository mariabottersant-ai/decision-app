<script setup lang="ts">
import { computed } from 'vue'
import { useCriterios } from '../../composables/useCriterios'
import { formatearNumero } from '../../utils/formateo'
import { useMatrizStore } from '../../stores/matriz'

const { resumen } = useCriterios()
const matrizStore = useMatrizStore()
const resultado = computed(() => resumen.value?.savage)
const estados = computed(() => matrizStore.editor.nombresEstados)
</script>

<template>
  <div v-if="resultado" class="resultado">
    <div class="resultado__header">
      <div>
        <h3 class="resultado__titulo">Savage</h3>
        <p class="resultado__subtitulo">Modelo del Arrepentimiento — MiniMax de pérdidas</p>
      </div>
      <span class="resultado__ganador-badge">★ {{ resultado.ganador.nombreAlternativa }}</span>
    </div>

    <!-- Matriz de arrepentimiento -->
    <div v-if="resultado.matrizArrepentimiento">
      <p class="resultado__seccion-label">Matriz de arrepentimiento:</p>
      <table class="resultado__tabla">
        <thead>
          <tr>
            <th>Alternativa</th>
            <th v-for="(e, j) in estados" :key="j">{{ e }}</th>
            <th>MiniMax</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(v, i) in resultado.valores"
            :key="i"
            :class="{ 'fila-ganador': v.esGanador }"
          >
            <td class="td-nombre">{{ v.nombreAlternativa }}</td>
            <td
              v-for="(arr, j) in resultado.matrizArrepentimiento[i]"
              :key="j"
              class="td-arr"
            >
              {{ formatearNumero(arr) }}
            </td>
            <td class="td-valor">{{ formatearNumero(v.valor) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="resultado__conclusion">
      Con Savage, la alternativa con menor arrepentimiento máximo es
      <strong>{{ resultado.ganador.nombreAlternativa }}</strong>
      (MiniMax = {{ formatearNumero(resultado.ganador.valor) }}).
    </p>
  </div>
</template>

<style scoped>
.resultado { display: flex; flex-direction: column; gap: 12px; }
.resultado__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.resultado__titulo { font-size: 15px; font-weight: 600; color: var(--color-text-primary); }
.resultado__subtitulo { font-size: 11px; color: var(--color-text-muted); margin-top: 2px; }
.resultado__ganador-badge {
  background: var(--color-success-light); color: var(--color-success);
  font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; white-space: nowrap;
}
.resultado__seccion-label { font-size: 11px; color: var(--color-text-secondary); font-weight: 500; }
.resultado__tabla { width: 100%; border-collapse: collapse; font-size: 12px; }
.resultado__tabla th {
  padding: 5px 8px; background: var(--color-primary-light);
  color: var(--color-text-secondary); font-weight: 500;
  border: 1px solid var(--color-border); text-align: center;
}
.resultado__tabla td { padding: 5px 8px; border: 1px solid var(--color-border); text-align: center; }
.td-arr { font-family: var(--font-mono); color: var(--color-text-secondary); }
.td-valor { font-weight: 700; font-family: var(--font-mono); color: var(--color-text-primary); }
.td-nombre { font-weight: 500; text-align: left; color: var(--color-text-primary); }
.fila-ganador td { background: var(--color-success-light); }
.resultado__conclusion {
  font-size: 12px; color: var(--color-text-secondary); padding: 8px 12px;
  background: var(--color-primary-light); border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-primary);
}
</style>
