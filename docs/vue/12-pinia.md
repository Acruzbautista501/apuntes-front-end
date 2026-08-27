# Módulo 12: Pinia — Gestión de Estado Global

`provide`/`inject` (Módulo 7) funciona bien para compartir estado dentro de un árbol de componentes. Pero cuando el estado debe ser accesible desde **cualquier parte** de la aplicación — el usuario autenticado, el carrito de compras, las notificaciones — la solución estándar del ecosistema Vue es **Pinia**, la librería oficial de gestión de estado (sucesora de Vuex).

## 12.1 Instalación y Configuración

```bash
npm install pinia
```

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
```

## 12.2 Tu Primer Store — Sintaxis de Composición

Pinia permite definir un *store* con la misma sintaxis que un composable (`ref`, `computed`, funciones) — es la forma recomendada porque reutiliza directamente lo que ya sabes de la Composition API.

```typescript
// stores/contador.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useContadorStore = defineStore('contador', () => {
  const cuenta = ref(0)

  const duplicado = computed(() => cuenta.value * 2)

  function incrementar() {
    cuenta.value++
  }

  return { cuenta, duplicado, incrementar }
})
```

| Parte del store | Equivalente conceptual |
| :--- | :--- |
| `ref()` | *state* (el dato) |
| `computed()` | *getters* (valores derivados) |
| `function` | *actions* (lógica que modifica el estado) |

## 12.3 Usar un Store en un Componente

```vue
<script setup lang="ts">
import { useContadorStore } from '@/stores/contador'

const contadorStore = useContadorStore()
</script>

<template>
  <p>{{ contadorStore.cuenta }} (x2 = {{ contadorStore.duplicado }})</p>
  <button @click="contadorStore.incrementar">+</button>
</template>
```

A diferencia de un composable normal, `useContadorStore()` siempre devuelve **la misma instancia compartida** entre todos los componentes que lo usen — ese es precisamente el propósito de un store global.

## 12.4 Store Realista: Autenticación

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Usuario { id: number; nombre: string; correo: string }

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const estaAutenticado = computed(() => !!token.value)

  async function iniciarSesion(correo: string, password: string) {
    const respuesta = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ correo, password })
    })
    const datos = await respuesta.json()

    usuario.value = datos.usuario
    token.value = datos.token
    localStorage.setItem('token', datos.token)
  }

  function cerrarSesion() {
    usuario.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { usuario, token, estaAutenticado, iniciarSesion, cerrarSesion }
})
```

## 12.5 Destructurar un Store sin Perder Reactividad: `storeToRefs`

Igual que con `reactive()` (visto en el Módulo 2), desestructurar directamente un store rompe la reactividad de sus propiedades de estado. Pinia da una utilidad específica para resolverlo.

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// ❌ Rompe la reactividad de "usuario" y "estaAutenticado"
// const { usuario, estaAutenticado } = authStore

// ✅ Mantiene la reactividad
const { usuario, estaAutenticado } = storeToRefs(authStore)

// Las funciones (actions) SÍ pueden desestructurarse directamente sin problema
const { cerrarSesion } = authStore
</script>
```

## 12.6 Comunicación Entre Stores

Un store puede usar otro store dentro de sus propias funciones — útil para lógica que depende de varias piezas de estado global.

```typescript
// stores/carrito.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useCarritoStore = defineStore('carrito', () => {
  const items = ref<{ id: number; cantidad: number }[]>([])

  async function confirmarCompra() {
    const authStore = useAuthStore()
    if (!authStore.estaAutenticado) {
      throw new Error('Debes iniciar sesión para completar la compra')
    }
    // lógica de compra...
  }

  return { items, confirmarCompra }
})
```

## 12.7 Pinia Persisted State — Persistencia Automática

Guardar manualmente en `localStorage` (como en 12.4) funciona, pero para proyectos con varios stores conviene un plugin dedicado.

```bash
npm install pinia-plugin-persistedstate
```

```typescript
// main.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

```typescript
// stores/auth.ts — Sintaxis de Opciones (necesaria para esta configuración)
export const useAuthStore = defineStore('auth', () => {
  // ... mismo contenido que antes
}, {
  persist: true // Guarda y restaura automáticamente todo el store en localStorage
})
```

## 12.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Definir un store | `defineStore('nombre', () => { ...; return {...} })` |
| Un valor derivado del estado global | `computed()` dentro del store |
| Modificar el estado desde un componente | Una función (*action*) exportada por el store |
| Desestructurar el estado sin romper reactividad | `storeToRefs(store)` |
| Persistir el store automáticamente | `pinia-plugin-persistedstate` |

## 12.9 Errores Comunes

- **Desestructurar el store directamente sin `storeToRefs`**: parece funcionar en el primer render, pero el valor deja de actualizarse tras el primer cambio.
- **Crear un store para estado que solo usa un componente**: si nada más lo necesita, un `ref` local o un composable (Módulo 6) es más simple y evita contaminar el estado global.
- **Llamar a `useContadorStore()` fuera de un componente o de otro store sin que Pinia esté activo (`app.use(createPinia())`)**: lanza un error porque no hay una instancia de Pinia a la que conectarse.
