# Módulo 22: Accesibilidad en React

JSX facilita construir interfaces dinámicas rápidamente, pero eso mismo hace fácil olvidar detalles de accesibilidad que el HTML estático maneja mejor por defecto. Este módulo cubre los patrones más importantes para aplicaciones React accesibles.

## 22.1 El Problema del Foco al Navegar

En una SPA, cambiar de vista con React Router (Módulo 14) no recarga la página — el foco se queda en el elemento que se clickeó para navegar, y el cambio de contenido puede pasar desapercibido para quien usa un lector de pantalla.

```tsx
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const encabezadoRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    encabezadoRef.current?.focus()
  }, [location.pathname])

  return (
    <main>
      <h1 ref={encabezadoRef} tabIndex={-1}>{tituloDeLaVistaActual}</h1>
      {children}
    </main>
  )
}
```

`tabIndex={-1}` hace el elemento enfocable programáticamente (con `.focus()`) sin agregarlo al orden de tabulación normal del teclado — el mismo patrón visto en el Módulo 21 de la sección Vue.

## 22.2 Anunciar Cambios Dinámicos con `aria-live`

```tsx
import { useState } from 'react'

function FormularioGuardado() {
  const [mensajeEstado, setMensajeEstado] = useState('')

  async function guardar() {
    setMensajeEstado('Guardando...')
    await guardarDatos()
    setMensajeEstado('Cambios guardados correctamente')
  }

  return (
    <div>
      <button onClick={guardar}>Guardar</button>
      <p aria-live="polite" className="visualmente-oculto">{mensajeEstado}</p>
    </div>
  )
}
```

`aria-live="polite"` hace que un lector de pantalla anuncie el nuevo contenido en una pausa natural; `"assertive"` interrumpe de inmediato — resérvalo para errores críticos.

## 22.3 Atrapar el Foco en un Modal

```tsx
import { useRef, useEffect } from 'react'

function useFocusTrap(abierto: boolean) {
  const contenedorRef = useRef<HTMLDivElement>(null)
  const elementoPrevioRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (abierto) {
      elementoPrevioRef.current = document.activeElement as HTMLElement
      contenedorRef.current?.querySelector<HTMLElement>('button, input, a')?.focus()
    } else {
      elementoPrevioRef.current?.focus()
    }
  }, [abierto])

  function manejarTab(evento: React.KeyboardEvent) {
    if (evento.key !== 'Tab' || !contenedorRef.current) return

    const elementosEnfocables = contenedorRef.current.querySelectorAll<HTMLElement>('button, input, a, [tabindex]')
    const primero = elementosEnfocables[0]
    const ultimo = elementosEnfocables[elementosEnfocables.length - 1]

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault()
      ultimo.focus()
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault()
      primero.focus()
    }
  }

  return { contenedorRef, manejarTab }
}
```

```tsx
function Modal({ abierto, children }: { abierto: boolean; children: React.ReactNode }) {
  const { contenedorRef, manejarTab } = useFocusTrap(abierto)

  if (!abierto) return null

  return (
    <div ref={contenedorRef} role="dialog" aria-modal="true" onKeyDown={manejarTab}>
      {children}
    </div>
  )
}
```

Encapsular esta lógica en un custom hook (`useFocusTrap`, Módulo 10) permite reutilizarla en cualquier modal del proyecto sin repetir el código.

> En proyectos reales, una librería probada como `focus-trap-react` suele ser preferible a reimplementar esta lógica — pero entenderla ayuda a diagnosticar bugs de accesibilidad en cualquier librería que se use.

## 22.4 Formularios Accesibles

```tsx
function CampoCorreo({ valor, onCambio, error }: { valor: string; onCambio: (v: string) => void; error?: string }) {
  return (
    <div>
      <label htmlFor="campo-correo">Correo electrónico</label>
      <input
        id="campo-correo"
        type="email"
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? 'error-correo' : undefined}
      />
      {error && <p id="error-correo" role="alert">{error}</p>}
    </div>
  )
}
```

`aria-invalid` y `aria-describedby` conectan el campo con su mensaje de error para que un lector de pantalla lo anuncie al enfocar el campo, no solo visualmente con una clase CSS roja.

## 22.5 Elementos Interactivos Personalizados

Cuando un `<div>` o `<span>` debe comportarse como un botón (por razones de estilo), necesita los atributos ARIA y el manejo de teclado que un `<button>` nativo trae gratis — casi siempre es preferible usar el elemento nativo y aplicarle estilos, en lugar de reconstruir su comportamiento manualmente.

```tsx
// ❌ Un div "clickeable" sin soporte de teclado ni semántica
<div onClick={manejarClic}>Enviar</div>

// ✅ Un botón nativo, estilizado libremente con CSS
<button onClick={manejarClic} className="boton-personalizado">Enviar</button>

// Si realmente necesitas un elemento no nativo interactivo:
<div
  role="button"
  tabIndex={0}
  onClick={manejarClic}
  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && manejarClic()}
>
  Enviar
</div>
```

## 22.6 `eslint-plugin-jsx-a11y`

```bash
npm install -D eslint-plugin-jsx-a11y
```

Este plugin de ESLint detecta automáticamente problemas comunes de accesibilidad durante el desarrollo: `<img>` sin `alt`, botones sin texto accesible, manejadores de clic sin el rol o el soporte de teclado correspondiente — es la forma más efectiva de prevenir estos problemas antes de que lleguen a producción.

## 22.7 Tabla de Referencia Rápida

| Problema de accesibilidad | Solución en React |
| :--- | :--- |
| El foco no se mueve al navegar entre vistas | `useEffect` sobre `location.pathname` + `.focus()` en el encabezado principal |
| Contenido dinámico no anunciado | `aria-live="polite"` (o `"assertive"` para errores críticos) |
| El foco escapa de un modal abierto | Custom hook de *focus trap*, o una librería dedicada |
| Errores de validación solo visibles por color | `aria-invalid` + `aria-describedby` |
| Detectar problemas de accesibilidad durante el desarrollo | `eslint-plugin-jsx-a11y` |

## 22.8 Errores Comunes

* **Usar `<div onClick>` en lugar de `<button>`**: pierde el soporte de teclado, el rol semántico y el estado de foco visible que un botón nativo trae por defecto.
* **Olvidar `alt` en las imágenes**: sin él, un lector de pantalla no tiene forma de describir la imagen al usuario.
* **No probar la navegación completa solo con teclado (`Tab`, `Enter`, `Escape`)**: la forma más rápida y efectiva de detectar la mayoría de problemas de accesibilidad antes de cualquier herramienta automatizada.
