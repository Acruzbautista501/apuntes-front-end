# Módulo 2: Sintaxis Básica, Variables y Tipos de Datos

Este módulo cubre la sintaxis fundamental de PHP: variables, tipos de datos, y las reglas básicas del lenguaje — la base necesaria antes de cualquier concepto más avanzado.

## 2.1 Variables

```php
<?php
$nombre = "Alex";       // Todas las variables empiezan con $
$edad = 28;
$activo = true;
$precio = 19.99;

echo $nombre; // "Alex"
```

A diferencia de JavaScript/TypeScript, PHP **requiere** el símbolo `$` antes de cada nombre de variable — no es opcional, es parte de la sintaxis del lenguaje.

## 2.2 Tipos de Datos Escalares

```php
<?php
$entero = 42;                // int
$decimal = 3.14;              // float
$texto = "Hola";               // string
$booleano = true;               // bool

var_dump($entero);   // int(42)
var_dump($decimal);  // float(3.14)
```

`var_dump()` es la herramienta de depuración más usada en PHP — muestra el tipo exacto y el valor de cualquier variable, muy útil mientras se aprende cómo PHP infiere tipos.

## 2.3 Tipos Compuestos

```php
<?php
$colores = ["rojo", "verde", "azul"]; // array (Módulo 4)

$persona = (object) ["nombre" => "Alex", "edad" => 28]; // object

$sinValor = null; // null
```

## 2.4 Interpolación de Strings

```php
<?php
$nombre = "Alex";

// Comillas dobles: interpolan variables directamente
echo "Hola, $nombre";              // "Hola, Alex"
echo "Hola, {$nombre}!";            // Con llaves, útil para casos ambiguos: "Hola, Alex!"

// Comillas simples: NO interpolan, se muestran literalmente
echo 'Hola, $nombre';               // "Hola, $nombre" (literal, sin interpolar)
```

> **Nota importante para quien viene de Vue**: la sintaxis `{$nombre}` usa una sola llave junto al signo `$`, no un par de llaves dobles — es completamente distinta a la interpolación de plantillas de Vue o Handlebars y no representa ningún riesgo de confusión con esos sistemas.

## 2.5 Concatenación con el Operador `.`

```php
<?php
$nombre = "Alex";
$saludo = "Hola, " . $nombre . "!"; // El punto concatena strings, no el "+" como en JavaScript

$saludo .= " Bienvenido."; // Operador de concatenación con asignación
```

## 2.6 Tipado Opcional (PHP 8+)

```php
<?php
function saludar(string $nombre, int $edad): string {
    return "Hola, $nombre. Tienes $edad años.";
}

echo saludar("Alex", 28);
```

Desde PHP 7, el lenguaje soporta tipado de parámetros y valores de retorno — **opcional**, pero fuertemente recomendado en código moderno (el mismo principio que TypeScript aporta sobre JavaScript, ya establecido en las secciones de frontend/Node.js de este sitio). Con `declare(strict_types=1)` (2.7), PHP incluso rechaza conversiones automáticas de tipo no deseadas.

## 2.7 Modo Estricto: `declare(strict_types=1)`

```php
<?php
declare(strict_types=1); // Debe ser la primera línea ejecutable del archivo

function duplicar(int $numero): int {
    return $numero * 2;
}

duplicar(5);      // ✅ Correcto
duplicar("5");    // ❌ TypeError: sin strict_types, PHP convertiría "5" automáticamente a 5
```

Sin `strict_types`, PHP intenta convertir automáticamente los tipos (*type coercion*) para que coincidan con lo declarado — con `strict_types` habilitado, un tipo incorrecto lanza un error inmediato en lugar de una conversión silenciosa, reduciendo bugs sutiles. Se recomienda en **todo** archivo PHP moderno.

## 2.8 Constantes

```php
<?php
define('IVA', 0.16);           // Forma clásica
const MAX_INTENTOS = 3;         // Forma moderna, preferida dentro de clases y en el ámbito global

echo IVA; // 0.16
```

## 2.9 Operadores Comunes

```php
<?php
// Comparación
5 == "5"    // true — compara valor, permite conversión de tipo
5 === "5"   // false — compara valor Y tipo, sin conversión (preferido casi siempre)

// Operador de fusión de null (null coalescing)
$nombre = $datos['nombre'] ?? 'Invitado'; // Usa 'Invitado' si $datos['nombre'] no existe o es null

// Operador ternario abreviado
$resultado = $valor ?: 'valor por defecto'; // Usa $valor si es "truthy", si no, el valor por defecto
```

`===` (comparación estricta) es casi siempre la opción correcta sobre `==` — evita comparaciones sorprendentes como `0 == "hola"` (que da `false` en PHP moderno, pero comportamientos de comparación laxa históricamente causaron bugs de seguridad reales en PHP, por lo que la comparación estricta es la práctica recomendada por defecto).

## 2.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Declarar una variable | `$nombre = valor;` |
| Insertar una variable dentro de un string | Comillas dobles: `"Hola, $nombre"` |
| Concatenar strings | El operador `.` |
| Tipado estricto de parámetros/retorno | `function nombre(string $x): int { }` + `declare(strict_types=1)` |
| Comparación segura sin conversión de tipo | `===` en lugar de `==` |
| Un valor de reserva si algo es `null` | El operador `??` |

## 2.11 Errores Comunes

- **Olvidar el `$` al declarar o usar una variable**: PHP lo requiere siempre, a diferencia de JavaScript.
- **Usar `==` en lugar de `===`**: puede producir comparaciones inesperadas por conversión automática de tipos.
- **No habilitar `declare(strict_types=1)`**: permite que errores de tipo pasen desapercibidos como conversiones silenciosas en lugar de errores explícitos detectables temprano.
