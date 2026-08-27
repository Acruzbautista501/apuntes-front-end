# Módulo 18: Novedades de CSS (2024+)

CSS ha evolucionado más rápido en los últimos tres años que en la década anterior. Este módulo cubre las adiciones más recientes al lenguaje — funcionalidades que hace poco solo eran posibles con JavaScript y ahora viven directamente en el navegador.

## 18.1 View Transitions API: Animar Cambios de Página

Permite animar la transición entre dos estados del DOM (por ejemplo, al navegar de una página a otra, o al cambiar el contenido de una lista) con una animación tipo *cross-fade*, controlada completamente por CSS.

```css
/* Habilita las transiciones de vista para toda la navegación del sitio */
@view-transition {
  navigation: auto;
}

/* Personaliza la animación por defecto (que es un fundido cruzado) */
::view-transition-old(root) {
  animation: 0.3s ease-out fade-out;
}

::view-transition-new(root) {
  animation: 0.3s ease-in fade-in;
}

@keyframes fade-out {
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
}
```

### Transiciones Compartidas entre Elementos
Con `view-transition-name`, un elemento específico (como la imagen de una tarjeta de producto) puede "volar" suavemente de su posición en una vista a su nueva posición en la siguiente, como en las apps nativas de móvil:

```css
.imagen-producto {
  view-transition-name: imagen-destacada;
}
```

Si esa misma clase (o el mismo `view-transition-name`) existe en la página de destino, el navegador anima automáticamente la transformación entre ambas posiciones y tamaños.

## 18.2 `@starting-style`: Animar la Aparición de un Elemento

Antes era imposible animar la transición de un elemento cuando **aparece** por primera vez (por ejemplo, al pasar de `display: none` a visible), porque el navegador nunca "veía" un estado inicial desde el cual animar. `@starting-style` define ese estado de partida.

```css
.popover {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s, transform 0.3s;

  @starting-style {
    opacity: 0;
    transform: scale(0.9);
  }
}
```

Con esto, un `<dialog>` o `[popover]` nativo se desvanece suavemente al aparecer, sin necesitar JavaScript para "esperar un frame" antes de aplicar la clase de animación (el truco que se usaba antes).

## 18.3 Animaciones Controladas por Scroll

Permiten animar un elemento en función de **cuánto has scrolleado**, en lugar de en función del tiempo — la base de efectos como barras de progreso de lectura o elementos que aparecen al hacer scroll, sin `IntersectionObserver` en JavaScript.

```css
@keyframes revelar {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.seccion {
  animation: revelar linear;
  animation-timeline: view(); /* La animación avanza según la posición del elemento en el viewport */
  animation-range: entry 0% cover 40%; /* Empieza al entrar, termina al cubrir el 40% */
}

/* Barra de progreso de lectura, ligada al scroll de toda la página */
.barra-progreso {
  transform-origin: left;
  animation: crecer linear;
  animation-timeline: scroll(root); /* Ligada al scroll del documento completo */
}

@keyframes crecer {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

## 18.4 `text-wrap: pretty`

Una evolución de `text-wrap: balance` (Módulo 7), pensada para **párrafos** en vez de títulos: evita que la última línea de un párrafo quede con una sola palabra corta ("huérfana"), sin el costo de rendimiento que tendría aplicar `balance` a bloques largos de texto.

```css
p {
  text-wrap: pretty;
}
```

## 18.5 Anchor Positioning: Posicionar un Elemento Relativo a Otro (Sin JS)

Permite anclar un elemento (como un tooltip o un menú desplegable) a la posición exacta de **otro elemento cualquiera**, sin que estén anidados en el DOM y sin calcular coordenadas con JavaScript.

```css
.boton-menu {
  anchor-name: --mi-boton;
}

.menu-desplegable {
  position: absolute;
  position-anchor: --mi-boton;
  top: anchor(bottom); /* Justo debajo del ancla */
  left: anchor(start);
}
```

> **Soporte de navegadores:** las funciones de este módulo son las más recientes de todo el temario. Antes de usarlas en producción, verifica su disponibilidad en [caniuse.com](https://caniuse.com) y envuélvelas siempre en `@supports` (Módulo 12) con un estilo de respaldo funcional.

## 18.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Animar el cambio entre dos páginas o dos estados del DOM | View Transitions API |
| Animar la aparición de un elemento (de invisible a visible) | `@starting-style` |
| Animar algo en función del scroll, no del tiempo | `animation-timeline: scroll()` / `view()` |
| Evitar párrafos con una última línea huérfana | `text-wrap: pretty` |
| Posicionar un tooltip junto a otro elemento sin JS | Anchor Positioning (`anchor-name` / `anchor()`) |
