
# Módulo 13. Errores y depuración

Incluso los programadores más experimentados cometen errores constantemente. Escribir código que funcione a la primera es una excepción, no la regla. Lo que distingue a un desarrollador profesional no es la ausencia de errores, sino su capacidad para leerlos, interpretarlos y corregirlos de forma sistemática.

El proceso de encontrar y corregir fallos en el código se conoce como **depuración** (*debugging*).

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Identificar** los tres tipos principales de errores en programación (sintaxis, ejecución y lógica).
- **Leer e interpretar** los mensajes de error que arroja la consola de JavaScript.
- **Utilizar** herramientas de depuración como `console.log()` estratégico y la instrucción `try...catch`.
- **Desarrollar** una metodología clara para resolver bugs sin adivinar a ciegas.

## 1. Los tres tipos de errores en programación

### A. Errores de sintaxis (Syntax Errors)
Ocurren cuando rompes las reglas gramaticales del lenguaje (por ejemplo, olvidar cerrar una comilla, una llave `{}` o un paréntesis). 
JavaScript ni siquiera ejecutará el programa; se detendrá de inmediato y mostrará un error crítico en la consola antes de iniciar.

```javascript
// ❌ Error de sintaxis: falta cerrar las comillas y el paréntesis
console.log("Hola mundo);

```

### B. Errores de ejecución (Runtime Errors)

Ocurren mientras el programa se está ejecutando. El código está bien escrito sintácticamente, pero durante su ejecución intenta realizar una operación inválida, como invocar una función que no existe o leer una propiedad de `undefined`.

```javascript
// ❌ Error de ejecución: intentar leer una propiedad de un objeto nulo
const usuario = null;
console.log(usuario.nombre); // TypeError: Cannot read properties of null

```

### C. Errores de lógica (Logic Errors)

Son los más peligrosos y difíciles de detectar. El programa se ejecuta sin arrojar ningún error en la consola, pero el resultado obtenido es incorrecto debido a un fallo en el razonamiento matemático o en el orden de las instrucciones.

```javascript
// ❌ Error de lógica: calcular mal el promedio por falta de paréntesis
const calificaciones = [8, 9, 10];
const promedio = calificaciones[0] + calificaciones[1] + calificaciones[2] / 3; 
// JavaScript divide 10 / 3 primero y luego suma, dando un resultado erróneo de 20.33

```

## 2. Leyendo los mensajes de la consola

Cuando ocurre un error de sintaxis o de ejecución, la consola de tu navegador o entorno de desarrollo muestra una traza de error (*stack trace*).

Aprende a leerla de abajo hacia arriba:

1. **El tipo de error:** (ej. `ReferenceError`, `TypeError`, `SyntaxError`).
2. **El mensaje descriptivo:** Explica exactamente qué salió mal (ej. `x is not defined`).
3. **La ubicación exacta:** El nombre del archivo y el número de línea específica donde ocurrió el fallo.

## 3. Depuración estratégica con `console.log()`

El recurso más rápido y utilizado por los desarrolladores para entender qué está haciendo el código por dentro es insertar puntos de inspección con `console.log()`.

No te limites a imprimir el resultado final; imprime los valores intermedios para verificar que el estado de tus variables sea el esperado en cada paso.

```javascript
function calcularTotalConDescuento(precioOriginal, porcentajeDescuento) {
  console.log("1. Precio recibido:", precioOriginal); // Inspección de entrada
  console.log("2. Descuento recibido:", porcentajeDescuento);

  const descuento = precioOriginal * (porcentajeDescuento / 100);
  console.log("3. Monto calculado del descuento:", descuento); // Inspección intermedia

  const totalFinal = precioOriginal - descuento;
  return totalFinal;
}

calcularTotalConDescuento(1000, 15);

```

## 4. Controlando errores críticos con `try...catch`

En aplicaciones reales, a veces interactúas con servicios externos (como una API o bases de datos) que pueden fallar de imprevisto. Para evitar que un error crítico detenga por completo la ejecución de tu aplicación, utilizamos la estructura `try...catch`.

```javascript
function procesarDatosUsuario(datosJson) {
  try {
    // Intentamos ejecutar código propenso a fallos
    const usuario = JSON.parse(datosJson); // Analiza un texto JSON
    console.log("Usuario procesado con éxito:", usuario.nombre);
  } catch (error) {
    // Si ocurre cualquier error, el programa no colapsa; entra aquí de forma segura
    console.error("⚠️ Ocurrió un error al procesar los datos:", error.message);
  } finally {
    console.log("Operación de análisis finalizada.");
  }
}

// Simulando un JSON corrupto que provocaría un error
procesarDatosUsuario("{ nombre: 'Carlos' }"); // JSON mal formado intencionalmente

```

**Resultado en consola:**

```text
⚠️ Ocurrió un error al procesar los datos: Unexpected token n in JSON at position 2
Operación de análisis finalizada.

```

## 5. Experimenta

Crea un archivo de pruebas en tu entorno y ejecuta el siguiente bloque que contiene un error de lógica intencional:

```javascript
const preciosArticulos = [100, 200, 300];
let acumulador = 0;

for (let i = 0; i <= preciosArticulos.length; i++) {
  acumulador += preciosArticulos[i];
}

console.log("Suma total:", acumulador);

```

::: tip Preguntas para reflexionar

1. ¿Qué error de ejecución o resultado extraño observas al ejecutar este código? (Pista: observa la condición del ciclo `i <= preciosArticulos.length` en lugar de `i < preciosArticulos.length`).
2. ¿Cómo te ayuda imprimir el valor de la variable `i` y de `preciosArticulos[i]` en cada iteración usando `console.log()` dentro del ciclo?
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Ignorar los mensajes de la consola.**
Cerrar o ignorar las alertas en rojo que muestra la consola esperando que el error desaparezca mágicamente.
* **Error 2: Adivinar en lugar de investigar.**
Cambiar líneas de código al azar sin entender por qué falló el programa original. La depuración requiere un enfoque analítico paso a paso.
* **Error 3: Olvidar depurar bloques asíncronos.**
No capturar errores en operaciones de red, lo que provoca fallos no controlados (*unhandled rejections*).
:::

## 7. Ejercicios prácticos

### Ejercicio 1: Depurando una función con errores de lógica

El siguiente código pretende calcular el promedio de tres calificaciones, pero arroja un resultado incorrecto:

```javascript
const nota1 = 80;
const nota2 = 90;
const nota3 = 100;

function obtenerPromedio(a, b, c) {
  const suma = a + b + c;
  const promedio = suma / 2; // ⚠️ Aquí hay un error de lógica
  return promedio;
}

console.log("El promedio es:", obtenerPromedio(nota1, nota2, nota3));

```

1. Corrige el error de lógica para que el cálculo divida correctamente entre la cantidad de elementos.
2. Añade un par de `console.log()` estratégicos dentro de la función para verificar el valor de `suma` antes de retornar el resultado.

## 8. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Error de sintaxis** | Violación de las reglas del lenguaje; impide que el script siquiera comience a ejecutarse. |
| **Error de ejecución** | Fallo crítico que ocurre mientras corre el programa (ej. leer propiedades de `null`). |
| **Error de lógica** | El programa corre sin alertas pero produce resultados incorrectos por fallos de razonamiento. |
| **`try...catch`** | Estructura defensiva para capturar errores inesperados y evitar que la aplicación colapse. |

::: tip ¡Siguiente paso!
Antes de avanzar al siguiente módulo, asegúrate de comprender cómo interpretar los rastros de error en la consola. En el Módulo 14 exploraremos el fascinante mundo del asincronismo.
:::