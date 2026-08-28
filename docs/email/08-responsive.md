# Módulo 8: Responsive Email con Media Queries

Más de la mitad del tráfico de email hoy proviene de dispositivos móviles. Este módulo cubre cómo adaptar el layout basado en tablas del Módulo 5 a pantallas pequeñas usando media queries dentro del `<style>` del `<head>`.

## 8.1 El Enfoque Estándar: *Fluid-Hybrid*

La técnica más robusta combina un layout **fluido** (que se adapta automáticamente con porcentajes) con reglas específicas de media query para ajustar detalles — en lugar de depender por completo de un único enfoque.

```html
<head>
  <style>
    @media screen and (max-width: 600px) {
      .contenedor-fluido {
        width: 100% !important;
        max-width: 100% !important;
      }
      .columna-fluida {
        display: block !important;
        width: 100% !important;
      }
      .padding-movil {
        padding: 16px !important;
      }
      .texto-movil {
        font-size: 18px !important;
        line-height: 26px !important;
      }
    }
  </style>
</head>
```

El `!important` es necesario porque estas reglas deben sobrescribir los estilos inline (Módulo 3), que normalmente tienen mayor especificidad que cualquier regla en `<style>`.

## 8.2 Apilar Columnas en Móvil

El layout de dos columnas del Módulo 5 se convierte en una sola columna apilada verticalmente en pantallas pequeñas.

```html
<head>
  <style>
    @media screen and (max-width: 600px) {
      .columna { display: block !important; width: 100% !important; }
    }
  </style>
</head>

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td width="300" valign="top" class="columna" style="width:300px; padding:20px;">
      Columna izquierda
    </td>
    <td width="300" valign="top" class="columna" style="width:300px; padding:20px;">
      Columna derecha
    </td>
  </tr>
</table>
```

Al aplicar `display:block` a ambos `<td>` en móvil, cada uno ocupa una fila completa por sí solo, produciendo el apilamiento vertical — importante: esta técnica requiere que Outlook **no** vea estas reglas (Outlook de escritorio no procesa emails en un contexto "móvil" real, así que no le afecta negativamente, pero conviene tenerlo presente al probar).

## 8.3 `<meta name="viewport">` — El Primer Paso Obligatorio

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Sin este meta tag (visto ya en el Módulo 2), los clientes móviles renderizan el email a su ancho de diseño original y luego lo escalan hacia abajo para que quepa en pantalla — el texto se ve diminuto y las media queries ni siquiera llegan a activarse correctamente.

## 8.4 Tamaños de Fuente y Espaciado Adaptactivos

```html
<head>
  <style>
    @media screen and (max-width: 600px) {
      .titulo-movil { font-size: 24px !important; line-height: 30px !important; }
      .padding-seccion { padding: 30px 20px !important; }
    }
  </style>
</head>

<td class="titulo-movil" style="font-size:32px; line-height:38px; font-family:Arial, sans-serif;">
  Título principal
</td>
```

Reducir ligeramente el tamaño de encabezados grandes en móvil evita que el texto se vea desproporcionado en pantallas angostas, sin sacrificar jerarquía visual.

## 8.5 Ocultar/Mostrar Contenido según el Dispositivo

```html
<head>
  <style>
    .solo-movil { display: none !important; }
    @media screen and (max-width: 600px) {
      .solo-escritorio { display: none !important; }
      .solo-movil { display: block !important; }
    }
  </style>
</head>

<div class="solo-escritorio">Imagen grande de escritorio</div>
<div class="solo-movil" style="display:none;">Versión compacta para móvil</div>
```

Útil para mostrar una imagen de banner distinta en escritorio versus móvil, o simplificar navegación/CTAs adicionales que solo tienen sentido en pantallas grandes.

## 8.6 Detección de Modo Oscuro Automático (Anticipo del Módulo 10)

```html
<style>
  @media (prefers-color-scheme: dark) {
    .fondo-adaptativo { background-color: #1a1a1a !important; }
    .texto-adaptativo { color: #f4f4f4 !important; }
  }
</style>
```

Se retoma a fondo en el Módulo 10, pero conceptualmente es la misma técnica de media queries aplicada a la preferencia de color del sistema, en lugar del ancho de pantalla.

## 8.7 Probar el Comportamiento Responsivo

Redimensionar la ventana del navegador **no** es una prueba confiable — los clientes de correo móviles reales (la app de Gmail en Android, Apple Mail en iOS) a veces ignoran ciertas media queries o las procesan de forma distinta al navegador. La validación real requiere herramientas de testing dedicadas (Módulo 14) o dispositivos físicos.

## 8.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Que el email escale correctamente en móvil desde el inicio | `<meta name="viewport">` |
| Apilar columnas en pantallas pequeñas | `display:block !important` en cada `<td>` de columna, dentro de una media query |
| Ajustar tamaños de fuente por dispositivo | Clases con reglas `!important` dentro de `@media` |
| Mostrar contenido distinto según el dispositivo | Clases `.solo-movil`/`.solo-escritorio` alternadas con `display:none`/`block` |

## 8.9 Errores Comunes

- **Olvidar `!important` en las reglas de media query**: el estilo inline (con mayor especificidad) sigue ganando, y el ajuste responsivo no se aplica en absoluto.
- **Probar el responsivo solo redimensionando el navegador**: no representa fielmente cómo lo verán los clientes móviles reales — siempre valida con herramientas dedicadas o dispositivos físicos.
- **Olvidar el `<meta viewport>`**: sin él, ninguna media query se comporta como se espera en dispositivos móviles.
