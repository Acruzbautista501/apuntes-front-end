# Módulo 8: Componentes Adicionales

El Módulo 3 cubrió los componentes más usados (botones, tarjetas, navbar, formularios básicos, alertas). Bootstrap trae varios más, cada uno resolviendo un problema de interfaz muy específico y común.

## 8.1 Dropdowns (Menús Desplegables)

```html
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
    Opciones
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Editar</a></li>
    <li><a class="dropdown-item" href="#">Duplicar</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item text-danger" href="#">Eliminar</a></li>
  </ul>
</div>
```

* **`.dropdown-toggle`**: Agrega automáticamente la flechita indicadora al botón.
* **`data-bs-toggle="dropdown"`**: Es lo único necesario para que el menú funcione — no requiere JavaScript adicional.
* **`.dropdown-divider`**: Una línea separadora entre grupos de opciones.

## 8.2 Pagination (Paginación)

```html
<nav aria-label="Navegación de páginas">
  <ul class="pagination">
    <li class="page-item disabled">
      <a class="page-link" href="#">Anterior</a>
    </li>
    <li class="page-item active"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#">Siguiente</a>
    </li>
  </ul>
</nav>
```

* **`.active`**: Marca la página actual.
* **`.disabled`**: Deshabilita visualmente un botón (ej. "Anterior" en la primera página).

## 8.3 Breadcrumbs (Migas de Pan)

Indican al usuario dónde está dentro de la jerarquía del sitio.

```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Inicio</a></li>
    <li class="breadcrumb-item"><a href="#">Productos</a></li>
    <li class="breadcrumb-item active" aria-current="page">Teclados</li>
  </ol>
</nav>
```

El separador (`/` por defecto) se agrega automáticamente vía CSS entre cada `.breadcrumb-item` — no lo escribes en el HTML.

## 8.4 List Groups (Listas Interactivas)

Ideal para bandejas de notificaciones, listas de configuración o menús laterales.

```html
<ul class="list-group">
  <li class="list-group-item d-flex justify-content-between align-items-center">
    Mensajes nuevos
    <span class="badge bg-primary rounded-pill">14</span>
  </li>
  <li class="list-group-item active">Configuración de cuenta</li>
  <li class="list-group-item disabled">Facturación (próximamente)</li>
</ul>

<!-- Versión clickeable, con hover y estado activo -->
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action active">Perfil</a>
  <a href="#" class="list-group-item list-group-item-action">Seguridad</a>
</div>
```

## 8.5 Progress Bars (Barras de Progreso)

```html
<div class="progress" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar bg-success" style="width: 75%">75%</div>
</div>

<!-- Con animación de rayas en movimiento -->
<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 60%"></div>
</div>
```

> El ancho (`width`) se define con un estilo en línea o una variable CSS, porque es un valor dinámico que normalmente viene calculado desde tu aplicación (por ejemplo, `style="width: ${porcentaje}%"` en un framework).

## 8.6 Spinners (Indicadores de Carga)

```html
<!-- Spinner circular -->
<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Cargando...</span>
</div>

<!-- Spinner de puntos crecientes -->
<div class="spinner-grow text-success" role="status">
  <span class="visually-hidden">Cargando...</span>
</div>

<!-- Dentro de un botón, mientras se procesa una acción -->
<button class="btn btn-primary" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Guardando...
</button>
```

> **`.visually-hidden`** oculta el texto visualmente pero lo mantiene disponible para lectores de pantalla — sin él, un usuario con lector de pantalla solo escucharía silencio mientras algo carga. Se profundiza en el Módulo 11, *Accesibilidad*.

## 8.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un menú que se despliega desde un botón | `.dropdown` + `data-bs-toggle="dropdown"` |
| Navegación entre páginas numeradas | `.pagination` |
| Mostrar la ruta jerárquica actual | `.breadcrumb` |
| Una lista interactiva con estados (activo, deshabilitado) | `.list-group` |
| Mostrar el avance de una tarea (subida de archivo, progreso) | `.progress` |
| Indicar que algo está cargando | `.spinner-border` / `.spinner-grow` |
