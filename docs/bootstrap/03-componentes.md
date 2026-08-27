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

> **Nota:** al ser SVG controlados por CSS, heredan `color` con `text-*` y su tamaño escala con `font-size`, igual que cualquier texto — no necesitas configurar ancho/alto por separado.

## 3.2 Botones (`.btn`)
Un botón en HTML puro es muy básico. Con Bootstrap, se transforma completamente.

* **Clase base:** Siempre debes usar `.btn`.
* **Clase de estilo:** Debes combinarla con un color, como `.btn-primary` o `.btn-outline-success` (para botones con borde y sin fondo sólido).
* **Tamaños:** Puedes usar `.btn-lg` (grande) o `.btn-sm` (pequeño).

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

## 3.4 Barras de Navegación (`.navbar`)
Es el componente más complejo pero el más necesario. Bootstrap lo hace responsivo automáticamente (crea el menú "hamburguesa" en móviles).

* **`.navbar-expand-lg`**: Define en qué tamaño de pantalla el menú deja de estar colapsado (hamburguesa) y se muestra completo. Puedes usar cualquier breakpoint: `.navbar-expand-md`, `.navbar-expand-sm`, etc.
* **`.navbar-light` / `.navbar-dark`**: Ajusta el color del texto para que contraste con el fondo. Desde Bootstrap 5.3, también puedes usar `data-bs-theme="dark"` directamente en el `.navbar` (ver Módulo 13, *Modo Oscuro*).

**Estructura completa:**
```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
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

**Tip:** Siempre es recomendable copiar la estructura base de la documentación oficial y luego personalizarla, ya que requiere muchas clases específicas para que el botón de menú funcione correctamente. Fíjate que el `.navbar-toggler` usa `data-bs-toggle="collapse"` — el mismo componente **Collapse** de JavaScript que usan los acordeones (Módulo 14).

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
| `.table-responsive` | Envuelve la tabla; agrega scroll horizontal solo si es necesario |

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
* **Badges (`.badge`)**: Pequeñas etiquetas o contadores (ej. el número de notificaciones). Se usan como `.badge .bg-secondary`.

> **Resumen del Módulo 3:**
> Ya sabes cómo crear la estructura con el Grid (Módulo 2) y ahora sabes cómo rellenarla con componentes visuales (Módulo 3). 
> 
> **Punto clave:** Los componentes se adaptan al tamaño de las columnas donde los metas. Si metes una `.card` dentro de una `.col-4`, la tarjeta ocupará solo ese espacio.
