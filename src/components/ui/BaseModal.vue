<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  titulo: string
  ancho?: 'sm' | 'md' | 'lg'
}>(), {
  ancho: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  cerrar: []
}>()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('cerrar')
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container" :class="`modal--${ancho}`">
          <header class="modal-header">
            <h3 class="modal-title">{{ titulo }}</h3>
            <button class="modal-close" @click="handleClose" aria-label="Cerrar modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </header>
          
          <main class="modal-body">
            <slot />
          </main>
          
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.modal-container {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  margin: 1rem;
}
.modal--sm { width: 400px; max-width: 100%; }
.modal--md { width: 600px; max-width: 100%; }
.modal--lg { width: 800px; max-width: 100%; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text-primary);
  font-weight: 600;
}

.modal-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}
.modal-close:hover {
  background-color: var(--color-bg);
  color: var(--color-danger);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  color: var(--color-text-primary);
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  background-color: var(--color-bg);
  border-bottom-left-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
}

/* Animaciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active .modal-container {
  animation: modal-pop 0.2s ease-out;
}
@keyframes modal-pop {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
