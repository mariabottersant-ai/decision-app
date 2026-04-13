<script setup lang="ts">
import { useRouter } from 'vue-router'
import MainLayout from '../components/layout/MainLayout.vue'
import BaseCard from '../components/ui/BaseCard.vue'

const router = useRouter()
</script>

<template>
  <MainLayout>
    <div class="inicio-container">
      <div class="welcome-section">
        <h2 class="welcome-title">Bienvenido a DecisionApp</h2>
        <p class="welcome-subtitle">
          Simplifica la toma de decisiones bajo incertidumbre. 
          Ingresa tu matriz de pagos y calcularemos automáticamente los criterios de Laplace, Hurwicz, MaxiMax, MaxiMin y Savage.
        </p>
      </div>

      <div class="actions-grid">
        <BaseCard class="action-card" @click="router.push('/calculadora')">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon text-primary"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>
          </div>
          <h3>Nueva calculadora</h3>
          <p>Crea una nueva matriz y analiza alternativas de decisión.</p>
        </BaseCard>

        <BaseCard class="action-card" @click="router.push('/historial')">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon text-primary"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </div>
          <h3>Ver historial</h3>
          <p>Revisa problemas de decisión guardados anteriormente.</p>
        </BaseCard>

        <BaseCard class="action-card" @click="router.push('/ayuda')">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon text-primary"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h3>Cómo usar</h3>
          <p>Aprende sobre los diferentes criterios de decisión disponibles.</p>
        </BaseCard>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.inicio-container {
  max-width: 1000px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.action-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--color-border);
  height: 100%;
}

.action-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.icon-wrapper {
  background-color: var(--color-primary-light);
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
}

.action-card:hover .icon-wrapper {
  background-color: var(--color-primary);
}

.action-card:hover .action-icon {
  color: #fff;
}

.action-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--color-text-primary);
}

.action-card p {
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}
</style>
