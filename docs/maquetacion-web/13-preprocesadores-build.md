# Módulo 13: Preprocesadores y Build Tools

Escribir CSS plano funciona para proyectos pequeños, pero a cierta escala, características como variables reutilizables, anidamiento, y la automatización de tareas repetitivas (Autoprefixer, minificación) se vuelven indispensables. Este módulo cubre Sass y un pipeline de build moderno con Vite, aplicado específicamente a proyectos de maquetación estática (sin un framework como Vue/React).

## 13.1 Por Qué Sass Sigue Siendo Relevante

CSS moderno ya incluye variables nativas (`--color-primario`) y nesting nativo (cubiertos a fondo en la sección de CSS3 de este sitio) — Sass sigue aportando valor en: **mixins** con lógica reutilizable, **funciones** personalizadas, organización en **parciales** importables, y bucles/condicionales para generar CSS repetitivo automáticamente.

## 13.2 Variables y Anidamiento

```scss
$color-primario: #0066cc;
$espaciado-base: 1rem;

.tarjeta {
  padding: $espaciado-base;
  border: 1px solid #e0e0e0;

  &__titulo {
    color: $color-primario;
    font-size: 1.25rem;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
```

El anidamiento con `&` es especialmente útil combinado con la metodología BEM (Módulo 5) — `&__titulo` compila a `.tarjeta__titulo`, manteniendo la relación visual entre el block y sus elements directamente en el código fuente.

## 13.3 Mixins — Lógica CSS Reutilizable

```scss
@mixin texto-truncado($lineas: 1) {
  display: -webkit-box;
  -webkit-line-clamp: $lineas;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tarjeta__titulo {
  @include texto-truncado(2);
}

.tarjeta__descripcion {
  @include texto-truncado(3);
}
```

Un mixin encapsula un patrón de CSS reutilizable con parámetros — evita repetir el mismo bloque de propiedades (visto ya en el Módulo 8) en cada lugar donde se necesita truncar texto.

## 13.4 Funciones Personalizadas

```scss
@function rem($px) {
  @return calc($px / 16px) * 1rem;
}

.titulo {
  font-size: rem(32px); // Compila a 2rem
}
```

## 13.5 Organización en Parciales (Aplicando ITCSS del Módulo 5)

```scss
// app.scss — el punto de entrada
@use 'settings/variables';
@use 'generic/reset';
@use 'objects/grid';
@use 'components/tarjeta';
@use 'components/boton';
@use 'utilities/espaciado';
```

```text
styles/
├── settings/
│   └── _variables.scss
├── generic/
│   └── _reset.scss
├── objects/
│   └── _grid.scss
├── components/
│   ├── _tarjeta.scss
│   └── _boton.scss
├── utilities/
│   └── _espaciado.scss
└── app.scss
```

`@use` (el sistema moderno de módulos de Sass, reemplazando el antiguo `@import`) importa cada parcial en el orden definido — la misma organización en capas de ITCSS, ahora implementada con archivos Sass reales.

## 13.6 Generar CSS Repetitivo con Bucles

```scss
$espaciados: (1: 0.25rem, 2: 0.5rem, 3: 1rem, 4: 1.5rem, 6: 3rem);

@each $nombre, $valor in $espaciados {
  .m-#{$nombre} { margin: $valor; }
  .p-#{$nombre} { padding: $valor; }
}
```

Genera automáticamente una escala completa de clases de utilidad (`.m-1`, `.m-2`, `.p-1`, `.p-2`...) a partir de un solo mapa de valores — el mismo principio detrás de cómo Bootstrap y Tailwind generan sus sistemas de utilidades internamente.

## 13.7 Vite para Proyectos de Maquetación Estática

Aunque Vite es más conocido en el contexto de Vue/React, funciona igual de bien como servidor de desarrollo y bundler para un sitio de maquetación pura (HTML/CSS/JS sin framework).

```bash
npm create vite@latest mi-sitio -- --template vanilla
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contacto: resolve(__dirname, 'contacto.html'),
        productos: resolve(__dirname, 'productos.html')
      }
    }
  }
})
```

Vite da recarga en vivo durante el desarrollo, y en el build de producción minifica automáticamente CSS/JS, optimiza imágenes referenciadas, y genera nombres de archivo con hash para *cache busting* — todo sin configuración manual adicional para un proyecto de maquetación con varias páginas HTML.

## 13.8 PostCSS como Motor de Transformación

```javascript
// postcss.config.js
export default {
  plugins: {
    autoprefixer: {},       // Prefijos de proveedor automáticos (Módulo 9)
    'postcss-preset-env': {} // Permite usar sintaxis CSS futura, transpilada a CSS actual
  }
}
```

PostCSS es el motor que procesa CSS a través de plugins — Vite lo integra automáticamente, así que Autoprefixer y otras transformaciones (Módulo 9) se aplican sin configuración manual del pipeline de build.

## 13.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Variables y anidamiento (con matices sobre el CSS nativo) | Sass — mixins, funciones y bucles siguen siendo su ventaja diferencial |
| Organizar CSS en capas según ITCSS | `@use` con parciales organizados por carpeta |
| Generar clases de utilidad repetitivas automáticamente | Un bucle `@each` sobre un mapa de valores |
| Un servidor de desarrollo con recarga en vivo para HTML estático | Vite con la plantilla `vanilla` |
| Prefijos de proveedor y CSS futuro transpilado | PostCSS + Autoprefixer (integrado automáticamente en Vite) |

## 13.10 Errores Comunes

- **Usar Sass solo por costumbre cuando CSS nativo ya cubre la necesidad**: variables y nesting nativos (cubiertos en la sección de CSS3) a menudo son suficientes sin necesitar el paso de compilación adicional.
- **Anidar selectores en Sass más de 3 niveles de profundidad**: genera selectores CSS finales innecesariamente específicos y frágiles, el mismo problema de especificidad que BEM (Módulo 5) busca evitar.
- **No usar `@use` y seguir con el `@import` obsoleto de Sass**: `@import` está deprecado en Sass moderno y tiene problemas de rendimiento y colisión de nombres que `@use` resuelve.
