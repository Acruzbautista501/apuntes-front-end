# Módulo 13: Consumo de APIs con Composables

Casi toda aplicación real necesita pedir datos a un servidor. Repetir manualmente `ref` de carga, error y datos en cada componente que hace una petición es tedioso y propenso a inconsistencias — este módulo construye un composable de *fetching* reutilizable y tipado.

## 13.1 El Patrón Manual (Sin Composable)

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Producto { id: number; nombre: string; precio: number }

const productos = ref<Producto[]>([])
const cargando = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const respuesta = await fetch('/api/productos')
    if (!respuesta.ok) throw new Error('Error al cargar productos')
    productos.value = await respuesta.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    cargando.value = false
  }
})
</script>

<template>
  <p v-if="cargando">Cargando...</p>
  <p v-else-if="error">{{ error }}</p>
  <ul v-else>
    <li v-for="p in productos" :key="p.id">{{ p.nombre }} — {{ p.precio }}</li>
  </ul>
</template>
```

Este patrón (`cargando`, `error`, `datos`) se repite en **todo** componente que consume datos — es la razón de ser de un composable dedicado.

## 13.2 Composable `useFetch` Genérico y Tipado

```typescript
// composables/useFetch.ts
import { ref, Ref } from 'vue'

interface EstadoFetch<T> {
  datos: Ref<T | null>
  cargando: Ref<boolean>
  error: Ref<string | null>
  ejecutar: () => Promise<void>
}

export function useFetch<T>(url: string): EstadoFetch<T> {
  const datos = ref<T | null>(null) as Ref<T | null>
  const cargando = ref(false)
  const error = ref<string | null>(null)

  async function ejecutar() {
    cargando.value = true
    error.value = null

    try {
      const respuesta = await fetch(url)
      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`)
      datos.value = await respuesta.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
    } finally {
      cargando.value = false
    }
  }

  return { datos, cargando, error, ejecutar }
}
```

**Uso — mismo resultado, mucho menos código repetido:**

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'

interface Producto { id: number; nombre: string; precio: number }

const { datos: productos, cargando, error, ejecutar } = useFetch<Producto[]>('/api/productos')

onMounted(ejecutar)
</script>

<template>
  <p v-if="cargando">Cargando...</p>
  <p v-else-if="error">{{ error }}</p>
  <ul v-else-if="productos">
    <li v-for="p in productos" :key="p.id">{{ p.nombre }} — {{ p.precio }}</li>
  </ul>
</template>
```

## 13.3 Cancelar Peticiones con `AbortController`

Si el componente se desmonta (o el usuario navega) antes de que la petición termine, conviene cancelarla explícitamente para evitar actualizar un estado que ya nadie usará.

```typescript
import { ref, onUnmounted } from 'vue'

export function useFetch<T>(url: string) {
  const datos = ref<T | null>(null) as Ref<T | null>
  const cargando = ref(false)
  const error = ref<string | null>(null)
  const controlador = new AbortController()

  async function ejecutar() {
    cargando.value = true
    try {
      const respuesta = await fetch(url, { signal: controlador.signal })
      datos.value = await respuesta.json()
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return // Cancelación intencional, no es un error real
      error.value = err instanceof Error ? err.message : 'Error desconocido'
    } finally {
      cargando.value = false
    }
  }

  onUnmounted(() => controlador.abort())

  return { datos, cargando, error, ejecutar }
}
```

## 13.4 Reaccionar a Parámetros que Cambian: `watch` + Fetch

Un caso muy común: la URL de la petición depende de un valor reactivo (un ID de ruta, un texto de búsqueda) que cambia con el tiempo.

```typescript
// composables/useProducto.ts
import { ref, watch, Ref } from 'vue'

export function useProducto(id: Ref<number>) {
  const producto = ref<{ nombre: string } | null>(null)
  const cargando = ref(false)

  watch(id, async (nuevoId) => {
    cargando.value = true
    const respuesta = await fetch(`/api/productos/${nuevoId}`)
    producto.value = await respuesta.json()
    cargando.value = false
  }, { immediate: true }) // immediate: true ejecuta la petición también en el primer render

  return { producto, cargando }
}
```

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useProducto } from '@/composables/useProducto'

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { producto, cargando } = useProducto(id)
</script>
```

Cuando `route.params.id` cambia (el usuario navega a otro producto sin recargar la página), `useProducto` vuelve a pedir los datos automáticamente.

## 13.5 Tabla de Referencia Rápida

| Necesitas... | Patrón |
| :--- | :--- |
| Estado estándar de carga/error/datos | Composable `useFetch<T>` genérico |
| Evitar actualizar estado tras desmontar el componente | `AbortController` + `onUnmounted` |
| Re-consultar cuando cambia un parámetro reactivo | `watch(parametro, ..., { immediate: true })` |
| Ejecutar la petición al montar el componente | `onMounted(ejecutar)` |

## 13.6 Errores Comunes

- **No manejar el estado de error**: mostrar solo "cargando" y luego los datos, sin contemplar que `fetch` puede fallar (red caída, 404, 500).
- **Olvidar `immediate: true` en un `watch` que depende de datos que ya existen al montar**: sin él, la primera carga nunca se dispara — el watcher solo reacciona a cambios *posteriores*.
- **No tipar la respuesta de la API**: `datos.value = await respuesta.json()` sin un genérico (`useFetch<Producto[]>`) deja `datos` como `any`, perdiendo todo el autocompletado y la seguridad de tipos en el template.
