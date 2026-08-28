# Módulo 12: `useReducer` y Estado Complejo

Cuando el estado de un componente involucra varias transiciones relacionadas (agregar, editar, eliminar, filtrar) y varios `useState` empiezan a actualizarse en conjunto de forma coordinada, `useReducer` ofrece una forma más estructurada y predecible de manejar esa lógica — el mismo patrón central de Redux, pero incorporado nativamente en React.

## 12.1 El Problema con Muchos `useState` Relacionados

```tsx
// Cuatro estados que deben mantenerse sincronizados manualmente entre sí
const [tareas, setTareas] = useState<Tarea[]>([])
const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'completadas'>('todas')
const [cargando, setCargando] = useState(false)
const [error, setError] = useState<string | null>(null)
```

A medida que las transiciones se vuelven más complejas (cargar y luego filtrar, agregar y luego limpiar el error), coordinar varios `setEstado` en el lugar correcto se vuelve propenso a errores.

## 12.2 Anatomía de `useReducer`

```tsx
import { useReducer } from 'react'

interface Estado { cuenta: number }
type Accion = { type: 'incrementar' } | { type: 'decrementar' } | { type: 'reiniciar' }

function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.type) {
    case 'incrementar':
      return { cuenta: estado.cuenta + 1 }
    case 'decrementar':
      return { cuenta: estado.cuenta - 1 }
    case 'reiniciar':
      return { cuenta: 0 }
  }
}

function Contador() {
  const [estado, dispatch] = useReducer(reducer, { cuenta: 0 })

  return (
    <div>
      <p>{estado.cuenta}</p>
      <button onClick={() => dispatch({ type: 'incrementar' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrementar' })}>-</button>
      <button onClick={() => dispatch({ type: 'reiniciar' })}>Reiniciar</button>
    </div>
  )
}
```

* `reducer` es una función **pura**: recibe el estado actual y una acción, y devuelve el **nuevo** estado — nunca muta el estado recibido.
* `dispatch` es la función que se llama para "despachar" una acción; React ejecuta el reducer internamente y actualiza el estado.
* El `switch` sobre `accion.type` con un `type` literal por cada acción le da a TypeScript suficiente información para inferir y validar cada rama automáticamente.

## 12.3 Estado Complejo: Lista de Tareas

```tsx
interface Tarea { id: number; texto: string; completada: boolean }
interface Estado { tareas: Tarea[]; filtro: 'todas' | 'pendientes' | 'completadas' }

type Accion =
  | { type: 'agregar'; texto: string }
  | { type: 'alternar'; id: number }
  | { type: 'eliminar'; id: number }
  | { type: 'establecer_filtro'; filtro: Estado['filtro'] }

function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.type) {
    case 'agregar':
      return {
        ...estado,
        tareas: [...estado.tareas, { id: Date.now(), texto: accion.texto, completada: false }]
      }
    case 'alternar':
      return {
        ...estado,
        tareas: estado.tareas.map((t) =>
          t.id === accion.id ? { ...t, completada: !t.completada } : t
        )
      }
    case 'eliminar':
      return { ...estado, tareas: estado.tareas.filter((t) => t.id !== accion.id) }
    case 'establecer_filtro':
      return { ...estado, filtro: accion.filtro }
  }
}

function ListaTareas() {
  const [estado, dispatch] = useReducer(reducer, { tareas: [], filtro: 'todas' })

  return (
    <div>
      <button onClick={() => dispatch({ type: 'agregar', texto: 'Nueva tarea' })}>
        Agregar
      </button>
      {/* ...renderizado de la lista según estado.filtro */}
    </div>
  )
}
```

Cada tipo de cambio queda descrito de forma explícita como una acción con nombre — mucho más fácil de rastrear (y de depurar con las DevTools) que varias llamadas dispersas a distintos `setEstado`.

## 12.4 `useReducer` + Context — Un Mini-Redux Propio

Combinar `useReducer` con Context (Módulo 9) da una API de estado global ligera, sin necesitar una librería externa — el mismo patrón que "provide + composable" en Vue.

```tsx
// contexts/TareasContext.tsx
import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react'

const TareasContext = createContext<Estado | null>(null)
const TareasDispatchContext = createContext<Dispatch<Accion> | null>(null)

export function TareasProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, { tareas: [], filtro: 'todas' })

  return (
    <TareasContext.Provider value={estado}>
      <TareasDispatchContext.Provider value={dispatch}>
        {children}
      </TareasDispatchContext.Provider>
    </TareasContext.Provider>
  )
}

export function useTareas() {
  const contexto = useContext(TareasContext)
  if (!contexto) throw new Error('useTareas() debe usarse dentro de TareasProvider')
  return contexto
}

export function useTareasDispatch() {
  const contexto = useContext(TareasDispatchContext)
  if (!contexto) throw new Error('useTareasDispatch() debe usarse dentro de TareasProvider')
  return contexto
}
```

Separar el estado y el `dispatch` en dos contextos distintos evita que los componentes que solo despachan acciones (pero no leen el estado) se re-rendericen cuando el estado cambia.

## 12.5 `useState` vs `useReducer` — Cuándo Usar Cada Uno

| Situación | Recomendación |
| :--- | :--- |
| Un valor simple e independiente (texto, booleano, número) | `useState` |
| Varios valores relacionados que cambian juntos con lógica simple | `useState` con un objeto, o varios `useState` |
| Muchas transiciones de estado distintas y relacionadas entre sí | `useReducer` |
| Necesitas historial/depuración clara de qué acción causó qué cambio | `useReducer` |
| El siguiente estado depende de una lógica condicional compleja sobre el estado anterior | `useReducer` |

## 12.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Definir las transiciones de estado posibles | Un `type Accion` con variantes discriminadas por `type` |
| Calcular el nuevo estado a partir de una acción | Una función `reducer(estado, accion)` pura |
| Disparar un cambio de estado | `dispatch({ type: '...', ...datos })` |
| Compartir el estado del reducer globalmente | `useReducer` + Context (Módulo 9) |

## 12.7 Errores Comunes

* **Mutar el estado dentro del reducer**: como con `useState`, el reducer debe devolver un objeto **nuevo** (`{ ...estado, ... }`), nunca modificar `estado` directamente.
* **Poner lógica asíncrona dentro del reducer**: un reducer debe ser una función pura y síncrona; las peticiones a APIs se manejan fuera (en `useEffect` o un hook de mutación) y solo se despachan acciones con el resultado.
* **Usar `useReducer` para estado simple e independiente**: agrega complejidad innecesaria cuando un `useState` normal resolvería el mismo caso con menos código.
