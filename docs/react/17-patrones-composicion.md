# Módulo 17: Patrones de Composición

React no tiene *slots* nombrados como Vue, pero `children` (Módulo 3) y algunos patrones específicos del ecosistema permiten construir componentes igual de flexibles y reutilizables. Este módulo cubre los patrones de composición más usados en librerías de componentes reales.

## 17.1 Composición Básica con `children`

El patrón más simple: un componente contenedor que no sabe (ni necesita saber) qué va a renderizar dentro de él.

```tsx
import type { ReactNode } from 'react'

function Tarjeta({ children }: { children: ReactNode }) {
  return <div className="tarjeta">{children}</div>
}
```

```tsx
<Tarjeta>
  <h3>Título</h3>
  <p>Contenido variable</p>
</Tarjeta>
```

Es el equivalente al *slot* por defecto de Vue (Módulo 4 de la sección Vue) — sin necesitar ninguna sintaxis especial, es simplemente cómo funciona `children` en JSX.

## 17.2 Varias "Zonas" de Contenido — Props que Reciben JSX

React no tiene *slots nombrados* nativos; el equivalente es simplemente pasar JSX como el valor de **cualquier prop**, no solo `children`.

```tsx
import type { ReactNode } from 'react'

interface ModalProps {
  encabezado: ReactNode
  children: ReactNode
  pie: ReactNode
}

function Modal({ encabezado, children, pie }: ModalProps) {
  return (
    <div className="modal">
      <header>{encabezado}</header>
      <main>{children}</main>
      <footer>{pie}</footer>
    </div>
  )
}
```

```tsx
<Modal
  encabezado={<h2>Confirmar acción</h2>}
  pie={
    <>
      <button>Cancelar</button>
      <button>Confirmar</button>
    </>
  }
>
  <p>¿Estás seguro de que deseas continuar?</p>
</Modal>
```

## 17.3 *Render Props* — El Hijo Decide Cómo Renderizar

El equivalente directo a un *scoped slot* de Vue: en lugar de pasar JSX ya construido, el componente padre pasa una **función** que el hijo invoca con los datos que solo el hijo conoce.

```tsx
interface ListaConEstadoProps<T> {
  items: T[]
  children: (item: T, indice: number) => ReactNode
}

function ListaConEstado<T>({ items, children }: ListaConEstadoProps<T>) {
  return (
    <ul>
      {items.map((item, indice) => (
        <li key={indice}>{children(item, indice)}</li>
      ))}
    </ul>
  )
}
```

```tsx
interface Usuario { id: number; nombre: string; activo: boolean }

<ListaConEstado items={usuarios}>
  {(usuario) => (
    <span className={usuario.activo ? 'texto-verde' : 'texto-gris'}>
      {usuario.nombre}
    </span>
  )}
</ListaConEstado>
```

El componente `ListaConEstado` controla la **iteración y la estructura** (`<ul><li>`), pero el padre decide **cómo se ve cada elemento** — la misma separación de responsabilidades que un *scoped slot* de Vue.

## 17.4 Compound Components — Componentes que Trabajan Juntos

Un patrón muy usado en librerías de UI (como los componentes de un `<Tabs>` o un `<Accordion>`): varios componentes relacionados que comparten estado implícito a través de Context, expuestos como propiedades del componente principal.

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

interface TabsContextType {
  pestanaActiva: string
  setPestanaActiva: (id: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

function useTabsContext() {
  const contexto = useContext(TabsContext)
  if (!contexto) throw new Error('Los componentes Tabs.* deben usarse dentro de <Tabs>')
  return contexto
}

function Tabs({ children, valorInicial }: { children: ReactNode; valorInicial: string }) {
  const [pestanaActiva, setPestanaActiva] = useState(valorInicial)

  return (
    <TabsContext.Provider value={{ pestanaActiva, setPestanaActiva }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

function TabsLista({ children }: { children: ReactNode }) {
  return <div className="tabs-lista">{children}</div>
}

function TabsBoton({ id, children }: { id: string; children: ReactNode }) {
  const { pestanaActiva, setPestanaActiva } = useTabsContext()
  return (
    <button
      className={pestanaActiva === id ? 'activo' : ''}
      onClick={() => setPestanaActiva(id)}
    >
      {children}
    </button>
  )
}

function TabsPanel({ id, children }: { id: string; children: ReactNode }) {
  const { pestanaActiva } = useTabsContext()
  if (pestanaActiva !== id) return null
  return <div className="tabs-panel">{children}</div>
}

Tabs.Lista = TabsLista
Tabs.Boton = TabsBoton
Tabs.Panel = TabsPanel

export default Tabs
```

**Uso — una API declarativa y flexible, sin necesitar props complejas:**

```tsx
<Tabs valorInicial="perfil">
  <Tabs.Lista>
    <Tabs.Boton id="perfil">Perfil</Tabs.Boton>
    <Tabs.Boton id="seguridad">Seguridad</Tabs.Boton>
  </Tabs.Lista>

  <Tabs.Panel id="perfil">Contenido del perfil</Tabs.Panel>
  <Tabs.Panel id="seguridad">Contenido de seguridad</Tabs.Panel>
</Tabs>
```

## 17.5 Portals — Renderizar Fuera del Árbol del DOM Actual

El equivalente exacto a `<Teleport>` de Vue: renderiza contenido en un nodo del DOM distinto al del componente actual, útil para modales y tooltips que necesitan escapar de contenedores con `overflow: hidden` o `z-index` conflictivos.

```tsx
import { createPortal } from 'react-dom'

function Modal({ children }: { children: ReactNode }) {
  return createPortal(
    <div className="modal-overlay">
      <div className="modal">{children}</div>
    </div>,
    document.body // El contenido se monta directamente en <body>, fuera del árbol actual
  )
}
```

Aunque `<Modal>` esté escrito dentro de otro componente en el código, en el DOM real termina como hijo directo de `<body>` — el estado y los eventos de React siguen funcionando con normalidad, solo cambia la ubicación física en el DOM.

## 17.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un contenedor genérico de contenido | `children: ReactNode` |
| Varias "zonas" de contenido personalizable | Props que reciben JSX (`encabezado`, `pie`, etc.) |
| Que el hijo decida cómo renderizar datos del padre | *Render prop*: `children: (item) => ReactNode` |
| Varios componentes relacionados que comparten estado | *Compound components* + Context |
| Renderizar fuera del árbol del DOM actual | `createPortal(contenido, elementoDestino)` |

## 17.7 Errores Comunes

* **Usar *render props* cuando `children: ReactNode` simple es suficiente**: agrega complejidad innecesaria si el padre no necesita datos del hijo para decidir qué renderizar.
* **Compound components sin validar el contexto**: sin lanzar un error explícito cuando `Tabs.Boton` se usa fuera de `<Tabs>`, el bug aparece de forma confusa y lejos de su causa real.
* **Olvidar limpiar el portal**: `createPortal` no requiere limpieza manual (React lo gestiona), pero si el destino (`document.body`) no existe todavía al montar, causa un error — asegúrate de que el nodo destino ya esté presente en el DOM.
