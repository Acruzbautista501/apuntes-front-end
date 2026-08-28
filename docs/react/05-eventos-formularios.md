# Módulo 5: Eventos y Formularios Controlados

React normaliza los eventos del navegador en un sistema propio (*SyntheticEvent*) con nombres en camelCase y tipado completo en TypeScript. Este módulo cubre el manejo de eventos y el patrón central de formularios en React: los **componentes controlados**.

## 5.1 Manejo Básico de Eventos

```tsx
function Boton() {
  function manejarClic() {
    console.log('Se hizo clic')
  }

  return <button onClick={manejarClic}>Haz clic</button>
}
```

```tsx
// Con una función en línea, útil para pasar argumentos
<button onClick={() => console.log('Clic con argumento')}>Haz clic</button>
```

> **Importante:** `onClick={manejarClic}` pasa la *referencia* de la función; `onClick={manejarClic()}` la **ejecuta inmediatamente** al renderizar, en lugar de esperar al clic — un error muy común al empezar.

## 5.2 Tipar el Evento

Cada tipo de evento de React tiene su propio tipo de TypeScript, generalmente importado desde `'react'`.

```tsx
import type { MouseEvent } from 'react'

function Boton() {
  function manejarClic(evento: MouseEvent<HTMLButtonElement>) {
    console.log('Elemento clickeado:', evento.currentTarget)
  }

  return <button onClick={manejarClic}>Clic</button>
}
```

| Evento | Tipo de TypeScript |
| :--- | :--- |
| `onClick` en un botón | `MouseEvent<HTMLButtonElement>` |
| `onChange` en un input | `ChangeEvent<HTMLInputElement>` |
| `onSubmit` en un formulario | `FormEvent<HTMLFormElement>` |
| `onKeyDown` | `KeyboardEvent<HTMLElement>` |

## 5.3 Inputs Controlados — El Patrón Central de Formularios

En React, un input "controlado" significa que **el estado de React es la única fuente de verdad**: el valor del input siempre viene de `useState`, y cada tecla dispara `onChange` para actualizar ese estado.

```tsx
import { useState, type ChangeEvent } from 'react'

function CampoNombre() {
  const [nombre, setNombre] = useState('')

  function manejarCambio(evento: ChangeEvent<HTMLInputElement>) {
    setNombre(evento.target.value)
  }

  return (
    <div>
      <input value={nombre} onChange={manejarCambio} />
      <p>Hola, {nombre}</p>
    </div>
  )
}
```

Sin `value={nombre}` el input sería "no controlado" (el navegador gestionaría su propio valor interno); sin `onChange`, React marca un error porque un `value` fijo sin forma de actualizarlo dejaría el campo bloqueado — a diferencia de Vue, donde `v-model` genera ambas partes automáticamente, en React siempre se escriben explícitamente.

## 5.4 Todos los Tipos de Campo

```tsx
function Formulario() {
  const [texto, setTexto] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [genero, setGenero] = useState('')
  const [pais, setPais] = useState('')

  return (
    <form>
      <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} />

      <input
        type="checkbox"
        checked={aceptaTerminos}
        onChange={(e) => setAceptaTerminos(e.target.checked)}
      />

      <input type="radio" value="femenino" checked={genero === 'femenino'} onChange={(e) => setGenero(e.target.value)} />
      <input type="radio" value="masculino" checked={genero === 'masculino'} onChange={(e) => setGenero(e.target.value)} />

      <select value={pais} onChange={(e) => setPais(e.target.value)}>
        <option value="">Selecciona un país</option>
        <option value="mx">México</option>
        <option value="ar">Argentina</option>
      </select>

      <textarea value={texto} onChange={(e) => setTexto(e.target.value)} />
    </form>
  )
}
```

Nótese que un checkbox lee `e.target.checked` (booleano), mientras que el resto de campos leen `e.target.value` (string) — una diferencia importante del DOM nativo que React no oculta.

## 5.5 Envío del Formulario

```tsx
import { useState, type FormEvent } from 'react'

function FormularioLogin() {
  const [correo, setCorreo] = useState('')

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault() // Evita que el navegador recargue la página
    console.log('Enviando:', correo)
  }

  return (
    <form onSubmit={manejarEnvio}>
      <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

`evento.preventDefault()` es el equivalente exacto al modificador `.prevent` de Vue — sin él, el navegador recarga la página completa al enviar el formulario.

## 5.6 Formularios con Múltiples Campos y un Solo Manejador

Para formularios con muchos campos, un patrón común evita escribir un `onChange` distinto para cada uno, usando el atributo `name` del input.

```tsx
interface DatosFormulario {
  nombre: string
  correo: string
}

function Formulario() {
  const [datos, setDatos] = useState<DatosFormulario>({ nombre: '', correo: '' })

  function manejarCambio(evento: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evento.target
    setDatos((anterior) => ({ ...anterior, [name]: value }))
  }

  return (
    <form>
      <input name="nombre" value={datos.nombre} onChange={manejarCambio} />
      <input name="correo" value={datos.correo} onChange={manejarCambio} />
    </form>
  )
}
```

`[name]: value` usa el nombre del campo como clave calculada — el mismo campo `manejarCambio` funciona para cualquier input que tenga un `name` que coincida con una propiedad de `datos`.

## 5.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ejecutar código al hacer clic | `onClick={funcion}` |
| Un input sincronizado con el estado | `value={estado}` + `onChange={(e) => setEstado(e.target.value)}` |
| Un checkbox controlado | `checked={estado}` + `onChange={(e) => setEstado(e.target.checked)}` |
| Evitar que el formulario recargue la página | `evento.preventDefault()` dentro de `onSubmit` |
| Manejar muchos campos con una sola función | `name` del input + `[evento.target.name]: evento.target.value` |

## 5.8 Errores Comunes

* **Ejecutar la función en lugar de pasarla**: `onClick={miFuncion()}` la llama inmediatamente al renderizar; siempre debe ser `onClick={miFuncion}` o `onClick={() => miFuncion(argumento)}`.
* **Olvidar `preventDefault()` en `onSubmit`**: el navegador recarga la página y se pierde todo el estado de la aplicación.
* **Poner `value` sin `onChange`**: React marca el input como de solo lectura y muestra un warning en consola — todo input con `value` necesita su contraparte `onChange` para seguir siendo editable.
