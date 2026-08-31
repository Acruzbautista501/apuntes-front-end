# Módulo 24: Arquitectura de Proyectos

Has recorrido el camino completo: desde JSX y `useState` hasta TanStack Query, testing y Next.js. Este módulo cierra la parte de conceptos cubriendo cómo organizar un proyecto React grande, antes de pasar a practicar y al Proyecto Integrador.

## 24.1 Estructura de Carpetas por Tipo (Proyectos Pequeños)

```text
src/
├── assets/
├── components/         # Componentes reutilizables (Boton, Tarjeta...)
├── hooks/               # useFetch, useLocalStorage, useAuth...
├── pages/                # Un componente por ruta
├── contexts/
├── stores/               # Stores de Zustand
├── schemas/              # Esquemas de Zod
├── types/
├── utils/                # Funciones puras sin estado (formatDate, slugify...)
├── App.tsx
└── main.tsx
```

## 24.2 Estructura por Dominio/Feature (Proyectos Grandes)

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/FormularioLogin.tsx
│   │   ├── hooks/useAuth.ts
│   │   ├── stores/useAuthStore.ts
│   │   └── types/usuario.types.ts
│   ├── productos/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   └── carrito/
│       ├── components/
│       ├── hooks/
│       └── stores/
├── shared/               # Solo lo que un SEGUNDO feature realmente necesita
│   ├── components/       # Boton, Modal, Input...
│   ├── hooks/
│   └── utils/
├── router/
└── main.tsx
```

La misma regla práctica que en Vue: si un componente, hook o tipo solo lo usa un feature, vive dentro de ese feature; solo sube a `shared/` cuando un **segundo** feature lo necesita realmente.

## 24.3 Separar Presentación de Lógica

```tsx
// features/productos/pages/ProductosPage.tsx — "inteligente"
import { useProductos } from '../hooks/useProductos'
import TarjetaProducto from '../components/TarjetaProducto'

export default function ProductosPage() {
  const { data: productos } = useProductos()

  return (
    <div>
      {productos?.map((producto) => (
        <TarjetaProducto key={producto.id} producto={producto} onAgregar={agregarAlCarrito} />
      ))}
    </div>
  )
}
```

```tsx
// features/productos/components/TarjetaProducto.tsx — "tonto": solo props
interface Props {
  producto: Producto
  onAgregar: (id: number) => void
}

export default function TarjetaProducto({ producto, onAgregar }: Props) {
  return (
    <div>
      <h3>{producto.nombre}</h3>
      <button onClick={() => onAgregar(producto.id)}>Agregar</button>
    </div>
  )
}
```

`TarjetaProducto` puede probarse (Módulo 21) y reutilizarse sin depender de TanStack Query ni de ninguna API — solo necesita las props que se le pasen.

## 24.4 Alias de Importación

```typescript
// vite.config.ts
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

```typescript
import { useAuth } from '@/features/auth/hooks/useAuth' // En vez de '../../../hooks/useAuth'
```
