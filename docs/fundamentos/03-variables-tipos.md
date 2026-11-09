
# Módulo 3. Variables, constantes y tipos de datos

En los módulos anteriores aprendiste a pensar con lógica estructurada y a usar la consola para imprimir información. Sin embargo, para crear aplicaciones reales necesitas almacenar, transformar y reutilizar datos a lo largo del tiempo.  Las variables y constantes son los contenedores que hacen esto posible.

## ¿Qué aprenderás?

En este módulo aprenderás a:

* **Comprender** qué es una variable y por qué es fundamental en programación.
* **Diferenciar** cuándo utilizar `const` y cuándo utilizar `let`.
* **Conocer** los tipos de datos primitivos en JavaScript (textos, números y booleanos).
* **Declarar y asignar** valores de manera correcta siguiendo buenas prácticas.
* **Evitar** errores comunes al nombrar variables.

## 1. La memoria de tu programa: ¿Qué es una variable?

Imagina que estás organizando tu espacio de trabajo. Tienes pequeñas cajas rotuladas donde guardas objetos para usarlos más tarde. Si necesitas un bolígrafo, no buscas en toda la habitación; vas directo a la caja etiquetada como "útiles".

En programación, una **variable** es exactamente eso: un espacio en la memoria de la computadora reservado para almacenar un valor al que le asignamos un nombre (una etiqueta) para poder consultarlo o modificarlo después.

Ejemplo básico en JavaScript:

```javascript
let nombreUsuario = "Carlos";
console.log(nombreUsuario);
// Output: Carlos

```

### ¿Qué significan las palabras clave?

* **`let`**: Indica que estás creando una variable cuyo valor podrá cambiar más adelante en el programa.
* **`nombreUsuario`**: Es el identificador (nombre de la variable). Debe ser descriptivo.
* **`=`**: El operador de asignación. No significa "igual a" en sentido matemático, sino "toma el valor de la derecha y guárdalo en la caja de la izquierda".
* **`"Carlos"`**: El dato que estamos guardando (en este caso, un texto).

## 2. Constantes: Valores que no deben cambiar

En muchas ocasiones, la información que manejas no debería modificarse por error durante la ejecución del programa. Para proteger esos datos utilizamos `const`.

Una constante es un contenedor cuyo valor se asigna una sola vez y no puede ser reasignado.

```javascript
const anioNacimiento = 2000;

// Si intentas hacer esto más adelante, JavaScript arrojará un error:
// anioNacimiento = 2005; 

console.log(anioNacimiento);
// Output: 2000

```

::: tip Regla de oro: ¿Cuándo usar `const` y cuándo `let`?

* **Usa `const` por defecto** para casi todo (configuraciones, precios fijos, elementos que no cambian). Es la opción más segura.
* **Usa `let` únicamente** cuando sepas con certeza que el valor va a cambiar con el tiempo (como la puntuación de un juego, el estado de carga de una pantalla o un contador).
* *(Nota histórica: Antiguamente se utilizaba `var`, pero hoy en día se considera una mala práctica debido a problemas con el manejo del alcance o `scope`. Evítala por completo).*
:::

## 3. Los tipos de datos fundamentales

En JavaScript, cada valor que guardas tiene un "tipo" que determina qué operaciones puedes realizar con él. En este nivel inicial nos enfocaremos en los tres tipos primitivos más importantes:

### A. Cadenas de texto (Strings)

Representan texto y siempre van envueltas entre comillas (simples `'`, dobles `"` o comillas invertidas ```).

```javascript
const producto = "Teclado Mecánico";
const categoria = 'Accesorios';

console.log(producto);

```

### B. Números (Numbers)

Representan valores numéricos, tanto enteros como decimales. No llevan comillas.

```javascript
const precio = 450.50;
const stock = 15;

console.log(precio);

```

### C. Booleanos (Booleans)

Representan un valor de veracidad lógico: solo pueden tener dos estados: `true` (verdadero) o `false` (falso). Son vitales para las decisiones.

```javascript
const usuarioLogueado = true;
const tieneDescuento = false;

console.log(usuarioLogueado);

```

## 4. Buenas prácticas al nombrar variables

El nombre de una variable debe explicar claramente qué contiene sin necesidad de escribir comentarios extensos.

1. **Usa camelCase:** Si el nombre tiene varias palabras, la primera empieza en minúscula y las siguientes con mayúscula inicial (`precioProducto`, `stockDisponible`, `nombreCliente`).
2. **Usa sustantivos descriptivos:** Evita nombres vagos como `x`, `data` o `val`. Es mejor `edadUsuario` que `e`.
3. **No uses palabras reservadas:** No puedes nombrar una variable utilizando palabras clave del lenguaje como `let`, `const`, `if`, `for`, etc.

## 5. Experimenta

Crea un archivo o abre tu consola y prueba las siguientes declaraciones:

```javascript
const nombreCompleto = "Sofía Martínez";
let edad = 28;
const esClienteFrecuente = true;
let saldoCuenta = 1200.50;

console.log("Nombre:", nombreCompleto);
console.log("Edad:", edad);
console.log("Cliente frecuente:", esClienteFrecuente);
console.log("Saldo actual:", saldoCuenta);

```

::: tip Preguntas para reflexionar

1. ¿Qué pasaría si intentas cambiar `nombreCompleto` usando `=` por otro nombre? (Recuerda que se declaró con `const`).
2. ¿Qué tipo de dato es `esClienteFrecuente`?
3. ¿Por qué `edad` se declaró con `let` en lugar de `const`?
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Olvidar declarar la variable con `let` o `const`.**
```javascript
// ❌ Mal hecho (puede causar comportamientos extraños en modo estricto)
precio = 100; 

// ✅ Bien hecho
const precio = 100;

```


* **Error 2: Confundir texto con números.**
Si escribes `const total = "100" + "50";`, JavaScript no sumará los números, sino que unirá los textos resultando `"10050"`. ¡Cuidado con las comillas!
* **Error 3: Modificar una constante.**
Intentar reasignar un valor a una variable creada con `const` detendrá la ejecución de tu código con un error en consola.
:::

## 7. Ejercicios prácticos

### Ejercicio 1: Perfil de usuario

Crea un script donde declares variables y constantes para describir el perfil de un usuario en una aplicación:

* Nombre completo (*texto, constante*).
* Año de nacimiento (*número, constante*).
* Ciudad de residencia (*texto, variable*).
* ¿Está activo en la plataforma? (*booleano, variable*).
* Muestra todos los valores en la consola de manera ordenada.

### Ejercicio 2: Actualización de datos

1. Declara una variable `puntosAcumulados` con un valor inicial de `100` usando `let`.
2. Simula que el usuario ganó 50 puntos extra actualizando la variable.
3. Muestra el resultado final en la consola.

## 8. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Variable (`let`)** | Contenedor de datos cuyo valor puede cambiar durante la ejecución. |
| **Constante (`const`)** | Contenedor de datos fijo cuyo valor no puede ser reasignado. |
| **String** | Datos de texto encerrados entre comillas. |
| **Number** | Datos numéricos enteros o decimales sin comillas. |
| **Boolean** | Valores lógicos que solo aceptan `true` o `false`. |
| **camelCase** | Convención de escritura para nombrar variables uniendo palabras. |

::: tip ¡Siguiente paso!
Antes de continuar al siguiente módulo, asegúrate de dominar la diferencia entre `let` y `const`, y de saber identificar cuándo usar cada tipo de dato primitivo. En el **Módulo 4: Operadores y expresiones**, aprenderás a realizar operaciones matemáticas, comparaciones y combinaciones lógicas con tus variables.
:::