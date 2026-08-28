# Módulo 24: Arquitectura de Proyectos y Proyecto Integrador

Has recorrido el camino completo: desde JSX y `useState` hasta TanStack Query, testing y Next.js. Este módulo cubre cómo organizar un proyecto React grande, y cierra con un plano de construcción para aplicar todo lo anterior en un solo proyecto coherente.

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

## 24.5 El Encargo del Proyecto Integrador

Vas a construir un **Gestor de Tareas Colaborativo** completo — el mismo alcance funcional del proyecto integrador de Vue.js, para comparar directamente ambos ecosistemas:

1. Autenticación (login/logout) con estado persistente entre recargas.
2. Listado de tareas con filtros y búsqueda en tiempo real.
3. Creación y edición de tareas mediante un formulario validado con Zod, dentro de un modal accesible.
4. Organización en "proyectos" — rutas anidadas con React Router (`/proyectos/:id/tareas`).
5. Estado global de sesión con Zustand (o Context, si el alcance es pequeño).
6. Server state de tareas/proyectos con TanStack Query.
7. Componentes reutilizables con composición vía `children` y *render props*.
8. Al menos un custom hook de datos y uno de UI (`useLocalStorage` o `useFocusTrap`).
9. Code splitting por ruta con `lazy` + `Suspense`.
10. Tests para al menos un componente, un custom hook y una mutación.

## 24.6 Checklist de Requisitos Técnicos

### Fundamentos y Hooks
- [ ] Los componentes están tipados con interfaces claras para props (Módulo 3).
- [ ] El estado deriva correctamente sin mutaciones directas (Módulo 4).
- [ ] Ningún cálculo derivado usa `useEffect` innecesariamente (Módulo 7).

### Componentes
- [ ] Existe al menos un componente con `children` tipado como `ReactNode` (Módulo 3, 17).
- [ ] El modal usa un *render prop* o composición flexible para su contenido (Módulo 17).
- [ ] Se usa un `useRef` para enfocar el primer campo del formulario al abrir el modal (Módulo 8).

### Lógica Reutilizable
- [ ] Existe al menos un custom hook propio con estado y funciones (Módulo 10).
- [ ] Las peticiones usan TanStack Query, no `useEffect` manual (Módulo 19).

### Estado y Navegación
- [ ] Zustand (o Context) gestiona el estado de sesión (Módulo 9, 15).
- [ ] React Router define rutas anidadas con `<Outlet>`, y al menos una ruta protegida (Módulo 14).
- [ ] Las páginas cargan con `lazy` + `Suspense` (Módulo 18).

### Formularios y TypeScript
- [ ] El formulario usa React Hook Form + Zod, con `z.infer` para derivar el tipo (Módulo 20).
- [ ] Existen interfaces claras para `Usuario`, `Proyecto` y `Tarea`, reutilizadas en props, hooks y esquemas (Módulo 16).

### Accesibilidad
- [ ] El modal atrapa el foco y lo devuelve al cerrarse (Módulo 22).
- [ ] Los errores de formulario usan `aria-invalid`/`aria-describedby` (Módulo 22).
- [ ] `eslint-plugin-jsx-a11y` está configurado y sin errores (Módulo 22).

### Testing
- [ ] Al menos un componente tiene un test de renderizado e interacción con RTL (Módulo 21).
- [ ] Al menos un custom hook tiene un test con `renderHook` (Módulo 21).
- [ ] Al menos una mutación de TanStack Query tiene un test con `fetch` simulado (Módulo 21).

## 24.7 Estructura de Archivos Sugerida

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/FormularioLogin.tsx
│   │   ├── hooks/useAuth.ts
│   │   └── stores/useAuthStore.ts
│   ├── proyectos/
│   │   ├── components/TarjetaProyecto.tsx
│   │   ├── hooks/useProyectos.ts
│   │   └── pages/ProyectosPage.tsx
│   └── tareas/
│       ├── components/ListaTareas.tsx
│       ├── components/FormularioTarea.tsx
│       ├── hooks/useTareas.ts
│       ├── schemas/tareaSchema.ts
│       └── pages/TareasPage.tsx
├── shared/
│   ├── components/Boton.tsx
│   ├── components/Modal.tsx
│   └── hooks/useFocusTrap.ts
├── router/
├── types/
├── App.tsx
└── main.tsx
```

## 24.8 Criterios de "Terminado" (Definition of Done)

1. **¿Un usuario que navega solo con teclado puede crear, editar y eliminar una tarea sin perder el foco en ningún punto?**
2. **¿El estado de sesión persiste tras recargar la página (F5)?**
3. **¿Los tests corren sin errores con `npm run test`?**
4. **¿`npm run build` genera un bundle sin errores de TypeScript?**
5. **¿Las páginas de proyectos y tareas cargan de forma diferida (visible en la pestaña Network del navegador)?**

## 24.9 Siguientes Pasos

Con este proyecto terminado, ya tienes el criterio para:

* Auditar y mejorar aplicaciones React escritas por otras personas, incluyendo su arquitectura y accesibilidad.
* Decidir con fundamento cuándo usar Context frente a Zustand, o cuándo React (Vite) frente a Next.js.
* Construir librerías de componentes internas reutilizables, con `children`, *render props* y tipado genérico bien diseñados.
* Comparar directamente los patrones de React con los de Vue.js 3 — mismo problema, dos enfoques distintos — y elegir el más adecuado según el proyecto y el equipo.
