
# Módulo 7. Funciones

A medida que tus programas crecen, comenzarás a notar que escribes las mismas operaciones una y otra vez: calcular un impuesto, formatear un precio o validar un acceso. Duplicar código es una mala práctica que hace que las aplicaciones sean difíciles de mantener y propensas a errores.

Las **funciones** son bloques de código autocontenidos y reutilizables diseñados para realizar una tarea específica.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Comprender** qué es una función y por qué es el pilar de la organización en JavaScript.
- **Declarar** funciones utilizando la sintaxis moderna (*arrow functions*).
- **Pasar información** hacia una función mediante parámetros (entradas).
- **Devolver resultados** desde una función utilizando la instrucción `return` (salidas).
- **Diferenciar** el comportamiento del código reutilizable frente al código repetido.

## 1. ¿Qué es una función?

Imagina una máquina expendedora o una calculadora científica. Le introduces ciertos datos de entrada (por ejemplo, dos números), la máquina realiza un proceso interno oculto y te devuelve un resultado listo para usar.

En programación, una **función** funciona exactamente igual: es una subrutina o bloque de instrucciones al que le asignamos un nombre. Una vez creada, puedes "llamarla" o invocarla tantas veces como necesites sin tener que reescribir su código interno.

Ejemplo básico de una función declarada:

```javascript
// Definición de la función
function saludarUsuario() {
  console.log("¡Hola, bienvenido a la plataforma!");
}

// Invocación (ejecución de la función)
saludarUsuario();
saludarUsuario();

```

**Resultado en consola:**

```text
¡Hola, bienvenido a la plataforma!
¡Hola, bienvenido a la plataforma!

```

## 2. Funciones con parámetros (Entradas)

Las funciones se vuelven verdaderamente potentes cuando pueden aceptar datos externos para personalizar su comportamiento. A estos datos de entrada los llamamos **parámetros**.

Observa cómo adaptamos el saludo para que reciba el nombre del usuario:

```javascript
function saludarPersonalizado(nombre) {
  console.log(`¡Hola, ${nombre}! Bienvenido a la plataforma.`);
}

saludarPersonalizado("Carlos");
saludarPersonalizado("Sofía");

```

**Resultado:**

```text
¡Hola, Carlos! Bienvenido a la plataforma.
¡Hola, Sofía! Bienvenido a la plataforma.

```

### Parámetros múltiples

Una función puede recibir tantos parámetros como necesites, separados por comas.

**Ejemplo:** Calcular el subtotal de un producto multiplicando su precio por su cantidad.

```javascript
function calcularSubtotal(precio, cantidad) {
  const total = precio * cantidad;
  console.log("Subtotal calculado:", total);
}

calcularSubtotal(150, 3); // Precio 150, Cantidad 3
calcularSubtotal(450, 2); // Precio 450, Cantidad 2

```

**Resultado:**

```text
Subtotal calculado: 450
Subtotal calculado: 900

```

## 3. Retorando valores con `return`

Hasta ahora, nuestras funciones imprimen los resultados directamente en la consola usando `console.log`. Sin embargo, en una aplicación real, las funciones suelen calcular un dato y devolverlo para que otra parte del programa pueda utilizarlo, guardarlo en una variable o enviarlo a una base de datos.

Para enviar un resultado de vuelta utilizamos la instrucción `return`.

```javascript
function calcularIVA(monto) {
  const iva = monto * 0.16;
  return iva; // Devolvemos el resultado hacia el exterior
}

const precioProducto = 500;
const impuestoCalculado = calcularIVA(precioProducto);

console.log("El impuesto correspondiente es:", impuestoCalculado);

```

**Resultado:**

```text
El impuesto correspondiente es: 80

```

::: warning Regla de oro
Cuando JavaScript encuentra la instrucción `return`, la función se detiene inmediatamente y devuelve el valor especificado. Cualquier código escrito por debajo de `return` dentro de esa misma función será ignorado.
:::

## 4. Sintaxis moderna: Arrow Functions (Funciones flecha)

En el desarrollo web moderno con JavaScript (y especialmente en frameworks como Vue.js o React), es muy común utilizar una sintaxis más limpia y compacta conocida como **funciones flecha** (*arrow functions*).

Observa la equivalencia:

::: code-group

```js [Forma tradicional]
function sumar(a, b) {
  return a + b;
}

```

```js [Forma moderna (Arrow Function)]
const sumar = (a, b) => {
  return a + b;
};

console.log(sumar(10, 20)); // 30

```

:::

### Retorno implícito

Si tu función flecha realiza una sola operación y devuelve su resultado de inmediato, puedes omitir las llaves `{}` y la palabra `return` para escribirlo en una sola línea muy limpia:

```javascript
const multiplicar = (a, b) => a * b;

console.log(multiplicar(5, 4)); // 20

```

## 5. Ejemplo práctico: Sistema modular de compras

Vamos a juntar lo aprendido en una función reutilizable que calcula el total final de una compra aplicando un descuento opcional.

```javascript
const calcularTotalCompra = (subtotal, porcentajeDescuento) => {
  const descuento = subtotal * (porcentajeDescuento / 100);
  const totalFinal = subtotal - descuento;
  return totalFinal;
};

// Simulando distintas compras
const compraCliente1 = calcularTotalCompra(1000, 10); // $1000 con 10% de descuento
const compraCliente2 = calcularTotalCompra(450, 0);   // $450 sin descuento

console.log("Total cliente 1:", compraCliente1);
console.log("Total cliente 2:", compraCliente2);

```

**Resultado:**

```text
Total cliente 1: 900
Total cliente 2: 450

```

## 6. Experimenta

Crea un archivo de pruebas o abre tu consola y ejecuta el siguiente bloque:

```javascript
const convertirCelsiusAFahrenheit = (gradosCelsius) => {
  const fahrenheit = (gradosCelsius * 9/5) + 32;
  return fahrenheit;
};

console.log("0 °C en Fahrenheit:", convertirCelsiusAFahrenheit(0));
console.log("25 °C en Fahrenheit:", convertirCelsiusAFahrenheit(25));

```

::: tip Preguntas para reflexionar

1. ¿Qué pasaría si intentas acceder a la variable `fahrenheit` fuera de la función (ej. escribiendo `console.log(fahrenheit)`)? (Piénsalo: las variables creadas dentro de una función tienen un alcance local y no existen en el exterior).
2. ¿Cómo modificarías la función para convertir grados Fahrenheit a Celsius?
:::


## 7. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Olvidar el `return`.**
Si escribes una función para calcular un valor pero olvidas colocar `return`, la función devolverá `undefined` por defecto, lo que generará errores al intentar operar con ese resultado en otras variables.
* **Error 2: Confundir parámetros con argumentos.**
Los parámetros son las variables definidas al declarar la función (`function(a, b)`), mientras que los argumentos son los valores reales que le pasas al invocarla (`sumar(5, 10)`).
* **Error 3: Escribir código después del `return`.**
Recuerda que `return` finaliza la ejecución de la función. Cualquier instrucción colocada por debajo de él en el mismo bloque nunca se ejecutará.
:::

## 8. Ejercicios prácticos

### Ejercicio 1: Calculadora de área de un rectángulo

Crea una *arrow function* llamada `calcularArea` que reciba dos parámetros: `base` y `altura`.

1. La función debe multiplicar la base por la altura y retornar el resultado.
2. Invoca la función con distintos valores (ej. base 5 y altura 10) y muestra el resultado en la consola.

### Ejercicio 2: Validador de mayoría de edad

Crea una función flecha llamada `esMayorDeEdad` que reciba un número (`edad`).

1. Debe evaluar si la edad es mayor o igual a 18.
2. Debe retornar un valor booleano (`true` si es mayor, `false` si es menor).
3. Prueba la función con distintas edades y muestra mensajes personalizados según el resultado.

## 9. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Función** | Bloque de código autocontenido diseñado para realizar una tarea reutilizable. |
| **Parámetros** | Datos de entrada que recibe la función para personalizar su ejecución. |
| **`return`** | Instrucción obligatoria para devolver un resultado hacia el exterior de la función. |
| **Arrow Function** | Sintaxis moderna y limpia para declarar funciones utilizando flechas `=>`. |

::: tip ¡Siguiente paso!
Antes de avanzar al siguiente módulo, asegúrate de comprender la diferencia entre imprimir con `console.log` y devolver un valor con `return`. En el Módulo 8 exploraremos cómo manipular colecciones de datos avanzadas mediante Arrays y métodos.
:::