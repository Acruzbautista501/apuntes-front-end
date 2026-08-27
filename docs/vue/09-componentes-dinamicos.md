# Módulo 9: Componentes Dinámicos, `KeepAlive` y `Teleport`

Vue incluye varios elementos *built-in* especiales — no son componentes normales, son parte del compilador — para resolver problemas de renderizado que aparecen constantemente en aplicaciones reales: cambiar de componente dinámicamente, preservar su estado, o renderizarlo en un lugar distinto del DOM.

## 9.1 `<component :is>` — Renderizado Dinámico

Permite decidir en tiempo de ejecución **qué componente** renderizar, útil para pestañas, formularios multi-paso o sistemas de plugins.

```vue
<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import PestanaPerfil from './PestanaPerfil.vue'
import PestanaSeguridad from './PestanaSeguridad.vue'
import PestanaNotificaciones from './PestanaNotificaciones.vue'

const pestanas = {
  perfil: PestanaPerfil,
  seguridad: PestanaSeguridad,
  notificaciones: PestanaNotificaciones
}

const pestanaActiva = ref<keyof typeof pestanas>('perfil')
</script>

<template>
  <nav>
    <button v-for="(_, nombre) in pestanas" :key="nombre" @click="pestanaActiva = nombre">
      {{ nombre }}
    </button>
  </nav>

  <component :is="pestanas[pestanaActiva]" />
</template>
```

> Cuando el valor asignado a `:is` es un componente (no un string de elemento HTML), Vue recomienda envolverlo en `shallowRef` en lugar de `ref` — los componentes no necesitan reactividad profunda y `shallowRef` es más eficiente.

## 9.2 `<component :is>` con Elementos HTML Nativos

También funciona con nombres de etiquetas HTML como string, útil para renderizar distintos niveles de encabezado dinámicamente.

```vue
<script setup lang="ts">
defineProps<{ nivel: 1 | 2 | 3 }>()
</script>

<template>
  <component :is="`h${nivel}`"><slot></slot></component>
</template>
```

## 9.3 `<KeepAlive>` — Preservar el Estado de Componentes Inactivos

Por defecto, cuando `<component :is>` cambia de un componente a otro, Vue **destruye** el componente anterior y **crea uno nuevo** — pierde todo su estado interno (scroll, texto de un formulario a medio llenar, etc.). `<KeepAlive>` mantiene esos componentes vivos "en pausa" en memoria.

```vue
<template>
  <KeepAlive>
    <component :is="pestanas[pestanaActiva]" />
  </KeepAlive>
</template>
```

Al volver a una pestaña previamente visitada, su estado (scroll, inputs, contador interno) sigue exactamente como se dejó.

### Hooks Especiales para Componentes con `KeepAlive`

Como el componente no se desmonta realmente, `onMounted`/`onUnmounted` no se disparan al alternar — para eso existen hooks propios:

```typescript
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('El componente volvió a mostrarse')
})

onDeactivated(() => {
  console.log('El componente se ocultó, pero sigue en memoria')
})
```

### Controlar Qué se Mantiene Vivo

```vue
<KeepAlive :include="['PestanaPerfil', 'PestanaSeguridad']" :max="5">
  <component :is="pestanaActiva" />
</KeepAlive>
```

`include`/`exclude` filtran por el nombre del componente (`name` en Options API, o el nombre del archivo con `<script setup>`); `max` limita cuántas instancias se mantienen en caché antes de empezar a descartar las menos usadas recientemente.

## 9.4 `<Teleport>` — Renderizar Fuera del Árbol Actual

Elementos como modales, tooltips o notificaciones necesitan escapar visualmente del contenedor donde viven en el código (que puede tener `overflow: hidden` o un `z-index` conflictivo) y renderizarse directamente en el `<body>`. `<Teleport>` mueve el contenido a otro punto del DOM real, sin romper la lógica ni el estado del componente.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const modalAbierto = ref(false)
</script>

<template>
  <button @click="modalAbierto = true">Abrir modal</button>

  <Teleport to="body">
    <div v-if="modalAbierto" class="modal-overlay">
      <div class="modal">
        <p>Contenido del modal</p>
        <button @click="modalAbierto = false">Cerrar</button>
      </div>
    </div>
  </Teleport>
</template>
```

Aunque el `<div class="modal-overlay">` está escrito dentro de este componente, en el DOM real termina como hijo directo de `<body>` — evitando cualquier problema de apilamiento visual causado por contenedores padres.

### `to` Puede ser Cualquier Selector CSS

```vue
<Teleport to="#notificaciones-container">
  <Notificacion :mensaje="mensaje" />
</Teleport>
```

### `disabled` — Teleportar Condicionalmente

Útil para que el mismo componente se renderice "en su lugar" en escritorio, pero se teletransporte a un contenedor especial en móvil (o viceversa).

```vue
<Teleport to="body" :disabled="esEscritorio">
  <MenuMovil />
</Teleport>
```

## 9.5 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Cambiar de componente en tiempo de ejecución | `<component :is="...">` |
| Que un componente conserve su estado al ocultarse | `<KeepAlive>` alrededor del `<component :is>` |
| Reaccionar cuando un componente en caché vuelve a mostrarse | `onActivated` / `onDeactivated` |
| Renderizar un modal/tooltip fuera del contenedor actual | `<Teleport to="body">` |

## 9.6 Errores Comunes

- **Usar `ref` en lugar de `shallowRef` para guardar referencias a componentes**: no rompe nada, pero es una reactividad innecesariamente profunda sobre un objeto (el componente) que no debería mutarse.
- **Esperar que `onMounted` se dispare al reactivar un componente con `KeepAlive`**: usa `onActivated` para esa lógica.
- **Olvidar que el contenido de `<Teleport>` sigue perteneciendo lógicamente al componente padre**: los estilos con *scope* (`<style scoped>`) del componente siguen aplicando correctamente aunque el HTML termine en otro lugar del DOM.
