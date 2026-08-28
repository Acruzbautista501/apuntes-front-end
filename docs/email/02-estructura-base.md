# Módulo 2: Estructura Base de un Email HTML

Todo email HTML profesional parte de un mismo esqueleto (*boilerplate*) probado en la industria. Este módulo desglosa cada parte de esa estructura y por qué existe.

## 2.1 El DOCTYPE y el `<html>`

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <!-- ... -->
</head>
<body>
  <!-- ... -->
</body>
</html>
```

* El `DOCTYPE` HTML5 estándar es el recomendado — versiones antiguas de la industria usaban XHTML Transitional, pero HTML5 tiene mejor soporte hoy en día.
* Los namespaces `xmlns:v` y `xmlns:o` habilitan **VML** (*Vector Markup Language*), necesario para trucos específicos de Outlook como los botones a prueba de balas (Módulo 7) y los fondos con imagen (Módulo 6).

## 2.2 Meta Tags Esenciales

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Asunto interno de referencia</title>
</head>
```

* `charset="utf-8"` evita que tildes y caracteres especiales se muestren corruptos.
* El `viewport` es necesario para que el email responda correctamente en clientes móviles (Módulo 8).
* `X-UA-Compatible` fuerza a Outlook (cuando usa el motor de Internet Explorer/Edge en modo de compatibilidad) a renderizar en el modo más moderno disponible.

## 2.3 El *Preheader* — Texto Oculto Estratégico

El *preheader* es el fragmento de texto que aparece junto al asunto en la bandeja de entrada, antes de abrir el correo — controla directamente la tasa de apertura.

```html
<body>
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Aquí va el texto que se muestra en la vista previa de la bandeja de entrada.
  </div>
  <!-- Contenido visible del email -->
</body>
```

`mso-hide:all` oculta el bloque específicamente en Outlook; `display:none` y `max-height:0` lo ocultan en el resto de clientes — la combinación de las tres propiedades es necesaria porque ningún cliente respeta las tres de forma universal por sí solo.

## 2.4 La Tabla Contenedora Principal

Todo el contenido del email vive dentro de tablas anidadas — nunca directamente en el `<body>`.

```html
<body style="margin:0; padding:0; background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">

        <!-- Tabla interna: el "contenedor" visual del email, generalmente 600px -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td style="padding:20px; font-family:Arial, sans-serif; font-size:16px; color:#333333;">
              Contenido del email aquí
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
```

* `role="presentation"` le indica a los lectores de pantalla que esta tabla es puramente de maquetación, no una tabla de datos — importante para accesibilidad (Módulo 13).
* `cellpadding="0" cellspacing="0" border="0"` son atributos HTML heredados (no CSS) que eliminan el espaciado por defecto que algunos clientes aplican a las tablas — necesarios porque el CSS equivalente (`border-collapse`, `border-spacing`) no es confiable en todos los clientes.
* **600px** es el ancho estándar de la industria: suficientemente angosto para verse bien en la mayoría de paneles de vista previa, y lo bastante ancho para un diseño cómodo en escritorio.

## 2.5 Por Qué 600 y no un Contenedor Fluido al 100%

Un email sin una tabla de ancho fijo se estira al ancho completo de la ventana del cliente de correo, que varía enormemente entre un panel de vista previa angosto y una ventana maximizada — un ancho fijo de referencia, combinado con `max-width` y media queries (Módulo 8), da el mejor equilibrio entre consistencia visual y capacidad de respuesta.

## 2.6 Estructura Completa de Referencia

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Newsletter</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4;">

  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Vista previa del correo aquí.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td style="padding:20px; font-family:Arial, sans-serif; font-size:16px; color:#333333;">
              Contenido principal
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
```

## 2.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Habilitar trucos VML para Outlook | `xmlns:v` y `xmlns:o` en `<html>` |
| Controlar el texto de vista previa en la bandeja de entrada | Un `<div>` oculto con `display:none` + `mso-hide:all` |
| Eliminar espaciado no deseado en tablas | Atributos HTML `cellpadding="0" cellspacing="0" border="0"` |
| Marcar una tabla como puramente estructural | `role="presentation"` |
| Un contenedor con ancho consistente entre clientes | Tabla anidada de 600px con `max-width` |

## 2.8 Errores Comunes

* **Omitir `role="presentation"`**: sin él, lectores de pantalla anuncian la tabla como si fuera una tabla de datos ("tabla con 3 filas y 2 columnas"), generando ruido confuso para usuarios con discapacidad visual.
* **Confiar solo en CSS (`border-collapse`) para el espaciado de tablas**: los atributos HTML (`cellpadding`, `cellspacing`, `border`) siguen siendo necesarios porque varios clientes ignoran las propiedades CSS equivalentes.
* **Olvidar el *preheader***: sin él, muchos clientes muestran automáticamente las primeras palabras visibles del email (a menudo "Ver en el navegador" u otro texto no deseado) como vista previa.
