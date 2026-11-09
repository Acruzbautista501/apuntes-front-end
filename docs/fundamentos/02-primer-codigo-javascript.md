
# Módulo 2. Tu primer código JavaScript

En el módulo anterior aprendiste a pensar los problemas como un programador. Ahora es momento de comenzar a escribir e interpretar código JavaScript real.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Entender** qué es JavaScript y dónde se ejecuta.
- **Utilizar** `console.log()` para mostrar información y depurar datos.
- **Escribir** sentencias e instrucciones con la sintaxis correcta.
- **Utilizar** comentarios para documentar y explicar tu código.
- **Detectar y corregir** errores de sintaxis comunes al dar tus primeros pasos.

::: info Sin instalaciones complejas
No necesitas instalar herramientas complejas por ahora. Puedes probar todos los ejemplos directamente en la consola de tu navegador web.
:::

## 1. ¿Qué es JavaScript y cómo funciona?

JavaScript es el lenguaje de programación estándar de la web. Permite dar interactividad, procesar información, realizar cálculos y manipular lo que el usuario ve en pantalla.

Cuando escribes código JavaScript, este es interpretado y ejecutado por un **motor de JavaScript** (como V8 en Google Chrome y Node.js).

### ¿Dónde se ejecuta JavaScript?

1. **En el navegador web:** En la consola de desarrollador de Chrome, Firefox, Edge o Safari.
2. **En el servidor:** Utilizando entornos como Node.js.
3. **En VitePress / aplicaciones web:** Mediante scripts integrados y componentes interactivos.

## 2. Mostrar información con `console.log()`

La instrucción `console.log()` es la herramienta primaria de todo desarrollador JavaScript. Sirve para imprimir mensajes, valores de variables y resultados de operaciones en la consola.

### Sintaxis básica

```js
console.log("¡Hola, mundo!");
// Output: ¡Hola, mundo!

```

### Explicación de la estructura

* **`console`**: Es un objeto nativo del entorno que nos da acceso a la consola de depuración.
* **`.log()`**: Es un método (función) que recibe datos e imprime su contenido.
* **`("...")`**: El texto entre comillas representa una cadena de texto (*string*).
* **`;`**: El punto y coma indica el final de una instrucción.

## 3. Imprimir múltiples valores y expresiones

`console.log()` no se limita a imprimir solo texto simple. Puede imprimir números, resultados matemáticos o varios datos separados por comas.

::: code-group

```js [Ejemplo 1: Números y operaciones]
console.log(100);
console.log(50 + 25);
console.log(10 * 4);

```

```js [Ejemplo 2: Varios datos en línea]
console.log("Producto:", "Teclado Mecánico", "Precio:", 850);

```

:::

**Resultado del Ejemplo 1:**

```text
100
75
40

```

::: tip Experimenta en tu navegador

1. Abre la consola de tu navegador (presiona F12 o clic derecho $\rightarrow$ *Inspeccionar* $\rightarrow$ pestaña *Consola*).
2. Escribe `console.log("Mi nombre es:", "TuNombre");` y presiona Enter.
3. Prueba calcular tu año aproximado de nacimiento imprimiendo `console.log(2026 - TuEdad);`.
:::

## 4. Instrucciones, sentencias y bloques de código

Un programa en JavaScript es una secuencia de **sentencias** (instrucciones) que la computadora ejecuta una tras otra.

### Ejecución secuencial

```js
console.log("Paso 1: Iniciando sistema...");
console.log("Paso 2: Cargando datos...");
console.log("Paso 3: Proceso completado con éxito.");

```

**Resultado:**

```text
Paso 1: Iniciando sistema...
Paso 2: Cargando datos...
Paso 3: Proceso completado con éxito.

```

::: warning Reglas clave de sintaxis

* **Sensible a mayúsculas y minúsculas (*Case Sensitive*):** `console.log` no es lo mismo que `Console.log` ni `CONSOLE.LOG`. Escribirlo con mayúsculas provocará un error.
* **Espacios en blanco:** JavaScript ignora los espacios en blanco extra entre operadores o palabras clave, pero usarlos ordenadamente mejora la legibilidad.
* **Punto y coma `;`:** Aunque JavaScript cuenta con inserción automática de punto y coma (*ASI*), es una buena práctica escribirlo explícitamente al final de cada sentencia.
:::

## 5. Documentar código con Comentarios

Los comentarios son notas en el código que el motor de JavaScript ignora por completo durante la ejecución. Sirven para explicar la intención de una lógica compleja o desactivar temporalmente una línea de código.

### Comentarios de una sola línea (`//`)

Se utilizan para explicaciones breves. Todo lo que esté a la derecha de `//` en esa misma línea será ignorado.

```js
// Este es un comentario de una sola línea
console.log("Esta línea sí se ejecuta"); // Explicación en la misma línea

```

### Comentarios multilínea (`/* ... */`)

Se utilizan para explicaciones más extensas o documentación de bloques enteros.

```js
/*
  Programa: Calculadora básica
  Autor: Tu Nombre
  Descripción: Este script realiza la impresión de bienvenida.
*/
console.log("Bienvenido a la aplicación");

```

::: info Buenas prácticas con comentarios
Usa comentarios para explicar el **por qué** escribiste una solución de cierta manera, no para explicar lo evidente que el propio código ya expresa.
:::

## 6. Diagnóstico y lectura de errores comunes

Cuando cometes un error de sintaxis, la consola te mostrará un mensaje descriptivo en color rojo. Aprender a interpretar estos mensajes te facilitará la corrección de fallas.

::: danger Errores de sintaxis comunes

### 1. `Uncaught SyntaxError` (Error de sintaxis)

Ocurre cuando rompes las reglas gramaticales del lenguaje (por ejemplo, olvidar cerrar una comilla o un paréntesis).

```js
// ❌ Código incorrecto:
console.log("Hola mundo);

```

### 2. `Uncaught TypeError` / `ReferenceError` (Error de referencia o tipo)

Ocurre cuando escribes mal una palabra reservada o una función nativa.

```js
// ❌ Código incorrecto (C mayúscula):
Console.log("Hola mundo");

```

:::

## 7. Ejercicios prácticos

Pon a prueba los conceptos básicos de sintaxis y la consola.

### Ejercicio 1: Ficha de usuario simple

Utiliza una sola línea de `console.log()` para imprimir tu nombre, tu ocupación y tu país de origen, separados por comas.

### Ejercicio 2: Operaciones en la consola

Escribe instrucciones `console.log()` para imprimir el resultado de las siguientes operaciones:

1. La suma de $120 + 450$.
2. La multiplicación de $15 \times 8$.
3. El resultado de dividir $1000 / 4$.

### Ejercicio 3: Corrección de código

Identifica y corrige los errores sintácticos del siguiente fragmento:

```js
// Código con errores:
console.log("Cargando aplicación...");
CONSOLE.LOG("Usuario conectado");
console.log("Bienvenido al sistema");

```

## 8. Reto final: Formatear una tarjeta de presentación

Escribe un script que utilice `console.log()`, comentarios e impresiones multilínea para desplegar una tarjeta de presentación profesional en la consola.

### Requisitos

1. Agrega un comentario multilínea al inicio explicando la función del script.
2. Utiliza bordes decorativos hechos con caracteres de texto (`=`, `-`).
3. Imprime tus datos personales o ficticios en líneas separadas.
4. Muestra un cálculo matemático (por ejemplo, tus horas trabajadas en el año).

### Ejemplo de resultado esperado en consola

```text
========================================
   TARJETA DE PRESENTACIÓN DIGITAL
========================================
Nombre: Alex Dev
Rol: Desarrollador Frontend
Horas semanales de código: 40
Total horas al año (50 semanas): 2000
Status: Disponible para proyectos
========================================

```

## 9. Lo que aprendiste

| Concepto | Lo que debes recordar |
| --- | --- |
| **JavaScript** | Lenguaje de programación interpretado por motores como V8 (Navegador/Node.js). |
| **`console.log()`** | Función nativa para imprimir información, verificar resultados y depurar. |
| **Sintaxis** | Sensible a mayúsculas y minúsculas; las sentencias finalizan preferentemente con `;`. |
| **Comentarios** | Anotaciones con `//` (línea simple) o `/* */` (multilínea) ignoradas por el motor. |
| **Errores** | Los mensajes de la consola indican el tipo de falla y la línea aproximada donde ocurrió. |


::: tip Siguiente paso
¡Excelente trabajo! En el **Módulo 3: Variables**, aprenderás a almacenar datos de forma dinámica y a operar con ellos utilizando lógica estructurada.
:::
