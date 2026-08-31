# Módulo 5: Interactividad y Componentes Avanzados
Llegamos al **Módulo 5**, el nivel donde tu página deja de ser estática y empieza a "reaccionar" a lo que hace el usuario. En este módulo, Bootstrap utiliza **JavaScript** por debajo.

Lo mejor de todo es que **no necesitas saber programar en JS** para que funcionen; Bootstrap ya hizo el trabajo sucio. Solo necesitas copiar la estructura HTML y usar los atributos `data-bs-*`.

## 5.1 El "Poder" de los Atributos `data-bs`
Para que un componente sea interactivo (como abrir un menú o cerrar una alerta), Bootstrap utiliza atributos especiales en el HTML:
* **`data-bs-toggle`**: Define *qué* tipo de interacción queremos (ej. "modal", "collapse", "dropdown").
* **`data-bs-target`**: Indica *a qué elemento* debe afectar la acción (usando el ID del elemento).

## 5.2 Ventanas Modales (`.modal`)
Un modal es una caja que aparece sobre el contenido principal, bloqueando el resto de la página hasta que se cierra. Es ideal para confirmaciones de borrado, formularios de inicio de sesión o detalles de un producto.

**Partes de un Modal:**
1.  **El Disparador (Trigger):** Generalmente un botón que tiene el `data-bs-target="#miModal"`.
2.  **El Diálogo (`.modal-dialog`):** Controla el tamaño y posición de la ventana.
3.  **El Contenido (`.modal-content`):** Incluye el encabezado (`.modal-header`), el cuerpo (`.modal-body`) y el pie (`.modal-footer`).

```html
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Abrir ventana
</button>

<div class="modal fade" id="exampleModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Título del Modal</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        Aquí va la información importante.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
```

**Evitar que se cierre por accidente:** agrega `data-bs-backdrop="static"` (el clic fuera del modal ya no lo cierra) y/o `data-bs-keyboard="false"` (la tecla Esc ya no lo cierra) en el `<div class="modal">` — útil para formularios largos donde perder el contenido sería frustrante.

## 5.3 Acordeones (`.accordion`)
Perfectos para secciones de "Preguntas Frecuentes" (FAQ) o cuando tienes mucho texto y quieres ahorrar espacio. Permiten expandir y colapsar secciones de contenido.

* Usa la clase `.accordion` para el contenedor padre.
* Cada sección es un `.accordion-item`.
* El botón disparador debe tener `data-bs-toggle="collapse"`.
* **`data-bs-parent="#idDelAcordeon"`** en cada `.accordion-collapse`: es lo que hace que al abrir un panel se cierren automáticamente los demás — el comportamiento "acordeón" real. Sin este atributo, cada panel se comporta como un `.collapse` independiente y pueden quedar varios abiertos a la vez (útil si eso es justo lo que quieres, ej. un modo "siempre abierto").
* **`.accordion-flush`** en el contenedor `.accordion`: quita los bordes y esquinas redondeadas, para que el acordeón se vea integrado al ancho completo de su contenedor padre (común dentro de un `.card` o un sidebar).

## 5.4 Carrusel de Imágenes (`.carousel`)
Es el clásico "slider" o deslizador de imágenes que suele ir en la parte superior de las páginas (Hero Section).

* **`.carousel-inner`**: Contiene las imágenes.
* **`.carousel-item`**: Cada diapositiva (una debe tener la clase `.active` para mostrarse al inicio).
* **`.carousel-control-prev/next`**: Los botones de flechas para navegar.
* **`data-bs-ride="carousel"`** en el contenedor `.carousel`: hace que el deslizador avance automáticamente al cargar la página. Sin este atributo, el carrusel solo avanza cuando el usuario hace clic en las flechas.
* **`.carousel-indicators`**: los puntitos de navegación en la parte inferior; cada uno usa `data-bs-slide-to="N"` (el índice de la diapositiva, empezando en 0) para saltar directamente a ella.

## 5.5 Tooltips y Popovers
Son pequeñas burbujas de información que aparecen al pasar el cursor o hacer clic.

* **Tooltips:** Texto corto al pasar el mouse (`hover`).
* **Popovers:** Más grandes, pueden incluir títulos y aparecer al hacer clic.

> **⚠️ NOTA IMPORTANTE:** A diferencia de los otros componentes, los Tooltips y Popovers **no funcionan automáticamente**. Debes activarlos manualmente con JavaScript, ya que por rendimiento vienen desactivados por defecto:

```html
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-title="Información extra">
  Pasa el mouse aquí
</button>
```

```javascript
// Bootstrap NO activa los tooltips solo — debes inicializarlos así:
const tooltipTriggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tooltipTriggers.forEach(el => new bootstrap.Tooltip(el));
```

**Dependen de Popper.js:** tanto los tooltips como los popovers (y los dropdowns) usan la librería **Popper** por debajo para calcular dónde posicionarse sin salirse de la pantalla. Si usas `bootstrap.bundle.min.js` (el archivo que se usa en todo este curso) ya viene incluido; si en cambio cargas `bootstrap.min.js` "a secas", debes agregar `popper.min.js` aparte **antes** de él, o los tooltips/popovers simplemente no aparecerán.

**Popovers con contenido, no solo tooltips:** lo que distingue a un popover de un tooltip es el atributo `data-bs-content` (el cuerpo, más largo) además de `data-bs-title` (el título):

```html
<button type="button" class="btn btn-secondary" data-bs-toggle="popover"
        data-bs-title="Título" data-bs-content="Contenido más largo del popover.">
  Haz clic aquí
</button>
```

```javascript
const popoverTriggers = document.querySelectorAll('[data-bs-toggle="popover"]');
popoverTriggers.forEach(el => new bootstrap.Popover(el));
```

El Módulo 10, *API de JavaScript Programática*, explica a fondo por qué componentes como este requieren instanciarse manualmente mientras que un Modal o un Acordeón funcionan solo con atributos `data-bs-*`.

## 5.6 Scrollspy: Navegación que se Resalta Sola
**Scrollspy** vigila el scroll de la página y marca automáticamente como "activo" (`.active`) el ítem del menú que corresponde a la sección visible — muy común en documentaciones de una sola página (de hecho, así funciona el índice lateral de muchos sitios de documentación).

```html
<body data-bs-spy="scroll" data-bs-target="#navegacion" data-bs-root-margin="0px 0px -70%" tabindex="0">

  <nav id="navegacion" class="navbar">
    <a class="nav-link" href="#seccion1">Sección 1</a>
    <a class="nav-link" href="#seccion2">Sección 2</a>
  </nav>

  <section id="seccion1">...</section>
  <section id="seccion2">...</section>
</body>
```

* **`data-bs-spy="scroll"`**: Va en el contenedor con scroll (normalmente el `<body>`).
* **`data-bs-target`**: Apunta al `id` del menú de navegación que debe resaltarse.
* **`data-bs-root-margin`**: Ajusta cuándo se considera "activa" una sección (útil si tienes un navbar fijo que tapa el inicio de cada sección), ej. `data-bs-root-margin="0px 0px -40%"`. Reemplaza a `data-bs-offset`, que sigue funcionando por compatibilidad pero está **deprecado desde Bootstrap 5.1.3** y se eliminará en la versión 6.

## 5.7 Proyecto Final Sugerido

Con los Módulos 1 al 5 ya tienes lo esencial de Bootstrap. El Módulo 18, *Proyecto Integrador*, retoma esta misma idea de "landing page" pero incorporando también los módulos avanzados (formularios completos, Offcanvas, Sass, modo oscuro) para un proyecto de nivel profesional completo.

Como práctica rápida antes de continuar, intenta construir una **landing page** sencilla que incluya:
1.  **Navbar** fija arriba.
2.  **Carrusel** con 2 o 3 fotos de bienvenida.
3.  **Grid** con 3 columnas que contengan **Cards** de servicios.
4.  Un **Botón** en cada card que abra un **Modal** con más información.
5.  Un **Footer** oscuro con clases de **Utilidades** (`bg-dark`, `py-5`, `text-center`).