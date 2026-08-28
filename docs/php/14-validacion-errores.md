# Módulo 14: Validación de Datos y Manejo de Errores Centralizado

Ningún dato externo (cuerpo JSON, query params, cabeceras) debe confiarse sin validar. Este módulo cubre cómo validar datos de entrada y centralizar el manejo de errores en una API sin framework.

## 14.1 Validación Manual Básica

```php
<?php
function validarCrearProducto(array $datos): array
{
    $errores = [];

    if (empty($datos['nombre']) || !is_string($datos['nombre'])) {
        $errores['nombre'] = 'El nombre es requerido y debe ser texto';
    }

    if (!isset($datos['precio']) || !is_numeric($datos['precio']) || $datos['precio'] <= 0) {
        $errores['precio'] = 'El precio debe ser un número mayor a 0';
    }

    return $errores;
}
```

Validar manualmente cada campo es viable en proyectos pequeños, pero se vuelve repetitivo y propenso a inconsistencias a medida que crecen los endpoints — la alternativa preferida es una biblioteca de validación dedicada.

## 14.2 Validación con `respect/validation`

```bash
composer require respect/validation
```

```php
<?php
use Respect\Validation\Validator as v;

$validador = v::key('nombre', v::stringType()->notEmpty()->length(1, 100))
    ->key('precio', v::numericVal()->positive());

try {
    $validador->assert($datos);
} catch (\Respect\Validation\Exceptions\NestedValidationException $e) {
    $errores = $e->getMessages(); // Array asociativo campo → mensaje de error
}
```

## 14.3 La Excepción de Validación (del Módulo 6)

```php
<?php
namespace App\Excepciones;

class ValidacionException extends ApiException
{
    public function __construct(private readonly array $errores)
    {
        parent::__construct('Los datos enviados no son válidos');
    }

    public function codigoHttp(): int { return 422; }
    public function errores(): array { return $this->errores; }
}
```

```php
<?php
namespace App\Servicios;

class ProductoServicio
{
    public function crear(array $datos): array
    {
        $errores = validarCrearProducto($datos);

        if (!empty($errores)) {
            throw new ValidacionException($errores);
        }

        return $this->repositorio->crear($datos['nombre'], (float) $datos['precio']);
    }
}
```

Lanzar una excepción tipada en lugar de devolver un array de errores directamente permite que el manejador centralizado (14.4) decida cómo responder, sin que el controlador ni el servicio necesiten conocer los detalles del formato de la respuesta HTTP.

## 14.4 Manejador de Errores Centralizado

```php
<?php
// public/index.php
try {
    // ... despachar la ruta y ejecutar el controlador
} catch (ValidacionException $e) {
    Response::json(['error' => $e->getMessage(), 'detalles' => $e->errores()], $e->codigoHttp());
} catch (ApiException $e) {
    Response::json(['error' => $e->getMessage()], $e->codigoHttp());
} catch (\Throwable $e) {
    error_log($e->getMessage()); // Registrar el error real internamente
    Response::json(['error' => 'Error interno del servidor'], 500); // Nunca exponer detalles internos al cliente
}
```

Este único bloque `try`/`catch` alrededor de todo el ciclo de despacho es el equivalente PHP al middleware de manejo de errores centralizado de Express (Módulo 9 del curso de Node.js) — cada excepción de negocio ya sabe su propio código HTTP (gracias a `ApiException::codigoHttp()`), evitando repetir esa lógica de mapeo en cada controlador.

## 14.5 Validar el Tipo de Contenido de la Petición

```php
<?php
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (!str_contains($contentType, 'application/json')) {
    Response::error('Se esperaba Content-Type: application/json', 415);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), associative: true);

if (json_last_error() !== JSON_ERROR_NONE) {
    Response::error('JSON malformado', 400);
    exit;
}
```

`json_decode` no lanza una excepción por defecto ante un JSON inválido — devuelve `null` silenciosamente, indistinguible de un cuerpo `"null"` válido, por lo que **siempre** debe verificarse `json_last_error()` explícitamente tras decodificar entrada externa.

## 14.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Validar reglas de negocio sobre datos de entrada | `respect/validation`, o validación manual en proyectos pequeños |
| Comunicar errores de validación con su código HTTP correcto | Una excepción tipada (`ValidacionException extends ApiException`) |
| Manejar todos los errores de la API en un único lugar | Un `try`/`catch` centralizado en `public/index.php` |
| Detectar JSON malformado en el cuerpo de la petición | `json_last_error() !== JSON_ERROR_NONE` tras `json_decode` |

## 14.7 Errores Comunes

- **Confiar en que `json_decode` lanza un error ante JSON inválido**: devuelve `null` silenciosamente — siempre verificar `json_last_error()`.
- **Exponer el mensaje real de una excepción interna (`\Throwable`) al cliente**: puede filtrar detalles de implementación o de infraestructura — el manejador centralizado debe devolver un mensaje genérico y registrar el detalle real solo en logs internos.
- **Duplicar lógica de validación en cada controlador**: sin centralizarla en el servicio o una capa de validación dedicada, las reglas de negocio se vuelven inconsistentes entre endpoints.
