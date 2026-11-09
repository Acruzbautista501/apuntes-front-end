
# Módulo 6. Ciclos

Hasta este módulo, si necesitabas procesar cinco productos, calcular la suma de diez precios o mostrar una lista de elementos en pantalla, tenías que escribir una instrucción independiente para cada uno. ¿Qué pasaría si tu tienda tuviera 500 productos? Escribir código manual sería imposible.

Para eso existen los **ciclos** (o bucles): estructuras que permiten repetir un bloque de código de forma automatizada tantas veces como sea necesario.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Comprender** la utilidad de los ciclos para evitar la duplicación de código.
- **Utilizar** el ciclo `for...of` para recorrer colecciones de datos (arrays).
- **Acumular** valores y procesar información dentro de un bucle.
- **Combinar** ciclos con condiciones `if` para filtrar datos.
- **Conocer** los errores más comunes al trabajar con iteraciones.

## 1. El problema de la repetición manual

Imagina que estás construyendo un sistema de inventario y necesitas mostrar el nombre de cuatro productos almacenados en una lista básica:

```javascript
const productos = ["Teclado", "Mouse", "Monitor", "Audífonos"];

console.log(productos[0]);
console.log(productos[1]);
console.log(productos[2]);
console.log(productos[3]);

```

**Resultado en consola:**

```text
Teclado
Mouse
Monitor
Audífonos

```

Funciona perfectamente para cuatro elementos. Pero si el catálogo crece a 50 o 1,000 productos, este enfoque se vuelve inejecutable y propenso a errores humanos.

Los ciclos automatizan esta tarea repetitiva: le indican a la computadora "toma cada elemento de esta lista y ejecútale estas instrucciones".

## 2. Recorriendo colecciones con el ciclo `for...of`

En JavaScript moderno, la forma más limpia, legible y recomendada para recorrer los elementos de un arreglo (*array*) es utilizando el ciclo `for...of`.

Observa cómo resolvemos el problema anterior con pocas líneas de código:

```javascript
const productos = ["Teclado", "Mouse", "Monitor", "Audífonos"];

for (const producto of productos) {
  console.log(producto);
}

```

**Resultado:**

```text
Teclado
Mouse
Monitor
Audífonos

```

### ¿Cómo se lee y cómo funciona?

* **`for`**: La palabra clave que indica el inicio de un ciclo.
* **`const producto`**: Una variable temporal que se crea automáticamente en cada vuelta (o iteración) del ciclo para almacenar el elemento que se está leyendo en ese momento.
* **`of`**: La palabra de enlace que indica de dónde vamos a extraer los elementos.
* **`productos`**: La colección o arreglo que queremos recorrer.

En la primera vuelta, `producto` vale `"Teclado"`; en la segunda, `"Mouse"`, y así sucesivamente hasta terminar la lista completa.

## 3. Ejemplo práctico: Acumulando valores (Sumando precios)

Un caso de uso sumamente común en el desarrollo web es calcular el costo total de una lista de compras sumando cada uno de sus precios.

```javascript
const precios = [150, 350, 1200, 80];
let totalCompra = 0; // Variable acumuladora inicializada en cero

for (const precio of precios) {
  totalCompra += precio; // Sumamos el precio actual al acumulador
}

console.log("El costo total de la compra es:", totalCompra);

```

**Resultado:**

```text
El costo total de la compra es: 1780

```

### Detalle del proceso paso a paso:

1. Declaramos `let totalCompra = 0` fuera del ciclo para guardar el resultado acumulado. (Usamos `let` porque su valor cambiará en cada iteración).
2. El ciclo recorre el arreglo `precios` uno por uno.
3. En cada iteración, `totalCompra += precio` toma el valor anterior y le suma el precio actual ($0 + 150$, luego $150 + 350$, etc.).
4. Al finalizar el ciclo, la variable contiene el resultado global de la suma.

## 4. Combinando ciclos y condiciones

Los ciclos adquieren aún más potencia cuando integramos lo aprendido en el módulo anterior. Podemos evaluar condiciones `if` dentro de un ciclo para filtrar información o tomar decisiones por cada elemento.

**Ejemplo:** Mostrar únicamente los productos cuyo precio sea mayor a $500.

```javascript
const preciosProductos = [150, 750, 320, 1200, 450];

console.log("Productos con precio superior a $500:");

for (const precio of preciosProductos) {
  if (precio > 500) {
    console.log(`- Producto costoso con valor de: $${precio}`);
  }
}

```

**Resultado:**

```text
Productos con precio superior a $500:
- Producto costoso con valor de: $750
- Producto costoso con valor de: $1200

```

## 5. Experimenta

Crea un archivo de pruebas o abre tu consola y ejecuta el siguiente bloque:

```javascript
const calificaciones = [8, 9, 6, 10, 7];
let sumaCalificaciones = 0;

for (const calificacion of calificaciones) {
  sumaCalificaciones += calificacion;
}

const promedio = sumaCalificaciones / calificaciones.length;
console.log("Promedio final:", promedio);

```

*(Nota: `calificaciones.length` nos devuelve de forma automática cuántos elementos tiene el arreglo).*

::: tip Preguntas para reflexionar

1. ¿Qué pasaría si agregas dos calificaciones más al arreglo? ¿El promedio se calcula correctamente sin modificar el ciclo?
2. ¿Por qué es indispensable declarar la variable acumuladora (`sumaCalificaciones`) fuera del ciclo y no dentro de él? (Piénsalo: si se declara dentro, su valor se reiniciaría a 0 en cada vuelta).
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Declarar acumuladores dentro del ciclo.**
Si escribes `let total = 0` dentro de las llaves del `for`, la variable se borrará y volverá a cero en cada iteración, arruinando cualquier cálculo de suma o conteo. Declárala siempre antes del ciclo.
* **Error 2: Modificar la constante temporal del `for...of`.**
La variable declarada con `const` en la cabecera del ciclo (`for (const item of lista)`) es de solo lectura para esa iteración. Intentar reasignarle un valor directamente (`item = item + 1`) provocará un error.
* **Error 3: Olvidar definir el punto de parada o colecciones vacías.**
Aunque el `for...of` maneja colecciones vacías de forma segura (simplemente no entra al bloque), es vital asegurarte de que la variable que recorres sea realmente un arreglo iterable.
:::

## 7. Ejercicios prácticos

### Ejercicio 1: Contador de stock crítico

Tienes un arreglo con las cantidades disponibles de distintos productos en almacén:

```javascript
const stockProductos = [12, 3, 0, 25, 4, 0, 15];

```

1. Utiliza un ciclo `for...of` para recorrer el arreglo.
2. Implementa una condición para contar cuántos productos tienen un stock de `0` (agotados).
3. Muestra el total de productos agotados en la consola al finalizar el recorrido.

### Ejercicio 2: Validador de precios máximos

Dado un arreglo de precios:

```javascript
const preciosArticulos = [450, 1200, 890, 320, 2100];

```

1. Recorre la lista con un ciclo.
2. Encuentra y muestra en consola cuáles artículos superan los $1,000 indicando un mensaje de alerta.


## 8. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Ciclo / Bucle** | Estructura para automatizar la ejecución repetitiva de un bloque de código. |
| **`for...of`** | El ciclo moderno ideal en JavaScript para recorrer colecciones o arreglos de datos. |
| **Iteración** | Cada una de las vueltas o ejecuciones individuales que realiza el ciclo. |
| **Acumulador** | Variable externa utilizada para sumar o recolectar resultados durante el bucle. |


::: tip ¡Siguiente paso!
Antes de avanzar al siguiente módulo, asegúrate de dominar cómo opera un ciclo `for...of` y cómo declarar variables acumuladoras externas. En el Módulo 7 exploraremos cómo empaquetar bloques de código reutilizables mediante funciones.
:::