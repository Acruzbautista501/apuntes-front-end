# Módulo 14: Utility API

Ya conoces decenas de clases de utilidad (`m-3`, `text-center`, `d-flex`). Todas ellas — **absolutamente todas** — se generan a partir de un único mapa de configuración en Sass llamado `$utilities`. La Utility API es el mecanismo que te permite modificar ese mapa: agregar utilidades que Bootstrap no trae, quitar las que no usas, o cambiar su escala de valores.

## 14.1 Cómo Está Construida una Utilidad Internamente

Cada entrada del mapa `$utilities` describe una "familia" completa de clases. Esta es (simplificada) la definición real de las utilidades de `margin`:

```scss
"margin": (
  property: margin,
  class: m,
  values: map-merge($spacers, (auto: auto))
),
```

Esa sola entrada es responsable de generar `m-0`, `m-1`, `m-2`... `m-5` y `m-auto` — Bootstrap itera automáticamente sobre `values` y genera una clase por cada una.

## 14.2 Agregar una Utilidad Nueva

Supongamos que necesitas una utilidad para `cursor: pointer` que Bootstrap no incluye por defecto.

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";

$utilities: map-merge($utilities, (
  "cursor": (
    property: cursor,
    class: cursor,
    values: pointer grab not-allowed
  )
));

@import "bootstrap/scss/utilities/api"; // Genera las clases a partir del mapa
@import "bootstrap/scss/bootstrap";
```

```html
<!-- Generadas automáticamente: -->
<div class="cursor-pointer">Clickeable</div>
<div class="cursor-not-allowed">Deshabilitado</div>
```

## 14.3 Agregar Variantes Responsivas a una Utilidad

Puedes marcar cualquier utilidad (nueva o existente) para que genere automáticamente sus versiones por breakpoint (`-sm`, `-md`, `-lg`...), igual que hacen `.d-none`/`.d-md-block`.

```scss
$utilities: map-merge($utilities, (
  "cursor": (
    property: cursor,
    class: cursor,
    responsive: true, // Genera cursor-pointer, cursor-md-pointer, cursor-lg-pointer...
    values: pointer grab
  )
));
```

## 14.4 Quitar Utilidades que No Usas

Si tu proyecto nunca necesita, por ejemplo, las utilidades de `float` (`.float-start`, `.float-end`), puedes eliminarlas del mapa para que Bootstrap ni siquiera genere ese CSS — reduciendo el peso final del archivo.

```scss
$utilities: map-remove($utilities, "float", "float-sm", "float-md", "float-lg", "float-xl");
```

## 14.5 Modificar una Utilidad Existente

También puedes cambiar la escala de valores de una utilidad que Bootstrap ya trae, sin reescribirla desde cero — usando `map-merge` sobre la entrada específica:

```scss
$utilities: map-merge($utilities, (
  "opacity": map-merge(
    map-get($utilities, "opacity"),
    ( values: (0: 0, 10: 0.1, 25: 0.25, 50: 0.5, 75: 0.75, 90: 0.9, 100: 1) )
  )
));
```

Esto amplía la escala de `.opacity-*` (que por defecto solo tiene 0/25/50/75/100) para incluir pasos más finos como `.opacity-10` y `.opacity-90`.

## 14.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Una utilidad completamente nueva (ej. `cursor-*`) | `map-merge($utilities, (...))` con una entrada nueva |
| Que tu utilidad nueva tenga versiones por breakpoint | `responsive: true` dentro de su definición |
| Eliminar utilidades que nunca usas (menos peso final) | `map-remove($utilities, "nombre")` |
| Ampliar la escala de valores de una utilidad existente | `map-merge` sobre el resultado de `map-get($utilities, "nombre")` |

> **Relación con el Módulo 12:** la Utility API es, en esencia, el mismo patrón de `map-merge` que usaste para agregar colores de marca al mapa `$theme-colors` — Bootstrap 5 está diseñado casi en su totalidad como una colección de mapas de Sass que puedes leer, fusionar y modificar, en lugar de un CSS monolítico e inamovible.
