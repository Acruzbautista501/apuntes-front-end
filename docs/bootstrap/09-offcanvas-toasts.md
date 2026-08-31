# Módulo 9: Offcanvas y Toasts

Dos componentes de interfaz muy usados en aplicaciones modernas (menús laterales deslizantes y notificaciones flotantes) que no tienen un equivalente HTML nativo sencillo, por lo que Bootstrap resuelve ambos con muy poco código.

## 9.1 Offcanvas: Paneles Deslizantes

Un **Offcanvas** es un panel que se desliza desde un borde de la pantalla (izquierda, derecha, arriba o abajo), típicamente usado para menús de navegación en móvil, carritos de compra o filtros.

```html
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#miOffcanvas" aria-controls="miOffcanvas">
  Abrir Menú
</button>

<div class="offcanvas offcanvas-start" tabindex="-1" id="miOffcanvas" aria-labelledby="miOffcanvasTitulo">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="miOffcanvasTitulo">Menú</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
  </div>
  <div class="offcanvas-body">
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Inicio</li>
      <li class="list-group-item">Productos</li>
      <li class="list-group-item">Contacto</li>
    </ul>
  </div>
</div>
```

* **`aria-controls`** (en el disparador) y **`aria-labelledby`** (en el offcanvas, apuntando al `id` de su título): conectan ambos elementos para lectores de pantalla — sin ellos, el offcanvas se anuncia sin contexto de qué es o quién lo abrió.
* **`aria-label="Cerrar"`** en el botón `.btn-close`: es un botón de solo ícono (sin texto visible), así que necesita esta etiqueta para ser comprensible por lectores de pantalla.
* **`data-bs-backdrop="static"`**: igual que en el Modal, impide que un clic fuera del offcanvas lo cierre.
* **`data-bs-scroll="true"`**: permite hacer scroll en el `<body>` de fondo mientras el offcanvas sigue abierto (por defecto el scroll del fondo queda bloqueado).

### Dirección del Deslizamiento
| Clase | Desde dónde aparece |
| :--- | :--- |
| `.offcanvas-start` | Izquierda (el más común, para menús) |
| `.offcanvas-end` | Derecha (común para carritos de compra) |
| `.offcanvas-top` | Arriba |
| `.offcanvas-bottom` | Abajo (común para acciones rápidas en móvil) |

> **Offcanvas vs. Modal:** ambos bloquean el contenido de fondo, pero el Offcanvas se desliza desde un borde (ideal para navegación y listas largas), mientras que el Modal aparece centrado (ideal para confirmaciones y formularios cortos). Comparten la misma lógica de `data-bs-toggle`/`data-bs-dismiss` que ya viste en el Módulo 5.

## 9.2 Toasts: Notificaciones Flotantes

Un **Toast** es un mensaje pequeño y temporal que aparece en una esquina de la pantalla (típicamente para confirmar una acción: "Guardado con éxito"), y se oculta solo después de unos segundos.

```html
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="miToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <strong class="me-auto">Notificación</strong>
      <small>Hace un momento</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">
      Tu cambio se guardó correctamente.
    </div>
  </div>
</div>
```

### El Detalle Importante: los Toasts SIEMPRE Necesitan JavaScript

A diferencia del Modal o el Offcanvas, un Toast casi nunca lo dispara un clic directo del usuario — normalmente aparece como **reacción a una acción** (guardar un formulario, recibir un mensaje). Por eso no basta con `data-bs-toggle`; siempre debes mostrarlo desde código:

```javascript
const elementoToast = document.getElementById('miToast');
const toast = new bootstrap.Toast(elementoToast);
toast.show();
```

Esto se relaciona directamente con el Módulo 10, *API de JavaScript Programática*: los Toasts son el ejemplo más común de un componente de Bootstrap que necesitas controlar 100% desde tu propio código, no desde atributos HTML estáticos.

**Configurar el auto-ocultado sin JS extra:** aunque mostrarlo requiere JavaScript, el *comportamiento* de auto-ocultado sí se configura declarativamente con atributos en el propio `.toast`:
* **`data-bs-autohide="false"`**: desactiva el ocultado automático (el toast se queda visible hasta que el usuario lo cierra).
* **`data-bs-delay="5000"`**: cambia el tiempo antes de ocultarse, en milisegundos (por defecto son 5000 = 5 segundos).

## 9.3 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un menú de navegación que se desliza en móvil | `.offcanvas.offcanvas-start` |
| Un carrito de compra deslizante | `.offcanvas.offcanvas-end` |
| Confirmar visualmente que una acción tuvo éxito | `.toast`, mostrado vía JavaScript |
| Bloquear el contenido de fondo mientras se navega | Offcanvas o Modal, según el contexto |
