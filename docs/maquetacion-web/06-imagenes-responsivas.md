# Módulo 6: Imágenes Responsivas

Servir la misma imagen de 2000px de ancho a un teléfono que muestra el contenido a 300px de ancho real es una de las formas más comunes de desperdiciar rendimiento en la web. Este módulo cubre `srcset`, `picture`, y los formatos de imagen modernos que resuelven este problema.

## 6.1 El Problema: Una Sola Imagen para Todos los Dispositivos

```html
<!-- La misma imagen de 2000px se descarga sin importar el tamaño real de pantalla -->
<img src="banner-2000px.jpg" alt="Banner promocional">
```

En un móvil que solo necesita mostrar la imagen a 400px de ancho, esto significa descargar hasta 25 veces más peso de datos del que realmente se necesita.

## 6.2 `srcset` con Densidad de Píxeles

```html
<img
  src="logo.png"
  srcset="logo.png 1x, logo@2x.png 2x, logo@3x.png 3x"
  alt="Logo de la marca"
>
```

El navegador elige automáticamente la versión correcta según la densidad de píxeles de la pantalla del dispositivo (`1x` para pantallas estándar, `2x`/`3x` para pantallas retina/de alta densidad) — sin necesitar ningún JavaScript.

## 6.3 `srcset` con Ancho de Imagen (`w`) + `sizes`

Más potente que la densidad de píxeles: describe varias versiones de la misma imagen en distintos anchos, y le dice al navegador cómo calcular qué ancho necesita en cada contexto.

```html
<img
  src="producto-800.jpg"
  srcset="
    producto-400.jpg 400w,
    producto-800.jpg 800w,
    producto-1200.jpg 1200w,
    producto-1600.jpg 1600w
  "
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px"
  alt="Producto"
>
```

* `srcset` lista las versiones disponibles, cada una con su ancho real (`400w` = 400 píxeles de ancho real).
* `sizes` describe **qué tan ancho se mostrará la imagen** en cada condición de viewport — no el ancho de la imagen en sí, sino el espacio que ocupará en el layout.
* El navegador combina ambas listas con la densidad de píxeles real del dispositivo para elegir la versión óptima — ni más pesada ni más liviana de lo necesario.

## 6.4 `<picture>` — Art Direction (Recortes Distintos por Dispositivo)

`srcset` cambia la **resolución** de la misma imagen; `<picture>` permite servir una imagen **completamente distinta** (un recorte diferente, no solo más pequeña) según el tamaño de pantalla — útil cuando el diseño requiere un encuadre distinto en móvil versus escritorio.

```html
<picture>
  <source media="(max-width: 600px)" srcset="banner-recorte-cuadrado.jpg">
  <source media="(min-width: 601px)" srcset="banner-panoramico.jpg">
  <img src="banner-panoramico.jpg" alt="Banner promocional">
</picture>
```

El `<img>` final es obligatorio como respaldo para navegadores que no soportan `<picture>` (muy raros hoy en día) y define el `alt` que aplica a toda la imagen, sin importar qué `<source>` se haya elegido.

## 6.5 `<picture>` para Formatos Modernos con Respaldo

El mismo elemento `<picture>` también sirve para ofrecer formatos modernos y más livianos (WebP, AVIF) con una alternativa universal como respaldo automático.

```html
<picture>
  <source srcset="foto.avif" type="image/avif">
  <source srcset="foto.webp" type="image/webp">
  <img src="foto.jpg" alt="Descripción de la fotografía">
</picture>
```

El navegador prueba cada `<source>` en orden y usa la primera cuyo `type` sí soporta — si no soporta ni AVIF ni WebP, cae automáticamente al `<img>` final en JPG.

## 6.6 Formatos de Imagen Modernos

| Formato | Ventaja | Soporte |
| :--- | :--- | :--- |
| AVIF | El más comprimido, mejor calidad por peso | Amplio en navegadores modernos, en crecimiento |
| WebP | Muy comprimido, buen equilibrio | Universal en navegadores modernos |
| JPG | Universal, sin transparencia | Universal (siempre como respaldo final) |
| PNG | Universal, con transparencia | Universal (para gráficos con transparencia) |
| SVG | Vectorial, escala sin pérdida de calidad | Universal — ideal para íconos y logos |

## 6.7 Carga Diferida con `loading="lazy"`

```html
<img src="imagen-mas-abajo-en-la-pagina.jpg" alt="..." loading="lazy">
```

El navegador retrasa la descarga de la imagen hasta que está por entrar al viewport — nativo, sin JavaScript, con soporte universal en navegadores modernos. **Nunca** debe aplicarse a la imagen principal visible al cargar la página (LGP, retomado en el Módulo 10), ya que retrasaría precisamente el contenido más importante para el rendimiento percibido.

## 6.8 Dimensiones Explícitas para Evitar *Layout Shift*

```html
<img src="foto.jpg" alt="..." width="800" height="600" style="max-width:100%; height:auto;">
```

Declarar `width`/`height` (incluso si el CSS luego los hace responsivos) permite que el navegador reserve el espacio correcto **antes** de que la imagen termine de cargar, evitando que el resto del contenido "salte" cuando la imagen aparece — una métrica directa de Core Web Vitals (Módulo 10).

## 6.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| La misma imagen en distintas densidades de pantalla | `srcset` con descriptores `1x`/`2x` |
| La misma imagen en distintos anchos según el viewport | `srcset` con descriptores `w` + `sizes` |
| Un recorte completamente distinto según el dispositivo | `<picture>` con `<source media="...">` |
| Formatos modernos con respaldo automático | `<picture>` con `<source type="image/avif">` |
| Diferir la carga de imágenes fuera de pantalla | `loading="lazy"` |
| Evitar saltos de layout mientras carga la imagen | `width`/`height` explícitos en el HTML |

## 6.10 Errores Comunes

- **Aplicar `loading="lazy"` a la imagen principal visible al cargar**: retrasa el elemento más importante para el rendimiento percibido, empeorando el Largest Contentful Paint (Módulo 10).
- **Confundir `srcset` (densidad/ancho de imagen) con `sizes` (espacio ocupado en el layout)**: sin `sizes` correcto, el navegador no puede elegir la versión óptima con precisión.
- **Omitir `width`/`height` en el HTML "porque el CSS ya lo controla"**: el navegador necesita esos valores para reservar espacio antes de que la imagen cargue, sin importar que el CSS los sobrescriba visualmente después.
