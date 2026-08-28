# Módulo 7: Composer y Gestión de Dependencias

Composer es el gestor de paquetes estándar de PHP — el equivalente directo a NPM en el ecosistema Node.js. Este módulo cubre su instalación, uso básico y el archivo `composer.json`.

## 7.1 ¿Qué es Composer?

Composer instala y gestiona las dependencias de un proyecto PHP, resuelve versiones compatibles entre paquetes, y genera el autoloader (Módulo 9) que permite usar clases de cualquier paquete instalado sin `require` manual. Prácticamente todo el ecosistema PHP moderno (bibliotecas, herramientas de testing, clientes HTTP) se distribuye a través de él, publicado en el repositorio público [Packagist](https://packagist.org/).

## 7.2 Instalación

```bash
# macOS / Linux
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Verificar
composer --version
```

## 7.3 Iniciar un Proyecto

```bash
composer init # Genera composer.json de forma interactiva
```

```json
{
    "name": "tu-usuario/api-ejemplo",
    "require": {
        "php": ">=8.2"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

## 7.4 Instalar Dependencias

```bash
composer require vlucas/phpdotenv          # Dependencia de producción
composer require --dev phpunit/phpunit     # Dependencia solo de desarrollo (Módulo 20)
```

```bash
composer install    # Instala exactamente las versiones fijadas en composer.lock (equivalente a "npm ci")
composer update      # Actualiza dependencias respetando los rangos de composer.json
```

`composer.lock` cumple el mismo rol que `package-lock.json` en Node.js: fija versiones exactas para builds reproducibles, y **debe** incluirse en el control de versiones.

## 7.5 El Autoloader

```php
<?php
require __DIR__ . '/vendor/autoload.php'; // Un único require carga TODAS las dependencias y clases propias

use App\Servicios\UsuarioServicio; // Ahora disponible sin ningún "require" adicional

$servicio = new UsuarioServicio();
```

`vendor/autoload.php` es el único punto de entrada necesario en cualquier script PHP moderno que use Composer — internamente resuelve automáticamente qué archivo cargar para cada clase usada, siguiendo el estándar PSR-4 (retomado en el Módulo 9).

## 7.6 Scripts Personalizados

```json
{
    "scripts": {
        "test": "phpunit",
        "start": "php -S localhost:8000 -t public"
    }
}
```

```bash
composer run-script test
composer test # Forma abreviada
```

El equivalente directo a la sección `"scripts"` de `package.json` en Node.js.

## 7.7 Paquetes Comunes en un Proyecto de API sin Framework

| Paquete | Propósito |
| :--- | :--- |
| `vlucas/phpdotenv` | Cargar variables de entorno desde `.env` |
| `nikic/fast-route` | Enrutamiento HTTP ligero, sin un framework completo (Módulo 11) |
| `firebase/php-jwt` | Generación y verificación de tokens JWT (Módulo 15) |
| `respect/validation` | Validación de datos de entrada (Módulo 14) |
| `phpunit/phpunit` | Testing (Módulo 20) |
| `monolog/monolog` | Logging estructurado |

## 7.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Añadir una dependencia | `composer require paquete/nombre` |
| Añadir una dependencia solo de desarrollo | `composer require --dev paquete/nombre` |
| Instalar dependencias ya fijadas en el lock file | `composer install` |
| Cargar el autoloader en cualquier script | `require __DIR__ . '/vendor/autoload.php';` |
| Buscar paquetes disponibles | [packagist.org](https://packagist.org/) |

## 7.9 Errores Comunes

- **No incluir `composer.lock` en el control de versiones**: rompe la reproducibilidad de builds entre entornos distintos (igual que ignorar `package-lock.json` en Node.js).
- **Ejecutar `composer update` en producción**: puede introducir versiones nuevas no probadas — en despliegue siempre debe usarse `composer install` con el lock file ya validado.
- **Olvidar el `require` del autoloader al inicio de un script**: produce errores de "clase no encontrada" al intentar usar cualquier dependencia o clase propia con namespace.
