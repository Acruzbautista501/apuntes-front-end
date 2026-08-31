# Módulo 3: Componentes Esenciales de Interfaz
Llegamos al **Módulo 3**, la parte más visual y divertida de Bootstrap. Aquí es donde dejamos de ver solo cajas vacías y empezamos a construir los elementos reales que el usuario ve e interactúa.

Los **componentes** son bloques de construcción listos para usar. Solo necesitas copiar la estructura HTML y Bootstrap se encarga de que se vean profesionales.

## 3.1 Colores y Tipografía (Utilidades de Texto)
Bootstrap tiene un sistema de colores basado en "temas" o "significados" en lugar de nombres de colores específicos.

* **Colores de Tema:**
    * `primary` (Azul: principal)
    * `secondary` (Gris: secundario)
    * `success` (Verde: éxito/positivo)
    * `danger` (Rojo: error/peligro)
    * `warning` (Amarillo: advertencia)
    * `info` (Cian: información)
    * `light` (Blanco/Gris muy claro)
    * `dark` (Negro/Gris muy oscuro)

**Uso en texto y fondos:**
Para aplicarlos, usas los prefijos `text-` o `bg-`.
Ejemplo: `<p class="text-danger">Este texto es rojo</p>` o `<div class="bg-primary text-white">Fondo azul con letras blancas</div>`.

### Iconos (Bootstrap Icons)
Bootstrap no incluye iconos en su paquete principal, pero mantiene una librería oficial hermana llamada **Bootstrap Icons**, con más de 2000 iconos SVG gratuitos que combinan perfectamente con el resto del framework.

**Instalación vía CDN (la más simple):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
```

**Uso:** cada ícono es una clase que aplicas a un `<i>` vacío.
```html
<i class="bi bi-heart-fill text-danger"></i>
<i class="bi bi-cart"></i>
<button class="btn btn-primary">
  <i class="bi bi-download"></i> Descargar
</button>
```

> **Nota:** el método de la CDN de arriba usa una **fuente web** (webfont), no SVG insertados en el DOM — por eso cada ícono se comporta como un carácter de texto: hereda `color` con `text-*` y su tamaño escala con `font-size`, igual que cualquier texto, sin configurar ancho/alto por separado. Bootstrap Icons también ofrece un método basado en SVG real (sprite `.svg` o `<svg>` inline) para cuando necesitas manipular el ícono como vector, pero es una instalación distinta a la de este ejemplo.

## 3.2 Botones (`.btn`)
Un botón en HTML puro es muy básico. Con Bootstrap, se transforma completamente.

* **Clase base:** Siempre debes usar `.btn`.
* **Clase de estilo:** Debes combinarla con un color, como `.btn-primary` o `.btn-outline-success` (para botones con borde y sin fondo sólido).
* **Tamaños:** Puedes usar `.btn-lg` (grande) o `.btn-sm` (pequeño).
* **`.btn-link`**: Un botón que se ve como un enlace de texto pero mantiene el mismo padding y comportamiento que el resto de botones — útil para acciones secundarias dentro de un grupo de botones.
* **`disabled`**: El atributo HTML nativo (no una clase) desactiva un `<button>`; en un `<a class="btn">` (que no soporta `disabled`) se simula agregando la clase `.disabled` y `aria-disabled="true"`.

**Ejemplo:**
```html
<button type="button" class="btn btn-primary">Enviar</button>
<a href="#" class="btn btn-outline-danger btn-sm">Eliminar</a>
```

## 3.3 Tarjetas (`.card`)
Es el componente más versátil para mostrar contenido (artículos, productos, perfiles).

**Estructura básica:**
```html
<div class="card" style="width: 18rem;">
  <img src="imagen.jpg" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Título de la Tarjeta</h5>
    <p class="card-text">Descripción breve del contenido que queremos mostrar.</p>
    <a href="#" class="btn btn-primary">Ir a algún lugar</a>
  </div>
</div>
```

La tarjeta también admite `.card-header` (una franja superior, ej. para un título de sección o pestañas) y `.card-footer` (una franja inferior, ej. para metadatos o acciones), ambos hermanos de `.card-body` dentro del mismo `.card`:

```html
<div class="card">
  <div class="card-header">Encabezado</div>
  <div class="card-body">...</div>
  <div class="card-footer text-body-secondary">Pie de tarjeta</div>
</div>
```

## 3.4 Barras de Navegación (`.navbar`)
Es el componente más complejo pero el más necesario. Bootstrap lo hace responsivo automáticamente (crea el menú "hamburguesa" en móviles).

* **`.navbar-expand-lg`**: Define en qué tamaño de pantalla el menú deja de estar colapsado (hamburguesa) y se muestra completo. Puedes usar cualquier breakpoint: `.navbar-expand-md`, `.navbar-expand-sm`, etc.
* **`data-bs-theme="dark"` / `data-bs-theme="light"`**: Ajusta el color del texto para que contraste con el fondo, colocado directamente en el `.navbar` (ver Módulo 13, *Modo Oscuro*). Es la forma **recomendada actualmente**: las clases `.navbar-light`/`.navbar-dark` que se veían en tutoriales antiguos están **deprecadas desde Bootstrap 5.2** en favor de este atributo.

**Estructura completa:**
```html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand" href="#">Mi Marca</a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navMenu">
      <ul class="navbar-nav ms-auto"> <!-- ms-auto empuja el menú a la derecha -->
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Servicios</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Contacto</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

**Tip:** Siempre es recomendable copiar la estructura base de la documentación oficial y luego personalizarla, ya que requiere muchas clases específicas para que el botón de menú funcione correctamente. Fíjate que el `.navbar-toggler` usa `data-bs-toggle="collapse"` — el mismo componente **Collapse** de JavaScript que usan los acordeones (Módulo 5).

## 3.5 Tablas Responsivas (`.table`)
Las tablas HTML nativas se ven anticuadas y, en móvil, se desbordan de la pantalla. Bootstrap las resuelve con dos capas de clases:

```html
<div class="table-responsive"> <!-- Permite scroll horizontal SOLO si la tabla no cabe -->
  <table class="table table-striped table-hover align-middle">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Producto</th>
        <th scope="col">Precio</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Monitor</td>
        <td>$250</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Teclado</td>
        <td>$45</td>
      </tr>
    </tbody>
  </table>
</div>
```

| Clase | Efecto |
| :--- | :--- |
| `.table` | Estilo base: espaciado y línea divisoria entre filas |
| `.table-striped` | Colorea filas alternas (efecto cebra) |
| `.table-hover` | Resalta la fila bajo el cursor |
| `.table-bordered` | Agrega bordes a todas las celdas |
| `.table-dark` | Versión de fondo oscuro |
| `.table-sm` | Reduce el padding, tabla más compacta |
| `.table-borderless` | Quita todos los bordes de la tabla |
| `.table-primary`, `.table-success`, `.table-danger`... | Colorea una fila o celda específica según su significado (ej. una fila de "cancelado" en `.table-danger`) — se aplican al `<tr>` o `<td>`, no a la `<table>` |
| `.table-responsive` | Envuelve la tabla; agrega scroll horizontal solo si es necesario |
| `.table-responsive-{sm\|md\|lg\|xl\|xxl}` | Igual que `.table-responsive`, pero el scroll solo se activa **por debajo** del breakpoint indicado — arriba de él la tabla se muestra normal |

> **`table-responsive` va en un `<div>` que envuelve la tabla, no en el `<table>` mismo.** Es un error común olvidarlo y preguntarse por qué la tabla sigue rompiendo el layout en móvil.

## 3.6 Formularios
Bootstrap limpia el estilo anticuado de los formularios del navegador y les da un aspecto limpio y uniforme.

* **`.form-control`**: La clase clave para los inputs (`<input>`, `<textarea>`). Hace que el input ocupe el 100% del ancho y se vea moderno.
* **`.form-label`**: Para los títulos de cada campo.
* **`.form-select`**: Para los menús desplegables.

**Ejemplo:**
```html
<div class="mb-3">
  <label for="email" class="form-label">Correo electrónico</label>
  <input type="email" class="form-control" id="email" placeholder="nombre@ejemplo.com">
</div>
```

> Esto cubre lo esencial. El Módulo 6, *Formularios Completos*, profundiza en validación visual, `input-group`, labels flotantes, switches y layouts horizontales.

## 3.7 Alertas y Badges
* **Alertas (`.alert`)**: Mensajes de retroalimentación (ej. "¡Registro exitoso!"). Se usan como `.alert .alert-success`.
* **Badges (`.badge`)**: Pequeñas etiquetas o contadores (ej. el número de notificaciones). Se usan como `.badge .text-bg-secondary` — el prefijo `text-bg-*` (en vez de solo `bg-*`) ajusta automáticamente el color del texto para mantener buen contraste sobre ese fondo.

**Alertas descartables:** el patrón más común en producción no es una alerta estática, sino una que el usuario puede cerrar. Se arma con `.alert-dismissible` en el contenedor y un botón `.btn-close` con `data-bs-dismiss="alert"` (el mismo componente **Dismiss** que también usan los toasts, Módulo 9):

```html
<div class="alert alert-success alert-dismissible" role="alert">
  ¡Registro exitoso!
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
```

**Badges con forma de píldora y sobre un botón:** `.rounded-pill` redondea completamente las esquinas del badge (ej. para contadores tipo "3"). Combinado con `.position-absolute`/`.translate-middle` sobre un elemento con `.position-relative`, es el patrón estándar para notificaciones sobre un ícono o botón:

```html
<button type="button" class="btn btn-primary position-relative">
  Notificaciones
  <span class="badge rounded-pill text-bg-danger position-absolute top-0 start-100 translate-middle">
    9+
  </span>
</button>
```

> **Resumen del Módulo 3:**
> Ya sabes cómo crear la estructura con el Grid (Módulo 2) y ahora sabes cómo rellenarla con componentes visuales (Módulo 3). 
> 
> **Punto clave:** Los componentes se adaptan al tamaño de las columnas donde los metas. Si metes una `.card` dentro de una `.col-4`, la tarjeta ocupará solo ese espacio.
