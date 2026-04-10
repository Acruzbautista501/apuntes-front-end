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

* **`.navbar-expand-lg`**: Define en qué tamaño de pantalla el menú deja de estar colapsado (hamburguesa) y se muestra completo.
* **`.navbar-light` / `.navbar-dark`**: Ajusta el color del texto para que contraste con el fondo.

**Tip:** Siempre es recomendable copiar la estructura base de la documentación oficial y luego personalizarla, ya que requiere muchas clases específicas para que el botón de menú funcione correctamente.

## 3.5 Formularios
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

## 3.6 Alertas y Badges
* **Alertas (`.alert`)**: Mensajes de retroalimentación (ej. "¡Registro exitoso!"). Se usan como `.alert .alert-success`.
* **Badges (`.badge`)**: Pequeñas etiquetas o contadores (ej. el número de notificaciones). Se usan como `.badge .bg-secondary`.

> **Resumen del Módulo 3:**
> Ya sabes cómo crear la estructura con el Grid (Módulo 2) y ahora sabes cómo rellenarla con componentes visuales (Módulo 3). 
> 
> **Punto clave:** Los componentes se adaptan al tamaño de las columnas donde los metas. Si metes una `.card` dentro de una `.col-4`, la tarjeta ocupará solo ese espacio.
