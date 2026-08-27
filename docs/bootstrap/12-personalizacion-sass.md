# Módulo 12: Personalización con Sass

Hasta ahora usaste Bootstrap "tal cual viene" — sus colores, su tipografía, su radio de bordes por defecto. Eso funciona para prototipos, pero un sitio con identidad de marca real necesita personalizar el framework desde su raíz. Bootstrap está construido en **Sass**, y esa es la puerta de entrada a la personalización profesional.

## 12.1 Por Qué el CSS Compilado No Basta

El archivo `bootstrap.min.css` que usaste en el CDN es el resultado **final** de compilar cientos de variables Sass con sus valores por defecto. Sobrescribir esos estilos con tu propio CSS después (`.btn-primary { background: purple !important; }`) funciona, pero es fragil, requiere `!important` a menudo, y no cambia los cálculos internos que dependen de esa variable (por ejemplo, el color del `:hover` de un botón, que Bootstrap calcula automáticamente a partir de `$primary`).

La forma correcta es **recompilar Bootstrap con tus propios valores**, algo que solo es posible si instalaste el paquete desde npm (Módulo 1.2).

## 12.2 El Orden de Importación Correcto

Bootstrap expone sus archivos fuente en `node_modules/bootstrap/scss/`. La clave de la personalización es este orden exacto:

```scss
// mi-tema.scss

// 1. Funciones internas de Bootstrap (necesarias antes que nada)
@import "bootstrap/scss/functions";

// 2. TUS variables, ANTES de que Bootstrap defina las suyas
$primary: #7c3aed;        // Tu morado de marca, reemplaza el azul por defecto
$border-radius: 0.75rem;  // Esquinas más redondeadas en TODOS los componentes
$font-family-base: "Sora", sans-serif;

// 3. Las variables por defecto de Bootstrap (solo llenan lo que TÚ no definiste)
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";

// 4. El resto del framework, ya usando tus valores
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/root";
@import "bootstrap/scss/bootstrap";
```

> **La regla de oro:** tus variables (`$primary`, `$border-radius`...) se declaran **entre** `functions` y `variables`. Bootstrap usa `!default` en todas sus variables internamente, lo que significa "usa este valor solo si nadie lo definió antes". Si tu variable aparece antes, gana la tuya; si aparece después, ya es demasiado tarde.

## 12.3 Variables Más Usadas para Personalizar

```scss
// Colores del sistema de temas
$primary: #7c3aed;
$secondary: #64748b;
$success: #16a34a;
$danger: #dc2626;

// Tipografía
$font-family-base: "Sora", sans-serif;
$font-size-base: 1rem;
$headings-font-weight: 700;

// Espaciado y formas
$border-radius: 0.75rem;
$border-radius-sm: 0.5rem;
$border-radius-lg: 1rem;
$spacer: 1rem; // La base de TODO el sistema de espaciado (m-1, p-3, etc.)

// Breakpoints (si necesitas cambiar los tamaños de pantalla por defecto)
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

## 12.4 Mapas de Sass: Agregar Colores Nuevos al Sistema de Temas

Los colores de Bootstrap (`primary`, `success`, `danger`...) viven en un **mapa** de Sass. Puedes agregar tus propios colores personalizados a ese mismo mapa, y Bootstrap generará automáticamente **todas** las clases relacionadas (`.btn-marca`, `.text-marca`, `.bg-marca`, `.border-marca`...) sin que tengas que escribirlas a mano.

```scss
@import "bootstrap/scss/functions";

$marca: #f97316; // Tu color de marca, que no existe por defecto

@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";

// Fusionamos tu color nuevo con el mapa de colores existente
$theme-colors: map-merge($theme-colors, (
  "marca": $marca
));

@import "bootstrap/scss/mixins";
@import "bootstrap/scss/root";
@import "bootstrap/scss/bootstrap";
```

```html
<!-- Ahora existen, generadas automáticamente: -->
<button class="btn btn-marca">Botón de Marca</button>
<span class="badge bg-marca">Nuevo</span>
<p class="text-marca">Texto con el color de marca</p>
```

## 12.5 Compilar Solo lo que Necesitas

Bootstrap completo pesa bastante si tu proyecto no usa todos sus componentes. Puedes importar únicamente los archivos parciales que realmente necesitas, en lugar de `bootstrap/scss/bootstrap` completo:

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/mixins";

// Solo lo esencial:
@import "bootstrap/scss/root";
@import "bootstrap/scss/reboot";
@import "bootstrap/scss/grid";
@import "bootstrap/scss/buttons";
@import "bootstrap/scss/card";

// Si no importas "bootstrap/scss/carousel" o "bootstrap/scss/modal",
// ese CSS simplemente no existe en tu bundle final.
```

## 12.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Cambiar el color de marca en TODO el framework | Redefinir `$primary` antes de `@import "variables"` |
| Un nuevo color de tema con sus propias clases (`.btn-marca`) | `map-merge($theme-colors, (...))` |
| Cambiar los breakpoints por defecto | Redefinir el mapa `$grid-breakpoints` |
| Reducir el peso del CSS final | Importar solo los parciales de Sass que usas |

> **Requisito:** todo este módulo asume que instalaste Bootstrap vía `npm install bootstrap` (Módulo 1) y tienes un compilador de Sass configurado en tu proyecto (Vite lo soporta con `npm install -D sass`). El CDN, al ser CSS ya compilado, no permite ninguna de estas técnicas.
