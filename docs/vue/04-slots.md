# Módulo 4: Slots

Las props sirven para pasar **datos**. Los *slots* sirven para pasar **contenido** — HTML, componentes, texto — desde el padre hacia un "hueco" que el componente hijo define en su template. Sin slots es imposible construir un `Modal`, un `Card` o un `Layout` genuinamente reutilizable.

## 4.1 Slot por Defecto

El slot más simple: un hueco sin nombre donde el padre inserta contenido arbitrario.

**`Tarjeta.vue`:**

```vue
<template>
  <div class="tarjeta">
    <slot></slot>
  </div>
</template>
```

**Uso:**

```vue
<Tarjeta>
  <h3>Título</h3>
  <p>Cualquier contenido va aquí.</p>
</Tarjeta>
```

Todo lo que el padre escribe entre `<Tarjeta>` y `</Tarjeta>` reemplaza al `<slot></slot>`.

## 4.2 Contenido por Defecto de un Slot

Un slot puede definir contenido de reserva, que se muestra solo si el padre no proporciona nada.

```vue
<template>
  <button class="btn">
    <slot>Enviar</slot>
  </button>
</template>
```

```vue
<Boton />                 <!-- Muestra: "Enviar" -->
<Boton>Guardar cambios</Boton>  <!-- Muestra: "Guardar cambios" -->
```

## 4.3 Slots Nombrados

Cuando un componente necesita varias "zonas" de contenido personalizable (un encabezado, un cuerpo, un pie), se usan slots con nombre.

**`Modal.vue`:**

```vue
<template>
  <div class="modal">
    <header class="modal-header">
      <slot name="header">Título por defecto</slot>
    </header>

    <main class="modal-body">
      <slot></slot> <!-- El slot sin nombre se llama "default" -->
    </main>

    <footer class="modal-footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

**Uso con `v-slot` (o su abreviación `#`):**

```vue
<Modal>
  <template #header>
    <h2>Confirmar acción</h2>
  </template>

  <p>¿Estás seguro de que deseas continuar?</p>

  <template #footer>
    <button>Cancelar</button>
    <button>Confirmar</button>
  </template>
</Modal>
```

> El contenido sin `<template #nombre>` que envuelva se asigna automáticamente al slot `default`.

## 4.4 Slots con Ámbito (*Scoped Slots*)

El caso más potente: el componente **hijo** pasa datos hacia el slot, y el **padre** decide cómo renderizarlos. Es la base de patrones como listas personalizables o tablas con columnas configurables.

**`ListaUsuarios.vue`:**

```vue
<script setup lang="ts">
interface Usuario { id: number; nombre: string; activo: boolean }

defineProps<{ usuarios: Usuario[] }>()
</script>

<template>
  <ul>
    <li v-for="usuario in usuarios" :key="usuario.id">
      <slot :usuario="usuario" :esta-activo="usuario.activo"></slot>
    </li>
  </ul>
</template>
```

**Uso — el padre recibe `usuario` y `estaActivo` a través de `v-slot`:**

```vue
<ListaUsuarios :usuarios="usuarios">
  <template #default="{ usuario, estaActivo }">
    <strong>{{ usuario.nombre }}</strong>
    <span :class="estaActivo ? 'text-verde' : 'text-gris'">
      {{ estaActivo ? 'En línea' : 'Desconectado' }}
    </span>
  </template>
</ListaUsuarios>
```

El componente hijo controla **la iteración y la estructura** (`<ul><li>`), pero el padre controla **cómo se ve cada elemento** — la separación de responsabilidades ideal para un componente de lista reutilizable.

## 4.5 Comprobar si un Slot Fue Proporcionado

Con `useSlots()` puedes comprobar en el script si el padre pasó contenido a un slot concreto, útil para renderizado condicional.

```vue
<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()
const tieneFooter = !!slots.footer
</script>

<template>
  <footer v-if="tieneFooter" class="modal-footer">
    <slot name="footer"></slot>
  </footer>
</template>
```

## 4.6 Tabla de Referencia Rápida

| Necesitas... | Sintaxis |
| :--- | :--- |
| Un hueco de contenido genérico | `<slot></slot>` |
| Contenido de reserva si el padre no pasa nada | `<slot>Contenido por defecto</slot>` |
| Varias zonas de contenido | `<slot name="nombre">` + `<template #nombre>` |
| Pasar datos del hijo al padre a través del slot | `<slot :dato="valor">` + `<template #default="{ dato }">` |
| Saber si un slot tiene contenido | `useSlots()` |

## 4.7 Errores Comunes

- **Olvidar `:key` al iterar con un scoped slot**: la iteración sigue siendo responsabilidad del componente hijo, no te olvides del `:key` ahí, no en el padre.
- **Confundir el slot `default` con uno nombrado `"default"`**: son lo mismo — `<template #default>` es explícito, pero el contenido "suelto" (sin `<template>`) también va al slot `default`.
- **Pasar componentes complejos por props en vez de slots**: si el contenido incluye HTML, eventos o estructura variable, un slot es casi siempre mejor que intentar describirlo con una prop.
