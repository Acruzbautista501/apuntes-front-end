# Módulo 19: Ejercicios Prácticos de CSS3

Esta colección de ejercicios prácticos refuerza los conceptos fundamentales y avanzados de CSS3, organizados por orden de dificultad y cubriendo los patrones que usarás en proyectos reales de desarrollo web.

---

## 🟢 Bloque 1: Fundamentos, Color y Tipografía (Módulos 1 al 4)

### Ejercicio 1: Tarjeta con Modelo de Caja Estricto
* Aplica el reseteo universal con `box-sizing: border-box`.
* Construye una tarjeta con `width: 320px;`, `padding: 2rem;` y `border: 2px solid #ccc;`.
* Abre el inspector de elementos (F12) y verifica que el ancho total siga siendo exactamente `320px` sin importar el relleno.

### Ejercicio 2: Paleta de Colores con OKLCH y `color-mix()`
* Define una variable `--color-primario` utilizando el modelo **OKLCH**.
* Genera dinámicamente un color de fondo al 10% de opacidad y un estado `:hover` un 20% más oscuro utilizando exclusivamente la función `color-mix()`, sin definir variables de color adicionales.

### Ejercicio 3: Tipografía Editorial y Balanceada
* Limita un párrafo de texto a una longitud máxima de lectura confortable usando `max-width: 65ch;`.
* Aplica `text-wrap: balance` en los títulos `<h1>` y `<h2>` para evitar que queden palabras viudas y solitarias al final.

---

## 🟡 Bloque 2: Layouts, Flexbox y Grid (Módulos 5 al 8)

### Ejercicio 4: Barra de Navegación con Flexbox
* Construye una cabecera `<header>` con Flexbox:
  * Logotipo a la izquierda.
  * Menú de navegación en el centro con espaciado uniforme usando `gap`.
  * Botones de acción (Login y Registro) a la derecha.
* Haz que la cabecera quede pegada arriba al hacer scroll mediante `position: sticky; top: 0;`.

### Ejercicio 5: Dashboard con CSS Grid y Áreas Nombradas
* Maqueta la estructura de un panel de administración con `min-height: 100vh`:
* Utiliza `grid-template-areas` con las áreas `"header header"`, `"sidebar main"` y `"footer footer"`.
* La barra lateral debe medir `250px` fijos y el área principal debe ocupar el resto (`1fr`).

### Ejercicio 6: Alineación Perfecta de Tarjetas con Subgrid
* Crea un catálogo de 3 tarjetas de productos usando `repeat(auto-fit, minmax(280px, 1fr))`.
* Cada tarjeta debe tener: imagen, título, descripción y botón de compra.
* Aplica `grid-row: span 4` y `grid-template-rows: subgrid` para garantizar que los botones de compra queden **matemáticamente alineados en la misma línea horizontal** en todas las tarjetas, sin importar la longitud del título.

---

## 🟠 Bloque 3: Fluidez, Componentes y Variables (Módulos 9 al 14)

### Ejercicio 7: Sección Hero Mobile-First con Rangos Modernos
* Diseña una sección Hero comenzando por el diseño móvil a 1 sola columna.
* Añade un breakpoint con la sintaxis moderna de rangos `@media (width >= 768px)` para transformarlo en 2 columnas equilibradas.
* Define el tamaño del título principal usando `clamp(2rem, 5vw, 4rem)`.

### Ejercicio 8: Tarjeta Auto-Adaptable con Container Queries
* Declara un contenedor con `container-type: inline-size`.
* Diseña una tarjeta de usuario que se muestre en formato vertical cuando su contenedor mida menos de `450px`, y cambie a formato horizontal con la foto al lado cuando su contenedor mida `450px` o más mediante `@container`.

### Ejercicio 9: Modo Oscuro en una Línea con `light-dark()`
* Declara en `:root` los tokens semánticos de fondo y texto utilizando `light-dark()`.
* Añade un botón que alterne `data-theme="dark"` en el `<html>` y comprueba cómo el diseño conmuta de tema instantáneamente.

### Ejercicio 10: Formulario Inteligente sin JS con `:has()`
* Diseña un formulario con campos obligatorios.
* Utiliza `form:has(input:invalid)` para aplicar un borde rojo sutil en todo el formulario cuando haya errores.
* Utiliza `label:has(input:checked)` para resaltar las opciones activas en un grupo de radio buttons.

---

## 🔴 Bloque 4: Movimiento, Rendimiento y CSS Moderno (Módulos 15 al 18)

### Ejercicio 11: Giro Tridimensional Accesible
* Construye una tarjeta con efecto de giro 3D usando `perspective` y `transform-style: preserve-3d`.
* Incluye la media query `@media (prefers-reduced-motion: reduce)` para apagar la animación si el usuario tiene activada la reducción de movimiento en su sistema operativo.

### Ejercicio 12: Carrusel Magnético con Scroll Snap
* Maqueta una galería de imágenes horizontal con `overflow-x: auto` y `scroll-snap-type: x mandatory`.
* Cada imagen debe centrarse magnéticamente al soltar el dedo usando `scroll-snap-align: center`.
* Añade una barra de progreso en la parte superior que se complete al hacer scroll usando `animation-timeline: scroll()`.
