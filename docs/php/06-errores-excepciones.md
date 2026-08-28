# Módulo 6: Manejo de Errores y Excepciones

Un manejo de errores robusto es tan crítico en PHP como en cualquier backend — este módulo cubre excepciones, jerarquías de errores personalizadas y las particularidades del modelo de errores de PHP.

## 6.1 `try`/`catch`/`finally`

```php
<?php
try {
    $resultado = 10 / 0; // DivisionByZeroError en PHP 8+
} catch (\DivisionByZeroError $e) {
    echo "Error: " . $e->getMessage();
} finally {
    echo "Esto se ejecuta siempre, haya error o no.";
}
```

## 6.2 Lanzar Excepciones Propias

```php
<?php
function retirarSaldo(float $saldo, float $monto): float {
    if ($monto > $saldo) {
        throw new \InvalidArgumentException("Saldo insuficiente");
    }
    return $saldo - $monto;
}

try {
    retirarSaldo(100, 150);
} catch (\InvalidArgumentException $e) {
    echo $e->getMessage(); // "Saldo insuficiente"
}
```

## 6.3 Excepciones Personalizadas

```php
<?php
class SaldoInsuficienteException extends \Exception {
    public function __construct(
        public readonly float $saldoDisponible,
        public readonly float $montoSolicitado,
    ) {
        parent::__construct("Saldo insuficiente: disponible $saldoDisponible, solicitado $montoSolicitado");
    }
}

try {
    throw new SaldoInsuficienteException(50.0, 100.0);
} catch (SaldoInsuficienteException $e) {
    echo $e->saldoDisponible; // 50.0 — información estructurada, no solo un mensaje de texto
}
```

Extender `\Exception` (o una subclase más específica) con propiedades propias, en lugar de solo pasar un string de mensaje, permite que el código que captura el error acceda a información estructurada — el mismo principio que las clases `AppError` personalizadas usadas en el backend Node.js de este sitio.

## 6.4 Jerarquía de Excepciones para una API

```php
<?php
abstract class ApiException extends \Exception {
    abstract public function codigoHttp(): int;
}

class NoEncontradoException extends ApiException {
    public function codigoHttp(): int { return 404; }
}

class NoAutorizadoException extends ApiException {
    public function codigoHttp(): int { return 401; }
}

class ValidacionException extends ApiException {
    public function __construct(private array $errores) {
        parent::__construct("Error de validación");
    }

    public function codigoHttp(): int { return 422; }
    public function errores(): array { return $this->errores; }
}
```

Definir una jerarquía de excepciones propia de la aplicación (retomada en el Módulo 14) permite un manejo centralizado: un único punto de captura al final del ciclo de la petición puede convertir cualquier `ApiException` en la respuesta HTTP correcta, sin repetir esa lógica en cada endpoint.

## 6.5 Capturar Múltiples Tipos de Excepción

```php
<?php
try {
    // ...
} catch (NoEncontradoException | NoAutorizadoException $e) {
    echo "Error del cliente: " . $e->getMessage();
} catch (\Throwable $e) { // Captura CUALQUIER error o excepción, incluidos errores internos de PHP
    echo "Error inesperado: " . $e->getMessage();
}
```

`\Throwable` es la interfaz raíz que implementan tanto `\Exception` (errores de la aplicación) como `\Error` (errores internos del motor de PHP, como llamar a un método inexistente) — capturarla es la red de seguridad final, útil en un manejador de errores centralizado, pero **no** debe usarse para lógica de negocio normal.

## 6.6 Errores vs Excepciones en PHP

| Tipo | Ejemplos | ¿Se puede capturar? |
| :--- | :--- | :--- |
| `\Exception` | Errores esperables de la lógica de negocio, lanzados deliberadamente con `throw` | Sí |
| `\Error` | `TypeError`, `DivisionByZeroError`, llamar a un método en `null` | Sí, desde PHP 7 (antes eran fatales e imposibles de capturar) |

Antes de PHP 7, un `\Error` (como llamar a un método en un objeto `null`) terminaba el script inmediatamente sin posibilidad de capturarlo — desde PHP 7, ambos implementan `\Throwable` y pueden capturarse de forma uniforme, aunque siguen siendo conceptualmente distintos (fallos de programación vs condiciones de negocio esperadas).

## 6.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Lanzar un error con datos estructurados | Una clase que extienda `\Exception` con propiedades propias |
| Capturar cualquier error o excepción | `catch (\Throwable $e)` |
| Capturar varios tipos específicos a la vez | `catch (TipoA \| TipoB $e)` |
| Código que se ejecuta siempre, con o sin error | Bloque `finally` |
| Una jerarquía de errores propia de la API | Una clase base abstracta `ApiException` con subclases por caso |

## 6.8 Errores Comunes

- **Capturar `\Exception` de forma genérica en lugar de tipos específicos**: oculta errores inesperados que deberían propagarse o registrarse de forma distinta a los errores de negocio esperados.
- **Lanzar excepciones genéricas de PHP (`\Exception`, `\RuntimeException`) en lugar de crear jerarquías propias**: dificulta manejar cada tipo de error de forma distinta en un punto centralizado.
- **No capturar `\Throwable` en el punto más externo de una API** (Módulo 14): un error interno no capturado en PHP puro puede filtrar detalles de la implementación (rutas de archivos, mensajes de motor) directamente en la respuesta HTTP si no hay un manejador centralizado.
