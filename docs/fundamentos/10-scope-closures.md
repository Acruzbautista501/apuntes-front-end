
# Módulo 10. Scope y closures

A medida que escribes programas más complejos, tus archivos contendrán docenas de variables y funciones. En este punto surge una pregunta crucial: ¿dónde están disponibles mis variables? ¿Puede cualquier parte de mi código modificar cualquier variable?

El *scope* (o alcance) y los *closures* (clausuras) son los mecanismos fundamentales de JavaScript que controlan la visibilidad y el tiempo de vida de las variables.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Comprender** qué es el scope global, de bloque y local (de función).
- **Entender** por qué `let` y `const` resolvieron los problemas del antiguo `var`.
- **Conocer** qué es un closure y cómo permite "recordar" estados privados en JavaScript.
- **Aplicar** closures para construir contadores y funciones especializadas.

## 1. ¿Qué es el Scope (Alcance)?

El *scope* define la accesibilidad o visibilidad de las variables en distintas partes de tu código. En JavaScript existen principalmente tres tipos de alcance:

### A. Scope Global
Una variable declarada fuera de cualquier función o bloque tiene un alcance global. Puede ser leída y modificada desde cualquier lugar del programa.

```javascript
const nombreEmpresa = "TechStore"; // Variable global

function mostrarEmpresa() {
  console.log(nombreEmpresa); // Accesible sin problemas
}

mostrarEmpresa(); // "TechStore"

```

### B. Scope de Bloque (`let` y `const`)

Las variables declaradas con `let` o `const` dentro de un bloque (delimitado por llaves `{}`, como en un `if` o un `for`) solo existen dentro de ese bloque. Intentar acceder a ellas desde el exterior generará un error.

```javascript
if (true) {
  const mensajeSecreto = "Acceso autorizado";
  console.log(mensajeSecreto); // Funciona dentro del bloque
}

// console.log(mensajeSecreto); // ❌ Error: mensajeSecreto is not defined

```

### C. Scope Local (de Función)

Las variables declaradas dentro de una función pertenecen exclusivamente a esa función. Ningún código externo puede acceder a ellas, lo que protege los datos internos de interferencias accidentales.

```javascript
function calcularImpuesto() {
  const tasaLocal = 0.16; // Scope local de función
  return 100 * tasaLocal;
}

calcularImpuesto();
// console.log(tasaLocal); // ❌ Error: tasaLocal no existe fuera de la función

```

## 2. El problema histórico: `var` vs `let` y `const`

Antes de la llegada de JavaScript moderno (ES6), las variables se declaraban exclusivamente con `var`.

`var` no respetaba el scope de bloque (`{}`); si declarabas un `var` dentro de un `if` o un ciclo, la variable "se filtraba" y quedaba disponible en todo el entorno circundante, provocando errores difíciles de rastrear.

::: warning Regla moderna
No utilices jamás `var`. Utiliza siempre `const` por defecto y `let` cuando el valor necesite cambiar. Esto garantiza que tu código mantenga un scope limpio y predecible.
:::

## 3. ¿Qué es un Closure (Clausura)?

Un *closure* es una de las características más potentes y elegantes de JavaScript. Ocurre cuando una función interna "recuerda" y tiene acceso a las variables de su función externa, incluso después de que la función externa haya terminado de ejecutarse y retornado su valor.

Imagina que una función interna crea una "burbuja" de protección alrededor de sus datos, impidiendo que el código externo los modifique directamente, pero permitiendo interactuar con ellos mediante reglas controladas.

### Ejemplo clásico: Un contador privado

```javascript
function crearContador() {
  let contador = 0; // Variable privada protegida

  return function() {
    contador++; // La función interna recuerda y modifica "contador"
    return contador;
  };
}

const incrementar = crearContador();

console.log(incrementar()); // 1
console.log(incrementar()); // 2
console.log(incrementar()); // 3

```

### ¿Cómo funciona este mecanismo?

1. La función `crearContador` se ejecuta y define la variable `contador = 0`.
2. Retorna una función interna anónima. En teoría, cuando una función termina, sus variables locales mueren.
3. Sin embargo, como la función interna necesita acceder a `contador`, JavaScript preserva esa variable en un espacio seguro en memoria llamado *closure*.
4. Cada vez que invocas a `incrementar()`, estás actualizando ese mismo estado interno protegido sin poder alterar el valor directamente desde afuera (no puedes escribir `contador = 50` porque la variable no existe en el scope global).

## 4. Ejemplo práctico: Fábrica de precios con descuento personalizado

Podemos utilizar closures para crear funciones especializadas que conserven una configuración interna.

```javascript
function crearCalculadoraDescuento(porcentajeDescuento) {
  // El parámetro "porcentajeDescuento" queda atrapado en un closure
  return function(precioBase) {
    const descuento = precioBase * (porcentajeDescuento / 100);
    return precioBase - descuento;
  };
}

// Creamos funciones especializadas
const calcularDescuentoVIP = crearCalculadoraDescuento(20);      // 20% de descuento
const calcularDescuentoFrecuente = crearCalculadoraDescuento(10); // 10% de descuento

console.log("Precio VIP:", calcularDescuentoVIP(1000));          // 800
console.log("Precio Frecuente:", calcularDescuentoFrecuente(1000)); // 900

```

**Resultado:**

```text
Precio VIP: 800
Precio Frecuente: 900

```

## 5. Experimenta

Crea un archivo de pruebas en tu entorno y ejecuta el siguiente bloque para observar el aislamiento de scopes:

```javascript
let stockGlobal = 100; // Variable global

function simularVenta(cantidad) {
  let stockGlobal = 10; // Variable local (oculta temporalmente a la global)
  stockGlobal -= cantidad;
  console.log("Stock dentro de la función:", stockGlobal);
}

simularVenta(3);
console.log("Stock en el ámbito global:", stockGlobal);

```

::: tip Preguntas para reflexionar

1. ¿Por qué el `stockGlobal` global no cambió su valor a 7 después de ejecutar la función? (Piénsalo: la variable local dentro de la función creó su propio espacio de memoria independiente).
2. ¿Qué sucedería si eliminamos la palabra `let` dentro de la función (`stockGlobal = 10` sin declaración)? (Modificaría la variable global por error, un fenómeno conocido como variable global implícita).
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Intentar acceder a variables de scope de bloque.**
Declarar una variable con `let` dentro de un ciclo o condicional e intentar leerla fuera de sus llaves `{}`.
* **Error 2: Confundir closures con variables globales.**
Pensar que las variables protegidas por un closure consumen memoria de forma descontrolada o pueden ser alteradas por scripts externos. Los closures garantizan encapsulamiento seguro.
:::


## 7. Ejercicios prácticos

### Ejercicio 1: Generador de IDs únicos

Crea una función llamada `crearGeneradorId` que cumpla con lo siguiente:

1. Contenga una variable interna protegida `let ultimoId = 0;`.
2. Retorne una función interna que, cada vez que sea ejecutada, incremente `ultimoId` en 1 y devuelva el nuevo identificador.
3. Prueba tu generador asignándolo a una constante `generar` y ejecútala tres veces consecutivas mostrando los resultados en consola (ej. 1, 2, 3).

## 8. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Scope (Alcance)** | Reglas que determinan la visibilidad de las variables en el código. |
| **Scope Global** | Variables accesibles desde cualquier lugar del programa. |
| **Scope de Bloque** | Variables limitadas estrictamente al interior de unas llaves `{}` (`let`/`const`). |
| **Closure (Clausura)** | Capacidad de una función interna de recordar y acceder al entorno de su función externa. |


::: tip ¡Siguiente paso!
Antes de avanzar al siguiente módulo, asegúrate de comprender cómo las funciones internas conservan el acceso a las variables externas mediante closures. En el Módulo 11 exploraremos los conceptos de Referencias e inmutabilidad.
:::