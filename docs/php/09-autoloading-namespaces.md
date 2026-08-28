# Módulo 9: Autoloading, Namespaces y Estructura de Proyectos

Este módulo cubre cómo organizar un proyecto PHP sin framework de forma escalable: namespaces, autoloading automático vía Composer, y una estructura de carpetas que resista el crecimiento del proyecto.

## 9.1 Namespaces

```php
<?php
// src/Servicios/UsuarioServicio.php
namespace App\Servicios;

class UsuarioServicio
{
    // ...
}
```

```php
<?php
// src/Controladores/UsuarioControlador.php
namespace App\Controladores;

use App\Servicios\UsuarioServicio; // Importa la clase de otro namespace

class UsuarioControlador
{
    public function __construct(private UsuarioServicio $servicio) {}
}
```

Los namespaces evitan colisiones de nombres entre clases propias y de dependencias de terceros — el equivalente conceptual a los módulos de JavaScript/TypeScript, aunque con una sintaxis y un mecanismo de resolución distintos.

## 9.2 Autoloading PSR-4 en Detalle

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

```bash
composer dump-autoload # Regenera el mapa de autoloading tras cambios en composer.json
```

Con esta configuración, el namespace `App\Servicios\UsuarioServicio` se resuelve automáticamente al archivo `src/Servicios/UsuarioServicio.php` — **sin ningún** `require` manual, siempre que el nombre del archivo coincida exactamente con el nombre de la clase y la ruta de carpetas refleje el namespace.

## 9.3 Estructura de Carpetas para una API sin Framework

```text
api-ejemplo/
├── public/
│   └── index.php          # Único punto de entrada HTTP (Módulo 11)
├── src/
│   ├── Controladores/
│   ├── Servicios/
│   ├── Repositorios/
│   ├── Modelos/
│   ├── Middlewares/
│   ├── Excepciones/
│   └── Config/
├── tests/
├── vendor/                 # Generado por Composer, nunca en control de versiones
├── .env
├── composer.json
└── composer.lock
```

Esta estructura replica, en PHP puro, el mismo principio de capas usado en la arquitectura Express de este sitio (rutas → controladores → servicios → repositorios) — la separación de responsabilidades no depende de un framework, depende de la disciplina de organización del proyecto.

## 9.4 Por Qué `public/index.php` como Único Punto de Entrada

```php
<?php
// public/index.php
require __DIR__ . '/../vendor/autoload.php';

// Aquí se inicializa el enrutamiento (Módulo 11)
```

Configurar el servidor web (Apache/Nginx, o `php -S`) para servir **únicamente** la carpeta `public/` como raíz asegura que ningún archivo de `src/` (lógica de negocio, credenciales de configuración) sea accesible directamente por URL — solo `index.php` recibe peticiones, y él decide internamente qué código ejecutar.

```bash
php -S localhost:8000 -t public # "-t public" fija la raíz servida
```

## 9.5 Namespaces con Múltiples Niveles

```php
<?php
namespace App\Repositorios\Contratos;

interface UsuarioRepositorioInterface
{
    public function buscarPorId(int $id): ?array;
}
```

```php
<?php
namespace App\Repositorios;

use App\Repositorios\Contratos\UsuarioRepositorioInterface;

class UsuarioRepositorioPdo implements UsuarioRepositorioInterface
{
    // Implementación concreta con PDO (Módulo 12)
}
```

## 9.6 Autoloading de Archivos sin Clases

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        },
        "files": [
            "src/helpers.php"
        ]
    }
}
```

La clave `"files"` carga archivos que no siguen la convención de una-clase-por-archivo — útil para funciones auxiliares globales, aunque debe usarse con moderación: la mayoría del código debería organizarse en clases con namespace.

## 9.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Evitar colisiones de nombres entre clases | `namespace App\Modulo;` |
| Cargar una clase de otro namespace | `use App\Otro\Clase;` |
| Regenerar el mapa de autoloading | `composer dump-autoload` |
| Un único punto de entrada seguro para la API | `public/index.php`, sirviendo solo esa carpeta |
| Cargar funciones globales sin clase | La clave `"files"` en `composer.json` |

## 9.8 Errores Comunes

- **Servir la raíz del proyecto en lugar de `public/`**: expone `composer.json`, `.env`, y el código fuente de `src/` directamente por URL si el servidor web no está configurado correctamente.
- **Nombre de archivo o ruta de carpeta que no coincide con el namespace declarado**: rompe el autoloading PSR-4, produciendo errores de "clase no encontrada" difíciles de diagnosticar a simple vista.
- **Olvidar `composer dump-autoload` tras reorganizar carpetas**: el mapa de autoloading queda desactualizado hasta regenerarse explícitamente.
