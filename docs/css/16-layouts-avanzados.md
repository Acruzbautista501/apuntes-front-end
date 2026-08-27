# Módulo 16: Layouts Avanzados

Este módulo reúne tres herramientas de layout menos frecuentes que Flexbox o Grid, pero que resuelven problemas específicos que ninguna de las dos cubre bien por sí sola.

## 16.1 Diseño Multi-columna (`columns`)

Inspirado en el layout de un periódico impreso: un bloque largo de texto se reparte automáticamente en varias columnas, y el contenido **fluye** de una a la siguiente (a diferencia de Grid, donde tú decides qué va en cada celda).

```css
.articulo {
  columns: 3 250px; /* Hasta 3 columnas, cada una de al menos 250px */
  column-gap: 2rem;
  column-rule: 1px solid #e5e7eb; /* Línea divisoria entre columnas */
}

.articulo h2 {
  column-span: all; /* Este título ocupa TODAS las columnas, rompiendo el flujo */
}

.cita-destacada {
  break-inside: avoid; /* Evita que este bloque se corte entre dos columnas */
}
```

Es la herramienta correcta para texto largo (artículos, términos y condiciones), no para layouts de interfaz — para eso sigue usando Grid o Flexbox.

## 16.2 Propiedades Lógicas: Diseño Preparado para Cualquier Idioma

Propiedades como `margin-left` o `width` asumen que el texto siempre fluye de izquierda a derecha. Pero en idiomas como árabe o hebreo (RTL, *right-to-left*), o en modos de escritura vertical (japonés tradicional), esa suposición rompe el diseño. Las **propiedades lógicas** describen el espacio en relación al **flujo del texto**, no a una dirección física fija.

```css
.tarjeta {
  /* En lugar de margin-left / margin-right: */
  margin-inline-start: 1rem; /* "Inicio" del eje horizontal según el idioma */
  margin-inline-end: 2rem;   /* "Fin" del eje horizontal según el idioma */

  /* En lugar de margin-top / margin-bottom: */
  margin-block-start: 1rem;
  margin-block-end: 1.5rem;

  /* Atajos que cubren ambos lados de un eje a la vez */
  padding-inline: 1.5rem; /* = padding-left + padding-right (en LTR) */
  padding-block: 1rem;    /* = padding-top + padding-bottom */
}
```

Si tu sitio nunca soportará más de un idioma con dirección de escritura distinta, el impacto práctico es bajo — pero **si algún día necesitas soporte RTL** (árabe, hebreo), usar propiedades lógicas desde el inicio significa que el sitio se traduce sin tocar una sola línea de CSS. Cambiar `direction: rtl` en el `<html>` reacomoda todo automáticamente.

| Propiedad física | Equivalente lógico |
| :--- | :--- |
| `width` | `inline-size` |
| `height` | `block-size` |
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-top` / `padding-bottom` | `padding-block-start` / `padding-block-end` |
| `text-align: left` | `text-align: start` |
| `border-left` | `border-inline-start` |

## 16.3 `subgrid` en Contexto de Layout General

Ya se cubrió en el Módulo 10, pero vale reforzarlo aquí como patrón de **arquitectura de layout**: `subgrid` es la pieza que permite construir un sistema de diseño donde componentes independientes (tarjetas, filas de tabla) alinean sus columnas internas con una rejilla maestra, sin que cada componente necesite conocer los anchos exactos del resto del sitio.

```css
.layout-maestro {
  display: grid;
  grid-template-columns: repeat(12, 1fr); /* Sistema de 12 columnas, como en Bootstrap */
  gap: 1rem;
}

.seccion-destacada {
  grid-column: span 12;
  display: grid;
  grid-template-columns: subgrid; /* Hereda las 12 columnas del layout maestro */
}
```

## 16.4 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Texto largo repartido como un periódico | `columns` |
| Un sitio preparado para soportar RTL sin refactor futuro | Propiedades lógicas (`margin-inline`, `padding-block`) |
| Alinear componentes independientes a una rejilla maestra de 12 columnas | `grid-template-columns: subgrid` |
