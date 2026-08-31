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

Además de `property`, `class`, `values` y `responsive` (las que ya usarás en los ejemplos de este módulo), cada entrada del mapa admite otras claves de configuración:

| Clave | Qué controla |
| :--- | :--- |
| `rfs` | Si `true`, aplica escalado fluido (RFS) al valor — útil en utilidades de tamaño de fuente o espaciado que deben achicarse en pantallas pequeñas |
| `print` | Si `true`, además de las clases normales genera variantes `.d-print-*` para hojas de estilo de impresión |
| `state` | Genera variantes por pseudo-clase, ej. `state: hover` produce también `.cursor-pointer-hover` |
| `css-var` / `css-variable-name` | En vez de (o además de) una clase, genera una variable CSS por cada valor (ej. `--bs-cursor-pointer`) en lugar de una clase `.cursor-pointer` |
| `rtl` | Si `false`, la utilidad no se genera en modo RTL (texto de derecha a izquierda) |

## 14.2 Agregar una Utilidad Nueva

Supongamos que necesitas una utilidad para `cursor: pointer` que Bootstrap no incluye por defecto.

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities"; // Aquí vive el mapa $utilities que vas a extender

$utilities: map-merge($utilities, (
  "cursor": (
    property: cursor,
    class: cursor,
    values: pointer grab not-allowed
  )
));

@import "bootstrap/scss/utilities/api"; // Genera las clases a partir del mapa
```

> Fíjate que este patrón importa **archivos individuales**, no el `bootstrap/scss/bootstrap` completo. Si además importaras el bundle completo, `utilities/api` se ejecutaría dos veces (una vez aquí, otra dentro de `bootstrap.scss`) y duplicarías la generación de **todas** las clases de utilidad, no solo la tuya. Si necesitas el resto del framework (botones, cards, grid...), impórtalo también como archivos individuales después de esta línea — nunca el bundle completo junto con este patrón.

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
$utilities: map-remove($utilities, "width", "float");
```

`"float"` es una sola entrada del mapa (con `responsive: true` internamente) que ya genera `.float-start`, `.float-end` y todas sus variantes por breakpoint — no existen claves separadas como `"float-sm"` o `"float-md"` en `$utilities`; eliminar `"float"` una vez basta para quitarlas todas.

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
