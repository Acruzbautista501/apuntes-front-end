# Módulo 18: Scroll Moderno y View Transitions

Hasta hace muy poco tiempo, crear un carrusel de diapositivas que se detuviera magnéticamente, animar una barra de lectura al hacer scroll o hacer transiciones suaves entre páginas requería librerías gigantescas de JavaScript. Hoy, todas estas experiencias se construyen **de forma nativa con CSS**.

---

## 18.1 Carruseles Nativos con `scroll-snap`

La tecnología **Scroll Snap** permite crear carruseles horizontales con comportamiento magnético fluido, perfectamente integrados con los gestos táctiles de smartphones:

```css
/* 1. El Contenedor del Carrusel: */
.carrusel {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 1rem;
  
  /* Habilita el anclaje magnético en el eje X: */
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

/* 2. Cada Diapositiva: */
.diapositiva {
  flex: 0 0 85%; /* Muestra el 85% de la tarjeta para invitar al scroll */
  /* Al soltar el dedo, la tarjeta se clava al centro: */
  scroll-snap-align: center;
  scroll-snap-stop: always; /* No permite saltarse diapositivas al deslizar rápido */
}
```

### Prevenir Rebotes Indeseados con `overscroll-behavior`
Cuando un usuario hace scroll dentro de un modal o menú lateral y llega al final, el navegador suele seguir scrolleando la página de fondo (*Scroll Chaining*). Evítalo con:

```css
.modal-con-scroll {
  overscroll-behavior: contain; /* Contiene el scroll dentro del modal */
}
```

---

## 18.2 Animaciones Controladas por Scroll (*Scroll-Driven Animations*)

Permiten ligar el avance de una animación de `@keyframes` a la **posición de la barra de desplazamiento**, en lugar de a un cronómetro de segundos:

### 1. Barra de Progreso de Lectura (`scroll()`)
Una línea superior que se llena del 0% al 100% mientras el usuario lee el artículo:

```css
@keyframes progresoLectura {
  from { scale: 0 1; }
  to   { scale: 1 1; }
}

.barra-progreso {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #3b82f6;
  transform-origin: left center;

  /* La animación avanza vinculada al scroll de la página completa: */
  animation: progresoLectura linear;
  animation-timeline: scroll();
}
```

### 2. Elementos que se Revelan al Entrar en Pantalla (`view()`)
Reemplaza al `IntersectionObserver` de JavaScript:

```css
@keyframes revelarTarjeta {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tarjeta-animada {
  /* Se anima en base a su propia entrada en el viewport: */
  animation: revelarTarjeta linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%; /* Inicia al asomarse, termina al cubrir el 30% */
}
```

---

## 18.3 `@starting-style`: Animar la Entrada desde `display: none`

Históricamente era imposible aplicar una transición CSS a un elemento que pasaba de `display: none` a `display: block` (como un modal o menú desplegable), porque el navegador no registraba un fotograma inicial.

**`@starting-style`** define ese estado de partida:

```css
dialog[open] {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s ease, transform 0.3s ease;

  /* Estilos con los que nace el elemento antes de renderizarse: */
  @starting-style {
    opacity: 0;
    transform: scale(0.9);
  }
}
```

---

## 18.4 View Transitions API en CSS

Permite realizar transiciones cinematográficas al navegar entre dos páginas distintas de un sitio web, o al actualizar el DOM:

```css
/* Activa las transiciones de página suaves en todo el sitio: */
@view-transition {
  navigation: auto;
}

/* Transición compartida para un elemento específico (ej. la imagen de un producto): */
.producto-imagen-destacada {
  view-transition-name: foto-hero;
}
```

Si la página de destino tiene un elemento con el mismo `view-transition-name: foto-hero;`, el navegador animará automáticamente la transformación de posición y tamaño entre ambas pantallas como en una app nativa de iOS o Android.

---

## 🛠️ Reto Práctico del Módulo

**Ejercicio: Carrusel Magnético y Barra de Lectura**

1. Maqueta un carrusel horizontal de fotos utilizando `scroll-snap-type: x mandatory` y `scroll-snap-align: start`.
2. Añade en la parte superior del documento una barra fija de 4px que mida el avance de lectura utilizando `animation-timeline: scroll()`.
3. Diseña una lista de artículos donde cada elemento se desvanezca suavemente hacia arriba al entrar en la pantalla utilizando `animation-timeline: view()`.
