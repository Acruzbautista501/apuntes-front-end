# Módulo 7: Botones a Prueba de Balas (Bulletproof Buttons)

Un botón de llamada a la acción (CTA) es, probablemente, el elemento más importante de cualquier email de marketing — y también uno de los más difíciles de maquetar de forma consistente, porque `border-radius` y `padding` en un enlace no funcionan de forma confiable en Outlook. Este módulo cubre la técnica estándar de la industria para resolverlo.

## 7.1 El Botón Simple (Funciona en la Mayoría de Clientes, Pero No en Todos)

```html
<a
  href="https://ejemplo.com/comprar"
  style="background-color:#0066cc; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-family:Arial, sans-serif; font-size:16px; display:inline-block;"
>
  Comprar ahora
</a>
```

Este botón se ve bien en Apple Mail y Gmail, pero Outlook de escritorio ignora `border-radius` y a menudo interpreta `padding` en un `<a>` de forma inconsistente — el área clicable puede no coincidir visualmente con el botón.

## 7.2 La Técnica VML — Botón a Prueba de Balas Completo

La solución estándar combina un botón HTML normal (para la mayoría de clientes) con una versión alterna en VML específica para Outlook, usando comentarios condicionales (Módulo 9).

```html
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
  href="https://ejemplo.com/comprar" style="height:48px; v-text-anchor:middle; width:220px;"
  arcsize="12%" strokecolor="#0066cc" fillcolor="#0066cc">
  <w:anchorlock/>
  <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px; font-weight:bold;">
    Comprar ahora
  </center>
</v:roundrect>
<![endif]-->

<!--[if !mso]><!-->
<a
  href="https://ejemplo.com/comprar"
  style="background-color:#0066cc; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-family:Arial, sans-serif; font-size:16px; font-weight:bold; display:inline-block;"
>
  Comprar ahora
</a>
<!--<![endif]-->
```

* `<!--[if mso]>...<![endif]-->` — Outlook procesa este bloque VML y lo muestra como un botón sólido y clicable con esquinas redondeadas reales (`arcsize`).
* `<!--[if !mso]><!-->...<!--<![endif]-->` — el resto de clientes ignora el VML (Outlook no lo entiende) y ven el `<a>` HTML normal.
* `<w:anchorlock/>` asegura que **todo** el área del botón VML sea clicable, no solo el texto central.

## 7.3 Botón con Tabla (Alternativa Más Simple, Sin Esquinas Redondeadas en Outlook)

Cuando el diseño no requiere esquinas redondeadas, una tabla simple con `bgcolor` resuelve el mismo problema sin necesitar VML.

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td bgcolor="#0066cc" style="border-radius:0;">
      <a
        href="https://ejemplo.com/comprar"
        style="display:inline-block; padding:14px 28px; color:#ffffff; text-decoration:none; font-family:Arial, sans-serif; font-size:16px; font-weight:bold;"
      >
        Comprar ahora
      </a>
    </td>
  </tr>
</table>
```

`bgcolor` (atributo HTML) en el `<td>` funciona de forma universal, incluido Outlook — el `padding` del `<a>` interno define el área clicable de forma predecible dentro de esa celda coloreada.

## 7.4 Botones con Ancho Fluido (100% en Móvil)

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" bgcolor="#0066cc" style="border-radius:6px;">
      <a
        href="https://ejemplo.com/comprar"
        style="display:block; padding:16px; color:#ffffff; text-decoration:none; font-family:Arial, sans-serif; font-size:16px; font-weight:bold; text-align:center;"
      >
        Comprar ahora
      </a>
    </td>
  </tr>
</table>
```

`display:block` en el `<a>` (en lugar de `inline-block`) hace que el enlace ocupe todo el ancho disponible de la celda — combinado con media queries (Módulo 8), esto permite que el botón se estire al ancho completo en pantallas móviles.

## 7.5 Área Táctil Mínima en Móvil

Apple recomienda un área táctil mínima de 44x44px para cualquier elemento interactivo — un botón de email debe respetar ese mínimo para ser cómodamente presionable con el dedo.

```html
<a href="..." style="display:inline-block; padding:16px 32px; min-height:44px; line-height:44px;">
  Comprar ahora
</a>
```

## 7.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un botón con esquinas redondeadas que funcione también en Outlook | VML (`v:roundrect`) + `<a>` HTML, alternados con comentarios condicionales |
| Un botón simple sin esquinas redondeadas | `<td bgcolor="...">` + `<a>` con padding |
| Un botón que se estire al 100% en móvil | `display:block` en el `<a>` + media queries (Módulo 8) |
| Un área clicable cómoda en dispositivos táctiles | Mínimo 44px de alto/ancho |

## 7.7 Errores Comunes

- **Usar solo `border-radius` sin la alternativa VML**: en Outlook de escritorio, el botón aparece como un rectángulo recto, rompiendo la consistencia visual con el resto del diseño.
- **Omitir `<w:anchorlock/>`**: en algunos casos, solo el texto central del botón VML resulta clicable, no todo el área visual.
- **Botones demasiado pequeños para dedos en móvil**: reduce significativamente la tasa de clics en la audiencia que abre el email desde el celular — la mayoría del tráfico de email hoy en día.
