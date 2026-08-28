# Módulo 3: Props y Tipado con TypeScript

Las *props* (propiedades) son la forma en que un componente padre pasa datos a un componente hijo — en React, siempre fluyen en una sola dirección: de arriba hacia abajo. Este módulo cubre cómo recibirlas, tiparlas correctamente y los patrones más comunes.

## 3.1 Recibir Props con una Interfaz

```tsx
interface TarjetaProps {
  titulo: string
  descripcion: string
}

function Tarjeta({ titulo, descripcion }: TarjetaProps) {
  return (
    <div className="tarjeta">
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
    </div>
  )
}
```

**Uso desde el padre:**

```tsx
function App() {
  return <Tarjeta titulo="Bienvenida" descripcion="Contenido de ejemplo" />
}
```

La desestructuración (`{ titulo, descripcion }`) directamente en los parámetros de la función es el patrón estándar en React — evita escribir `props.titulo` repetidamente.

## 3.2 Props Opcionales y Valores por Defecto

```tsx
interface BotonProps {
  texto: string
  variante?: 'primario' | 'secundario' // El '?' la hace opcional
}

function Boton({ texto, variante = 'primario' }: BotonProps) {
  return <button className={`btn btn-${variante}`}>{texto}</button>
}
```

El valor por defecto se asigna directamente en la desestructuración de los parámetros — no existe un equivalente a `withDefaults` de Vue, es JavaScript estándar.

## 3.3 Tipar la Prop `children`

`children` es una prop especial: representa todo lo que se coloca entre las etiquetas de apertura y cierre de un componente.

```tsx
import type { ReactNode } from 'react'

interface ContenedorProps {
  children: ReactNode
}

function Contenedor({ children }: ContenedorProps) {
  return <div className="contenedor">{children}</div>
}
```

```tsx
<Contenedor>
  <h2>Título</h2>
  <p>Cualquier contenido puede ir aquí.</p>
</Contenedor>
```

`ReactNode` es el tipo más amplio y correcto para `children` — acepta elementos JSX, strings, números, arrays de nodos, o `null`.

## 3.4 Props de Función (Callbacks)

Un componente hijo notifica al padre pasándole una función como prop, que el hijo invoca cuando ocurre algo — el equivalente directo a `emit` en Vue.

```tsx
interface BotonContadorProps {
  onIncrementar: (cantidad: number) => void
}

function BotonContador({ onIncrementar }: BotonContadorProps) {
  return <button onClick={() => onIncrementar(1)}>+1</button>
}
```

```tsx
function App() {
  function manejarIncremento(cantidad: number) {
    console.log('Se incrementó en:', cantidad)
  }

  return <BotonContador onIncrementar={manejarIncremento} />
}
```

## 3.5 Tipar Props de Objetos y Arrays

```tsx
interface Usuario {
  id: number
  nombre: string
  activo: boolean
}

interface ListaUsuariosProps {
  usuarios: Usuario[]
}

function ListaUsuarios({ usuarios }: ListaUsuariosProps) {
  return (
    <ul>
      {usuarios.map((usuario) => (
        <li key={usuario.id}>{usuario.nombre}</li>
      ))}
    </ul>
  )
}
```

> El uso de `key` en listas se cubre a fondo en el Módulo 6 — es obligatorio y TypeScript no lo exige, pero React sí lo requiere en tiempo de ejecución (con un warning en consola si falta).

## 3.6 Props de Solo Lectura

Al igual que en Vue, las props en React nunca deben mutarse directamente desde el hijo — a diferencia de Vue, TypeScript no marca un error en tiempo de compilación por reasignar una prop simple, pero **sí** es un error de diseño que rompe el flujo de datos unidireccional de React.

```tsx
function Contador({ valorInicial }: { valorInicial: number }) {
  // ❌ Mala práctica: reasignar directamente el parámetro de la prop
  // valorInicial++

  // ✅ Si necesitas una versión editable, usa estado local (Módulo 4)
}
```

## 3.7 Extender Props de un Elemento HTML Nativo

Un patrón muy común al crear componentes envoltorio (como un `Boton` reutilizable): heredar todos los atributos válidos de un `<button>` nativo, además de las props propias.

```tsx
import type { ButtonHTMLAttributes } from 'react'

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario'
}

function Boton({ variante = 'primario', className, ...resto }: BotonProps) {
  return <button className={`btn btn-${variante} ${className ?? ''}`} {...resto} />
}
```

```tsx
<Boton variante="secundario" onClick={() => alert('Clic')} disabled>
  Enviar
</Boton>
```

`{...resto}` reenvía automáticamente cualquier atributo nativo (`onClick`, `disabled`, `type`, `aria-*`) que el padre pase, sin tener que declararlo uno por uno.

## 3.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Definir la forma de las props | `interface Props { ... }` + `function Componente({ ... }: Props)` |
| Una prop opcional con valor por defecto | `prop?: Tipo` + valor por defecto en la desestructuración |
| Aceptar contenido anidado (children) | `children: ReactNode` |
| Comunicar eventos del hijo al padre | Una prop de tipo función (`onAlgo: (valor) => void`) |
| Heredar atributos de un elemento HTML nativo | `extends ButtonHTMLAttributes<HTMLButtonElement>` (o el elemento correspondiente) |

## 3.9 Errores Comunes

* **Olvidar tipar `children` como `ReactNode`**: usar `children: JSX.Element` es más restrictivo de lo necesario y falla si el padre pasa texto plano o varios elementos.
* **Mutar una prop directamente**: rompe el principio de flujo de datos unidireccional; usa estado local (Módulo 4) si necesitas una versión editable.
* **No usar el *spread* de atributos (`{...resto}`) en componentes envoltorio**: obliga a declarar manualmente cada atributo HTML que el componente debería soportar de forma nativa.
