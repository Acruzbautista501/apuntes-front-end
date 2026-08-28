# Módulo 22: Caché con Redis en PHP

Redis, ya cubierto en el backend Node.js de este sitio, se usa exactamente igual desde PHP: como una capa de caché externa y compartida entre múltiples procesos PHP (relevante porque, a diferencia de Node.js, cada petición PHP corre en un proceso aislado sin memoria compartida entre sí, Módulo 1).

## 22.1 Conexión

```bash
composer require predis/predis
```

```php
<?php
$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host' => $_ENV['REDIS_HOST'] ?? 'localhost',
    'port' => $_ENV['REDIS_PORT'] ?? 6379,
]);
```

## 22.2 Operaciones Básicas

```php
<?php
$redis->set('producto:1', json_encode(['id' => 1, 'nombre' => 'Teclado']));
$redis->expire('producto:1', 3600); // Expira en 1 hora

$valor = $redis->get('producto:1');
$producto = $valor !== null ? json_decode($valor, associative: true) : null;

$redis->del('producto:1');
```

```php
<?php
// Establecer con expiración en un solo paso
$redis->setex('producto:1', 3600, json_encode($producto));
```

## 22.3 El Patrón Cache-Aside

```php
<?php
class ProductoServicio
{
    public function __construct(
        private ProductoRepositorioPdo $repositorio,
        private Predis\Client $redis,
    ) {}

    public function buscarPorId(int $id): ?array
    {
        $clave = "producto:$id";
        $enCache = $this->redis->get($clave);

        if ($enCache !== null) {
            return json_decode($enCache, associative: true); // Hit: se evita la consulta a la base de datos
        }

        $producto = $this->repositorio->buscarPorId($id); // Miss: se consulta la base de datos

        if ($producto !== null) {
            $this->redis->setex($clave, 3600, json_encode($producto));
        }

        return $producto;
    }
}
```

Este es exactamente el mismo patrón cache-aside cubierto en el módulo de Redis del backend Node.js de este sitio: comprobar la caché primero, consultar la fuente de verdad (PDO) solo en caso de fallo (*miss*), y poblar la caché con el resultado para peticiones futuras.

## 22.4 Invalidación al Modificar Datos

```php
<?php
public function actualizar(int $id, array $datos): array
{
    $producto = $this->repositorio->actualizar($id, $datos);
    $this->redis->del("producto:$id"); // Invalidar la entrada obsoleta
    return $producto;
}
```

"La caché desactualizada" es el riesgo constante de cualquier estrategia de caché — cada operación que modifica un dato cacheado debe invalidar (o actualizar) explícitamente la entrada correspondiente, o los clientes de la API recibirán datos obsoletos hasta que expire por tiempo.

## 22.5 Caché de Listados con Claves Compuestas

```php
<?php
public function listarPorCategoria(string $categoria, int $pagina): array
{
    $clave = "productos:categoria:$categoria:pagina:$pagina";
    $enCache = $this->redis->get($clave);

    if ($enCache !== null) {
        return json_decode($enCache, associative: true);
    }

    $resultado = $this->repositorio->listarPorCategoria($categoria, $pagina);
    $this->redis->setex($clave, 300, json_encode($resultado)); // TTL más corto para listados, que cambian más seguido

    return $resultado;
}
```

## 22.6 Redis como Almacén de Sesiones

```php
<?php
// php.ini o ini_set() al inicio del script
ini_set('session.save_handler', 'redis');
ini_set('session.save_path', "tcp://{$_ENV['REDIS_HOST']}:6379");
```

Configurar Redis como backend de sesiones (en lugar del sistema de archivos local por defecto de PHP) es necesario en cualquier despliegue con más de un servidor PHP detrás de un balanceador de carga — sin esto, la sesión de un usuario quedaría atada al servidor específico que la creó.

## 22.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Guardar un valor con expiración | `$redis->setex($clave, $segundos, $valor)` |
| Leer un valor cacheado | `$redis->get($clave)` |
| Invalidar una entrada tras modificar el dato | `$redis->del($clave)` |
| Compartir sesiones entre múltiples servidores PHP | Redis como `session.save_handler` |

## 22.8 Errores Comunes

- **No invalidar la caché al modificar o eliminar un dato**: la causa más común de servir datos obsoletos a los clientes de la API.
- **Cachear datos sensibles o específicos de un usuario bajo una clave genérica compartida**: puede filtrar datos de un usuario a otro si la clave no incluye un identificador único (ej. `usuario:42:carrito` en lugar de solo `carrito`).
- **No establecer un TTL (tiempo de expiración) en absoluto**: sin expiración, una entrada obsoleta puede persistir indefinidamente si el código de invalidación falla o se omite en algún punto.
