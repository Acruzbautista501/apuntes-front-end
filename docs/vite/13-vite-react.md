# Módulo 13: Vite con React

Vite reemplazó a Create React App como la forma recomendada de iniciar proyectos React — este módulo cubre `@vitejs/plugin-react`, sus dos variantes (Babel vs SWC), y JSX/TSX bajo Vite.

## 13.1 Los Dos Plugins Oficiales de React

```bash
npm install -D @vitejs/plugin-react       # Basado en Babel
npm install -D @vitejs/plugin-react-swc    # Basado en SWC (Rust), más rápido
```

```ts
import react from '@vitejs/plugin-react'
// o
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
})
```

Ambos plugins cumplen la misma función (procesar JSX/TSX y habilitar Fast Refresh, 13.2), pero usan motores de transformación distintos — `@vitejs/plugin-react-swc` es significativamente más rápido al usar SWC (compilado en Rust, similar en filosofía a esbuild) en lugar de Babel, a costa de un ecosistema de plugins de Babel personalizados no siempre compatible.

## 13.2 Fast Refresh: HMR con Preservación de Estado en React

```tsx
function Contador() {
  const [cuenta, setCuenta] = useState(0)

  return <button onClick={() => setCuenta(cuenta + 1)}>Cuenta: {cuenta}</button>
}
```

Fast Refresh es el equivalente en React a lo que el Módulo 12.3 describe para Vue: modificar el código de un componente actualiza la interfaz sin perder su estado local (`cuenta` en este ejemplo se conserva) — implementado por el plugin de React sobre la API de HMR genérica de Vite (Módulo 4.4).

## 13.3 JSX/TSX: Transformación Automática

```tsx
// App.tsx
export default function App() {
  return <h1>Hola desde React con Vite</h1>
}
```

esbuild (en desarrollo) y Babel/SWC (según el plugin elegido) transforman JSX a llamadas `React.createElement` (o al *automatic runtime* más moderno, 13.4) automáticamente — ningún import manual de React es necesario en cada archivo con la configuración por defecto del andamiaje moderno.

## 13.4 El Runtime Automático de JSX

```tsx
// Con el runtime automático (por defecto en proyectos Vite modernos):
export default function App() {
  return <h1>Hola</h1> // NO requiere "import React from 'react'"
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

El *automatic JSX runtime* (introducido en React 17) elimina la necesidad histórica de `import React from 'react'` en cada archivo que usa JSX — el transformador inserta automáticamente los imports necesarios de una función auxiliar interna, en lugar de requerir `React.createElement` explícitamente en el scope de cada archivo.

## 13.5 React DevTools

```text
Extensión de navegador "React Developer Tools"
→ Funciona igual con Vite que con cualquier otra herramienta de build de React
```

A diferencia de Vue DevTools (Módulo 12.5), no existe un plugin de Vite específico necesario para React DevTools — la extensión estándar de navegador funciona sin ninguna configuración adicional, ya que detecta React directamente en el runtime de la página.

## 13.6 Lazy Loading de Componentes con `React.lazy`

```tsx
import { lazy, Suspense } from 'react'

const GraficoComplejo = lazy(() => import('./GraficoComplejo'))

function App() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <GraficoComplejo />
    </Suspense>
  )
}
```

Igual que con `defineAsyncComponent` en Vue (Módulo 12.8), `React.lazy` combinado con `import()` dinámico aprovecha el code splitting automático de Rollup (Módulo 16) — el componente se separa en su propio chunk, cargado solo cuando el árbol de componentes efectivamente lo renderiza.

## 13.7 Elegir Entre Babel y SWC

| | `@vitejs/plugin-react` (Babel) | `@vitejs/plugin-react-swc` |
| :--- | :--- | :--- |
| Velocidad | Más lento | Significativamente más rápido |
| Compatibilidad con plugins de Babel personalizados | Completa | Limitada/nula |
| Recomendación por defecto | Proyectos con transformaciones Babel específicas (styled-components con macros, etc.) | La mayoría de los proyectos nuevos sin necesidades especiales |

El andamiaje oficial (`npm create vite -- --template react-swc-ts`) ofrece SWC como opción directa desde el inicio — vale la pena elegirlo por defecto salvo que el proyecto dependa específicamente de un plugin de Babel sin equivalente en SWC.

## 13.8 Verificación de Tipos con TypeScript en React

```json
{
  "scripts": {
    "build": "tsc -b && vite build"
  }
}
```

A diferencia de Vue (que requiere `vue-tsc` por la sintaxis especial de los SFC, Módulo 12.7), archivos `.tsx` de React son TypeScript "normal" desde la perspectiva del compilador — el `tsc` estándar los verifica directamente sin ninguna herramienta adicional especializada.

## 13.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Que Vite entienda JSX/TSX de React | `@vitejs/plugin-react` o `@vitejs/plugin-react-swc` |
| HMR con preservación de estado en componentes | Fast Refresh, incluido automáticamente por el plugin |
| Máxima velocidad de transformación | La variante SWC del plugin |
| Cargar un componente solo cuando se renderiza | `React.lazy(() => import('./Componente'))` + `Suspense` |
| Verificar tipos antes del build | `tsc -b` (sin herramienta adicional, a diferencia de Vue) |

## 13.10 Errores Comunes

- **Mezclar el plugin de Babel con plugins/babel-macros que solo funcionan con SWC, o viceversa**: cada variante tiene un ecosistema de compatibilidad distinto — verificar que cualquier dependencia que dependa de transformaciones a nivel de compilador sea compatible con el plugin elegido.
- **Agregar manualmente `import React from 'react'` en cada archivo con el runtime automático ya configurado**: es innecesario y puede generar advertencias de lint sobre imports no usados, dependiendo de la configuración de ESLint del proyecto.
- **Esperar que React DevTools necesite un plugin de Vite específico**: a diferencia de Vue DevTools, funciona directamente como extensión de navegador estándar sin integración adicional requerida.
