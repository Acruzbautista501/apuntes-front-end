# Módulo 8: `useRef` y Manipulación del DOM

`useState` dispara un re-render cada vez que cambia. Hay casos donde necesitas guardar un valor que **persiste entre renders pero no debe causar un re-render** al cambiar — ya sea una referencia a un elemento del DOM o un valor mutable cualquiera. Para eso existe `useRef`.

## 8.1 Referenciar un Elemento del DOM

```tsx
import { useRef, useEffect } from 'react'

function CampoAutoEnfocado() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} placeholder="Se enfoca automáticamente" />
}
```

`useRef<HTMLInputElement>(null)` crea un objeto con una única propiedad, `.current`, inicializada en `null`. React asigna automáticamente el elemento real del DOM a `.current` cuando el componente se monta — el mismo patrón conceptual que un *template ref* en Vue, pero accediendo siempre con `.current` en lugar de `.value`.

## 8.2 Por Qué `.current` y no un Estado

```tsx
const inputRef = useRef<HTMLInputElement>(null)

// ❌ Cambiar .current NO dispara un re-render — y no debería, es solo una referencia al DOM
inputRef.current = null // (nunca se hace manualmente, React lo gestiona)

// ✅ Leerlo dentro de un evento o efecto, después de que el DOM ya exista
function enfocar() {
  inputRef.current?.focus()
}
```

## 8.3 `useRef` para Valores Mutables sin Re-render

`useRef` no es exclusivo del DOM — también sirve como una "caja" que guarda cualquier valor mutable entre renders sin causar una nueva renderización, útil para contadores internos, IDs de timers, o el valor anterior de una prop.

```tsx
import { useRef, useEffect } from 'react'

function ContadorDeRenders() {
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1
  })

  return <p>Este componente se ha renderizado {renderCount.current} veces</p>
}
```

Si en su lugar se usara `useState` para `renderCount`, cada actualización dispararía un nuevo render, que a su vez actualizaría el contador de nuevo — un bucle infinito. `useRef` evita exactamente ese problema porque cambiar `.current` no provoca ningún re-render.

## 8.4 Guardar el ID de un `setInterval`/`setTimeout`

```tsx
import { useRef, useState } from 'react'

function Cronometro() {
  const [segundos, setSegundos] = useState(0)
  const intervaloRef = useRef<number | null>(null)

  function iniciar() {
    intervaloRef.current = setInterval(() => {
      setSegundos((anterior) => anterior + 1)
    }, 1000)
  }

  function detener() {
    if (intervaloRef.current !== null) {
      clearInterval(intervaloRef.current)
      intervaloRef.current = null
    }
  }

  return (
    <div>
      <p>{segundos}s</p>
      <button onClick={iniciar}>Iniciar</button>
      <button onClick={detener}>Detener</button>
    </div>
  )
}
```

Guardar el ID en un `ref` (en vez de una variable local normal) es necesario porque una variable local se reinicia en cada render — `useRef` es la única forma de que ese valor sobreviva entre renders sin ser parte del estado reactivo.

## 8.5 Medir un Elemento

```tsx
import { useRef, useEffect, useState } from 'react'

function CajaMedida() {
  const cajaRef = useRef<HTMLDivElement>(null)
  const [alto, setAlto] = useState(0)

  useEffect(() => {
    if (cajaRef.current) {
      setAlto(cajaRef.current.offsetHeight)
    }
  }, [])

  return (
    <div ref={cajaRef}>
      <p>Altura medida: {alto}px</p>
    </div>
  )
}
```

## 8.6 `forwardRef` — Pasar un Ref a un Componente Hijo

Por defecto, `ref` no es una prop normal — un componente no puede recibir un ref de su padre a menos que use `forwardRef` para reenviarlo explícitamente al elemento del DOM que corresponda internamente.

```tsx
import { forwardRef } from 'react'

interface CampoTextoProps {
  placeholder?: string
}

const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(({ placeholder }, ref) => {
  return <input ref={ref} placeholder={placeholder} />
})

CampoTexto.displayName = 'CampoTexto'
```

```tsx
function Formulario() {
  const campoRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <CampoTexto ref={campoRef} placeholder="Nombre" />
      <button onClick={() => campoRef.current?.focus()}>Enfocar el campo</button>
    </div>
  )
}
```

> **Nota sobre React 19:** en las versiones más recientes de React, `ref` puede pasarse como una prop normal en componentes de función sin necesitar `forwardRef` — pero como muchos proyectos y librerías siguen usando React 18, entender `forwardRef` sigue siendo necesario para leer y mantener código existente.

## 8.7 `useRef` vs `useState` — Cuándo Usar Cada Uno

| Necesitas... | Usa... |
| :--- | :--- |
| Que la UI se actualice cuando el valor cambia | `useState` |
| Acceder a un elemento real del DOM | `useRef` |
| Guardar un valor mutable que NO debe disparar re-render | `useRef` |
| Guardar el ID de un timer/intervalo entre renders | `useRef` |

## 8.8 Errores Comunes

* **Esperar que cambiar `.current` actualice la UI**: `useRef` nunca dispara un re-render — si necesitas que la interfaz refleje el cambio, ese valor debe vivir en `useState`.
* **Acceder a `ref.current` durante el render (fuera de un evento o `useEffect`)**: en el primer render, antes de que el DOM exista, `.current` todavía es `null`.
* **Usar `useRef` como sustituto general de `useState` "para evitar re-renders"**: si el valor afecta lo que el usuario ve en pantalla, necesita ser estado — `useRef` es solo para datos que el render no necesita reflejar directamente.
