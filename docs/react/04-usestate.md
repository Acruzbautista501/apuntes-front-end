# Módulo 4: Estado con `useState`

Las props (Módulo 3) representan datos que vienen de fuera del componente y no cambian por sí mismos. El **estado** es distinto: datos internos de un componente que, al cambiar, provocan que React vuelva a renderizarlo. `useState` es el *hook* más fundamental de React para manejar estado local.

## 4.1 Tu Primer Estado

```tsx
import { useState } from 'react'

function Contador() {
  const [cuenta, setCuenta] = useState(0)

  return (
    <div>
      <p>Cuenta: {cuenta}</p>
      <button onClick={() => setCuenta(cuenta + 1)}>Incrementar</button>
    </div>
  )
}
```

`useState(0)` devuelve un array de dos elementos: el **valor actual** (`cuenta`) y una **función para actualizarlo** (`setCuenta`). Este patrón de desestructuración de array (`const [x, setX] = ...`) es la convención universal en React.

## 4.2 Por Qué el Estado es Inmutable

A diferencia de `reactive()` en Vue, React **nunca** detecta mutaciones directas de un objeto o array — siempre espera que le pases un **valor nuevo** a través del *setter*.

```tsx
const [usuario, setUsuario] = useState({ nombre: 'Alex', edad: 28 })

// ❌ Mutar directamente NO dispara un re-render
usuario.edad = 29

// ✅ Crear un objeto nuevo con el cambio aplicado
setUsuario({ ...usuario, edad: 29 })
```

React compara la referencia anterior con la nueva; si mutas el objeto original, la referencia no cambia y React asume que nada cambió.

## 4.3 Tipar `useState` Explícitamente

Para valores primitivos, TypeScript infiere el tipo automáticamente a partir del valor inicial. Para casos donde el valor inicial no representa todos los estados posibles (como `null` antes de cargar datos), se necesita un genérico explícito.

```tsx
const [contador, setContador] = useState(0)              // number, inferido automáticamente
const [nombre, setNombre] = useState('')                  // string, inferido automáticamente
const [usuario, setUsuario] = useState<Usuario | null>(null) // Necesita el genérico explícito
```

```tsx
interface Usuario { id: number; nombre: string }

const [usuario, setUsuario] = useState<Usuario | null>(null)

// Más adelante:
setUsuario({ id: 1, nombre: 'Alex' })
```

## 4.4 Actualizar Estado Basado en el Valor Anterior

Cuando el nuevo valor depende del valor actual, es más seguro pasar una **función** al *setter* en lugar del valor directamente — evita bugs sutiles cuando varias actualizaciones ocurren en sucesión rápida.

```tsx
function Contador() {
  const [cuenta, setCuenta] = useState(0)

  function incrementarDosVeces() {
    // ❌ Ambas llamadas usan el mismo valor de "cuenta" capturado en este render
    setCuenta(cuenta + 1)
    setCuenta(cuenta + 1) // El resultado final es +1, no +2

    // ✅ Cada llamada recibe el valor más reciente garantizado
    setCuenta((valorAnterior) => valorAnterior + 1)
    setCuenta((valorAnterior) => valorAnterior + 1) // El resultado final sí es +2
  }

  return <button onClick={incrementarDosVeces}>+2</button>
}
```

## 4.5 Estado de Objetos

```tsx
interface Formulario {
  nombre: string
  correo: string
}

function FormularioContacto() {
  const [formulario, setFormulario] = useState<Formulario>({ nombre: '', correo: '' })

  function actualizarCampo(campo: keyof Formulario, valor: string) {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }))
  }

  return (
    <form>
      <input value={formulario.nombre} onChange={(e) => actualizarCampo('nombre', e.target.value)} />
      <input value={formulario.correo} onChange={(e) => actualizarCampo('correo', e.target.value)} />
    </form>
  )
}
```

`{ ...anterior, [campo]: valor }` crea un objeto nuevo copiando todas las propiedades existentes y sobrescribiendo solo la que cambió.

## 4.6 Estado de Arrays

```tsx
interface Tarea { id: number; texto: string; completada: boolean }

function ListaTareas() {
  const [tareas, setTareas] = useState<Tarea[]>([])

  function agregarTarea(texto: string) {
    setTareas((anteriores) => [...anteriores, { id: Date.now(), texto, completada: false }])
  }

  function eliminarTarea(id: number) {
    setTareas((anteriores) => anteriores.filter((t) => t.id !== id))
  }

  function alternarTarea(id: number) {
    setTareas((anteriores) =>
      anteriores.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t))
    )
  }

  return (
    <ul>
      {tareas.map((tarea) => (
        <li key={tarea.id}>
          <input type="checkbox" checked={tarea.completada} onChange={() => alternarTarea(tarea.id)} />
          {tarea.texto}
          <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  )
}
```

Nótese el patrón consistente: **nunca** `push`, `splice` ni mutación directa — siempre `[...array, nuevo]`, `filter`, o `map` para producir un array nuevo.

## 4.7 Múltiples Estados vs. Un Solo Objeto de Estado

| Situación | Recomendación |
| :--- | :--- |
| Valores que cambian de forma independiente entre sí (nombre, edad, si el modal está abierto) | Un `useState` por cada valor |
| Valores que siempre cambian juntos y forman una unidad lógica (los campos de un formulario) | Un solo `useState` con un objeto |

## 4.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un estado simple con tipo inferido | `useState(valorInicial)` |
| Un estado que puede empezar en `null` | `useState<Tipo \| null>(null)` |
| Actualizar basado en el valor anterior | `setEstado((anterior) => nuevoValor)` |
| Actualizar una propiedad de un objeto | `setEstado((anterior) => ({ ...anterior, propiedad: nuevoValor }))` |
| Agregar/quitar un elemento de un array | `setEstado((anteriores) => [...anteriores, nuevo])` / `.filter(...)` |

## 4.9 Errores Comunes

* **Mutar el estado directamente** (`array.push(...)`, `objeto.propiedad = x`): no dispara un re-render porque la referencia no cambió; React nunca lo detecta.
* **Usar el valor de estado "capturado" en lugar de la función actualizadora** cuando se hacen varias actualizaciones seguidas: produce resultados incorrectos por el *closure* del valor anterior (ver 4.4).
* **Crear demasiados `useState` fragmentados** para datos que siempre cambian juntos: dificulta mantener la consistencia; considera agruparlos en un objeto o migrar a `useReducer` (Módulo 12) si la lógica de actualización se vuelve compleja.
