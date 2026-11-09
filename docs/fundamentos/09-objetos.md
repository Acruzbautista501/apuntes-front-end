
# Módulo 9. Objetos

Hasta ahora has agrupado elementos en listas planas (*arrays*), como una lista de nombres de productos o un conjunto de precios. Sin embargo, en el mundo real la información tiene múltiples atributos relacionados entre sí: un producto no es solo un nombre o un precio; tiene un nombre, un precio, una categoría, un stock disponible y una descripción.

Para modelar entidades complejas del mundo real utilizamos los **Objetos**.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Comprender** qué es un objeto y cómo se diferencia de un array.
- **Crear y estructurar** objetos utilizando la notación literal de llaves `{}`.
- **Acceder y modificar** las propiedades de un objeto (notación de punto y de corchetes).
- **Combinar** objetos dentro de arreglos para modelar catálogos y bases de datos sencillas.
- **Iterar** sobre listas de objetos para resolver problemas prácticos de *e-commerce*.

## 1. ¿Qué es un objeto?

Imagina la ficha de información de un producto en una tienda en línea. Contiene varias características, donde cada una tiene una etiqueta (clave) y un valor asociado.

Un objeto en JavaScript es una estructura de datos que te permite almacenar colecciones de propiedades en forma de pares clave-valor (*key-value*).

Ejemplo básico de un objeto que modela un producto:

```javascript
const producto = {
  nombre: "Teclado Mecánico",
  precio: 850,
  disponible: true,
  categoria: "Accesorios"
};

console.log(producto);

```

**Resultado en consola:**

```text
{ nombre: 'Teclado Mecánico', precio: 850, disponible: true, categoria: 'Accesorios' }

```

## 2. Accediendo y modificando propiedades

Existen dos formas principales para consultar los valores almacenados dentro de un objeto:

### A. Notación de punto (La más recomendada y común)

Utilizas el nombre de la variable del objeto seguido de un punto `.` y el nombre exacto de la propiedad.

```javascript
console.log(producto.nombre); // "Teclado Mecánico"
console.log(producto.precio); // 850

```

### B. Notación de corchetes `[]`

Utilizas corchetes y la clave expresada como un string. Es especialmente útil cuando el nombre de la propiedad contiene espacios o cuando necesitas evaluar una variable dinámica.

```javascript
console.log(producto["categoria"]); // "Accesorios"

```

### Modificando o agregando propiedades

Puedes cambiar el valor de una propiedad existente o crear una nueva simplemente asignándole un valor mediante `=`:

```javascript
let usuario = {
  nombre: "Carlos",
  puntos: 120
};

// Modificar una propiedad existente
usuario.puntos = 150;

// Agregar una nueva propiedad
usuario.correo = "carlos@email.com";

console.log(usuario);

```

**Resultado:**

```text
{ nombre: 'Carlos', puntos: 150, correo: 'carlos@email.com' }

```

## 3. Combinando Objetos y Arrays (Estructuras del mundo real)

La verdadera potencia del desarrollo web se despliega cuando combinamos ambas estructuras: un array que contiene objetos, o un objeto que contiene arrays.

Esta es exactamente la estructura que utilizas cuando consumes datos de una base de datos o de una API.

**Ejemplo:** Un catálogo de productos en una tienda:

```javascript
const catalogoTienda = [
  { id: 1, nombre: "Teclado", precio: 350, stock: 12 },
  { id: 2, nombre: "Mouse", precio: 180, stock: 25 },
  { id: 3, nombre: "Monitor", precio: 2500, stock: 4 },
  { id: 4, nombre: "Audífonos", precio: 420, stock: 0 }
];

```

## 4. Ejemplo práctico: Procesando un catálogo con métodos de Arrays

Podemos aplicar los métodos que aprendiste en el módulo anterior (`filter()`, `map()`, `find()`) directamente sobre un arreglo de objetos para resolver problemas cotidianos de una aplicación.

### Ejemplo 1: Filtrar únicamente los productos que tienen stock disponible (`stock > 0`)

```javascript
const catalogoTienda = [
  { id: 1, nombre: "Teclado", precio: 350, stock: 12 },
  { id: 2, nombre: "Mouse", precio: 180, stock: 25 },
  { id: 3, nombre: "Monitor", precio: 2500, stock: 4 },
  { id: 4, nombre: "Audífonos", precio: 420, stock: 0 }
];

const productosDisponibles = catalogoTienda.filter((item) => item.stock > 0);
console.log("Productos disponibles para compra:", productosDisponibles);

```

### Ejemplo 2: Buscar un producto específico por su ID utilizando `find()`

```javascript
const productoBuscado = catalogoTienda.find((item) => item.id === 3);

console.log("Producto encontrado:", productoBuscado.nombre);
console.log("Precio:", productoBuscado.precio);

```

**Resultado:**

```text
Producto encontrado: Monitor
Precio: 2500

```

## 5. Experimenta

Crea un archivo de pruebas en tu entorno de desarrollo y ejecuta el siguiente bloque:

```javascript
const carritoCompras = [
  { producto: "Cuaderno", precio: 45, cantidad: 2 },
  { producto: "Lápiz", precio: 12, cantidad: 5 },
  { producto: "Mochila", precio: 350, cantidad: 1 }
];

// Recorrer el carrito para mostrar el resumen de cada artículo
carritoCompras.forEach((item) => {
  const subtotal = item.precio * item.cantidad;
  console.log(`${item.cantidad}x ${item.producto} — Subtotal: $${subtotal}`);
});

```

::: tip Preguntas para reflexionar

1. ¿Cómo calcularías el costo total de toda la compra sumando los subtotales de cada objeto del carrito? (Pista: puedes usar un ciclo `for...of` o acumular valores).
2. ¿Qué pasaría si intentas acceder a `item.marca` sabiendo que esa propiedad no fue definida en los objetos? (Devolverá `undefined`).
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Confundir arrays con objetos.**
Los arrays utilizan índices numéricos ordenados y se encierran entre corchetes `[]`. Los objetos utilizan claves de texto descriptivas y se encierran entre llaves `{}`.
* **Error 2: Olvidar las comas entre propiedades de un objeto.**
Cada par de clave-valor dentro de un objeto debe separarse obligatoriamente por una coma `,`. Omitirla provocará un error de sintaxis en la consola.
* **Error 3: Intentar acceder a una propiedad de `undefined`.**
Si buscas un elemento con `find()` que no existe, el resultado será `undefined`. Si luego intentas leer una propiedad de ese resultado (ej. `resultado.precio`), la aplicación se detendrá con un error crítico. Asegúrate siempre de validar que el objeto exista.
:::

## 7. Ejercicios prácticos

### Ejercicio 1: Perfil de usuario estructurado

Crea un objeto llamado `usuarioPerfil` que contenga las siguientes propiedades:

* `nombre` (string)
* `correo` (string)
* `esActivo` (booleano)
* `direcciones` (un array de strings con dos ciudades).

1. Muestra en la consola un mensaje utilizando los datos del objeto (ej. `"El usuario Carlos vive en..."`).
2. Modifica el estado de `esActivo` a `false` y añade una tercera dirección al array interno utilizando `push()`.

### Ejercicio 2: Sistema de gestión de inventario

Dado el siguiente arreglo de objetos:

```javascript
const inventario = [
  { id: 101, producto: "Laptop", precio: 15000, stock: 3 },
  { id: 102, producto: "Mousepad", precio: 150, stock: 40 },
  { id: 103, producto: "Teclado Gamer", precio: 1200, stock: 8 },
  { id: 104, producto: "Silla Ergonómica", precio: 4500, stock: 0 }
];

```

1. Utiliza `filter()` para obtener únicamente los productos cuyo precio sea menor a $2,000.
2. Muestra los nombres de dichos productos económicos en la consola.

## 8. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Objeto** | Estructura de datos basada en pares clave-valor para modelar entidades complejas. |
| **Notación de punto** | Forma estándar de acceder a las propiedades de un objeto (`objeto.propiedad`). |
| **Arrays de objetos** | Combinación ideal para estructurar catálogos, listas de usuarios e inventarios. |
| **Métodos aplicados** | Permiten buscar y filtrar colecciones complejas combinando `filter()` o `find()`. |

::: tip ¡Siguiente paso!
Antes de avanzar al siguiente módulo, asegúrate de dominar cómo crear objetos y cómo extraer información de un arreglo de objetos. En el Módulo 10 profundizaremos en conceptos avanzados de Scope y closures.
:::