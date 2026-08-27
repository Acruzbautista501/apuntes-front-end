# Módulo 6: Color y Gradientes

El color no es un detalle estético que se agrega al final; es información. Comunica jerarquía, estado y marca. Este módulo cubre cómo CSS representa el color internamente y cómo construir superficies de color complejas (gradientes) sin imágenes.

## 6.1 Sistemas de Color

CSS ofrece varias formas de escribir el mismo color. Elegir la correcta depende de qué tan fácil necesites ajustarlo después.

### Teoría Explícita
* **Hexadecimal (`#rrggbb`):** El más común, pero el menos legible para un humano (¿qué tan claro es `#3b82f6` a simple vista?). Acepta un cuarto canal opcional de opacidad: `#3b82f6cc`.
* **`rgb()` / `rgba()`:** Define rojo, verde y azul en escala 0–255, más un canal alfa opcional (0 a 1). En CSS moderno, `rgb()` y `rgba()` son intercambiables: `rgb(59 130 246 / 0.8)` funciona igual que `rgba(59, 130, 246, 0.8)`.
* **`hsl()` / `hsla()`:** Define **H**ue (tono, 0–360°), **S**aturation (saturación, %) y **L**ightness (luminosidad, %). Es el formato más intuitivo para *ajustar* un color a mano: si quieres el mismo azul pero más oscuro, solo bajas el porcentaje de luminosidad.
* **`oklch()` (Moderno):** El formato más nuevo y más preciso perceptualmente. A diferencia de `hsl()`, dos colores con la misma "L" en `oklch()` se ven **igual de claros** al ojo humano, sin importar el tono. Esto lo hace ideal para generar paletas consistentes.

```css
.elemento {
  /* Las 4 formas representan colores equivalentes o muy cercanos */
  background: #3b82f6;
  background: rgb(59 130 246);
  background: hsl(217 91% 60%);
  background: oklch(62% 0.19 260);
}
```

### `currentColor`: el color que se hereda solo
`currentColor` es una palabra clave especial que siempre apunta al valor calculado de `color` en ese elemento. Es perfecta para que un ícono SVG o un borde combinen automáticamente con el texto sin repetir el valor:

```css
.boton-outline {
  color: #3b82f6;
  border: 2px solid currentColor; /* El borde será azul, igual que el texto */
}
```

## 6.2 `color-mix()`: Mezclar Colores en CSS Puro

Antes, para obtener una variante más clara u oscura de un color de marca, necesitabas SASS o calcular el HSL a mano. `color-mix()` lo hace nativamente:

```css
.boton-primario {
  background: #3b82f6;
}

.boton-primario:hover {
  /* Mezcla el azul con un 15% de negro, sin definir un segundo color a mano */
  background: color-mix(in srgb, #3b82f6 85%, black 15%);
}
```

## 6.3 Gradientes

Un gradiente es una transición fluida entre dos o más colores, generada por el navegador (no es una imagen). Se usan como valores de `background`, igual que un color sólido.

### Gradiente Lineal (`linear-gradient`)
Fluye en una dirección definida por un ángulo o una palabra clave.

```css
.hero {
  /* De arriba a abajo, azul a morado */
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
}

.boton-cta {
  /* De izquierda a derecha, con una parada intermedia */
  background: linear-gradient(to right, #f59e0b, #ef4444 60%, #dc2626);
}
```

### Gradiente Radial (`radial-gradient`)
Se expande desde un punto central hacia afuera, como un foco de luz.

```css
.spotlight {
  background: radial-gradient(circle at center, #fef3c7, #f59e0b 70%);
}
```

### Gradiente Cónico (`conic-gradient`)
Gira el color alrededor de un punto central, como las agujas de un reloj. Es la base para crear gráficos circulares de progreso sin SVG.

```css
.grafico-progreso {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  /* 75% completado en verde, el resto en gris */
  background: conic-gradient(#22c55e 0% 75%, #e5e7eb 75% 100%);
}
```

### Múltiples Gradientes Superpuestos
Puedes apilar varios gradientes en una sola propiedad `background`, separados por coma. El primero queda arriba.

```css
.textura {
  background:
    linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), /* Oscurece la imagen de abajo */
    url("/img/paisaje.jpg");
  background-size: cover;
}
```

## 6.4 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un color simple, copiado de un diseño en Figma | `hex` o `rgb()` |
| Ajustar manualmente el brillo de un color a ojo | `hsl()` |
| Generar una paleta perceptualmente uniforme | `oklch()` |
| Un borde o ícono que combine con el texto | `currentColor` |
| Una variante hover sin definir un segundo color | `color-mix()` |
| Un fondo tipo "hero" o botón llamativo | `linear-gradient()` |
| Un efecto de foco de luz o brillo central | `radial-gradient()` |
| Un gráfico circular de progreso | `conic-gradient()` |

> **Nota de accesibilidad:** Un color nunca debe ser el **único** medio para transmitir información (por ejemplo, "rojo = error, verde = éxito"). Acompaña siempre el color con texto, un ícono o un patrón, para las personas con daltonismo.
