# Módulo 22: Docker para Aplicaciones Node.js

"Funciona en mi máquina" es un problema que Docker resuelve empaquetando la aplicación junto con **todo su entorno de ejecución** (versión de Node, dependencias del sistema) en un contenedor que se comporta idénticamente sin importar dónde se ejecute. Este módulo cubre cómo contenerizar una API Node.js + MongoDB.

## 22.1 Conceptos Base: Imagen vs Contenedor

```text
Imagen:      Una plantilla inmutable (el "molde") que define el entorno completo
Contenedor:  Una instancia en ejecución de esa imagen (el "producto" del molde)
```

Una imagen se construye una vez a partir de un `Dockerfile`; a partir de esa misma imagen se pueden crear múltiples contenedores en ejecución, todos idénticos en su punto de partida.

## 22.2 Un `Dockerfile` Básico

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

* `FROM node:20-alpine`: la imagen base — `alpine` es una distribución de Linux minimalista, reduciendo significativamente el tamaño final de la imagen comparado con una imagen completa.
* `WORKDIR /app`: todos los comandos siguientes se ejecutan relativos a esta carpeta dentro del contenedor.
* `COPY package*.json ./` + `RUN npm ci` **antes** de copiar el resto del código: aprovecha el sistema de caché de capas de Docker — si el código cambia pero las dependencias no, Docker reutiliza la capa de `npm ci` ya construida, acelerando builds posteriores significativamente.
* `npm ci` (en lugar de `npm install`) instala exactamente las versiones de `package-lock.json` (Módulo 5), garantizando reproducibilidad exacta.

## 22.3 Multi-Stage Build — Imágenes de Producción Más Livianas

```dockerfile
# Etapa 1: construir la aplicación (incluye devDependencies, TypeScript)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: la imagen final, solo con lo necesario para EJECUTAR (no para compilar)
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

La imagen final **no** incluye TypeScript, herramientas de desarrollo, ni el código fuente `.ts` original — solo el JavaScript ya compilado y las dependencias de producción, resultando en una imagen significativamente más pequeña y con menor superficie de ataque de seguridad.

## 22.4 `.dockerignore`

```text
node_modules/
dist/
.env
.git/
*.md
```

Igual que `.gitignore`, evita copiar archivos innecesarios (o sensibles) dentro de la imagen — `node_modules` local no debe copiarse nunca, ya que se reinstala limpio dentro del contenedor con `npm ci`.

## 22.5 Construir y Ejecutar el Contenedor

```bash
docker build -t mi-api .
docker run -p 3000:3000 --env-file .env mi-api
```

`-p 3000:3000` mapea el puerto 3000 del contenedor al puerto 3000 de la máquina host; `--env-file .env` pasa las variables de entorno (Módulo 5) al contenedor sin necesitar incluirlas en la imagen.

## 22.6 Docker Compose — Orquestar API + MongoDB + Redis Juntos

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/mi_app
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - datos-mongo:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  datos-mongo:
```

```bash
docker compose up -d      # Levanta los tres servicios juntos en segundo plano
docker compose logs -f api # Sigue los logs del servicio "api" en tiempo real
docker compose down        # Detiene y elimina los contenedores
```

Dentro de la red de Docker Compose, los servicios se comunican entre sí usando su **nombre de servicio** como hostname (`mongo`, `redis`) — no `localhost`, que dentro de un contenedor se refiere al propio contenedor, no a los demás servicios.

## 22.7 Volúmenes — Persistencia de Datos

```yaml
volumes:
  datos-mongo:/data/db
```

Sin un volumen, los datos de MongoDB viven **dentro** del contenedor y se pierden por completo cuando el contenedor se elimina (`docker compose down` seguido de recrear el contenedor) — un volumen persiste los datos en el sistema de archivos del host, independiente del ciclo de vida del contenedor.

## 22.8 Variables de Entorno por Ambiente

```yaml
# docker-compose.override.yml (desarrollo, se combina automáticamente con docker-compose.yml)
services:
  api:
    volumes:
      - ./src:/app/src  # Monta el código fuente local para recarga en vivo durante desarrollo
    command: npm run dev
```

Docker Compose combina automáticamente `docker-compose.yml` con `docker-compose.override.yml` si existe — un patrón común para tener configuración base compartida, más ajustes específicos de desarrollo sin duplicar todo el archivo.

## 22.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Empaquetar la aplicación con todo su entorno | Un `Dockerfile` |
| Una imagen de producción más liviana, sin herramientas de build | Multi-stage build |
| Ejecutar API + MongoDB + Redis juntos con un solo comando | Docker Compose |
| Que los datos de MongoDB sobrevivan a la eliminación del contenedor | Un volumen |
| Que los servicios de Compose se comuniquen entre sí | El nombre del servicio como hostname, no `localhost` |

## 22.10 Errores Comunes

- **Copiar todo el código antes de instalar dependencias**: invalida la caché de capas de Docker en cada cambio de código, incluso si las dependencias no cambiaron — siempre copia `package*.json` e instala dependencias primero.
- **No usar multi-stage build**: la imagen final incluye TypeScript, herramientas de desarrollo, y el código fuente sin compilar — innecesariamente grande y con más superficie de ataque.
- **Usar `localhost` para conectar servicios dentro de Docker Compose**: dentro de un contenedor, `localhost` se refiere al propio contenedor, no a los servicios vecinos — siempre usa el nombre del servicio definido en el `docker-compose.yml`.
