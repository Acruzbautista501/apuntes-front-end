# Módulo 7: `useEffect` y Ciclo de Vida

React no tiene hooks de ciclo de vida separados como `onMounted`/`onUpdated`/`onUnmounted` de Vue. En su lugar, un único hook — `useEffect` — cubre los tres casos, según cómo se configure. Este módulo explica su mecánica y los patrones correctos para evitar los errores más comunes de React.

## 7.1 La Idea Central: Sincronizar con Algo Externo

`useEffect` no es "código que corre después del render" en un sentido genérico — es específicamente para **sincronizar tu componente con un sistema fuera de React**: una API, el DOM directamente, un timer, una suscripción. Pensarlo así evita la mayoría de usos incorrectos.

```tsx
import { useState, useEffect } from 'react'

function TituloDocumento({ contador }: { contador: number }) {
  useEffect(() => {
    document.title = `Contador: ${contador}`
  })

  return <p>{contador}</p>
}
```

## 7.2 El Array de Dependencias

El segundo argumento de `useEffect` controla **cuándo** se vuelve a ejecutar el efecto.

```tsx
useEffect(() => {
  console.log('Se ejecuta en cada render')
})

useEffect(() => {
  console.log('Se ejecuta solo una vez, al montar')
}, [])

useEffect(() => {
  console.log('Se ejecuta al montar y cada vez que "id" cambia')
}, [id])
```

| Array de dependencias | Comportamiento |
| :--- | :--- |
| Sin segundo argumento | Se ejecuta en **cada** render |
| `[]` (array vacío) | Se ejecuta **una sola vez**, al montar (similar a `onMounted`) |
| `[valor1, valor2]` | Se ejecuta al montar y cada vez que `valor1` o `valor2` cambien |

## 7.3 Función de Limpieza (*Cleanup*)

Si el efecto devuelve una función, React la ejecuta **antes** de correr el efecto de nuevo, y también al desmontar el componente — el equivalente a `onUnmounted`.

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => clearInterval(id) // Limpieza: se ejecuta al desmontar o antes de re-ejecutar el efecto
}, [])
```

Sin la función de limpieza, cada vez que el componente se desmonta y vuelve a montarse (o el efecto se re-ejecuta), se acumularían intervalos activos sin ser eliminados — una fuga de recursos.

## 7.4 Ejemplo Real: Escuchar un Evento del Navegador

```tsx
import { useState, useEffect } from 'react'

function AnchoVentana() {
  const [ancho, setAncho] = useState(window.innerWidth)

  useEffect(() => {
    function manejarResize() {
      setAncho(window.innerWidth)
    }

    window.addEventListener('resize', manejarResize)

    return () => window.removeEventListener('resize', manejarResize)
  }, [])

  return <p>Ancho actual: {ancho}px</p>
}
```

## 7.5 Data Fetching con `useEffect`

```tsx
interface Producto { id: number; nombre: string }

function ListaProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false

    async function cargarProductos() {
      const respuesta = await fetch('/api/productos')
      const datos = await respuesta.json()

      if (!cancelado) {
        setProductos(datos)
        setCargando(false)
      }
    }

    cargarProductos()

    return () => {
      cancelado = true // Evita actualizar el estado si el componente se desmontó antes de que termine la petición
    }
  }, [])

  if (cargando) return <p>Cargando...</p>

  return (
    <ul>
      {productos.map((p) => (
        <li key={p.id}>{p.nombre}</li>
      ))}
    </ul>
  )
}
```

> `useEffect` no acepta directamente una función `async` como callback (devolvería una promesa en lugar de una función de limpieza) — por eso la función `async` se declara **dentro** del efecto y se invoca de inmediato.

## 7.6 Reaccionar a Cambios de una Prop o Estado Específico

```tsx
function DetalleProducto({ id }: { id: number }) {
  const [producto, setProducto] = useState<Producto | null>(null)

  useEffect(() => {
    fetch(`/api/productos/${id}`)
      .then((res) => res.json())
      .then(setProducto)
  }, [id]) // Se vuelve a ejecutar cada vez que "id" cambia

  return <p>{producto?.nombre ?? 'Cargando...'}</p>
}
```

## 7.7 Doble Ejecución en Desarrollo con `<StrictMode>`

Con `<StrictMode>` (Módulo 1), React ejecuta cada efecto **dos veces** en desarrollo (monta, desmonta, vuelve a montar) para ayudar a detectar efectos sin una limpieza correcta. Esto es intencional y **no ocurre en producción** — si notas que tu efecto corre "el doble", es una señal para revisar que la función de limpieza esté bien implementada, no un bug de React.

## 7.8 Cuándo NO Necesitas `useEffect`

Un error extremadamente común al llegar de otros frameworks: usar `useEffect` para calcular un valor derivado de props o estado, cuando un cálculo directo durante el render es suficiente y más simple.

```tsx
// ❌ Innecesario: usar un efecto para derivar un valor
const [nombreCompleto, setNombreCompleto] = useState('')

useEffect(() => {
  setNombreCompleto(`${nombre} ${apellido}`)
}, [nombre, apellido])

// ✅ Simplemente calcularlo durante el render
const nombreCompleto = `${nombre} ${apellido}`
```

## 7.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ejecutar código una sola vez al montar | `useEffect(() => {...}, [])` |
| Reaccionar cuando cambia un valor específico | `useEffect(() => {...}, [valor])` |
| Liberar recursos (listeners, timers, suscripciones) | Devolver una función de limpieza dentro del efecto |
| Pedir datos a una API al montar el componente | `useEffect` con una función `async` interna + `[]` |
| Calcular un valor a partir de props/estado existente | Cálculo directo durante el render — **no** un efecto |

## 7.10 Errores Comunes

* **Olvidar el array de dependencias por completo**: el efecto se ejecuta en cada render, lo que puede causar bucles infinitos si el efecto también actualiza estado.
* **Omitir una dependencia usada dentro del efecto**: causa bugs donde el efecto sigue usando un valor "viejo" capturado en el closure — el linter de React (`eslint-plugin-react-hooks`) detecta esto automáticamente y debe respetarse.
* **No limpiar suscripciones/timers/listeners**: provoca fugas de memoria y comportamiento duplicado a medida que el componente se monta y desmonta repetidamente.
