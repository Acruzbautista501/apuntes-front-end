# Módulo 17: Una Capa de Acceso a Datos Propia

Sin Eloquent ni Doctrine, este módulo cubre cómo construir una capa de acceso a datos propia sobre PDO — lo suficientemente estructurada para evitar SQL disperso por todo el proyecto, sin la complejidad de un ORM completo.

## 17.1 El Problema que Resuelve una Capa de Acceso a Datos

Sin ninguna abstracción, cada servicio terminaría escribiendo SQL crudo directamente, duplicando lógica de conexión y mapeo de resultados. Un repositorio (ya introducido en el Módulo 12) resuelve el acceso básico — este módulo lo extiende con un patrón de **query builder** ligero para consultas más dinámicas.

## 17.2 Un Query Builder Mínimo

```php
<?php
namespace App\Database;

class QueryBuilder
{
    private string $tabla;
    private array $condiciones = [];
    private array $parametros = [];

    public function __construct(private readonly \PDO $pdo) {}

    public function tabla(string $tabla): static
    {
        $this->tabla = $tabla;
        return $this;
    }

    public function where(string $columna, mixed $valor): static
    {
        $this->condiciones[] = "$columna = :$columna";
        $this->parametros[$columna] = $valor;
        return $this;
    }

    public function obtener(): array
    {
        $sql = "SELECT * FROM {$this->tabla}";

        if (!empty($this->condiciones)) {
            $sql .= ' WHERE ' . implode(' AND ', $this->condiciones);
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->parametros);

        return $stmt->fetchAll();
    }
}
```

```php
<?php
$productos = (new QueryBuilder($pdo))
    ->tabla('productos')
    ->where('categoria', 'electronica')
    ->where('activo', true)
    ->obtener();
```

La interfaz fluida (`->tabla()->where()->obtener()`) es puramente sintáctica — internamente sigue generando SQL con parámetros vinculados, preservando la misma seguridad contra inyección SQL del Módulo 12. Nótese que los nombres de columna (`$columna`) usados para construir el SQL nunca deben provenir directamente de entrada externa sin una lista blanca de columnas permitidas, ya que ahí sí serían concatenados en la estructura de la consulta.

## 17.3 Mapeo de Filas a Objetos de Dominio

```php
<?php
namespace App\Modelos;

class Producto
{
    public function __construct(
        public readonly int $id,
        public readonly string $nombre,
        public readonly float $precio,
    ) {}

    public static function desdeFila(array $fila): self
    {
        return new self(
            id: (int) $fila['id'],
            nombre: $fila['nombre'],
            precio: (float) $fila['precio'],
        );
    }
}
```

```php
<?php
class ProductoRepositorio
{
    public function listarTodos(): array
    {
        $filas = (new QueryBuilder($this->pdo))->tabla('productos')->obtener();
        return array_map(Producto::desdeFila(...), $filas); // Sintaxis de "first-class callable" (PHP 8.1+)
    }
}
```

Mapear cada fila cruda de PDO (un array asociativo sin tipar) a un objeto de dominio tipado recupera parte de las garantías de tipos que un ORM completo daría automáticamente, sin la sobrecarga de configurar un mapeo objeto-relacional completo.

## 17.4 Paginación

```php
<?php
public function paginar(int $pagina, int $porPagina): array
{
    $offset = ($pagina - 1) * $porPagina;

    $stmt = $this->pdo->prepare('SELECT * FROM productos LIMIT :limite OFFSET :offset');
    $stmt->bindValue('limite', $porPagina, \PDO::PARAM_INT);
    $stmt->bindValue('offset', $offset, \PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll();
}
```

`bindValue()` con `\PDO::PARAM_INT` explícito es necesario aquí porque `LIMIT`/`OFFSET` en algunos motores no aceptan parámetros vinculados como string (el tipo por defecto) — un caso particular donde el tipo del parámetro debe declararse manualmente.

## 17.5 Cuándo Considerar un ORM (Doctrine)

Para proyectos con modelos de datos muy complejos y muchas relaciones, [Doctrine ORM](https://www.doctrine-project.org/) es la alternativa madura y usada en producción, independiente de cualquier framework — pero introduce una curva de aprendizaje considerable (mapeo de entidades, un lenguaje de consultas propio, gestión de un "unit of work"). Para la mayoría de APIs de tamaño pequeño-mediano, PDO + un query builder ligero + repositorios explícitos (el enfoque de este curso) ofrece un balance más simple entre control y productividad.

## 17.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Construir consultas dinámicas de forma segura | Un query builder propio sobre PDO, con parámetros vinculados |
| Convertir filas crudas en objetos tipados | Un método estático `desdeFila()` por modelo |
| Paginar resultados grandes | `LIMIT`/`OFFSET` con `bindValue()` y tipo explícito `PDO::PARAM_INT` |
| Un modelo de datos muy complejo con muchas relaciones | Evaluar Doctrine ORM en lugar de una capa propia |

## 17.7 Errores Comunes

- **Permitir que un nombre de columna llegue directamente de entrada externa sin lista blanca**: a diferencia de los valores (protegidos por parámetros vinculados), los nombres de columna u orden (`ORDER BY $columna`) se concatenan en la estructura SQL y deben validarse contra un conjunto fijo de columnas permitidas.
- **No usar `PDO::PARAM_INT` explícito en `LIMIT`/`OFFSET`**: puede causar errores de sintaxis SQL en algunos motores de base de datos al vincularse como string por defecto.
- **Construir un ORM completo propio "desde cero" en lugar de adoptar Doctrine cuando la complejidad lo justifica**: reinventar mapeo objeto-relacional, lazy loading y gestión de identidad es un esfuerzo considerable ya resuelto por bibliotecas maduras.
