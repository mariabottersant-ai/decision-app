<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  paso?: number
  label?: string
}>(), {
  min: 0,
  max: 1,
  paso: 0.01
})

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const updateValue = (e: Event) => {
  emit('update:modelValue', parseFloat((e.target as HTMLInputElement).value))
}

const formattedValue = computed(() => {
  return Number(props.modelValue).toFixed(Math.max(0, -Math.floor(Math.log10(props.paso))));
});
</script>

<template>
  <div class="slider-wrapper">
    <label v-if="label" class="slider-label">
      {{ label }}
    </label>
    <div class="slider-control">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="paso"
        :value="modelValue"
        @input="updateValue"
        class="slider"
      />
      <span class="slider-value">{{ formattedValue }}</span>
    </div>
  </div>
</template>

<style scoped>
.slider-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slider-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.slider-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  transition: transform 0.1s;
}
.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider-value {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text-primary);
  min-width: 3rem;
  text-align: right;
}
</style>
