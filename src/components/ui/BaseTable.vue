<script setup lang="ts">
interface Columna {
  key: string
  label: string
  ancho?: string
  alinear?: 'left' | 'center' | 'right'
}

withDefaults(defineProps<{
  columnas: Columna[]
  filas: Record<string, any>[]
  cargando?: boolean
  vacio?: string
}>(), {
  cargando: false,
  vacio: 'No hay datos disponibles'
})
</script>

<template>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th 
            v-for="col in columnas" 
            :key="col.key"
            :style="{ width: col.ancho, textAlign: col.alinear || 'left' }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="cargando">
          <td :colspan="columnas.length" class="text-center text-muted">
            Cargando...
          </td>
        </tr>
        <tr v-else-if="filas.length === 0">
          <td :colspan="columnas.length" class="text-center text-muted p-4">
            {{ vacio }}
          </td>
        </tr>
        <tr v-else v-for="(fila, index) in filas" :key="index">
          <td 
            v-for="col in columnas" 
            :key="col.key"
            :style="{ textAlign: col.alinear || 'left' }"
          >
            <slot :name="`celda-${col.key}`" :fila="fila" :valor="fila[col.key]">
              {{ fila[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.table thead th {
  background-color: var(--color-bg);
  font-weight: 500;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.table tbody tr:hover {
  background-color: var(--color-bg);
}

.text-center { text-align: center !important; }
.p-4 { padding: 2rem !important; }
</style>
