# Módulo 11: Accesibilidad en Bootstrap

Bootstrap incluye buen soporte de accesibilidad "de fábrica" en sus componentes, pero solo si los usas correctamente. Este módulo cubre las utilidades y prácticas específicas de Bootstrap que garantizan que tu sitio sea usable con teclado y lectores de pantalla.

## 11.1 `.visually-hidden`: Contenido Solo para Lectores de Pantalla

Ya apareció en el Módulo 8 (spinners) y en el Módulo 9 — es la utilidad más importante de accesibilidad en Bootstrap. Oculta contenido **visualmente** sin removerlo del árbol de accesibilidad, a diferencia de `display: none`, que lo oculta para todos por igual.

```html
<button class="btn-close" aria-label="Cerrar"></button>

<!-- Alternativa cuando necesitas texto real en el DOM, no solo un atributo -->
<a class="btn btn-primary" href="/perfil">
  <i class="bi bi-person"></i>
  <span class="visually-hidden">Ir a mi perfil</span>
</a>
```

> **`.visually-hidden-focusable`** es una variante: el contenido está oculto normalmente, pero **se hace visible** si recibe foco por teclado. Es el patrón estándar para un enlace de "Saltar al contenido principal" (*skip link*), que solo los usuarios de teclado necesitan ver.

```html
<a class="visually-hidden-focusable" href="#contenido-principal">Saltar al contenido principal</a>
```

> **No combines `.visually-hidden-focusable` con `.visually-hidden` en el mismo elemento.** A diferencia de Bootstrap 4 (donde `.sr-only`/`.sr-only-focusable` sí se usaban juntas), en Bootstrap 5 `.visually-hidden-focusable` ya funciona por sí sola — es un error común al migrar código antiguo y termina anulando el efecto.

## 11.2 `aria-*` que Bootstrap Ya Espera que Agregues

Bootstrap construye el comportamiento de sus componentes, pero **no puede adivinar** las etiquetas descriptivas — esas siguen siendo tu responsabilidad.

```html
<!-- Navegación: identifica el propósito del <nav> para tecnología de asistencia -->
<nav aria-label="Navegación principal">...</nav>

<!-- Página actual en un breadcrumb o paginación -->
<li class="page-item active"><a class="page-link" aria-current="page" href="#">3</a></li>

<!-- Barra de progreso: valores mínimo, máximo y actual -->
<div class="progress" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  ...
</div>

<!-- Notificación que debe anunciarse de inmediato al lector de pantalla -->
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">...</div>
```

## 11.3 Foco en Modales y Offcanvas

Bootstrap ya maneja automáticamente el **atrapado de foco** (*focus trap*) dentro de un Modal u Offcanvas abierto: mientras está abierto, la tecla `Tab` no puede escapar hacia elementos de la página detrás, y al cerrarlo, el foco regresa automáticamente al botón que lo abrió. Esto ocurre solo si:

* No interceptas manualmente el evento `keydown` de forma que rompa el comportamiento nativo.
* El disparador (*trigger*) es un elemento enfocable real (`<button>`, no un `<div>` con un `onclick`).

```html
<!-- CORRECTO: un <button> real es enfocable por naturaleza -->
<button data-bs-toggle="modal" data-bs-target="#miModal">Abrir</button>

<!-- INCORRECTO: un <div> no recibe foco de teclado por defecto -->
<div data-bs-toggle="modal" data-bs-target="#miModal">Abrir</div>
```

## 11.4 Contraste de Color en el Sistema de Temas

La propia documentación oficial de Bootstrap advierte que **algunas combinaciones de su paleta por defecto** (`primary`, `danger`, etc.) pueden quedar por debajo del contraste mínimo exigido por WCAG 2.2 — **4.5:1** para texto normal y **3:1** para elementos no textuales —, especialmente sobre fondos claros. No es un riesgo que aparezca solo al personalizar la paleta (Módulo 12, *Personalización con Sass*): es tu responsabilidad verificar el contraste incluso usando los colores de Bootstrap tal como vienen, y con más razón después de personalizarlos.

```scss
// Si cambias $primary por un color más claro, revisa el contraste del texto blanco encima
$primary: #93c5fd; // Un azul muy claro — "primary" con texto blanco podría fallar el contraste AA
```

> Usa el inspector de accesibilidad de Chrome/Firefox DevTools para verificar cualquier combinación de `bg-primary` + `text-white` después de personalizar el tema.

## 11.5 `prefers-reduced-motion`: Respetar la Preferencia de Movimiento Reducido

Bootstrap tiene soporte nativo para la preferencia de sistema operativo `prefers-reduced-motion` — no es algo que tengas que implementar tú mismo:

* Las transiciones de Modales, Offcanvas y Collapse (`.fade`) se desactivan automáticamente si el usuario activó "reducir movimiento" en su sistema.
* Los Spinners siguen girando, pero a una velocidad de animación más lenta.
* La clase `.smooth-scroll` (o la propiedad CSS `scroll-behavior: smooth` que Bootstrap aplica) solo se activa cuando el usuario **no** pidió movimiento reducido.

No necesitas agregar nada para que esto funcione — es el comportamiento por defecto del CSS de Bootstrap. Sí es tu responsabilidad respetar la misma preferencia en cualquier animación **propia** que agregues (ej. con `@media (prefers-reduced-motion: reduce)` en tu CSS).

## 11.6 Componentes que Requieren Atención Extra

| Componente | Riesgo de accesibilidad | Solución |
| :--- | :--- | :--- |
| Carrusel | Cambia de contenido automáticamente, puede confundir a lectores de pantalla | Agrega controles de pausa visibles; evita `data-bs-ride="carousel"` en contenido crítico |
| Tooltips | Solo aparecen con `hover`, inaccesibles por teclado si el trigger no es enfocable | Usa siempre un `<button>` o `<a>` como disparador, nunca un `<span>` |
| Dropdowns con solo íconos | Sin texto, el propósito no es claro para un lector de pantalla | Agrega `aria-label` descriptivo al botón disparador |
| Botones deshabilitados (`disabled`) | Se ignoran por completo en la navegación por `Tab` | Considera `aria-disabled="true"` en vez de `disabled` si el usuario debe poder enfocarlo para leer por qué está desactivado |

## 11.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Texto descriptivo invisible para un ícono sin label | `.visually-hidden` |
| Un "skip link" que solo aparece al navegar con teclado | `.visually-hidden-focusable` |
| Que un lector de pantalla anuncie el estado actual de un componente | `aria-current`, `aria-valuenow`, `aria-live` |
| Que el foco no se "escape" de un modal abierto | Usar `<button>` reales como disparadores (Bootstrap hace el resto) |
| Respetar la preferencia de movimiento reducido del usuario | Ya viene por defecto en las transiciones de Bootstrap |
