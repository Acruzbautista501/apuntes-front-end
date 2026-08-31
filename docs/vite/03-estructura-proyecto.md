# Módulo 3: Estructura de un Proyecto Vite

Este módulo recorre la estructura de archivos que genera el andamiaje oficial de Vite, explicando el propósito de cada pieza antes de empezar a modificarlas.

## 3.1 La Estructura Generada (Ejemplo con Vue + TypeScript)

```text
mi-proyecto/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 3.2 `index.html`: el Punto de Entrada Real

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Mi Proyecto</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

A diferencia de herramientas anteriores (donde `index.html` era generado o vivía en `public/`, tratado como un archivo estático simple), en Vite `index.html` es el **punto de entrada real** del proceso de build — vive en la raíz del proyecto, y el `<script type="module" src="...">` que apunta a `main.ts` es lo que Vite usa para descubrir el grafo completo de dependencias de la aplicación.

## 3.3 `src/main.ts`: el Punto de Entrada de JavaScript

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')
```

Desde aquí arranca toda la aplicación — Vite sigue cada `import` de este archivo (y de los archivos que este importa, recursivamente) para construir el grafo de módulos que sirve en desarrollo y empaqueta en producción.

## 3.4 `public/`: Assets Servidos sin Procesar

```text
public/
├── favicon.svg
└── robots.txt
```

Cualquier archivo dentro de `public/` se copia **tal cual**, sin ningún procesamiento, directamente a la raíz del build final — a diferencia de los assets importados desde `src/` (Módulo 8), que sí pasan por el pipeline de procesamiento de Vite (hash de nombre de archivo, optimización). `public/` es apropiado para archivos que deben mantener exactamente su nombre y ruta (como `favicon.ico` o `robots.txt`, referenciados por convención externa).

## 3.5 `vite.config.ts`: la Configuración del Proyecto

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

Cubierto en profundidad en el Módulo 6 — es donde se personaliza prácticamente cualquier aspecto del comportamiento de Vite: plugins, alias de rutas, opciones del servidor, configuración del build.

## 3.6 `package.json`: Dependencias y Scripts

```json
{
  "name": "mi-proyecto",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.2.0"
  }
}
```

El campo `"type": "module"` indica que el proyecto usa módulos ES de forma nativa en Node.js (relevante para el propio `vite.config.ts` y cualquier script auxiliar) — una convención estándar en proyectos Vite modernos, coherente con la filosofía de ESM nativo cubierta en el Módulo 1.2.

## 3.7 Archivos Específicos por Framework

```text
# Vue: componentes .vue (Módulo 12)
src/App.vue

# React: componentes .tsx/.jsx (Módulo 13)
src/App.tsx

# Svelte: componentes .svelte (Módulo 14)
src/App.svelte
```

La extensión de los componentes cambia según el framework elegido en el andamiaje — Vite reconoce cada una a través del plugin oficial correspondiente (`@vitejs/plugin-vue`, `@vitejs/plugin-react`, etc.), que le enseña a procesar ese formato de archivo específico.

## 3.8 `tsconfig.json`: Configuración de TypeScript (si Aplica)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

Con una plantilla `-ts`, el andamiaje genera también un `tsconfig.json` — importante notar que Vite **no usa** este archivo para transformar TypeScript (esa transformación la hace esbuild directamente, ignorando la mayoría de las opciones del compilador); `tsc` sigue siendo necesario solo para la **verificación de tipos**, típicamente ejecutado por separado en el script `build` o en CI, no durante `dev`.

## 3.9 Tabla de Referencia Rápida

| Archivo/Carpeta | Propósito |
| :--- | :--- |
| `index.html` | Punto de entrada real del build, no un archivo estático simple |
| `src/main.ts` | Punto de entrada de JavaScript, donde arranca la aplicación |
| `public/` | Assets copiados sin procesar, tal cual, a la raíz del build |
| `vite.config.ts` | Configuración de plugins, alias, servidor y build (Módulo 6) |
| `src/assets/` | Assets importados desde el código, sí procesados por Vite (Módulo 8) |

## 3.10 Errores Comunes

- **Confundir `public/` con `src/assets/`**: archivos en `public/` nunca pasan por el procesamiento de Vite (sin hash de caché, sin optimización) — usar `src/assets/` para cualquier archivo que deba beneficiarse de esas optimizaciones (Módulo 8).
- **Esperar que `tsconfig.json` controle cómo Vite transforma el código**: esbuild transforma TypeScript directamente, ignorando gran parte de esa configuración — `tsconfig.json` afecta principalmente al editor y a la verificación de tipos separada (`vue-tsc`, `tsc`), no a la transformación real durante `dev`/`build`.
- **Modificar `index.html` esperando que se comporte como un archivo estático aislado**: es parte activa del grafo de módulos de Vite — cambios ahí (como agregar un nuevo `<script type="module">`) afectan directamente qué código se incluye en el build.
