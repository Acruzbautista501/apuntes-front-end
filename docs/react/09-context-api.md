# Módulo 9: Context API

Pasar props a través de varios niveles de componentes que no las necesitan, solo para que lleguen a un componente profundamente anidado, se conoce como *prop drilling* — el mismo problema que resuelve `provide`/`inject` en Vue. En React, la solución nativa es la **Context API**.

## 9.1 El Problema: *Prop Drilling*

```tsx
function App() {
  const usuario = { nombre: 'Alex' }
  return <Layout usuario={usuario} />
}

function Layout({ usuario }: { usuario: Usuario }) {
  return <Sidebar usuario={usuario} /> // No usa "usuario" para nada, solo lo reenvía
}

function Sidebar({ usuario }: { usuario: Usuario }) {
  return <PerfilUsuario usuario={usuario} /> // Tampoco lo usa directamente
}

function PerfilUsuario({ usuario }: { usuario: Usuario }) {
  return <p>{usuario.nombre}</p> // El único que realmente lo necesita
}
```

## 9.2 Crear un Contexto

```tsx
// contexts/UsuarioContext.tsx
import { createContext } from 'react'

interface Usuario {
  nombre: string
  rol: string
}

export const UsuarioContext = createContext<Usuario | null>(null)
```

`createContext(valorPorDefecto)` recibe el valor que se usará si un componente intenta leer el contexto sin que exista un proveedor por encima de él en el árbol.

## 9.3 Proveer el Valor con `Provider`

```tsx
// App.tsx
import { UsuarioContext } from './contexts/UsuarioContext'

function App() {
  const usuario = { nombre: 'Alex', rol: 'admin' }

  return (
    <UsuarioContext.Provider value={usuario}>
      <Layout />
    </UsuarioContext.Provider>
  )
}
```

Cualquier componente dentro de `<UsuarioContext.Provider>` — sin importar cuántos niveles de profundidad — puede leer `usuario` sin que los componentes intermedios lo mencionen en absoluto.

## 9.4 Consumir el Valor con `useContext`

```tsx
// PerfilUsuario.tsx
import { useContext } from 'react'
import { UsuarioContext } from './contexts/UsuarioContext'

function PerfilUsuario() {
  const usuario = useContext(UsuarioContext)

  if (!usuario) return null

  return <p>{usuario.nombre}</p>
}
```

`Layout` y `Sidebar` ya no necesitan mencionar `usuario` en ningún lado — desaparece por completo el *prop drilling*.

## 9.5 Contexto con Estado y Funciones (Patrón Completo)

El caso más común en aplicaciones reales: un contexto que provee tanto el estado actual como funciones para modificarlo, encapsulado en un componente "proveedor" propio.

```tsx
// contexts/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

interface Usuario { id: number; nombre: string }

interface AuthContextType {
  usuario: Usuario | null
  iniciarSesion: (usuario: Usuario) => void
  cerrarSesion: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  function iniciarSesion(nuevoUsuario: Usuario) {
    setUsuario(nuevoUsuario)
  }

  function cerrarSesion() {
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth() debe usarse dentro de un AuthProvider')
  return contexto
}
```

```tsx
// main.tsx
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
```

```tsx
// Cualquier componente dentro del árbol
import { useAuth } from './contexts/AuthContext'

function BotonSesion() {
  const { usuario, cerrarSesion } = useAuth()

  return usuario ? (
    <button onClick={cerrarSesion}>Cerrar sesión ({usuario.nombre})</button>
  ) : (
    <p>No autenticado</p>
  )
}
```

Este patrón — un `Provider` propio + un hook `useX` que valida que el contexto exista — es el estándar de facto en proyectos React con TypeScript, exactamente equivalente al patrón `proveerUsuario`/`useUsuario` visto en Vue.

## 9.6 Múltiples Contextos

Es normal tener varios contextos independientes (autenticación, tema visual, idioma), cada uno con su propio `Provider`, anidados según sea necesario.

```tsx
function App() {
  return (
    <AuthProvider>
      <TemaProvider>
        <IdiomaProvider>
          <Layout />
        </IdiomaProvider>
      </TemaProvider>
    </AuthProvider>
  )
}
```

## 9.7 Context API vs Estado Global (Zustand/Redux)

| Escenario | Recomendación |
| :--- | :--- |
| Estado compartido dentro de un árbol específico (tema, idioma, sesión) | Context API |
| Estado que cambia con mucha frecuencia y afecta muchos componentes (un carrito con actualizaciones constantes) | Zustand/Redux Toolkit (Módulo 15) — evita re-renders innecesarios en todo el árbol |
| Necesitas DevTools dedicadas, middlewares o persistencia avanzada | Zustand/Redux Toolkit |

> **Limitación importante de Context:** cuando el valor de un contexto cambia, **todos** los componentes que lo consumen se vuelven a renderizar, sin importar si usan solo una parte del valor. Para estado que cambia muy seguido, una librería de estado global dedicada suele rendir mejor.

## 9.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Definir un contexto | `createContext<Tipo | null>(null)` |
| Proveer un valor a un subárbol | `<MiContexto.Provider value={...}>` |
| Leer el valor desde cualquier descendiente | `useContext(MiContexto)` |
| Una API limpia y reutilizable | Un componente `Provider` propio + un hook `useX` |

## 9.9 Errores Comunes

* **Usar `useContext` fuera de un `Provider`**: devuelve el valor por defecto pasado a `createContext` (a menudo `null`), causando errores si el código no lo contempla — por eso el hook `useX` (9.5) valida explícitamente y lanza un error claro.
* **Un solo contexto gigante con todo el estado de la aplicación**: cualquier cambio, sin importar cuán pequeño, re-renderiza todo lo que consume ese contexto — divide en contextos más pequeños y específicos.
* **Olvidar envolver la aplicación con el `Provider`**: un componente que use `useContext` fuera del árbol envuelto por su `Provider` correspondiente no tendrá acceso al valor real.
