# Módulo 10: Superglobales, HTTP y el Ciclo de Petición-Respuesta

Antes de construir una API sin framework, es necesario entender exactamente qué le da PHP de forma nativa por cada petición HTTP — sin capas de abstracción de por medio. Este módulo cubre las superglobales y el ciclo completo petición-respuesta.

## 10.1 El Ciclo de una Petición en PHP Puro

```text
Cliente HTTP → Servidor web → PHP recibe la petición → Puebla superglobales →
Ejecuta el script → PHP genera cabeceras y cuerpo → Respuesta → Cliente
```

A diferencia de Express, donde `req`/`res` son objetos construidos explícitamente por el framework, en PHP puro la información de la petición llega repartida en varias variables globales predefinidas — las **superglobales**.

## 10.2 `$_GET`, `$_POST` y `$_SERVER`

```php
<?php
// GET /buscar?q=teclado
$termino = $_GET['q'] ?? ''; // "teclado"

// POST con application/x-www-form-urlencoded
$nombre = $_POST['nombre'] ?? '';

// Metadatos de la petición
$metodo = $_SERVER['REQUEST_METHOD'];    // "GET", "POST", etc.
$ruta = $_SERVER['REQUEST_URI'];          // "/buscar?q=teclado"
```

## 10.3 Leer el Cuerpo de una Petición JSON

```php
<?php
$cuerpoRaw = file_get_contents('php://input'); // El cuerpo crudo de la petición
$datos = json_decode($cuerpoRaw, associative: true);

echo $datos['nombre'] ?? null;
```

`$_POST` **solo** se puebla automáticamente para formularios (`application/x-www-form-urlencoded` o `multipart/form-data`) — una API que recibe JSON (el caso normal en un backend moderno) debe leer y decodificar el cuerpo manualmente desde `php://input`, algo que un framework normalmente abstrae.

## 10.4 Cabeceras de Petición

```php
<?php
$cabeceras = getallheaders(); // Array asociativo con todas las cabeceras recibidas
$auth = $cabeceras['Authorization'] ?? null;

// Alternativa vía $_SERVER (siempre disponible, incluso sin la extensión de getallheaders)
$auth = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
```

## 10.5 Construir la Respuesta: Código de Estado y Cabeceras

```php
<?php
http_response_code(201); // Debe llamarse ANTES de cualquier salida (echo)
header('Content-Type: application/json');

echo json_encode(['id' => 1, 'nombre' => 'Producto nuevo']);
```

El orden importa: una vez que PHP envía cualquier salida (incluido un espacio en blanco accidental antes de `<?php`), las cabeceras HTTP ya no pueden modificarse — un error clásico ("*headers already sent*") que motiva la recomendación del Módulo 1 de omitir la etiqueta de cierre `?>` en archivos PHP puros.

## 10.6 `$_ENV` y Variables de Entorno

```php
<?php
// Requiere vlucas/phpdotenv (Módulo 7) para cargar un archivo .env en desarrollo
$dbHost = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?? 'localhost';
```

```php
<?php
// bootstrap.php
require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
```

## 10.7 Sesiones (Anticipo)

```php
<?php
session_start(); // Debe llamarse antes de cualquier salida, igual que las cabeceras

$_SESSION['usuario_id'] = 42;
echo $_SESSION['usuario_id'] ?? null;
```

En una API sin estado basada en JWT (Módulo 15), las sesiones tradicionales se usan poco — se mencionan aquí como parte completa del modelo HTTP de PHP, y se retoman con más detalle en el Módulo 19 (seguridad).

## 10.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Parámetros de query string | `$_GET['clave']` |
| Datos de un formulario tradicional | `$_POST['clave']` |
| El cuerpo crudo de una petición JSON | `file_get_contents('php://input')` |
| Cabeceras de la petición | `getallheaders()` o `$_SERVER['HTTP_*']` |
| Establecer el código de estado HTTP | `http_response_code(200)` |
| Establecer una cabecera de respuesta | `header('Clave: valor')` |

## 10.9 Errores Comunes

- **Confiar en `$_POST` para APIs JSON**: solo se puebla con formularios tradicionales — un cuerpo JSON debe leerse manualmente desde `php://input`.
- **Llamar a `header()` o `http_response_code()` después de haber enviado salida**: produce el error "*headers already sent*", normalmente causado por espacios en blanco antes de `<?php` o después de `?>`.
- **No validar ni sanear ningún dato de `$_GET`/`$_POST`/el cuerpo JSON antes de usarlo**: toda entrada externa debe tratarse como no confiable — se retoma en profundidad en el Módulo 14 (validación) y el Módulo 19 (seguridad).
