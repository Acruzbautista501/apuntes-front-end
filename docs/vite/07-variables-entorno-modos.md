# Módulo 7: Variables de Entorno y Modos (.env)

Vite tiene un sistema propio y bien definido para variables de entorno y "modos" de ejecución — este módulo cubre cómo configurarlos correctamente, incluyendo una regla de seguridad crítica sobre qué variables terminan expuestas en el navegador.

## 7.1 Archivos `.env`

```text
.env                 # Se carga en TODOS los casos
.env.local             # Como el anterior, pero ignorado por git (para secretos locales)
.env.development        # Solo en modo "development"
.env.production           # Solo en modo "production"
.env.development.local     # Combinación de ambos, también ignorado por git
```

```text
# .env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME="Mi Aplicación"
```

Vite carga estos archivos automáticamente según el modo activo (7.4), sin necesitar ninguna biblioteca adicional como `dotenv` — a diferencia de Node.js puro, este soporte viene incorporado desde el primer momento.

## 7.2 La Regla del Prefijo `VITE_`

```env
VITE_API_URL=http://localhost:4000    # ✅ Expuesta al código del navegador
DATABASE_PASSWORD=secreto123           # ❌ NO expuesta, invisible para import.meta.env
```

Por seguridad, **solo** las variables con el prefijo `VITE_` se exponen al código que corre en el navegador — cualquier otra variable en `.env` (sin ese prefijo) permanece invisible para `import.meta.env`, aunque exista en el archivo. Esta es una decisión deliberada de diseño: previene que un secreto de servidor (una clave de API privada, una contraseña de base de datos) termine accidentalmente incluido en el bundle de JavaScript que cualquier visitante del sitio puede leer.

## 7.3 Acceder a las Variables: `import.meta.env`

```ts
console.log(import.meta.env.VITE_API_URL)     // "http://localhost:4000"
console.log(import.meta.env.MODE)                // "development" o "production"
console.log(import.meta.env.DEV)                  // true en desarrollo
console.log(import.meta.env.PROD)                  // true en producción
console.log(import.meta.env.BASE_URL)               // La base configurada (Módulo 15)
```

`import.meta.env` reemplaza al patrón `process.env` usado en proyectos basados en Webpack/Node.js — es una API estándar del navegador (`import.meta`) extendida por Vite, no una emulación de una API de Node.js.

## 7.4 Modos: Más Allá de Desarrollo y Producción

```bash
vite --mode staging
```

```text
.env.staging   # Se carga específicamente para este modo
```

```json
{
  "scripts": {
    "build:staging": "vite build --mode staging"
  }
}
```

Por defecto, `dev` usa el modo `development` y `build` usa el modo `production` — pero es posible definir modos adicionales completamente personalizados (`staging`, `qa`, etc.), cada uno con su propio archivo `.env.<modo>`, útil para tener configuraciones distintas de API/feature flags por entorno de despliegue.

## 7.5 Tipado de Variables de Entorno en TypeScript

```ts
// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Sin esta declaración, TypeScript trata `import.meta.env.VITE_API_URL` como `any` — extender la interfaz `ImportMetaEnv` habilita autocompletado y verificación de tipos sobre las variables específicas del proyecto.

## 7.6 Valores Booleanos y Numéricos: Todo es String por Defecto

```env
VITE_MAX_ITEMS=10
VITE_FEATURE_FLAG=true
```

```ts
const maxItems = Number(import.meta.env.VITE_MAX_ITEMS)      // Conversión manual necesaria
const featureActivo = import.meta.env.VITE_FEATURE_FLAG === 'true' // Comparación de string, no booleano directo
```

Al igual que en Node.js, **todas** las variables de `.env` llegan como strings, sin importar cómo se vean escritas en el archivo — convertir explícitamente a número o booleano es responsabilidad del código, no algo que Vite haga automáticamente.

## 7.7 Prioridad entre Archivos `.env`

```text
.env.production.local  >  .env.production  >  .env.local  >  .env
                    (mayor prioridad)                    (menor prioridad)
```

Un valor definido en un archivo más específico (`.env.production.local`) sobrescribe al mismo valor definido en uno más genérico (`.env`) — permite tener valores base compartidos con overrides específicos por entorno o por máquina local.

## 7.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Exponer una variable al código del navegador | Prefijo `VITE_` en `.env` |
| Acceder a una variable de entorno en el código | `import.meta.env.VITE_NOMBRE` |
| Verificar si se está en desarrollo o producción | `import.meta.env.DEV` / `import.meta.env.PROD` |
| Usar configuración específica por entorno de despliegue | `.env.<modo>` + `--mode <modo>` |
| Tipar las variables propias del proyecto | Extender `ImportMetaEnv` en `vite-env.d.ts` |

## 7.9 Errores Comunes

- **Esperar que una variable sin prefijo `VITE_` esté disponible en el navegador**: es un comportamiento de seguridad intencional (7.2), no un bug — cualquier variable expuesta al cliente debe llevar ese prefijo explícitamente.
- **Guardar secretos reales con el prefijo `VITE_` pensando que estarán "ocultos"**: cualquier variable `VITE_*` termina literalmente en el bundle de JavaScript, legible por cualquiera que inspeccione el código del navegador — nunca usar este mecanismo para claves privadas o secretos de servidor.
- **Comparar un valor de `.env` como si fuera booleano/número nativo sin convertirlo**: todas las variables llegan como string (7.6) — `if (import.meta.env.VITE_FLAG)` siempre es `true` mientras el string no esté vacío, incluso si su valor literal es `"false"`.
