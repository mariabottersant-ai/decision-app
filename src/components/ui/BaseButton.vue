<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit'
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading }]"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn__spinner" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-weight: 500;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  position: relative;
  outline: none;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Tamaños */
.btn--sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
.btn--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
.btn--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  border-radius: var(--radius-md);
}

/* Variantes */
.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-primary);
}
.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.btn--secondary {
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-surface);
  border-color: var(--color-text-secondary);
}

.btn--danger {
  background-color: var(--color-danger);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-danger);
}
.btn--danger:hover:not(:disabled) {
  opacity: 0.9;
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
}
.btn--ghost:hover:not(:disabled) {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}

/* Spinner animado */
.btn__spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
