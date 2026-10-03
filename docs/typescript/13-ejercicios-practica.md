# Módulo 13: Ejercicios Prácticos de Frontend Tipado

Esta serie de ejercicios prácticos integra los conceptos clave de TypeScript aplicados al desarrollo web real. Cada ejercicio está diseñado para resolver una necesidad típica de interfaces de usuario modernas.

---

## 🟢 Bloque 1: DOM, Eventos y Formularios (Módulos 1 al 3)

### Ejercicio 1: Formulario Tipado sin Casting Inseguro
Crea un script para manejar un formulario de inicio de sesión:
* Selecciona el formulario `#login-form` y los inputs `#email` y `#password` con sus tipos específicos (`HTMLFormElement`, `HTMLInputElement`) sin usar en ningún momento el operador `!`.
* Escucha el evento `submit` con su tipo nativo `SubmitEvent` y cancela el comportamiento por defecto.
* Valida que el email contenga `@` y que la contraseña tenga al menos 6 caracteres.
* Si hay un error, actualiza un elemento `<p id="mensaje-error">` cambiando su texto y aplicando estilos directamente a través de `style.color = "red"`.

### Ejercicio 2: Lista de Tareas con Delegación de Eventos
Implementa una lista interactiva de tareas:
* Selecciona el contenedor `<ul>` padre.
* Agrega un listener para el evento `click` (`MouseEvent`).
* Utiliza `target.closest<HTMLButtonElement>()` para detectar si el usuario hizo clic en un botón con clase `.btn-completar` o `.btn-eliminar`.
* Lee el atributo `data-id` de forma segura y ejecuta la acción correspondiente sobre el elemento `<li>`.

---

## 🟡 Bloque 2: Estado, Genéricos y Utility Types (Módulos 4 al 6)

### Ejercicio 3: Reproductor de Audio con Uniones Discriminadas
Modela el estado de un reproductor de música web:
1. Define las interfaces para los estados:
   * `EstadoDetenido`: `{ status: "DETENIDO" }`
   * `EstadoReproduciendo`: `{ status: "REPRODUCIENDO"; cancion: string; volumen: number; duracionSegundos: number }`
   * `EstadoPausado`: `{ status: "PAUSADO"; cancion: string; segundoActual: number }`
   * `EstadoError`: `{ status: "ERROR"; codigoError: number; reintentable: boolean }`
2. Define la unión `EstadoReproductor`.
3. Escribe una función `obtenerTextoBarraEstado(estado: EstadoReproductor): string` que utilice un `switch` con **Verificación Exhaustiva (`never`)** en el bloque `default`.

### Ejercicio 4: Modelado de Modelos con Utility Types
Dada la interfaz completa de un artículo de tienda:

```typescript
interface ArticuloTienda {
  id: string;
  sku: string;
  titulo: string;
  precio: number;
  stock: number;
  descripcion: string;
  proveedor: { id: number; nombre: string };
  creadoEn: Date;
}
```

Genera sin repetir código:
* `ArticuloResumen`: Solo `id`, `titulo` y `precio` (usa `Pick`).
* `FormularioCrearArticulo`: Todos los campos excepto `id` y `creadoEn` (usa `Omit`).
* `ActualizacionParcialArticulo`: Todos los campos de `FormularioCrearArticulo` pero opcionales (usa `Partial`).
* `MapaPrecios`: Un diccionario de IDs con su precio respectivo (usa `Record`).

---

## 🔴 Bloque 3: APIs, Zod, Frameworks y Entorno (Módulos 7 al 12)

### Ejercicio 5: Type Predicate para Limpiar Respuestas de Red
Dada una lista heterogénea de usuarios devueltos por un endpoint:

```typescript
interface UsuarioValido {
  id: number;
  nombre: string;
  activo: true;
}

interface UsuarioInvalido {
  id: null;
  error: string;
}

type RespuestaUsuario = UsuarioValido | UsuarioInvalido;
```

* Escribe un Predicado de Tipo `esUsuarioValido(u: RespuestaUsuario): u is UsuarioValido`.
* Filtra una lista de usuarios utilizando tu Type Guard para obtener un array `UsuarioValido[]` limpio de errores.

### Ejercicio 6: Consumo Defensivo con Zod y Axios
* Define un esquema Zod para validar un comentario de blog:
  * `id: number`
  * `email: string` (con formato de email válido)
  * `comentario: string` (mínimo 5 caracteres)
* Deriva el tipo TypeScript usando `z.infer`.
* Escribe una función asíncrona que consuma `https://jsonplaceholder.typicode.com/comments/1` con Axios, valide la respuesta con `safeParse()` y maneje tanto errores de red (con `axios.isAxiosError`) como errores de validación de esquema.

### Ejercicio 7: Componente Selector Genérico
Crea la firma de tipos para un componente desplegable (*Dropdown*) genérico:
* Debe aceptar un array `items: T[]`.
* Debe aceptar una propiedad `renderEtiqueta: (item: T) => string`.
* Debe aceptar un callback `onSeleccionar: (item: T) => void`.
* Pruébalo llamándolo con una lista de objetos `{ id: 1, ciudad: "Bogotá" }` y verifica que el callback devuelva el objeto con su tipo original sin recurrir a `any`.

### Ejercicio 8: Tipado de Entorno y Variables Globales
Crea un archivo de declaración `env.d.ts`:
* Tipa tres variables de entorno de Vite: `VITE_API_KEY`, `VITE_ENTORNO` (`"local" | "staging" | "produccion"`), y `VITE_TIMEOUT_MS`.
* Extiende la interfaz `Window` para permitir invocar un método global de soporte al cliente: `window.abrirChatSoporte(departamento: string): void`.
