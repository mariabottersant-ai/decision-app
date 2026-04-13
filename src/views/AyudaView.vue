<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'

interface CriterioData {
  id: string
  nombre: string
  uso: string
  formula: string
  ejemplo: string
}

const criterios: CriterioData[] = [
  {
    id: 'laplace',
    nombre: 'Criterio de Laplace',
    uso: 'Cuando no hay información sobre las probabilidades de los estados de la naturaleza. Asume equiprobabilidad.',
    formula: 'Para cada alternativa, el valor es el promedio de todos sus resultados posibles.',
    ejemplo: 'Si los pagos son 10 y 20, el valor de Laplace es (10 + 20) / 2 = 15.'
  },
  {
    id: 'hurwicz',
    nombre: 'Criterio de Hurwicz',
    uso: 'Permite expresar un nivel de optimismo/pesimismo del tomador de decisiones (coeficiente alfa entre 0 y 1).',
    formula: 'Valor = α * (Mejor resultado) + (1 - α) * (Peor resultado)',
    ejemplo: 'Con α = 0.6, mejor = 100, peor = 0. Valor = 0.6(100) + 0.4(0) = 60.'
  },
  {
    id: 'maximax',
    nombre: 'Criterio MaxiMax',
    uso: 'Para un decisor extremo optimista (busca el mejor resultado posible).',
    formula: 'Valor de alternativa = Máx(resultados). Elección final = Máx(Valores de las alternativas).',
    ejemplo: 'Si las alternativas tienen máximos de 50, 80 y 20, elegimos la de 80.'
  },
  {
    id: 'maximin',
    nombre: 'Criterio MaxiMin (Wald)',
    uso: 'Para un decisor pesimista o conservador (asegurar el mejor de los peores escenarios).',
    formula: 'Valor de alternativa = Mín(resultados). Elección final = Máx(Valores de las alternativas).',
    ejemplo: 'Si los mínimos son 5, 10 y -2, elegimos la alternativa de 10.'
  },
  {
    id: 'savage',
    nombre: 'Criterio de Savage (Minimax Pesar)',
    uso: 'Minimizar el arrepentimiento por no haber tomado la mejor decisión en un estado de la naturaleza dado.',
    formula: 'Primero se crea matriz de pesar (Máximo columna - Valor). Luego se elige alternativa con el Mínimo de los máximos pesares.',
    ejemplo: 'Se busca garantizar que el costo de oportunidad sea lo menor posible.'
  }
]

const abierto = ref<string | null>(null)

const toggle = (id: string) => {
  abierto.value = abierto.value === id ? null : id
}
</script>

<template>
  <MainLayout>
    <div class="ayuda-container">
      <div class="header">
        <h2>Guía de Criterios de Decisión</h2>
        <p class="text-secondary">Conoce cómo funciona cada algoritmo para tomar la mejor decisión.</p>
      </div>

      <div class="accordion">
        <div 
          v-for="c in criterios" 
          :key="c.id" 
          class="accordion-item"
          :class="{ 'is-open': abierto === c.id }"
        >
          <button class="accordion-header" @click="toggle(c.id)">
            <span class="title">{{ c.nombre }}</span>
            <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="accordion-content" v-show="abierto === c.id">
            <div class="info-block">
              <h4>Cuándo usarlo</h4>
              <p>{{ c.uso }}</p>
            </div>
            <div class="info-block">
              <h4>Fórmula</h4>
              <div class="formula-box">{{ c.formula }}</div>
            </div>
            <div class="info-block">
              <h4>Ejemplo</h4>
              <p class="text-secondary">{{ c.ejemplo }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.ayuda-container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.header h2 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
  color: var(--color-text-primary);
}

.text-secondary { color: var(--color-text-secondary); }

.accordion {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.accordion-item {
  border-bottom: 1px solid var(--color-border);
}
.accordion-item:last-child {
  border-bottom: none;
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: background-color 0.15s ease;
}

.accordion-header:hover {
  background-color: var(--color-bg);
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
}

.chevron {
  transition: transform 0.2s ease;
  color: var(--color-text-secondary);
}

.is-open .chevron {
  transform: rotate(180deg);
  color: var(--color-primary);
}

.accordion-content {
  padding: 0 1.5rem 1.5rem;
}

.info-block {
  margin-top: 1.25rem;
}

.info-block h4 {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.info-block p {
  margin: 0;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.info-block p.text-secondary {
  color: var(--color-text-secondary);
}

.formula-box {
  background-color: var(--color-bg);
  padding: 1rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  border-left: 3px solid var(--color-primary);
  color: var(--color-text-primary);
}
</style>
