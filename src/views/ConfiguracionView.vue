<script setup lang="ts">
import { computed } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseSlider from '../components/ui/BaseSlider.vue'
import { useConfigStore } from '../stores/config'

const configStore = useConfigStore()

const nombre = computed({
  get: () => configStore.config.nombreUsuario,
  set: (val: string) => configStore.setNombreUsuario(val)
})

const decimales = computed({
  get: () => configStore.config.decimales,
  set: (val: number) => configStore.setDecimales(val as 0|1|2|3|4)
})


</script>

<template>
  <MainLayout>
    <div class="config-container">
      <h2 class="page-title">Configuración</h2>
      
      <div class="config-grid">
        <BaseCard titulo="Perfil de Usuario" subtitulo="Tus datos personales y académicos">
          <div class="form-group">
            <BaseInput v-model="nombre" label="Nombre completo" placeholder="Ej. Juan Pérez" />
          </div>
        </BaseCard>

        <BaseCard titulo="Ajustes de la Aplicación" subtitulo="Personaliza la apariencia y el comportamiento">
          <div class="setting-row">
            <div class="setting-info">
              <h4>Tema de la aplicación</h4>
              <p class="text-secondary text-sm">Elige la apariencia visual</p>
            </div>
            <div class="theme-selector">
              <button 
                class="theme-opt" 
                :class="{ 'theme-opt--active': configStore.config.tema === 'claro' }"
                @click="configStore.setTema('claro')"
              >
                <div class="theme-opt-icon">☀️</div>
                <span>Claro</span>
              </button>
              <button 
                class="theme-opt" 
                :class="{ 'theme-opt--active': configStore.config.tema === 'oscuro' }"
                @click="configStore.setTema('oscuro')"
              >
                <div class="theme-opt-icon">🌙</div>
                <span>Oscuro</span>
              </button>
              <button 
                class="theme-opt" 
                :class="{ 'theme-opt--active': configStore.config.tema === 'sistema' }"
                @click="configStore.setTema('sistema')"
              >
                <div class="theme-opt-icon">💻</div>
                <span>Sistema</span>
              </button>
            </div>
          </div>
          
          <hr class="divider" />
          
          <div class="setting-row block-setting">
            <div class="setting-info mb-3">
              <h4>Precisión decimal</h4>
              <p class="text-secondary text-sm">Cantidad de decimales para mostrar en resultados (0 a 4)</p>
            </div>
            <BaseSlider v-model="decimales" :min="0" :max="4" :paso="1" />
          </div>
        </BaseCard>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.config-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 2rem;
}

.config-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.block-setting {
  flex-direction: column;
  align-items: stretch;
}

.setting-info h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  color: var(--color-text-primary);
}

.text-sm {
  font-size: 0.875rem;
  margin: 0;
}

.text-secondary {
  color: var(--color-text-secondary);
}

.theme-selector {
  display: flex;
  gap: 0.5rem;
}
.theme-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.8125rem;
}
.theme-opt:hover {
  background: var(--color-bg);
}
.theme-opt--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-text-primary);
}
.theme-opt-icon { font-size: 1.25rem; }

.divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 1.5rem 0;
}

.mb-3 { margin-bottom: 1rem; }
</style>
