# Módulo 3: Variables, Tipos de Datos y Operadores

Las variables son los bloques de construcción con los que retenemos información mientras un programa está en ejecución. Para operar con esas variables y tomar decisiones, necesitamos conocer sus **tipos de datos** y los **operadores** que permiten transformarlas.

---

## 3.1 Declaración de Variables: `const` vs `let`

En JavaScript y TypeScript modernos existen dos formas estándar de declarar variables:

```typescript
// 1. const (Constante): El valor de la variable no se puede reasignar
const PI: number = 3.14159;
const nombreApp: string = "MiTiendaWeb";

// 2. let: El valor de la variable puede cambiar a lo largo del tiempo
let contadorVisitas: number = 0;
contadorVisitas = contadorVisitas + 1; // Válido
```

### ¿Por qué nunca usamos `var`?
En versiones antiguas de JavaScript (antes de 2015 / ES6) solo existía la palabra reservada `var`. `var` tiene graves problemas de diseño:
* Ignora el ámbito de bloque (se escapa de bloques `if` o bucles `for`).
* Permite redeclarar la misma variable dos veces sin marcar ningún error, lo que provoca sobreescrituras accidentales en proyectos grandes.

> [!TIP]
> **Regla de oro del código limpio:**
> Declara **todo** con `const` por defecto. Cambia a `let` únicamente cuando tengas la certeza explícita de que la variable necesitará ser reasignada.

---

## 3.2 Tipos Primitivos Fundamentales

Los tipos primitivos son aquellos que representan un único valor elemental en memoria:

```typescript
// Texto (string)
let usuario: string = "Aldair";
let saludo: string = `Hola, ${usuario}!`; // Template Literal (Interpolación)

// Números (number)
let edad: number = 28;
let precio: number = 19.99;
let temperaturaBajoCero: number = -5;

// Booleano (boolean)
let tieneMembresia: boolean = true;
let cuentaSuspendida: boolean = false;
```

### La Tríada de la Ausencia de Valor: `undefined`, `null` y `NaN`

Uno de los mayores dolores de cabeza para los desarrolladores novatos es distinguir entre estos tres conceptos:

| Valor | ¿Qué significa conceptualmente? | Ejemplo común |
| :--- | :--- | :--- |
| **`undefined`** | *"Nadie me ha asignado un valor todavía"*. La variable existe en memoria pero está vacía. | Una variable declarada sin inicializar: `let resultado;` |
| **`null`** | *"Se asignó intencionalmente la ausencia de valor"*. Es una decisión explícita del programador. | Un usuario que no tiene teléfono registrado: `usuario.telefono = null;` |
| **`NaN`** (*Not a Number*) | *"Se intentó realizar una operación matemática con algo que no es un número válido"*. | El cálculo: `"hola" * 5` o `Math.sqrt(-1)`. |

```typescript
console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" (un error histórico en JS)
console.log(typeof NaN);       // "number" (¡paradójicamente, NaN es de tipo number!)
```

### La Peculiaridad Numérica de JavaScript: Precisión IEEE 754
En JavaScript y TypeScript no existen tipos separados para enteros (`int`) y flotantes (`float`); todos son números de punto flotante de 64 bits de doble precisión. 
Por eso ocurre este fenómeno clásico:

```typescript
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
```
*Solución profesional para dinero o cálculos exactos:* Redondear con `.toFixed()` o trabajar los montos en centavos (`10` y `20` centavos en vez de `0.1` y `0.2` pesos/dólares).

---

## 3.3 Operadores Aritméticos y Asignación Compuesta

Los operadores son símbolos que le indican al procesador que realice una operación matemática o lógica:

```typescript
let a: number = 10;
let b: number = 3;

console.log(a + b);  // 13 (Suma)
console.log(a - b);  // 7  (Resta)
console.log(a * b);  // 30 (Multiplicación)
console.log(a / b);  // 3.333... (División)
console.log(a ** b); // 1000 (Exponenciación: 10 elevado a la 3)
```

### El Indispensable Operador Módulo (`%`)
El operador **módulo** calcula el **residuo (resto)** de una división entera. Es uno de los operadores más potentes en lógica algorítmica:

```typescript
console.log(10 % 3); // 1 (porque 3 cabe 3 veces en 10, y sobra 1)
console.log(8 % 2);  // 0 (división exacta)
```

#### Usos cotidianos del operador módulo:
1. **Saber si un número es par o impar:**
   ```typescript
   const esPar: boolean = (numero % 2 === 0);
   ```
2. **Ciclos circulares y relojes (mantener un valor dentro de un rango $0$ a $N-1$):**
   ```typescript
   // Carrusel de 5 diapositivas (índices 0, 1, 2, 3, 4):
   let siguienteIndice = (indiceActual + 1) % 5;
   ```

### Asignación Compuesta e Incremento
```typescript
let saldo: number = 100;

saldo += 50; // Equivalente a: saldo = saldo + 50 (ahora es 150)
saldo -= 20; // saldo = saldo - 20 (130)
saldo *= 2;  // saldo = saldo * 2 (260)
saldo /= 4;  // saldo = saldo / 4 (65)

// Incremento y decremento unitario
let turno: number = 1;
turno++; // turno vale 2
turno--; // turno vuelve a valer 1
```

---

## 3.4 Operadores de Comparación y la Trampa de Coerción

Para comparar dos valores utilizamos operadores relacionales que devuelven un booleano (`true` o `false`):

```typescript
let puntos: number = 85;

console.log(puntos > 50);  // true (Mayor que)
console.log(puntos < 100); // true (Menor que)
console.log(puntos >= 85); // true (Mayor o igual)
console.log(puntos <= 80); // false (Menor o igual)
```

### Igualdad Débil (`==`) vs Igualdad Estricta (`===`)

En JavaScript existe un mecanismo llamado **Coerción de Tipos Implícita**: cuando comparas dos valores de distinto tipo con `==`, JavaScript intenta convertir uno de ellos por detrás antes de comparar. Esto conduce a comportamientos impredecibles:

```typescript
// ❌ Igualdad débil (==): ¡Peligro de bugs silenciosos!
console.log(5 == "5");       // true (convierte el texto "5" a número 5)
console.log(0 == false);     // true (convierte false a 0)
console.log("" == 0);        // true (convierte el texto vacío a 0)
console.log(null == undefined); // true

// ✅ Igualdad estricta (===): ¡El estándar profesional!
// Compara TANTO el valor COMO el tipo de dato.
console.log(5 === "5");       // false (number !== string)
console.log(0 === false);     // false (number !== boolean)
console.log("" === 0);        // false
console.log(null === undefined); // false
```

> [!CAUTION]
> **Usa siempre `===` y `!==`.**
> En TypeScript y JavaScript profesional, el uso de `==` o `!=` está prácticamente prohibido por guías de estilo porque destruye la seguridad del código.

### Conversión Explícita de Tipos
Cuando realmente necesites transformar un tipo de dato a otro, hazlo de forma deliberada y visible:

```typescript
const inputUsuario: string = "42";

// De string a number
const edadNumerica: number = Number(inputUsuario); // 42
const decimal: number = parseFloat("19.99");       // 19.99

// De number a string
const textoPuntos: string = String(100); // "100"
const textoMetodo: string = (100).toString(); // "100"

// A booleano
const esValido: boolean = Boolean(1); // true
const esVacio: boolean = Boolean(""); // false
```

---

## 🛠️ Reto Práctico del Módulo

**Ejercicio: Validador de Facturación para una Tienda**

Crea un script que calcule el total de una compra con los siguientes requerimientos:
1. Declara el subtotal de la compra con `const` (ejemplo: `$1200`).
2. Declara un porcentaje de descuento (ejemplo: `15%`).
3. Calcula el monto descontado y el subtotal con descuento.
4. Aplica el IVA del `16%` sobre el subtotal con descuento.
5. Determina si el cliente tiene derecho a envío gratuito: el envío es gratis si el total final supera los `$1000` **O** si el número de productos comprados es múltiplo de `3` (usa el operador módulo `%`).
6. Muestra un resumen detallado en consola usando **template literals**.
