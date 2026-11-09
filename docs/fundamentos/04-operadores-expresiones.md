
# Módulo 4. Operadores y expresiones

Hasta ahora sabes cómo guardar datos en variables y constantes. Sin embargo, los datos por sí solos no resuelven problemas si no puedes manipularlos, combinarlos o compararlos. Para ello utilizamos operadores.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Realizar** operaciones aritméticas básicas y avanzadas en JavaScript.
- **Utilizar** operadores de asignación para actualizar valores de forma abreviada.
- **Comparar** valores para saber si son iguales, mayores o menores.
- **Combinar** condiciones utilizando operadores lógicos (`&&`, `||`, `!`).
- **Comprender** qué es una **expresión** y cómo la evalúa JavaScript.

## 1. ¿Qué es una expresión?

En programación, una **expresión** es cualquier fragmento de código que produce un valor. Puede estar compuesta por valores directos, variables y operadores.

```javascript
const precioBase = 200; // 200 es una expresión
const impuesto = precioBase * 0.16; // "precioBase * 0.16" es una expresión que produce un valor

```
Cuando la computadora evalúa una expresión, calcula su resultado y lo sustituye por el valor final.

## 2. Operadores aritméticos

Los operadores aritméticos te permiten realizar cálculos matemáticos tradicionales.

| Operador | Descripción | Ejemplo | Resultado |
| --- | --- | --- | --- |
| **+** | Suma (también concatena textos) | `100 + 50` | `150` |
| **-** | Resta | `100 - 30` | `70` |
| ***** | Multiplicación | `12 * 5` | `60` |
| **/** | División | `100 / 4` | `25` |
| **%** | Módulo (resto de la división) | `10 % 3` | `1` |
| ****** | Exponenciación (potencia) | `2 ** 3` | `8` |

### Ejemplo práctico: Calculadora de IVA y envío

```javascript
const precioProducto = 450;
const costoEnvio = 50;
const tasaIva = 0.16;

const subtotal = precioProducto + costoEnvio;
const iva = subtotal * tasaIva;
const totalFinal = subtotal + iva;

console.log("Subtotal:", subtotal);
console.log("IVA:", iva);
console.log("Total a pagar:", totalFinal);

```

**Resultado:**

```text
Subtotal: 500
IVA: 80
Total a pagar: 580

```

## 3. Operadores de asignación compuestos

Con frecuencia necesitarás actualizar el valor de una variable basándote en su valor actual (por ejemplo, acumular puntos o sumar precios a un total). En lugar de escribir operaciones largas, usamos asignaciones abreviadas.

```javascript
let totalCompra = 500;

// Agregar el costo de un nuevo producto (forma tradicional)
// totalCompra = totalCompra + 150;

// Forma abreviada con operadores de asignación:
totalCompra += 150; // Equivale a: totalCompra = totalCompra + 150
console.log(totalCompra); // 650

let descuento = 50;
descuento -= 10; // Equivale a: descuento = descuento - 10
console.log(descuento); // 40

```

::: tip Otros operadores
Otros operadores de asignación comunes son `*=`, `/=` y `%=`.
:::

## 4. Operadores de comparación

Estos operadores comparan dos valores y devuelven siempre un resultado booleano (`true` o `false`). Son la base fundamental para que los programas tomen decisiones en el siguiente módulo.

| Operador | Descripción | Ejemplo | Resultado |
| --- | --- | --- | --- |
| **===** | Estrictamente igual (compara valor y tipo) | `5 === 5` | `true` |
| **!==** | Estrictamente diferente | `5 !== 3` | `true` |
| **>** | Mayor que | `10 > 5` | `true` |
| **<** | Menor que | `3 < 8` | `true` |
| **>=** | Mayor o igual que | `10 >= 10` | `true` |
| **<=** | Menor o igual que | `4 <= 2` | `false` |

::: warning Nota importante
Evita utilizar el operador de igualdad débil (`==` o `!=`), ya que realiza conversiones automáticas de tipos extrañas que suelen generar errores difíciles de detectar. Utiliza siempre la igualdad estricta (`===` y `!==`).
:::

### Ejemplo en código

```javascript
const stockDisponible = 5;
const cantidadSolicitada = 3;

const haySuficienteStock = cantidadSolicitada <= stockDisponible;

console.log("¿Se puede procesar el pedido?", haySuficienteStock);

```

**Resultado:**

```text
¿Se puede procesar el pedido? true

```

## 5. Operadores lógicos

Te permiten combinar múltiples condiciones booleanas.

### A. Operador Y lógico (`&&`)

Devuelve `true` únicamente si todas las condiciones evaluadas son verdaderas. Si al menos una es falsa, el resultado es falso.

```javascript
const usuarioAutenticado = true;
const tieneMembresiaVIP = true;

const puedeAccederAlDescuento = usuarioAutenticado && tieneMembresiaVIP;
console.log(puedeAccederAlDescuento); // true

```

### B. Operador O lógico (`||`)

Devuelve `true` si al menos una de las condiciones es verdadera.

```javascript
const esDiaFestivo = false;
const esFinDeSemana = true;

const hayPromocionEspecial = esDiaFestivo || esFinDeSemana;
console.log(hayPromocionEspecial); // true

```

### C. Operador NO lógico (`!`)

Invierte el valor booleano: transforma un `true` en `false` y viceversa.

```javascript
const cuentaBloqueada = false;
const puedeComprar = !cuentaBloqueada; // Se convierte en true

console.log(puedeComprar); // true

```

## 6. Experimenta

Crea un pequeño archivo de pruebas e intenta resolver las siguientes evaluaciones:

```javascript
const precioArticulo = 300;
const cantidadDeseada = 4;
const presupuestoMaximo = 1500;

const costoTotal = precioArticulo * cantidadDeseada;
const entraEnPresupuesto = costoTotal <= presupuestoMaximo;

console.log("Costo total:", costoTotal);
console.log("¿Entra en presupuesto?", entraEnPresupuesto);

```

::: tip Preguntas para reflexionar

1. ¿Qué sucede si cambias `cantidadDeseada` a 6? ¿Cómo cambia el booleano `entraEnPresupuesto`?
2. ¿Qué prioridad matemática aplica JavaScript si mezclas sumas y multiplicaciones en una misma línea sin paréntesis?
:::

## 7. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Confundir `=` con `===`.**
Usar un solo signo `=` asigna un valor a una variable. Usar tres signos `===` compara dos valores. Escribir `if (x = 5)` asigna `5` a `x` en lugar de comprobar si `x` es igual a `5`.
* **Error 2: Olvidar la precedencia de operadores.**
Al igual que en matemáticas, la multiplicación y la división se ejecutan antes que la suma y la resta. Usa paréntesis `()` siempre que necesites forzar un orden específico de cálculo.
:::

## 8. Ejercicios prácticos

### Ejercicio 1: Calculadora de propina

Una persona asiste a un restaurante y el consumo total es de $650.

1. Define una constante para el consumo.
2. Calcula una propina del 10% utilizando operadores aritméticos.
3. Calcula el total absoluto sumando el consumo y la propina.
4. Muestra ambos resultados en la consola.

### Ejercicio 2: Validación de acceso a una función exclusiva

Una plataforma digital solo permite el acceso a ofertas especiales si el usuario cumple dos reglas:

* Su saldo en monedero es mayor o igual a $500.
* Su cuenta está verificada (`true`).

1. Declara variables para `saldoMonedero` (ej. 600) y `cuentaVerificada` (ej. true).
2. Utiliza operadores de comparación y lógicos para evaluar si cumple con los requisitos.
3. Almacena el resultado en una constante llamada `accesoConcedido` y muéstrala en consola.

## 9. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Expresión** | Fragmento de código que produce y evalúa un valor. |
| **Operadores aritméticos** | Realizan cálculos matemáticos básicos y avanzados (`+`, `-`, `*`, `/`, `%`, `**`). |
| **Asignación compuesta** | Actualizan variables de forma abreviada (`+=`, `-=`, etc.). |
| **Operadores de comparación** | Comparan datos devolviendo booleanos (`===`, `!==`, `>`, `<`, `>=`, `<=`). |
| **Operadores lógicos** | Combinan condiciones complejas (`&&`, ` |

::: tip ¡Siguiente paso!
Antes de avanzar al siguiente módulo, asegúrate de dominar cómo funcionan las comparaciones estrictas y la lógica detrás de los operadores `&&` y `||`, ya que los necesitarás inmediatamente para estructurar las decisiones de tu código.
:::
