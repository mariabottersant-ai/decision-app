<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  mensaje: string
  tipo?: 'success' | 'error' | 'info'
  visible: boolean
  duracion?: number
}>(), {
  tipo: 'info',
  duracion: 3000
})

const emit = defineEmits<{ cerrar: [] }>()

let timeoutId: number | null = null

watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      emit('cerrar')
    }, props.duracion)
  }
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" :class="['toast', `toast--${tipo}`]">
        <div class="toast-icon">
          <svg v-if="tipo === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <svg v-else-if="tipo === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <span class="toast-message">{{ mensaje }}</span>
        <button class="toast-close" @click="$emit('cerrar')" aria-label="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  z-index: 10000;
  min-width: 300px;
}

.toast--success { border-left: 4px solid var(--color-success); }
.toast--success .toast-icon { color: var(--color-success); }

.toast--error { border-left: 4px solid var(--color-danger); }
.toast--error .toast-icon { color: var(--color-danger); }

.toast--info { border-left: 4px solid var(--color-primary); }
.toast--info .toast-icon { color: var(--color-primary); }

.toast-message {
  flex: 1;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.toast-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
  padding: 0.25rem;
}
.toast-close:hover {
  color: var(--color-text-primary);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
</style>
