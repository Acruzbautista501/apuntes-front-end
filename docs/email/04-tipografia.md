# Módulo 4: Tipografía y Web-Safe Fonts en Email

La tipografía en email tiene una limitación fundamental que no existe en la web: **no todos los clientes cargan fuentes personalizadas**, y muchos ni siquiera respetan `@font-face`. Este módulo cubre cómo trabajar dentro de esa limitación sin sacrificar identidad visual.

## 4.1 El Problema de las Fuentes Personalizadas

```html
<!-- ❌ No confiable: Outlook y Gmail (en varios contextos) ignoran @font-face -->
<style>
  @font-face {
    font-family: 'MiFuenteCustom';
    src: url('https://ejemplo.com/fuente.woff2');
  }
</style>
```

Apple Mail y algunos clientes basados en WebKit sí respetan `@font-face`, pero Outlook de escritorio y muchos clientes de Android la ignoran por completo, mostrando la fuente de reserva del sistema en su lugar — por eso ninguna fuente personalizada puede ser la única opción.

## 4.2 Las *Web-Safe Fonts* — La Base Confiable

Las fuentes "seguras para web" son las que vienen preinstaladas en prácticamente todos los sistemas operativos, garantizando una apariencia consistente sin depender de ninguna carga externa.

| Fuente | Categoría |
| :--- | :--- |
| Arial, Helvetica | Sans-serif |
| Georgia, Times New Roman | Serif |
| Verdana, Tahoma | Sans-serif (buena legibilidad en tamaños pequeños) |
| Courier New | Monospace |

```html
<td style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #333333;">
  Texto del email
</td>
```

## 4.3 *Font Stacking* con Mejora Progresiva

La estrategia estándar: declarar la fuente personalizada primero, seguida de una cadena de fuentes de reserva cada vez más genéricas — los clientes que sí soportan `@font-face` usan la fuente personalizada; el resto cae automáticamente en la primera alternativa disponible.

```html
<td style="font-family: 'Poppins', Arial, Helvetica, sans-serif;">
  Este texto usa Poppins donde es posible, y Arial en el resto
</td>
```

```html
<head>
  <style>
    @media screen {
      @font-face {
        font-family: 'Poppins';
        src: url('https://fonts.gstatic.com/s/poppins/poppins.woff2') format('woff2');
      }
    }
  </style>
</head>
```

> Envolver `@font-face` en `@media screen` es una técnica adicional para evitar que Outlook (que procesa CSS de forma distinta al resto) intente interpretar la regla de forma incorrecta.

## 4.4 Fuentes de Google Fonts en Email

```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
</head>
```

Aunque Google Fonts es la fuente más común para diseño web moderno, en email el `<link>` es ignorado por la mayoría de clientes (Módulo 3) — su uso en email solo beneficia a los pocos clientes que sí procesan `<link>` (principalmente Apple Mail); para el resto, la fuente de reserva del *font stack* siempre debe verse aceptable por sí sola.

## 4.5 Tamaños de Fuente y Legibilidad

* **Cuerpo de texto**: mínimo 14px, idealmente 16px — tamaños menores son difíciles de leer en pantallas móviles.
* **Encabezados**: al menos 22-28px en el diseño de escritorio, ajustados en móvil vía media queries (Módulo 8).
* **`line-height`**: 1.4-1.6 veces el tamaño de fuente mejora notablemente la legibilidad de párrafos largos.

```html
<td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
  Un párrafo de cuerpo con buena legibilidad usa una relación cómoda entre tamaño de fuente y altura de línea.
</td>
```

## 4.6 Renderizado de Fuente en Outlook — El Detalle `mso-line-height-rule`

Outlook, al usar el motor de Word, a veces interpreta `line-height` de forma distinta al resto de clientes, causando espaciado inconsistente entre líneas.

```html
<td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; mso-line-height-rule: exactly;">
  Texto con altura de línea consistente también en Outlook
</td>
```

`mso-line-height-rule: exactly` es una propiedad propietaria de Microsoft que fuerza a Outlook a respetar el valor exacto de `line-height`, en lugar de recalcularlo con su propia lógica interna.

## 4.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Una base tipográfica que funcione en todos los clientes | Una *web-safe font* como último elemento del *font stack* |
| Usar una fuente de marca donde sea posible | `@font-face` envuelto en `@media screen` + *font stack* con reserva segura |
| Espaciado de línea consistente en Outlook | `mso-line-height-rule: exactly` |
| Buena legibilidad general | Cuerpo ≥14px, `line-height` de 1.4-1.6× el tamaño de fuente |

## 4.8 Errores Comunes

* **Usar solo una fuente personalizada sin *fallback***: en los clientes que no la soportan (la mayoría), el texto se muestra en la fuente por defecto del sistema, que puede verse muy distinta al diseño original.
* **Tamaños de fuente menores a 14px en el cuerpo**: dificulta la lectura, especialmente en pantallas móviles con paneles de vista previa angostos.
* **Ignorar `mso-line-height-rule` en diseños con tipografía ajustada**: el espaciado entre líneas en Outlook puede verse notablemente distinto al resto de clientes sin esta propiedad.
