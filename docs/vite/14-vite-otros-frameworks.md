# Módulo 14: Vite con Otros Frameworks (Svelte, Solid, Preact)

Más allá de Vue y React, Vite tiene soporte de primera clase para varios otros frameworks — este módulo cubre las particularidades de cada uno y qué los distingue en el contexto de Vite específicamente.

## 14.1 Svelte

```bash
npm create vite@latest mi-proyecto -- --template svelte-ts
```

```svelte
<script lang="ts">
  let contador = 0
</script>

<button on:click={() => contador++}>
  Contador: {contador}
</button>
```

A diferencia de Vue y React (que ejecutan código en el navegador para gestionar el DOM en tiempo de ejecución), Svelte es fundamentalmente un **compilador**: convierte el código `.svelte` en JavaScript imperativo optimizado durante el build, sin ningún framework runtime incluido en el bundle final — `@sveltejs/vite-plugin-svelte` es el plugin que integra ese compilador con el pipeline de Vite.

## 14.2 Solid

```bash
npm create vite@latest mi-proyecto -- --template solid-ts
```

```tsx
import { createSignal } from 'solid-js'

function Contador() {
  const [contador, setContador] = createSignal(0)

  return <button onClick={() => setContador(contador() + 1)}>Contador: {contador()}</button>
}
```

Solid usa una sintaxis JSX visualmente similar a React, pero con un modelo reactivo fundamentalmente distinto basado en señales granulares (`createSignal`) — no usa un Virtual DOM, y el JSX se compila (de forma similar a Svelte) a actualizaciones directas del DOM real. `vite-plugin-solid` gestiona esa transformación específica dentro de Vite.

## 14.3 Preact: una Alternativa Ligera Compatible con React

```bash
npm create vite@latest mi-proyecto -- --template preact-ts
```

```tsx
import { useState } from 'preact/hooks'

function Contador() {
  const [contador, setContador] = useState(0)
  return <button onClick={() => setContador(contador + 1)}>Contador: {contador}</button>
}
```

Preact ofrece una API prácticamente idéntica a React (mismos hooks, mismo modelo JSX) pero con un tamaño de runtime drásticamente menor — útil cuando el tamaño del bundle es una prioridad crítica y no se necesita el ecosistema completo de React. `@preact/preset-vite` gestiona la integración.

## 14.4 Qwik: Resumability en Lugar de Hidratación

```bash
npm create vite@latest mi-proyecto -- --template qwik-ts
```

Qwik introduce un modelo de ejecución distinto a todos los anteriores: en lugar de "hidratar" toda la aplicación en el cliente tras el renderizado del servidor (el patrón tradicional de SSR, Módulo 24), Qwik permite que componentes individuales se vuelvan interactivos de forma granular y perezosa, solo cuando el usuario realmente interactúa con ellos — un enfoque orientado específicamente a minimizar el JavaScript ejecutado en la carga inicial.

## 14.5 Lit: Web Components Estándar

```bash
npm create vite@latest mi-proyecto -- --template lit-ts
```

```ts
import { LitElement, html, customElement } from 'lit'

@customElement('mi-contador')
class MiContador extends LitElement {
  render() {
    return html`<button>Contador</button>`
  }
}
```

Lit construye sobre el estándar de Web Components nativo del navegador (`customElements`), en lugar de un modelo de componentes propietario de framework — los componentes resultantes son elementos HTML personalizados utilizables en cualquier contexto, incluso fuera de un proyecto Vite/Lit específico.

## 14.6 Lo que Todos Comparten: la Misma Arquitectura de Vite Subyacente

```text
Servidor de desarrollo con HMR (Módulo 4)   → igual para todos
Pre-bundling de dependencias (Módulo 5)      → igual para todos
Build de producción con Rollup (Módulo 15)    → igual para todos
```

Independientemente del framework elegido, la arquitectura central de Vite (servir ESM nativo en desarrollo, empaquetar con Rollup en producción) permanece idéntica — lo único que cambia entre frameworks es el plugin específico que enseña a Vite cómo procesar la sintaxis de componentes de ese framework en particular (`.svelte`, JSX con señales, Web Components, etc.).

## 14.7 Elegir un Framework: Consideraciones Fuera del Alcance de Vite

La elección entre Vue, React, Svelte, Solid u otros depende de factores ajenos a Vite en sí mismo (tamaño del ecosistema, curva de aprendizaje, preferencias del equipo, requisitos específicos del proyecto) — Vite es deliberadamente neutral al respecto, ofreciendo la misma calidad de experiencia de desarrollo sin importar cuál se elija.

## 14.8 Tabla de Referencia Rápida

| Framework | Plugin Vite | Modelo distintivo |
| :--- | :--- | :--- |
| Svelte | `@sveltejs/vite-plugin-svelte` | Compilador, sin runtime de framework en el bundle |
| Solid | `vite-plugin-solid` | Señales granulares, sin Virtual DOM |
| Preact | `@preact/preset-vite` | API compatible con React, runtime mucho más pequeño |
| Qwik | `@builder.io/qwik` (integración propia) | Resumability, sin hidratación tradicional |
| Lit | Sin plugin adicional necesario (usa TS estándar) | Web Components nativos del navegador |

## 14.9 Errores Comunes

- **Asumir que la sintaxis JSX de Solid se comporta igual que en React**: aunque visualmente similar, el modelo reactivo es distinto (señales vs Virtual DOM) — patrones idiomáticos de React (como recrear el JSX en cada render) no siempre aplican de la misma forma en Solid.
- **Elegir un framework basándose solo en la velocidad de Vite**: la velocidad del servidor de desarrollo es prácticamente idéntica entre todos ellos (14.6) — la decisión de framework debe basarse en otros factores, no en el rendimiento de Vite específicamente.
- **Mezclar convenciones de un framework con la documentación de otro**: cada framework tiene su propio plugin con opciones de configuración específicas — la documentación de `@vitejs/plugin-vue` no aplica directamente a `vite-plugin-solid`, pese a compartir la misma arquitectura subyacente de Vite.
