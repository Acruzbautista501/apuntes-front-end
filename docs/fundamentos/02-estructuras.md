
# Módulo 2: Tipado Básico y Estructuras de Datos

En este módulo aprenderemos cómo decirle a TypeScript qué tipo de información estamos manejando. Esto es lo que permite que el editor nos avise de errores antes de probar el código en el navegador.

## 2.1 Tipos Primitivos
Los tipos primitivos son los ladrillos básicos de cualquier lenguaje. En TypeScript, los definimos usando la sintaxis `let nombreVariable: tipo = valor;`.

* **`string`**: Para cadenas de texto. Se pueden usar comillas dobles, simples o *backticks* (plantillas literales).
* **`number`**: Para números (enteros, decimales, hexadecimales). En JS/TS no hay distinción entre `int` y `float`.
* **`boolean`**: Solo acepta valores `true` o `false`.
* **`null` y `undefined`**: Representan la ausencia de valor. Por defecto, son tipos por sí mismos.

```typescript
let nombre: string = "Aldair";
let edad: number = 25;
let esDesarrollador: boolean = true;
let deuda: null = null;
```

## 2.2 Inferencia de Tipos
TypeScript es inteligente. Si declaras una variable e inmediatamente le asignas un valor, TS **infiere** (adivina) el tipo y ya no te dejará cambiarlo.

```typescript
let ciudad = "CDMX"; // TS asume que es 'string'
// ciudad = 123; <--- Error: No se puede asignar un número a un string.
```
**Consejo:** No es necesario tipar absolutamente todo. Si la asignación es obvia, deja que la inferencia haga su trabajo para mantener el código limpio.

## 2.3 Arrays y Tuplas

### Arrays (Listas)
Hay dos formas de definir que una lista solo debe contener un tipo de dato. La primera es la más común:

```typescript
// Opción A (Recomendada)
let lenguajes: string[] = ['TypeScript', 'JavaScript', 'Python'];

// Opción B (Genéricos)
let puntuaciones: Array<number> = [10, 8, 9.5];
```

### Tuplas
Una tupla es un array con un **número fijo de elementos** y donde cada posición tiene un **tipo específico**. Es muy útil para coordenadas o respuestas de estado.

```typescript
let persona: [string, number] = ["Aldair", 28];
// persona = [28, "Aldair"]; <--- Error: El orden importa.
```


## 2.4 Enums (Enumeraciones)
Los `enums` nos permiten definir un conjunto de constantes con nombre. Hacen que el código sea mucho más legible que usar simples números o strings sueltos.

```typescript
enum EstadoProyecto {
  Planeacion, // 0
  Desarrollo,  // 1
  Terminado    // 2
}

let estadoActual: EstadoProyecto = EstadoProyecto.Desarrollo;

if (estadoActual === EstadoProyecto.Desarrollo) {
  console.log("El código está en proceso...");
}
```

## 2.5 Any vs Unknown vs Never (Los tipos especiales)

Es vital entender cuándo usar estos tipos para no romper la seguridad que nos da TypeScript.

1.  **`any`**: Es "la salida de emergencia". Le dice a TS que ignore el tipado por completo. **Evítalo siempre que puedas**, ya que anula las ventajas de usar TypeScript.
2.  **`unknown`**: Es una versión segura de `any`. Te dice: "No sé qué es esto todavía". A diferencia de `any`, no te dejará usar la variable hasta que compruebes qué tipo es (mediante un `if`).
3.  **`never`**: Representa valores que **nunca** deberían ocurrir. Se usa principalmente en funciones que lanzan errores o que tienen bucles infinitos.

## 2.6 Union Types (Uniones de tipos)
A veces, una variable puede ser de más de un tipo. Para eso usamos el símbolo de tubería `|`.

```typescript
let id: string | number;
id = 101;      // Válido
id = "U-789";  // Válido
```

## 🛠️ Ejercicio de Práctica para tu `main.ts`:
Para aplicar esto en tu proyecto de Vite, borra el contenido de `src/main.ts` y prueba a crear un objeto que represente un videojuego o un equipo de fútbol utilizando lo aprendido:

```typescript
// Ejemplo de aplicación
type EstadoPartido = 'pendiente' | 'jugando' | 'finalizado';

let equipoNombre: string = "FC TypeScript";
let jugadores: string[] = ["Nico", "Santi", "Leo"];
let marcador: [number, number] = [0, 0];
let estado: EstadoPartido = 'pendiente';

console.log(`El equipo ${equipoNombre} tiene el estado: ${estado}`);
```