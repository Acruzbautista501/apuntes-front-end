# Módulo 6: Imágenes en Email

Las imágenes en email tienen restricciones que no existen en la web: muchos clientes las bloquean por defecto, Outlook tiene su propio sistema de fondos, y el peso total del correo afecta directamente si termina en la bandeja de entrada o en spam. Este módulo cubre cómo trabajar con imágenes de forma robusta.

## 6.1 Imágenes Bloqueadas por Defecto

La mayoría de clientes de correo (especialmente Outlook y Gmail) **no cargan imágenes automáticamente** por razones de seguridad y privacidad — el usuario debe darle clic a "Mostrar imágenes". Esto tiene una consecuencia directa de diseño: **el email debe ser comprensible incluso sin imágenes visibles**.

```html
<img
  src="https://ejemplo.com/banner.jpg"
  alt="20% de descuento en toda la tienda"
  width="600"
  height="300"
  style="display:block; width:100%; max-width:600px; height:auto; border:0;"
>
```

* `alt` no es opcional en email — es lo único que el usuario ve mientras las imágenes están bloqueadas, así que debe describir el mensaje real, no solo la imagen ("Botón de compra" es peor que "Comprar ahora con 20% de descuento").
* `width` y `height` como atributos HTML evitan que el layout "salte" mientras la imagen carga (o si nunca carga).
* `border:0` elimina el borde azul que algunos clientes agregan por defecto a las imágenes dentro de enlaces.

## 6.2 `display:block` — Por Qué es Obligatorio

```html
<img src="..." style="display:block;">
```

Sin `display:block`, las imágenes se comportan como elementos en línea (`inline`), heredando un pequeño espacio extra debajo de ellas (el espacio reservado para el descendente de letras como "g" o "y") — un detalle casi invisible en la web, pero que en email produce franjas blancas inesperadas entre imágenes apiladas.

## 6.3 Imágenes Responsivas

```html
<img
  src="https://ejemplo.com/banner.jpg"
  width="600"
  style="width:100%; max-width:600px; height:auto; display:block;"
  alt="Banner promocional"
>
```

`width:100%` con `max-width:600px` hace que la imagen se reduzca en pantallas angostas sin desbordar el contenedor, mientras nunca excede su tamaño de diseño original en pantallas grandes.

## 6.4 Imágenes de Alta Densidad (Retina)

Para que las imágenes se vean nítidas en pantallas de alta densidad de píxeles, se exporta la imagen al doble de tamaño real y se fuerza su tamaño de visualización con CSS/HTML.

```html
<!-- La imagen real mide 1200x600px, pero se muestra a 600x300px -->
<img
  src="https://ejemplo.com/banner@2x.jpg"
  width="600"
  height="300"
  style="width:300px; height:150px; display:block;"
  alt="Banner en alta resolución"
>
```

## 6.5 Fondos con Imagen — El Problema de Outlook

`background-image` en un `<div>` o `<td>` no funciona en Outlook de escritorio (motor Word). La solución estándar de la industria combina CSS moderno (para clientes que sí lo soportan) con **VML** como respaldo específico para Outlook.

```html
<!--[if mso]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px; height:300px;">
  <v:fill type="tile" src="https://ejemplo.com/fondo.jpg" color="#f4f4f4" />
  <v:textbox inset="0,0,0,0">
<![endif]-->

<div style="background-image:url('https://ejemplo.com/fondo.jpg'); background-size:cover; width:600px; height:300px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding:40px; color:#ffffff; font-family:Arial, sans-serif; font-size:24px;">
        Texto sobre la imagen de fondo
      </td>
    </tr>
  </table>
</div>

<!--[if mso]>
  </v:textbox>
</v:rect>
<![endif]-->
```

Los comentarios condicionales `<!--[if mso]>...<![endif]-->` (cubiertos a fondo en el Módulo 9) hacen que ese bloque VML solo lo procese Outlook; el resto de clientes ve directamente el `<div>` con CSS estándar.

## 6.6 Optimización de Peso

* **Comprimir siempre** las imágenes antes de subirlas (TinyPNG, Squoosh) — el peso total del email afecta directamente la entregabilidad (Módulo 18).
* **Alojar las imágenes en un CDN o el propio ESP**, nunca adjuntarlas directamente al email — adjuntos aumentan drásticamente el peso del correo y disparan filtros de spam.
* **Formato JPG para fotografías, PNG para gráficos con transparencia** — WebP todavía tiene soporte inconsistente en clientes de correo, a diferencia de la web (Módulo 6 de Maquetación Web).

## 6.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Que el email tenga sentido sin imágenes visibles | Texto real en el layout + `alt` descriptivo, nunca solo imágenes |
| Eliminar espacio fantasma debajo de una imagen | `display:block` |
| Una imagen que se adapte al ancho de pantalla | `width:100%; max-width:Npx; height:auto;` |
| Nitidez en pantallas retina | Exportar al doble de tamaño, forzar el tamaño de visualización |
| Un fondo con imagen que funcione también en Outlook | CSS `background-image` + VML dentro de comentarios condicionales `[if mso]` |

## 6.8 Errores Comunes

- **Usar solo imágenes para comunicar el mensaje principal (sin texto real)**: con las imágenes bloqueadas por defecto, el email se ve completamente vacío hasta que el usuario decide mostrarlas.
- **Olvidar `display:block`**: produce espacios blancos inesperados entre imágenes apiladas verticalmente.
- **Adjuntar imágenes directamente al correo en lugar de alojarlas externamente**: aumenta el peso del email y perjudica seriamente la entregabilidad.
