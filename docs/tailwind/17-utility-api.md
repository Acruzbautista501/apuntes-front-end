# MÓDULO 17 — Extendiendo Tailwind: Las Directivas `@utility` y `@custom-variant`

Hasta el Módulo 12 aprendiste a personalizar **valores de diseño** (colores, espaciados, fuentes) mediante `@theme`. Pero, ¿qué pasa cuando necesitas una **clase de utilidad completamente nueva** que Tailwind no ofrece, o una **variante personalizada** (como `hover:` o `disabled:`) que no existe por defecto? En Tailwind 3, esto requería configurar el *Plugin API* de JavaScript dentro de `tailwind.config.js`. En Tailwind 4, todo se resuelve con CSS puro, usando las directivas `@utility` y `@custom-variant`.

> **`@variant` vs. `@custom-variant`, para no confundirlas:** `@variant` se usa **dentro** de tu propio CSS para *aplicar* un variant que ya existe (ej. `.mi-clase { @variant dark { color: white; } }`). La directiva que **crea** un variant nuevo, que es de lo que trata este módulo, es `@custom-variant`.

## 17.1 El Problema que Resuelven

Piensa en una utilidad muy común en dashboards: ocultar la barra de scroll pero mantener el scroll funcional. Tailwind no trae esto por defecto. Antes de `@utility`, tenías dos malas opciones:

1. Escribir CSS tradicional en un archivo aparte (`.scrollbar-hidden { ... }`), perdiendo la ventaja de que la clase se purgue automáticamente si no se usa.
2. Configurar un plugin de JavaScript (`plugin(function ({ addUtilities }) { ... })`), un proceso verboso que rompe con la filosofía "todo vive en el CSS" de v4.

## 17.2 Crear Utilidades Personalizadas con `@utility`

La directiva `@utility` registra una nueva clase directamente en el motor de Tailwind, con todos los beneficios nativos: se purga si no se usa, funciona con variantes (`hover:`, `md:`, `dark:`) automáticamente, y aparece en el autocompletado de tu editor.

### Ejemplo 1: Utilidad estática (sin valores variables)

```css
@import "tailwindcss";

@utility scrollbar-hidden {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

```html
<div class="scrollbar-hidden overflow-x-auto flex gap-4">
  <!-- Carrusel de escudos de equipos, sin scrollbar visible pero desplazable -->
</div>
```

Fíjate que, al ser una utilidad registrada de verdad (no una clase CSS suelta), puedes combinarla con variantes sin ningún trabajo extra: `md:scrollbar-hidden` funciona automáticamente.

### Ejemplo 2: Utilidad Funcional (con valores dinámicos)

`@utility` también soporta un comodín (`*` o `--value()`) para crear una familia completa de utilidades a partir de un solo bloque, igual que `p-*` o `w-*` funcionan internamente.

```css
@utility text-shadow-* {
  text-shadow: --value(--text-shadow-*, [length]);
}

@theme {
  --text-shadow-sm: 1px 1px 2px rgb(0 0 0 / 0.2);
  --text-shadow-lg: 3px 3px 6px rgb(0 0 0 / 0.4);
}
```

```html
<h1 class="text-shadow-lg">Marcador Final: 3 - 1</h1>
```

::: tip 💡 Consejo del Diseñador Frontend:
Antes de crear una `@utility` nueva, pregúntate si el problema se puede resolver con `@theme` (Módulo 12). Si solo necesitas *un valor nuevo* de una propiedad que Tailwind ya soporta (un color, un espaciado), usa `@theme`. Reserva `@utility` para cuando necesitas una **propiedad CSS que Tailwind no expone en absoluto**, como `scrollbar-width` o `mask-composite`.
:::

## 17.3 Crear Variantes Personalizadas con `@custom-variant`

Así como `@utility` crea clases nuevas, `@custom-variant` crea **prefijos condicionales** nuevos, análogos a `hover:` o `dark:`, pero definidos por ti.

### Ejemplo: Variante para el Tercer Elemento de una Lista

```css
@custom-variant third-child (&:nth-child(3));
```

```html
<ul class="flex gap-4">
  <li class="third-child:text-red-500 third-child:font-bold">Equipo A</li>
  <li class="third-child:text-red-500 third-child:font-bold">Equipo B</li>
  <li class="third-child:text-red-500 third-child:font-bold">Equipo C</li>
</ul>
```

Solo "Equipo C" (el tercer `<li>`) recibirá el estilo.

### Ejemplo Práctico: Variante para un Atributo de Datos Personalizado

En aplicaciones con estado dinámico (Vue/React), es común usar atributos `data-*` para reflejar estado en lugar de clases. Con `@custom-variant`, puedes crear una variante propia para reaccionar a ellos declarativamente:

```css
@custom-variant live (&[data-status="live"]);
```

```html
<div data-status="live" class="live:bg-red-50 live:border-red-400 border p-4 rounded-lg">
  <span class="live:animate-pulse font-bold">Partido en Vivo</span>
</div>
```

Esto es más legible y reutilizable que escribir clases condicionales `:class="status === 'live' ? '...' : '...'"` cada vez que necesitas ese mismo patrón.

## 17.4 Tabla Comparativa: v3 (JS Plugin API) vs. v4 (`@utility` / `@custom-variant`)

| Necesidad | Tailwind v3 | Tailwind v4 |
| :--- | :--- | :--- |
| Nueva clase de utilidad | `plugin(({ addUtilities }) => {...})` en `tailwind.config.js` | `@utility nombre { ... }` en CSS |
| Nueva variante | `plugin(({ addVariant }) => {...})` | `@custom-variant nombre (&selector);` en CSS |
| Familia de utilidades con valores | `matchUtilities()` (API compleja de JS) | `@utility nombre-* { ... var(--value(...)) }` |
| Curva de aprendizaje | Requiere conocer la API interna de JS de Tailwind | Requiere solo CSS estándar (selectores, `&`) |
| Reinicio del servidor de desarrollo | A veces necesario tras cambiar el plugin | Nunca; es CSS, se recarga en caliente igual que cualquier estilo |

::: tip 💡 Consejo del Diseñador Frontend:
Guarda tus `@utility` y `@custom-variant` personalizados en un archivo dedicado (por ejemplo, `theme/utilities.css`) e impórtalo junto a tu `@theme`. Así, cualquier desarrollador nuevo en tus proyectos sabe exactamente dónde buscar "el vocabulario extendido" del proyecto, sin tener que rastrear un `tailwind.config.js` disperso como en v3.
:::
