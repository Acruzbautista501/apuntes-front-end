# Módulo 10: API de JavaScript Programática

Hasta ahora, todos los componentes interactivos se controlaron con atributos `data-bs-*` en el HTML. Eso funciona perfecto cuando la interacción la dispara un clic directo del usuario. Pero en aplicaciones reales, muchas veces necesitas abrir un modal, cerrar un toast o destruir un tooltip **desde tu propia lógica de JavaScript** — después de una respuesta de una API, un temporizador, o una validación. Para eso existe la API programática.

## 10.1 El Patrón General

Cada componente interactivo de Bootstrap (Modal, Toast, Collapse, Dropdown, Offcanvas, Tooltip, Popover) tiene una **clase de JavaScript** con el mismo nombre, disponible en el objeto global `bootstrap`.

```javascript
// Patrón general: nueva instancia de un componente, atada a un elemento del DOM
const elemento = document.querySelector('#miElemento');
const instancia = new bootstrap.NombreDelComponente(elemento, opciones);

// Cada instancia tiene métodos como:
instancia.show();   // Mostrar
instancia.hide();   // Ocultar
instancia.toggle();  // Alternar
instancia.dispose(); // Destruir la instancia y liberar memoria
```

## 10.2 Ejemplo: Abrir un Modal sin un Botón Visible

Imagina que quieres mostrar un modal de "Sesión expirada" automáticamente después de 30 minutos de inactividad — no hay ningún botón que el usuario haya presionado.

```javascript
const modalElemento = document.getElementById('modalSesionExpirada');
const modal = new bootstrap.Modal(modalElemento);

setTimeout(() => {
  modal.show();
}, 30 * 60 * 1000);
```

## 10.3 Ejemplo: Cerrar un Modal Después de Guardar

```javascript
document.getElementById('formGuardar').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  await guardarEnServidor(); // Tu propia lógica, ej. un fetch()

  const modalElemento = document.getElementById('modalFormulario');
  const modal = bootstrap.Modal.getInstance(modalElemento); // Recupera la instancia YA existente
  modal.hide();
});
```

> **`bootstrap.Modal.getInstance()`** recupera una instancia que ya fue creada (por ejemplo, automáticamente al hacer clic en un `data-bs-toggle="modal"`), en lugar de crear una nueva. Crear una segunda instancia sobre el mismo elemento puede causar comportamientos duplicados o inesperados.

## 10.4 Eventos de Ciclo de Vida

Cada componente dispara eventos personalizados en momentos clave, útiles para ejecutar tu propia lógica exactamente cuando algo abre o cierra.

```javascript
const modalElemento = document.getElementById('miModal');

modalElemento.addEventListener('show.bs.modal', () => {
  console.log('El modal está a punto de mostrarse');
});

modalElemento.addEventListener('shown.bs.modal', () => {
  console.log('El modal ya terminó su animación de entrada');
  document.getElementById('primerInput').focus(); // Foco automático al abrir
});

modalElemento.addEventListener('hidden.bs.modal', () => {
  console.log('El modal ya terminó de cerrarse — buen momento para limpiar el formulario');
});
```

| Prefijo del evento | Cuándo se dispara |
| :--- | :--- |
| `show.bs.*` | Justo al iniciar la animación de apertura |
| `shown.bs.*` | Cuando la animación de apertura terminó |
| `hide.bs.*` | Justo al iniciar la animación de cierre |
| `hidden.bs.*` | Cuando la animación de cierre terminó |

## 10.5 Los Componentes que SIEMPRE Necesitan JavaScript

Tres componentes, a diferencia del Modal o el Acordeón, **nunca** se activan solo con atributos HTML — Bootstrap los deja desactivados por defecto por razones de rendimiento (escanear cada tooltip/popover del DOM automáticamente sería costoso en páginas grandes):

```javascript
// Tooltips: hay que inicializar cada uno manualmente
document.querySelectorAll('[data-bs-toggle="tooltip"]')
  .forEach(el => new bootstrap.Tooltip(el));

// Popovers: mismo caso
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(el => new bootstrap.Popover(el));

// Toasts: casi siempre se disparan por lógica, no por clic (Módulo 9)
new bootstrap.Toast(document.getElementById('miToast')).show();
```

## 10.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Abrir/cerrar un componente sin que el usuario haga clic | `new bootstrap.Componente(el)` + `.show()` / `.hide()` |
| Reaccionar a un componente ya existente en el DOM | `bootstrap.Componente.getInstance(el)` |
| Ejecutar código justo cuando algo termina de abrir/cerrar | Eventos `shown.bs.*` / `hidden.bs.*` |
| Enfocar automáticamente un input al abrir un modal | `shown.bs.modal` + `.focus()` |
| Activar Tooltips o Popovers | Inicialización manual, siempre |

> **Nota para quien viene de Vue o React (ver Módulo 15):** en un framework moderno, rara vez llamas a `new bootstrap.Modal()` directamente. En su lugar, usas los eventos de ciclo de vida del framework (`onMounted`, `useEffect`) para inicializar el componente, y su propio sistema reactivo (`ref`, `useState`) para decidir cuándo mostrarlo — evitando que Bootstrap y el framework "peleen" por controlar el mismo elemento del DOM.
