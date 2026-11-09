
# Módulo 1. Pensar como programador

Antes de aprender a crear aplicaciones web completas, necesitas desarrollar una habilidad fundamental: aprender a resolver problemas estructurando instrucciones lógicas que una computadora pueda interpretar.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Descomponer** problemas grandes en tareas pequeñas.
- **Identificar** qué información necesitas (entradas) y qué resultados esperas (salidas).
- **Diseñar** secuencias lógicas de instrucciones (algoritmos).
- **Comprender** el flujo de ejecución de una computadora.
- **Reconocer** el papel de las decisiones y repeticiones a nivel conceptual.
- **Detectar y corregir** errores lógicos en pasos sencillos.

::: info Sin requisitos previos
No necesitas conocimientos previos de programación. Comenzaremos con problemas cotidianos y conceptos básicos sin abrumarte con sintaxis avanzada.
:::

## 1. Tu trabajo como programador es resolver problemas

Imagina que tienes una pequeña tienda y necesitas calcular cuánto debe pagar un cliente por tres productos.

Los precios son:
- **Teclado:** $350
- **Mouse:** $180
- **Audífonos:** $420

Puedes calcular el total mentalmente, utilizar una calculadora o pedirle a una computadora que lo ejecute. Para indicárselo a la computadora, escribimos instrucciones explícitas en código JavaScript:

```js
const teclado = 350;
const mouse = 180;
const audifonos = 420;

const total = teclado + mouse + audifonos;

console.log(total);
// Output: 950

```

¡Acabas de resolver un problema mediante código!

No te preocupes por memorizar la sintaxis exacta de cada instrucción por ahora. Observa el patrón principal: le proporcionamos datos a la computadora, le indicamos qué operación realizar y obtuvimos un resultado.

### Experimenta

Modifica los valores del código:

```js
const teclado = 500;
const mouse = 250;
const audifonos = 600;

const total = teclado + mouse + audifonos;

console.log(total);

```

::: tip Preguntas para reflexionar

1. ¿Qué sucede cuando modificas un precio?
2. ¿El resultado final cambia en proporción?
3. ¿Qué instrucción tendrías que agregar si el cliente compra un cuarto producto?
:::

::: tip Idea importante
Un programador no se limita a escribir sintaxis. Primero comprende el problema, identifica los datos clave y diseña el paso a paso de la solución.
:::

## 2. Divide los problemas en tareas pequeñas

Imagina que quieres calcular el pago final de una compra aplicando un descuento si el cliente supera cierta cifra. Resolver todo de un solo golpe mental puede generar confusión cuando la lógica crece.

La técnica principal de la programación es la **descomposición**: dividir un problema complejo en pasos pequeños y consecutivos.

**Pasos lógicos para este caso:**

1. Definir los precios de los productos.
2. Calcular la suma total (subtotal).
3. Calcular el monto del descuento.
4. Restar el descuento al subtotal para obtener el total a pagar.
5. Mostrar los resultados final e intermedios.

### Vamos al código

Aplicando los pasos uno a uno:

```js
// 1. Precios individuales
const producto1 = 150;
const producto2 = 250;
const producto3 = 100;

// 2. Subtotal
const subtotal = producto1 + producto2 + producto3;

// 3. Descuento del 10% (0.10)
const descuento = subtotal * 0.10;

// 4. Total a pagar
const totalFinal = subtotal - descuento;

// 5. Salida de datos
console.log("Subtotal:", subtotal);
console.log("Descuento:", descuento);
console.log("Total final:", totalFinal);

```

**Resultado en consola:**

```text
Subtotal: 500
Descuento: 50
Total final: 450

```

Observa la claridad del código: no combinamos todas las operaciones matemáticas en una sola línea ilegible. Creamos variables intermedias paso a paso.

::: details Ver reto de experimentación

1. Cambia los precios iniciales.
2. Añade un `producto4` y agrégalo al cálculo del `subtotal`.
3. Ajusta la tasa de descuento del 10% (`0.10`) al 15% (`0.15`).
:::


## 3. Entradas, Procesamiento y Salida (Modelo IPO)

Toda solución computacional se organiza conceptualmente en tres fases:

| Elemento | ¿Qué significa? | Ejemplo en código |
| --- | --- | --- |
| **Entrada (Input)** | Información inicial requerida. | `const precio = 200;` |
| **Procesamiento (Process)** | Operaciones y cálculos aplicados a los datos. | `const total = precio * cantidad;` |
| **Salida (Output)** | El resultado comunicado al usuario o sistema. | `console.log(total);` |

::: code-group

```js [Ejemplo 1: Costo por cantidad]
// ENTRADA
const precioUnidad = 200;
const cantidadComprada = 3;

// PROCESAMIENTO
const totalCompra = precioUnidad * cantidadComprada;

// SALIDA
console.log("Total a pagar:", totalCompra); // Total a pagar: 600

```

```js [Ejemplo 2: Edad aproximada]
// ENTRADA
const anioNacimiento = 2000;
const anioActual = 2026;

// PROCESAMIENTO
const edad = anioActual - anioNacimiento;

// SALIDA
console.log("Edad calculada:", edad); // Edad calculada: 26

```

:::

### Experimenta

Antes de escribir código en tu editor, toma papel y lápiz e identifica **Entrada**, **Procesamiento** y **Salida** para estos escenarios:

* Convertir una suma de dólares a moneda local.
* Calcular el área de un rectángulo ($base \times altura$).
* Obtener el promedio de tres exámenes individuales (`nota1`, `nota2`, `nota3`).


## 4. Las instrucciones siguen un orden estricto

Las computadoras ejecutan las líneas de código secuencialmente, de arriba hacia abajo.

```js
const precio = 100;
const cantidad = 3;

const total = precio * cantidad;

console.log(total);

```

Si invertimos el orden e intentamos utilizar un valor antes de definirlo:

```js
console.log(total); // ❌ ReferenceError: Cannot access 'total' before initialization

const precio = 100;
const cantidad = 3;
const total = precio * cantidad;

```

::: warning Cuidado con el orden de declaración
JavaScript mostrará un error de ejecución en la consola. La computadora no puede predecir el futuro; requiere que los datos estén declarados antes de su uso.
:::

### Ejemplo de flujo secuencial completo

```js
const precioBase = 250;
const unidades = 4;
const porcentajeImpuesto = 0.16; // 16% de IVA

const subtotal = precioBase * unidades;
const impuesto = subtotal * porcentajeImpuesto;
const totalConImpuesto = subtotal + impuesto;

console.log("Subtotal:", subtotal);
console.log("Impuesto (16%):", impuesto);
console.log("Total a pagar:", totalConImpuesto);

```

## 5. Decisiones: adaptar el comportamiento del programa

Un programa requiere lógica condicional cuando la solución depende de reglas de negocio cambiantes.

Por ejemplo: *Si el total de la compra supera los $1,000, aplica envío gratis; de lo contrario, cobra $150 de envío.*

```js
const totalCompra = 1200;
const costoEnvioEstandar = 150;

let envio;

if (totalCompra >= 1000) {
  envio = 0; // Envío gratis
} else {
  envio = costoEnvioEstandar;
}

const totalFinal = totalCompra + envio;

console.log("Costo de envío:", envio);
console.log("Total final:", totalFinal);

```

**Resultado:**

```text
Costo de envío: 0
Total final: 1200

```

* La estructura `if` evalúa si una condición matemática o lógica es **Verdadera**.
* La estructura `else` define el camino alternativo en caso de ser **Falsa**.

::: tip Experimenta
Cambia la variable `totalCompra` a `800` y vuelve a ejecutar. Observa cómo el programa toma automáticamente la rama del `else`.
:::

## 6. La necesidad de automatizar repeticiones

Imagina que necesitas calcular el precio con IVA de 3 productos individuales sin repetir fórmulas una y otra vez de forma manual.

En módulos avanzados utilizaremos bucles o ciclos. Por ahora, comprende el concepto fundamental: **la computadora destaca ejecutando la misma regla lógica sobre múltiples entradas**.

Si calculamos individualmente:

```js
const p1 = 100;
const p2 = 200;
const p3 = 300;

// Aplicamos el mismo factor a cada uno
const p1ConIVA = p1 * 1.16;
const p2ConIVA = p2 * 1.16;
const p3ConIVA = p3 * 1.16;

console.log("Producto 1 final:", p1ConIVA);
console.log("Producto 2 final:", p2ConIVA);
console.log("Producto 3 final:", p3ConIVA);

```

Identificar qué procesos se repiten exactamente igual en cada paso te permitirá abstraerlos en funciones y ciclos en los siguientes módulos.

## 7. Reconocer patrones para reutilizar soluciones

Diversos problemas de software comparten la misma plantilla lógica interna.

Analiza estos tres casos:

::: code-group

```js [Caso A: Propina]
const base = 500;
const extra = base * 0.10;
const total = base + extra;

```

```js [Caso B: Impuesto]
const base = 500;
const extra = base * 0.16;
const total = base + extra;

```

```js [Caso C: Recargo]
const base = 500;
const extra = base * 0.05;
const total = base + extra;

```

:::

::: info Patrón Identificado
El patrón matemático subyacente en los tres casos es exactamente el mismo:


$$\text{Total} = \text{Base} + (\text{Base} \times \text{Porcentaje})$$


Detectar patrones te evita reinventar la rueda ante un problema nuevo.
:::

## 8. Verificación y detección de errores (Depuración)

Un código puede ejecutarse sin arrojar errores rojos en la consola y aun así dar un resultado equivocado debido a una falla en las reglas matemáticas o en el orden de precedencia.

### Ejemplo de error de lógica

Queremos calcular el promedio de tres notas: **8**, **9** y **10**.

```js
const nota1 = 8;
const nota2 = 9;
const nota3 = 10;

// ❌ ERROR LÓGICO:
const promedioIncorrecto = nota1 + nota2 + nota3 / 3;

console.log(promedioIncorrecto); // Output: 20.333333333333332

```

¡Es imposible que el promedio de notas entre 8 y 10 sea 20!

### Diagnóstico y Solución

En matemática e informática, la división `/` tiene mayor prioridad que la suma `+`. El código anterior dividió `nota3 / 3` ($10 / 3 = 3.33$) y luego le sumó $8$ y $9$.

Para corregirlo, agrupamos las sumas entre paréntesis `()`:

```js
// ✅ SOLUCIÓN CORRECTA:
const promedioCorrecto = (nota1 + nota2 + nota3) / 3;

console.log(promedioCorrecto); // Output: 9

```

## 9. Errores comunes al comenzar a programar

::: danger Evita estos 5 errores típicos

1. **Escribir código sin planificar en papel:** Attemptar codificar antes de entender los pasos lógicos del problema.
2. **Confundir el orden de las instrucciones:** Intentar operar con variables que no han sido creadas previamente en líneas superiores.
3. **No verificar con datos de prueba variados:** Dar por sentado que la solución es correcta habiéndola probado únicamente con un dato conveniente.
4. **Ignorar los paréntesis en cálculos:** Asumir que la computadora adivinará la jerarquía de las operaciones matemáticas.
5. **No leer los mensajes de la consola:** Cuando el código falla, la consola indica exactamente la línea y el tipo de error.
:::

## 10. Ejercicios prácticos

Desarrolla las siguientes soluciones utilizando variables simples, operadores matemáticos y la consola.

### Ejercicio 1: Calculadora de propina

Un cliente consume $650 en un restaurante y desea dejar el 12% de propina.

1. Declara la variable del consumo.
2. Calcula la propina correspondiente.
3. Suma ambos valores para obtener el pago total.
4. Muestra los resultados en consola.

### Ejercicio 2: Conversor de temperatura

La fórmula para convertir grados Celsius ($C$) a Fahrenheit ($F$) es: $F = (C \times 1.8) + 32$.

1. Crea una variable `celsius` con valor `30`.
2. Calcula su equivalente en Fahrenheit en una variable `fahrenheit`.
3. Muestra el resultado.

### Ejercicio 3: Cálculo de salario neto

Un empleado gana un salario bruto de $12,000 al mes. Se le retiene un 10% de impuestos y un 3% de seguro médico.

1. Calcula el monto cobrado por impuesto.
2. Calcula el monto retido por seguro médico.
3. Resta ambas deducciones al salario bruto para obtener el `salarioNeto`.
4. Imprime el desglose final.

## 11. Reto final: Desglose de factura simple

Construye un script estructurado que simule la emisión de un comprobante de compra para un cliente.

### Requisitos

1. Declara las siguientes entradas:
* `precioProducto1` = 120
* `precioProducto2` = 340
* `precioProducto3` = 240


2. Calcula el `subtotal` sumando los 3 productos.
3. Evalúa el descuento:
* Si el `subtotal` es mayor o igual a $500, el descuento será del 10% (`subtotal * 0.10`).
* Si es menor a $500, el descuento será de 0.


4. Calcula el `totalPagar` (`subtotal - descuento`).
5. Muestra en la consola un desglose estructurado similar a este:

```text
========== DESGLOSE DE COMPRA ==========
Subtotal: $700
Descuento aplicado: $70
Total a pagar: $630
========================================

```

::: tip Pista
Resuelve paso a paso: primero realiza la suma, luego aplica la estructura `if/else` para definir el valor del descuento y finalmente imprime la salida formateada.
:::

## 12. Lo que aprendiste

En este módulo sentaste las bases conceptuales antes de profundizar en la sintaxis de JavaScript:

| Concepto | Punto clave a recordar |
| --- | --- |
| **Descomposición** | Dividir problemas en tareas simples e independientes. |
| **Modelo IPO** | Identificar claramente Entradas, Procesos y Salidas. |
| **Secuencialidad** | Las instrucciones se ejecutan strictly de arriba hacia abajo. |
| **Decisiones** | Uso de condiciones (`if/else`) para cambiar el flujo del programa. |
| **Depuración** | Revisar la jerarquía de operaciones y la lógica cuando el resultado no coincide con lo esperado. |

::: tip ¡Siguiente paso!
¡Estás listo para continuar! En el **Módulo 2: Tu primer código JavaScript**, aprenderás a utilizar herramientas de desarrollo, la función `console.log()` en detalle, reglas de sintaxis e instrucciones formales.
:::