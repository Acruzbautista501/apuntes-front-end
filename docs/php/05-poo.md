# Módulo 5: Programación Orientada a Objetos en PHP

PHP tiene un sistema de POO completo y maduro — clases, interfaces, herencia, traits y características modernas como propiedades de solo lectura y enums nativos. Este módulo cubre la base necesaria para estructurar cualquier aplicación PHP seria, con o sin framework.

## 5.1 Clases y Objetos

```php
<?php
class Usuario {
    public string $nombre;
    private string $email;

    public function __construct(string $nombre, string $email) {
        $this->nombre = $nombre;
        $this->email = $email;
    }

    public function obtenerEmail(): string {
        return $this->email;
    }
}

$usuario = new Usuario("Alex", "alex@ejemplo.com");
echo $usuario->nombre; // "Alex"
```

## 5.2 Promoción de Propiedades en el Constructor (PHP 8+)

```php
<?php
class Usuario {
    public function __construct(
        public string $nombre,
        private string $email,
        public readonly string $id, // "readonly": no se puede reasignar tras el constructor
    ) {}
}

$usuario = new Usuario("Alex", "alex@ejemplo.com", "usr_123");
echo $usuario->nombre; // "Alex" — se asignó automáticamente sin escribir $this->nombre = $nombre
```

Esta sintaxis (introducida en PHP 8.0) elimina el código repetitivo de asignar cada parámetro del constructor a una propiedad — declarar la visibilidad directamente en la firma del constructor genera la propiedad y la asignación automáticamente.

## 5.3 Visibilidad: `public`, `private`, `protected`

| Modificador | Accesible desde... |
| :--- | :--- |
| `public` | Cualquier lugar |
| `protected` | La propia clase y sus subclases |
| `private` | Únicamente la propia clase |

## 5.4 Herencia

```php
<?php
class Animal {
    public function __construct(protected string $nombre) {}

    public function hacerSonido(): string {
        return "...";
    }
}

class Perro extends Animal {
    public function hacerSonido(): string { // Sobrescribe el método del padre
        return "{$this->nombre} dice: ¡Guau!";
    }
}

echo (new Perro("Rex"))->hacerSonido(); // "Rex dice: ¡Guau!"
```

## 5.5 Interfaces

```php
<?php
interface Notificable {
    public function enviarNotificacion(string $mensaje): void;
}

class NotificadorEmail implements Notificable {
    public function enviarNotificacion(string $mensaje): void {
        echo "Enviando por email: $mensaje";
    }
}
```

Las interfaces definen un **contrato** sin implementación — fundamentales al construir una API desacoplada de sus dependencias concretas (por ejemplo, un contrato `RepositorioUsuarios` implementado tanto por una versión con base de datos real como por una versión simulada para tests, retomado en el Módulo 20).

## 5.6 Clases Abstractas

```php
<?php
abstract class Repositorio {
    abstract public function buscarPorId(int $id): ?array; // Sin cuerpo — obligatorio implementarlo

    public function existe(int $id): bool { // Método concreto, compartido por todas las subclases
        return $this->buscarPorId($id) !== null;
    }
}
```

Una clase abstracta no puede instanciarse directamente (a diferencia de una interfaz, sí puede contener métodos con implementación compartida) — útil cuando varias clases relacionadas comparten lógica común además del contrato.

## 5.7 Traits: Reutilización Horizontal de Código

```php
<?php
trait ConTimestamps {
    protected ?string $creadoEn = null;

    public function marcarCreacion(): void {
        $this->creadoEn = date('Y-m-d H:i:s');
    }
}

class Producto {
    use ConTimestamps; // "Copia" los métodos del trait dentro de la clase
}

$producto = new Producto();
$producto->marcarCreacion();
```

Los *traits* resuelven un problema que PHP no soporta de otra forma: PHP no permite herencia múltiple de clases, pero un trait permite compartir implementación entre clases sin relación jerárquica entre sí.

## 5.8 Enums Nativos (PHP 8.1+)

```php
<?php
enum EstadoPedido: string {
    case Pendiente = 'pendiente';
    case Enviado = 'enviado';
    case Entregado = 'entregado';

    public function esFinal(): bool { // Los enums pueden tener métodos
        return $this === self::Entregado;
    }
}

$estado = EstadoPedido::Enviado;
echo $estado->value;        // "enviado"
$estado->esFinal();          // false
```

Antes de PHP 8.1, los "enums" se simulaban con constantes de clase — los enums nativos garantizan en tiempo de compilación que una variable solo puede contener uno de los valores declarados, eliminando una fuente común de bugs por strings mágicos sueltos por el código.

## 5.9 Métodos y Propiedades Estáticas

```php
<?php
class Contador {
    private static int $total = 0;

    public static function incrementar(): int {
        return ++self::$total;
    }
}

Contador::incrementar(); // No requiere instanciar la clase
```

## 5.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Asignar parámetros del constructor sin repetición | Promoción de propiedades: `public function __construct(public string $x)` |
| Una propiedad que no cambia tras crearse | `readonly` |
| Un contrato sin implementación | `interface` |
| Compartir lógica común entre clases relacionadas | `abstract class` |
| Compartir código entre clases sin relación jerárquica | `trait` |
| Un conjunto cerrado de valores válidos | `enum` |

## 5.11 Errores Comunes

- **Hacer todas las propiedades `public` por defecto**: rompe el encapsulamiento — como regla general, empezar `private`/`protected` y exponer solo lo necesario.
- **Usar constantes de clase sueltas en lugar de un `enum`** en PHP 8.1+: pierde la validación en tiempo de compilación de que el valor pertenece al conjunto permitido.
- **Abusar de traits para evitar diseñar una jerarquía de clases correcta**: un trait es una herramienta de composición de código, no un sustituto de una interfaz o clase abstracta bien diseñada cuando existe una relación conceptual real de "es un".
