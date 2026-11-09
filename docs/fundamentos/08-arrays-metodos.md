
# Módulo 8. Arrays y métodos

Hasta este momento has trabajado con variables que guardan un solo dato a la vez. Sin embargo, las aplicaciones reales manejan colecciones completas de información: la lista de productos de un carrito de compras, los usuarios registrados en un sistema o el inventario de una tienda.

Para gestionar estas colecciones de forma ordenada utilizamos los **Arrays** (o arreglos), junto con sus métodos de iteración, los cuales te permiten buscar, filtrar, transformar y ordenar elementos sin necesidad de escribir ciclos manuales complejos.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Crear y manipular** estructuras de datos en forma de arreglos (Arrays).
- **Agregar y remover** elementos de una lista.
- **Utilizar** el método `forEach()` para recorrer elementos.
- **Transformar** arreglos utilizando `map()`.
- **Filtrar** información con `filter()`.
- **Buscar** elementos específicos con `find()` e `includes()`.

## 1. ¿Qué es un Array?

Un Array es una lista ordenada de valores almacenados bajo un mismo nombre de variable. Cada elemento dentro del arreglo ocupa una posición fija numerada llamada **índice**, comenzando siempre desde la posición `0`.

```javascript
const productos = ["Teclado", "Mouse", "Monitor", "Audífonos"];

// Acceder a elementos mediante su índice:
console.log(productos[0]); // Teclado
console.log(productos[2]); // Monitor

// Conocer cuántos elementos contiene el arreglo:
console.log(productos.length); // 4

```

## 2. Modificando un Array: Agregar y eliminar elementos

JavaScript proporciona métodos integrados para alterar el contenido de un arreglo de forma dinámica:

* **`push()`**: Agrega uno o más elementos al final del arreglo.
* **`pop()`**: Elimina el último elemento del arreglo.
* **`unshift()`**: Agrega un elemento al inicio del arreglo.
* **`shift()`**: Elimina el primer elemento del arreglo.

```javascript
const carrito = ["Teclado", "Mouse"];

// Agregar elementos al final
carrito.push("Monitor");
console.log(carrito); // ["Teclado", "Mouse", "Monitor"]

// Eliminar el último elemento
carrito.pop();
console.log(carrito); // ["Teclado", "Mouse"]

```

## 3. Métodos modernos de iteración y búsqueda

Aunque puedes recorrer un arreglo usando un ciclo `for...of`, JavaScript ofrece métodos de arreglos que reciben funciones como argumentos (*callbacks*) para realizar operaciones comunes de forma más clara y concisa.

### A. Recorrer elementos con `forEach()`

Ejecuta una función por cada elemento del arreglo. Se utiliza para realizar acciones sin transformar el arreglo original.

```javascript
const productos = ["Teclado", "Mouse", "Monitor"];

productos.forEach((producto, indice) => {
  console.log(`${indice + 1}. ${producto}`);
});

```

**Resultado en consola:**

```text
1. Teclado
2. Mouse
3. Monitor

```

### B. Transformar datos con `map()`

Crea un **nuevo arreglo** con los resultados de aplicar una función a cada uno de los elementos del arreglo original.

```javascript
const precios = [100, 200, 300];

// Aplicar un 10% de descuento a todos los precios
const preciosConDescuento = precios.map((precio) => precio * 0.90);

console.log("Precios originales:", precios); // [100, 200, 300]
console.log("Precios con descuento:", preciosConDescuento); // [90, 180, 270]

```

### C. Filtrar elementos con `filter()`

Crea un **nuevo arreglo** únicamente con los elementos que cumplan una condición dada (`true`).

```javascript
const precios = [450, 1200, 890, 320, 1500];

// Obtener solo los precios mayores a $500
const preciosAltos = precios.filter((precio) => precio > 500);

console.log(preciosAltos); // [1200, 890, 1500]

```

### D. Buscar elementos con `find()` e `includes()`

* **`includes()`**: Devuelve `true` o `false` dependiendo de si un elemento existe en el arreglo.
* **`find()`**: Devuelve el primer elemento que cumpla con la condición especificada. Si ninguno coincide, devuelve `undefined`.

```javascript
const frutas = ["manzana", "banana", "pera"];

// Verificar existencia
console.log(frutas.includes("banana")); // true
console.log(frutas.includes("uva")); // false

const precios = [150, 320, 800, 450];

// Encontrar el primer precio mayor a $300
const primerPrecioAlto = precios.find((precio) => precio > 300);
console.log(primerPrecioAlto); // 320

```

## 4. Ejemplo práctico: Gestor de catálogo de tienda

Imagina que recibes una lista de precios y necesitas procesarla para presentar un informe:

```javascript
const listaPrecios = [80, 250, 1200, 450, 950, 300];

// 1. Filtrar precios accesibles (menores a $500)
const accesibles = listaPrecios.filter((precio) => precio < 500);

// 2. Aplicar un impuesto del 16% a los productos accesibles
const conImpuesto = accesibles.map((precio) => precio * 1.16);

console.log("Precios menores a $500:", accesibles);
console.log("Precios con IVA incluido:", conImpuesto);

```

**Resultado:**

```text
Precios menores a $500: [80, 250, 450, 300]
Precios con IVA incluido: [92.8, 290, 522, 348]

```

## 5. Experimenta

Crea un archivo de pruebas en tu entorno y ejecuta el siguiente bloque:

```javascript
const calificaciones = [8, 9, 5, 10, 6, 4];

// Filtrar calificaciones aprobatorias (7 o más)
const aprobadas = calificaciones.filter((nota) => nota >= 7);
console.log("Calificaciones aprobatorias:", aprobadas);

```

::: tip Preguntas para reflexionar

1. ¿Qué sucede si aplicas `map()` para agregar 1 punto extra a cada calificación?
2. ¿Qué devuelve `find()` si buscas una calificación igual a 10? ¿Y si buscas una calificación igual a 2?
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Olvidar que el primer índice es `0`.**
Si un arreglo tiene 4 elementos (un `length` de 4), el último elemento está en la posición 3, no en la 4. Acceder a `arreglo[4]` devolverá `undefined`.
* **Error 2: Olvidar retornar un valor dentro de `map()` o `filter()`.**
Si estás usando una función con cuerpo entre llaves `{}` dentro de `map()` o `filter()`, debes escribir explícitamente `return`. Si lo olvidas, el arreglo resultante estará lleno de valores `undefined`.
* **Error 3: Confundir `map()` con `forEach()`.**
Usa `forEach()` únicamente para ejecutar acciones (imprimir, enviar a consola). Usa `map()` cuando necesites obtener un nuevo arreglo transformado.
:::

## 7. Ejercicios prácticos

### Ejercicio 1: Buscador de productos disponibles

Dado el arreglo de productos disponibles:

```javascript
const listaStock = ["Teclado", "Mouse", "Monitor", "Webcam", "Audífonos"];

```

1. Crea una función llamada `buscarProducto` que reciba un nombre de producto como parámetro.
2. Utiliza `includes()` para verificar si el producto existe en `listaStock`.
3. Muestra un mensaje en consola indicando si el producto está disponible o agotado.

### Ejercicio 2: Convertidor de divisas

Dado un arreglo con precios en pesos mexicanos (MXN):

```javascript
const preciosMXN = [100, 500, 1200, 350];

```

1. Utiliza el método `map()` para convertir todos los precios a dólares (USD), asumiendo un tipo de cambio de $20 MXN por $1 USD (`precio / 20`).
2. Guarda el resultado en una constante `preciosUSD` y muéstralo en la consola.

## 8. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Array** | Colección ordenada de valores indexada desde la posición `0`. |
| **`push()` / `pop()**` | Agregan o eliminan elementos al final del arreglo. |
| **`forEach()`** | Recorre los elementos para ejecutar acciones de lectura. |
| **`map()`** | Transforma cada elemento devolviendo un nuevo arreglo de la misma longitud. |
| **`filter()`** | Retorna un nuevo arreglo con los elementos que cumplen una condición. |
| **`find()`** | Devuelve el primer elemento que coincide con una búsqueda. |


::: tip ¡Siguiente paso!
Antes de avanzar, asegúrate de comprender cómo `map()` y `filter()` devuelven nuevos arreglos sin modificar los datos originales. En el Módulo 9 aprenderemos a organizar información compleja combinando Arrays con Objetos.
:::