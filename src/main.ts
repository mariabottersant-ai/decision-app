// ─────────────────────────────────────────────────────────────
//  main.ts
//  Punto de entrada de Vue — registra plugins y monta la app
// ─────────────────────────────────────────────────────────────

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import './assets/styles/themes.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
