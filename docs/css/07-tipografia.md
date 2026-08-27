# Módulo 7: Tipografía Web

El 90% de lo que un usuario "consume" en cualquier sitio es texto. Una tipografía bien elegida y bien espaciada comunica profesionalismo antes de que el usuario lea una sola palabra; una mal ajustada hace que un diseño perfecto se sienta amateur.

## 7.1 Fuentes del Sistema vs. Fuentes Personalizadas

### Teoría Explícita
* **Fuentes *Web-Safe*:** Fuentes que casi todos los sistemas operativos ya tienen instaladas (`Arial`, `Georgia`, `Times New Roman`). Cargan instantáneamente porque no requieren descarga, pero limitan la identidad visual de tu marca.
* **Pila de Fuentes (`font stack`):** Nunca defines una sola fuente; defines una lista de respaldo por si la primera no está disponible.

```css
body {
  font-family: "Inter", "Segoe UI", Roboto, Arial, sans-serif;
}
```

### Fuentes del Sistema Nativas (Rendimiento Máximo)
Si quieres que tu sitio se vea "nativo" del sistema operativo del usuario (como hacen muchas apps modernas) y con cero tiempo de carga, usa la palabra clave `system-ui`:

```css
body {
  font-family: system-ui, sans-serif; /* San Francisco en Mac, Segoe UI en Windows, Roboto en Android */
}
```

## 7.2 Cargando Fuentes Personalizadas con `@font-face`

Cuando necesitas una fuente de marca (descargada de Google Fonts, Adobe Fonts, o un archivo propio), la registras con `@font-face` antes de poder usarla.

```css
@font-face {
  font-family: "Sora";
  src: url("/fonts/sora-variable.woff2") format("woff2");
  font-weight: 100 800; /* Rango de pesos que soporta esta fuente variable */
  font-display: swap;
}

body {
  font-family: "Sora", sans-serif;
}
```

### La propiedad clave: `font-display`
Define qué hace el navegador **mientras** la fuente personalizada todavía se está descargando.

| Valor | Comportamiento |
| :--- | :--- |
| `auto` | Deja la decisión al navegador (comportamiento variable). |
| `block` | Oculta el texto hasta 3s esperando la fuente (riesgo de "flash invisible"). |
| **`swap`** | Muestra el texto de inmediato con una fuente de respaldo, y la cambia cuando la personalizada cargue. **La opción recomendada casi siempre.** |
| `optional` | Usa la fuente solo si ya está en caché; si no, se queda con la de respaldo permanentemente. Ideal para conexiones lentas. |

## 7.3 Fuentes Variables

Una fuente variable es un **solo archivo** que contiene un rango continuo de pesos, anchos e incluso estilos itálicos, en lugar de necesitar un archivo distinto por cada peso (`Inter-Regular.woff2`, `Inter-Bold.woff2`, `Inter-Black.woff2`...). Esto reduce drásticamente las peticiones de red.

```css
.titulo-hero {
  font-family: "Sora", sans-serif;
  font-weight: 650; /* Un peso "intermedio" imposible en fuentes tradicionales */
}
```

## 7.4 Jerarquía y Ritmo Vertical

### Teoría Explícita
* **`line-height`:** La altura de línea. Usa siempre un valor **sin unidad** (ej. `1.5`), nunca `px`. Sin unidad, se calcula como un múltiplo del `font-size` de *ese mismo elemento*, lo que evita que se rompa si el texto se hereda con un tamaño distinto.
* **`letter-spacing`:** Espacio entre caracteres. Valores negativos (`-0.02em`) suelen mejorar títulos grandes; valores positivos ayudan a la legibilidad de texto en mayúsculas.
* **`text-wrap: balance` (Moderno):** Distribuye automáticamente las palabras de un título en varias líneas para que ninguna quede muy corta o "huérfana". Antes esto requería JavaScript.

```css
body {
  line-height: 1.6; /* Párrafos cómodos de leer */
}

h1, h2, h3 {
  line-height: 1.2;     /* Los títulos necesitan líneas más compactas */
  text-wrap: balance;   /* Evita títulos con una sola palabra huérfana en la última línea */
  letter-spacing: -0.02em;
}

.etiqueta-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em; /* El texto en mayúsculas necesita "respirar" más */
  font-size: 0.75rem;
}
```

## 7.5 Control de Overflow en Texto

Cuando el contenido es dinámico (nombres de usuario, títulos de productos), el texto puede desbordar su contenedor. Estas propiedades lo previenen:

```css
.titulo-tarjeta {
  white-space: nowrap;      /* No permite salto de línea */
  overflow: hidden;         /* Oculta lo que se desborde */
  text-overflow: ellipsis;  /* Agrega "..." al final del texto cortado */
}

.descripcion-larga {
  display: -webkit-box;
  -webkit-line-clamp: 3;    /* Corta el párrafo después de 3 líneas */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## 7.6 Resumen de Decisión Crítica

| Si quieres... | Usa... |
| :--- | :--- |
| Máximo rendimiento, tipografía "nativa" del SO | `font-family: system-ui` |
| Identidad de marca con una fuente propia | `@font-face` + `font-display: swap` |
| Múltiples pesos sin sumar peticiones de red | Una fuente variable |
| Que un título largo no deje una palabra sola | `text-wrap: balance` |
| Cortar texto dinámico que se desborda | `text-overflow: ellipsis` + `white-space: nowrap` |

> **Nota de accesibilidad:** Nunca bajes el `font-size` del texto de lectura por debajo de `16px` (`1rem`). Es el mínimo recomendado por las pautas WCAG para que el texto sea legible sin necesidad de hacer zoom.
