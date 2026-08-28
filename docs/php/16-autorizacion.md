# Módulo 16: Autorización y Control de Acceso

Autenticación responde "¿quién eres?"; autorización responde "¿qué tienes permitido hacer?". Este módulo cubre cómo implementar control de acceso en PHP puro, incluyendo el error de seguridad más común en APIs reales: la autorización a nivel de objeto.

## 16.1 Autorización Basada en Roles

```php
<?php
enum Rol: string
{
    case Admin = 'admin';
    case Usuario = 'usuario';
}
```

```php
<?php
namespace App\Middlewares;

class RequerirRolMiddleware
{
    public function manejar(object $payload, Rol $rolRequerido): void
    {
        if ($payload->rol !== $rolRequerido->value) {
            Response::error('No tienes permiso para esta acción', 403);
            exit;
        }
    }
}
```

```php
<?php
// Dentro de un controlador de administración
(new RequerirRolMiddleware())->manejar($payload, Rol::Admin);
```

## 16.2 El Error Más Común: Autorización a Nivel de Objeto

```php
<?php
// ❌ Vulnerable: cualquier usuario autenticado puede ver/modificar el pedido de OTRO usuario
public function obtenerPedido(array $parametros): void
{
    $pedido = $this->servicio->buscarPorId((int) $parametros['id']);
    Response::json($pedido);
}
```

```php
<?php
// ✅ Correcto: verifica explícitamente que el recurso pertenece al usuario autenticado
public function obtenerPedido(array $parametros, int $usuarioIdAutenticado): void
{
    $pedido = $this->servicio->buscarPorId((int) $parametros['id']);

    if ($pedido === null || $pedido['usuario_id'] !== $usuarioIdAutenticado) {
        Response::error('Pedido no encontrado', 404); // 404, no 403 — no revelar que el recurso existe
        return;
    }

    Response::json($pedido);
}
```

Este patrón —conocido como *Broken Object Level Authorization* (BOLA)— es consistentemente el riesgo número uno en el OWASP API Security Top 10, y ocurre exactamente igual en PHP que en cualquier otro backend: **autenticar** a un usuario nunca es suficiente por sí solo, cada acceso a un recurso específico debe verificar explícitamente que ese usuario tiene permiso sobre ese recurso en particular, no solo que está autenticado.

## 16.3 Una Capa de Autorización Reutilizable

```php
<?php
namespace App\Autorizacion;

class PoliticaPedido
{
    public static function puedeVer(array $pedido, int $usuarioId): bool
    {
        return $pedido['usuario_id'] === $usuarioId;
    }

    public static function puedeEliminar(array $pedido, int $usuarioId, string $rol): bool
    {
        return $pedido['usuario_id'] === $usuarioId || $rol === 'admin';
    }
}
```

```php
<?php
if (!PoliticaPedido::puedeVer($pedido, $usuarioIdAutenticado)) {
    Response::error('Pedido no encontrado', 404);
    return;
}
```

Centralizar las reglas de "quién puede hacer qué sobre qué recurso" en clases de política dedicadas (en lugar de repetir condicionales `if` en cada controlador) hace que esas reglas sean auditables y testeables de forma aislada (Módulo 20) — el mismo principio detrás de las *Policies* de frameworks como Laravel, aplicado sin depender de uno.

## 16.4 Autorización a Nivel de Función/Endpoint

```php
<?php
// Un usuario normal nunca debería poder LLEGAR a este endpoint, independientemente
// de si conoce la URL — verificar el rol antes de ejecutar la acción, no después
public function eliminarUsuario(array $parametros, object $payload): void
{
    if ($payload->rol !== 'admin') {
        Response::error('No autorizado', 403);
        return;
    }

    $this->servicio->eliminar((int) $parametros['id']);
    http_response_code(204);
}
```

## 16.5 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Restringir un endpoint completo por rol | Verificar el rol del payload del JWT antes de ejecutar la acción |
| Verificar que un recurso pertenece al usuario autenticado | Comparar el campo de propiedad (`usuario_id`) contra el ID autenticado, en cada acceso |
| Ocultar la existencia de un recurso ajeno | Responder `404`, no `403`, cuando el recurso existe pero no pertenece al usuario |
| Centralizar reglas de autorización reutilizables | Clases de "política" dedicadas por tipo de recurso |

## 16.6 Errores Comunes

- **Verificar solo autenticación (`¿tiene un token válido?`) y asumir que eso implica autorización**: es la causa raíz de BOLA — un token válido prueba identidad, no permiso sobre un recurso específico.
- **Responder `403 Forbidden` en lugar de `404 Not Found`** cuando un recurso existe pero pertenece a otro usuario: revela innecesariamente la existencia del recurso a quien no debería poder verlo.
- **Duplicar la misma comprobación de propiedad en cada controlador sin centralizarla**: aumenta el riesgo de que un endpoint nuevo olvide la verificación por completo.
