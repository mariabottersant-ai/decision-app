<script setup lang="ts">
import { ref, watch } from 'vue'
import { validarCelda } from '../../utils/validaciones'

const props = defineProps<{
  fila: number
  columna: number
  valor: number | null
}>()

const emit = defineEmits<{
  actualizar: [fila: number, columna: number, valor: number | null]
}>()

const texto = ref(props.valor !== null && props.valor !== undefined ? String(props.valor) : '')
const error = ref<string | null>(null)

// Sincroniza cuando el valor cambia desde afuera (ej: cargar ejemplo)
watch(() => props.valor, (nuevo) => {
  texto.value = nuevo !== null && nuevo !== undefined ? String(nuevo) : ''
  error.value = null
})

function onInput(e: Event) {
  texto.value = (e.target as HTMLInputElement).value
  error.value = null
}

function onBlur() {
  if (texto.value.trim() === '') {
    emit('actualizar', props.fila, props.columna, null)
    return
  }
  const err = validarCelda(texto.value)
  if (err) { error.value = err; return }
  emit('actualizar', props.fila, props.columna, Number(texto.value))
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
}
</script>

<template>
  <div class="celda" :class="{ 'celda--error': error, 'celda--vacia': valor === null }">
    <input
      class="celda__input"
      type="number"
      step="any"
      :value="texto"
      :placeholder="'0'"
      @input="onInput"
      @blur="onBlur"
      @keydown="onKeydown"
    />
    <span v-if="error" class="celda__error-msg">{{ error }}</span>
  </div>
</template>

<style scoped>
.celda { position: relative; }

.celda__input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 13px;
  font-family: var(--font-mono);
  text-align: right;
  transition: border-color 0.15s;
  -moz-appearance: textfield;
}
.celda__input::-webkit-outer-spin-button,
.celda__input::-webkit-inner-spin-button { -webkit-appearance: none; }
.celda__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}
.celda--error .celda__input { border-color: var(--color-danger); }
.celda--vacia .celda__input { background-color: var(--color-danger-light); }
.celda--vacia .celda__input::placeholder { color: var(--color-danger); opacity: 0.6; }
.celda__error-msg {
  position: absolute;
  top: 100%;
  left: 0;
  font-size: 10px;
  color: var(--color-danger);
  white-space: nowrap;
  z-index: 10;
}
</style>
