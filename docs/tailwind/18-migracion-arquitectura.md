# MÓDULO 18 — Migración de v3 a v4, Capas CSS e Integración con Frameworks

Este módulo es para dos escenarios muy concretos: (1) tienes un proyecto real construido en Tailwind 3 y necesitas llevarlo a v4 sin romper nada, y (2) necesitas integrar Tailwind 4 en un framework específico más allá de lo básico que viste en el Módulo 2, entendiendo qué pasa "debajo del capó" en cada uno.

## 18.1 Migrar un Proyecto de v3 a v4

Tailwind ofrece una herramienta automatizada, pero entender **qué** cambia manualmente es lo que separa una migración segura de una llena de sorpresas visuales.

### Paso 1: La herramienta oficial de migración

```bash
npx @tailwindcss/upgrade
```

Esta herramienta analiza tu proyecto y hace la mayor parte del trabajo pesado: convierte tu `tailwind.config.js` a bloques `@theme` en CSS, actualiza tus dependencias y renombra clases obsoletas en tus archivos de plantilla.

### Paso 2: Cambios que debes revisar manualmente

La automatización no es perfecta. Estos son los cambios de comportamiento más importantes entre v3 y v4:

| Cambio | v3 (comportamiento anterior) | v4 (comportamiento nuevo) |
| :--- | :--- | :--- |
| **Color de borde por defecto** | `gray-200` | `currentColor` (hereda el color de texto) — debes especificar `border-gray-200` explícitamente si lo necesitabas. |
| **Anillo por defecto (`ring`)** | 3px, azul (`blue-500`) | 1px, `currentColor`. Si dependías del anillo azul grueso por defecto, ahora debes escribirlo: `ring-2 ring-blue-500`. |
| **Prefijos personalizados** | `prefix: 'tw-'` en config | Se declara como variante en CSS: `@import "tailwindcss" prefix(tw);` |
| **`@tailwind base/components/utilities`** | 3 directivas separadas | Una sola línea: `@import "tailwindcss";` |
| **Espaciado con variables** | Valores fijos en el config | Todo pasa a variables CSS nativas (`--spacing-*`), lo que puede cambiar el cálculo si tenías overrides parciales. |
| **Soporte de navegadores** | Amplio (incluía navegadores antiguos) | Requiere Safari 16.4+, Chrome 111+, Firefox 128+ (usa `@property` y `color-mix()` nativos). |

### Paso 3: Verificación visual

Después de migrar, revisa especialmente: bordes que "desaparecieron" (por el cambio de color por defecto), anillos de foco más delgados de lo esperado, y cualquier valor que usaras directamente desde `theme()` en JavaScript (por ejemplo, en un archivo de configuración de gráficas), ya que ahora esos valores viven como variables CSS (`var(--color-blue-500)`) en lugar de en un objeto JS importable.

::: tip 💡 Consejo del Diseñador Frontend:
Nunca migres directamente sobre la rama `main`. Crea una rama `migracion-tailwind-4`, corre la herramienta, y dedica al menos una hora a navegar visualmente cada pantalla de la aplicación comparando capturas de antes/después. Los cambios de `border` y `ring` son sutiles pero se notan en producción si no los revisas.
:::

## 18.2 Capas CSS con `@layer`

Cuando combinas Tailwind con CSS personalizado (por ejemplo, estilos de una librería externa, o clases legadas de un proyecto que migras poco a poco), el orden de las reglas importa muchísimo: si tu CSS personalizado se carga después de las utilidades de Tailwind, puede sobrescribirlas sin que tú lo pidas, rompiendo el principio de que "la última utilidad en el HTML gana".

`@layer` resuelve esto organizando el CSS en capas con prioridad explícita, sin importar el orden en que se escribieron los archivos.

```css
@import "tailwindcss";

@layer base {
  /* Estilos base, como resets tipográficos. Prioridad más baja. */
  h1 {
    font-weight: 700;
  }
}

@layer components {
  /* Clases compuestas reutilizables, si de verdad las necesitas (ver Módulo 13). */
  .badge-live {
    @apply bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold;
  }
}

/* Las utilidades de Tailwind (capa "utilities") siempre ganan sobre "base" y "components",
   sin importar el orden en que aparezcan los archivos CSS. */
```

::: tip 💡 Consejo del Diseñador Frontend:
Esta es la razón técnica por la que, en el Módulo 13, evitamos `@apply` para construir componentes: cualquier cosa en `@layer components` tiene *menos* prioridad que una utilidad suelta en el HTML. Si un compañero de equipo escribe `<div class="badge-live bg-blue-500">`, el `bg-blue-500` ganará silenciosamente sobre tu `badge-live`, y depurar ese conflicto es más difícil que simplemente no haber creado la clase compuesta.
:::

## 18.3 Organización de Proyectos Grandes (Monorepo y Multi-App)

El Módulo 13.4 cubrió la arquitectura de carpetas dentro de **una sola** aplicación. Cuando tienes varios proyectos que deben compartir la misma identidad visual (por ejemplo, tu aplicación tiene una app web y un panel de administración separado), necesitas centralizar el `@theme`.

### Patrón: Paquete de Tema Compartido

```text
packages/
├── design-tokens/
│   └── theme.css          # Un único @theme, fuente de verdad de toda la marca
├── app-web/
│   └── src/assets/index.css   # @import "tailwindcss"; @import "@repo/design-tokens/theme.css";
└── app-admin/
    └── src/assets/index.css   # @import "tailwindcss"; @import "@repo/design-tokens/theme.css";
```

Como en v4 el tema **es** CSS, compartirlo entre proyectos es tan simple como importar un archivo `.css` publicado como paquete interno (via npm workspaces, pnpm workspaces, o incluso una ruta relativa en un monorepo simple). Ya no necesitas exportar un objeto de JavaScript (`module.exports = theme`) ni preocuparte de que dos configs de Tailwind diverjan silenciosamente.

## 18.4 Integración Profunda por Framework

### React (Vite)

```bash
npm install tailwindcss @tailwindcss/vite
```
El plugin de Vite se encarga del escaneo. React no necesita nada especial más allá de eso; las clases funcionan igual en JSX que en HTML plano.

### Next.js (App Router)

```bash
npm install tailwindcss @tailwindcss/postcss
```
Next usa PostCSS internamente en lugar del plugin de Vite. Debes crear `postcss.config.mjs`:
```javascript
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```
Detalle importante: Next.js pre-renderiza en el servidor (SSR/RSC). El CSS generado por Tailwind es estático en build time para las rutas estáticas, así que el rendimiento de Oxide se aprovecha completamente durante `next build`.

### Vue 3 + Vite

Idéntico al caso general de Vite (Módulo 2), con un detalle: si usas `<style scoped>` dentro de un `.vue` junto con `@apply`, recuerda que el motor de Tailwind necesita ver ese bloque durante el escaneo; esto funciona automáticamente con el plugin de Vite sin configuración adicional.

### Astro

```bash
npx astro add tailwind
```
El comando oficial de Astro configura automáticamente el `@tailwindcss/vite` dentro de `astro.config.mjs`. Astro es especialmente compatible con la filosofía de v4 porque, al enviar cero JavaScript por defecto ("Islands Architecture"), el CSS generado por Tailwind es prácticamente el único costo de carga de una página estática.

### Nuxt 3

```bash
npm install -D @nuxtjs/tailwindcss
```
El módulo oficial de Nuxt detecta automáticamente si tienes un archivo `@theme`; no necesitas configurar rutas de contenido manualmente, igual que en el resto del ecosistema v4.

### Tabla Resumen

| Framework | Mecanismo de integración | Particularidad |
| :--- | :--- | :--- |
| React + Vite | `@tailwindcss/vite` | Ninguna, el caso más simple. |
| Next.js | `@tailwindcss/postcss` | Usa PostCSS, no el plugin de Vite. |
| Vue 3 + Vite | `@tailwindcss/vite` | Compatible con `<style scoped>` + `@apply`. |
| Astro | `npx astro add tailwind` | Se integra en la arquitectura de Islands. |
| Nuxt 3 | `@nuxtjs/tailwindcss` | Detección automática de `@theme`. |

::: tip 💡 Consejo del Diseñador Frontend:
Independientemente del framework, el concepto central no cambia: **el tema vive en CSS, no en JavaScript**. Una vez que interiorizas esto, moverte entre React, Vue o Astro con Tailwind 4 se siente prácticamente idéntico; la única diferencia real es *cómo* cada build tool le entrega tu CSS al navegador.
:::
