<script setup lang="ts">
defineProps<{
  filas: number
  columnas: number
}>()

const emit = defineEmits<{
  agregarFila: []
  eliminarFila: []
  agregarColumna: []
  eliminarColumna: []
}>()
</script>

<template>
  <div class="controles">
    <div class="controles__grupo">
      <span class="controles__label">Filas (alternativas)</span>
      <div class="controles__botones">
        <button class="ctrl-btn ctrl-btn--danger" :disabled="filas <= 2" @click="emit('eliminarFila')" title="Quitar fila">−</button>
        <span class="controles__valor">{{ filas }}</span>
        <button class="ctrl-btn ctrl-btn--success" @click="emit('agregarFila')" title="Agregar fila">+</button>
      </div>
    </div>
    <div class="controles__grupo">
      <span class="controles__label">Columnas (estados)</span>
      <div class="controles__botones">
        <button class="ctrl-btn ctrl-btn--danger" :disabled="columnas <= 2" @click="emit('eliminarColumna')" title="Quitar columna">−</button>
        <span class="controles__valor">{{ columnas }}</span>
        <button class="ctrl-btn ctrl-btn--success" @click="emit('agregarColumna')" title="Agregar columna">+</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controles {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
.controles__grupo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.controles__label {
  font-size: 12px;
  color: var(--color-text-secondary);
}
.controles__botones {
  display: flex;
  align-items: center;
  gap: 4px;
}
.controles__valor {
  min-width: 24px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text-primary);
}
.ctrl-btn {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.ctrl-btn:hover:not(:disabled) { background: var(--color-primary-light); border-color: var(--color-primary); }
.ctrl-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.ctrl-btn--success:hover:not(:disabled) { background: var(--color-success-light); border-color: var(--color-success); }
.ctrl-btn--danger:hover:not(:disabled) { background: var(--color-danger-light); border-color: var(--color-danger); }
</style>
