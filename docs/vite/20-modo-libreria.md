# Módulo 20: Modo Librería: Publicar un Paquete con Vite

Además de construir aplicaciones, Vite puede empaquetar una biblioteca reutilizable destinada a publicarse en NPM y consumirse desde otros proyectos — este módulo cubre el "modo librería" (`build.lib`), con requisitos distintos a los de una aplicación.

## 20.1 La Diferencia Fundamental: Aplicación vs Librería

```text
Aplicación: el bundle final se EJECUTA directamente en un navegador específico
Librería:   el bundle final se IMPORTA por el código de OTRO proyecto, con SU PROPIO bundler
```

Una librería no controla el entorno final donde se usará — no debe incluir sus dependencias dentro del bundle (deben quedar como dependencias externas que el proyecto consumidor resuelve por su cuenta), y típicamente necesita generarse en múltiples formatos (ESM, CommonJS) para máxima compatibilidad.

## 20.2 Configuración Básica de Modo Librería

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MiLibreria',
      fileName: 'mi-libreria',
    },
  },
})
```

```text
dist/
├── mi-libreria.js       (ESM)
├── mi-libreria.umd.cjs   (UMD, compatible con <script> directo y CommonJS)
```

`build.lib` cambia fundamentalmente el comportamiento de Rollup: en lugar de generar un bundle único orientado a una aplicación, genera múltiples formatos de distribución de un mismo punto de entrada.

## 20.3 Marcar Dependencias como Externas

```ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MiComponenteVue',
    },
    rollupOptions: {
      external: ['vue'],   // NO incluir Vue dentro del bundle de la librería
      output: {
        globals: {
          vue: 'Vue',        // Necesario solo para el formato UMD
        },
      },
    },
  },
})
```

Si la librería es un conjunto de componentes Vue, por ejemplo, **no** debe incluir Vue dentro de su propio bundle — el proyecto que consuma la librería ya tendrá su propia instancia de Vue, y empaquetarla dos veces produciría conflictos (el mismo problema de "múltiples instancias" mencionado en el Módulo 17.4) además de duplicar peso innecesariamente.

## 20.4 Múltiples Formatos de Salida

```ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MiLibreria',
      formats: ['es', 'cjs', 'umd'],
    },
  },
})
```

| Formato | Uso típico |
| :--- | :--- |
| `es` | Proyectos modernos con bundler propio (import/export nativo) |
| `cjs` | Proyectos Node.js más antiguos, o herramientas que aún esperan `require` |
| `umd` | Uso directo vía `<script>` en un navegador, sin ningún bundler |

## 20.5 Generar Declaraciones de Tipos (`.d.ts`)

```bash
npm install -D vite-plugin-dts
```

```ts
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: { lib: { /* ... */ } },
})
```

Vite en sí mismo no genera archivos de declaración de TypeScript (`.d.ts`) automáticamente — `vite-plugin-dts` cubre ese paso adicional, esencial para que cualquier consumidor de la librería escrito en TypeScript reciba autocompletado y verificación de tipos correctos.

## 20.6 `package.json` de una Librería Publicable

```json
{
  "name": "mi-libreria",
  "type": "module",
  "main": "./dist/mi-libreria.cjs",
  "module": "./dist/mi-libreria.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/mi-libreria.js",
      "require": "./dist/mi-libreria.cjs"
    }
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  }
}
```

`peerDependencies` (en lugar de `dependencies`) es la forma correcta de declarar Vue como requisito de la librería sin incluirlo en el bundle propio (consistente con 20.3) — le indica a NPM que el proyecto consumidor debe tener su propia instalación de esa dependencia.

## 20.7 Probar la Librería Localmente Antes de Publicar

```bash
npm link                    # Dentro del proyecto de la librería
cd ../otro-proyecto
npm link mi-libreria          # Usa la versión local en lugar de descargarla de NPM
```

Útil para verificar que la librería funciona correctamente como dependencia real de otro proyecto antes de publicarla en NPM — recordando el Módulo 17.3, es común necesitar `optimizeDeps.exclude` en el proyecto consumidor mientras se usa un paquete enlazado de esta forma.

## 20.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Empaquetar un proyecto para publicarlo como librería | `build.lib` |
| Evitar incluir una dependencia dentro del bundle | `rollupOptions.external` |
| Generar múltiples formatos (ESM, CJS, UMD) | `build.lib.formats` |
| Generar archivos de declaración de tipos | `vite-plugin-dts` |
| Probar la librería en otro proyecto antes de publicar | `npm link` |

## 20.9 Errores Comunes

- **Incluir dependencias del framework dentro del bundle de una librería de componentes**: produce conflictos de "múltiples instancias" en cualquier proyecto que la consuma — siempre marcar el framework como `external` y `peerDependency`.
- **Olvidar generar declaraciones de tipos para una librería en TypeScript**: obliga a cualquier consumidor en TypeScript a lidiar con tipos `any` o declarar los tipos manualmente por su cuenta.
- **Publicar solo en formato ESM sin considerar consumidores CommonJS**: proyectos Node.js más antiguos o ciertas herramientas de build pueden no soportar ESM puro — ofrecer también un formato `cjs` amplía significativamente la compatibilidad de la librería publicada.
