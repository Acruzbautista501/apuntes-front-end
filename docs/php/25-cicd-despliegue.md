# Módulo 25: CI/CD y Despliegue en Producción

Este módulo cierra el ciclo de vida de la aplicación con integración continua y despliegue, siguiendo el mismo enfoque con GitHub Actions ya usado en el backend Node.js de este sitio, adaptado a las herramientas específicas de PHP.

## 25.1 Pipeline de CI con GitHub Actions

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8
        env:
          MYSQL_DATABASE: test_db
          MYSQL_ROOT_PASSWORD: secreto
        ports:
          - 3306:3306

    steps:
      - uses: actions/checkout@v4

      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: pdo, pdo_mysql
          coverage: none

      - name: Instalar dependencias
        run: composer install --prefer-dist --no-progress

      - name: Verificar estilo de código (PSR-12)
        run: vendor/bin/php-cs-fixer fix --dry-run --diff

      - name: Análisis estático
        run: vendor/bin/phpstan analyse src

      - name: Ejecutar tests
        run: vendor/bin/phpunit
```

`shivammathur/setup-php` es la acción estándar de la comunidad para instalar y configurar PHP en GitHub Actions — el equivalente a `actions/setup-node` en el pipeline del backend Node.js de este sitio.

## 25.2 Análisis Estático con PHPStan

```bash
composer require --dev phpstan/phpstan
```

```neon
# phpstan.neon
parameters:
    level: 6 # 0 (básico) a 9 (más estricto)
    paths:
        - src
```

PHPStan analiza el código sin ejecutarlo, detectando errores de tipos, variables no definidas y llamadas a métodos inexistentes — el equivalente PHP a lo que el compilador de TypeScript aporta de forma nativa en el resto de proyectos de este sitio, ya que PHP no tiene una fase de compilación equivalente por defecto.

## 25.3 Estilo de Código Automático con PHP-CS-Fixer

```bash
composer require --dev friendsofphp/php-cs-fixer
```

```php
<?php
// .php-cs-fixer.php
return (new PhpCsFixer\Config())
    ->setRules(['@PSR12' => true])
    ->setFinder(PhpCsFixer\Finder::create()->in(__DIR__ . '/src'));
```

## 25.4 Build de Producción

```yaml
  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: registro.ejemplo.com/api-php:${{ github.sha }}
```

## 25.5 Despliegue

```yaml
  desplegar:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Desplegar nueva versión
        run: |
          ssh usuario@servidor "cd /app && docker compose pull && docker compose up -d"
```

Un despliegue típico de PHP-FPM tras un cambio de código requiere además **reiniciar** (no solo reemplazar) los procesos de PHP-FPM — a diferencia de Node.js, donde reemplazar el proceso completo del contenedor ya recarga todo el código, PHP-FPM con OPcache configurado puede requerir un paso explícito de invalidación de caché si `validate_timestamps` está deshabilitado (Módulo 24.4).

## 25.6 Variables de Entorno en Producción

```bash
# Nunca en el repositorio — inyectadas por la plataforma de despliegue o un gestor de secretos
DB_HOST=produccion-db.ejemplo.com
JWT_SECRET=***
REDIS_HOST=produccion-redis.ejemplo.com
```

## 25.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Instalar PHP en un pipeline de CI | La acción `shivammathur/setup-php` |
| Detectar errores de tipos sin ejecutar el código | PHPStan |
| Aplicar PSR-12 automáticamente | `php-cs-fixer fix` |
| Servir la base de datos de test en CI | Un servicio `mysql` dentro del job de GitHub Actions |
| Evitar código servido con caché desactualizada tras desplegar | Reiniciar PHP-FPM o invalidar OPcache explícitamente |

## 25.8 Errores Comunes

- **Omitir PHPStan del pipeline de CI**: sin un compilador que valide tipos de forma nativa, PHP depende completamente de herramientas de análisis estático externas para detectar esa clase de errores antes de producción.
- **No reiniciar PHP-FPM tras un despliegue con OPcache configurado agresivamente**: puede servir código antiguo desde caché incluso después de que los archivos en disco ya se hayan actualizado.
- **Ejecutar tests contra la base de datos de producción en el pipeline de CI**: siempre debe usarse una base de datos de test aislada y descartable, como el servicio `mysql` efímero del job de CI.
