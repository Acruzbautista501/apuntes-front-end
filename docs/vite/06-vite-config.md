# Módulo 6: El Archivo de Configuración vite.config

Con los fundamentos ya cubiertos, este módulo profundiza en `vite.config.ts` — el punto central donde se personaliza el comportamiento completo de Vite, desde plugins hasta el comportamiento del servidor y el build.

## 6.1 La Estructura Básica

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  // Configuración aquí
})
```

`defineConfig` no es estrictamente necesario (un objeto simple también funciona), pero proporciona autocompletado e inferencia de tipos en el editor — su uso es la convención estándar en cualquier proyecto Vite moderno.

## 6.2 Configuración como Función: Acceso al Modo y Comando

```ts
export default defineConfig(({ command, mode }) => {
  return {
    define: {
      __API_URL__: mode === 'production'
        ? JSON.stringify('https://api.produccion.com')
        : JSON.stringify('http://localhost:4000'),
    },
  }
})
```

`command` es `'serve'` durante desarrollo o `'build'` durante el build de producción; `mode` corresponde al modo activo (`development`, `production`, o cualquier modo personalizado, retomado en el Módulo 7) — usar la forma de función permite adaptar la configuración dinámicamente según el contexto de ejecución.

## 6.3 Las Secciones Principales de Configuración

```ts
export default defineConfig({
  plugins: [],       // Módulo 21-22
  resolve: {},         // Módulo 10
  css: {},              // Módulo 9
  server: {},            // Módulo 4
  build: {},              // Módulo 15
  optimizeDeps: {},        // Módulo 17
  define: {},               // Constantes globales de reemplazo en build time
})
```

## 6.4 `define`: Reemplazo de Constantes en Tiempo de Build

```ts
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.4.0'),
  },
})
```

```ts
// En cualquier archivo del código fuente
console.log(__APP_VERSION__) // Se reemplaza LITERALMENTE por "1.4.0" durante el build
```

A diferencia de una variable de entorno normal (Módulo 7), un valor definido con `define` se sustituye textualmente en el código durante el build — útil para constantes que deben "hornearse" directamente en el bundle final, sin ninguna referencia a `process.env` ni `import.meta.env` en tiempo de ejecución.

## 6.5 Extender la Configuración Base según el Entorno

```ts
export default defineConfig(({ mode }) => {
  const configBase = {
    plugins: [vue()],
  }

  if (mode === 'production') {
    return {
      ...configBase,
      build: { sourcemap: false },
    }
  }

  return configBase
})
```

## 6.6 Archivos de Configuración Alternativos

```bash
vite --config vite.config.custom.ts
```

```text
vite.config.js
vite.config.ts
vite.config.mjs
vite.config.mts
```

Vite busca automáticamente uno de estos nombres en la raíz del proyecto — el flag `--config` permite especificar una ruta distinta, útil en configuraciones de monorepo (Módulo 26) con múltiples proyectos Vite que comparten cierta lógica de configuración.

## 6.7 Configuración Condicional para SSR

```ts
export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      rollupOptions: isSsrBuild
        ? { input: 'src/entry-server.ts' }
        : { input: 'index.html' },
    },
  }
})
```

`isSsrBuild` (disponible desde Vite 5+) distingue si la ejecución actual corresponde al build del cliente o al build del servidor en un proyecto con renderizado del lado del servidor — se retoma en profundidad en el Módulo 24.

## 6.8 TypeScript en la Configuración: Tipado Completo

```ts
import { defineConfig, type UserConfig } from 'vite'

const config: UserConfig = defineConfig({
  server: { port: 3000 },
})

export default config
```

Usar `vite.config.ts` (en lugar de `.js`) habilita verificación de tipos y autocompletado sobre **todas** las opciones disponibles de configuración — especialmente útil al configurar plugins de terceros, cuyas opciones también suelen venir tipadas.

## 6.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Adaptar la configuración según desarrollo/producción | La forma de función: `defineConfig(({ mode }) => ...)` |
| Insertar una constante fija en el bundle final | `define: { __CONSTANTE__: JSON.stringify(valor) }` |
| Usar un archivo de configuración con nombre distinto | `vite --config <ruta>` |
| Configuración específica para el build de SSR | `isSsrBuild` dentro de la forma de función |

## 6.10 Errores Comunes

- **Usar `define` para valores que deberían ser variables de entorno normales**: `define` sustituye texto literal en tiempo de build — para configuración que varía por despliegue sin recompilar, las variables de entorno de Vite (Módulo 7) son la herramienta correcta.
- **Olvidar `JSON.stringify()` al usar `define`**: sin ello, el valor se trata como una expresión JavaScript literal en lugar de un string, un error común: `define: { __VERSION__: '1.0.0' }` (incorrecto, `1.0.0` no es JS válido) vs `JSON.stringify('1.0.0')` (correcto).
- **Colocar lógica pesada o asíncrona directamente en el cuerpo de `vite.config.ts`**: el archivo se ejecuta en cada arranque del servidor y del build — cualquier operación lenta ahí afecta directamente los tiempos de arranque que Vite está diseñado para minimizar.
