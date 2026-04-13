<script setup lang="ts">
withDefaults(defineProps<{
  variante?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}>(), {
  variante: 'neutral'
})
</script>

<template>
  <span :class="['badge', `badge--${variante}`]">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  line-height: 1.2;
}

.badge--success {
  background-color: var(--color-success-light);
  color: var(--color-success);
}
.badge--warning {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
}
.badge--danger {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}
.badge--info {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}
.badge--neutral {
  background-color: var(--color-bg);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}
</style>
