# Módulo 11: Backgrounds, Bordes y Sombras

Estas tres propiedades son las que le dan a una interfaz su "acabado". Una caja sin sombra ni borde bien pensado se ve plana; una con demasiados de ambos se ve saturada. Este módulo cubre el control fino de cada una.

## 11.1 Imágenes de Fondo

```css
.hero {
  background-image: url("/img/fondo.jpg");
  background-size: cover;       /* Cubre todo el contenedor, recortando si hace falta */
  background-position: center;  /* Punto focal de la imagen */
  background-repeat: no-repeat; /* Evita que la imagen se repita en mosaico */
  background-attachment: fixed; /* La imagen se queda fija al hacer scroll (efecto parallax) */
}
```

| Propiedad | Valores clave | Efecto |
| :--- | :--- | :--- |
| `background-size` | `cover` / `contain` / `100px 50px` | Cómo escala la imagen dentro de la caja |
| `background-position` | `center` / `top right` / `20% 50%` | Dónde se ancla el punto focal |
| `background-repeat` | `no-repeat` / `repeat-x` / `repeat` | Si la imagen se mosaiquea |
| `background-attachment` | `scroll` (por defecto) / `fixed` | Si la imagen se mueve con el contenido o queda fija |

### Múltiples Fondos
Puedes apilar varias imágenes o gradientes en una sola propiedad, separados por coma (el primero queda encima):

```css
.tarjeta-textura {
  background-image:
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    url("/img/textura.jpg");
  background-size: cover;
}
```

## 11.2 Bordes

```css
.tarjeta {
  border: 1px solid #e5e7eb;         /* Atajo: ancho | estilo | color */
  border-radius: 12px;               /* Esquinas redondeadas */
  border-left: 4px solid #3b82f6;    /* Un solo lado, distinto al resto */
}

.avatar {
  border-radius: 50%; /* Círculo perfecto en un elemento cuadrado */
}

.badge {
  /* Radios distintos por esquina: superior-izq, superior-der, inferior-der, inferior-izq */
  border-radius: 8px 8px 0 0;
}
```

### `border-image`: Bordes con Imágenes o Degradados
Permite que el borde mismo sea un gradiente o una imagen recortada, algo imposible con `border-color`:

```css
.borde-degradado {
  border: 4px solid transparent;
  border-image: linear-gradient(45deg, #3b82f6, #8b5cf6) 1;
}
```

## 11.3 Sombras: `box-shadow` y `text-shadow`

### `box-shadow`
```css
.tarjeta {
  /* offset-x | offset-y | blur | spread | color */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.tarjeta:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15); /* Sombra más grande al hover, simula "elevación" */
}

.input-error {
  /* inset: la sombra vive DENTRO de la caja, no fuera */
  box-shadow: inset 0 0 0 2px #ef4444;
}
```

### Sombras Apiladas (Profundidad Realista)
Una sola sombra grande se ve artificial. Los sistemas de diseño profesionales combinan **varias sombras sutiles** de distinto tamaño para simular cómo la luz real se comporta:

```css
.tarjeta-elevada {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 4px 8px rgba(0, 0, 0, 0.08),
    0 12px 24px rgba(0, 0, 0, 0.06);
}
```

### `text-shadow`
```css
.titulo-hero {
  color: white;
  /* Mejora la legibilidad de texto blanco sobre una imagen de fondo variable */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
```

## 11.4 `outline`: El Primo Olvidado del Borde

`outline` se parece a `border`, pero con diferencias clave que lo hacen ideal para estados de foco:

* **No ocupa espacio en el layout** (no afecta el tamaño de la caja ni empuja a los vecinos, a diferencia de `border`).
* Puede tener esquinas redondeadas siguiendo la forma del elemento con `outline-offset` separándolo del borde.

```css
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px; /* Separa el outline del borde del botón, se ve más limpio */
}
```

> **Por qué importa:** Nunca uses `border` para simular un anillo de foco — cambiar el `border` en `:focus` altera el tamaño de la caja y hace que el layout "salte". `outline` resuelve exactamente ese problema.

## 11.5 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Una imagen de fondo que cubra todo sin deformarse | `background-size: cover` |
| Oscurecer una imagen de fondo para que el texto resalte | Gradiente apilado sobre la imagen |
| Un borde con degradado de color | `border-image` |
| Simular elevación/profundidad realista | Varias `box-shadow` apiladas, sutiles |
| Un anillo de foco que no mueva el layout | `outline` + `outline-offset` |
| Sombra legible sobre texto en una imagen | `text-shadow` |
