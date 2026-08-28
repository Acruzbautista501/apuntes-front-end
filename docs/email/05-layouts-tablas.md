# Módulo 5: Layouts con Tablas

Sin Flexbox ni Grid confiables (Módulo 3), las tablas HTML siguen siendo la base estructural de cualquier email compatible con Outlook. Este módulo cubre los patrones de layout más comunes: columnas, espaciadores y estructuras anidadas.

## 5.1 Layout de Una Columna (El Caso Base)

```html
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">
  <tr>
    <td style="padding:20px; font-family:Arial, sans-serif; font-size:16px; color:#333333;">
      Contenido de una sola columna
    </td>
  </tr>
</table>
```

## 5.2 Layout de Dos Columnas con Tablas Anidadas

```html
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <!-- Columna izquierda -->
    <td width="300" valign="top" style="width:300px; padding:20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family:Arial, sans-serif; font-size:16px;">Columna izquierda</td>
        </tr>
      </table>
    </td>

    <!-- Columna derecha -->
    <td width="300" valign="top" style="width:300px; padding:20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family:Arial, sans-serif; font-size:16px;">Columna derecha</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

Cada columna es un `<td>` con un ancho fijo; el contenido dentro de cada columna vive en su **propia tabla anidada**, en lugar de directamente en el `<td>` — esto da control independiente sobre el padding y la estructura de cada columna sin que se afecten entre sí.

## 5.3 `valign="top"` — Un Detalle que Rompe Diseños

Por defecto, el contenido de un `<td>` se alinea verticalmente al **centro**. En layouts de columnas con contenido de distinta altura (una columna con más texto que otra), esto produce un desalineamiento visual notorio.

```html
<td width="300" valign="top" style="vertical-align:top;">
  <!-- Contenido alineado arriba, sin importar la altura de la columna vecina -->
</td>
```

Declarar `valign="top"` tanto como atributo HTML como `vertical-align:top` en CSS asegura el comportamiento correcto en todos los clientes.

## 5.4 Espaciadores — La Alternativa Confiable a `margin`/`gap`

`margin` en elementos de tabla es inconsistente entre clientes; en su lugar, el espaciado se controla con `padding` en las celdas, o con filas/columnas "espaciadoras" dedicadas.

```html
<!-- Espaciador vertical entre dos secciones -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td height="20" style="font-size:1px; line-height:1px;">&nbsp;</td>
  </tr>
</table>
```

```html
<!-- Espaciador horizontal entre dos columnas -->
<td width="20" style="width:20px; font-size:1px; line-height:1px;">&nbsp;</td>
```

`&nbsp;` (espacio no separable) es necesario porque algunos clientes colapsan celdas completamente vacías, ignorando la altura/ancho declarados — el espacio en blanco fuerza a la celda a mantener sus dimensiones.

## 5.5 Layout de Tres o Más Columnas

```html
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td width="180" valign="top" style="width:180px; padding:10px;">Columna 1</td>
    <td width="180" valign="top" style="width:180px; padding:10px;">Columna 2</td>
    <td width="180" valign="top" style="width:180px; padding:10px;">Columna 3</td>
  </tr>
</table>
```

> **Cuidado con la suma de anchos:** 180 + 180 + 180 = 540, no 600 — deja margen intencional para el `padding` de cada columna, ya que en el modelo de caja tradicional (sin `box-sizing: border-box` confiable en tablas), el padding se suma al ancho declarado en algunos clientes.

## 5.6 Mejora Progresiva con Flexbox (Solo para Clientes Modernos)

Clientes que sí soportan Flexbox (Apple Mail, Gmail web/app en ciertos contextos) pueden recibir un layout mejorado, mientras Outlook sigue viendo la base de tabla — usando `<style>` en el `<head>` con selectores de clase, en lugar de reemplazar la estructura de tabla por completo.

```html
<head>
  <style>
    @media screen and (min-width: 480px) {
      .contenedor-flex { display: flex !important; }
    }
  </style>
</head>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="contenedor-flex">
  <!-- Outlook ve la tabla; los clientes modernos aplican display:flex por encima -->
</table>
```

## 5.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un contenedor de una sola columna | Una tabla de 600px con un único `<td>` |
| Varias columnas lado a lado | `<td>` con ancho fijo por columna, cada una con su propia tabla anidada |
| Que las columnas se alineen arriba, no al centro | `valign="top"` + `vertical-align:top` |
| Espaciado confiable entre secciones | Filas/columnas espaciadoras con `&nbsp;`, no `margin` |
| Mejorar el layout en clientes modernos sin romper Outlook | `<style>` con `@media` aplicando Flexbox sobre la base de tabla |

## 5.8 Errores Comunes

- **Usar `margin` para separar elementos dentro de tablas**: el soporte es inconsistente; usa `padding` en las celdas o espaciadores dedicados.
- **Celdas vacías sin `&nbsp;`**: varios clientes colapsan su altura/ancho a cero, rompiendo el espaciado visual esperado.
- **Sumar anchos de columna sin dejar margen para el padding**: produce columnas que se desbordan del ancho total del contenedor en clientes que suman padding al ancho declarado.
