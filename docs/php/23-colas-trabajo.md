# Módulo 23: Colas de Trabajo en PHP

Sin BullMQ (específico de Node.js) ni Laravel Queues, este módulo cubre cómo procesar trabajo en segundo plano en PHP puro con una cola respaldada por Redis — el mismo objetivo que BullMQ en el backend Node.js de este sitio: no bloquear la respuesta HTTP con tareas lentas como el envío de un correo.

## 23.1 El Problema que Resuelven las Colas

```php
<?php
// ❌ Bloquea la respuesta HTTP hasta que el correo termine de enviarse
public function registrar(array $datos): void
{
    $usuario = $this->repositorio->crear($datos);
    enviarCorreoBienvenida($usuario['email']); // Puede tardar varios segundos
    Response::json($usuario, 201);
}
```

```php
<?php
// ✅ Encola el trabajo y responde inmediatamente
public function registrar(array $datos): void
{
    $usuario = $this->repositorio->crear($datos);
    $this->cola->encolar('enviar_correo_bienvenida', ['email' => $usuario['email']]);
    Response::json($usuario, 201);
}
```

## 23.2 Una Cola Simple sobre Redis

```php
<?php
namespace App\Colas;

class Cola
{
    public function __construct(private readonly \Predis\Client $redis) {}

    public function encolar(string $tipo, array $datos): void
    {
        $this->redis->rpush('cola:trabajos', json_encode(['tipo' => $tipo, 'datos' => $datos]));
    }

    public function procesarSiguiente(): void
    {
        $trabajoRaw = $this->redis->blpop(['cola:trabajos'], timeout: 5); // Espera hasta 5s por un trabajo nuevo

        if ($trabajoRaw === null) {
            return; // Sin trabajos pendientes
        }

        $trabajo = json_decode($trabajoRaw[1], associative: true);
        $this->ejecutar($trabajo['tipo'], $trabajo['datos']);
    }

    private function ejecutar(string $tipo, array $datos): void
    {
        match ($tipo) {
            'enviar_correo_bienvenida' => enviarCorreoBienvenida($datos['email']),
            default => throw new \InvalidArgumentException("Tipo de trabajo desconocido: $tipo"),
        };
    }
}
```

`BLPOP` es un comando de Redis que bloquea esperando hasta que haya un elemento disponible en la lista (o hasta el timeout) — la base de una cola FIFO simple, sin necesitar sondear (*polling*) constantemente en un bucle ajustado.

## 23.3 El Worker: un Proceso Separado y Persistente

```php
<?php
// worker.php — se ejecuta como un proceso PHP de larga duración, separado del servidor web
require __DIR__ . '/vendor/autoload.php';

$cola = new App\Colas\Cola($redis);

echo "Worker escuchando trabajos...\n";

while (true) {
    $cola->procesarSiguiente();
}
```

```bash
php worker.php # Se ejecuta como un servicio independiente, no como parte de una petición HTTP
```

Esta es la diferencia arquitectónica clave frente al modelo "compartir-nada" de PHP (Módulo 1): un worker de colas es, deliberadamente, un proceso PHP **persistente** de larga duración, ejecutado por fuera del ciclo de petición-respuesta normal — normalmente gestionado por un supervisor de procesos como Supervisor o systemd para reiniciarse automáticamente si falla.

## 23.4 Reintentos ante Fallos

```php
<?php
private function ejecutar(string $tipo, array $datos, int $intento = 1): void
{
    try {
        match ($tipo) {
            'enviar_correo_bienvenida' => enviarCorreoBienvenida($datos['email']),
        };
    } catch (\Exception $e) {
        if ($intento < 3) {
            $this->encolar($tipo, $datos); // Reencolar para un reintento posterior
        } else {
            error_log("Trabajo '$tipo' falló tras 3 intentos: {$e->getMessage()}");
        }
    }
}
```

## 23.5 Bibliotecas de Colas Más Robustas

Para necesidades de producción más exigentes (reintentos con backoff exponencial, trabajos programados, prioridades, un panel de monitoreo), bibliotecas dedicadas como `php-enqueue/enqueue` o `symfony/messenger` resuelven estos problemas de forma más completa que una cola construida a mano — el enfoque manual de este módulo es valioso para entender el mecanismo subyacente antes de adoptar una herramienta más completa.

## 23.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Encolar una tarea sin bloquear la respuesta HTTP | `$redis->rpush('cola', json_encode($trabajo))` |
| Consumir trabajos de la cola de forma eficiente | `$redis->blpop(['cola'], timeout: N)` en un proceso worker separado |
| Ejecutar el worker de forma continua y resiliente | Un proceso de larga duración gestionado por Supervisor/systemd |
| Colas con más garantías (reintentos, prioridades) | `symfony/messenger` o `php-enqueue/enqueue` |

## 23.7 Errores Comunes

- **Ejecutar trabajo en segundo plano dentro del mismo proceso que atiende la petición HTTP**: contradice el modelo "compartir-nada" de PHP — ese proceso termina junto con la respuesta, sin garantía de que el trabajo en segundo plano complete su ejecución.
- **No manejar fallos dentro de un trabajo de la cola**: sin captura de excepciones ni lógica de reintento, un trabajo fallido se pierde silenciosamente sin ningún registro.
- **Ejecutar el worker manualmente sin un supervisor de procesos**: si el proceso del worker termina inesperadamente (por un error no capturado o un reinicio del servidor), nada lo reinicia automáticamente, deteniendo el procesamiento de trabajos hasta una intervención manual.
