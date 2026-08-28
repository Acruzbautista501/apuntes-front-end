# Módulo 3: Estructuras de Control y Funciones

Este módulo cubre condicionales, bucles y funciones en PHP — sintaxis familiar para cualquiera que venga de JavaScript/TypeScript, con algunas particularidades propias del lenguaje.

## 3.1 Condicionales

```php
<?php
$edad = 20;

if ($edad >= 18) {
    echo "Mayor de edad";
} elseif ($edad >= 13) {
    echo "Adolescente";
} else {
    echo "Niño";
}
```

## 3.2 `match` — El Reemplazo Moderno de `switch` (PHP 8+)

```php
<?php
$codigo = 404;

$mensaje = match ($codigo) {
    200, 201 => "Éxito",           // Varios valores pueden compartir el mismo resultado
    404 => "No encontrado",
    500 => "Error del servidor",
    default => "Código desconocido"
};

echo $mensaje; // "No encontrado"
```

A diferencia de `switch`, `match` usa comparación **estricta** (`===`) automáticamente, no requiere `break` en cada caso (no hay *fallthrough* accidental), y es una **expresión** que devuelve un valor directamente — la forma moderna y recomendada sobre `switch` en PHP 8+.

## 3.3 Bucles

```php
<?php
// for
for ($i = 0; $i < 5; $i++) {
    echo $i;
}

// while
$contador = 0;
while ($contador < 5) {
    echo $contador;
    $contador++;
}

// foreach — el más usado para iterar arrays (Módulo 4)
$frutas = ["manzana", "pera", "uva"];
foreach ($frutas as $fruta) {
    echo $fruta;
}

// foreach con clave y valor
$precios = ["manzana" => 1.5, "pera" => 2.0];
foreach ($precios as $nombre => $precio) {
    echo "$nombre cuesta $precio";
}
```

`foreach` es, con diferencia, el bucle más usado en PHP idiomático — el equivalente directo a `for...of` en JavaScript, pero con soporte nativo para iterar pares clave-valor sin destructuring adicional.

## 3.4 Funciones Básicas

```php
<?php
function saludar(string $nombre): string {
    return "Hola, $nombre";
}

echo saludar("Alex");
```

## 3.5 Parámetros con Valor por Defecto

```php
<?php
function crearUsuario(string $nombre, string $rol = "usuario"): array {
    return ["nombre" => $nombre, "rol" => $rol];
}

crearUsuario("Alex");             // rol: "usuario"
crearUsuario("Alex", "admin");     // rol: "admin"
```

## 3.6 Argumentos con Nombre (Named Arguments, PHP 8+)

```php
<?php
function crearProducto(string $nombre, float $precio, bool $disponible = true) {
    // ...
}

crearProducto(nombre: "Teclado", precio: 89.99, disponible: false);
crearProducto(precio: 29.99, nombre: "Mouse"); // El orden no importa al usar argumentos con nombre
```

Los argumentos con nombre mejoran la legibilidad en funciones con muchos parámetros, especialmente cuando algunos son opcionales — evita tener que pasar valores intermedios "por posición" solo para llegar a un parámetro específico más adelante en la firma.

## 3.7 Tipos de Retorno Union y Nullable

```php
<?php
function buscarUsuario(int $id): array|null { // La función puede devolver un array O null
    // ...
    return null; // Si no se encuentra
}

function obtenerEdad(?int $edad = null): int { // "?int" es equivalente a "int|null"
    return $edad ?? 0;
}
```

## 3.8 Funciones Variádicas (Argumentos Múltiples)

```php
<?php
function sumar(int ...$numeros): int {
    return array_sum($numeros);
}

sumar(1, 2, 3, 4); // 10 — cualquier cantidad de argumentos se agrupa en un array dentro de la función
```

## 3.9 Funciones Anónimas y Arrow Functions

```php
<?php
// Función anónima (closure)
$duplicar = function (int $x): int {
    return $x * 2;
};

echo $duplicar(5); // 10

// Arrow function (PHP 7.4+), sintaxis concisa que captura el ámbito exterior automáticamente
$triplicar = fn(int $x): int => $x * 3;

echo $triplicar(5); // 15
```

Las *arrow functions* (`fn`) son el equivalente PHP a las funciones flecha de JavaScript — capturan automáticamente variables del ámbito exterior (sin necesitar `use`, a diferencia de las funciones anónimas clásicas), ideales para callbacks cortos.

## 3.10 Closures con `use`

```php
<?php
$impuesto = 0.16;

$calcularConImpuesto = function (float $precio) use ($impuesto): float {
    return $precio * (1 + $impuesto);
};

echo $calcularConImpuesto(100); // 116.0
```

A diferencia de las *arrow functions*, una función anónima clásica **no** captura automáticamente variables externas — deben declararse explícitamente con `use (...)`.

## 3.11 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un condicional múltiple que devuelve un valor | `match` (PHP 8+), preferido sobre `switch` |
| Iterar un array | `foreach ($array as $clave => $valor)` |
| Pasar argumentos por nombre en lugar de posición | Argumentos con nombre: `funcion(parametro: valor)` |
| Una función que acepta cualquier cantidad de argumentos | `function nombre(...$args)` |
| Un callback corto de una sola expresión | Arrow function: `fn($x) => $x * 2` |
| Capturar variables externas en una función anónima clásica | `use ($variable)` |

## 3.12 Errores Comunes

- **Usar `switch` en lugar de `match` en PHP 8+**: `switch` usa comparación laxa (`==`) por defecto y requiere `break` explícito en cada caso, siendo más propenso a bugs por *fallthrough* accidental.
- **Olvidar `use` en una función anónima clásica**: la función no tiene acceso a variables del ámbito exterior sin declararlas explícitamente, a diferencia de una arrow function.
- **No tipar los parámetros y el retorno de las funciones**: pierde una capa importante de detección temprana de errores, especialmente relevante en proyectos backend donde los datos externos (Módulo 10) nunca deben asumirse con el tipo correcto sin verificación.
