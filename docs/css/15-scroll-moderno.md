# Módulo 15: Scroll Moderno

El comportamiento del scroll solía ser territorio exclusivo de JavaScript (librerías de "carrusel", *smooth scroll*, "snap" al siguiente elemento). CSS moderno cubre la mayoría de estos casos de forma nativa, con mejor rendimiento porque el navegador los optimiza directamente en su motor de scroll.

## 15.1 `scroll-behavior`: Scroll Suave Nativo

```css
html {
  scroll-behavior: smooth; /* Cualquier salto por ancla (#seccion) se anima suavemente */
}
```

Con esto, un enlace `<a href="#contacto">` ya no salta de golpe a esa sección — se desliza. Aplica también a `element.scrollIntoView()` cuando se ejecuta desde JavaScript.

> **Respeta la accesibilidad:** combina esto con `prefers-reduced-motion` (Módulo 17) para desactivar el scroll animado en usuarios sensibles al movimiento.

## 15.2 `scroll-snap`: Carruseles sin JavaScript

Permite que el scroll se "enganche" a puntos específicos, el mecanismo detrás de la mayoría de los carruseles e interfaces tipo Instagram Stories.

```css
.carrusel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory; /* Eje X, el enganche es OBLIGATORIO */
  gap: 1rem;
}

.carrusel .slide {
  flex: 0 0 100%;         /* Cada slide ocupa el 100% del ancho visible */
  scroll-snap-align: center; /* Se "engancha" al centro del contenedor */
}
```

| Propiedad | Va en... | Controla |
| :--- | :--- | :--- |
| `scroll-snap-type` | Contenedor con scroll | Eje (`x`/`y`/`both`) y fuerza (`mandatory`/`proximity`) |
| `scroll-snap-align` | Cada hijo/slide | A qué punto de sí mismo se ancla (`start`/`center`/`end`) |
| `scroll-snap-stop` | Cada hijo/slide | Si el usuario puede "saltarse" ese slide con un swipe rápido (`normal`/`always`) |

## 15.3 `overscroll-behavior`: Contener el "Scroll Chaining"

Por defecto, cuando llegas al final del scroll dentro de un modal o panel lateral, el navegador sigue el scroll hacia el elemento **padre** (por ejemplo, hace scroll a toda la página detrás del modal). `overscroll-behavior` lo evita.

```css
.modal-contenido {
  max-height: 80vh;
  overflow-y: auto;
  overscroll-behavior: contain; /* El scroll no "se filtra" hacia el body detrás */
}
```

## 15.4 `scroll-margin` y `scroll-padding`

Cuando tienes un header fijo (`position: sticky` o `fixed`), saltar a una sección por ancla suele dejarla **tapada** detrás del header. Estas propiedades corrigen el punto de destino del scroll.

```css
header {
  position: sticky;
  top: 0;
  height: 70px;
}

section {
  scroll-margin-top: 80px; /* Al saltar aquí, deja 80px de "aire" arriba (evita el header fijo) */
}
```

## 15.5 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Que los saltos por ancla se animen suavemente | `scroll-behavior: smooth` |
| Un carrusel de slides sin JavaScript | `scroll-snap-type` + `scroll-snap-align` |
| Que el scroll de un modal no arrastre a la página detrás | `overscroll-behavior: contain` |
| Que un ancla no quede tapada por un header fijo | `scroll-margin-top` |
