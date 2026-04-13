<script setup lang="ts">
import { inject, Ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarColapsado = inject<Ref<boolean>>('sidebarColapsado')!

function toggleSidebar() {
  sidebarColapsado.value = !sidebarColapsado.value
  localStorage.setItem('sidebar_collapsed', String(sidebarColapsado.value))
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--colapsado': sidebarColapsado }">
    <div class="sidebar-header">
      <router-link v-show="!sidebarColapsado" to="/" class="logo" title="DecisionApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logo-icon"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
        <span>DecisionApp</span>
      </router-link>
      <router-link v-show="sidebarColapsado" to="/" class="logo-mini" title="DecisionApp">
        <span style="font-weight: 800; font-size: 18px; color: var(--color-primary)">DA</span>
      </router-link>
      <button class="toggle-btn" @click="toggleSidebar" :title="sidebarColapsado ? 'Expandir' : 'Colapsar'">
        <svg v-if="sidebarColapsado" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <router-link to="/calculadora" class="nav-item" :class="{ 'is-active': route.path.startsWith('/calculadora') }" :title="sidebarColapsado ? 'Calculadora' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>
        <span v-show="!sidebarColapsado">Calculadora</span>
      </router-link>
      
      <router-link to="/historial" class="nav-item" :class="{ 'is-active': route.path.startsWith('/historial') }" :title="sidebarColapsado ? 'Historial' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        <span v-show="!sidebarColapsado">Historial</span>
      </router-link>
      
      <router-link to="/ayuda" class="nav-item" :class="{ 'is-active': route.path.startsWith('/ayuda') }" :title="sidebarColapsado ? 'Ayuda' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <span v-show="!sidebarColapsado">Ayuda</span>
      </router-link>
    </nav>
    
    <div class="sidebar-footer">
      <router-link to="/configuracion" class="nav-item" :class="{ 'is-active': route.path.startsWith('/configuracion') }" :title="sidebarColapsado ? 'Configuración' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        <span v-show="!sidebarColapsado">Configuración</span>
      </router-link>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  background-color: var(--color-sidebar-bg);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  z-index: 10;
  flex-shrink: 0;
}

.sidebar--colapsado {
  width: 64px;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
}

.sidebar--colapsado .sidebar-header {
  padding: 0;
  justify-content: center;
  flex-direction: column;
  gap: 0.25rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-sidebar-text);
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.025em;
  text-decoration: none;
}

.logo-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-sidebar-text);
  text-decoration: none;
  padding-top: 10px;
}

.logo-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.toggle-btn:hover {
  background-color: var(--color-sidebar-hover);
  color: var(--color-sidebar-text);
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid var(--color-border);
  overflow: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  color: var(--color-sidebar-text);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.sidebar--colapsado .nav-item {
  justify-content: center;
  padding: 0.75rem 0;
}

.nav-item:hover {
  background-color: var(--color-sidebar-hover);
  color: var(--color-text-inverse);
}

.nav-item.is-active {
  background-color: var(--color-sidebar-active);
  color: var(--color-text-inverse);
}
</style>
