# Módulo 11: Consumo de APIs con Hooks

El Módulo 7 mostró `fetch` dentro de `useEffect` de forma manual. Repetir ese patrón de `cargando`/`error`/`datos` en cada componente que pide datos es tedioso — este módulo construye un hook de *fetching* reutilizable y tipado, y cubre patrones de peticiones más avanzados.

## 11.1 El Patrón Manual (Recordatorio del Módulo 7)

```tsx
function ListaProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/productos')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar productos')
        return res.json()
      })
      .then(setProductos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  // ...
}
```

Este patrón (`cargando`, `error`, `datos`) se repite en **todo** componente que consume datos — la razón de ser de un custom hook dedicado.

## 11.2 Custom Hook `useFetch` Genérico y Tipado

```typescript
// hooks/useFetch.ts
import { useState, useEffect } from 'react'

interface EstadoFetch<T> {
  datos: T | null
  cargando: boolean
  error: string | null
}

export function useFetch<T>(url: string): EstadoFetch<T> {
  const [datos, setDatos] = useState<T | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    const controlador = new AbortController()

    setCargando(true)
    setError(null)

    fetch(url, { signal: controlador.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelado) setDatos(json)
      })
      .catch((err) => {
        if (!cancelado && err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
      controlador.abort()
    }
  }, [url])

  return { datos, cargando, error }
}
```

**Uso — mismo resultado, mucho menos código repetido:**

```tsx
interface Producto { id: number; nombre: string; precio: number }

function ListaProductos() {
  const { datos: productos, cargando, error } = useFetch<Producto[]>('/api/productos')

  if (cargando) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <ul>
      {productos?.map((p) => (
        <li key={p.id}>{p.nombre} — {p.precio}</li>
      ))}
    </ul>
  )
}
```

Nótese que el `url` está incluido en el array de dependencias del `useEffect` — si `url` cambia (por ejemplo, un ID de ruta), el hook vuelve a pedir los datos automáticamente.

## 11.3 Petición Disparada por una Acción (No al Montar)

Cuando la petición debe ejecutarse manualmente (al enviar un formulario, al hacer clic en un botón), en lugar de automáticamente al montar, la función de fetch se expone en lugar de ejecutarse dentro de `useEffect`.

```typescript
// hooks/useMutacion.ts
import { useState } from 'react'

export function useMutacion<TEntrada, TSalida>(url: string) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function ejecutar(datos: TEntrada): Promise<TSalida | null> {
    setCargando(true)
    setError(null)

    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })

      if (!respuesta.ok) throw new Error('Error al enviar los datos')

      return await respuesta.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    } finally {
      setCargando(false)
    }
  }

  return { ejecutar, cargando, error }
}
```

```tsx
interface NuevoProducto { nombre: string; precio: number }
interface Producto extends NuevoProducto { id: number }

function FormularioProducto() {
  const { ejecutar, cargando } = useMutacion<NuevoProducto, Producto>('/api/productos')

  async function manejarEnvio(datos: NuevoProducto) {
    const productoCreado = await ejecutar(datos)
    if (productoCreado) console.log('Producto creado:', productoCreado)
  }

  return <button disabled={cargando} onClick={() => manejarEnvio({ nombre: 'Nuevo', precio: 10 })}>Crear</button>
}
```

## 11.4 Encapsular Endpoints Específicos

En proyectos reales, conviene envolver `useFetch` en hooks más específicos por recurso, en lugar de repetir la URL en cada componente.

```typescript
// hooks/useProductos.ts
import { useFetch } from './useFetch'

export function useProductos() {
  return useFetch<Producto[]>('/api/productos')
}

export function useProducto(id: number) {
  return useFetch<Producto>(`/api/productos/${id}`)
}
```

```tsx
function DetalleProducto({ id }: { id: number }) {
  const { datos: producto, cargando } = useProducto(id)

  if (cargando) return <p>Cargando...</p>
  return <h2>{producto?.nombre}</h2>
}
```

## 11.5 Tabla de Referencia Rápida

| Necesitas... | Patrón |
| :--- | :--- |
| Estado estándar de carga/error/datos | Hook `useFetch<T>` genérico |
| Evitar actualizar estado tras desmontar el componente | `AbortController` + variable `cancelado` en la limpieza |
| Re-consultar cuando cambia un parámetro | Incluir ese valor en el array de dependencias del `useEffect` |
| Una petición disparada por una acción del usuario | Un hook que expone una función `ejecutar`, en vez de correr en `useEffect` |
| Reutilizar la misma llamada en varios componentes | Encapsular el endpoint en un hook específico (`useProductos`) |

## 11.6 Errores Comunes

* **No cancelar la petición al desmontar**: sin `AbortController` o la bandera `cancelado`, una respuesta que llega tarde puede intentar actualizar el estado de un componente que ya no existe, generando un warning de React.
* **Olvidar `url` en el array de dependencias**: si la URL depende de una prop o parámetro que cambia, sin esa dependencia el hook nunca vuelve a pedir los datos actualizados.
* **No tipar la respuesta con el genérico** (`useFetch<Producto[]>` en vez de `useFetch`): sin el tipo explícito, `datos` queda como `unknown` o `any`, perdiendo el autocompletado y la seguridad de tipos.
