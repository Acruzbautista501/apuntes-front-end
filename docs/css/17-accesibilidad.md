# Módulo 17: Accesibilidad en CSS

El Módulo 4 ya cubrió `prefers-reduced-motion`. La accesibilidad visual va más allá de las animaciones: incluye respetar las preferencias del sistema operativo del usuario, mantener contraste suficiente y no ocultar contenido de forma que rompa los lectores de pantalla.

## 17.1 `sr-only`: Contenido Solo para Lectores de Pantalla

A veces un elemento necesita una etiqueta accesible sin mostrar texto visible (por ejemplo, un botón de ícono). `display: none` lo oculta también de los lectores de pantalla — la técnica correcta es "ocultar visualmente sin remover del árbol de accesibilidad":

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<button>
  <svg><!-- ícono de cerrar --></svg>
  <span class="sr-only">Cerrar modal</span>
</button>
```

## 17.2 `prefers-contrast`: Alto Contraste

Algunos usuarios activan "Alto Contraste" en su sistema operativo porque necesitan más diferencia visual entre el texto y el fondo para poder leer cómodamente.

```css
.tarjeta {
  border: 1px solid #e5e7eb;
}

@media (prefers-contrast: more) {
  .tarjeta {
    border: 2px solid #000000; /* Borde más grueso y oscuro */
  }

  body {
    color: #000000; /* Máximo contraste de texto */
  }
}
```

## 17.3 `forced-colors`: Modo de Colores Forzados de Windows

En el "Modo de alto contraste" de Windows, el sistema **ignora tus colores personalizados** y aplica una paleta reducida controlada por el usuario. Con la media query `forced-colors`, puedes detectar este modo y ajustar tu layout (nunca los colores, que ya no están bajo tu control) para que siga siendo usable.

```css
@media (forced-colors: active) {
  .boton-fantasma {
    /* En este modo, un borde transparente puede volverse invisible.
       Usamos una palabra clave del sistema que SIEMPRE es visible. */
    border: 1px solid CanvasText;
  }
}
```

## 17.4 Contraste de Color: La Regla Práctica

CSS no valida el contraste por ti, pero es la base de toda decisión de color en una interfaz accesible. Las pautas WCAG 2.1 exigen, como mínimo:

| Tipo de contenido | Ratio de contraste mínimo (AA) |
| :--- | :--- |
| Texto normal | 4.5 : 1 |
| Texto grande (18pt+ o 14pt+ en negrita) | 3 : 1 |
| Componentes de interfaz y gráficos | 3 : 1 |

> **Herramienta práctica:** el inspector de accesibilidad de Chrome/Firefox DevTools calcula el contraste automáticamente al seleccionar un elemento de texto, y te avisa si falla el mínimo AA. Revísalo antes de dar por terminada cualquier paleta de color.

## 17.5 `prefers-reduced-transparency`

Similar a `prefers-reduced-motion`, pero para efectos de transparencia (como `backdrop-filter: blur()`), que pueden dificultar la lectura para usuarios con baja visión.

```css
.panel-cristal {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

@media (prefers-reduced-transparency: reduce) {
  .panel-cristal {
    background: rgba(255, 255, 255, 0.95); /* Casi opaco, sin depender del blur */
    backdrop-filter: none;
  }
}
```

## 17.6 Tabla de Referencia Rápida

| Necesidad del usuario | Herramienta CSS |
| :--- | :--- |
| Evitar mareo por animaciones | `prefers-reduced-motion` (Módulo 4) |
| Necesita más contraste para leer | `prefers-contrast: more` |
| Tiene activado el modo de colores forzados del SO | `forced-colors: active` + colores del sistema (`CanvasText`, `Canvas`) |
| Le cuesta leer sobre fondos translúcidos | `prefers-reduced-transparency: reduce` |
| Usa un lector de pantalla | Clase `.sr-only` en vez de `display: none` |

> **Principio general:** todas estas *media queries* comparten una filosofía: **detectan una preferencia del sistema operativo, no del navegador**. El usuario las configura una sola vez en su computadora o celular, y cualquier sitio bien construido las respeta automáticamente, sin que el usuario tenga que buscar un botón de accesibilidad escondido en cada sitio que visita.
