# Módulo 24: Docker para Aplicaciones PHP

Contenerizar una aplicación PHP sigue el mismo objetivo que en el backend Node.js de este sitio: un entorno de ejecución reproducible e idéntico entre desarrollo y producción. Este módulo cubre las particularidades específicas de PHP frente a Node.js en Docker.

## 24.1 Dockerfile Multi-Stage para PHP

```dockerfile
# Etapa 1: instalar dependencias con Composer
FROM composer:2 AS dependencias
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Etapa 2: imagen final con PHP + servidor
FROM php:8.3-fpm-alpine
WORKDIR /app

RUN docker-php-ext-install pdo pdo_mysql opcache

COPY --from=dependencias /app/vendor ./vendor
COPY . .

EXPOSE 9000
CMD ["php-fpm"]
```

A diferencia del backend Node.js (donde `node index.js` sirve HTTP directamente), una imagen PHP en producción normalmente ejecuta **PHP-FPM** (*FastCGI Process Manager*), un servidor de procesos PHP que espera peticiones de un servidor web separado (Nginx) — PHP no sirve HTTP directamente en producción de la misma forma que Node.js.

## 24.2 Docker Compose: PHP-FPM + Nginx + MySQL + Redis

```yaml
services:
  app:
    build: .
    volumes:
      - ./src:/app/src
    environment:
      DB_HOST: db
      REDIS_HOST: redis

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./public:/app/public
    depends_on:
      - app

  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: api_ejemplo
      MYSQL_ROOT_PASSWORD: secreto
    volumes:
      - datos_mysql:/var/lib/mysql

  redis:
    image: redis:alpine

volumes:
  datos_mysql:
```

Este es el cambio arquitectónico más notable frente a Docker Compose para Node.js: una aplicación PHP en producción típicamente requiere **dos** servicios (Nginx + PHP-FPM) trabajando juntos, donde Node.js solo necesita uno, porque PHP-FPM no gestiona conexiones HTTP directamente.

## 24.3 Configuración Mínima de Nginx

```nginx
server {
    listen 80;
    root /app/public;
    index index.php;

    location / {
        try_files $uri /index.php$is_args$args; # Enruta todo a index.php (Módulo 9)
    }

    location ~ \.php$ {
        fastcgi_pass app:9000; # Reenvía la petición al contenedor PHP-FPM
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

## 24.4 OPcache: Crítico para Rendimiento en Producción

```ini
; docker-php-ext-install ya habilita opcache; configuración adicional recomendada
opcache.enable=1
opcache.validate_timestamps=0 ; En producción: no revisar cambios en disco en cada petición
opcache.max_accelerated_files=10000
```

OPcache almacena en memoria el bytecode ya compilado de los scripts PHP, evitando recompilarlos en cada petición — sin él, cada una de las peticiones que llegan a un proceso PHP-FPM recompila el código completo desde cero, un costo que Node.js no tiene (su proceso persistente ya mantiene el código compilado en memoria de forma natural).

## 24.5 El Worker de Colas como Servicio Separado

```yaml
  worker:
    build: .
    command: php worker.php
    environment:
      REDIS_HOST: redis
    depends_on:
      - redis
```

El worker de colas del Módulo 23 se ejecuta como su propio servicio en Docker Compose, independiente de los contenedores que atienden peticiones HTTP — reflejando en la infraestructura la misma separación de responsabilidades ya explicada a nivel de proceso.

## 24.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Instalar dependencias sin incluir Composer en la imagen final | Un build multi-stage con `composer:2` como etapa intermedia |
| Servir HTTP en producción | Nginx + PHP-FPM como dos servicios separados |
| Evitar recompilar código en cada petición | OPcache habilitado, con `validate_timestamps=0` en producción |
| Ejecutar el worker de colas de forma aislada | Un servicio Docker Compose separado con `command: php worker.php` |

## 24.7 Errores Comunes

- **Incluir Composer y las dependencias de desarrollo en la imagen final de producción**: aumenta innecesariamente el tamaño de la imagen y la superficie de ataque — usar `--no-dev` y un build multi-stage.
- **Olvidar habilitar y configurar OPcache en producción**: impacta significativamente el rendimiento, ya que cada petición recompila el código PHP desde cero sin él.
- **Servir la aplicación directamente con el servidor de desarrollo integrado (`php -S`) en producción**: no está diseñado para manejar carga concurrente real — producción siempre requiere PHP-FPM detrás de un servidor web como Nginx.
