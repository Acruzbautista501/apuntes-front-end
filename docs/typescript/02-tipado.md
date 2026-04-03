
# Módulo 2: Tipado Básico y Primitivos

## 2.1 Tipos Primitivos
En TypeScript, los tipos primitivos son la base de todo. Se escriben siempre en **minúsculas**.

* **`string`:** Para cadenas de texto. Admite comillas simples, dobles y *template literals* (backticks).
* **`number`:** Para todos los números (enteros, decimales, hexadecimales). No hay distinción entre `int` y `float`.
* **`boolean`:** Valores lógicos: `true` o `false`.

### Ejemplo de sintaxis:
```typescript
let nombre: string = "Aldair";
let edad: number = 25;
let esDesarrollador: boolean = true;
```


## 2.2 Inferencia de Tipos
TypeScript es lo suficientemente inteligente como para saber el tipo de una variable sin que se lo digas explícitamente, siempre y cuando la **inicialices** al momento de declararla.

```typescript
let lenguaje = "TypeScript"; // TS deduce que es 'string'
// lenguaje = 10; // ❌ Error: No puedes asignar un número a un string
```
**Regla de oro:** Si declaras e inicializas en la misma línea, no hace falta poner el tipo (ej. `: string`). Úsalo solo cuando declares una variable vacía que recibirá datos después (como el resultado de una API).


## 2.3 El peligro del tipo `any`
El tipo `any` es como volver a JavaScript puro: permite que una variable sea **cualquier cosa**.

* **¿Por qué evitarlo?** Porque anula la protección de TypeScript. Si usas `any`, pierdes el autocompletado y los avisos de errores.
* **¿Cuándo usarlo?** Solo en casos extremos de migración de código viejo o cuando realmente no tienes control sobre la estructura de los datos.

> **Consejo Pro:** Si activaste `strict: true` en tu `tsconfig.json`, TypeScript te dará un error si olvidas tipar algo y el sistema no puede inferirlo, evitando que `any` aparezca de forma silenciosa.


## 2.4 Null y Undefined
En JavaScript, estos dos tipos suelen causar el famoso error `"Cannot read property 'x' of undefined"`. En TypeScript, son tipos propios.

Si activas el modo estricto, no puedes asignar `null` a un `string` a menos que lo permitas explícitamente usando una **Unión de Tipos**:

```typescript
let resultado: string | null = null; // Puede ser un texto o nulo
resultado = "Operación exitosa";
```


## 2.5 Arreglos (Arrays)
Para tipar listas de datos, tienes dos sintaxis equivalentes. La primera es la más común en el desarrollo Front End moderno:

1.  **Sintaxis de corchetes:** `tipo[]`
2.  **Sintaxis genérica:** `Array<tipo>`

```typescript
const frameworks: string[] = ["Vue", "React", "Angular"];
const puntajes: number[] = [10, 8, 9.5];

// Esto protege tu lista:
// frameworks.push(100); // ❌ Error: No puedes meter un número en una lista de strings
```


## 2.6 Tuplas
Las tuplas son un tipo especial de array que tiene un **número fijo de elementos** y donde cada posición tiene un **tipo específico**. Son muy comunes en Hooks (como `useState` de React) o para manejar coordenadas.

```typescript
// Una tupla para representar un color RGB y su nombre
let color: [number, number, number, string];

color = [255, 0, 0, "Rojo"]; // ✅ Correcto
// color = ["Verde", 0, 255, 0]; // ❌ Error: El orden y los tipos no coinciden
```

## 2.7 Resumen de visualización de tipos


| Tipo | Ejemplo | Descripción |
| :--- | :--- | :--- |
| `string` | `"Hola"` | Texto plano o dinámico. |
| `number` | `10.5` | Valores numéricos. |
| `boolean` | `true` | Estados binarios. |
| `any` | `?` | Desactiva la revisión (Evitar). |
| `string[]` | `["a", "b"]` | Colecciones de un solo tipo. |
| `[n, s]` | `[1, "si"]` | Arreglos con estructura fija (Tuplas). |
