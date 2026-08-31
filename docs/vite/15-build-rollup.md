# Módulo 15: El Proceso de Build con Rollup

Con el desarrollo ya cubierto en profundidad, este módulo se enfoca exclusivamente en `vite build` — qué genera, cómo configurarlo, y las opciones más relevantes de la fase de producción.

## 15.1 El Comando Básico

```bash
npm run build
```

```text
dist/
├── index.html
├── assets/
│   ├── index-a1b2c3d4.js
│   ├── index-e5f6g7h8.css
│   └── logo-i9j0k1l2.png
```

`vite build` invoca a Rollup internamente (Módulo 5.3) para generar un bundle optimizado: minificado, con tree-shaking aplicado, y con hash de contenido en los nombres de archivo (Módulo 8.3) para habilitar caché de navegador agresiva.

## 15.2 Configurar el Directorio de Salida

```ts
export default defineConfig({
  build: {
    outDir: 'build',       // Por defecto: "dist"
    emptyOutDir: true,       // Limpiar el directorio antes de cada build
  },
})
```

## 15.3 `base`: la Ruta Pública del Despliegue

```ts
export default defineConfig({
  base: '/mi-app/',   // Si el sitio se sirve desde ejemplo.com/mi-app/, no desde la raíz
})
```

```html
<!-- Todas las referencias en el HTML final se ajustan automáticamente -->
<script type="module" src="/mi-app/assets/index-a1b2c3d4.js"></script>
```

`base` es crítico al desplegar en un subdirectorio (común en GitHub Pages, por ejemplo, `usuario.github.io/nombre-repo/`) — sin configurarlo correctamente, todas las rutas de assets generadas apuntarían incorrectamente a la raíz del dominio en lugar del subdirectorio real donde vive la aplicación.

## 15.4 Sourcemaps en Producción

```ts
export default defineConfig({
  build: {
    sourcemap: true,   // Genera archivos .map junto a cada bundle
  },
})
```

Los sourcemaps permiten depurar código minificado de producción mostrando el código fuente original en las herramientas de desarrollador del navegador (o en servicios de monitoreo de errores como Sentry) — el costo es un aumento en el tamaño de los artefactos generados y, potencialmente, exponer el código fuente si los `.map` se sirven públicamente sin ninguna restricción.

## 15.5 Minificación: esbuild vs Terser

```ts
export default defineConfig({
  build: {
    minify: 'esbuild', // Por defecto: rápido
    // minify: 'terser', // Alternativa: minificación ligeramente más agresiva, más lenta
  },
})
```

```bash
npm install -D terser   # Requerido solo si se elige "terser" explícitamente
```

esbuild es la opción por defecto para minificación (consistente con su uso en el resto del pipeline de desarrollo) — Terser sigue disponible como alternativa para casos específicos donde su algoritmo de minificación produce un resultado marginalmente más pequeño, a costa de un build considerablemente más lento.

## 15.6 Target del Build: Compatibilidad de Navegadores

```ts
export default defineConfig({
  build: {
    target: 'es2020',   // Por defecto: 'modules' (navegadores modernos con soporte de ESM)
  },
})
```

Por defecto, Vite genera código asumiendo navegadores modernos con soporte completo de módulos ES — para soportar navegadores más antiguos que no cumplen ese requisito, `target` puede ajustarse a una versión de ECMAScript específica, o combinarse con `@vitejs/plugin-legacy` (15.8) para una compatibilidad más amplia.

## 15.7 Opciones de Rollup Directamente

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
      },
    },
  },
})
```

`rollupOptions` expone la configuración nativa de Rollup directamente, para casos donde las opciones de más alto nivel de Vite no cubren una necesidad específica — `manualChunks` se retoma en profundidad en el Módulo 16 (code splitting).

## 15.8 Soporte para Navegadores Legacy

```bash
npm install -D @vitejs/plugin-legacy
```

```ts
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    legacy({ targets: ['defaults', 'not IE 11'] }),
  ],
})
```

Este plugin genera **dos** versiones del bundle: una moderna (ESM, pequeña) y una versión transpilada adicional con polyfills para navegadores antiguos — usando `<script type="module">` / `<script nomodule>` para que cada navegador cargue automáticamente la versión que le corresponde, sin penalizar a los navegadores modernos con el peso de los polyfills innecesarios.

## 15.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Generar el bundle de producción | `npm run build` (ejecuta `vite build`) |
| Desplegar en un subdirectorio, no en la raíz | `base: '/subdirectorio/'` |
| Depurar código minificado en producción | `build.sourcemap: true` |
| Configurar opciones avanzadas de Rollup directamente | `build.rollupOptions` |
| Soportar navegadores antiguos sin soporte de ESM | `@vitejs/plugin-legacy` |

## 15.10 Errores Comunes

- **Olvidar configurar `base` al desplegar en un subdirectorio**: produce un sitio con todos los assets rotos (rutas 404), pese a que el build se generó sin ningún error aparente.
- **Habilitar sourcemaps de producción sin restringir su acceso público**: puede exponer el código fuente completo de la aplicación a cualquier visitante que inspeccione la red del navegador, dependiendo de cómo se sirvan los archivos `.map`.
- **Asumir que el bundle por defecto funciona en cualquier navegador**: sin `@vitejs/plugin-legacy`, el build asume soporte de ESM nativo — proyectos que deben soportar navegadores realmente antiguos necesitan esa configuración adicional explícita.
