# Módulo 2: Configuración de un Proyecto Node.js con TypeScript

Node.js no entiende TypeScript de forma nativa (aunque versiones muy recientes tienen soporte experimental limitado) — un proyecto real necesita un paso de compilación o un ejecutor que lo maneje. Este módulo cubre la configuración estándar de la industria para un proyecto backend con TypeScript.

## 2.1 Inicializar el Proyecto

```bash
mkdir mi-api && cd mi-api
npm init -y
```

```json
// package.json generado
{
  "name": "mi-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## 2.2 Instalar TypeScript y Tipos de Node

```bash
npm install -D typescript @types/node tsx
```

* `typescript`: el compilador.
* `@types/node`: las definiciones de tipos para las APIs nativas de Node (`fs`, `path`, `process`...) — sin este paquete, TypeScript no reconoce esas APIs.
* `tsx`: un ejecutor que corre archivos TypeScript directamente en desarrollo, sin necesitar compilar manualmente en cada cambio.

## 2.3 Configurar `tsconfig.json`

```bash
npx tsc --init
```

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

* `"module": "NodeNext"` y `"moduleResolution": "NodeNext"` alinean el sistema de módulos de TypeScript con cómo Node.js realmente resuelve imports (visto a fondo en el Módulo 3).
* `"strict": true` es igual de importante en backend que en frontend (ya establecido en la sección de TypeScript de este sitio) — detecta errores de tipado antes de que lleguen a producción.
* `outDir`/`rootDir` separan el código fuente (`src/`) del código compilado (`dist/`).

## 2.4 Estructura Inicial del Proyecto

```text
mi-api/
├── src/
│   └── index.ts
├── dist/                  # Generado por el build, no se versiona
├── node_modules/
├── package.json
├── tsconfig.json
└── .gitignore
```

```typescript
// src/index.ts
console.log('Servidor iniciando...')
```

## 2.5 Scripts de `package.json`

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

* `npm run dev`: ejecuta el proyecto en desarrollo con `tsx`, recompilando automáticamente en cada cambio (`watch`) — sin necesitar reiniciar manualmente.
* `npm run build`: compila TypeScript a JavaScript plano en `dist/`.
* `npm start`: ejecuta el JavaScript ya compilado — el comando que se usa en producción, nunca `tsx` directamente.

## 2.6 `.gitignore` Base

```text
node_modules/
dist/
.env
*.log
```

`.env` (Módulo 5) nunca debe versionarse porque contiene credenciales y configuración sensible específica de cada entorno.

## 2.7 ESLint + Prettier para Backend

```bash
npm install -D eslint prettier eslint-config-prettier
npx eslint --init
```

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
```

La misma disciplina de linting/formateo ya establecida en los proyectos de frontend de este sitio aplica igual en backend — consistencia de estilo entre todo el equipo, detectada automáticamente antes de cada commit.

## 2.8 Variables de Entorno desde el Inicio

```bash
npm install dotenv
```

```typescript
// src/index.ts
import 'dotenv/config'

console.log('Puerto configurado:', process.env.PORT)
```

```text
# .env
PORT=3000
NODE_ENV=development
```

Se retoma a fondo en el Módulo 5 — vale la pena configurarlo desde el primer commit del proyecto, ya que credenciales de base de datos y claves de API (Módulos 13, 11) siempre deben vivir fuera del código versionado.

## 2.9 Verificar que Todo Funciona

```bash
npm run dev
# "Servidor iniciando..." debería aparecer en la consola
```

```bash
npm run build && npm start
# Debe compilar sin errores y ejecutar el JavaScript resultante correctamente
```

## 2.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Tipos para las APIs nativas de Node | `@types/node` |
| Ejecutar TypeScript directamente en desarrollo | `tsx` |
| Configuración base de TypeScript para Node | `tsc --init` + ajustar `module`/`moduleResolution` a `NodeNext` |
| Recompilar automáticamente en cada cambio | `tsx watch src/index.ts` |
| Variables de configuración sensibles | Un archivo `.env`, nunca versionado |

## 2.11 Errores Comunes

- **Olvidar `@types/node`**: TypeScript marca error en cualquier uso de `fs`, `path`, `process` u otras APIs nativas de Node, aunque el código sea correcto.
- **Ejecutar `tsx` directamente en producción en lugar del build compilado**: `tsx` es una herramienta de desarrollo; producción debe correr el JavaScript ya compilado con `node dist/index.js` para mejor rendimiento y estabilidad.
- **Versionar el archivo `.env`**: expone credenciales reales (contraseñas de base de datos, claves de API) en el historial de Git, incluso si se elimina después — el historial conserva la versión filtrada.
