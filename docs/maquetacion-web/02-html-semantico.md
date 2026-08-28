# Módulo 2: HTML Semántico a Fondo

Usar `<div>` para absolutamente todo es la forma más común en que un sitio web pasa de "funciona visualmente" a "es difícil de mantener, inaccesible y malo para SEO". El HTML semántico usa la etiqueta que **describe el significado** del contenido, no solo su apariencia — este módulo cubre cómo pensar en landmarks y jerarquía de contenido, no solo en memorizar una lista de etiquetas.

## 2.1 Por Qué Importa la Semántica

* **Accesibilidad**: los lectores de pantalla usan las etiquetas semánticas para construir un mapa de navegación del documento — un `<div>` no comunica nada, un `<nav>` sí.
* **SEO**: los motores de búsqueda usan la estructura semántica para entender la jerarquía e importancia del contenido.
* **Mantenibilidad**: `<article>`, `<aside>`, `<nav>` documentan la intención del código por sí mismos, sin necesitar comentarios adicionales.
* **Estilos por defecto útiles**: elementos como `<button>` traen comportamiento de accesibilidad y teclado gratis, que reconstruir manualmente en un `<div>` es trabajo extra y propenso a errores.

## 2.2 Los Landmarks Principales

```html
<body>
  <header>
    <nav>
      <!-- Navegación principal del sitio -->
    </nav>
  </header>

  <main>
    <!-- El contenido único y principal de esta página específica -->
  </main>

  <aside>
    <!-- Contenido relacionado pero secundario (sidebar) -->
  </aside>

  <footer>
    <!-- Pie de página: enlaces legales, contacto, redes sociales -->
  </footer>
</body>
```

Un lector de pantalla puede saltar directamente entre estos "landmarks" (encabezado, navegación, contenido principal, pie) sin tener que escuchar todo el documento linealmente — el equivalente a cómo un usuario vidente escanea visualmente una página por sus regiones.

## 2.3 `<main>` — Solo Uno por Página

```html
<body>
  <header>...</header>
  <main>
    <!-- El contenido que hace única a esta página -->
  </main>
  <footer>...</footer>
</body>
```

`<main>` debe aparecer **una sola vez** por página y contener el contenido que verdaderamente la distingue del resto del sitio — nunca elementos repetidos en todas las páginas como la navegación o el pie.

## 2.4 `<article>` vs `<section>` — La Distinción que Confunde

```html
<!-- <article>: contenido independiente y autocontenible, tendría sentido fuera de este contexto -->
<article>
  <h2>Título del artículo del blog</h2>
  <p>Contenido del artículo...</p>
</article>

<!-- <section>: una agrupación temática dentro de un documento más grande, no necesariamente independiente -->
<section>
  <h2>Nuestros Servicios</h2>
  <p>Descripción de la sección...</p>
</section>
```

**La prueba práctica**: si el contenido tendría sentido copiado y pegado en un feed RSS o sindicado en otro sitio de forma aislada, es un `<article>`. Si es una subdivisión temática de la página actual que no tiene sentido fuera de ese contexto, es una `<section>`.

## 2.5 Jerarquía de Encabezados

```html
<!-- ❌ Salto de nivel sin razón semántica, solo por tamaño visual -->
<h1>Título de la página</h1>
<h4>Subtítulo</h4>

<!-- ✅ Jerarquía secuencial; el tamaño visual se controla con CSS, no saltando niveles -->
<h1>Título de la página</h1>
<h2>Subtítulo</h2>
```

Cada página debe tener **un único `<h1>`**, seguido de una jerarquía descendente lógica (`<h2>` dentro de esa sección, `<h3>` dentro de una subsección de esa sección) — nunca elegir un nivel de encabezado solo porque su tamaño por defecto coincide visualmente con el diseño.

## 2.6 Elementos de Texto con Significado

```html
<p>El plazo de entrega es de <strong>3 a 5 días hábiles</strong>.</p>
<p>El precio anterior era <del>$500</del>, ahora <ins>$400</ins>.</p>
<p><em>Nota:</em> este producto tiene existencias limitadas.</p>
<blockquote cite="https://ejemplo.com/fuente">
  <p>Una cita textual de otra fuente.</p>
</blockquote>
```

* `<strong>` comunica importancia real (los lectores de pantalla cambian el énfasis de voz), no solo texto en negrita — para negrita puramente visual sin significado, se usa CSS (`font-weight`).
* `<em>` comunica énfasis enfático real, distinto de `<i>` (texto en cursiva sin ese significado, como un término técnico o el nombre de un barco).
* `<del>`/`<ins>` marcan contenido eliminado/insertado con significado real (como un precio tachado), no solo texto tachado o subrayado visualmente.

## 2.7 `<figure>` y `<figcaption>`

```html
<figure>
  <img src="grafico-ventas.png" alt="Gráfico de ventas trimestrales mostrando un crecimiento del 20%">
  <figcaption>Ventas del primer trimestre de 2026</figcaption>
</figure>
```

Asocia semánticamente una imagen (o gráfico, código, cita) con su descripción/pie de foto — mucho más significativo que un `<div>` con una imagen y un `<p>` sueltos sin relación explícita entre ellos.

## 2.8 `<time>` — Fechas Legibles por Máquinas

```html
<p>Publicado el <time datetime="2026-08-28">28 de agosto de 2026</time>.</p>
```

`datetime` da un formato estándar (ISO 8601) que motores de búsqueda y otras herramientas pueden interpretar de forma confiable, mientras el texto visible sigue siendo el formato legible que prefiera el diseño.

## 2.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Contenido independiente y autocontenible (post de blog, producto) | `<article>` |
| Una agrupación temática dentro de la página | `<section>` |
| El contenido único que distingue a esta página del resto del sitio | `<main>` (solo uno por página) |
| Contenido relacionado pero secundario | `<aside>` |
| Texto con importancia real (no solo negrita visual) | `<strong>` |
| Una imagen con su descripción asociada | `<figure>` + `<figcaption>` |
| Una fecha legible tanto por humanos como por máquinas | `<time datetime="...">` |

## 2.10 Errores Comunes

- **Usar `<div>` para todo, incluyendo navegación, encabezados de sección y botones**: elimina toda la información semántica que beneficia a accesibilidad y SEO sin ningún costo adicional de mantener.
- **Múltiples `<h1>` en la misma página, o saltar niveles de encabezado por conveniencia visual**: rompe la navegación estructural para lectores de pantalla; el tamaño visual se controla con CSS, no eligiendo el nivel de encabezado incorrecto.
- **Usar `<b>`/`<i>` cuando el significado real es `<strong>`/`<em>`**: pierde la semántica de importancia/énfasis que los lectores de pantalla comunican distinto al texto normal.
