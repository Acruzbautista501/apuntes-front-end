
# Módulo 5. Condicionales y lógica booleana

Hasta ahora, tus programas han ejecutado todas las instrucciones de arriba a abajo, una tras otra, sin detenerse a pensar. Pero las aplicaciones reales necesitan reaccionar a distintas situaciones: permitir el acceso solo si la contraseña es correcta, aplicar un descuento si la compra supera cierto monto, o mostrar un mensaje de error si un campo está vacío.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Utilizar** la estructura `if` para tomar decisiones básicas.
- **Manejar** caminos alternativos con `else`.
- **Evaluar** múltiples escenarios utilizando `else if`.
- **Comprender** el flujo de control y cómo la computadora evalúa condiciones.
- **Resolver** problemas de validación lógica aplicados a un entorno de tienda o sistema de usuarios.

## 1. Tomando decisiones con `if`

Imagina que estás programando la entrada a una discoteca o una plataforma exclusiva. La regla es simple: si el usuario es mayor de edad, puede ingresar.

En JavaScript, traducimos esa regla utilizando la estructura condicional `if`:

```javascript
const edadUsuario = 20;

if (edadUsuario >= 18) {
  console.log("Acceso concedido. Puedes ingresar.");
}
// Output: Acceso concedido. Puedes ingresar.

```

### ¿Cómo funciona?

1. La palabra clave `if` le indica a JavaScript que vamos a evaluar una condición.
2. Entre paréntesis `( )` colocamos una expresión booleana (una comparación que resulta en `true` o `false`).
3. Si el resultado es `true`, el bloque de código encerrado entre llaves `{ }` se ejecuta.
4. Si el resultado es `false`, el código dentro de las llaves se ignora por completo y el programa continúa.

## 2. Caminos alternativos con `else`

¿Qué sucede si el usuario no cumple la condición? Lo lógico es ofrecerle una respuesta alternativa. Para eso utilizamos la instrucción `else` ("si no").

```javascript
const edadUsuario = 15;

if (edadUsuario >= 18) {
  console.log("Acceso concedido. Puedes ingresar.");
} else {
  console.log("Acceso denegado. Eres menor de edad.");
}
// Output: Acceso denegado. Eres menor de edad.

```

Con `else` nos aseguramos de que el programa siempre ejecute una de las dos opciones: o se cumple la condición principal o se ejecuta la alternativa.

## 3. Evaluando múltiples escenarios con `else if`

A menudo los problemas del mundo real tienen más de dos posibles caminos. Por ejemplo, una tienda en línea que otorga diferentes porcentajes de descuento según el nivel de membresía de un cliente:

* Si es nivel "VIP", obtiene un 20% de descuento.
* Si es nivel "Frecuente", obtiene un 10% de descuento.
* Si no pertenece a ninguna categoría especial, no recibe descuento.

Podemos encadenar varias condiciones utilizando `else if`:

```javascript
const tipoMembresia = "Frecuente";

if (tipoMembresia === "VIP") {
  console.log("Descuento aplicado: 20%");
} else if (tipoMembresia === "Frecuente") {
  console.log("Descuento aplicado: 10%");
} else {
  console.log("No hay descuento disponible para tu membresía.");
}
// Output: Descuento aplicado: 10%

```

::: warning Regla importante al usar `else if`
JavaScript evalúa las condiciones de arriba hacia abajo en orden secuencial. En cuanto encuentra la primera condición que resulta verdadera (`true`), ejecuta su bloque de código y sale de toda la estructura condicional, ignorando el resto de las validaciones inferiores.
:::

## 4. Ejemplo práctico: Sistema de validación de compras y envíos

Imaginemos una tienda que calcula el costo de envío basándose en el monto total de la compra:

* Compras mayores o iguales a $1,000: Envío totalmente gratis.
* Compras entre $500 y $999.99: Costo de envío estándar de $50.
* Compras menores a $500: Costo de envío de $100.

```javascript
const totalCompra = 750;
let costoEnvio = 0;

if (totalCompra >= 1000) {
  costoEnvio = 0;
  console.log("¡Felicidades! Tienes envío gratis.");
} else if (totalCompra >= 500) {
  costoEnvio = 50;
  console.log("Aplicando tarifa de envío estándar.");
} else {
  costoEnvio = 100;
  console.log("Envío básico aplicado.");
}

const totalFinal = totalCompra + costoEnvio;

console.log("Costo de envío:", costoEnvio);
console.log("Total a pagar:", totalFinal);

```

**Resultado en consola:**

```text
Aplicando tarifa de envío estándar.
Costo de envío: 50
Total a pagar: 800

```

## 5. Experimenta

Modifica los valores de prueba en tu entorno de desarrollo y observa el comportamiento:

```javascript
const calificacionExamen = 85;

if (calificacionExamen >= 90) {
  console.log("Calificación: Sobresaliente");
} else if (calificacionExamen >= 70) {
  console.log("Calificación: Aprobado");
} else {
  console.log("Calificación: Reprobado. Debes esforzarte más.");
}

```

::: tip Preguntas para reflexionar

1. ¿Qué mensaje se muestra si la calificación es exactamente 70?
2. ¿Qué sucedería si evaluamos primero `calificacionExamen >= 70` antes que `calificacionExamen >= 90`? (Piénsalo: como JavaScript se detiene en la primera coincidencia, un 95 cumpliría primero con la regla del 70 y mostraría un resultado incorrecto. ¡El orden de los factores sí altera el resultado!).
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Olvidar las llaves `{ }` en bloques largos.**
Aunque JavaScript permite omitir las llaves si el bloque de código tiene una sola línea, es una pésima práctica que genera errores difíciles de rastrear cuando agregas más instrucciones en el futuro. Utiliza siempre las llaves.
* **Error 2: Orden incorrecto en condiciones de rangos numéricos.**
Evaluar de forma ascendente o descendente sin considerar los límites lógicos (por ejemplo, preguntar si es mayor a 50 antes de preguntar si es mayor a 100).
* **Error 3: Confundir asignación con comparación dentro del `if`.**
Escribir `if (x = 10)` en lugar de `if (x === 10)`.
:::

## 7. Ejercicios prácticos

### Ejercicio 1: Verificador de contraseña segura

Crea un script que evalúe la longitud de una contraseña simulada:

* Si la contraseña tiene 8 o más caracteres, muestra en consola: `"Contraseña segura"`.
* Si tiene entre 5 y 7 caracteres, muestra: `"Contraseña moderada, considera hacerla más larga"`.
* Si tiene menos de 5 caracteres, muestra: `"Contraseña insegura, es demasiado corta"`.

### Ejercicio 2: Sistema de control de stock

Declara una variable numérica `stockActual` con un valor de 3.

* Si el stock es mayor o igual a 10, muestra `"Inventario suficiente"`.
* Si el stock está entre 1 y 9 (inclusive), muestra `"¡Atención! Quedan pocas unidades"`.
* Si el stock es exactamente 0, muestra `"Producto agotado"`.

## 8. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **`if`** | Ejecuta un bloque de código únicamente si la condición evaluada es verdadera. |
| **`else`** | Define el camino alternativo cuando la condición principal del `if` resulta falsa. |
| **`else if`** | Permite evaluar múltiples condiciones encadenadas de manera secuencial. |
| **Flujo de control** | JavaScript detiene la ejecución en la primera condición verdadera que encuentra. |

::: tip ¡Siguiente paso!
Antes de avanzar al siguiente módulo, asegúrate de dominar cómo estructurar condiciones y cómo el orden de evaluación afecta la lógica de tus programas. En el Módulo 6 veremos cómo automatizar tareas repetitivas mediante ciclos.
:::