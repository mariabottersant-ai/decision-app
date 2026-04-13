<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: 'text' | 'number'
  error?: string
  disabled?: boolean
}>(), {
  type: 'text',
  disabled: false,
})

defineEmits<{ 'update:modelValue': [value: string | number] }>()
</script>

<template>
  <div class="input-wrapper" :class="{ 'has-error': !!error, 'is-disabled': disabled }">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="input-control"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.input-control {
  font-family: inherit;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  transition: all 0.15s ease;
  width: 100%;
  outline: none;
}
.input-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}
.input-control:disabled {
  background-color: var(--color-bg);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.has-error .input-control {
  border-color: var(--color-danger);
}
.has-error .input-control:focus {
  box-shadow: 0 0 0 2px var(--color-danger-light);
}

.input-error {
  font-size: 0.75rem;
  color: var(--color-danger);
  margin-top: 0.25rem;
}
</style>
