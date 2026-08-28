# Módulo 10: Custom Hooks

Un *custom hook* es una función de JavaScript que usa uno o más hooks de React (`useState`, `useEffect`, `useRef`...) para encapsular y reutilizar **lógica con estado** entre componentes. Es el equivalente exacto de un composable en Vue, con la misma convención de nombre: siempre empieza con `use`.

## 10.1 La Convención `useNombre`

React exige (no solo por convención, sino porque las reglas de los hooks dependen de ello) que cualquier función que internamente llame a otros hooks empiece con `use`. Así React y las herramientas de análisis estático saben que deben aplicarle las mismas reglas que a los hooks nativos.

```text
src/
└── hooks/
    ├── useContador.ts
    ├── useFetch.ts
    └── useLocalStorage.ts
```

## 10.2 Tu Primer Custom Hook: `useContador`

```typescript
// hooks/useContador.ts
import { useState } from 'react'

export function useContador(valorInicial = 0) {
  const [contador, setContador] = useState(valorInicial)

  function incrementar() {
    setContador((c) => c + 1)
  }

  function decrementar() {
    setContador((c) => c - 1)
  }

  function reiniciar() {
    setContador(valorInicial)
  }

  return { contador, incrementar, decrementar, reiniciar }
}
```

**Uso en cualquier componente:**

```tsx
import { useContador } from '../hooks/useContador'

function Contador() {
  const { contador, incrementar, decrementar, reiniciar } = useContador(10)

  return (
    <div>
      <p>{contador}</p>
      <button onClick={incrementar}>+</button>
      <button onClick={decrementar}>-</button>
      <button onClick={reiniciar}>Reiniciar</button>
    </div>
  )
}
```

Cada componente que llama `useContador()` obtiene su **propio estado independiente** — igual que en Vue, no se comparte entre componentes (para eso está el estado global del Módulo 15).

## 10.3 Custom Hook con `useEffect`: `useMousePosition`

```typescript
// hooks/useMousePosition.ts
import { useState, useEffect } from 'react'

export function useMousePosition() {
  const [posicion, setPosicion] = useState({ x: 0, y: 0 })

  useEffect(() => {
    function actualizar(evento: MouseEvent) {
      setPosicion({ x: evento.clientX, y: evento.clientY })
    }

    window.addEventListener('mousemove', actualizar)
    return () => window.removeEventListener('mousemove', actualizar)
  }, [])

  return posicion
}
```

```tsx
function App() {
  const { x, y } = useMousePosition()
  return <p>Posición del ratón: {x}, {y}</p>
}
```

Cada componente que use este hook registra y limpia su propio listener automáticamente — la lógica de suscripción/limpieza no se repite manualmente en cada uno.

## 10.4 Custom Hook con Persistencia: `useLocalStorage`

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(clave: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    const guardado = localStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : valorInicial
  })

  useEffect(() => {
    localStorage.setItem(clave, JSON.stringify(valor))
  }, [clave, valor])

  return [valor, setValor] as const
}
```

```typescript
const [preferencias, setPreferencias] = useLocalStorage('preferencias-usuario', { tema: 'claro' })
setPreferencias({ tema: 'oscuro' }) // Se guarda automáticamente en localStorage
```

> **`useState(() => ...)`**: pasar una función a `useState` (en lugar del valor directamente) hace que solo se ejecute **una vez**, en el primer render — evita leer `localStorage` innecesariamente en cada render.

## 10.5 Componer Custom Hooks Entre Sí

```typescript
// hooks/useTemaOscuro.ts
import { useLocalStorage } from './useLocalStorage'

export function useTemaOscuro() {
  const [tema, setTema] = useLocalStorage<'claro' | 'oscuro'>('tema', 'claro')

  const esOscuro = tema === 'oscuro'

  function alternar() {
    setTema(tema === 'claro' ? 'oscuro' : 'claro')
  }

  return { tema, esOscuro, alternar }
}
```

## 10.6 Las Reglas de los Hooks

Estas reglas aplican tanto a hooks nativos como a custom hooks, y `eslint-plugin-react-hooks` las verifica automáticamente:

1. **Solo se llaman en el nivel superior**: nunca dentro de un `if`, un `for`, o una función anidada.
2. **Solo se llaman desde componentes de React o desde otros custom hooks**: nunca desde una función JavaScript normal.
3. **El orden de las llamadas debe ser siempre el mismo** entre renders — React usa ese orden internamente para asociar cada `useState`/`useEffect` con su estado correspondiente.

```tsx
// ❌ Viola la regla: hook dentro de una condición
function Componente({ activo }: { activo: boolean }) {
  if (activo) {
    const [valor, setValor] = useState(0) // Error
  }
}

// ✅ El hook siempre se llama; la condición se aplica después
function Componente({ activo }: { activo: boolean }) {
  const [valor, setValor] = useState(0)

  if (!activo) return null
  // usar valor...
}
```

## 10.7 Tabla de Referencia Rápida

| Patrón | Cuándo usarlo |
| :--- | :--- |
| Hook simple con `useState` + funciones | Lógica de estado reutilizable (contador, formulario, toggle) |
| Hook con `useEffect` | Lógica que engancha eventos del navegador, timers o suscripciones |
| Hook con persistencia (`localStorage`) | Sincronizar estado con almacenamiento del navegador |
| Hook que usa otro hook | Construir lógica compleja a partir de piezas simples |

## 10.8 Errores Comunes

* **Llamar un hook condicionalmente**: rompe el orden esperado de hooks internos de React entre renders, causando comportamiento indefinido.
* **No prefijar la función con `use`**: sin ese prefijo, el linter no puede verificar las reglas de los hooks sobre esa función, y su propio uso interno de hooks puede fallar silenciosamente.
* **Devolver directamente el estado sin desestructurar consistentemente**: mantener una convención de retorno clara (objeto con nombres, o tupla con `as const`) hace el hook más fácil de usar y de tipar correctamente.
