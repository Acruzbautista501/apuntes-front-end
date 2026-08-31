# Módulo 19: Ejercicios de Práctica

Antes de abordar el Proyecto Integrador, conviene practicar cada bloque de conceptos por separado, en piezas pequeñas y autocontenidas. Cada ejercicio indica los módulos que pone en juego para que puedas repasarlos si te atoras.

## 19.1 Fundamentos y Modelo de Caja (Módulo 1)

1. **Cascada y box-sizing.** Construye una tarjeta con `box-sizing: border-box`, usando selectores combinados (descendiente, hijo directo) y demuestra un caso de cascada/especificidad resuelto a propósito.
2. **Solo unidades relativas.** Crea un layout usando solo unidades relativas (`rem`, `%`, `vw`) y `calc()` para un ancho dinámico.

## 19.2 Layout y Posicionamiento (Módulo 2)

3. **Navbar con badge posicionado.** Construye una navbar con Flexbox que incluya un badge de notificación posicionado con `position: absolute` sobre un ícono.
4. **Dashboard con sticky y z-index.** Diseña un dashboard de 3 columnas con CSS Grid, con un elemento `sticky` y otro superpuesto a propósito con `z-index`.

## 19.3 Diseño Adaptativo y Fluidez (Módulo 3)

5. **Mobile-first con clamp y temas.** Aplica mobile-first a un componente, con tipografía fluida usando `clamp()` y variables CSS para un sistema de temas claro/oscuro.
6. **aspect-ratio y contenedor flexible.** Crea una tarjeta con `aspect-ratio` fijo para su imagen y hazla adaptable con un contenedor flexible moderno.

## 19.4 Animaciones y UX (Módulo 4)

7. **Transiciones y transformaciones.** Anima un botón con transición suave en hover, y una tarjeta con transformación 2D/3D al pasar el mouse.
8. **Spinner accesible.** Crea un spinner de carga con `@keyframes`, agregando soporte para `prefers-reduced-motion`.

## 19.5 Arquitectura, SASS y Ecosistema (Módulo 5)

9. **BEM + SASS.** Refactoriza un componente aplicando BEM, y organiza sus estilos en SASS con al menos una función o mixin propio.
10. **Arquitectura por capas.** Organiza un mini-proyecto CSS siguiendo el patrón de arquitectura por capas (ITCSS o 7-1).

## 19.6 Color y Gradientes (Módulo 6)

11. **Paleta con color-mix y gradiente cónico.** Construye una paleta usando `color-mix()` para generar variantes de un color base, y aplica un gradiente cónico para un indicador de progreso circular.

## 19.7 Tipografía Web (Módulo 7)

12. **Fuente personalizada con ritmo vertical.** Carga una fuente personalizada con `@font-face` y `font-display` correcto, y define una jerarquía tipográfica con ritmo vertical consistente.

## 19.8 Selectores Avanzados (Módulo 8)

13. **:has() combinado con :is()/:where().** Usa `:has()` para estilizar un contenedor según el estado de su contenido (ej. un formulario con un input inválido), combinando con `:is()`/`:where()`.

## 19.9 Flexbox a Fondo (Módulo 9)

14. **Elemento que empuja y anchos desiguales.** Construye una navbar con un elemento que "empuja" al resto (`margin-left: auto`), y practica `flex-grow`/`shrink`/`basis` en 3 tarjetas de ancho desigual.

## 19.10 CSS Grid a Fondo (Módulo 10)

15. **auto-fit y grid-template-areas.** Crea una rejilla verdaderamente responsiva con `auto-fit` + `minmax()`, y un layout con `grid-template-areas` nombradas (header/sidebar/main/footer).

## 19.11 Backgrounds, Bordes y Sombras (Módulo 11)

16. **Fondos y sombras apiladas.** Aplica múltiples fondos superpuestos y sombras apiladas (`box-shadow`) para dar profundidad realista a una tarjeta.

## 19.12 CSS Moderno (Módulo 12)

17. **Nesting, @layer y @supports.** Reescribe un CSS con nesting nativo, organizado en capas con `@layer`, y usa `@supports` para dar un fallback a una propiedad moderna.

## 19.13 Formularios y Estados Interactivos (Módulo 13)

18. **Validación visual nativa.** Construye un formulario con validación visual usando `:valid`/`:invalid`, `accent-color` en los controles nativos y `:focus-within` en el contenedor.

## 19.14 Container Queries (Módulo 14)

19. **Tarjeta adaptable a su contenedor.** Convierte una tarjeta para que cambie su layout según el ancho de su *contenedor* (no del viewport) con `@container` y unidades `cqw`.

## 19.15 Scroll Moderno (Módulo 15)

20. **Carrusel sin JavaScript.** Crea un carrusel horizontal con `scroll-snap`, `scroll-behavior` suave y `overscroll-behavior` contenido.

## 19.16 Layouts Avanzados (Módulo 16)

21. **Columnas y propiedades lógicas.** Diseña un artículo con texto en columnas (`columns`), usando propiedades lógicas en vez de físicas (`margin-inline`, `padding-block`).

## 19.17 Accesibilidad en CSS (Módulo 17)

22. **Auditoría de accesibilidad.** Audita un componente: agrega `.sr-only` donde falte texto accesible, soporte para `prefers-contrast` y `forced-colors`, y verifica el contraste de color.

## 19.18 Novedades de CSS 2024+ (Módulo 18)

23. **View Transitions y @starting-style.** Implementa una transición de página con la View Transitions API, y una aparición animada de un elemento con `@starting-style`.

## 19.19 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto, a diferencia del Módulo 20.
* Cuando te sientas cómodo resolviendo estos ejercicios sueltos, estás listo para el Proyecto Integrador.
