<script setup lang="ts">
import { provide, ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'

const sidebarColapsado = ref(localStorage.getItem('sidebar_collapsed') === 'true')
provide('sidebarColapsado', sidebarColapsado)
</script>

<template>
  <div class="main-layout" :class="{ 'layout--colapsado': sidebarColapsado }">
    <Sidebar />
    <div class="main-content">
      <Navbar />
      <main class="page-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-bg);
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}
</style>
