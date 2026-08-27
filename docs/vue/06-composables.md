# Módulo 6: Composables — Lógica Reutilizable

Un *composable* es una función que usa las utilidades reactivas de Vue (`ref`, `reactive`, `computed`, `watch`, hooks de ciclo de vida) para encapsular y reutilizar **lógica con estado** entre componentes. Es el equivalente en Vue a los *custom hooks* de React, y es la pieza central para no repetir código entre componentes.

## 6.1 La Convención `useNombre`

Por convención, un composable se nombra con el prefijo `use` y vive en una carpeta `composables/`. Es solo una función de TypeScript — nada mágico — que puede usarse dentro de cualquier `<script setup>`.

```text
src/
└── composables/
    ├── useContador.ts
    ├── useFetch.ts
    └── useLocalStorage.ts
```

## 6.2 Tu Primer Composable: `useContador`

```typescript
// composables/useContador.ts
import { ref } from 'vue'

export function useContador(valorInicial = 0) {
  const contador = ref(valorInicial)

  function incrementar() {
    contador.value++
  }

  function decrementar() {
    contador.value--
  }

  function reiniciar() {
    contador.value = valorInicial
  }

  return { contador, incrementar, decrementar, reiniciar }
}
```

**Uso en cualquier componente:**

```vue
<script setup lang="ts">
import { useContador } from '@/composables/useContador'

const { contador, incrementar, decrementar, reiniciar } = useContador(10)
</script>

<template>
  <p>{{ contador }}</p>
  <button @click="incrementar">+</button>
  <button @click="decrementar">-</button>
  <button @click="reiniciar">Reiniciar</button>
</template>
```

Cada componente que llama `useContador()` obtiene su **propia instancia independiente** del estado — no se comparte entre componentes (para eso está Pinia, visto más adelante).

## 6.3 Composable con Ciclo de Vida: `useMousePosition`

Los composables también pueden usar hooks de ciclo de vida — Vue los asocia automáticamente al componente que los invoca.

```typescript
// composables/useMousePosition.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  function actualizar(evento: MouseEvent) {
    x.value = evento.clientX
    y.value = evento.clientY
  }

  onMounted(() => window.addEventListener('mousemove', actualizar))
  onUnmounted(() => window.removeEventListener('mousemove', actualizar))

  return { x, y }
}
```

```vue
<script setup lang="ts">
import { useMousePosition } from '@/composables/useMousePosition'

const { x, y } = useMousePosition()
</script>

<template>
  <p>Posición del ratón: {{ x }}, {{ y }}</p>
</template>
```

Cada componente que use este composable registra y limpia su propio listener automáticamente — sin duplicar esa lógica manualmente en cada uno.

## 6.4 Composable con Estado Persistente: `useLocalStorage`

```typescript
// composables/useLocalStorage.ts
import { ref, watch, Ref } from 'vue'

export function useLocalStorage<T>(clave: string, valorInicial: T): Ref<T> {
  const guardado = localStorage.getItem(clave)
  const valor = ref<T>(guardado ? JSON.parse(guardado) : valorInicial) as Ref<T>

  watch(valor, (nuevoValor) => {
    localStorage.setItem(clave, JSON.stringify(nuevoValor))
  }, { deep: true })

  return valor
}
```

```typescript
const preferencias = useLocalStorage('preferencias-usuario', { tema: 'claro', idioma: 'es' })
preferencias.value.tema = 'oscuro' // Se guarda automáticamente en localStorage
```

## 6.5 Componer Composables Entre Sí

Un composable puede usar otro composable dentro — es exactamente lo que hace la palabra "composable" (componible).

```typescript
// composables/useTemaOscuro.ts
import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

export function useTemaOscuro() {
  const tema = useLocalStorage<'claro' | 'oscuro'>('tema', 'claro')

  const esOscuro = computed(() => tema.value === 'oscuro')

  function alternar() {
    tema.value = tema.value === 'claro' ? 'oscuro' : 'claro'
  }

  return { tema, esOscuro, alternar }
}
```

## 6.6 Reglas de los Composables

- **Se llaman siempre en el nivel superior de `<script setup>`** (o dentro de otro composable), nunca dentro de un `if`, un `for` o una función anidada — igual que los *hooks* de React.
- **Devuelven refs, no valores planos**, para que el componente que los consume mantenga la reactividad.
- **No dependen del contexto de un componente específico**: un buen composable no asume nombres de props o de otros refs — recibe lo que necesita como argumento.

## 6.7 Tabla de Referencia Rápida

| Patrón | Cuándo usarlo |
| :--- | :--- |
| Composable simple con `ref` + funciones | Lógica de estado reutilizable sin efectos externos (contador, formulario) |
| Composable con `onMounted`/`onUnmounted` | Lógica que engancha eventos del navegador o timers |
| Composable con `watch` hacia una API externa | Persistencia (localStorage), sincronización |
| Composable que usa otro composable | Construir lógica compleja a partir de piezas simples |

## 6.8 Errores Comunes

- **Llamar un composable condicionalmente** (`if (condicion) { useAlgo() }`): rompe el orden esperado de hooks internos de Vue.
- **Devolver un objeto plano en vez de refs**: `return { contador: contador.value }` congela el valor en el momento de la llamada — pierde toda reactividad.
- **Meter lógica de un componente específico dentro de un composable "genérico"**: si un composable solo se usa en un componente y depende de sus detalles internos, probablemente no necesitaba ser un composable.
