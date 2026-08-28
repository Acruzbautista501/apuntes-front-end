# Módulo 20: Testing con PHPUnit

PHPUnit es el framework de testing estándar de facto en PHP — el equivalente a Vitest/Jest en el ecosistema Node.js de este sitio. Este módulo cubre tests unitarios y de integración para una API en PHP puro.

## 20.1 Instalación

```bash
composer require --dev phpunit/phpunit
```

```xml
<!-- phpunit.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="vendor/autoload.php">
    <testsuites>
        <testsuite name="Tests">
            <directory>tests</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

## 20.2 Un Test Unitario Básico

```php
<?php
namespace Tests\Servicios;

use PHPUnit\Framework\TestCase;
use App\Servicios\ProductoServicio;
use App\Excepciones\ValidacionException;

class ProductoServicioTest extends TestCase
{
    public function testCrearProductoConDatosValidos(): void
    {
        $repositorioSimulado = $this->createMock(ProductoRepositorioPdo::class);
        $repositorioSimulado->method('crear')->willReturn(['id' => 1, 'nombre' => 'Teclado', 'precio' => 89.99]);

        $servicio = new ProductoServicio($repositorioSimulado);
        $resultado = $servicio->crear(['nombre' => 'Teclado', 'precio' => 89.99]);

        $this->assertSame('Teclado', $resultado['nombre']);
    }

    public function testCrearProductoConPrecioInvalidoLanzaExcepcion(): void
    {
        $servicio = new ProductoServicio($this->createMock(ProductoRepositorioPdo::class));

        $this->expectException(ValidacionException::class);
        $servicio->crear(['nombre' => 'Teclado', 'precio' => -10]);
    }
}
```

`createMock()` genera automáticamente una implementación simulada de una clase o interfaz — el equivalente a `vi.fn()`/`jest.mock()` en el ecosistema de testing de Node.js, permitiendo testear la lógica del servicio de forma aislada, sin tocar una base de datos real.

## 20.3 Simular Dependencias con Interfaces

```php
<?php
interface ProductoRepositorioInterface
{
    public function buscarPorId(int $id): ?array;
    public function crear(string $nombre, float $precio): array;
}
```

```php
<?php
$repositorioSimulado = $this->createMock(ProductoRepositorioInterface::class);
$repositorioSimulado->expects($this->once())
    ->method('buscarPorId')
    ->with(42)
    ->willReturn(['id' => 42, 'nombre' => 'Mouse']);
```

Depender de una **interfaz** (Módulo 5) en lugar de la clase PDO concreta en el servicio es lo que hace posible sustituirla completamente por un doble de test — sin esa abstracción, cada test necesitaría una base de datos real.

## 20.4 Tests de Integración con una Base de Datos de Prueba

```php
<?php
namespace Tests\Integracion;

use PHPUnit\Framework\TestCase;

class ProductoRepositorioPdoTest extends TestCase
{
    private \PDO $pdo;

    protected function setUp(): void
    {
        $this->pdo = new \PDO('sqlite::memory:'); // Base de datos SQLite en memoria, aislada por test
        $this->pdo->exec('CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT, precio REAL)');
    }

    public function testCrearYBuscarProducto(): void
    {
        $repositorio = new ProductoRepositorioPdo($this->pdo);

        $creado = $repositorio->crear('Teclado', 89.99);
        $encontrado = $repositorio->buscarPorId($creado['id']);

        $this->assertSame('Teclado', $encontrado['nombre']);
    }
}
```

SQLite en memoria (`sqlite::memory:`) cumple, para PHP, el mismo rol que `mongodb-memory-server` cumple en los tests de integración del backend Node.js de este sitio: una base de datos real, aislada y descartable por cada test, sin necesidad de un servidor de base de datos externo durante la ejecución de tests.

## 20.5 Tests de Endpoints HTTP

```php
<?php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;

class ProductoEndpointTest extends TestCase
{
    public function testObtenerProductoInexistenteDevuelve404(): void
    {
        $respuesta = $this->hacerPeticion('GET', '/productos/9999');

        $this->assertSame(404, $respuesta['codigo']);
    }
}
```

A diferencia de Supertest en Node.js (que puede levantar la app Express directamente en memoria), probar endpoints HTTP completos en PHP puro normalmente requiere un enfoque distinto: ejecutar el servidor de desarrollo (`php -S`) en un proceso separado durante los tests y hacer peticiones HTTP reales contra él con un cliente como Guzzle, o extraer la lógica de despacho a una función testeable directamente sin pasar por las superglobales.

## 20.6 Cobertura de Código

```bash
phpunit --coverage-html coverage/ # Requiere la extensión Xdebug o PCOV instalada
```

## 20.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ejecutar todos los tests | `phpunit` |
| Simular una dependencia | `$this->createMock(Interfaz::class)` |
| Verificar que se lanzó una excepción | `$this->expectException(Tipo::class)` |
| Una base de datos real aislada por test | `new PDO('sqlite::memory:')` |
| Medir cobertura de código | `phpunit --coverage-html coverage/` |

## 20.8 Errores Comunes

- **Testear servicios contra una clase PDO concreta en lugar de una interfaz simulada**: acopla los tests a una base de datos real, haciéndolos lentos y frágiles innecesariamente para lógica que no depende directamente de SQL.
- **No aislar el estado entre tests** (reutilizar la misma base de datos SQLite en memoria entre distintos métodos de test sin recrearla en `setUp()`): produce tests que pasan o fallan según el orden de ejecución.
- **Escribir solo tests de "camino feliz"**: los casos de validación fallida, autorización denegada y recursos no encontrados son tan importantes de cubrir como el caso exitoso.
