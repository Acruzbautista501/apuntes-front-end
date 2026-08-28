# Módulo 15: Autenticación con JWT en PHP Puro

Sin Sanctum ni Passport (herramientas exclusivas de Laravel), la autenticación por JWT en PHP puro se construye directamente sobre una biblioteca de firmado de tokens. Este módulo replica, en PHP, el mismo patrón de access + refresh tokens ya cubierto en el curso de Node.js de este sitio.

## 15.1 Instalación

```bash
composer require firebase/php-jwt
```

## 15.2 Hashear Contraseñas

```php
<?php
$hash = password_hash($contraseñaPlano, PASSWORD_BCRYPT); // Nunca almacenar contraseñas en texto plano

$esValida = password_verify($contraseñaIngresada, $hash);
```

`password_hash()`/`password_verify()` son funciones **nativas** de PHP (sin dependencias externas) que usan bcrypt internamente — el equivalente directo a la biblioteca `bcrypt` de Node.js, ya incorporado en el lenguaje.

## 15.3 Generar un Access Token

```php
<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function generarAccessToken(int $usuarioId): string
{
    $payload = [
        'sub' => $usuarioId,
        'iat' => time(),
        'exp' => time() + (15 * 60), // Expira en 15 minutos
    ];

    return JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
}
```

## 15.4 Verificar un Token

```php
<?php
function verificarToken(string $token): ?object
{
    try {
        return JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
    } catch (\Firebase\JWT\ExpiredException) {
        return null; // Token expirado
    } catch (\Exception) {
        return null; // Firma inválida o token malformado
    }
}
```

## 15.5 Middleware de Autenticación (Anticipo del Módulo 18)

```php
<?php
namespace App\Middlewares;

class AutenticarMiddleware
{
    public function manejar(): int
    {
        $cabeceras = getallheaders();
        $auth = $cabeceras['Authorization'] ?? '';

        if (!str_starts_with($auth, 'Bearer ')) {
            Response::error('Token no proporcionado', 401);
            exit;
        }

        $token = substr($auth, 7);
        $payload = verificarToken($token);

        if ($payload === null) {
            Response::error('Token inválido o expirado', 401);
            exit;
        }

        return (int) $payload->sub; // El ID del usuario autenticado
    }
}
```

## 15.6 Refresh Tokens

```php
<?php
function generarRefreshToken(int $usuarioId): string
{
    $payload = [
        'sub' => $usuarioId,
        'iat' => time(),
        'exp' => time() + (7 * 24 * 60 * 60), // Expira en 7 días
        'type' => 'refresh',
    ];

    return JWT::encode($payload, $_ENV['JWT_REFRESH_SECRET'], 'HS256');
}
```

Igual que en el patrón de Node.js: el **access token** vive poco tiempo y se envía en cada petición protegida; el **refresh token** vive mucho más y se usa únicamente para obtener un access token nuevo sin requerir que el usuario vuelva a iniciar sesión — normalmente almacenado en la base de datos para poder revocarlo (invalidar sesiones) de forma explícita.

## 15.7 Endpoint de Login Completo

```php
<?php
namespace App\Controladores;

class AuthControlador
{
    public function login(): void
    {
        $datos = json_decode(file_get_contents('php://input'), associative: true);

        $usuario = $this->repositorio->buscarPorEmail($datos['email'] ?? '');

        if ($usuario === null || !password_verify($datos['contraseña'] ?? '', $usuario['contraseña_hash'])) {
            Response::error('Credenciales inválidas', 401);
            return;
        }

        Response::json([
            'accessToken' => generarAccessToken($usuario['id']),
            'refreshToken' => generarRefreshToken($usuario['id']),
        ]);
    }
}
```

## 15.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Hashear una contraseña | `password_hash($texto, PASSWORD_BCRYPT)` |
| Verificar una contraseña contra su hash | `password_verify($texto, $hash)` |
| Generar un JWT | `JWT::encode($payload, $secreto, 'HS256')` |
| Verificar y decodificar un JWT | `JWT::decode($token, new Key($secreto, 'HS256'))` |
| Extraer el token de la cabecera `Authorization` | `substr($auth, 7)` tras validar el prefijo `"Bearer "` |

## 15.9 Errores Comunes

- **Guardar el secreto JWT directamente en el código en lugar de una variable de entorno**: expone la clave de firma si el código se filtra, comprometiendo todos los tokens emitidos.
- **Usar el mismo secreto para access y refresh tokens**: si uno se compromete, ambos quedan comprometidos — deben usar secretos y tiempos de expiración distintos.
- **No capturar `ExpiredException` específicamente**: sin distinguir un token expirado (el cliente debe refrescar) de uno inválido (el cliente debe volver a iniciar sesión), la respuesta de error pierde información útil para el frontend.
