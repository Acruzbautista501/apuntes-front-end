# Módulo 23: CI/CD y Despliegue en Producción

Este módulo cubre cómo automatizar la verificación de calidad de cada cambio (**CI** — Integración Continua) y su publicación automática a producción (**CD** — Despliegue Continuo), usando GitHub Actions, junto con las opciones más comunes de hosting para una API Node.js.

## 23.1 Qué es CI/CD

```text
CI (Integración Continua):
  Cada push/PR dispara automáticamente: instalar dependencias, lint, tests, build.
  Si algo falla, el equipo se entera INMEDIATAMENTE, no días después.

CD (Despliegue Continuo):
  Si CI pasa exitosamente en la rama principal, el código se despliega
  automáticamente a producción, sin intervención manual.
```

## 23.2 Un Pipeline de CI con GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongo:
        image: mongo:7
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
        env:
          DATABASE_URL_TEST: mongodb://localhost:27017/test
```

* `services: mongo` levanta un contenedor de MongoDB temporal específicamente para este pipeline, disponible durante los tests de integración (Módulo 17) sin necesitar configurar nada externo.
* Cada paso (`lint`, `build`, `test`) debe completarse exitosamente para que el pipeline pase — cualquier fallo bloquea automáticamente el merge del Pull Request.

## 23.3 Proteger la Rama Principal

```text
Configuración en GitHub (Settings → Branches → Branch protection rules):
- Requerir que el pipeline de CI pase antes de permitir el merge
- Requerir al menos una revisión de código aprobada
- Prohibir push directo a main sin pasar por un Pull Request
```

Sin esta protección, es posible que código roto (que ni siquiera compila) llegue a la rama principal, aunque el pipeline de CI exista — la protección de rama es lo que realmente hace **cumplir** el requisito.

## 23.4 Despliegue Continuo (CD)

```yaml
# .github/workflows/deploy.yml
name: Deploy a Producción

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Desplegar en Railway
        run: |
          curl -X POST ${{ secrets.RAILWAY_DEPLOY_WEBHOOK }}
```

El paso exacto de despliegue varía según la plataforma elegida (23.5) — muchas ofrecen una integración directa con GitHub que despliega automáticamente en cada push a `main`, sin necesitar ni siquiera un workflow personalizado.

## 23.5 Opciones de Hosting para una API Node.js

| Plataforma | Características |
| :--- | :--- |
| **Railway** / **Render** | Despliegue directo desde GitHub, con base de datos incluida opcionalmente — la opción más simple para empezar |
| **Fly.io** | Despliegue basado en contenedores Docker (Módulo 22), buen control de infraestructura |
| **AWS (ECS/Elastic Beanstalk)** / **Google Cloud Run** | Mayor control y escalabilidad, curva de aprendizaje más pronunciada |
| **VPS propio (DigitalOcean, Linode)** | Control total, requiere gestionar manualmente el servidor, reinicio de procesos, certificados SSL |

Para MongoDB en producción, **MongoDB Atlas** (mencionado en el Módulo 13) es la opción estándar — evita gestionar la infraestructura de base de datos manualmente, con backups automáticos y escalado gestionado.

## 23.6 Variables de Entorno en Producción

```text
Nunca se sube el archivo .env a producción directamente — cada plataforma
de hosting tiene su propio mecanismo para configurar variables de entorno
de forma segura (paneles de configuración, secretos de GitHub Actions, etc.)
```

```yaml
# Ejemplo: usar un secreto de GitHub Actions en el pipeline
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL_PRODUCTION }}
```

## 23.7 Gestión de Procesos en Producción: PM2

Para despliegues en un VPS propio (sin un orquestador como Docker/Kubernetes gestionando reinicios), **PM2** mantiene el proceso de Node.js corriendo, reiniciándolo automáticamente si falla.

```bash
npm install -g pm2
pm2 start dist/index.js --name mi-api
pm2 startup      # Configura PM2 para iniciar automáticamente al reiniciar el servidor
pm2 save
```

```bash
pm2 logs mi-api    # Ver logs en tiempo real
pm2 restart mi-api # Reiniciar manualmente tras un despliegue
pm2 monit           # Dashboard de monitoreo de CPU/memoria en la terminal
```

## 23.8 Estrategias de Despliegue sin Downtime

* **Rolling deployment**: se reemplazan las instancias del servidor gradualmente, una por una, manteniendo siempre al menos una instancia disponible.
* **Blue-green deployment**: se despliega la nueva versión en un entorno paralelo completo ("green"), y el tráfico se redirige de una vez cuando está verificado, manteniendo la versión anterior ("blue") lista para revertir instantáneamente si algo falla.

La mayoría de plataformas modernas (Railway, Render, Fly.io) manejan esto automáticamente sin configuración manual — relevante principalmente al gestionar infraestructura propia.

## 23.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Verificar automáticamente cada cambio (lint, build, tests) | Un pipeline de CI (GitHub Actions) |
| Impedir que código roto llegue a `main` | Protección de rama + CI obligatorio |
| Desplegar automáticamente tras cada push a `main` | Un workflow de CD, o integración directa de la plataforma con GitHub |
| Variables de entorno seguras en producción | El mecanismo de secretos de la plataforma de hosting/CI, nunca `.env` versionado |
| Mantener el proceso vivo en un VPS propio | PM2 |

## 23.10 Errores Comunes

- **No requerir que CI pase antes de hacer merge**: permite que código roto llegue a `main` incluso teniendo un pipeline configurado, si no está aplicado como requisito obligatorio.
- **Subir credenciales de producción directamente al código o a `.env` versionado**: expone credenciales reales en el historial de Git de forma permanente.
- **Desplegar sin ningún proceso de gestión (PM2, Docker con reinicio automático) en un VPS propio**: un crash no manejado del proceso de Node.js deja la API completamente caída hasta una intervención manual.
