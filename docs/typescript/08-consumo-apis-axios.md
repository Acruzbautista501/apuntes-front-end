# Módulo 8: Consumo de APIs: Fetch, Axios y Manejo de Errores

En el Frontend moderno, la mayor parte de los datos provienen de servicios HTTP externos. En este módulo aprenderás a conectar tu aplicación con APIs REST utilizando tanto **Fetch nativo** como **Axios**, garantizando el tipado seguro de respuestas y el manejo profesional de excepciones.

---

## 8.1 Fetch Nativo: Por qué `res.json()` devuelve `any`

La función nativa `fetch()` devuelve un objeto `Response`. Al invocar `response.json()`, la especificación estándar de TypeScript indica que devuelve `Promise<any>`, porque el compilador no tiene forma de saber qué enviará el servidor en tiempo de ejecución:

```typescript
interface Post {
  id: number;
  title: string;
  body: string;
}

// Envoltorio reutilizable para tipar fetch con genéricos:
async function clienteFetch<T>(url: string, opciones?: RequestInit): Promise<T> {
  const respuesta = await fetch(url, opciones);

  if (!respuesta.ok) {
    throw new Error(`Error HTTP: ${respuesta.status} - ${respuesta.statusText}`);
  }

  // Aserción explícita de tipo hacia T:
  const datos = (await respuesta.json()) as T;
  return datos;
}

// Invocación completamente tipada:
const posts = await clienteFetch<Post[]>("https://jsonplaceholder.typicode.com/posts");
console.log(posts[0].title); // ✅ Autocompletado de Post
```

---

## 8.2 Axios Profesional con Genéricos

**Axios** es el estándar indiscutible en aplicaciones empresariales porque incluye soporte nativo de primera clase para TypeScript:

```typescript
import axios from "axios";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

// 1. Petición GET: Le pasamos <Usuario> directamente
const obtenerUsuario = async (id: number): Promise<Usuario> => {
  // axios.get<T> asigna el tipo a la propiedad 'data'
  const { data } = await axios.get<Usuario>(`/api/usuarios/${id}`);
  return data;
};

// 2. Petición POST: Tipamos tanto lo que enviamos como lo que recibimos
interface NuevoUsuarioInput {
  nombre: string;
  email: string;
}

const crearUsuario = async (nuevo: NuevoUsuarioInput): Promise<Usuario> => {
  const { data } = await axios.post<Usuario>("/api/usuarios", nuevo);
  return data;
};
```

---

## 8.3 Manejo de Errores con `unknown` y `isAxiosError`

En TypeScript moderno, el bloque `catch (error)` tiene tipo **`unknown`** (no `any`), porque JavaScript permite lanzar cualquier cosa con `throw` (un string, un número, un objeto, o nada).

### ❌ La mala práctica: Forzar `(error as any)`
```typescript
try {
  await axios.get("/api/recurso");
} catch (error: any) {
  console.log(error.response.data.message); // Si no fue un error de Axios, esto tirará la app
}
```

### ✅ La práctica profesional: Usar `axios.isAxiosError`
Axios provee un **Type Guard nativo** para estrechar el error de forma segura:

```typescript
import axios, { AxiosError } from "axios";

interface ErrorRespuestaServidor {
  codigo: string;
  mensaje: string;
}

try {
  await axios.get("/api/recurso-protegido");
} catch (error: unknown) {
  if (axios.isAxiosError<ErrorRespuestaServidor>(error)) {
    // Aquí adentro, TypeScript sabe que es AxiosError con nuestro modelo de respuesta:
    console.error("Código de error del backend:", error.response?.data.codigo);
    console.error("Código de estado HTTP:", error.response?.status);
  } else if (error instanceof Error) {
    // Error estándar de JavaScript (ej. de sintaxis o de memoria):
    console.error("Error local:", error.message);
  } else {
    console.error("Ocurrió un error inesperado no tipado.");
  }
}
```

---

## 8.4 Instancia Centralizada de Axios e Interceptores

En proyectos medianos y grandes, nunca uses `axios.get` globalmente en tus componentes. Crea una instancia con **interceptores** para inyectar automáticamente el token JWT de autenticación:

```typescript
import axios, { InternalAxiosRequestConfig } from "axios";

export const clienteHttp = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://api.miweb.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor de Peticiones: Inyecta el Bearer Token si existe en la sesión
clienteHttp.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);
```

---

## 🛠️ Reto Práctico del Módulo

**Ejercicio: Capa de Servicios de Productos**

Construye un módulo de servicio `productosService.ts`:
1. Define las interfaces:
   * `Producto`: `{ id: number; titulo: string; precio: number }`
   * `CrearProductoDTO`: Usa `Omit<Producto, "id">`
2. Implementa tres funciones tipadas usando tu cliente Axios o Fetch:
   * `listarProductos(): Promise<Producto[]>`
   * `crearProducto(datos: CrearProductoDTO): Promise<Producto>`
   * `eliminarProducto(id: number): Promise<{ success: boolean }>`
3. Envuelve una llamada a `eliminarProducto` en un bloque `try/catch` utilizando `axios.isAxiosError` para extraer e imprimir el mensaje devuelto por el servidor si la eliminación falla con error 403 (Prohibido).
