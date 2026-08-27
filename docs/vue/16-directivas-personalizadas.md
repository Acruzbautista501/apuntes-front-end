# Módulo 16: Directivas Personalizadas

Las directivas nativas (`v-if`, `v-model`, `v-show`) resuelven necesidades genéricas. Cuando un proyecto necesita manipular el DOM directamente de forma repetida — enfocar un input automáticamente, detectar clics fuera de un elemento, aplicar un `tooltip` — una directiva personalizada encapsula esa lógica imperativa de forma reutilizable y declarativa.

## 16.1 Tu Primera Directiva: `v-enfocar`

Una directiva local se declara con el prefijo `v` en `<script setup>` — Vue la reconoce automáticamente en el template como `v-enfocar`.

```vue
<script setup lang="ts">
import type { Directive } from 'vue'

const vEnfocar: Directive<HTMLElement> = {
  mounted(el) {
    el.focus()
  }
}
</script>

<template>
  <input v-enfocar placeholder="Se enfoca automáticamente al montar" />
</template>
```

## 16.2 Hooks del Ciclo de Vida de una Directiva

Una directiva tiene acceso a los mismos momentos del ciclo de vida que un componente, pero a nivel del elemento del DOM al que está anclada.

| Hook | Cuándo se ejecuta |
| :--- | :--- |
| `created` | Antes de que se apliquen los atributos del elemento |
| `beforeMount` | Justo antes de insertar el elemento en el DOM |
| `mounted` | El elemento ya está insertado en el DOM real |
| `beforeUpdate` | Antes de que el componente que lo contiene se actualice |
| `updated` | Después de que el componente se actualice |
| `beforeUnmount` | Justo antes de eliminar el elemento |
| `unmounted` | Después de eliminarlo (limpieza de listeners, timers) |

## 16.3 Directiva con Argumento y Valor: `v-color`

Las directivas pueden recibir un valor dinámico (`v-color="miColor"`) y opcionalmente un argumento (`v-color:fondo`).

```typescript
import type { Directive } from 'vue'

const vColor: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const propiedad = binding.arg === 'fondo' ? 'backgroundColor' : 'color'
    el.style[propiedad] = binding.value
  },
  updated(el, binding) {
    const propiedad = binding.arg === 'fondo' ? 'backgroundColor' : 'color'
    el.style[propiedad] = binding.value
  }
}
```

```vue
<p v-color="'crimson'">Texto rojo</p>
<div v-color:fondo="'lightblue'">Fondo azul claro</div>
```

`binding.value` es el valor pasado a la directiva; `binding.arg` es lo que sigue a los dos puntos (`:fondo`).

## 16.4 Directiva Global: `v-click-fuera`

Para usar una directiva en toda la aplicación (no solo en un componente), se registra globalmente al crear la app — patrón muy común para cerrar menús o modales al hacer clic fuera de ellos.

```typescript
// directivas/clickFuera.ts
import type { Directive } from 'vue'

interface ElementoConHandler extends HTMLElement {
  _manejadorClickFuera?: (evento: MouseEvent) => void
}

export const vClickFuera: Directive<ElementoConHandler, () => void> = {
  mounted(el, binding) {
    el._manejadorClickFuera = (evento: MouseEvent) => {
      if (!el.contains(evento.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._manejadorClickFuera)
  },
  unmounted(el) {
    if (el._manejadorClickFuera) {
      document.removeEventListener('click', el._manejadorClickFuera)
    }
  }
}
```

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { vClickFuera } from './directivas/clickFuera'

const app = createApp(App)
app.directive('click-fuera', vClickFuera)
app.mount('#app')
```

```vue
<div v-click-fuera="cerrarMenu" v-if="menuAbierto" class="menu-desplegable">
  <!-- contenido del menú -->
</div>
```

## 16.5 Sintaxis Abreviada con Función

Cuando la directiva hace lo mismo en `mounted` y `updated`, puede escribirse como una sola función en lugar de un objeto con hooks separados.

```typescript
const vColor: Directive<HTMLElement, string> = (el, binding) => {
  el.style.color = binding.value
}
```

## 16.6 Cuándo una Directiva Personalizada, y Cuándo un Composable

| Situación | Mejor opción |
| :--- | :--- |
| Manipulación directa e imperativa del DOM (foco, medición, listeners nativos) | Directiva personalizada |
| Lógica de estado reactivo compartida entre componentes | Composable (Módulo 6) |
| Reaccionar a eventos del navegador sin tocar el DOM del elemento en sí | Composable con `onMounted`/`onUnmounted` |
| El mismo comportamiento se aplica a muchos elementos distintos en el template | Directiva personalizada |

## 16.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Una directiva usada solo en un componente | `const vNombre: Directive = {...}` dentro de `<script setup>` |
| Una directiva usada en toda la aplicación | `app.directive('nombre', {...})` en `main.ts` |
| Acceder al valor pasado a la directiva | `binding.value` |
| Acceder al argumento (`v-directiva:argumento`) | `binding.arg` |
| Limpiar listeners al desmontar el elemento | Hook `unmounted` |

## 16.8 Errores Comunes

- **Olvidar limpiar listeners en `unmounted`**: causa fugas de memoria acumulativas si el elemento se monta y desmonta repetidamente (por ejemplo, dentro de un `v-for` que cambia).
- **Usar una directiva personalizada para lógica que no toca el DOM directamente**: si solo necesitas estado reactivo compartido, un composable es más simple de testear y razonar.
- **Nombrar la variable local sin el prefijo `v`**: Vue solo reconoce automáticamente como directiva del template a las variables que en `<script setup>` empiezan literalmente con `v` seguido de mayúscula (`vEnfocar`, no `miDirectivaEnfocar`).
