# Módulo 19: TanStack Query (Server State)

El hook `useFetch` construido en el Módulo 11 resuelve lo básico, pero una aplicación real necesita más: caché entre componentes, revalidación automática, reintentos ante fallos, y evitar peticiones duplicadas. **TanStack Query** (antes React Query) es la librería estándar del ecosistema para gestionar *server state* — datos que viven en el servidor, no en el cliente.

## 19.1 Por Qué "Server State" es Diferente de "Client State"

El estado de un formulario o un modal abierto (Módulos 4-5) es *client state*: React es su única fuente de verdad. Los datos de una API son *server state*: pueden quedar desactualizados, pertenecen a otro sistema, y varios componentes pueden necesitarlos simultáneamente. Tratar ambos con `useState`/`useEffect` funciona para casos simples, pero mezclar sus responsabilidades es la causa de la mayoría de bugs de *fetching* manual.

## 19.2 Instalación y Configuración

```bash
npm install @tanstack/react-query
```

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

## 19.3 `useQuery` — Leer Datos

```tsx
import { useQuery } from '@tanstack/react-query'

interface Producto { id: number; nombre: string }

async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await fetch('/api/productos')
  if (!respuesta.ok) throw new Error('Error al cargar productos')
  return respuesta.json()
}

function ListaProductos() {
  const { data: productos, isLoading, error } = useQuery({
    queryKey: ['productos'],
    queryFn: obtenerProductos
  })

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>{error.message}</p>

  return (
    <ul>
      {productos?.map((p) => (
        <li key={p.id}>{p.nombre}</li>
      ))}
    </ul>
  )
}
```

Comparado con el `useFetch` manual del Módulo 11, `useQuery` da automáticamente: caché compartida entre componentes que usan la misma `queryKey`, revalidación al recuperar el foco de la ventana, reintentos automáticos ante fallos, y deduplicación de peticiones simultáneas idénticas.

## 19.4 `queryKey` — La Clave de la Caché

```tsx
useQuery({
  queryKey: ['productos', categoriaId], // La caché es distinta para cada categoriaId
  queryFn: () => obtenerProductosPorCategoria(categoriaId)
})
```

Cuando `categoriaId` cambia, TanStack Query trata la petición como una consulta distinta — cachea cada combinación por separado, y vuelve a pedir los datos automáticamente si aún no existen en caché.

## 19.5 `useMutation` — Escribir Datos

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface NuevoProducto { nombre: string; precio: number }

async function crearProducto(datos: NuevoProducto): Promise<Producto> {
  const respuesta = await fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  if (!respuesta.ok) throw new Error('Error al crear el producto')
  return respuesta.json()
}

function FormularioProducto() {
  const queryClient = useQueryClient()

  const mutacion = useMutation({
    mutationFn: crearProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] }) // Refresca la lista automáticamente
    }
  })

  function manejarEnvio(datos: NuevoProducto) {
    mutacion.mutate(datos)
  }

  return (
    <div>
      <button onClick={() => manejarEnvio({ nombre: 'Nuevo', precio: 10 })} disabled={mutacion.isPending}>
        {mutacion.isPending ? 'Guardando...' : 'Crear producto'}
      </button>
      {mutacion.isError && <p>Error al crear el producto</p>}
    </div>
  )
}
```

`invalidateQueries` marca la caché de `['productos']` como obsoleta — TanStack Query vuelve a pedir esos datos automáticamente en cualquier componente que los esté mostrando, sin código manual de sincronización.

## 19.6 Custom Hooks sobre TanStack Query

El mismo patrón del Módulo 11 (encapsular endpoints en hooks propios) aplica igual aquí, con la ventaja adicional de la caché integrada.

```typescript
// hooks/useProductos.ts
import { useQuery } from '@tanstack/react-query'

export function useProductos() {
  return useQuery({ queryKey: ['productos'], queryFn: obtenerProductos })
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => obtenerProducto(id),
    enabled: !!id // Evita ejecutar la consulta si "id" todavía no es válido
  })
}
```

## 19.7 Actualizaciones Optimistas

Un patrón avanzado: actualizar la UI **antes** de que la respuesta del servidor llegue, para que la interfaz se sienta instantánea, revirtiendo el cambio si la petición finalmente falla.

```tsx
const mutacion = useMutation({
  mutationFn: alternarTareaCompletada,
  onMutate: async (idTarea) => {
    await queryClient.cancelQueries({ queryKey: ['tareas'] })
    const tareasAnteriores = queryClient.getQueryData<Tarea[]>(['tareas'])

    queryClient.setQueryData<Tarea[]>(['tareas'], (anteriores) =>
      anteriores?.map((t) => (t.id === idTarea ? { ...t, completada: !t.completada } : t))
    )

    return { tareasAnteriores } // Se pasa a onError si la mutación falla
  },
  onError: (_err, _idTarea, contexto) => {
    if (contexto?.tareasAnteriores) {
      queryClient.setQueryData(['tareas'], contexto.tareasAnteriores) // Revertir
    }
  }
})
```

## 19.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Leer datos con caché y revalidación automática | `useQuery({ queryKey, queryFn })` |
| Crear/actualizar/eliminar datos | `useMutation({ mutationFn })` |
| Refrescar datos tras una mutación exitosa | `queryClient.invalidateQueries({ queryKey })` |
| Evitar ejecutar una consulta hasta que un valor esté listo | `enabled: !!valor` |
| UI instantánea antes de la confirmación del servidor | `onMutate` con actualización optimista + `onError` con reversión |

## 19.9 Errores Comunes

* **Reimplementar manualmente lo que TanStack Query ya resuelve**: caché, revalidación, reintentos — usar `useEffect` + `useState` para *server state* en un proyecto que ya usa TanStack Query duplica esfuerzo sin beneficio.
* **Usar la misma `queryKey` para consultas con parámetros distintos**: mezcla la caché de peticiones que deberían ser independientes (ver 19.4).
* **Olvidar `invalidateQueries` tras una mutación**: los datos mostrados quedan desactualizados hasta la siguiente revalidación automática (cambio de foco, tiempo de caducidad), en vez de reflejar el cambio de inmediato.
