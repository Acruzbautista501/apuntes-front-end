# Módulo 17: Ejercicios de Práctica

Antes de abordar el Proyecto Integrador, conviene practicar cada bloque de conceptos por separado, en piezas pequeñas y autocontenidas. Cada ejercicio indica los módulos que pone en juego para que puedas repasarlos si te atoras.

## 17.1 Fundamentos y Grid (Módulos 1-2)

1. **Plantilla base + grid simple.** Crea una página con la plantilla base de Bootstrap (vía CDN) y monta una cuadrícula de 3 columnas iguales que se apilen en móvil y pasen a 2 columnas en tablet.
2. **Orden y alineación.** Construye una fila con 4 cajas donde una use `order-*` para aparecer primero solo en móvil. Centra el conjunto vertical y horizontalmente con `justify-content` y `align-items`.

## 17.2 Componentes y Utilidades (Módulos 3-4)

3. **Galería de tarjetas.** Arma una galería de 6 `.card` con imagen, título y botón, usando solo utilidades de espaciado (`m-`, `p-`) y sombra (`shadow`) — sin escribir CSS propio.
4. **Navbar responsiva.** Recrea una barra de navegación con logo, 4 enlaces y un botón de acción, que colapse en menú hamburguesa en pantallas pequeñas.

## 17.3 Interactividad y Formularios (Módulos 5-6)

5. **Formulario con validación.** Construye un formulario de registro con `form-floating`, al menos un `input-group` (por ejemplo un prefijo de moneda o un icono), validación nativa (`.was-validated`) y un grupo de checkboxes o switches.
6. **Acordeón + modal.** Haz un FAQ con `.accordion` y, aparte, un ítem cuyo contenido "ver detalle" se abra en un `.modal`.

## 17.4 Grid Avanzado y Más Componentes (Módulos 7-9)

7. **Panel de precios.** Diseña un layout de planes/precios con `row-cols-*` (columnas automáticas) y un grid anidado dentro de al menos una columna.
8. **Listado paginado.** Construye un `.list-group` interactivo con `.pagination` funcional y un `.breadcrumb` que refleje la ruta actual.
9. **Offcanvas + toast.** Agrega un panel lateral `.offcanvas` con filtros, y un `.toast` de confirmación que se dispare al enviar un formulario.

## 17.5 API de JavaScript y Accesibilidad (Módulos 10-11)

10. **Modal 100% por JS.** Sin usar ningún botón con `data-bs-toggle`, abre un modal solo con JavaScript (`new bootstrap.Modal(...)`) tras 2 segundos de cargada la página, y ciérralo automáticamente al enviar su formulario interno. Usa el evento `shown.bs.modal` para enfocar el primer input.
11. **Auditoría de accesibilidad.** Revisa una página anterior con lector de pantalla (o inspeccionando el DOM): agrega `aria-label` y `.visually-hidden` donde falten, y verifica que el foco se maneje bien al abrir/cerrar un offcanvas.

## 17.6 Personalización (Módulos 12-14)

12. **Sass propio.** Instala Bootstrap vía npm, crea un `mi-tema.scss` que sobrescriba `$primary` y `$border-radius`, y agregue un color nuevo al mapa `$theme-colors` antes de compilar.
13. **Modo oscuro persistente.** Implementa un toggle de tema con `data-bs-theme`, persistido en `localStorage`, reemplazando cualquier color fijo por `bg-body`/`text-body`.
14. **Utilidad nueva.** Usa la Utility API para crear una utilidad responsiva propia (por ejemplo `rotate-*`) y aplícala en algún componente ya construido.

## 17.7 Frameworks y Rendimiento (Módulos 15-16)

15. **Componente controlado.** Si trabajas con Vue o React, monta un modal de Bootstrap controlado desde `onMounted`/`useEffect`, sin manipular el DOM directamente fuera del ciclo de vida del framework.
16. **Comparativa de build.** Toma cualquier ejercicio anterior, compílalo importando solo los parciales de Sass que usa, y compara el peso del CSS final contra importar Bootstrap completo sin optimizar.

## 17.8 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto, a diferencia del Módulo 18.
* Cuando te sientas cómodo resolviendo estos ejercicios sueltos, estás listo para el Proyecto Integrador.
