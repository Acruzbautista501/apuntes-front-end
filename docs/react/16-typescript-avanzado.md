# Módulo 16: TypeScript Avanzado en React

Los módulos anteriores usaron TypeScript de forma directa: interfaces simples de props, tipado básico de eventos. Este módulo cubre patrones más exigentes, necesarios en librerías de componentes y aplicaciones grandes.

## 16.1 Componentes Genéricos

Un componente puede tener su propio parámetro de tipo genérico, esencial para componentes reutilizables como listas o selects que deben adaptarse al tipo de dato que reciben.

```tsx
interface SelectorProps<T> {
  opciones: T[]
  etiqueta: (item: T) => string
  valor: T | null
  onCambio: (valor: T) => void
}

function Selector<T>({ opciones, etiqueta, valor, onCambio }: SelectorProps<T>) {
  return (
    <select
      value={valor ? etiqueta(valor) : ''}
      onChange={(e) => {
        const seleccionado = opciones.find((o) => etiqueta(o) === e.target.value)
        if (seleccionado) onCambio(seleccionado)
      }}
    >
      {opciones.map((opcion) => (
        <option key={etiqueta(opcion)} value={etiqueta(opcion)}>
          {etiqueta(opcion)}
        </option>
      ))}
    </select>
  )
}
```

```tsx
interface Producto { id: number; nombre: string }
const productos: Producto[] = [{ id: 1, nombre: 'Teclado' }, { id: 2, nombre: 'Mouse' }]

// TypeScript infiere T = Producto automáticamente a partir de "opciones"
<Selector opciones={productos} etiqueta={(p) => p.nombre} valor={null} onCambio={(p) => console.log(p.id)} />
```

## 16.2 Tipar `children` con Precisión

`ReactNode` (Módulo 3) es el tipo correcto para la mayoría de casos, pero a veces se necesita restringir qué tipo de contenido acepta un componente.

```tsx
import type { ReactElement } from 'react'

// Solo acepta un único elemento JSX, no texto ni arrays
interface ModalProps {
  children: ReactElement
}

// Acepta específicamente una función que renderiza contenido (render prop, Módulo 17)
interface ListaProps<T> {
  items: T[]
  children: (item: T) => ReactElement
}
```

## 16.3 Tipar Componentes con Props Polimórficas (`as`)

Un patrón avanzado: un componente que puede renderizarse como distintas etiquetas HTML según una prop `as`, manteniendo el tipado correcto de los atributos según la etiqueta elegida.

```tsx
import type { ElementType, ComponentPropsWithoutRef } from 'react'

interface TextoProps<T extends ElementType> {
  as?: T
  children: ReactNode
}

function Texto<T extends ElementType = 'p'>({
  as,
  children,
  ...resto
}: TextoProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof TextoProps<T>>) {
  const Componente = as || 'p'
  return <Componente {...resto}>{children}</Componente>
}
```

```tsx
<Texto>Párrafo normal</Texto>
<Texto as="h1">Título</Texto>
<Texto as="a" href="/inicio">Enlace</Texto> {/* TypeScript exige "href" porque as="a" */}
```

## 16.4 Discriminated Unions para Props Condicionales

Cuando un componente acepta combinaciones de props mutuamente excluyentes, una unión discriminada obliga a TypeScript a validar la combinación correcta.

```tsx
type BotonProps =
  | { variante: 'enlace'; href: string; onClick?: never }
  | { variante: 'accion'; href?: never; onClick: () => void }

function Boton(props: BotonProps) {
  if (props.variante === 'enlace') {
    return <a href={props.href}>Ir</a>
  }
  return <button onClick={props.onClick}>Ejecutar</button>
}
```

```tsx
<Boton variante="enlace" href="/perfil" />       {/* ✅ Válido */}
<Boton variante="accion" onClick={() => {}} />    {/* ✅ Válido */}
<Boton variante="enlace" onClick={() => {}} />    {/* ❌ Error de TypeScript: combinación inválida */}
```

## 16.5 Tipar Eventos Personalizados y Handlers Reutilizables

```tsx
import type { ChangeEventHandler } from 'react'

interface CampoProps {
  valor: string
  onCambio: ChangeEventHandler<HTMLInputElement>
}

function Campo({ valor, onCambio }: CampoProps) {
  return <input value={valor} onChange={onCambio} />
}
```

`ChangeEventHandler<HTMLInputElement>` es equivalente a `(evento: ChangeEvent<HTMLInputElement>) => void`, pero más legible cuando el tipo se reutiliza en varias props o funciones.

## 16.6 Tipar el Retorno de un Custom Hook

```typescript
interface UseContadorReturn {
  contador: number
  incrementar: () => void
  decrementar: () => void
}

function useContador(inicial = 0): UseContadorReturn {
  const [contador, setContador] = useState(inicial)

  return {
    contador,
    incrementar: () => setContador((c) => c + 1),
    decrementar: () => setContador((c) => c - 1)
  }
}
```

Declarar explícitamente el tipo de retorno documenta la API del hook y evita que un cambio interno accidental modifique silenciosamente su forma pública.

## 16.7 `satisfies` para Validar sin Perder Inferencia

El operador `satisfies` (TypeScript 4.9+) valida que un valor cumpla un tipo, sin ensanchar su tipo inferido al tipo declarado — útil para mapas de configuración donde quieres mantener los literales exactos.

```typescript
type Ruta = { path: string; label: string }

const rutas = {
  inicio: { path: '/', label: 'Inicio' },
  perfil: { path: '/perfil', label: 'Perfil' }
} satisfies Record<string, Ruta>

rutas.inicio.path // TypeScript sabe que es exactamente '/', no solo "string"
```

## 16.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un componente que se adapte al tipo de dato recibido | `function Componente<T>(props: Props<T>)` |
| Restringir `children` a un único elemento | `children: ReactElement` |
| Un componente que cambia de etiqueta HTML dinámicamente | Prop `as: ElementType` + `ComponentPropsWithoutRef<T>` |
| Props mutuamente excluyentes | Unión discriminada (`{ variante: 'a'; ... } \| { variante: 'b'; ... }`) |
| Validar un objeto sin perder los literales exactos | `satisfies` |

## 16.9 Errores Comunes

* **Usar `any` como salida rápida ante un tipo complejo**: casi siempre hay un tipo más preciso — `unknown` + verificación, un genérico, o una unión discriminada.
* **No tipar el retorno de un custom hook**: cambios internos pueden alterar silenciosamente la forma del objeto devuelto sin que TypeScript avise a quien lo consume.
* **Sobrecomplicar con genéricos cuando una unión simple basta**: los componentes polimórficos (16.3) son potentes pero difíciles de leer — resérvalos para librerías de componentes realmente compartidas, no para componentes de una sola vista.
