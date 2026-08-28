# Módulo 13: Construir una API REST Completa con PHP Puro

Con enrutamiento (Módulo 11), arquitectura en capas y acceso a datos (Módulo 12) ya cubiertos, este módulo integra todo en una API REST completa y funcional, siguiendo convenciones REST estándar.

## 13.1 Estructura del Proyecto

```text
api-productos/
├── public/
│   └── index.php
├── src/
│   ├── Controladores/
│   │   └── ProductoControlador.php
│   ├── Servicios/
│   │   └── ProductoServicio.php
│   ├── Repositorios/
│   │   └── ProductoRepositorioPdo.php
│   ├── Config/
│   │   └── Database.php
│   └── Http/
│       └── Response.php
├── .env
└── composer.json
```

## 13.2 Un Helper de Respuesta JSON

```php
<?php
namespace App\Http;

class Response
{
    public static function json(mixed $datos, int $codigo = 200): void
    {
        http_response_code($codigo);
        header('Content-Type: application/json');
        echo json_encode($datos);
    }

    public static function error(string $mensaje, int $codigo): void
    {
        self::json(['error' => $mensaje], $codigo);
    }
}
```

Centralizar la construcción de respuestas evita repetir `http_response_code()` + `header()` + `json_encode()` en cada controlador — una abstracción mínima pero que ya empieza a acercarse a lo que un objeto `Response` de un framework provee de fábrica.

## 13.3 Rutas REST Convencionales

```php
<?php
$dispatcher = FastRoute\simpleDispatcher(function (RouteCollector $r) {
    $r->addGroup('/productos', function (RouteCollector $r) {
        $r->addRoute('GET', '', ['App\Controladores\ProductoControlador', 'listar']);
        $r->addRoute('GET', '/{id:\d+}', ['App\Controladores\ProductoControlador', 'obtener']);
        $r->addRoute('POST', '', ['App\Controladores\ProductoControlador', 'crear']);
        $r->addRoute('PUT', '/{id:\d+}', ['App\Controladores\ProductoControlador', 'actualizar']);
        $r->addRoute('DELETE', '/{id:\d+}', ['App\Controladores\ProductoControlador', 'eliminar']);
    });
});
```

| Método | Ruta | Acción |
| :--- | :--- | :--- |
| `GET` | `/productos` | Listar todos |
| `GET` | `/productos/{id}` | Obtener uno |
| `POST` | `/productos` | Crear |
| `PUT` | `/productos/{id}` | Actualizar completo |
| `DELETE` | `/productos/{id}` | Eliminar |

## 13.4 El Controlador Completo

```php
<?php
namespace App\Controladores;

use App\Servicios\ProductoServicio;
use App\Http\Response;

class ProductoControlador
{
    public function __construct(private ProductoServicio $servicio) {}

    public function listar(array $parametros): void
    {
        Response::json($this->servicio->listarTodos());
    }

    public function obtener(array $parametros): void
    {
        $producto = $this->servicio->buscarPorId((int) $parametros['id']);

        if ($producto === null) {
            Response::error('Producto no encontrado', 404);
            return;
        }

        Response::json($producto);
    }

    public function crear(array $parametros): void
    {
        $datos = json_decode(file_get_contents('php://input'), associative: true);
        $producto = $this->servicio->crear($datos);
        Response::json($producto, 201);
    }

    public function actualizar(array $parametros): void
    {
        $datos = json_decode(file_get_contents('php://input'), associative: true);
        $producto = $this->servicio->actualizar((int) $parametros['id'], $datos);
        Response::json($producto);
    }

    public function eliminar(array $parametros): void
    {
        $this->servicio->eliminar((int) $parametros['id']);
        http_response_code(204); // Sin contenido en la respuesta
    }
}
```

## 13.5 El Servicio

```php
<?php
namespace App\Servicios;

use App\Repositorios\ProductoRepositorioPdo;

class ProductoServicio
{
    public function __construct(private ProductoRepositorioPdo $repositorio) {}

    public function listarTodos(): array
    {
        return $this->repositorio->listarTodos();
    }

    public function buscarPorId(int $id): ?array
    {
        return $this->repositorio->buscarPorId($id);
    }

    public function crear(array $datos): array
    {
        return $this->repositorio->crear($datos['nombre'], (float) $datos['precio']);
    }
}
```

La lógica de negocio (qué reglas aplican al crear o actualizar un producto) vive aquí, no en el controlador ni en el repositorio — el mismo principio de la capa de servicios en la arquitectura Express de este sitio.

## 13.6 Códigos de Estado HTTP Correctos

| Código | Cuándo usarlo |
| :--- | :--- |
| `200 OK` | Lectura o actualización exitosa |
| `201 Created` | Creación exitosa (incluir el recurso creado en el cuerpo) |
| `204 No Content` | Eliminación exitosa, sin cuerpo de respuesta |
| `400 Bad Request` | El cliente envió datos malformados |
| `404 Not Found` | El recurso solicitado no existe |
| `422 Unprocessable Entity` | Los datos tienen formato válido pero fallan reglas de validación (Módulo 14) |

## 13.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Centralizar la construcción de respuestas JSON | Una clase `Response` con métodos estáticos |
| Agrupar rutas relacionadas bajo un prefijo | `$r->addGroup('/prefijo', function ($r) { ... })` |
| Devolver el recurso recién creado | `Response::json($recurso, 201)` |
| Confirmar una eliminación sin cuerpo | `http_response_code(204)` |

## 13.8 Errores Comunes

- **Devolver `200 OK` para todo, incluidos errores**: dificulta que los clientes de la API distingan éxito de fallo sin inspeccionar el cuerpo de la respuesta.
- **No establecer `Content-Type: application/json`**: algunos clientes HTTP no interpretan el cuerpo correctamente sin esa cabecera explícita.
- **Construir el JSON de respuesta manualmente con concatenación de strings en lugar de `json_encode()`**: propenso a errores de escape y sintaxis inválida — `json_encode()` siempre debe usarse para serializar datos a JSON.
