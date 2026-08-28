# Módulo 5: NPM y Gestión de Dependencias

NPM (*Node Package Manager*) ya se ha usado indirectamente en las secciones de Vue.js, React y las anteriores de este sitio — este módulo lo cubre a fondo desde la perspectiva de un proyecto backend, donde la gestión cuidadosa de dependencias, versiones y variables de entorno importa aún más que en frontend.

## 5.1 `package.json` — El Corazón del Proyecto

```json
{
  "name": "mi-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest"
  },
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "typescript": "^5.5.4",
    "@types/node": "^20.14.0"
  }
}
```

* `dependencies`: paquetes necesarios en **producción** (Express, la librería de base de datos) — se instalan siempre.
* `devDependencies`: paquetes necesarios solo durante **desarrollo** (TypeScript, herramientas de testing, linters) — no se instalan en un entorno de producción optimizado.

## 5.2 Versionado Semántico (SemVer)

```text
^4.19.2
│ │  │ └─ patch: correcciones de bugs, sin cambios de API
│ │  └─── minor: nueva funcionalidad, retrocompatible
│ └────── major: cambios que rompen compatibilidad
```

| Símbolo | Comportamiento al instalar |
| :--- | :--- |
| `^4.19.2` | Acepta actualizaciones de `minor` y `patch` (4.x.x, nunca 5.x.x) |
| `~4.19.2` | Acepta solo actualizaciones de `patch` (4.19.x) |
| `4.19.2` (sin prefijo) | Versión exacta, sin ninguna actualización automática |

## 5.3 `package-lock.json` — Reproducibilidad Exacta

```bash
npm install
# Genera/actualiza package-lock.json con las versiones EXACTAS instaladas,
# incluyendo las dependencias de las dependencias (transitivas)
```

`package-lock.json` **sí debe versionarse** en Git (a diferencia de `node_modules/`) — garantiza que cualquier persona que clone el proyecto e instale dependencias obtenga exactamente las mismas versiones, evitando el clásico "en mi máquina funciona" causado por diferencias sutiles de versión.

## 5.4 Comandos Esenciales

```bash
npm install                       # Instala todas las dependencias de package.json
npm install express                # Agrega una dependencia de producción
npm install -D vitest              # Agrega una dependencia de desarrollo
npm uninstall paquete-innecesario
npm update                         # Actualiza dentro de los rangos definidos por ^/~
npm outdated                       # Muestra qué paquetes tienen versiones más nuevas disponibles
npm audit                          # Revisa vulnerabilidades de seguridad conocidas
```

## 5.5 Scripts Personalizados

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

```bash
npm run dev
npm run test:watch
```

Los scripts encapsulan comandos largos o complejos bajo un nombre corto y memorable, consistente entre todo el equipo — nadie necesita recordar los flags exactos de cada herramienta.

## 5.6 Variables de Entorno con `dotenv`

```text
# .env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/mi_app
JWT_SECRET=una-clave-secreta-larga-y-aleatoria
```

```typescript
// src/config.ts
import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET
}
```

## 5.7 Validar Variables de Entorno al Arrancar

```typescript
// src/config.ts
import 'dotenv/config'
import { z } from 'zod'

const esquemaEnv = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32)
})

export const env = esquemaEnv.parse(process.env) // Lanza un error claro si falta alguna variable
```

Validar las variables de entorno al iniciar (usando Zod, retomado en el Módulo 8) evita que el servidor arranque "a medias" con una configuración incompleta, fallando silenciosamente más tarde con un error confuso en producción — en su lugar, falla inmediatamente y de forma clara al arrancar.

## 5.8 `.env.example` — Documentar Variables Requeridas

```text
# .env.example — SÍ se versiona, sin valores reales
PORT=3000
DATABASE_URL=
JWT_SECRET=
```

Un archivo `.env.example` (sin credenciales reales) documenta qué variables necesita el proyecto, para que cualquier persona nueva en el equipo sepa exactamente qué configurar sin tener que adivinar leyendo el código fuente.

## 5.9 `npx` — Ejecutar Paquetes sin Instalación Global

```bash
npx tsc --init          # Ejecuta el binario de un paquete instalado localmente
npx create-vite@latest  # Ejecuta un paquete sin instalarlo permanentemente en absoluto
```

`npx` evita la necesidad de instalar herramientas globalmente en el sistema — ejecuta el binario del paquete instalado en `node_modules/.bin` del proyecto actual, o lo descarga temporalmente si no está instalado.

## 5.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un paquete necesario en producción | `npm install nombre-paquete` |
| Un paquete solo para desarrollo/testing | `npm install -D nombre-paquete` |
| Garantizar las mismas versiones exactas entre entornos | Versionar `package-lock.json` |
| Configuración sensible fuera del código | `.env` + `dotenv`, nunca versionado |
| Que el servidor falle rápido si falta configuración | Validar `process.env` con Zod al arrancar |
| Documentar qué variables de entorno requiere el proyecto | `.env.example` (sin valores reales) |

## 5.11 Errores Comunes

- **No versionar `package-lock.json`**: permite que distintos entornos instalen versiones ligeramente distintas de las mismas dependencias, causando bugs difíciles de reproducir.
- **Poner dependencias de desarrollo en `dependencies`**: infla innecesariamente el tamaño del build de producción con herramientas que nunca se ejecutan ahí.
- **No validar las variables de entorno al arrancar**: un `DATABASE_URL` mal escrito o faltante puede pasar desapercibido hasta que el código intenta usarlo, fallando de forma confusa mucho después del arranque real del servidor.
