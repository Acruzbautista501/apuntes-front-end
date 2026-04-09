# Módulo 2: Fundamentos del Composition API

En este módulo veremos con detalle cómo manejar el **estado reactivo** en Vue 3 usando `ref` y `reactive`, cómo derivar valores con `computed`, cómo reaccionar a cambios con `watch`/`watchEffect`, el ciclo de vida básico de un componente y patrones/prácticas que te ayudarán a escribir componentes robustos y legibles. Cada sección tiene ejemplos concretos (con `<script setup lang="ts">`) y al final hay un ejercicio guiado completo y varios ejercicios para practicar.

## 2.1 ¿Qué es el *state* en Vue.js?

El *state* (estado) es la fuente de verdad de los datos de tu componente o aplicación: variables que pueden cambiar y que al cambiar, actualizan la interfaz automáticamente.

En Vue 3 el *state* puede ser:

- Local (propios del componente).
- Global (Pinia / stores).
- Persistente (localStorage, backend, etc.).
    
    Vue proporciona utilidades reactivas para crear ese estado (`ref`, `reactive`) y mantener la UI sincronizada con esos datos.
    

## 2.2 `ref()` vs `reactive()` — diferencias y cuándo usar cada uno

**`ref()`**

- Diseñado para valores primitivos (números, strings, boolean) pero también funciona con objetos.
- Devuelve un objeto con la propiedad `.value`.
- En templates Vue unwrapea `.value` automáticamente.

```tsx
import { ref } from 'vue'
const count = ref(0)
count.value++            // en script
// en template: {{ count }}  <-- Vue lo muestra sin `.value`

```

**`reactive()`**

- Crea un objeto reactivo (ideal para objetos/arrays).
- No usa `.value`; accedes/modificas propiedades directamente.
- Es una *proxy* que envuelve el objeto original.

```tsx
import { reactive } from 'vue'
const state = reactive({ todos: [] as string[] })
state.todos.push('Aprender Vue')

```

**Regla práctica**

- `ref` para valores primitivos o cuando quieres una referencia mutable única.
- `reactive` para estructuras con varias propiedades (objeto con muchas keys o arrays).

## 2.3 Añadiendo datos al state con `reactive()`

```vue
<script setup lang="ts">
	import { reactive } from 'vue'

	type Task = { id: number; text: string; done: boolean }

	const state = reactive({
		tasks: [] as Task[],
		filter: 'all' as 'all' | 'done' | 'active'
	})

	function addTask(text: string) {
		state.tasks.push({ id: Date.now(), text, done: false })
	}

	function toggleTask(id: number) {
		const t = state.tasks.find(x => x.id === id)
		if (t) t.done = !t.done
	}
</script>

```

**Notas**

- `reactive` funciona muy bien con arrays (`push`, `splice`) y objetos.
- Si reasignas la propiedad (`state.tasks = [...]`) sigue siendo reactivo.


## 2.4 Añadiendo datos al state con `ref()`

```vue
<script setup lang="ts">
	import { ref } from 'vue'

	const name = ref('')      // ideal para input v-model
	function updateName(n: string) { name.value = n }
</script>

<template>
  <input v-model="name" placeholder="Tu nombre" />
  <p>Hola, {{ name }}</p>
</template>

```

**Tips**

- En el script accedes con `.value`.
- En el template Vue hace el *unwrapping* por ti: `{{ name }}`.

## 2.5 Iterando sobre el state (v-for)

```vue
<template>
  <ul>
    <li v-for="task in state.tasks" :key="task.id">
      <label>
        <input type="checkbox" v-model="task.done" />
        <span :class="{ done: task.done }">{{ task.text }}</span>
      </label>
    </li>
  </ul>
</template>

```

- Usa `:key` con un identificador único (id) para un rendimiento correcto.
- `v-model` en un checkbox sobre `task.done` actualiza el objeto reactivo automáticamente.

## 2.6 ¿Qué son las *directivas* en Vue.js? (recordatorio práctico)

Las directivas son atributos especiales en el template que le dicen a Vue cómo comportarse:

- `v-for` → iterar listas
- `v-if` / `v-else-if` / `v-else` → render condicional
- `v-show` → mostrar/ocultar con CSS
- `v-bind:prop` o `:prop` → enlazar atributos dinámicamente
- `v-on:event` o `@event` → escuchar eventos

Las verás mucho al manipular el state.

## 2.7 `computed()` — propiedades computadas (valores derivados)

- `computed` crea un valor derivado y **cacheado**: solo se recalcula si sus dependencias cambian.
- Útil para contar, filtrar, formatear datos.

```tsx
import { computed } from 'vue'

const remaining = computed(() => state.tasks.filter(t => !t.done).length)
const doneTasks = computed(() => state.tasks.filter(t => t.done))

```

En template:

```
<p>Tareas pendientes: {{ remaining }}</p>

```

`remaining` no recalcula en cada render; solo cuando `state.tasks` cambia.


## 2.8 `watch()` y `watchEffect()` — watchers en Vue.js

### `watch(source, callback, options?)`

- Observa una fuente específica y ejecuta una función cuando cambia.
- `source` puede ser un `ref`, una función getter, o un `reactive` (usualmente como getter).
- Opciones útiles: `{ deep: true }`, `{ immediate: true }`.

Ejemplo — guardar `tasks` en localStorage:

```tsx
import { watch } from 'vue'

watch(
  () => state.tasks,
  (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  },
  { deep: true } // importante para detectar cambios dentro de cada tarea (p. ej. task.done)
)

```

`immediate: true` ejecuta el callback inmediatamente con el valor actual.


### `watchEffect(effectFn)`

- Ejecuta `effectFn` inmediatamente y vuelve a ejecutarlo cuando las dependencias reactivas **usadas dentro** de `effectFn` cambian.
- No necesitas declarar la fuente; Vue la detecta automáticamente.
- Permite un `onInvalidate` para limpiar efectos (útil con timers o peticiones).

Ejemplo:

```tsx
import { watchEffect } from 'vue'

watchEffect((onInvalidate) => {
  console.log('Tareas actuales:', state.tasks.length)

  const id = setInterval(() => {
    console.log('tick', state.tasks.length)
  }, 2000)

  onInvalidate(() => clearInterval(id))
})

```

**Diferencia clave**

- `watch`: explícito, ideal para operaciones costosas o side-effects controlados (guardar, peticiones).
- `watchEffect`: automático, sencillo para efectos reactivos rápidos.

## 2.9 Ciclo de vida de los componentes (hooks principales)

Los hooks del ciclo de vida se usan para ejecutar código en puntos concretos:

- `onBeforeMount()` — justo antes de montar el template.
- `onMounted()` — cuando el componente ya está montado (DOM disponible).
- `onBeforeUpdate()` — justo antes de actualizar (re-render).
- `onUpdated()` — después de que el DOM se haya actualizado.
- `onBeforeUnmount()` — antes de desmontar el componente.
- `onUnmounted()` — después de desmontarlo (liberar timers, listeners).

Ejemplo: cargar datos al montar y limpiar al desmontar.

```tsx
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  fetchData()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

```

## 2.10 Buenas prácticas y *pitfalls* (errores comunes)

- **Desestructurar `reactive` puede romper la reactividad**:
    
    ```tsx
    const user = reactive({ name: 'Aldair', age: 30 })
    const { name } = user             // ❌ `name` ya NO es reactivo
    // usa: const { name } = toRefs(user)  // ✅ mantiene reactividad
    
    ```
    
- Para observar cambios profundos en arrays/objetos usa `{ deep: true }`.
- Evita manipular directamente el DOM; usa refs de Vue si debes acceder a elementos.
- Prefiere `computed` para computaciones derivadas (no `watch` para obtener valores derivados).
- Usa `onUnmounted` para limpiar timers, listeners o cancelar fetches.
