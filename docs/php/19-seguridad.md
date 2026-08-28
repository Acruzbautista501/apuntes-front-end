# Módulo 19: Seguridad en APIs PHP

Sin un framework que aplique protecciones por defecto, la seguridad en una API PHP pura depende enteramente de aplicar explícitamente cada práctica cubierta en este módulo. Se retoman y consolidan riesgos ya mencionados en módulos anteriores, junto con varios nuevos.

## 19.1 Inyección SQL (Repaso y Consolidación)

```php
<?php
// ❌ NUNCA
$pdo->query("SELECT * FROM usuarios WHERE email = '$email'");

// ✅ SIEMPRE
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
```

Cubierto a fondo en el Módulo 12 — se reitera aquí porque sigue siendo, según el OWASP Top 10, una de las vulnerabilidades más comunes y de mayor impacto en aplicaciones web reales, y en PHP puro no hay ningún ORM interponiéndose por defecto para prevenirla automáticamente.

## 19.2 XSS (Cross-Site Scripting)

```php
<?php
// Si la API alguna vez renderiza HTML (ej. una página de administración simple)
echo htmlspecialchars($comentarioDeUsuario, ENT_QUOTES, 'UTF-8');
```

Una API que devuelve **únicamente** JSON tiene una superficie de ataque XSS mucho menor que una que renderiza HTML directamente — pero si el proyecto incluye alguna vista renderizada en el servidor, todo dato proveniente de un usuario debe escaparse con `htmlspecialchars()` antes de insertarse en HTML.

## 19.3 CSRF (Cross-Site Request Forgery)

Una API stateless autenticada por JWT en la cabecera `Authorization` (Módulo 15) es, por diseño, **inmune** a CSRF clásico — CSRF explota que el navegador envía cookies automáticamente con cada petición, algo que no ocurre con un token que el cliente debe adjuntar explícitamente en una cabecera. CSRF vuelve a ser relevante únicamente si la API usa autenticación por cookies de sesión (Módulo 10.7).

## 19.4 CORS Configurado Correctamente

```php
<?php
$origenesPermitidos = ['https://miapp.com', 'https://admin.miapp.com'];
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origen, $origenesPermitidos, strict: true)) {
    header("Access-Control-Allow-Origin: $origen");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
}
```

**Nunca** usar `Access-Control-Allow-Origin: *` en una API que maneja autenticación — permite que cualquier sitio web haga peticiones autenticadas desde el navegador de un usuario. Siempre validar contra una lista blanca explícita de orígenes permitidos, igual que en la configuración de CORS del backend Node.js de este sitio.

## 19.5 Limitación de Tasa (Rate Limiting)

```php
<?php
function limitarTasa(string $identificador, int $maximo, int $ventanaSegundos, \Redis $redis): bool
{
    $clave = "rate_limit:$identificador";
    $conteo = $redis->incr($clave);

    if ($conteo === 1) {
        $redis->expire($clave, $ventanaSegundos);
    }

    return $conteo <= $maximo;
}
```

```php
<?php
if (!limitarTasa($_SERVER['REMOTE_ADDR'], maximo: 100, ventanaSegundos: 60, redis: $redis)) {
    Response::error('Demasiadas peticiones', 429);
    exit;
}
```

Sin limitar la tasa de peticiones, una API queda expuesta a ataques de fuerza bruta (contra el endpoint de login, especialmente) y abuso general de recursos — Redis (retomado en el Módulo 22) es la elección estándar para contar peticiones de forma eficiente entre múltiples procesos PHP.

## 19.6 Cabeceras de Seguridad HTTP

```php
<?php
header('X-Content-Type-Options: nosniff');       // Evita que el navegador "adivine" el tipo de contenido
header('X-Frame-Options: DENY');                  // Evita que la API se embeba en un iframe (clickjacking)
header('Strict-Transport-Security: max-age=31536000'); // Fuerza HTTPS en peticiones futuras
```

Frameworks como Express suelen incluir estas cabeceras automáticamente vía middleware (`helmet()`, cubierto en el módulo de Node.js de este sitio) — en PHP puro deben establecerse explícitamente, idealmente centralizadas en un middleware propio (Módulo 18) aplicado globalmente.

## 19.7 Nunca Confiar en Datos Externos

```php
<?php
// El ID de usuario SIEMPRE debe venir del token verificado, JAMÁS de un campo enviado por el cliente
$usuarioId = $payload->sub; // ✅ Del JWT verificado en el servidor

// ❌ NUNCA confiar en esto para determinar identidad
$usuarioId = $datos['usuario_id']; // Un cliente malicioso podría enviar el ID de cualquier otro usuario
```

Este es el error concreto detrás de muchas vulnerabilidades de autorización rota (Módulo 16): derivar la identidad del usuario de un campo del cuerpo de la petición en lugar del token verificado criptográficamente en el servidor.

## 19.8 Tabla de Referencia Rápida

| Riesgo | Mitigación en PHP puro |
| :--- | :--- |
| Inyección SQL | Consultas preparadas con PDO, siempre |
| XSS | `htmlspecialchars()` en cualquier salida HTML |
| CSRF | JWT en cabecera (inmune por diseño), o tokens CSRF si se usan cookies |
| CORS mal configurado | Lista blanca explícita de orígenes, nunca `*` con credenciales |
| Fuerza bruta / abuso | Rate limiting con Redis |
| Cabeceras de seguridad ausentes | Middleware que las establece globalmente |

## 19.9 Errores Comunes

- **Asumir que una API JSON no necesita protección CSRF ni XSS "porque no es HTML"**: cierto en la mayoría de los casos con JWT en cabecera, pero falso en cuanto se introduce autenticación por cookies o cualquier vista renderizada en servidor.
- **Confiar en el ID de usuario, rol, o cualquier dato de identidad proveniente del cuerpo de la petición en lugar del token verificado**: la causa raíz de gran parte de las vulnerabilidades de autorización rota.
- **Configurar CORS con `Access-Control-Allow-Origin: *` en una API autenticada**: expone a cualquier sitio web a hacer peticiones autenticadas en nombre del usuario si el token se transmite de forma que el navegador pueda incluirlo automáticamente.
