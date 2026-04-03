
# Módulo 3: Control de Flujo y Lógica

En programación, el control de flujo es el orden en que se ejecutan las instrucciones. TypeScript nos da herramientas para decidir qué código se ejecuta (condicionales) y cuántas veces debe repetirse (bucles).

## 3.1 Estructuras Condicionales

### El bloque `if / else`
Es la forma más básica de tomar una decisión. Evalúa una expresión booleana (`true` o `false`).

```typescript
const edad: number = 18;

if (edad >= 18) {
  console.log("Acceso concedido.");
} else {
  console.log("Acceso denegado.");
}
```

### El bloque `switch`
Cuando tienes muchas condiciones basadas en un solo valor, el `switch` es más limpio y organizado que encadenar muchos `if else`.

```typescript
enum Rol { Admin, Editor, Invitado }
const usuario: Rol = Rol.Admin;

switch (usuario) {
  case Rol.Admin:
    console.log("Tienes control total.");
    break;
  case Rol.Editor:
    console.log("Puedes modificar contenido.");
    break;
  default:
    console.log("Solo puedes ver.");
}
```

## 3.2 Operadores Lógicos Avanzados

TypeScript (y el JavaScript moderno) ofrecen formas ultra rápidas de manejar lógica:

* **Operador Ternario (`? :`)**: Un `if/else` en una sola línea.
    `const mensaje = (puntos > 50) ? "Ganaste" : "Perdiste";`
* **Cortocircuito `&&`**: Ejecuta la segunda parte solo si la primera es verdadera.
    `usuarioLogueado && mostrarPerfil();`
* **Nullish Coalescing (`??`)**: Devuelve el valor de la derecha solo si el de la izquierda es `null` o `undefined`. Es perfecto para asignar valores por defecto.
    `const nombre = usuario.alias ?? "Anónimo";`


## 3.3 Bucles e Iteración

### Bucles Tradicionales
* **`for`**: Ideal cuando sabes exactamente cuántas veces quieres repetir algo.
* **`while`**: Se ejecuta mientras una condición sea verdadera (cuidado con los bucles infinitos).

### Iteración Moderna de Arrays (Imprescindible)
Como desarrollador Frontend, pasarás el 80% de tu tiempo transformando listas de datos. Estos métodos son tus mejores amigos:

1.  **`.forEach()`**: Solo recorre el array (para mostrar algo en consola o DOM).
2.  **`.map()`**: Crea un **nuevo array** transformando cada elemento. Es el más usado en frameworks como Vue o React.
3.  **`.filter()`**: Crea un nuevo array solo con los elementos que cumplen una condición.
4.  **`.reduce()`**: Reduce todo el array a un solo valor (como sumar todos los precios de un carrito).

```typescript
const precios: number[] = [100, 250, 500, 1000];

// Filtrar productos caros
const caros = precios.filter(p => p > 400); // [500, 1000]

// Aplicar un descuento del 10% a todos
const conDescuento = precios.map(p => p * 0.9);
```

## 3.4 Estrechamiento de Tipos (Type Narrowing)

Esta es la magia de TypeScript en la lógica. Si tienes una unión de tipos (ej. `string | number`), TS no te dejará usar métodos de `string` hasta que "asegures" qué tipo es.

```typescript
function procesarId(id: string | number) {
  if (typeof id === "string") {
    // Aquí adentro, TS sabe que 'id' es un string
    console.log(id.toUpperCase()); 
  } else {
    // Aquí adentro, TS sabe que 'id' es un número
    console.log(id.toFixed(2));
  }
}
```

## 🛠️ Reto de Práctica para tu Proyecto:
En tu archivo `main.ts`, intenta simular la lógica de una liga de fútbol sencilla:

```typescript
interface Equipo {
  nombre: string;
  puntos: number;
}

const liga: Equipo[] = [
  { nombre: "Tigres", puntos: 10 },
  { nombre: "Rayados", puntos: 15 },
  { nombre: "América", puntos: 8 }
];

// 1. Filtrar equipos con más de 9 puntos
const clasificados = liga.filter(equipo => equipo.puntos > 9);

// 2. Mostrar en consola usando forEach
clasificados.forEach(e => {
  console.log(`Equipo clasificado: ${e.nombre}`);
});
```