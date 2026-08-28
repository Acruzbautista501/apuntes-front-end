# Módulo 15: Personalización y Contenido Dinámico

Un email genérico convierte peor que uno personalizado con el nombre del destinatario, contenido relevante a su comportamiento previo, o bloques que cambian según sus datos. Este módulo cubre cómo el HTML de un email se conecta con datos reales del destinatario a través de un ESP (*Email Service Provider*).

## 15.1 *Merge Tags* — La Sintaxis Varía por ESP

Cada plataforma de envío tiene su propia sintaxis de marcador de posición para insertar datos del destinatario en el momento del envío. No existe un estándar universal — el maquetador debe adaptar su HTML a la sintaxis específica del ESP que el proyecto use.

| ESP | Sintaxis de ejemplo |
| :--- | :--- |
| Mailchimp | `*\|FNAME\|*` |
| Klaviyo | Handlebars (ver 15.2) |
| SendGrid (plantillas dinámicas) | Handlebars (ver 15.2) |
| HubSpot | Handlebars (ver 15.2) |

```html
<p>Hola, *|FNAME|*, gracias por tu compra.</p>
```

## 15.2 Sintaxis Handlebars — El Estándar Más Extendido

Varios de los ESPs más modernos (Klaviyo, SendGrid, HubSpot) usan **Handlebars**, un lenguaje de plantillas con doble llave para insertar variables.

```handlebars
<p>Hola, {{ contact.first_name }}, gracias por tu compra.</p>
```

```handlebars
<p>Tu pedido #{{ order.id }} llegará el {{ order.fecha_entrega }}.</p>
```

> **Nota para quien maqueta con VitePress u otras herramientas basadas en Vue**: la sintaxis de doble llave de Handlebars es visualmente idéntica a la interpolación de Vue — si alguna vez documentas ejemplos de Handlebars dentro de un sitio VitePress, siempre debe ir en un bloque de código con el lenguaje `handlebars` correctamente etiquetado (nunca en código en línea con comilla simple), porque de lo contrario Vue puede intentar interpretar esa sintaxis como una interpolación real durante la compilación del sitio.

## 15.3 Condicionales en Handlebars

```handlebars
{{#if contact.es_vip}}
  <p>Como cliente VIP, tienes envío gratis en este pedido.</p>
{{else}}
  <p>Envío gratis en compras mayores a $500.</p>
{{/if}}
```

Este tipo de bloque condicional permite mostrar contenido distinto dentro del **mismo** HTML según los datos del destinatario, sin necesitar crear una plantilla completamente separada para cada segmento.

## 15.4 Iterar sobre una Lista (Contenido Repetido)

```handlebars
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  {{#each pedido.productos}}
  <tr>
    <td style="padding:10px; font-family:Arial, sans-serif;">
      {{ this.nombre }} — {{ this.precio }}
    </td>
  </tr>
  {{/each}}
</table>
```

Útil para emails de confirmación de pedido, donde el número de productos varía en cada envío individual — el bloque de iteración de Handlebars visto arriba genera una fila de tabla por cada elemento de la lista de datos.

## 15.5 Bloques de Contenido Condicionados por Segmento

Combinar condicionales con el layout de tablas del Módulo 5 permite mostrar secciones completas distintas según el segmento del destinatario, manteniendo un único archivo de plantilla en lugar de mantener versiones separadas.

```handlebars
{{#if contact.ciudad}}
<tr>
  <td style="padding:20px; background-color:#f0f7ff;">
    <p style="font-family:Arial, sans-serif; font-size:16px;">
      Tenemos una tienda cerca de ti en {{ contact.ciudad }}.
    </p>
  </td>
</tr>
{{/if}}
```

## 15.6 Valores por Defecto (*Fallback*)

Cuando un dato del destinatario puede no existir (un nombre no capturado en el formulario de suscripción), un valor de reserva evita mensajes rotos como "Hola, ,".

```handlebars
<p>Hola, {{ default contact.first_name "amig@" }}, tenemos novedades para ti.</p>
```

La sintaxis exacta del *helper* `default` varía según el ESP — algunos usan un filtro de tipo Liquid (`contact.first_name | default: "amig@"`, entre doble llave), sintaxis usada por Shopify y Klaviyo en algunos contextos, en lugar de un *helper* de Handlebars.

## 15.7 Probar la Personalización Antes de Enviar

Casi todos los ESPs ofrecen una vista previa con datos de ejemplo (o de un contacto real específico) antes del envío — es indispensable revisar esa vista previa para confirmar que los *merge tags* se reemplazan correctamente y que ningún bloque condicional se muestra vacío o roto por un dato faltante.

## 15.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Insertar un dato del destinatario | El *merge tag* específico del ESP (Mailchimp: `*|TAG|*`; la mayoría de otros: Handlebars) |
| Mostrar contenido distinto según una condición | Bloque condicional `#if`/`else`/`/if` de Handlebars (ver 15.3) |
| Repetir un bloque por cada elemento de una lista | Bloque de iteración `#each` de Handlebars (ver 15.4) |
| Evitar mensajes rotos cuando falta un dato | Un valor de reserva (*default*/*fallback*) |

## 15.9 Errores Comunes

- **No probar la vista previa con datos reales antes de enviar**: un *merge tag* mal escrito se muestra literalmente en el email de todos los destinatarios (el marcador sin reemplazar, en vez del nombre real).
- **No prever un valor por defecto para datos que pueden faltar**: produce saludos rotos o secciones vacías para un segmento significativo de la lista.
- **Mezclar la sintaxis de dos ESPs distintos**: cada plataforma tiene su propio motor de plantillas; el HTML de Mailchimp no funciona sin adaptación en Klaviyo, y viceversa.
