# Módulo 18: Code Splitting y `Suspense`

Cargar todo el JavaScript de una aplicación de una sola vez, incluyendo vistas y componentes que el usuario tal vez nunca visite, aumenta innecesariamente el tiempo de carga inicial. Este módulo cubre cómo dividir el código en partes que se descargan bajo demanda, y cómo `Suspense` coordina qué mostrar mientras eso ocurre.

## 18.1 `React.lazy` — Carga Diferida de Componentes

`lazy` convierte un `import` estático en uno dinámico: el código del componente no se descarga hasta el momento en que React necesita renderizarlo por primera vez.

```tsx
import { lazy } from 'react'

const PanelAdmin = lazy(() => import('./PanelAdmin'))
```

Esto genera un archivo JavaScript separado para `PanelAdmin`, descargado únicamente cuando ese componente realmente se renderiza — no como parte del bundle inicial de la aplicación.

## 18.2 `<Suspense>` — Coordinar el Estado de Carga

Un componente cargado con `lazy` no puede renderizarse instantáneamente la primera vez (su código aún se está descargando). `<Suspense>` define qué mostrar mientras tanto.

```tsx
import { lazy, Suspense } from 'react'

const PanelAdmin = lazy(() => import('./PanelAdmin'))

function App() {
  return (
    <Suspense fallback={<p>Cargando panel...</p>}>
      <PanelAdmin />
    </Suspense>
  )
}
```

Mientras el código de `PanelAdmin` se descarga, React muestra el contenido de `fallback`; en cuanto termina, lo reemplaza automáticamente por el componente real.

## 18.3 Code Splitting por Ruta (El Caso de Uso Más Común)

Combinado con React Router (Módulo 14), cada vista se convierte en su propio *chunk* descargado solo cuando el usuario navega a esa ruta.

```tsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const InicioPage = lazy(() => import('./pages/InicioPage'))
const PanelPage = lazy(() => import('./pages/PanelPage'))
const ConfiguracionPage = lazy(() => import('./pages/ConfiguracionPage'))

function App() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/panel" element={<PanelPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
      </Routes>
    </Suspense>
  )
}
```

Un único `<Suspense>` alrededor de `<Routes>` es suficiente — cubre cualquier ruta que esté cargando, sin necesitar uno por cada `<Route>`.

## 18.4 `<Suspense>` Anidado para Carga Granular

Varios `<Suspense>` anidados permiten que distintas secciones de una misma página muestren su propio estado de carga de forma independiente, en lugar de bloquear toda la vista mientras una sola sección tarda.

```tsx
function PaginaProducto() {
  return (
    <div>
      <InformacionBasica /> {/* Se muestra de inmediato, no depende de lazy loading */}

      <Suspense fallback={<p>Cargando reseñas...</p>}>
        <SeccionResenas />
      </Suspense>

      <Suspense fallback={<p>Cargando recomendaciones...</p>}>
        <SeccionRecomendaciones />
      </Suspense>
    </div>
  )
}
```

Si `SeccionRecomendaciones` tarda más en cargar, no bloquea la aparición de `SeccionResenas` — cada `Suspense` gestiona su propia sección de forma independiente.

## 18.5 Manejar Errores con un Error Boundary

`Suspense` gestiona el estado de **carga**, pero no captura errores si el `import()` falla (por ejemplo, una conexión inestable). Para eso se combina con un *Error Boundary*.

```tsx
import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback: ReactNode }
interface State { conError: boolean }

class ErrorBoundary extends Component<Props, State> {
  state: State = { conError: false }

  static getDerivedStateFromError() {
    return { conError: true }
  }

  render() {
    if (this.state.conError) return this.props.fallback
    return this.props.children
  }
}
```

```tsx
<ErrorBoundary fallback={<p>Ocurrió un error al cargar esta sección.</p>}>
  <Suspense fallback={<p>Cargando...</p>}>
    <PanelAdmin />
  </Suspense>
</ErrorBoundary>
```

> **Nota:** los *Error Boundaries* son uno de los pocos casos donde React todavía requiere un componente de clase — no existe (a la fecha) un hook equivalente directo para capturar errores de renderizado de esta forma.

## 18.6 Precargar un Componente Antes de que se Necesite

Un patrón de optimización de experiencia de usuario: iniciar la descarga de un componente lazy **antes** de que el usuario navegue a él (por ejemplo, al pasar el cursor sobre un enlace).

```tsx
const cargarPanelAdmin = () => import('./PanelAdmin')
const PanelAdmin = lazy(cargarPanelAdmin)

function EnlacePanel() {
  return (
    <Link to="/panel" onMouseEnter={() => cargarPanelAdmin()}>
      Ir al panel
    </Link>
  )
}
```

Al mover el cursor sobre el enlace, el navegador ya empieza a descargar el código de `PanelAdmin` — cuando el usuario hace clic, es probable que ya esté disponible, sin ningún estado de carga visible.

## 18.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Cargar un componente bajo demanda | `lazy(() => import('./Componente'))` |
| Mostrar contenido mientras un componente lazy se descarga | `<Suspense fallback={...}>` |
| Estados de carga independientes por sección de una página | Varios `<Suspense>` anidados |
| Capturar errores de un componente que falla al cargar/renderizar | Un `ErrorBoundary` (componente de clase) envolviendo el `<Suspense>` |
| Descargar un componente antes de que se necesite | Llamar manualmente a la función de `import()` en un evento (ej. `onMouseEnter`) |

## 18.8 Errores Comunes

* **Olvidar el `<Suspense>` alrededor de un componente `lazy`**: React lanza un error en tiempo de ejecución si un componente lazy se renderiza sin un `Suspense` ancestro.
* **Un único `<Suspense>` envolviendo toda la aplicación sin granularidad**: cualquier componente lazy en cualquier parte de la página bloquea la vista completa con el mismo `fallback`, en vez de permitir carga independiente por sección.
* **No manejar errores de carga**: sin un `ErrorBoundary`, un fallo de red al descargar un chunk deja la aplicación en un estado roto sin ningún mensaje útil para el usuario.
