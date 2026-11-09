
# Módulo 11. Referencias e inmutabilidad

Hasta ahora has aprendido cómo funcionan las variables, los tipos de datos y los objetos. Sin embargo, a medida que comiences a construir aplicaciones interactivas (como un carrito de compras o un gestor de estados), te enfrentarás a un comportamiento de JavaScript que suele sorprender a los desarrolladores principiantes: los objetos y arreglos no se copian, se referencian.

Modificar un objeto o un arreglo de manera incorrecta puede alterar datos originales sin que te des cuenta, generando errores catastróficos en tu aplicación.

## ¿Qué aprenderás?

En este módulo aprenderás a:

* **Comprender** la diferencia fundamental entre los tipos primitivos (por valor) y los objetos/arrays (por referencia).
* **Entender** qué es la inmutabilidad y por qué es una regla de oro en el desarrollo moderno.
* **Aprender** a copiar y actualizar objetos y arreglos de forma segura utilizando el operador de propagación (*spread operator* `...`).

## 1. Tipos primitivos vs. Referencias en memoria

Para entender cómo maneja JavaScript la memoria, debemos distinguir entre dos categorías de datos:

### A. Asignación por valor (Tipos primitivos)

Los tipos primitivos (`string`, `number`, `boolean`) se almacenan directamente por su valor. Cuando copias una variable primitiva en otra, se crea una copia totalmente independiente en la memoria.

```javascript
let precioOriginal = 500;
let precioDescuento = precioOriginal; // Copia el valor exacto

precioDescuento = 400; // Modificamos la copia

console.log("Original:", precioOriginal);  // 500 (No cambia)
console.log("Descuento:", precioDescuento); // 400

```

### B. Asignación por referencia (Arrays y Objetos)

Con los arreglos y los objetos ocurre algo completamente distinto. Cuando asignas un objeto a otra variable, no estás copiando su contenido, sino una **referencia** (un puntero) que apunta a la misma dirección exacta en la memoria de la computadora.

```javascript
const carritoOriginal = ["Teclado", "Mouse"];
const carritoCopia = carritoOriginal; // Copia la REFERENCIA, no el contenido

// Agregamos un producto a la "copia"
carritoCopia.push("Monitor");

console.log("Copia:", carritoCopia);         // ["Teclado", "Mouse", "Monitor"]
console.log("Original:", carritoOriginal);   // 🛒 ¡Sorpresa! El original también cambió

```

::: warning ¿Qué sucedió?
Ambas variables (`carritoOriginal` y `carritoCopia`) apuntaban exactamente al mismo espacio en memoria. Modificar una afectó directamente a la otra. Este comportamiento es la causa número uno de bugs extraños en aplicaciones web.
:::

## 2. ¿Qué es la inmutabilidad?

La **inmutabilidad** es un principio de programación que establece que los datos no deben ser modificados directamente una vez creados.

En lugar de alterar un objeto o un arreglo existente (mutarlo), la práctica recomendada consiste en crear una copia completamente nueva aplicando los cambios necesarios. Esto garantiza que el estado original permanezca intacto, haciendo que el comportamiento de tu aplicación sea predecible, fácil de depurar y compatible con frameworks modernos.

## 3. Copiando y actualizando de forma segura: El operador Spread (`...`)

En JavaScript moderno, la herramienta más potente y elegante para lograr la inmutabilidad es el operador de propagación (*spread operator*, representado por tres puntos `...`).

El operador `...` "desempaqueta" o extrae todas las propiedades de un objeto o elementos de un arreglo dentro de uno nuevo.

### A. Inmutabilidad en Arrays (Arreglos)

En lugar de usar `push()` directamente sobre el arreglo original, creamos un nuevo arreglo combinando los elementos anteriores con el nuevo elemento:

```javascript
const carritoOriginal = ["Teclado", "Mouse"];

// Creamos un NUEVO arreglo agregando el elemento al final (Inmutable)
const carritoNuevo = [...carritoOriginal, "Monitor"];

console.log("Original:", carritoOriginal); // ["Teclado", "Mouse"] (Intacto)
console.log("Nuevo:", carritoNuevo);       // ["Teclado", "Mouse", "Monitor"]

```

### B. Inmutabilidad en Objetos

Para actualizar la propiedad de un objeto sin modificar el original, utilizamos el mismo principio de propagación:

```javascript
const usuario = {
  nombre: "Carlos",
  puntos: 100,
  nivel: "Básico"
};

// Actualizamos el nivel y los puntos creando un nuevo objeto
const usuarioActualizado = {
  ...usuario,       // Copia todas las propiedades anteriores
  puntos: 150,      // Sobrescribe el valor de puntos
  nivel: "Avanzado" // Sobrescribe el nivel
};

console.log("Usuario original:", usuario);           // { nombre: 'Carlos', puntos: 100, nivel: 'Básico' }
console.log("Usuario actualizado:", usuarioActualizado); // { nombre: 'Carlos', puntos: 150, nivel: 'Avanzado' }

```

## 4. Ejemplo práctico: Actualizando un carrito de compras sin mutar datos

Imagina que necesitas actualizar la cantidad de un producto específico dentro de un arreglo de objetos que simula un carrito de compras.

Para mantener la inmutabilidad, recorremos el arreglo usando `map()`. Si el producto coincide con el ID que buscamos, devolvemos un nuevo objeto con la cantidad actualizada; de lo contrario, devolvemos el objeto original intacto.

```javascript
const carrito = [
  { id: 1, producto: "Cuaderno", cantidad: 2 },
  { id: 2, producto: "Lápiz", cantidad: 5 }
];

// Queremos actualizar la cantidad del Cuaderno (id: 1) a 4 unidades
const productoIdBuscado = 1;
const nuevaCantidad = 4;

const carritoActualizado = carrito.map((item) => {
  if (item.id === productoIdBuscado) {
    // Retornamos un nuevo objeto con la propiedad modificada de forma inmutable
    return {
      ...item,
      cantidad: nuevaCantidad
    };
  }
  // Si no es el elemento buscado, lo devolvemos tal cual
  return item;
});

console.log("Carrito original:", carrito);
console.log("Carrito actualizado:", carritoActualizado);

```

**Resultado en consola:**

```text
Carrito original: [ { id: 1, producto: 'Cuaderno', cantidad: 2 }, { id: 2, producto: 'Lápiz', cantidad: 5 } ]
Carrito actualizado: [ { id: 1, producto: 'Cuaderno', cantidad: 4 }, { id: 2, producto: 'Lápiz', cantidad: 5 } ]

```

Observa que el carrito original conservó sus valores intactos, mientras que `carritoActualizado` generó la nueva estructura con seguridad.

## 5. Experimenta

Crea un archivo de pruebas en tu entorno y ejecuta el siguiente bloque:

```javascript
const configuracionServidor = {
  host: "localhost",
  puerto: 3000,
  modoDebug: false
};

// Crear una versión de producción de forma inmutable
const configuracionProduccion = {
  ...configuracionServidor,
  host: "api.miempresa.com",
  modoDebug: true
};

console.log("Desarrollo:", configuracionServidor);
console.log("Producción:", configuracionProduccion);

```

::: tip Preguntas para reflexionar

1. ¿Por qué cambiar `host` en `configuracionProduccion` no alteró el valor de `configuracionServidor`? (Piénsalo: el operador `...` creó un objeto totalmente independiente en memoria).
2. ¿Qué sucedería si intentaras modificar directamente una propiedad con `configuracionServidor.puerto = 8080;`? (Mutarías el objeto original directamente).
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Asignar objetos con `=` esperando hacer una copia independiente.**
Creer que escribir `const copia = original` crea un objeto nuevo. Recuerda que solo estás copiando la referencia en memoria.
* **Error 2: Mutar objetos anidados con un spread superficial (*shallow copy*).**
El operador `...` realiza una copia superficial. Si tu objeto contiene otros objetos o arreglos dentro, esos niveles internos seguirán compartiendo referencia a menos que apliques copias en profundidad (*deep copy*).
* **Error 3: Modificar estados directamente en interfaces interactivas.**
Alterar propiedades de arreglos u objetos sin inmutabilidad suele provocar que las interfaces de usuario no se actualicen correctamente o pierdan el rastro de los cambios de estado.
:::

## 7. Ejercicios prácticos

### Ejercicio 1: Actualización de perfil de usuario inmutable

Dado el siguiente objeto base:

```javascript
const perfil = {
  nombre: "Sofía",
  correo: "sofia@email.com",
  rol: "invitado"
};

```

1. Utiliza el operador de propagación (`...`) para crear un nuevo objeto llamado `perfilPro` que mantenga los datos anteriores, pero cambie el rol a `"administrador"` y agregue una nueva propiedad `activo: true`.
2. Muestra ambos objetos en la consola para comprobar que el objeto original no fue mutado.

### Ejercicio 2: Adición inmutable a una lista de deseos

Dado el arreglo:

```javascript
const listaDeseos = ["Monitor", "Teclado Mecánico"];

```

1. Utiliza el operador `...` para crear un nuevo arreglo llamado `listaActualizada` que incluya los elementos anteriores más el elemento `"Audífonos Inalámbricos"`.
2. Muestra ambos arreglos en la consola.

## 8. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Asignación por referencia** | Los objetos y arrays apuntan a una dirección en memoria; copiarlos con `=` comparte la misma referencia. |
| **Inmutabilidad** | Principio de no alterar datos existentes, sino crear copias nuevas con los cambios requeridos. |
| **Operador Spread (`...`)** | Herramienta moderna para desempaquetar y copiar propiedades de objetos y elementos de arreglos de forma segura. |

::: tip ¡Siguiente paso!
Antes de avanzar al siguiente módulo, asegúrate de comprender cómo el operador `...` previene que modifiques datos originales por accidente. En el Módulo 12 profundizaremos en Estructuras de datos y algoritmos.
:::