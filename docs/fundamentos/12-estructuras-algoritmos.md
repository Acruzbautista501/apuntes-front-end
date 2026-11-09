
# Módulo 12. Estructuras de datos y algoritmos

Hasta ahora has aprendido a almacenar datos en variables, arreglos y objetos, así como a recorrerlos con ciclos y métodos. Sin embargo, a medida que tus aplicaciones manejan miles o millones de registros (como buscar un usuario en una base de datos masiva o ordenar un catálogo de productos), la eficiencia se convierte en un factor crítico.

Las estructuras de datos y los algoritmos son las herramientas lógicas que te permiten organizar la información de manera óptima y resolver problemas de procesamiento de forma eficiente.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Comprender** qué es un algoritmo y por qué la lógica de resolución importa.
- **Implementar** algoritmos de búsqueda (búsqueda lineal vs. búsqueda binaria conceptual).
- **Comprender** cómo funcionan los algoritmos de ordenamiento básicos.
- **Aplicar** técnicas algorítmicas para resolver problemas comunes en JavaScript.

## 1. ¿Qué es un algoritmo?

Un algoritmo no es más que una secuencia de pasos finitos, precisos y ordenados diseñados para resolver un problema específico o realizar una tarea.

Un buen algoritmo debe cumplir con tres características principales:

1. **Claridad:** Cada paso debe estar perfectamente definido sin ambigüedades.
2. **Finitud:** Debe terminar su ejecución después de un número finito de pasos (evitando ciclos infinitos).
3. **Eficiencia:** Debe resolver el problema utilizando la menor cantidad de recursos posibles de memoria y tiempo de procesamiento.

## 2. Algoritmos de búsqueda

Cuando buscas un elemento dentro de una colección (por ejemplo, encontrar el precio de un producto en un arreglo de 10,000 elementos), la forma en que realizas la búsqueda determina la velocidad de la respuesta.

### A. Búsqueda lineal (Linear Search)
Consiste en recorrer la colección elemento por elemento desde el inicio hasta el final hasta encontrar la coincidencia exacta. Es el método que implementa por defecto el método `find()` o `includes()` en arreglos desordenados.

```javascript
const codigosProductos = [450, 120, 890, 320, 1500, 75];

function buscarCodigoLineal(arreglo, valorBuscado) {
  for (let i = 0; i < arreglo.length; i++) {
    if (arreglo[i] === valorBuscado) {
      return i; // Retorna el índice donde lo encontró
    }
  }
  return -1; // Si no lo encuentra, retorna -1
}

console.log("Posición encontrada:", buscarCodigoLineal(codigosProductos, 320));

```

**Resultado:**

```text
Posición encontrada: 3

```

* **Ventaja:** Funciona con cualquier arreglo, esté ordenado o no.
* **Desventaja:** Si el elemento está al final o no existe, la computadora tiene que revisar absolutamente todos los elementos.

### B. Búsqueda binaria (Binary Search)

Si tu arreglo está previamente ordenado, la búsqueda binaria es exponencialmente más rápida. En lugar de revisar uno por uno, el algoritmo examina el elemento central:

* Si el valor buscado coincide con el centro, termina.
* Si el valor buscado es menor, descarta toda la mitad derecha y repite el proceso en la mitad izquierda.
* Si es mayor, descarta la mitad izquierda y busca en la derecha.

En cada paso, el algoritmo reduce el universo de búsqueda a la mitad, permitiendo encontrar un elemento entre 1,000,000 de registros en apenas unas 20 iteraciones.

## 3. Algoritmos de ordenamiento

Ordenar datos es otra tarea fundamental (por ejemplo, ordenar un catálogo de menor a mayor precio). JavaScript incluye un método nativo llamado `.sort()`, pero comprender cómo opera por debajo es clave para dominar la lógica de programación.

Ejemplo con el método nativo ordenando precios de forma numérica:

```javascript
const precios = [450, 1200, 80, 320, 1500];

// El método sort requiere una función de comparación para ordenar números correctamente
const preciosOrdenados = precios.sort((a, b) => a - b);

console.log("Precios ordenados:", preciosOrdenados);

```

**Resultado:**

```text
Precios ordenados: [80, 320, 450, 1200, 1500]

```

## 4. Ejemplo práctico: Encontrando el valor máximo en un arreglo

Un problema algorítmico clásico consiste en recorrer un conjunto de datos numéricos para determinar cuál es el valor más alto (por ejemplo, el producto más caro de una tienda).

```javascript
const preciosCatalogo = [350, 1200, 85, 2400, 450];

function encontrarPrecioMaximo(precios) {
  let maximo = precios[0]; // Asumimos provisionalmente que el primero es el mayor

  for (const precio of precios) {
    if (precio > maximo) {
      maximo = precio; // Actualizamos el valor máximo si encontramos uno mayor
    }
  }

  return maximo;
}

console.log("El producto más caro cuesta:", encontrarPrecioMaximo(preciosCatalogo));

```

**Resultado:**

```text
El producto más caro cuesta: 2400

```

## 5. Experimenta

Crea un archivo de pruebas en tu entorno y ejecuta el siguiente algoritmo para calcular la suma total de los elementos mediante un enfoque algorítmico manual:

```javascript
const calificaciones = [85, 90, 78, 92, 88];

function calcularSumaAlgoritmica(numeros) {
  let acumulador = 0;
  for (let i = 0; i < numeros.length; i++) {
    acumulador += numeros[i];
  }
  return acumulador;
}

console.log("Suma total:", calcularSumaAlgoritmica(calificaciones));

```

::: tip Preguntas para reflexionar

1. ¿Qué diferencia lógica existe entre usar un ciclo clásico con índices (`for (let i = 0; ...)`) y un ciclo moderno (`for...of`)?
2. ¿Cómo modificarías la función anterior para calcular el promedio en lugar de solo la suma?
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Usar `sort()` en números sin función de comparación.**
Por defecto, el método `.sort()` en JavaScript convierte los elementos a texto y los ordena alfabéticamente. Esto provoca que `[100, 25, 5]` se ordene extrañamente. Utiliza siempre `(a, b) => a - b`.
* **Error 2: Modificar estructuras ordenadas sin mantener la consistencia.**
Aplicar algoritmos de búsqueda que asumen orden (como búsqueda binaria) sobre colecciones desarticuladas, lo que provocará fallos silenciosos en los resultados.
:::

## 7. Ejercicios prácticos

### Ejercicio 1: Encontrando el producto más económico

Dado el siguiente arreglo de objetos que representan productos con sus precios:

```javascript
const inventarioTienda = [
  { producto: "Teclado", precio: 450 },
  { producto: "Mouse", precio: 180 },
  { producto: "Monitor", precio: 2500 },
  { producto: "Audífonos", precio: 320 }
];

```

1. Diseña una función algorítmica que recorra el arreglo y encuentre el objeto correspondiente al producto más económico.
2. Muestra el nombre y el precio del producto encontrado en la consola.

## 8. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Algoritmo** | Secuencia ordenada de pasos lógicos diseñados para resolver un problema específico. |
| **Búsqueda Lineal** | Recorrido secuencial elemento por elemento; útil para colecciones desordenadas. |
| **Búsqueda Binaria** | Algoritmo altamente eficiente que reduce el espacio de búsqueda a la mitad en datos ordenados. |
| **Ordenamiento numérico** | Requiere especificar una función de comparación `(a, b) => a - b` al usar `.sort()`. |


::: tip ¡Siguiente paso!
Antes de avanzar al siguiente módulo, asegúrate de comprender cómo funcionan los algoritmos básicos de recorrido y comparación. En el Módulo 13 exploraremos el manejo de errores y depuración.
:::