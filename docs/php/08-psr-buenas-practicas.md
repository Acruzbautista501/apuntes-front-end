# Módulo 8: Estándares PSR y Buenas Prácticas

Sin un framework que imponga una estructura, los estándares **PSR** (*PHP Standard Recommendations*, publicados por PHP-FIG) son lo que mantiene el código PHP interoperable y consistente entre proyectos y bibliotecas distintas. Este módulo cubre los PSR más relevantes para construir una API sin depender de un framework completo.

## 8.1 ¿Qué es PSR y por qué importa sin un Framework?

Cuando se usa un framework como base, muchas decisiones de estilo y arquitectura vienen impuestas por él. Al construir en PHP puro, esa responsabilidad recae en el propio equipo — los estándares PSR son el sustituto: convenciones ampliamente adoptadas que garantizan que el código propio, las bibliotecas de terceros (instaladas vía Composer, Módulo 7) y las herramientas de desarrollo puedan interoperar sin fricción.

## 8.2 PSR-1 y PSR-12: Estilo de Código

```php
<?php

declare(strict_types=1);

namespace App\Servicios;

class UsuarioServicio
{
    public function __construct(
        private readonly UsuarioRepositorio $repositorio,
    ) {
    }

    public function buscarPorId(int $id): ?array
    {
        return $this->repositorio->buscarPorId($id);
    }
}
```

PSR-12 estandariza detalles como: llaves de apertura de clase/método en su propia línea, 4 espacios de indentación (nunca tabs), un archivo por clase, y `namespace`/`use` antes de cualquier código. Herramientas como `php-cs-fixer` o `phpcs` verifican y corrigen esto automáticamente — el equivalente PHP a Prettier/ESLint en el ecosistema JavaScript.

## 8.3 PSR-4: Autoloading (Anticipo del Módulo 9)

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

PSR-4 define la convención que mapea un namespace a una ruta de carpetas — `App\Servicios\UsuarioServicio` vive en `src/Servicios/UsuarioServicio.php`. Es la base que hace posible el autoloading automático de Composer, cubierto a fondo en el siguiente módulo.

## 8.4 PSR-3: Interfaz de Logging

```php
<?php
use Psr\Log\LoggerInterface;

class UsuarioServicio
{
    public function __construct(
        private readonly LoggerInterface $logger, // Depende de la INTERFAZ, no de una implementación concreta
    ) {
    }

    public function crear(array $datos): void
    {
        $this->logger->info('Usuario creado', ['email' => $datos['email']]);
    }
}
```

Programar contra `Psr\Log\LoggerInterface` (en lugar de una biblioteca de logging concreta como Monolog directamente) permite cambiar la implementación de logging sin tocar el código que la usa — el mismo principio de inversión de dependencias que las interfaces `RepositorioUsuarios` mencionadas en el Módulo 5.

## 8.5 PSR-7: Mensajes HTTP

PSR-7 estandariza cómo se representan las peticiones y respuestas HTTP como objetos inmutables (`ServerRequestInterface`, `ResponseInterface`), en lugar de usar las superglobales de PHP (`$_GET`, `$_POST`) directamente. Es la base de interoperabilidad entre bibliotecas de enrutamiento, middleware (Módulo 18) y clientes HTTP de distintos autores.

```php
<?php
use Psr\Http\Message\ResponseInterface;
use Nyholm\Psr7\Response;

function manejarPeticion(): ResponseInterface
{
    return new Response(
        status: 200,
        headers: ['Content-Type' => 'application/json'],
        body: json_encode(['mensaje' => 'ok']),
    );
}
```

## 8.6 PSR-15: Middleware HTTP

PSR-15 estandariza el contrato de un middleware HTTP (`MiddlewareInterface`) y de un manejador de peticiones (`RequestHandlerInterface`) — se retoma en profundidad en el Módulo 18, ya con una API funcionando sobre la que aplicar autenticación, logging y manejo de errores como capas independientes.

## 8.7 Buenas Prácticas Generales sin Framework

- **Separar responsabilidades en capas** (controladores → servicios → repositorios), igual que en la arquitectura Express de este sitio — un framework no es requisito para tener una arquitectura disciplinada.
- **Nunca confiar en datos externos sin validar** (`$_GET`, `$_POST`, cuerpos JSON) — se retoma en el Módulo 14.
- **Centralizar la configuración** (variables de entorno, credenciales) en un único punto, nunca hardcodeada en el código de negocio.
- **Un archivo, una clase**, con el nombre de archivo coincidiendo exactamente con el nombre de la clase (requisito de PSR-4).

## 8.8 Tabla de Referencia Rápida

| PSR | Cubre | Relevancia práctica |
| :--- | :--- | :--- |
| PSR-1 / PSR-12 | Estilo de código | Consistencia visual entre proyectos y desarrolladores |
| PSR-4 | Autoloading | Mapeo automático de namespace a ruta de archivo (Módulo 9) |
| PSR-3 | Logging | Interfaz común para cualquier biblioteca de logs |
| PSR-7 | Mensajes HTTP | Representación estándar de petición/respuesta (Módulo 11) |
| PSR-15 | Middleware | Contrato estándar para capas de procesamiento HTTP (Módulo 18) |

## 8.9 Errores Comunes

- **Ignorar PSR-12 "porque no hay framework que lo obligue"**: sin un framework, la consistencia de estilo depende enteramente de la disciplina del equipo — herramientas como `php-cs-fixer` deben configurarse desde el inicio del proyecto.
- **Depender de implementaciones concretas de terceros en lugar de sus interfaces PSR**: acopla el código propio a una biblioteca específica, dificultando cambiarla más adelante.
- **Confundir PSR-7 (mensajes HTTP) con PSR-15 (middleware)**: son estándares complementarios pero distintos — PSR-7 define la forma de los datos, PSR-15 el contrato de cómo se procesan en capas.
