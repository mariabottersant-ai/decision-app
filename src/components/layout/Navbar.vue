<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '../../stores/config'

const route = useRoute()
const configStore = useConfigStore()

const pageTitle = computed(() => route.meta?.titulo || route.name || 'DecisionApp')

const toggleTema = () => {
  const actual = configStore.config.tema
  const nuevo = actual === 'oscuro' ? 'claro' : 'oscuro'
  configStore.setTema(nuevo)
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-left">
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>
    
    <div class="navbar-right">
      <button 
        class="theme-toggle" 
        @click="toggleTema" 
        :title="configStore.config.tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      >
        <!-- Sol: mostrar si es oscuro -->
        <svg v-if="configStore.config.tema === 'oscuro'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <!-- Luna: mostrar si es claro o sistema -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </button>
      
      <div class="user-profile">
        <div class="avatar">{{ configStore.config.nombreUsuario ? configStore.config.nombreUsuario.charAt(0).toUpperCase() : 'U' }}</div>
        <span class="user-name">{{ configStore.config.nombreUsuario || 'Usuario' }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  height: 64px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 5;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  text-transform: capitalize;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.theme-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.15s ease;
}
.theme-toggle:hover {
  background-color: var(--color-bg);
  color: var(--color-primary);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}
</style>
