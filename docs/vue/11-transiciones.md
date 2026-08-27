# Módulo 11: Transiciones y Animaciones

Vue incluye componentes *built-in* para animar la entrada, salida y reordenamiento de elementos sin escribir JavaScript de animación manual — solo definiendo clases CSS que Vue aplica automáticamente en los momentos correctos.

## 11.1 `<Transition>` — Animar un Solo Elemento

Envuelve un elemento que aparece/desaparece con `v-if` o `v-show`. Vue agrega y quita clases CSS en los momentos exactos de la animación.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <button @click="visible = !visible">Alternar</button>

  <Transition name="fade">
    <p v-if="visible">Este texto aparece y desaparece con fundido.</p>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## 11.2 Las Seis Clases de Transición

Con `name="fade"`, Vue genera automáticamente estas clases en los momentos correspondientes:

| Clase | Cuándo se aplica |
| :--- | :--- |
| `fade-enter-from` | Estado inicial, un frame antes de que el elemento entre |
| `fade-enter-active` | Durante toda la animación de entrada |
| `fade-enter-to` | Estado final de la entrada (opcional, casi siempre implícito) |
| `fade-leave-from` | Estado inicial de la salida (opcional, casi siempre implícito) |
| `fade-leave-active` | Durante toda la animación de salida |
| `fade-leave-to` | Estado final, un frame antes de que el elemento se elimine del DOM |

Solo `-active` y los estados `from`/`to` que difieren del estado natural del elemento necesitan definirse explícitamente.

## 11.3 Transición con `@keyframes`

También funciona con animaciones de `@keyframes` en lugar de `transition`.

```vue
<Transition name="rebote">
  <div v-if="visible" class="caja">¡Aparezco con rebote!</div>
</Transition>

<style scoped>
.rebote-enter-active {
  animation: rebote-in 0.4s;
}

@keyframes rebote-in {
  0% { transform: scale(0); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>
```

## 11.4 `<TransitionGroup>` — Animar Listas

`<Transition>` solo acepta un elemento hijo. Para animar la entrada, salida **y reordenamiento** de elementos en un `v-for`, se usa `<TransitionGroup>`.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tareas = ref([
  { id: 1, texto: 'Aprender Vue' },
  { id: 2, texto: 'Practicar TypeScript' }
])

function eliminar(id: number) {
  tareas.value = tareas.value.filter(t => t.id !== id)
}
</script>

<template>
  <TransitionGroup name="lista" tag="ul">
    <li v-for="tarea in tareas" :key="tarea.id">
      {{ tarea.texto }}
      <button @click="eliminar(tarea.id)">Quitar</button>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.lista-enter-active,
.lista-leave-active {
  transition: all 0.3s ease;
}

.lista-enter-from,
.lista-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.lista-leave-active {
  position: absolute; /* Permite que los elementos restantes se reacomoden con animación */
}

.lista-move {
  transition: transform 0.3s ease; /* Anima el reordenamiento de los elementos que se quedan */
}
</style>
```

A diferencia de `<Transition>`, `<TransitionGroup>` **sí** renderiza un elemento contenedor real (`tag="ul"` en este ejemplo, `<span>` por defecto) porque necesita envolver varios hijos.

## 11.5 Transición al Cambiar de Ruta

Combinando `<RouterView>` con `<Transition>`, cada cambio de vista se anima automáticamente.

```vue
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
```

`mode="out-in"` espera a que el componente saliente termine su animación antes de empezar a animar la entrada del nuevo — evita que ambos se superpongan visualmente.

## 11.6 Hooks de JavaScript para Animaciones Complejas

Cuando CSS no es suficiente (animaciones con librerías externas como GSAP, o lógica condicional), `<Transition>` expone hooks de JavaScript equivalentes a cada clase.

```vue
<Transition
  @before-enter="(el) => console.log('antes de entrar')"
  @enter="(el, hecho) => { /* animación con GSAP, llamar hecho() al terminar */ }"
  @leave="(el, hecho) => { /* animación de salida, llamar hecho() al terminar */ }"
  :css="false"
>
  <div v-if="visible">Contenido</div>
</Transition>
```

`:css="false"` le indica a Vue que no espere ninguna transición/animación CSS — la duración la controla enteramente el código JavaScript, que debe llamar a `hecho()` (el segundo argumento) cuando la animación termina.

## 11.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Animar la entrada/salida de un único elemento | `<Transition name="...">` |
| Animar una lista (entrada, salida y reordenamiento) | `<TransitionGroup name="..." tag="ul">` |
| Animar el cambio de vista en Vue Router | `<Transition mode="out-in">` alrededor de `<component :is="Component">` |
| Animar con una librería JS externa | Hooks `@enter`/`@leave` + `:css="false"` |

## 11.8 Errores Comunes

- **Olvidar `:key` en un `v-for` dentro de `<TransitionGroup>`**: sin una key estable, Vue no puede saber qué elemento entró, salió o se movió.
- **Usar `<Transition>` (singular) sobre una lista**: solo admite un hijo raíz; para listas siempre es `<TransitionGroup>`.
- **No definir `.lista-move`**: sin esa clase, los elementos que permanecen en la lista "saltan" instantáneamente a su nueva posición en lugar de deslizarse.
