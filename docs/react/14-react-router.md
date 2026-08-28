# Módulo 14: React Router

React no incluye enrutamiento — **React Router** es la librería estándar de facto para mapear URLs a componentes en una aplicación de una sola página (SPA). Este módulo cubre su configuración y los patrones esenciales con TypeScript.

## 14.1 Instalación y Configuración Base

```bash
npm install react-router-dom
```

```tsx
// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

```tsx
// App.tsx
import { Routes, Route, Link } from 'react-router-dom'
import InicioPage from './pages/InicioPage'
import ContactoPage from './pages/ContactoPage'

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>

      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
      </Routes>
    </div>
  )
}
```

`<Routes>` es el "hueco" que renderiza el componente cuya `path` coincide con la URL actual; `<Link>` genera un `<a>` que navega sin recargar la página — el equivalente exacto a `<RouterView>`/`<RouterLink>` de Vue Router.

## 14.2 Rutas con Parámetros Dinámicos

```tsx
<Route path="/productos/:id" element={<ProductoDetallePage />} />
```

```tsx
import { useParams } from 'react-router-dom'

function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>()

  return <p>Mostrando el producto con ID: {id}</p>
}
```

`useParams` siempre devuelve strings — convierte explícitamente (`Number(id)`) si necesitas un valor numérico.

## 14.3 Navegación Programática

```tsx
import { useNavigate } from 'react-router-dom'

function FormularioLogin() {
  const navigate = useNavigate()

  async function manejarEnvio() {
    await iniciarSesion()
    navigate('/panel')
    // O de forma explícita con la ruta y reemplazando el historial:
    // navigate('/panel', { replace: true })
  }

  return <button onClick={manejarEnvio}>Iniciar sesión</button>
}
```

## 14.4 Rutas Anidadas con `<Outlet>`

```tsx
// App.tsx
<Routes>
  <Route path="/ajustes" element={<AjustesLayout />}>
    <Route index element={<AjustesPerfilPage />} />
    <Route path="seguridad" element={<AjustesSeguridadPage />} />
  </Route>
</Routes>
```

```tsx
// AjustesLayout.tsx
import { Outlet, Link } from 'react-router-dom'

function AjustesLayout() {
  return (
    <div>
      <nav>
        <Link to="/ajustes">Perfil</Link>
        <Link to="/ajustes/seguridad">Seguridad</Link>
      </nav>
      <Outlet /> {/* Aquí se renderiza la ruta hija activa */}
    </div>
  )
}
```

`<Outlet>` es el equivalente exacto al `<RouterView>` anidado que se usa dentro de un layout con `children` en Vue Router; `index` marca la ruta que se muestra cuando la URL coincide exactamente con la ruta padre (`/ajustes` sin nada más).

## 14.5 Rutas Protegidas

```tsx
// components/RutaProtegida.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function RutaProtegida() {
  const { usuario } = useAuth()

  if (!usuario) return <Navigate to="/login" replace />

  return <Outlet />
}
```

```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />

  <Route element={<RutaProtegida />}>
    <Route path="/panel" element={<PanelPage />} />
    <Route path="/perfil" element={<PerfilPage />} />
  </Route>
</Routes>
```

Cualquier ruta anidada dentro de `<RutaProtegida>` solo se renderiza si el usuario está autenticado — de lo contrario, `<Navigate>` redirige antes de que la ruta protegida llegue a renderizarse.

## 14.6 Lazy Loading de Rutas (*Code Splitting*)

```tsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const PanelPage = lazy(() => import('./pages/PanelPage'))

function App() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <Routes>
        <Route path="/panel" element={<PanelPage />} />
      </Routes>
    </Suspense>
  )
}
```

El código de `PanelPage` no se descarga hasta que el usuario visita esa ruta — se retoma con más detalle en el Módulo 18.

## 14.7 Ruta 404 (No Encontrada)

```tsx
<Routes>
  <Route path="/" element={<InicioPage />} />
  <Route path="/contacto" element={<ContactoPage />} />
  <Route path="*" element={<NoEncontradaPage />} /> {/* Coincide con cualquier ruta no definida antes */}
</Routes>
```

## 14.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un enlace de navegación sin recargar la página | `<Link to="...">` |
| El lugar donde se renderiza la ruta activa | `<Routes>` + `<Route path="..." element={<Componente />}>` |
| Leer parámetros de la URL | `useParams<{ id: string }>()` |
| Navegar desde el código | `useNavigate()` |
| Un layout con rutas hijas anidadas | `<Outlet />` dentro del componente de layout |
| Proteger rutas según autenticación | Un componente wrapper con `<Navigate>` + `<Outlet />` |

## 14.9 Errores Comunes

* **Olvidar `<Outlet />` en un layout con rutas anidadas**: sin él, las rutas hijas no tienen dónde renderizarse, aunque la URL coincida correctamente.
* **No convertir `useParams().id` a número cuando se necesita**: siempre llega como `string | undefined`.
* **Colocar la ruta `path="*"` antes que las demás**: `<Routes>` evalúa en orden, así que la ruta comodín debe ir siempre al final para no capturar rutas válidas por error.
