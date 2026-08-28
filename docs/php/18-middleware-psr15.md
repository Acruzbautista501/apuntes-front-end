# Módulo 18: Middleware y el Patrón PSR-15

Con la API funcionando, este módulo introduce middleware real siguiendo PSR-15 (mencionado en el Módulo 8) — capas independientes de procesamiento HTTP que se ejecutan antes o alrededor del controlador, sin acoplarse a él.

## 18.1 El Problema sin Middleware

Hasta ahora, la autenticación (Módulo 15) se invocaba manualmente al inicio de cada controlador que la necesitaba — funciona, pero se repite y es fácil de olvidar en un endpoint nuevo. Middleware resuelve esto como una capa que se aplica automáticamente a un grupo de rutas.

## 18.2 El Contrato PSR-15

```php
<?php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AutenticarMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler,
    ): ResponseInterface {
        $auth = $request->getHeaderLine('Authorization');

        if (!str_starts_with($auth, 'Bearer ')) {
            return new Response(401, [], json_encode(['error' => 'Token no proporcionado']));
        }

        $payload = verificarToken(substr($auth, 7));

        if ($payload === null) {
            return new Response(401, [], json_encode(['error' => 'Token inválido']));
        }

        $request = $request->withAttribute('usuario', $payload); // Añade datos a la petición para el siguiente paso
        return $handler->handle($request); // Delega al siguiente middleware o al controlador final
    }
}
```

Cada middleware recibe la petición y un `$handler` que representa "el resto de la cadena" — decide si continuar (`$handler->handle($request)`), posiblemente modificando la petición antes, o cortocircuitar devolviendo una respuesta propia (como el `401` cuando falla la autenticación).

## 18.3 Encadenar Middleware Manualmente

```php
<?php
class Pipeline
{
    private array $middlewares = [];

    public function agregar(MiddlewareInterface $middleware): static
    {
        $this->middlewares[] = $middleware;
        return $this;
    }

    public function manejar(ServerRequestInterface $request, callable $destinoFinal): ResponseInterface
    {
        $manejador = array_reduce(
            array_reverse($this->middlewares),
            fn($siguiente, $middleware) => new class($middleware, $siguiente) implements RequestHandlerInterface {
                public function __construct(private $middleware, private $siguiente) {}
                public function handle(ServerRequestInterface $request): ResponseInterface
                {
                    return $this->middleware->process($request, $this->siguiente);
                }
            },
            new class($destinoFinal) implements RequestHandlerInterface {
                public function __construct(private $destinoFinal) {}
                public function handle(ServerRequestInterface $request): ResponseInterface
                {
                    return ($this->destinoFinal)($request);
                }
            }
        );

        return $manejador->handle($request);
    }
}
```

Construir un pipeline propio como este es instructivo para entender el patrón, pero en un proyecto real se recomienda una implementación ya probada como `relay/relay` o `middlewares/utils`, que resuelven correctamente casos borde (excepciones dentro de la cadena, orden de ejecución) sin reinventarlos.

## 18.4 Middleware Comunes en una API

```php
<?php
class LoggingMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $inicio = microtime(true);
        $respuesta = $handler->handle($request);
        $duracion = round((microtime(true) - $inicio) * 1000);

        error_log(sprintf('%s %s - %dms', $request->getMethod(), $request->getUri()->getPath(), $duracion));

        return $respuesta;
    }
}
```

```php
<?php
class CorsMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $respuesta = $handler->handle($request);
        return $respuesta->withHeader('Access-Control-Allow-Origin', $_ENV['ORIGEN_PERMITIDO']);
    }
}
```

## 18.5 Aplicar Middleware Solo a Ciertas Rutas

```php
<?php
$pipelinePublico = (new Pipeline())->agregar(new LoggingMiddleware())->agregar(new CorsMiddleware());

$pipelineProtegido = (clone $pipelinePublico)->agregar(new AutenticarMiddleware());
```

Igual que en Express (`router.use(middleware)` a nivel de un `Router` específico), no todo middleware debe aplicarse globalmente — rutas públicas (login, registro) y protegidas normalmente requieren pipelines distintos.

## 18.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| El contrato estándar de un middleware HTTP | `Psr\Http\Server\MiddlewareInterface` |
| Pasar datos de un middleware al controlador | `$request->withAttribute('clave', $valor)` |
| Cortocircuitar la cadena sin llegar al controlador | Devolver una `ResponseInterface` propia sin llamar a `$handler->handle()` |
| Encadenar middleware de forma robusta | Una biblioteca dedicada como `relay/relay`, en lugar de un pipeline propio en producción |

## 18.7 Errores Comunes

- **Olvidar llamar a `$handler->handle($request)`**: si un middleware no delega explícitamente, la cadena se detiene ahí sin ejecutar el controlador ni el resto de middleware, normalmente de forma no intencional.
- **Modificar la petición mutándola en lugar de usar `withAttribute()`/`withHeader()`**: los objetos PSR-7 son inmutables por diseño — cada método `with*()` devuelve una **nueva** instancia, la original nunca cambia.
- **Aplicar middleware de autenticación globalmente a toda la aplicación, incluidas rutas públicas**: bloquea accidentalmente endpoints que deberían ser accesibles sin token, como login o registro.
