# Módulo 11: TypeScript en Vue 3 y React 18

Los frameworks modernos no ven a TypeScript como un añadido opcional; han sido construidos desde los cimientos alrededor de él. En este módulo aprenderás los patrones de tipado esenciales tanto para **Vue 3 (Composition API)** como para **React 18**.

---

## 11.1 La Filosofía de las Props como Contrato

En ambos frameworks, un componente es una unidad que recibe entradas (**Props**) y devuelve una interfaz de usuario. Al tipar las Props con interfaces estrictas, garantizas que cualquier desarrollador de tu equipo que use tu componente reciba advertencias inmediatas si olvida una propiedad obligatoria o le pasa el tipo equivocado.

---

## 11.2 TypeScript en Vue 3 (Composition API)

Vue 3 fue escrito completamente en TypeScript. La sintaxis recomendada es el bloque `<script setup lang="ts">`.

### 1. `defineProps` y `defineEmits` con Tipado Puro
En lugar de pasar objetos de configuración en runtime, se usan macros de compilación con genéricos de TypeScript:

```vue
<script setup lang="ts">
// 1. Tipamos las Props que el componente recibe
interface BotonProps {
  texto: string;
  variante?: "primario" | "secundario" | "peligro";
  deshabilitado?: boolean;
}

// Valores por defecto mediante withDefaults:
const props = withDefaults(defineProps<BotonProps>(), {
  variante: "primario",
  deshabilitado: false
});

// 2. Tipamos los eventos que el componente emite al padre (Emits)
const emit = defineEmits<{
  (e: "clickBoton", id: number): void;
  (e: "cambioEstado", nuevoEstado: boolean): void;
}>();

const manejarClick = () => {
  emit("clickBoton", 42); // Tipado estricto de parámetros
};
</script>

<template>
  <button :class="`btn-${props.variante}`" :disabled="props.deshabilitado" @click="manejarClick">
    {{ props.texto }}
  </button>
</template>
```

### 2. Estado Reactivo Tipado: `ref` y `computed`
```typescript
import { ref, computed } from "vue";

interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
}

// Inferencia automática para primitivos:
const contador = ref(0); // Ref<number>

// Tipado explícito con genérico para estructuras complejas o nulas:
const tareaSeleccionada = ref<Tarea | null>(null);

// Los computed infieren automáticamente su tipo de retorno:
const esValida = computed<boolean>(() => contador.value > 0);
```

### 3. Componentes Genéricos en Vue 3 (Novedad 3.3+)
Puedes crear componentes que acepten listas de cualquier tipo usando el atributo `generic`:

```vue
<!-- ListaGenerica.vue -->
<script setup lang="ts" generic="T extends { id: number | string }">
defineProps<{
  items: T[];
  campoTitulo: keyof T;
}>();
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item[campoTitulo] }}
    </li>
  </ul>
</template>
```

---

## 11.3 TypeScript en React 18

En React, los componentes son funciones de JavaScript que devuelven elementos JSX.

### 1. Tipado Directo de Props
La recomendación actual de React es tipar los argumentos directamente, evitando el viejo tipo genérico `React.FC`:

```tsx
interface TarjetaProps {
  titulo: string;
  descripcion?: string;
  children: React.ReactNode; // Cualquier contenido HTML o componentes anidados
  onCerrar: () => void;
}

export function Tarjeta({ titulo, descripcion = "Sin descripción", children, onCerrar }: TarjetaProps) {
  return (
    <div className="tarjeta">
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
      <div className="contenido">{children}</div>
      <button onClick={onCerrar}>Cerrar</button>
    </div>
  );
}
```

### 2. Hooks Principales: `useState` y `useRef`
```tsx
import { useState, useRef } from "react";

interface Usuario {
  id: number;
  nombre: string;
}

export function Perfil() {
  // useState con tipo explícito para admitir null inicialmente:
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // useRef para un elemento del DOM:
  const inputRef = useRef<HTMLInputElement>(null);

  const enfocarInput = () => {
    inputRef.current?.focus(); // Encadenamiento opcional seguro
  };

  return <input ref={inputRef} type="text" />;
}
```

### 3. Context API Seguro sin Nulos Forzados
El patrón profesional para React Context consiste en crear un Hook personalizado que compruebe la existencia del proveedor:

```tsx
import { createContext, useContext, useState } from "react";

interface TemaContextType {
  tema: "claro" | "oscuro";
  alternarTema: () => void;
}

// 1. Contexto con valor inicial null
const TemaContext = createContext<TemaContextType | null>(null);

// 2. Custom Hook que garantiza que nunca devuelva null:
export function useTema(): TemaContextType {
  const contexto = useContext(TemaContext);
  if (!contexto) {
    throw new Error("useTema debe ser utilizado dentro de un TemaProvider");
  }
  return contexto; // Aquí TypeScript garantiza que no es null
}
```

---

## 11.4 Componentes con Props Condicionales

Un caso avanzado en Frontend: un componente `Boton` que si recibe una propiedad `href`, debe comportarse como un enlace `<a>` y exigir `target`, pero si no tiene `href`, es un `<button>` tradicional con `onClick`:

```typescript
type BotonComunProps = {
  label: string;
};

type BotonComoBoton = BotonComunProps & {
  href?: never; // No puede tener href
  onClick: () => void;
};

type BotonComoEnlace = BotonComunProps & {
  href: string; // Obligatorio
  target?: "_blank" | "_self";
  onClick?: never;
};

export type BotonDinamicoProps = BotonComoBoton | BotonComoEnlace;
```

---

## 🛠️ Reto Práctico del Módulo

**Ejercicio: Selector Genérico Reutilizable (`<Dropdown<T>>`)**

Diseña en el framework de tu preferencia (Vue o React) un componente selector desplegable genérico:
1. Las Props deben aceptar:
   * `opciones: T[]` (donde `T` es cualquier objeto).
   * `claveValor: keyof T` (la propiedad que se usará como identificador único).
   * `claveEtiqueta: keyof T` (la propiedad que se mostrará como texto en la lista).
   * `onSeleccionar: (seleccionado: T) => void`
2. Pruébalo usando una lista de países `{ codigo: "MX", nombre: "México" }` y verifica que al seleccionar una opción, el callback devuelva el objeto con el tipo original intacto.
