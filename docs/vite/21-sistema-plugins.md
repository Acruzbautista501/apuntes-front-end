# Módulo 21: El Sistema de Plugins de Vite

Prácticamente toda funcionalidad que no viene incorporada en el núcleo de Vite (soporte de framework, PWA, compresión, etc.) se agrega mediante plugins. Este módulo cubre cómo funcionan, se descubren y se configuran, antes de escribir uno propio en el Módulo 22.

## 21.1 Los Plugins de Vite Extienden Rollup

```text
Plugin de Vite = Plugin de Rollup + hooks ADICIONALES específicos de Vite
```

El sistema de plugins de Vite está construido directamente sobre la API de plugins de Rollup — cualquier plugin de Rollup compatible funciona (con limitaciones) también en Vite, y Vite añade hooks adicionales propios (relacionados con el servidor de desarrollo, HMR) que Rollup no tiene, ya que Rollup nunca opera un servidor de desarrollo.

## 21.2 Instalar y Usar un Plugin

```bash
npm install -D vite-plugin-pwa
```

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({ registerType: 'autoUpdate' }),
  ],
})
```

La mayoría de los plugins de la comunidad siguen la convención de nombre `vite-plugin-*` — se importan como funciones que devuelven la configuración del plugin, invocadas dentro del array `plugins` de `vite.config.ts`.

## 21.3 Plugins Oficiales vs de la Comunidad

| Categoría | Ejemplos |
| :--- | :--- |
| Oficiales (`@vitejs/plugin-*`) | `plugin-vue`, `plugin-react`, `plugin-legacy` |
| Comunidad (`vite-plugin-*`) | `vite-plugin-pwa`, `vite-plugin-dts`, `vite-plugin-checker` |

Los plugins oficiales cubren la integración de frameworks principales y funcionalidad considerada de primera necesidad — el ecosistema de plugins de la comunidad, publicado libremente en NPM, cubre prácticamente cualquier necesidad adicional (compresión de assets, generación de sitemaps, integración con CMS, entre muchos otros).

## 21.4 Los Hooks Más Comunes de un Plugin

```ts
function miPlugin() {
  return {
    name: 'mi-plugin',
    transform(codigo, id) {
      // Se ejecuta por cada módulo, permite modificar su contenido
    },
    resolveId(fuente) {
      // Personaliza cómo se resuelve la ruta de un import
    },
    load(id) {
      // Permite proveer el contenido de un módulo directamente
    },
  }
}
```

| Hook | Cuándo se ejecuta |
| :--- | :--- |
| `resolveId` | Al resolver la ruta de un import, antes de cargar el archivo |
| `load` | Al cargar el contenido de un módulo |
| `transform` | Al transformar el contenido de un módulo ya cargado |

Se profundiza en cada uno con ejemplos prácticos completos en el Módulo 22.

## 21.5 Hooks Exclusivos de Vite (no Existen en Rollup Puro)

```ts
function miPlugin() {
  return {
    name: 'mi-plugin',
    configureServer(servidor) {
      // Personalizar el servidor de desarrollo (agregar middleware, Módulo 23)
    },
    handleHotUpdate(contexto) {
      // Personalizar el comportamiento de HMR para archivos específicos
    },
  }
}
```

Estos hooks solo tienen sentido en el contexto de un servidor de desarrollo en ejecución — no existen en la API de Rollup puro, que nunca opera de esa forma, siendo exclusivamente una herramienta de build.

## 21.6 Aplicar un Plugin Solo en Desarrollo o Solo en Build

```ts
function miPlugin() {
  return {
    name: 'mi-plugin',
    apply: 'build', // 'serve' (desarrollo) | 'build' (producción) | una función condicional
    transform(codigo) {
      // ...
    },
  }
}
```

Algunos plugins solo tienen sentido en un contexto específico (por ejemplo, minificación adicional que solo debería aplicarse al build final, nunca en desarrollo) — `apply` restringe cuándo se activa el plugin completo.

## 21.7 Orden de Ejecución de Plugins

```ts
export default defineConfig({
  plugins: [
    vue(),
    miPluginPersonalizado({ enforce: 'pre' }), // Se ejecuta ANTES que los plugins normales
  ],
})
```

```text
enforce: 'pre'  → antes de los plugins del núcleo de Vite
(sin enforce)     → orden normal, según la posición en el array
enforce: 'post' → después de los plugins del núcleo de Vite
```

El orden importa cuando varios plugins transforman el mismo tipo de archivo — `enforce` permite ajustar la prioridad relativa cuando el orden natural del array no es suficiente para lograr el resultado esperado.

## 21.8 Buscar Plugins: el Directorio Oficial

```text
https://vite-plugin.dev  — directorio curado de plugins de la comunidad, categorizado y buscable
```

Antes de escribir un plugin propio (Módulo 22) para una necesidad común, vale la pena verificar si ya existe uno mantenido por la comunidad que la resuelva — el ecosistema de plugins de Vite es extenso y cubre la gran mayoría de casos de uso habituales.

## 21.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Agregar funcionalidad de terceros al proyecto | Instalar y registrar un plugin en el array `plugins` |
| Modificar el contenido de módulos específicos | El hook `transform` de un plugin |
| Personalizar el servidor de desarrollo | El hook `configureServer`, exclusivo de Vite |
| Que un plugin solo actúe en desarrollo o solo en build | La opción `apply` |
| Ajustar el orden de ejecución entre plugins | La opción `enforce` |

## 21.10 Errores Comunes

- **Asumir que cualquier plugin de Rollup funciona sin modificación en Vite**: la compatibilidad es amplia pero no total — algunos plugins de Rollup asumen un contexto de build único que no siempre se traduce correctamente al modelo de desarrollo de Vite.
- **Escribir un plugin personalizado para una necesidad ya cubierta por el ecosistema existente**: revisar el directorio de plugins (21.8) antes de invertir tiempo en una solución propia que probablemente ya existe, mantenida y probada por la comunidad.
- **No usar `apply` en un plugin que solo debería activarse en un contexto específico**: puede causar comportamiento inesperado o errores al ejecutarse en un momento (desarrollo vs build) para el que no fue diseñado.
