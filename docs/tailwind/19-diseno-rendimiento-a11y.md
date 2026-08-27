# MÓDULO 19 — Sistemas de Diseño, Rendimiento (Motor Oxide) y Accesibilidad

Este módulo cierra el nivel experto con tres pilares que todo proyecto de producción necesita, pero que rara vez se enseñan juntos: cómo escalar tu tema a un **sistema de diseño** real, cómo funciona el motor que hace que Tailwind 4 sea tan rápido, y cómo asegurarte de que tu interfaz sea usable para *todos* tus usuarios.

## 19.1 Sistemas de Diseño con Tailwind CSS 4

Un sistema de diseño no es solo una paleta de colores; es un **contrato compartido** entre diseño y desarrollo que garantiza consistencia sin importar quién construya cada pantalla.

### `@theme` vs. `@theme inline` vs. `@theme static`

Tailwind 4 ofrece tres variantes de la directiva `@theme`, y elegir la correcta importa cuando construyes un sistema de diseño serio:

| Variante | Comportamiento | Cuándo usarla |
| :--- | :--- | :--- |
| `@theme { }` | Genera variables CSS Y las expone para que Tailwind genere utilidades. Es el uso estándar. | Para el 95% de los casos (Módulo 12). |
| `@theme inline { }` | El valor se resuelve e "inyecta" directamente en cada utilidad generada, en lugar de referenciar una variable CSS en tiempo de ejecución. | Cuando necesitas máximo rendimiento en un valor que **nunca** cambiará dinámicamente (ej. un `border-radius` de marca fijo). |
| `@theme static { }` | Fuerza a que Tailwind genere **todas** las utilidades posibles de esa variable, incluso las que no detecta en uso durante el escaneo. | Cuando construyes una librería de componentes que otros proyectos consumirán, y no puedes garantizar que el escaneo automático detecte todas las clases que se usarán externamente. |

### Ejemplo: Publicar un Tema como Design System

```css
/* packages/design-system/theme.css */
@theme static {
  --color-brand-50: oklch(0.98 0.02 250);
  --color-brand-500: oklch(0.6 0.2 250);
  --color-brand-900: oklch(0.25 0.15 250);

  --font-display: "Sora", sans-serif;
  --radius-brand: 0.75rem;
}
```

Al usar `static`, garantizas que si otro equipo consume tu paquete de diseño y usa `bg-brand-500` en un archivo que tu escaneo automático no llegó a analizar (por ejemplo, contenido generado dinámicamente desde un CMS), la clase **igual existirá** en el CSS final.

### Multi-Tema (Más Allá de Claro/Oscuro)

La estrategia semántica del Módulo 12.3 se extiende naturalmente a más de dos temas (por ejemplo, un tema "Alto Contraste" para accesibilidad, o temas de marca distintos por cliente en una plataforma multi-tenant):

```css
@theme {
  --color-surface: var(--surface);
  --color-accent: var(--accent);
}

[data-theme="light"]  { --surface: #ffffff; --accent: #059669; }
[data-theme="dark"]   { --surface: #0f172a; --accent: #10b981; }
[data-theme="contrast"] { --surface: #000000; --accent: #ffff00; }
```

```html
<html data-theme="contrast">
```

::: tip 💡 Consejo del Diseñador Frontend:
Un sistema de diseño maduro no se mide por cuántos colores tiene, sino por cuántos **roles semánticos** define (`surface`, `accent`, `danger`, `border-subtle`...) independientemente de sus valores. Si tu equipo de diseño puede lanzar un tema de temporada (por ejemplo, edición especial de fin de año para tu aplicación) cambiando solo los valores dentro de un bloque `[data-theme]`, tu sistema está bien construido.
:::

## 19.2 Cómo Funciona el Motor Oxide (Rendimiento)

Entender por qué Tailwind 4 es tan rápido te ayuda a tomar mejores decisiones de arquitectura, en lugar de tratar la velocidad como magia.

### La Arquitectura en Tres Capas

1. **Detección de contenido (Rust):** En lugar de que Node.js lea archivo por archivo con expresiones regulares en JavaScript (lento), el núcleo de escaneo está escrito en Rust y usa técnicas de parsing especializado. Esto es entre 10 y 100 veces más rápido que el escáner de v3.
2. **Generación bajo demanda:** Igual que el JIT de v3 (Módulo 1.2), solo se genera CSS para clases que realmente aparecen en tu código. La diferencia es que en v4 todo el pipeline —desde la detección hasta la generación de reglas— corre en el motor nativo, no en JavaScript interpretado.
3. **`Lightning CSS` para el post-procesado:** Tailwind 4 usa `Lightning CSS` (también escrito en Rust) en lugar de depender de la cadena tradicional PostCSS + Autoprefixer + cssnano. Esto significa que agregar prefijos de navegador, minificar y anidar reglas ocurre en el mismo paso nativo, eliminando capas de procesamiento intermedias.

### Números de Referencia (Órdenes de Magnitud)

| Operación | Tailwind v3 | Tailwind v4 |
| :--- | :--- | :--- |
| Build completo (proyecto grande) | ~1000ms | ~100ms (≈10x más rápido) |
| Rebuild incremental (guardar un archivo) | ~medidos en decenas de ms | Frecuentemente sub-milisegundo (~100x más rápido) |
| Sin cambios en clases usadas (build "vacío") | Recalcula igual | Prácticamente instantáneo gracias al cacheo interno |

::: tip 💡 Consejo del Diseñador Frontend:
Estas mejoras de rendimiento son del **motor**, no de tu código. Aun así, puedes ayudarlo: evita archivos gigantescos de 5000 líneas con miles de clases dinámicas generadas por concatenación de strings en runtime (`` `bg-${color}-500` ``); el motor no puede detectar clases construidas dinámicamente porque nunca aparecen completas como texto literal en tu código. Escribe siempre la clase completa, aunque sea dentro de un objeto de mapeo (como viste en el Módulo 14 con `computed`).
:::

## 19.3 Accesibilidad (A11y) con Utilidades de Tailwind

Tailwind no "regala" accesibilidad automáticamente, pero te da las herramientas exactas para implementarla sin fricción, si sabes dónde buscarlas.

### `sr-only`: Contenido Solo para Lectores de Pantalla

Para elementos que necesitan una etiqueta accesible pero no un texto visible (por ejemplo, un botón de icono):

```html
<button class="p-2 rounded-full hover:bg-slate-100">
  <svg class="w-5 h-5"><!-- ícono de "cerrar" --></svg>
  <span class="sr-only">Cerrar modal</span>
</button>
```

`sr-only` oculta el texto visualmente (sin usar `display: none`, que también lo ocultaría de los lectores de pantalla) mientras lo mantiene disponible para tecnologías de asistencia.

### `focus-visible:` en Lugar de `focus:`

El Módulo 8.2 usó `focus:`, que se activa con clic **y** con teclado. `focus-visible:` es más preciso: el navegador decide mostrarlo solo cuando detecta navegación por teclado, evitando el "halo" molesto en usuarios de mouse que hacen clic.

```html
<button class="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">
  Registrar Gol
</button>
```

### Variantes ARIA Nativas

Tailwind puede reaccionar directamente a atributos `aria-*`, sincronizando tu CSS con el estado de accesibilidad real del elemento (que además necesitas para que los lectores de pantalla funcionen correctamente).

```html
<button
  aria-pressed="true"
  class="aria-pressed:bg-blue-600 aria-pressed:text-white bg-slate-100"
>
  Filtrar: Solo en vivo
</button>

<div aria-expanded="false" class="aria-expanded:rotate-180 transition-transform">
  <svg><!-- flecha de acordeón --></svg>
</div>
```

Esto evita el antipatrón de mantener **dos** fuentes de verdad (una clase de JS como `is-active` y un atributo `aria-*` por separado); con la variante `aria-*` de Tailwind, el propio atributo de accesibilidad **es** la fuente de verdad visual.

### Respetar las Preferencias del Sistema Operativo

```html
<div class="motion-reduce:transition-none motion-reduce:animate-none animate-bounce transition-all">
  <!-- Se anima normalmente, pero respeta a los usuarios con sensibilidad al movimiento -->
</div>

<div class="contrast-more:border-2 contrast-more:border-black border border-slate-200">
  <!-- Refuerza el borde para usuarios con "Alto Contraste" activado en su SO -->
</div>
```

### Checklist de Accesibilidad para tus Proyectos

| Elemento | Verificación | Utilidad relevante |
| :--- | :--- | :--- |
| Botones de icono | ¿Tiene texto accesible? | `sr-only` |
| Elementos interactivos | ¿Se ve el foco al navegar con `Tab`? | `focus-visible:ring-*` |
| Estados dinámicos (activo, expandido) | ¿El atributo `aria-*` controla el estilo? | `aria-expanded:*`, `aria-selected:*` |
| Animaciones | ¿Se desactivan si el usuario lo prefiere? | `motion-reduce:*` |
| Contraste de color | ¿Cumple WCAG AA como mínimo (4.5:1 para texto)? | Verificar manualmente con DevTools |

::: tip 💡 Consejo del Diseñador Frontend:
La accesibilidad no es una capa que se añade al final del proyecto; es una decisión que tomas clase por clase. La buena noticia es que, en Tailwind 4, casi todas las variantes de accesibilidad (`aria-*`, `motion-reduce:`, `focus-visible:`) cuestan exactamente lo mismo de escribir que sus alternativas menos accesibles. No hay excusa de "no tengo tiempo" cuando la solución correcta es igual de rápida de teclear.
:::
