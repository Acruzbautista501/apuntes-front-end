# Módulo 1: Introducción a React y Setup con TypeScript

React es una librería de JavaScript para construir interfaces de usuario a partir de **componentes**: piezas reutilizables e independientes que devuelven lo que debe mostrarse en pantalla. A diferencia de un framework completo, React se enfoca solo en la capa de vista — el enrutamiento, la gestión de estado global y otras piezas se agregan como librerías adicionales según las necesite el proyecto.

## 1.1 ¿Por Qué React?

* **Basado en componentes**: la UI se descompone en piezas pequeñas y reutilizables.
* **Declarativo**: describes *cómo debe verse* la UI para cada estado, no los pasos manuales para transformarla — React se encarga de actualizar el DOM.
* **Ecosistema enorme**: la mayoría de problemas comunes (rutas, formularios, estado global, *data fetching*) ya tienen una solución madura y ampliamente adoptada.
* **Virtual DOM**: React mantiene una representación en memoria de la UI y calcula la forma más eficiente de actualizar el DOM real cuando el estado cambia.

## 1.2 Entorno de Desarrollo

* **Node.js 18+** instalado.
* **VS Code** con las extensiones: *ESLint*, *Prettier* y opcionalmente *ES7+ React/Redux/React-Native snippets*.
* No se necesita ninguna extensión equivalente a Volar (esa es específica de Vue) — el soporte de JSX/TSX viene integrado en el propio TypeScript.

## 1.3 Crear un Proyecto con Vite

Vite es la herramienta de build recomendada para proyectos nuevos de React — arranque casi instantáneo y *Hot Module Replacement* muy rápido.

```bash
npm create vite@latest mi-app-react -- --template react-ts
cd mi-app-react
npm install
npm run dev
```

`react-ts` es la plantilla oficial que configura React junto con TypeScript desde el inicio, sin pasos manuales adicionales.

## 1.4 Estructura del Proyecto

```text
mi-app-react/
├── public/
├── src/
│   ├── assets/
│   ├── App.tsx          # Componente raíz
│   ├── main.tsx          # Punto de entrada, monta <App /> en el DOM
│   ├── index.css
│   └── vite-env.d.ts     # Tipos ambientales de Vite
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

`index.html` contiene un único `<div id="root"></div>`; toda la aplicación se renderiza dentro de él vía JavaScript.

## 1.5 El Punto de Entrada: `main.tsx`

```tsx
// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

`createRoot` conecta React con el elemento real del DOM; `<StrictMode>` activa comprobaciones adicionales en desarrollo (detecta efectos secundarios inseguros) y no tiene ningún efecto en producción.

## 1.6 Tu Primer Componente

```tsx
// App.tsx
function App() {
  return (
    <div>
      <h1>Hola, React con TypeScript</h1>
      <p>Este es mi primer componente.</p>
    </div>
  )
}

export default App
```

Un componente de React es, en esencia, **una función que devuelve JSX** (una sintaxis similar a HTML, cubierta a fondo en el Módulo 2). El nombre del componente siempre empieza con mayúscula — es la convención que distingue un componente de una etiqueta HTML nativa.

## 1.7 ¿Por Qué la Extensión `.tsx`?

Un archivo `.ts` normal no permite escribir JSX. La extensión `.tsx` le indica a TypeScript que el archivo contiene sintaxis JSX y debe procesarla como tal. Cualquier archivo que devuelva JSX debe usar `.tsx`; los archivos que solo contienen lógica (funciones, tipos, hooks personalizados) pueden seguir siendo `.ts`.

## 1.8 React vs Vue — Diferencias Clave para Quien Ya Conoce Vue

| Concepto | Vue 3 | React |
| :--- | :--- | :--- |
| Sintaxis de plantilla | HTML con directivas (`v-if`, `v-for`) | JSX (JavaScript con HTML embebido) |
| Estado reactivo | `ref()`/`reactive()`, mutación directa | `useState()`, siempre inmutable (se reemplaza, no se muta) |
| Detección de cambios | Reactividad automática vía Proxies | Re-renderizado explícito al llamar al *setter* del estado |
| Comunicación padre-hijo | Props + `emit` | Props + funciones pasadas como props |
| Único archivo por componente | `.vue` (template + script + style) | `.tsx` (JSX + lógica; los estilos suelen ir aparte) |

## 1.9 Buenas Prácticas Iniciales

* Un componente, una responsabilidad: si un componente crece demasiado, probablemente debe dividirse.
* Nombra los archivos de componentes con PascalCase (`TarjetaProducto.tsx`), igual que el nombre del componente que exportan.
* Usa siempre `react-ts` (o configura TypeScript desde el inicio) — agregar TypeScript después a un proyecto JavaScript ya avanzado es mucho más costoso.

## 1.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Crear un proyecto nuevo | `npm create vite@latest mi-app -- --template react-ts` |
| Un archivo que devuelve JSX | Extensión `.tsx` |
| Montar la aplicación en el DOM | `createRoot(elemento).render(<App />)` |
| Detectar errores comunes en desarrollo | `<StrictMode>` en `main.tsx` |
