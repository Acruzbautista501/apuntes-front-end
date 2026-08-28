# Módulo 12: PDO y Bases de Datos Relacionales

PDO (*PHP Data Objects*) es la interfaz nativa y estándar de PHP para conectarse a bases de datos relacionales — el equivalente a un driver de base de datos en Node.js, pero integrado en el propio lenguaje. Este módulo cubre conexión, consultas seguras y transacciones.

## 12.1 Conectar con PDO

```php
<?php
$pdo = new PDO(
    dsn: 'mysql:host=localhost;dbname=api_ejemplo;charset=utf8mb4',
    username: 'usuario',
    password: 'contraseña',
    options: [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Los errores lanzan excepciones, no retornan "false" silenciosamente
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Resultados como arrays asociativos por defecto
    ]
);
```

`PDO::ERRMODE_EXCEPTION` es la configuración recomendada casi siempre — sin ella, PDO por defecto falla silenciosamente devolviendo `false`, un comportamiento fácil de pasar por alto y que dificulta el manejo de errores centralizado (Módulo 6).

## 12.2 Consultas Preparadas (Prevención de Inyección SQL)

```php
<?php
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = :email');
$stmt->execute(['email' => $emailIngresadoPorElUsuario]);

$usuario = $stmt->fetch(); // Un solo registro, o "false" si no existe
```

**Nunca** debe interpolarse directamente un valor externo dentro del SQL — las consultas preparadas separan la estructura de la consulta de los datos, haciendo que PDO escape los valores automáticamente. Se profundiza en el riesgo concreto de inyección SQL en el Módulo 19.

```php
<?php
// ❌ NUNCA: vulnerable a inyección SQL
$pdo->query("SELECT * FROM usuarios WHERE email = '$email'");

// ✅ SIEMPRE: parámetros vinculados
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
```

## 12.3 Insertar, Actualizar y Eliminar

```php
<?php
$stmt = $pdo->prepare('INSERT INTO usuarios (nombre, email) VALUES (:nombre, :email)');
$stmt->execute(['nombre' => 'Alex', 'email' => 'alex@ejemplo.com']);

$idNuevo = $pdo->lastInsertId(); // ID autoincremental generado

$stmt = $pdo->prepare('UPDATE usuarios SET nombre = :nombre WHERE id = :id');
$stmt->execute(['nombre' => 'Alex García', 'id' => $idNuevo]);

$stmt = $pdo->prepare('DELETE FROM usuarios WHERE id = :id');
$stmt->execute(['id' => $idNuevo]);
$filasAfectadas = $stmt->rowCount();
```

## 12.4 Obtener Múltiples Registros

```php
<?php
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE activo = :activo');
$stmt->execute(['activo' => true]);

$usuarios = $stmt->fetchAll(); // Todos los registros como array de arrays asociativos
```

## 12.5 Transacciones

```php
<?php
try {
    $pdo->beginTransaction();

    $pdo->prepare('UPDATE cuentas SET saldo = saldo - ? WHERE id = ?')
        ->execute([100, 1]);

    $pdo->prepare('UPDATE cuentas SET saldo = saldo + ? WHERE id = ?')
        ->execute([100, 2]);

    $pdo->commit();
} catch (\PDOException $e) {
    $pdo->rollBack(); // Revierte ambas operaciones si cualquiera falla
    throw $e;
}
```

Igual que las transacciones con sesiones en Mongoose (cubiertas en el módulo de Node.js de este sitio), una transacción PDO garantiza que un conjunto de operaciones se aplique **completo o nada** — esencial en cualquier operación que modifique más de una tabla de forma dependiente, como una transferencia entre cuentas.

## 12.6 Un Repositorio con PDO

```php
<?php
namespace App\Repositorios;

class UsuarioRepositorioPdo
{
    public function __construct(private readonly \PDO $pdo) {}

    public function buscarPorId(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM usuarios WHERE id = :id');
        $stmt->execute(['id' => $id]);

        $resultado = $stmt->fetch();
        return $resultado === false ? null : $resultado;
    }

    public function crear(string $nombre, string $email): array
    {
        $stmt = $this->pdo->prepare('INSERT INTO usuarios (nombre, email) VALUES (:nombre, :email)');
        $stmt->execute(['nombre' => $nombre, 'email' => $email]);

        return $this->buscarPorId((int) $this->pdo->lastInsertId());
    }
}
```

Encapsular PDO dentro de una clase de repositorio (en lugar de usarlo directamente en controladores o servicios) es lo que permite, más adelante, sustituir la implementación por una simulada en tests (Módulo 20) sin tocar el resto de la aplicación — el mismo principio de las interfaces del Módulo 5.

## 12.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Conectar a la base de datos con errores explícitos | `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION` |
| Ejecutar una consulta con datos externos de forma segura | `$pdo->prepare(...)->execute([...])` |
| Obtener un único registro | `$stmt->fetch()` |
| Obtener todos los registros | `$stmt->fetchAll()` |
| El ID autoincremental de la última inserción | `$pdo->lastInsertId()` |
| Garantizar que varias operaciones se apliquen juntas o ninguna | `beginTransaction()` / `commit()` / `rollBack()` |

## 12.8 Errores Comunes

- **Interpolar valores directamente en el SQL en lugar de usar parámetros vinculados**: la causa más común de vulnerabilidades de inyección SQL — nunca aceptable, ni siquiera para valores que "parecen" seguros.
- **No configurar `PDO::ERRMODE_EXCEPTION`**: los errores de base de datos fallan silenciosamente en lugar de lanzar una excepción capturable, dificultando su detección.
- **Olvidar `rollBack()` en el bloque `catch` de una transacción**: deja la transacción abierta y las operaciones parciales aplicadas de forma inconsistente.
