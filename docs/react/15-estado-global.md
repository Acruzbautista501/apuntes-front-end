# Módulo 15: Gestión de Estado Global (Zustand y Redux Toolkit)

Context API (Módulo 9) funciona bien para estado compartido dentro de un árbol, pero re-renderiza a **todos** los consumidores en cada cambio, y se vuelve incómodo cuando el estado global crece o cambia con mucha frecuencia. Este módulo cubre las dos soluciones dominantes del ecosistema: **Zustand** (minimalista, recomendado para empezar) y **Redux Toolkit** (más estructurado, común en equipos grandes).

## 15.1 Zustand — Instalación y Primer Store

```bash
npm install zustand
```

```typescript
// stores/useContadorStore.ts
import { create } from 'zustand'

interface ContadorState {
  cuenta: number
  incrementar: () => void
  reiniciar: () => void
}

export const useContadorStore = create<ContadorState>((set) => ({
  cuenta: 0,
  incrementar: () => set((estado) => ({ cuenta: estado.cuenta + 1 })),
  reiniciar: () => set({ cuenta: 0 })
}))
```

**Uso directo en cualquier componente — sin `Provider`, sin envolver la aplicación:**

```tsx
function Contador() {
  const cuenta = useContadorStore((estado) => estado.cuenta)
  const incrementar = useContadorStore((estado) => estado.incrementar)

  return (
    <div>
      <p>{cuenta}</p>
      <button onClick={incrementar}>+1</button>
    </div>
  )
}
```

A diferencia de Context, Zustand no necesita un `<Provider>` envolviendo la aplicación — el store es un módulo importable directamente, y **solo** los componentes que leen `estado.cuenta` con el *selector* (la función pasada a `useContadorStore`) se re-renderizan cuando esa parte específica del estado cambia.

## 15.2 Por Qué el Patrón de *Selector* Importa

```tsx
// ❌ Se re-renderiza ante CUALQUIER cambio en el store completo
const estado = useContadorStore((estado) => estado)

// ✅ Solo se re-renderiza cuando "cuenta" específicamente cambia
const cuenta = useContadorStore((estado) => estado.cuenta)
```

Seleccionar solo la porción del estado que el componente realmente necesita es la razón principal por la que Zustand evita el problema de re-renders masivos que tiene Context.

## 15.3 Store Realista: Autenticación con Zustand

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand'

interface Usuario { id: number; nombre: string }

interface AuthState {
  usuario: Usuario | null
  token: string | null
  iniciarSesion: (usuario: Usuario, token: string) => void
  cerrarSesion: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  token: localStorage.getItem('token'),
  iniciarSesion: (usuario, token) => {
    localStorage.setItem('token', token)
    set({ usuario, token })
  },
  cerrarSesion: () => {
    localStorage.removeItem('token')
    set({ usuario: null, token: null })
  }
}))
```

```tsx
function BotonSesion() {
  const usuario = useAuthStore((s) => s.usuario)
  const cerrarSesion = useAuthStore((s) => s.cerrarSesion)

  return usuario ? <button onClick={cerrarSesion}>Salir ({usuario.nombre})</button> : null
}
```

## 15.4 Persistencia Automática con Zustand

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePreferenciasStore = create<{ tema: 'claro' | 'oscuro'; alternarTema: () => void }>()(
  persist(
    (set, get) => ({
      tema: 'claro',
      alternarTema: () => set({ tema: get().tema === 'claro' ? 'oscuro' : 'claro' })
    }),
    { name: 'preferencias-usuario' } // Clave usada en localStorage
  )
)
```

## 15.5 Redux Toolkit — El Estándar en Equipos Grandes

Redux Toolkit (RTK) es la forma moderna y recomendada de usar Redux — reduce drásticamente el código repetitivo del Redux clásico y viene con TypeScript integrado desde el diseño.

```bash
npm install @reduxjs/toolkit react-redux
```

```typescript
// store/contadorSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ContadorState { cuenta: number }
const estadoInicial: ContadorState = { cuenta: 0 }

const contadorSlice = createSlice({
  name: 'contador',
  initialState: estadoInicial,
  reducers: {
    incrementar: (estado) => {
      estado.cuenta += 1 // Immer (integrado en RTK) permite "mutar" de forma segura aquí
    },
    incrementarEn: (estado, accion: PayloadAction<number>) => {
      estado.cuenta += accion.payload
    }
  }
})

export const { incrementar, incrementarEn } = contadorSlice.actions
export default contadorSlice.reducer
```

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import contadorReducer from './contadorSlice'

export const store = configureStore({
  reducer: { contador: contadorReducer }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

```tsx
// main.tsx
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

```tsx
// Contador.tsx
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { incrementar } from './store/contadorSlice'

function Contador() {
  const cuenta = useSelector((estado: RootState) => estado.contador.cuenta)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div>
      <p>{cuenta}</p>
      <button onClick={() => dispatch(incrementar())}>+1</button>
    </div>
  )
}
```

> **Curiosidad importante:** dentro de un `reducer` de RTK, escribir `estado.cuenta += 1` **parece** mutar el estado directamente, pero internamente RTK usa la librería Immer para convertir esa "mutación" en una actualización inmutable segura — es la única excepción a la regla de inmutabilidad estricta vista en `useReducer` (Módulo 12).

## 15.6 Zustand vs Redux Toolkit vs Context

| Criterio | Context API | Zustand | Redux Toolkit |
| :--- | :--- | :--- | :--- |
| Curva de aprendizaje | Baja (nativo de React) | Baja | Media-alta |
| Boilerplate | Mínimo | Mínimo | Moderado (mitigado por RTK) |
| Rendimiento con estado que cambia mucho | Regular (re-renderiza todo el árbol consumidor) | Bueno (selectores granulares) | Bueno (selectores granulares) |
| DevTools dedicadas | No | Sí (opcional) | Sí (Redux DevTools, muy maduras) |
| Ideal para | Estado simple, poco cambiante (tema, idioma) | La mayoría de proyectos de tamaño pequeño a mediano | Equipos grandes, lógica de estado compleja y muy testeada |

## 15.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Estado global simple sin mucho código repetitivo | Zustand |
| Persistencia automática del estado global | `persist` middleware de Zustand |
| Un estándar robusto con DevTools maduras para un equipo grande | Redux Toolkit |
| Solo leer una parte específica del store sin re-renders extra | Un *selector* (`useStore((s) => s.parte)`) |

## 15.8 Errores Comunes

* **Seleccionar el store completo en lugar de una porción específica**: anula la ventaja principal de Zustand/Redux frente a Context — provoca re-renders en cada cambio del store, sin importar qué cambió.
* **Mutar el estado directamente en un store de Zustand** (sin usar `set`): a diferencia de RTK (que usa Immer internamente), Zustand por defecto espera un patrón inmutable estricto igual al de `useState`.
* **Usar Redux Toolkit para un proyecto pequeño "porque es lo profesional"**: agrega complejidad innecesaria si Zustand o incluso Context ya cubren la necesidad real del proyecto.
