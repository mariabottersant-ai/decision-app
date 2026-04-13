<script setup lang="ts">
import { useExportar } from '../../composables/useExportar'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ cerrar: [], exito: [msg: string] }>()
const { exportar, exportando, error, exitoMsg } = useExportar()

async function exportarExcel() {
  const success = await exportar('excel')
  if (success && exitoMsg.value) {
    emit('exito', exitoMsg.value)
    emit('cerrar')
  }
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('cerrar')">
    <div class="modal">
      <div class="modal__header">
        <h3>Exportar resultados</h3>
        <button @click="emit('cerrar')">✕</button>
      </div>
      <div class="modal__body">
        <p class="modal__desc">
          Generá un archivo Excel con 4 hojas: matriz de pagos,
          desarrollo de cada criterio, tabla comparativa y matriz Savage.
        </p>

        <div v-if="error" class="modal__error">{{ error }}</div>

        <button
          class="modal__opcion"
          :disabled="exportando"
          @click="exportarExcel"
        >
          <span class="modal__opcion-icono">📊</span>
          <div class="modal__opcion-info">
            <span class="modal__opcion-nombre">
              {{ exportando ? 'Generando...' : 'Descargar Excel (.xlsx)' }}
            </span>
            <span class="modal__opcion-desc">
              4 hojas: Matriz · Resultados · Comparativa · Savage
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: var(--color-overlay);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.modal {
  background: var(--color-surface); border-radius: var(--radius-lg);
  padding: 24px; width: 400px; max-width: 90vw; box-shadow: var(--shadow-lg);
}
.modal__header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
}
.modal__header h3 { font-size: 15px; font-weight: 600; color: var(--color-text-primary); }
.modal__header button {
  background: none; border: none; cursor: pointer;
  color: var(--color-text-muted); font-size: 16px; padding: 2px 6px;
  border-radius: var(--radius-sm); transition: all 0.15s;
}
.modal__header button:hover { background: var(--color-danger-light); color: var(--color-danger); }
.modal__desc { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 16px; line-height: 1.6; }
.modal__error {
  padding: 8px 12px; background: var(--color-danger-light); color: var(--color-danger);
  border-radius: var(--radius-sm); font-size: 12px; margin-bottom: 12px;
  border-left: 3px solid var(--color-danger);
}
.modal__opcion {
  display: flex; align-items: center; gap: 14px; padding: 16px 18px; width: 100%;
  border: 2px solid var(--color-border); border-radius: var(--radius-md);
  background: var(--color-surface); cursor: pointer; text-align: left;
  transition: all 0.15s;
}
.modal__opcion:hover:not(:disabled) {
  border-color: var(--color-success);
  background: var(--color-success-light);
}
.modal__opcion:disabled { opacity: 0.5; cursor: not-allowed; }
.modal__opcion-icono { font-size: 32px; flex-shrink: 0; }
.modal__opcion-info { display: flex; flex-direction: column; gap: 3px; }
.modal__opcion-nombre { font-weight: 600; font-size: 14px; color: var(--color-text-primary); }
.modal__opcion-desc { font-size: 11px; color: var(--color-text-muted); }
</style>

