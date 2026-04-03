
# Módulo 6: Genéricos (El superpoder de TS)

## 6.1 ¿Qué son los Genéricos?
Imagina que quieres una función que devuelva el primer elemento de un arreglo. Si el arreglo es de números, devuelve un número; si es de strings, devuelve un string.

Sin genéricos, tendrías que usar `any` (malo) o duplicar código. Con genéricos, usas una **variable de tipo** (normalmente llamada `<T>`).

```typescript
function primerElemento<T>(lista: T[]): T {
  return lista[0];
}

const num = primerElemento([1, 2, 3]);    // TS infiere que T es 'number'
const str = primerElemento(["a", "b"]);  // TS infiere que T es 'string'
```

## 6.2 Interfaces Genéricas
En el Front End, esto es **vital** para manejar respuestas de una API. Casi todas las APIs tienen una estructura común (un mensaje, un código de estado y la "data"), pero la "data" cambia según lo que pidas.

```typescript
interface RespuestaAPI<T> {
  status: number;
  mensaje: string;
  data: T; // 'T' será el tipo de dato que nosotros le digamos
}

interface Usuario {
  id: number;
  nombre: string;
}

// Usamos la interfaz para una respuesta que trae un Usuario
const respuesta: RespuestaAPI<Usuario> = {
  status: 200,
  mensaje: "Cargado",
  data: { id: 1, nombre: "Aldair" }
};
```

## 6.3 Restricciones en Genéricos (`extends`)
A veces no quieres que el genérico sea *cualquier* cosa. Quieres que sea un tipo que al menos tenga ciertas propiedades. Para eso usamos `extends`.

```typescript
interface ConId {
  id: number;
}

// Esta función solo acepta objetos que tengan la propiedad 'id'
function imprimirId<T extends ConId>(objeto: T): void {
  console.log(`El ID es: ${objeto.id}`);
}

imprimirId({ id: 5, nombre: "Proyecto" }); // ✅ Correcto
// imprimirId({ nombre: "Sin ID" });       // ❌ Error: Falta la propiedad 'id'
```

## 6.4 Clases Genéricas
Si estás construyendo una utilidad (como un carrito de compras o una lista paginada), las clases genéricas te permiten reutilizar la lógica para diferentes modelos de datos.

```typescript
class ListaPaginada<T> {
  private elementos: T[] = [];

  agregar(item: T) {
    this.elementos.push(item);
  }

  obtenerTodos(): T[] {
    return this.elementos;
  }
}

const listaDePokemon = new ListaPaginada<string>();
listaDePokemon.agregar("Pikachu");
```

## 6.5 Tipos Utilitarios (Built-in Generics)
TypeScript incluye genéricos ya creados que te facilitan la vida al transformar otros tipos:

* **`Partial<T>`:** Hace que todas las propiedades de un objeto sean opcionales.
* **`Readonly<T>`:** Hace que todas las propiedades sean solo lectura.
* **`Record<K, T>`:** Crea un objeto con llaves de tipo K y valores de tipo T.

```typescript
interface Post {
  titulo: string;
  contenido: string;
}

// Útil para funciones de "update" donde solo mandas algunos campos
function actualizarPost(id: number, cambios: Partial<Post>) {
  // ...
}

actualizarPost(1, { titulo: "Nuevo Título" }); // ✅ No pide el contenido
```

## 6.6 Genéricos en Funciones de Flecha
Si usas funciones de flecha (Arrow Functions), la sintaxis cambia ligeramente para que el compilador no se confunda con etiquetas de HTML (JSX/TSX).

```typescript
const transformarDato = <T>(dato: T): T => {
  return dato;
};
```


::: tip 💡 Tip para Front End
Los genéricos son fundamentales cuando usas librerías como **Axios** o los hooks de **Vue/React**. Por ejemplo, al hacer un fetch:
`axios.get<Usuario[]>('/api/users')`. 
Esto le dice a TypeScript: "Oye, no sé qué viene de la red, pero confío en que será una lista de Usuarios". A partir de ahí, tendrás autocompletado en toda tu aplicación.
:::
