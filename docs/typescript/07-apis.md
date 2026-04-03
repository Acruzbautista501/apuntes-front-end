
# Módulo 7: Integración con APIs y el DOM

## 7.1 Tipado del DOM
El navegador tiene cientos de tipos de elementos. TypeScript los agrupa en una jerarquía para que sepas qué propiedades tiene cada uno.

* **`HTMLElement`:** El tipo genérico para cualquier etiqueta.
* **`HTMLInputElement`:** Específico para inputs (tiene `.value`, `.checked`).
* **`HTMLButtonElement`:** Específico para botones (tiene `.disabled`).
* **`HTMLFormElement`:** Específico para formularios (tiene el método `.submit()`).

### Selección segura de elementos:
```typescript
const miInput = document.querySelector<HTMLInputElement>('#user-email');

// Usamos el encadenamiento opcional (?.) porque el elemento podría ser null
if (miInput) {
  console.log(miInput.value); // TS sabe que tiene .value
}
```

## 7.2 Consumo de APIs con Fetch
Cuando usas `fetch`, la promesa que devuelve es de tipo `Promise<any>` por defecto. Debes "ayudar" a TypeScript definiendo qué esperas recibir.

```typescript
interface Pokemon {
  name: string;
  url: string;
}

async function obtenerPokemons(): Promise<Pokemon[]> {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon');
  const data = await response.json();
  
  // Casting para asegurar que la data cumple con nuestra interfaz
  return data.results as Pokemon[];
}
```

## 7.3 Integración Profesional con Axios
**Axios** es la librería estándar en el Front End profesional porque ya viene con soporte nativo para **Genéricos**. Esto hace que tipar las peticiones sea mucho más limpio que con `fetch`.

### Petición GET con Axios:
```typescript
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
}

const getUser = async (id: number) => {
  // Le pasamos el tipo <User> directamente al método .get
  const { data } = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${id}`);
  
  console.log(data.username); // Autocompletado garantizado
};
```

### Petición POST (Enviando datos):
```typescript
interface NewPost {
  title: string;
  body: string;
}

const createPost = async (post: NewPost) => {
  // Axios infiere que lo que envías debe coincidir con la API
  const { data } = await axios.post<NewPost>('/api/posts', post);
  return data;
};
```

## 7.4 Manejo de Errores con `unknown`
En un bloque `try/catch`, TypeScript marca el error como `unknown` (desconocido) porque no sabemos qué lanzó la excepción (puede ser un error de red, un 404, o un error de código).

### La forma correcta de manejar errores de Axios:
```typescript
import axios, { AxiosError } from 'axios';

try {
  await axios.get('/api/datos-corruptos');
} catch (err) {
  // Verificamos si es un error específico de Axios
  if (axios.isAxiosError(err)) {
    console.error("Error de servidor:", err.response?.data);
  } else {
    console.error("Error genérico:", err);
  }
}
```

## 7.5 Tipado de Parámetros de URL (Query Params)
Cuando construyes URLs dinámicas, puedes usar interfaces para asegurar que no faltan parámetros obligatorios.

```typescript
interface SearchFilters {
  query: string;
  page?: number;
  limit: number;
}

const search = (filters: SearchFilters) => {
  const params = new URLSearchParams({
    q: filters.query,
    p: filters.page?.toString() || '1',
    limit: filters.limit.toString()
  });
  return `/search?${params.toString()}`;
};
```
 
::: tip 💡 Tip para Front End
Al trabajar con **Axios**, crea una "instancia" configurada con una interfaz base. Esto te permite tener un lugar centralizado para manejar tus tipos de API y evitar repetir `as MyInterface` en cada componente de tu aplicación.
:::