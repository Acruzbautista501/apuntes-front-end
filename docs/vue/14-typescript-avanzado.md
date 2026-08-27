# Módulo 14: TypeScript Avanzado en Vue

Los módulos anteriores usaron TypeScript de forma directa: interfaces simples en `defineProps`, tipos primitivos en `ref`. Este módulo cubre patrones de tipado más exigentes, necesarios en librerías de componentes y aplicaciones grandes.

## 14.1 Tipar `ref` con Uniones y Null

Cuando un valor puede no existir todavía (datos que llegan de una API, un elemento del DOM antes de montar), TypeScript necesita esa información explícita — de lo contrario asume el tipo del valor inicial únicamente.

```typescript
const usuario = ref<Usuario | null>(null)

// Vue infiere ref<number> automáticamente, sin anotación:
const contador = ref(0)

// Pero un array vacío necesita anotación explícita, si no TypeScript infiere never[]:
const tareas = ref<Tarea[]>([])
```

## 14.2 `PropType` — Tipar Props con la Sintaxis de Opciones

En proyectos que aún usan Options API (o mezclan ambos estilos), `defineProps<Interfaz>()` no está disponible en `<script>` normal — se usa `PropType` para anotar props con tipos complejos.

```typescript
import { defineComponent, PropType } from 'vue'

interface Usuario { id: number; nombre: string }

export default defineComponent({
  props: {
    usuario: {
      type: Object as PropType<Usuario>,
      required: true
    },
    estado: {
      type: String as PropType<'activo' | 'inactivo' | 'pendiente'>,
      default: 'pendiente'
    }
  }
})
```

> Con `<script setup lang="ts">`, `defineProps<Interfaz>()` (Módulo 3) es preferible y no necesita `PropType` — pero reconocer este patrón es necesario para leer código de proyectos más antiguos o en Options API.

## 14.3 Componentes Genéricos con `<script setup generic="T">`

Desde Vue 3.3, un componente puede declarar su propio parámetro de tipo genérico — esencial para componentes reutilizables como listas o selects que deben adaptarse al tipo de dato que reciben.

```vue
<!-- SelectorGenerico.vue -->
<script setup lang="ts" generic="T">
defineProps<{
  opciones: T[]
  etiqueta: (item: T) => string
  modelValue: T | null
}>()

defineEmits<{
  'update:modelValue': [valor: T]
}>()
</script>

<template>
  <select @change="$emit('update:modelValue', opciones[($event.target as HTMLSelectElement).selectedIndex])">
    <option v-for="opcion in opciones" :key="etiqueta(opcion)">
      {{ etiqueta(opcion) }}
    </option>
  </select>
</template>
```

```vue
<script setup lang="ts">
interface Producto { id: number; nombre: string }
const productos: Producto[] = [{ id: 1, nombre: 'Teclado' }, { id: 2, nombre: 'Mouse' }]
</script>

<template>
  <!-- TypeScript infiere T = Producto automáticamente a partir de "opciones" -->
  <SelectorGenerico :opciones="productos" :etiqueta="(p) => p.nombre" :model-value="null" />
</template>
```

## 14.4 Tipar Emits con Precisión

`defineEmits` acepta una sintaxis de tipo función-por-evento (vista en el Módulo 3) donde cada clave es el nombre del evento y el valor es una tupla con los tipos de sus argumentos.

```typescript
const emit = defineEmits<{
  cambio: [valor: string]
  eliminar: [id: number, confirmado: boolean]
  cerrar: [] // Evento sin argumentos
}>()
```

## 14.5 `useAttrs` Tipado

`useAttrs()` da acceso a los atributos que el padre pasó pero que **no** están declarados como props explícitas (como `class`, `id`, o atributos ARIA) — útil al construir componentes envoltorio.

```vue
<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs() // Record<string, unknown>
</script>

<template>
  <button v-bind="attrs">
    <slot></slot>
  </button>
</template>
```

```vue
<!-- El padre pasa "aria-label", que no es una prop declarada -->
<BotonPersonalizado aria-label="Cerrar ventana">×</BotonPersonalizado>
```

## 14.6 `defineOptions` — Metadatos del Componente

Con `<script setup>`, el nombre del componente se infiere automáticamente del nombre del archivo en la mayoría de configuraciones — pero `defineOptions` permite declarar explícitamente `name` (necesario para que `<KeepAlive :include>` del Módulo 9 funcione) u otras opciones que antes solo existían en Options API.

```vue
<script setup lang="ts">
defineOptions({
  name: 'TarjetaProducto',
  inheritAttrs: false
})
</script>
```

## 14.7 Tipar Composables con Sobrecarga Condicional

Un composable puede devolver tipos distintos según el argumento recibido, usando genéricos con valores por defecto.

```typescript
export function useEstadoLocal<T = string>(valorInicial: T) {
  const estado = ref(valorInicial) as Ref<T>
  return estado
}

const nombre = useEstadoLocal('Alex')       // Ref<string>, inferido automáticamente
const edad = useEstadoLocal<number>(0)      // Ref<number>, explícito
```

## 14.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un componente que se adapte al tipo de dato recibido | `<script setup lang="ts" generic="T">` |
| Props complejas en Options API | `PropType<Tipo>` |
| Atributos no declarados como props (`class`, `aria-*`) | `useAttrs()` |
| Fijar el `name` del componente para `KeepAlive` | `defineOptions({ name: '...' })` |
| Emits con argumentos tipados por evento | `defineEmits<{ evento: [tipos] }>()` |

## 14.9 Errores Comunes

- **Olvidar el atributo `generic="T"` y solo usar `T` en las props**: sin declarar el genérico en la etiqueta `<script setup>`, TypeScript no lo reconoce.
- **Usar `any` como salida rápida ante un error de tipos difícil**: casi siempre hay un tipo más preciso (`unknown` + una verificación, un genérico, una unión) — `any` desactiva por completo la verificación de TypeScript en ese punto.
- **No tipar el retorno de un composable**: sin una interfaz o tipo de retorno explícito, cambios internos en el composable pueden romper silenciosamente a quien lo consume sin que TypeScript avise.
