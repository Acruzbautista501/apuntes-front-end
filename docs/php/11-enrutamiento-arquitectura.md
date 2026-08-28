# Módulo 11: Enrutamiento y Arquitectura en Capas sin Framework

Sin Laravel ni Express, el enrutamiento HTTP debe resolverse explícitamente. Este módulo cubre cómo construirlo desde cero, y por qué en la práctica se combina con una biblioteca ligera de enrutamiento en lugar de reinventar la rueda por completo.

## 11.1 Un Router Manual Mínimo

```php
<?php
// public/index.php
require __DIR__ . '/../vendor/autoload.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$ruta = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($metodo === 'GET' && $ruta === '/usuarios') {
    echo json_encode(['usuarios' => []]);
} elseif ($metodo === 'POST' && $ruta === '/usuarios') {
    // ...
} else {
    http_response_code(404);
    echo json_encode(['error' => 'No encontrado']);
}
```

Este enfoque funciona, pero no escala: cada ruta nueva añade otra rama `if`/`elseif`, sin soporte para parámetros dinámicos (`/usuarios/{id}`) sin lógica manual adicional de extracción con expresiones regulares.

## 11.2 Enrutamiento con `nikic/fast-route`

```bash
composer require nikic/fast-route
```

```php
<?php
// public/index.php
require __DIR__ . '/../vendor/autoload.php';

use FastRoute\RouteCollector;

$dispatcher = FastRoute\simpleDispatcher(function (RouteCollector $r) {
    $r->addRoute('GET', '/usuarios', ['App\Controladores\UsuarioControlador', 'listar']);
    $r->addRoute('GET', '/usuarios/{id:\d+}', ['App\Controladores\UsuarioControlador', 'obtener']);
    $r->addRoute('POST', '/usuarios', ['App\Controladores\UsuarioControlador', 'crear']);
});

$metodo = $_SERVER['REQUEST_METHOD'];
$ruta = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

$info = $dispatcher->dispatch($metodo, $ruta);

switch ($info[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        echo json_encode(['error' => 'Ruta no encontrada']);
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
    case FastRoute\Dispatcher::FOUND:
        [$controlador, $accion] = $info[1];
        $parametros = $info[2]; // ej. ['id' => '42']
        (new $controlador())->$accion($parametros);
        break;
}
```

`fast-route` es deliberadamente una biblioteca de **enrutamiento puro**, sin ORM, sin inyección de dependencias, sin convenciones adicionales — resuelve exactamente el problema de mapear método+ruta a un manejador, dejando toda decisión arquitectónica posterior en manos del proyecto. Es el equivalente en filosofía a usar `express.Router()` sin el resto del ecosistema Express.

## 11.3 Arquitectura en Capas

```text
Petición HTTP
    ↓
Router (Módulo 11)         — mapea método + ruta a un controlador
    ↓
Controlador                — recibe la petición, delega en el servicio, construye la respuesta
    ↓
Servicio                   — contiene la lógica de negocio
    ↓
Repositorio                — acceso a datos (PDO, Módulo 12)
```

```php
<?php
namespace App\Controladores;

use App\Servicios\UsuarioServicio;

class UsuarioControlador
{
    public function __construct(private UsuarioServicio $servicio) {}

    public function obtener(array $parametros): void
    {
        $usuario = $this->servicio->buscarPorId((int) $parametros['id']);

        if ($usuario === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado']);
            return;
        }

        echo json_encode($usuario);
    }
}
```

Esta separación —idéntica en espíritu a la arquitectura rutas→controladores→servicios→repositorios de Express usada en el resto de este sitio— es lo que hace que una API en PHP puro siga siendo mantenible a medida que crece, sin depender de que un framework la imponga.

## 11.4 Un Contenedor de Dependencias Simple

```php
<?php
namespace App\Config;

class Contenedor
{
    private array $instancias = [];

    public function registrar(string $clave, callable $fabrica): void
    {
        $this->instancias[$clave] = $fabrica;
    }

    public function resolver(string $clave): mixed
    {
        return ($this->instancias[$clave])($this);
    }
}
```

```php
<?php
$contenedor = new Contenedor();
$contenedor->registrar(UsuarioRepositorio::class, fn() => new UsuarioRepositorioPdo($pdo));
$contenedor->registrar(UsuarioServicio::class, fn($c) => new UsuarioServicio($c->resolver(UsuarioRepositorio::class)));
```

Sin un framework que provea inyección de dependencias automática, un contenedor propio (aunque sea mínimo, como este) evita instanciar manualmente toda la cadena de dependencias en cada controlador — puede sustituirse por una biblioteca dedicada como `php-di/php-di` a medida que el proyecto crece.

## 11.5 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Mapear rutas a manejadores sin reinventar la rueda | `nikic/fast-route` |
| Extraer parámetros dinámicos de la URL | Patrones como `{id:\d+}` en la definición de la ruta |
| Separar HTTP de la lógica de negocio | Arquitectura controlador → servicio → repositorio |
| Resolver dependencias sin instanciarlas manualmente en cada punto | Un contenedor de dependencias, propio o `php-di/php-di` |

## 11.6 Errores Comunes

- **Poner lógica de negocio directamente en el router o el controlador**: dificulta testear esa lógica de forma aislada (retomado en el Módulo 20) y la acopla innecesariamente al ciclo HTTP.
- **Reinventar un router completo desde cero en un proyecto real**: manejar correctamente parámetros dinámicos, prioridad de rutas y rendimiento es un problema ya resuelto por bibliotecas maduras como `fast-route`.
- **Instanciar todas las dependencias manualmente en cada controlador**: se vuelve inmanejable rápidamente — un contenedor de dependencias, aunque sea simple, centraliza esa responsabilidad.
