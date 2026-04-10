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

## 5.3 Acordeones (`.accordion`)
Perfectos para secciones de "Preguntas Frecuentes" (FAQ) o cuando tienes mucho texto y quieres ahorrar espacio. Permiten expandir y colapsar secciones de contenido.

* Usa la clase `.accordion` para el contenedor padre.
* Cada sección es un `.accordion-item`.
* El botón disparador debe tener `data-bs-toggle="collapse"`.

## 5.4 Carrusel de Imágenes (`.carousel`)
Es el clásico "slider" o deslizador de imágenes que suele ir en la parte superior de las páginas (Hero Section).

* **`.carousel-inner`**: Contiene las imágenes.
* **`.carousel-item`**: Cada diapositiva (una debe tener la clase `.active` para mostrarse al inicio).
* **`.carousel-control-prev/next`**: Los botones de flechas para navegar.

## 5.5 Tooltips y Popovers
Son pequeñas burbujas de información que aparecen al pasar el cursor o hacer clic.

* **Tooltips:** Texto corto al pasar el mouse (`hover`).
* **Popovers:** Más grandes, pueden incluir títulos y aparecer al hacer clic.

> **⚠️ NOTA IMPORTANTE:** A diferencia de los otros componentes, los Tooltips y Popovers **no funcionan automáticamente**. Debes activarlos con una pequeña línea de JavaScript que encontrarás en la documentación oficial, ya que por rendimiento vienen desactivados por defecto.

## 5.6 Proyecto Final Sugerido
Ahora que terminaste los 5 módulos, el siguiente paso lógico es unir todo. Intenta construir una **Landing Page** sencilla que incluya:
1.  **Navbar** fija arriba.
2.  **Carrusel** con 2 o 3 fotos de bienvenida.
3.  **Grid** con 3 columnas que contengan **Cards** de servicios.
4.  Un **Botón** en cada card que abra un **Modal** con más información.
5.  Un **Footer** oscuro con clases de **Utilidades** (`bg-dark`, `py-5`, `text-center`).

---

### Conclusión del curso rápido
¡Felicidades! Has pasado de no saber nada de Bootstrap a entender su estructura, diseño y dinamismo. 

Recuerda que Bootstrap es una herramienta de **productividad**. No intentes memorizar cada clase; lo importante es saber que la utilidad existe (ej. "sé que hay algo para márgenes") y luego consultar la documentación oficial para copiar el nombre exacto.