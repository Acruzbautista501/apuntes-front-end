# Módulo 21: Accesibilidad en Aplicaciones Vue

La reactividad de Vue facilita construir interfaces dinámicas, pero esa misma dinámica (contenido que aparece/desaparece, rutas que cambian sin recargar la página) introduce problemas de accesibilidad específicos que el HTML estático no tiene. Este módulo cubre los patrones más importantes.

## 21.1 El Problema del Foco al Navegar con Vue Router

En un sitio tradicional, cada navegación recarga la página y el foco vuelve al `<body>` — el lector de pantalla anuncia el nuevo título. En una SPA, sin ese *refresh*, el foco se queda "atascado" en el elemento que se clickeó para navegar, y el cambio de contenido pasa desapercibido para quien usa un lector de pantalla.

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const encabezadoPrincipalRef = ref<HTMLElement | null>(null)

watch(() => route.path, async () => {
  await nextTick()
  encabezadoPrincipalRef.value?.focus()
})
</script>

<template>
  <main>
    <h1 ref="encabezadoPrincipalRef" tabindex="-1">{{ tituloDeLaVistaActual }}</h1>
    <RouterView />
  </main>
</template>
```

`tabindex="-1"` hace el elemento enfocable programáticamente (con `.focus()`) sin agregarlo al orden de tabulación normal del teclado.

## 21.2 Anunciar Cambios Dinámicos con `aria-live`

Cuando contenido aparece dinámicamente (una notificación, un mensaje de error, resultados de búsqueda) sin que el usuario haya movido el foco explícitamente, un lector de pantalla no lo detecta a menos que la región esté marcada como "en vivo".

```vue
<script setup lang="ts">
import { ref } from 'vue'

const mensajeEstado = ref('')

async function guardar() {
  mensajeEstado.value = 'Guardando...'
  await guardarDatos()
  mensajeEstado.value = 'Cambios guardados correctamente'
}
</script>

<template>
  <button @click="guardar">Guardar</button>
  <p aria-live="polite" class="visualmente-oculto">{{ mensajeEstado }}</p>
</template>
```

`aria-live="polite"` hace que el lector de pantalla anuncie el nuevo contenido cuando haya una pausa natural, sin interrumpir lo que esté leyendo; `"assertive"` interrumpe inmediatamente — resérvalo para errores críticos.

## 21.3 Atrapar el Foco en un Modal (*Focus Trap*)

Un modal accesible debe impedir que `Tab` mueva el foco hacia elementos detrás de él, y devolver el foco al elemento que lo abrió al cerrarse.

```vue
<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

const props = defineProps<{ abierto: boolean }>()
const modalRef = ref<HTMLElement | null>(null)
let elementoQueTeniaElFoco: HTMLElement | null = null

watch(() => props.abierto, async (abierto) => {
  if (abierto) {
    elementoQueTeniaElFoco = document.activeElement as HTMLElement
    await nextTick()
    modalRef.value?.querySelector<HTMLElement>('button, input, a')?.focus()
  } else {
    elementoQueTeniaElFoco?.focus() // Devuelve el foco a donde estaba antes de abrir el modal
  }
})

function manejarTab(evento: KeyboardEvent) {
  if (evento.key !== 'Tab' || !modalRef.value) return

  const elementosEnfocables = modalRef.value.querySelectorAll<HTMLElement>('button, input, a, [tabindex]')
  const primero = elementosEnfocables[0]
  const ultimo = elementosEnfocables[elementosEnfocables.length - 1]

  if (evento.shiftKey && document.activeElement === primero) {
    evento.preventDefault()
    ultimo.focus()
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault()
    primero.focus()
  }
}
</script>

<template>
  <div v-if="abierto" ref="modalRef" role="dialog" aria-modal="true" @keydown="manejarTab">
    <slot></slot>
  </div>
</template>
```

> En proyectos reales, una librería probada como `focus-trap` suele ser preferible a reimplementar esta lógica — pero entender el mecanismo ayuda a diagnosticar bugs de accesibilidad en cualquier librería que se use.

## 21.4 Formularios Accesibles con `v-model`

Los patrones de `v-model` del Módulo 8 deben ir siempre acompañados de asociaciones explícitas entre etiqueta y campo.

```vue
<template>
  <label for="campo-correo">Correo electrónico</label>
  <input id="campo-correo" v-model="correo" type="email" :aria-invalid="!correoValido" aria-describedby="error-correo" />
  <p id="error-correo" v-if="!correoValido" role="alert">Ingresa un correo válido</p>
</template>
```

`aria-invalid` y `aria-describedby` conectan el campo con su mensaje de error para que un lector de pantalla lo anuncie al enfocar el campo, no solo visualmente con una clase CSS roja.

## 21.5 Transiciones y `prefers-reduced-motion`

Las transiciones del Módulo 11 deben respetar la preferencia del sistema operativo de reducir el movimiento, relevante para usuarios con trastornos vestibulares.

```vue
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
```

## 21.6 Tabla de Referencia Rápida

| Problema de accesibilidad | Solución en Vue |
| :--- | :--- |
| El foco no se mueve al navegar entre vistas | `watch(route.path)` + `.focus()` en el encabezado principal |
| Contenido dinámico no anunciado por lectores de pantalla | `aria-live="polite"` (o `"assertive"` para errores críticos) |
| El foco escapa de un modal abierto | *Focus trap* manual o librería dedicada |
| Errores de validación solo visibles por color | `aria-invalid` + `aria-describedby` apuntando al mensaje |
| Animaciones que afectan a usuarios sensibles al movimiento | `@media (prefers-reduced-motion: reduce)` |

## 21.7 Errores Comunes

- **Asumir que una SPA es accesible solo porque el HTML final es semánticamente correcto**: la navegación dinámica y el contenido asíncrono necesitan manejo explícito de foco y anuncios, que el HTML estático no requiere.
- **Usar `aria-live="assertive"` para todo**: interrumpe agresivamente al usuario; resérvalo para errores que de verdad requieren atención inmediata.
- **Olvidar devolver el foco al cerrar un modal**: el usuario que navegaba con teclado pierde su posición en la página y debe re-orientarse desde el principio.
