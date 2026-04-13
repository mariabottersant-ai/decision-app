<script setup lang="ts">
withDefaults(defineProps<{
  titulo?: string
  subtitulo?: string
  padding?: 'sm' | 'md' | 'lg'
}>(), {
  padding: 'md'
})
</script>

<template>
  <div class="card">
    <header v-if="titulo || subtitulo || $slots.header" class="card-header">
      <slot name="header">
        <div class="card-titles">
          <h3 v-if="titulo" class="card-title">{{ titulo }}</h3>
          <p v-if="subtitulo" class="card-subtitle">{{ subtitulo }}</p>
        </div>
      </slot>
    </header>
    
    <div :class="['card-body', `p-${padding}`]">
      <slot />
    </div>
    
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem 0;
}

.card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.card-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.card-body {
  flex: 1;
}
.p-sm { padding: 1rem; }
.p-md { padding: 1.5rem; }
.p-lg { padding: 2rem; }

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg);
}
</style>
