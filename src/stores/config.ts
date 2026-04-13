// ─────────────────────────────────────────────────────────────
//  stores/config.ts
//  Preferencias del usuario (tema, idioma, nombre)
// ─────────────────────────────────────────────────────────────

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Tema = 'claro' | 'oscuro' | 'sistema'

export interface ConfigApp {
  tema: Tema
  nombreUsuario: string
  carrera: string
  materia: string
  /** Decimales a mostrar en los resultados */
  decimales: 0 | 1 | 2 | 3 | 4
}

const CONFIG_KEY = 'decision_app_config'

function cargarConfigGuardada(): ConfigApp {
  try {
    const guardada = localStorage.getItem(CONFIG_KEY)
    if (guardada) return { ...configDefault(), ...JSON.parse(guardada) }
  } catch {}
  return configDefault()
}

function configDefault(): ConfigApp {
  return {
    tema: 'sistema',
    nombreUsuario: '',
    carrera: '',
    materia: 'Investigación de Operaciones',
    decimales: 2,
  }
}

export const useConfigStore = defineStore('config', () => {
  const config = ref<ConfigApp>(cargarConfigGuardada())

  // Persiste automáticamente cada vez que cambia
  watch(config, (nueva) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(nueva))
    aplicarTema(nueva.tema)
  }, { deep: true })

  function aplicarTema(tema: Tema) {
    const root = document.documentElement
    if (tema === 'oscuro') {
      root.setAttribute('data-tema', 'oscuro')
    } else if (tema === 'claro') {
      root.setAttribute('data-tema', 'claro')
    } else {
      // 'sistema': respeta la preferencia del OS
      const prefierOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-tema', prefierOscuro ? 'oscuro' : 'claro')
    }
  }

  function setTema(tema: Tema) {
    config.value.tema = tema
  }

  function setNombreUsuario(nombre: string) {
    config.value.nombreUsuario = nombre
  }

  function setCarrera(carrera: string) {
    config.value.carrera = carrera
  }

  function setMateria(materia: string) {
    config.value.materia = materia
  }

  function setDecimales(decimales: 0 | 1 | 2 | 3 | 4) {
    config.value.decimales = decimales
  }

  function resetear() {
    config.value = configDefault()
  }

  // Aplica el tema al arrancar
  aplicarTema(config.value.tema)

  return {
    config,
    setTema,
    setNombreUsuario,
    setCarrera,
    setMateria,
    setDecimales,
    resetear,
  }
})
