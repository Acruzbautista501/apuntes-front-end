# Módulo 7: Grid Avanzado

El Módulo 2 cubrió lo esencial: contenedores, filas, columnas y breakpoints. Con proyectos más complejos necesitarás reordenar contenido, saltar columnas sin usar celdas vacías, o anidar rejillas dentro de rejillas. Eso es lo que cubre este módulo.

## 7.1 `offset-*`: Dejar Espacio en Blanco sin una Columna Vacía

`offset` empuja una columna hacia la derecha, dejando espacio vacío antes de ella, sin necesitar un `<div>` vacío como relleno.

```html
<div class="row">
  <div class="col-md-4 offset-md-4">
    Columna centrada de 4/12, con espacio vacío a ambos lados
  </div>
</div>
```

> **Truco de centrado:** `col-md-4 offset-md-4` centra una columna de 4 unidades porque dejas 4 antes y automáticamente quedan 4 después (4 + 4 + 4 = 12).

## 7.2 `order-*`: Reordenar Columnas Visualmente

Cambia el orden en que se **ven** las columnas sin tocar el orden en el HTML — útil para que, en móvil, un formulario aparezca antes que su imagen ilustrativa, aunque en el código venga después.

```html
<div class="row">
  <div class="col-md-6 order-md-2">Esta columna se ve SEGUNDA en pantallas medianas+</div>
  <div class="col-md-6 order-md-1">Esta columna se ve PRIMERA en pantallas medianas+</div>
</div>
```

También existen los atajos `.order-first` y `.order-last` para mandar una columna directamente al principio o al final.

## 7.3 `row-cols-*`: Columnas Automáticas

En lugar de calcular `col-4` para cada tarjeta de una galería, `row-cols-*` le dice a la fila **cuántas columnas debe haber por fila**, y Bootstrap reparte el ancho automáticamente entre los hijos.

```html
<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
  <div class="col"><div class="card">Producto 1</div></div>
  <div class="col"><div class="card">Producto 2</div></div>
  <div class="col"><div class="card">Producto 3</div></div>
  <div class="col"><div class="card">Producto 4</div></div>
</div>
```

*Traducción: "1 columna en móvil, 2 en tablet (`sm`), 4 en pantallas grandes (`lg`)".* Cada hijo solo necesita la clase genérica `.col` — no tienes que calcular fracciones de 12 a mano.

## 7.4 Grids Anidados

Puedes meter una fila completa (`.row`) dentro de una columna, para crear subdivisiones internas sin afectar la rejilla principal.

```html
<div class="row">
  <div class="col-md-8">
    Columna principal (8/12)

    <div class="row mt-3">
      <div class="col-6">Subcolumna A (mitad del espacio disponible AQUÍ, no de la página)</div>
      <div class="col-6">Subcolumna B</div>
    </div>
  </div>

  <div class="col-md-4">Sidebar (4/12)</div>
</div>
```

> **Importante:** el grid anidado siempre vuelve a sumar 12, pero esas 12 unidades se reparten dentro del **ancho de la columna padre**, no del ancho total de la página.

## 7.5 `w-100`: Forzar un Salto de Línea Manual

A veces necesitas que ciertos elementos "corten" la fila en un punto específico, sin que dependa de que se les acaben las 12 columnas. La utilidad `.w-100` (ancho: 100%) fuerza ese salto:

```html
<div class="row">
  <div class="col">Columna A</div>
  <div class="col">Columna B</div>
  <div class="w-100"></div> <!-- Fuerza que lo siguiente empiece en una nueva fila -->
  <div class="col">Columna C (empieza en una fila nueva)</div>
</div>
```

## 7.6 El Sistema de CSS Grid Nativo de Bootstrap (5.2+)

Desde la versión 5.2, Bootstrap añadió un segundo sistema de rejilla, **basado en CSS Grid real** (no en Flexbox como el sistema de `.row`/`.col`), pensado para layouts más simples y de dos dimensiones.

> **Importante:** este sistema está **deshabilitado por defecto** en el `.css` compilado que se descarga del CDN o de npm (el mismo que usas desde el Módulo 1). Para usar `.grid`/`.g-col-*` necesitas compilar Bootstrap desde su código fuente en Sass con la variable `$enable-cssgrid: true` activada (ver Módulo 12, *Personalización con Sass*) — típicamente también desactivando el sistema clásico con `$enable-grid-classes: false` si no lo vas a usar en el mismo proyecto.

```html
<div class="grid">
  <div class="g-col-6">Ocupa 6 de 12 columnas</div>
  <div class="g-col-3">Ocupa 3 de 12 columnas</div>
  <div class="g-col-3">Ocupa 3 de 12 columnas</div>
</div>
```

* **`.grid`**: Activa `display: grid` en el contenedor.
* **`.g-col-*`**: Equivalente conceptual a `.col-*`, pero usando `grid-column`.
* **`.g-start-*`**: Equivalente a `offset`, pero posicionando explícitamente en qué columna empieza (`grid-column-start`).

> **¿Cuándo usar el sistema `.grid`/`.g-col-*` en vez de `.row`/`.col`?** El sistema clásico (`row`/`col`) sigue siendo el estándar de facto y tiene mejor soporte de ejemplos y documentación de terceros. El sistema `.grid` nativo es más nuevo, más liviano en HTML para casos simples, pero menos flexible para alineaciones complejas de Flexbox (`justify-content`, `align-items` sobre la fila). Para la mayoría de proyectos, sigue usando `.row`/`.col`; considera `.grid` para secciones simples tipo "galería de tarjetas parejas".

## 7.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Espacio en blanco antes de una columna | `.offset-{bp}-{n}` |
| Cambiar el orden visual sin tocar el HTML | `.order-{bp}-{n}`, `.order-first`, `.order-last` |
| Reparto automático de columnas por fila | `.row-cols-{bp}-{n}` |
| Subdivisiones dentro de una columna | Un `.row` anidado dentro de un `.col` |
| Forzar un salto de línea manual en la rejilla | `.w-100` |
| Un grid de dos dimensiones más simple, con CSS Grid real | `.grid` + `.g-col-*` |
