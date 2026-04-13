// ─────────────────────────────────────────────────────────────
//  router/index.ts
//  Definición de rutas de la aplicación
// ─────────────────────────────────────────────────────────────

import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // Hash history es la opción correcta para apps Tauri
  // (no hay servidor que maneje rutas como /historial)
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      redirect: '/calculadora',
    },
    {
      path: '/inicio',
      name: 'inicio',
      component: () => import('../views/InicioView.vue'),
      meta: { titulo: 'Inicio' },
    },
    {
      path: '/calculadora',
      name: 'calculadora',
      component: () => import('../views/CalculadoraView.vue'),
      meta: { titulo: 'Calculadora' },
    },
    {
      path: '/historial',
      name: 'historial',
      component: () => import('../views/HistorialView.vue'),
      meta: { titulo: 'Historial' },
    },
    {
      path: '/ayuda',
      name: 'ayuda',
      component: () => import('../views/AyudaView.vue'),
      meta: { titulo: 'Ayuda' },
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: () => import('../views/ConfiguracionView.vue'),
      meta: { titulo: 'Configuración' },
    },
    // Ruta catch-all: redirige cualquier ruta desconocida a la calculadora
    {
      path: '/:pathMatch(.*)*',
      redirect: '/calculadora',
    },
  ],
})

export default router
