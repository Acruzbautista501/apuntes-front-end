# Módulo 4: Arrays y Manipulación de Datos

Los arrays son la estructura de datos más usada en PHP — cubren tanto listas indexadas como diccionarios clave-valor con el mismo tipo. Este módulo cubre su sintaxis y las funciones nativas más importantes para transformarlos.

## 4.1 Arrays Indexados

```php
<?php
$frutas = ["manzana", "pera", "uva"];
$frutas[] = "kiwi"; // Añadir al final

echo $frutas[0];       // "manzana"
echo count($frutas);   // 4
```

## 4.2 Arrays Asociativos

```php
<?php
$usuario = [
    "nombre" => "Alex",
    "edad" => 28,
    "activo" => true,
];

echo $usuario["nombre"]; // "Alex"
$usuario["email"] = "alex@ejemplo.com"; // Añadir una nueva clave
```

A diferencia de JavaScript, PHP **no distingue** entre arrays y objetos-diccionario a nivel de sintaxis básica — un único tipo `array` cubre ambos casos, diferenciándose solo por si las claves son numéricas secuenciales o strings arbitrarios.

## 4.3 Arrays Multidimensionales

```php
<?php
$productos = [
    ["nombre" => "Teclado", "precio" => 89.99],
    ["nombre" => "Mouse", "precio" => 29.99],
];

echo $productos[0]["nombre"]; // "Teclado"
```

## 4.4 Funciones de Transformación: `array_map`, `array_filter`, `array_reduce`

```php
<?php
$numeros = [1, 2, 3, 4, 5];

$duplicados = array_map(fn($n) => $n * 2, $numeros);
// [2, 4, 6, 8, 10]

$pares = array_filter($numeros, fn($n) => $n % 2 === 0);
// [1 => 2, 3 => 4] — OJO: conserva las claves originales

$suma = array_reduce($numeros, fn($acumulado, $n) => $acumulado + $n, 0);
// 15
```

El equivalente directo de `.map()`, `.filter()` y `.reduce()` de JavaScript — con una diferencia importante: `array_filter` **conserva las claves originales** del array, por lo que suele combinarse con `array_values()` para reindexar el resultado si se necesita un array secuencial limpio.

```php
<?php
$pares = array_values(array_filter($numeros, fn($n) => $n % 2 === 0));
// [0 => 2, 1 => 4] — reindexado
```

## 4.5 Funciones de Búsqueda y Consulta

```php
<?php
$frutas = ["manzana", "pera", "uva"];

in_array("pera", $frutas);        // true
array_search("uva", $frutas);      // 2 (índice)

$usuario = ["nombre" => "Alex"];
array_key_exists("nombre", $usuario); // true
isset($usuario["email"]);              // false — también sirve para verificar existencia
```

## 4.6 Ordenar Arrays

```php
<?php
$numeros = [5, 3, 1, 4, 2];

sort($numeros);          // Ordena y reindexa: [1, 2, 3, 4, 5]
rsort($numeros);          // Orden descendente

$usuarios = [["edad" => 30], ["edad" => 20], ["edad" => 40]];
usort($usuarios, fn($a, $b) => $a["edad"] <=> $b["edad"]); // Ordena por un criterio personalizado
```

El operador `<=>` ("nave espacial") devuelve `-1`, `0` o `1` según la comparación — el patrón estándar para funciones de ordenamiento personalizado en PHP, equivalente al valor de retorno esperado por `.sort()` en JavaScript.

## 4.7 Desestructuración con `list()` / `[]`

```php
<?php
[$primero, $segundo] = ["manzana", "pera"]; // Desestructuración de arrays indexados

["nombre" => $nombre, "edad" => $edad] = ["nombre" => "Alex", "edad" => 28]; // Y asociativos
```

## 4.8 El Operador de Propagación (Spread, PHP 7.4+)

```php
<?php
$primeros = [1, 2, 3];
$segundos = [4, 5, 6];
$combinados = [...$primeros, ...$segundos]; // [1, 2, 3, 4, 5, 6]

function sumar(int ...$numeros): int {
    return array_sum($numeros);
}
sumar(...$primeros); // Expande el array como argumentos individuales
```

## 4.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Transformar cada elemento | `array_map(fn($x) => ..., $array)` |
| Filtrar elementos por condición | `array_filter($array, fn($x) => ...)` |
| Reducir a un único valor acumulado | `array_reduce($array, fn($acc, $x) => ..., $inicial)` |
| Verificar si un valor existe | `in_array($valor, $array)` |
| Verificar si una clave existe | `array_key_exists($clave, $array)` |
| Ordenar con un criterio personalizado | `usort($array, fn($a, $b) => $a <=> $b)` |
| Combinar arrays | `[...$array1, ...$array2]` |

## 4.10 Errores Comunes

- **Olvidar reindexar tras `array_filter`**: las claves originales se conservan, lo que puede romper el acceso por índice numérico secuencial esperado (`$array[0]`) tras filtrar.
- **Confundir `array_search` (devuelve índice o `false`) con `in_array` (devuelve booleano)**: usar el primero cuando solo se necesita comprobar existencia añade complejidad innecesaria.
- **Comparar `array_search()` con `==` en lugar de `===`**: si el índice encontrado es `0`, una comparación laxa contra `false` (`0 == false` es `true`) produce bugs sutiles — siempre usar `===` al verificar el resultado de `array_search`.
