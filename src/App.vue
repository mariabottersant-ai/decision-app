<script setup lang="ts">
// ─────────────────────────────────────────────────────────────
//  App.vue — Componente raíz
//  Solo aplica el layout principal y el tema.
//  Toda la lógica de navegación vive en el router.
// ─────────────────────────────────────────────────────────────
import { onMounted } from 'vue'
import { useHistorialStore } from './stores/historial'

const historialStore = useHistorialStore()

onMounted(async () => {
  // Carga el historial al arrancar la app
  await historialStore.cargarHistorial()
})
</script>

<template>
  <RouterView />
</template>
