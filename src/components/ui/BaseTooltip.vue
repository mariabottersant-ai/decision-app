<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{
  texto: string
  posicion?: 'top' | 'bottom' | 'left' | 'right'
}>(), {
  posicion: 'top'
})

const isVisible = ref(false)
</script>

<template>
  <div 
    class="tooltip-wrapper"
    @mouseenter="isVisible = true"
    @mouseleave="isVisible = false"
  >
    <slot />
    <Transition name="fade">
      <div v-show="isVisible" :class="['tooltip-box', `tooltip--${posicion}`]">
        {{ texto }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  display: inline-block;
  position: relative;
}

.tooltip-box {
  position: absolute;
  background-color: var(--color-text-primary);
  color: var(--color-surface);
  line-height: 1.4;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

.tooltip--top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}
.tooltip--bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}
.tooltip--left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}
.tooltip--right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, margin 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
