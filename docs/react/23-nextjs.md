# Módulo 23: Introducción a Next.js

Todo lo visto hasta ahora describe una **SPA** (*Single Page Application*): el navegador descarga un único HTML casi vacío y React construye la interfaz completa en el cliente. **Next.js** es un framework construido sobre React que añade renderizado en el servidor, generación estática, y un sistema de rutas basado en archivos — resolviendo limitaciones de SEO y tiempo de carga inicial que una SPA pura tiene por diseño.

## 23.1 ¿Por Qué un Framework Sobre React?

* **SEO**: una SPA pura envía HTML casi vacío; los motores de búsqueda y las vistas previas de enlaces (redes sociales) necesitan contenido real en el HTML inicial, no generado después por JavaScript.
* **Rendimiento de carga inicial**: renderizar en el servidor entrega HTML ya visible antes de que el JavaScript del cliente siquiera se descargue.
* **Enrutamiento basado en archivos**: la estructura de carpetas define las rutas automáticamente, sin configurar manualmente `<Routes>` como en React Router.

## 23.2 Crear un Proyecto

```bash
npx create-next-app@latest mi-app-next --typescript
cd mi-app-next
npm run dev
```

## 23.3 El App Router — Rutas Basadas en Archivos

```text
app/
├── page.tsx              # Ruta: /
├── layout.tsx             # Layout compartido por todas las rutas
├── contacto/
│   └── page.tsx            # Ruta: /contacto
└── productos/
    ├── page.tsx             # Ruta: /productos
    └── [id]/
        └── page.tsx          # Ruta: /productos/:id (dinámica)
```

```tsx
// app/page.tsx
export default function Inicio() {
  return <h1>Página de inicio</h1>
}
```

```tsx
// app/productos/[id]/page.tsx
export default function DetalleProducto({ params }: { params: { id: string } }) {
  return <p>Producto con ID: {params.id}</p>
}
```

No existe un `<Routes>`/`<Route>` explícito como en React Router — cada `page.tsx` dentro de una carpeta define automáticamente la ruta correspondiente a esa ruta de archivo.

## 23.4 React Server Components (RSC) — El Cambio de Paradigma

En el App Router, **todo componente es un Server Component por defecto**: se ejecuta únicamente en el servidor, nunca se envía su JavaScript al navegador, y puede usar `async`/`await` directamente para pedir datos, sin `useEffect` ni `useState`.

```tsx
// app/productos/page.tsx — Server Component (sin "use client")
interface Producto { id: number; nombre: string }

async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await fetch('https://api.ejemplo.com/productos')
  return respuesta.json()
}

export default async function ProductosPage() {
  const productos = await obtenerProductos() // Se ejecuta en el servidor, antes de enviar el HTML

  return (
    <ul>
      {productos.map((p) => (
        <li key={p.id}>{p.nombre}</li>
      ))}
    </ul>
  )
}
```

No hay estado de "cargando" ni `useEffect` — el servidor espera la petición **antes** de enviar el HTML, así que el navegador recibe la página ya con los datos.

## 23.5 Client Components — Cuándo Sí se Necesitan

Interactividad (`onClick`, `useState`, `useEffect`) requiere JavaScript en el navegador — para eso se marca explícitamente un componente como Client Component con la directiva `"use client"`.

```tsx
// components/BotonContador.tsx
'use client' // Sin esto, useState causaría un error: los Server Components no tienen estado

import { useState } from 'react'

export default function BotonContador() {
  const [cuenta, setCuenta] = useState(0)

  return <button onClick={() => setCuenta((c) => c + 1)}>{cuenta}</button>
}
```

## 23.6 Combinar Server y Client Components

El patrón recomendado: Server Components para obtener y mostrar datos, Client Components solo en las "islas" que realmente necesitan interactividad — minimizando el JavaScript total enviado al navegador.

```tsx
// app/productos/page.tsx — Server Component
import BotonAgregarCarrito from '../../components/BotonAgregarCarrito'

export default async function ProductosPage() {
  const productos = await obtenerProductos()

  return (
    <ul>
      {productos.map((p) => (
        <li key={p.id}>
          {p.nombre}
          <BotonAgregarCarrito idProducto={p.id} /> {/* Client Component: la única parte interactiva */}
        </li>
      ))}
    </ul>
  )
}
```

## 23.7 Layouts Compartidos

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav>Navegación compartida</nav>
        {children}
      </body>
    </html>
  )
}
```

Un `layout.tsx` envuelve automáticamente todas las rutas dentro de su carpeta — no se re-renderiza al navegar entre páginas hijas, preservando su propio estado (como un menú abierto).

## 23.8 Rutas de API

```typescript
// app/api/productos/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const productos = await obtenerProductosDesdeBaseDeDatos()
  return NextResponse.json(productos)
}
```

Next.js permite definir endpoints de backend dentro del mismo proyecto — útil para prototipos o aplicaciones donde el frontend y una API ligera conviven en un solo repositorio.

## 23.9 React Router vs Next.js App Router — Cuándo Usar Cada Uno

| Escenario | Recomendación |
| :--- | :--- |
| SPA interna (panel de administración, herramienta), SEO irrelevante | React (Vite) + React Router |
| Sitio público que necesita buen SEO (e-commerce, blog, landing pages) | Next.js |
| Equipo que ya domina React y no quiere aprender el modelo de Server/Client Components | React (Vite) + React Router |
| Proyecto que necesita renderizado en servidor o generación estática | Next.js |

## 23.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Una nueva ruta | Una carpeta con `page.tsx` dentro de `app/` |
| Un layout compartido entre rutas | `layout.tsx` en la carpeta correspondiente |
| Pedir datos antes de renderizar (sin `useEffect`) | `async`/`await` directo en un Server Component |
| Interactividad (`useState`, `onClick`) | `'use client'` al inicio del archivo |
| Un endpoint de backend simple | `app/api/.../route.ts` |

## 23.11 Errores Comunes

* **Agregar `'use client'` a todo "por si acaso"**: anula buena parte del beneficio de los Server Components — envía más JavaScript del necesario al navegador.
* **Intentar usar `useState`/`useEffect` en un Server Component**: produce un error explícito; esos componentes no tienen ciclo de vida en el cliente.
* **Pensar en Next.js como "React con más pasos"**: el modelo de Server/Client Components es un cambio de paradigma real, no solo una capa de enrutamiento sobre React — vale la pena dominar bien React (Módulos 1-22) antes de adoptarlo.
