# Módulo 6: Formularios Completos

El Módulo 3 mostró lo esencial (`.form-control`, `.form-label`, `.form-select`). Los formularios reales necesitan bastante más: validación visual, campos agrupados, controles personalizados y distintos layouts. Este módulo cubre todo eso.

## 6.1 Estados de Validación

Bootstrap puede pintar un campo de verde o rojo según sea válido o inválido, y mostrar un mensaje justo debajo — sin escribir CSS propio.

```html
<div class="mb-3">
  <label for="usuario" class="form-label">Usuario</label>
  <input type="text" class="form-control is-valid" id="usuario" value="aldair_dev">
  <div class="valid-feedback">¡Nombre de usuario disponible!</div>
</div>

<div class="mb-3">
  <label for="correo" class="form-label">Correo electrónico</label>
  <input type="email" class="form-control is-invalid" id="correo" value="correo-mal-escrito">
  <div class="invalid-feedback">Por favor ingresa un correo válido.</div>
</div>
```

* **`.is-valid` / `.is-invalid`**: Se añaden manualmente (por ti o por JavaScript) para forzar el estado visual.
* **`.valid-feedback` / `.invalid-feedback`**: Están ocultos por defecto; Bootstrap los muestra automáticamente **solo** cuando el input hermano tiene la clase `.is-valid` o `.is-invalid`.

### Validación Nativa del Navegador (`.was-validated`)
Si prefieres usar la validación nativa de HTML (`required`, `type="email"`, `pattern`) en lugar de marcar clases a mano, agrega `.was-validated` al `<form>` después de que el usuario intente enviarlo (normalmente vía JavaScript al capturar el evento `submit`):

```html
<form class="was-validated">
  <input type="email" class="form-control" required>
  <div class="invalid-feedback">Este campo es obligatorio y debe ser un correo válido.</div>
</form>
```

## 6.2 `input-group`: Agrupar Texto o Botones con un Input

Perfecto para símbolos de moneda, unidades de medida, o un botón de acción pegado al campo.

```html
<div class="input-group mb-3">
  <span class="input-group-text">$</span>
  <input type="number" class="form-control" placeholder="0.00">
  <span class="input-group-text">MXN</span>
</div>

<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Buscar...">
  <button class="btn btn-primary" type="button">
    <i class="bi bi-search"></i>
  </button>
</div>
```

## 6.3 Labels Flotantes (`.form-floating`)

Un patrón moderno donde el `label` empieza superpuesto sobre el input y "flota" hacia arriba cuando el usuario escribe o el campo tiene foco.

```html
<div class="form-floating mb-3">
  <input type="email" class="form-control" id="floatEmail" placeholder="nombre@ejemplo.com">
  <label for="floatEmail">Correo electrónico</label>
</div>
```

> **Nota:** `.form-floating` requiere que el `<input>` venga **antes** que el `<label>` en el HTML (al revés de lo habitual), porque el efecto visual depende de un selector CSS que solo puede "mirar hacia adelante".

## 6.4 Checkboxes, Radios y Switches

```html
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="terminos">
  <label class="form-check-label" for="terminos">Acepto los términos y condiciones</label>
</div>

<div class="form-check">
  <input class="form-check-input" type="radio" name="plan" id="planBasico" checked>
  <label class="form-check-label" for="planBasico">Plan Básico</label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="plan" id="planPro">
  <label class="form-check-label" for="planPro">Plan Pro</label>
</div>

<!-- Switch: el mismo checkbox, con apariencia de interruptor -->
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="notificaciones">
  <label class="form-check-label" for="notificaciones">Activar notificaciones</label>
</div>
```

## 6.5 Layouts de Formulario

### Formulario en Línea (usando utilidades del Grid)
```html
<form class="row row-cols-lg-auto g-3 align-items-center">
  <div class="col-12">
    <input type="text" class="form-control" placeholder="Buscar">
  </div>
  <div class="col-12">
    <button type="submit" class="btn btn-primary">Buscar</button>
  </div>
</form>
```

### Formulario Horizontal (label a la izquierda, campo a la derecha)
```html
<div class="row mb-3">
  <label for="nombreCompleto" class="col-sm-3 col-form-label">Nombre completo</label>
  <div class="col-sm-9">
    <input type="text" class="form-control" id="nombreCompleto">
  </div>
</div>
```

## 6.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Marcar un campo como válido/inválido a mano | `.is-valid` / `.is-invalid` + `.valid-feedback` / `.invalid-feedback` |
| Validación nativa del navegador con estilo Bootstrap | `.was-validated` en el `<form>` |
| Prefijo/sufijo (moneda, unidad, botón pegado) | `.input-group` |
| Label que flota sobre el input | `.form-floating` |
| Interruptor visual en vez de checkbox cuadrado | `.form-switch` |
| Formulario compacto en una sola línea | `row row-cols-auto g-3` |
| Label a la izquierda, campo a la derecha | Grid con `.col-form-label` |
