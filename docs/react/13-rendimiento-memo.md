# Módulo 13: `useMemo`, `useCallback` y `React.memo`

React vuelve a ejecutar la función completa de un componente en cada render, y por defecto, todos sus componentes hijos también se re-renderizan si el padre lo hace. Este módulo cubre las tres herramientas principales para evitar trabajo innecesario cuando ese comportamiento por defecto se vuelve costoso.

## 13.1 Por Qué un Componente se Re-renderiza

Un componente se re-renderiza cuando: su propio estado cambia, su componente padre se re-renderiza (por defecto, incluso si las props no cambiaron), o el contexto que consume cambia. Entender esto es la base para saber cuándo estas herramientas realmente ayudan.

## 13.2 `useMemo` — Memorizar un Valor Calculado

`useMemo` cachea el **resultado** de un cálculo costoso, y solo lo vuelve a calcular si sus dependencias cambian — el equivalente directo a `computed()` en Vue.

```tsx
import { useMemo } from 'react'

function ListaFiltrada({ productos, termino }: { productos: Producto[]; termino: string }) {
  const productosFiltrados = useMemo(() => {
    console.log('Filtrando productos...') // Solo se ejecuta cuando cambia "productos" o "termino"
    return productos.filter((p) => p.nombre.toLowerCase().includes(termino.toLowerCase()))
  }, [productos, termino])

  return (
    <ul>
      {productosFiltrados.map((p) => (
        <li key={p.id}>{p.nombre}</li>
      ))}
    </ul>
  )
}
```

Sin `useMemo`, el filtrado se recalcularía en **cada** render del componente, sin importar la causa — incluso si ni `productos` ni `termino` cambiaron.

## 13.3 `useCallback` — Memorizar una Función

En JavaScript, una función declarada dentro de un componente es un **valor nuevo** en cada render, incluso si su código es idéntico. Esto importa cuando esa función se pasa como prop a un componente hijo optimizado con `React.memo` (13.4) — la nueva referencia haría que el hijo se re-renderice de todas formas, anulando la optimización.

```tsx
import { useCallback, useState } from 'react'

function App() {
  const [contador, setContador] = useState(0)

  const manejarClic = useCallback(() => {
    console.log('Clic registrado')
  }, []) // Sin dependencias: la misma función en cada render

  return (
    <div>
      <p>{contador}</p>
      <button onClick={() => setContador((c) => c + 1)}>Incrementar</button>
      <BotonHijo onClic={manejarClic} />
    </div>
  )
}
```

Sin `useCallback`, cada vez que `App` se re-renderiza (por ejemplo, al incrementar el contador), `manejarClic` sería una función distinta — y si `BotonHijo` está optimizado con `React.memo`, esa nueva referencia rompería la optimización sin ninguna razón real.

## 13.4 `React.memo` — Evitar Re-render si las Props no Cambiaron

`React.memo` envuelve un componente para que **solo se vuelva a renderizar si sus props realmente cambiaron** (comparación superficial), incluso si su componente padre se re-renderiza.

```tsx
import { memo } from 'react'

interface BotonHijoProps {
  onClic: () => void
}

const BotonHijo = memo(function BotonHijo({ onClic }: BotonHijoProps) {
  console.log('BotonHijo se renderizó')
  return <button onClick={onClic}>Clic</button>
})

export default BotonHijo
```

Con `React.memo`, `BotonHijo` **no** se re-renderiza cuando `App` cambia su propio estado (`contador`), siempre que la prop `onClic` mantenga la misma referencia — de ahí la necesidad de combinarlo con `useCallback` en el padre.

## 13.5 El Trío Trabajando Junto

```tsx
import { useState, useMemo, useCallback, memo } from 'react'

interface Props {
  productos: Producto[]
  onSeleccionar: (id: number) => void
}

const ListaProductos = memo(function ListaProductos({ productos, onSeleccionar }: Props) {
  return (
    <ul>
      {productos.map((p) => (
        <li key={p.id} onClick={() => onSeleccionar(p.id)}>{p.nombre}</li>
      ))}
    </ul>
  )
})

function App({ productosOriginales }: { productosOriginales: Producto[] }) {
  const [termino, setTermino] = useState('')
  const [otroEstado, setOtroEstado] = useState(0) // Cambia por razones ajenas a la lista

  const productosFiltrados = useMemo(
    () => productosOriginales.filter((p) => p.nombre.includes(termino)),
    [productosOriginales, termino]
  )

  const manejarSeleccion = useCallback((id: number) => {
    console.log('Seleccionado:', id)
  }, [])

  return (
    <div>
      <button onClick={() => setOtroEstado((v) => v + 1)}>Estado no relacionado</button>
      <ListaProductos productos={productosFiltrados} onSeleccionar={manejarSeleccion} />
    </div>
  )
}
```

Gracias a `React.memo` + `useMemo` + `useCallback` trabajando juntos, hacer clic en "Estado no relacionado" **no** vuelve a renderizar `ListaProductos` — ni sus props (`productosFiltrados`, `manejarSeleccion`) ni el propio componente cambiaron de forma relevante.

## 13.6 Cuándo NO Usar Estas Herramientas

React ya es muy rápido por defecto para la mayoría de componentes. `useMemo`/`useCallback`/`React.memo` tienen su propio costo (memoria para guardar el valor anterior, comparación en cada render) — usarlos sin necesidad puede incluso ser más lento que no usarlos.

```tsx
// ❌ Innecesario: memorizar un cálculo trivial
const doble = useMemo(() => contador * 2, [contador])

// ✅ Suficiente para cálculos simples y baratos
const doble = contador * 2
```

## 13.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Cachear el resultado de un cálculo costoso | `useMemo(() => calculo, [dependencias])` |
| Mantener la misma referencia de una función entre renders | `useCallback(funcion, [dependencias])` |
| Evitar que un componente se re-renderice si sus props no cambiaron | `React.memo(Componente)` |
| Medir si una optimización realmente ayuda | React DevTools → pestaña "Profiler" |

## 13.8 Errores Comunes

* **Envolver todo en `useMemo`/`useCallback` "por si acaso"**: agrega complejidad y overhead sin beneficio medible en cálculos triviales — optimiza solo donde el Profiler de React DevTools confirma un cuello de botella real.
* **Usar `React.memo` sin `useCallback` en las props de función que se le pasan**: el componente memorizado se sigue re-renderizando igual, porque la función recibida es una referencia nueva en cada render del padre.
* **Olvidar dependencias en `useMemo`/`useCallback`**: produce el mismo tipo de bug que en `useEffect` (Módulo 7) — un valor "atrapado" desactualizado del closure original.
