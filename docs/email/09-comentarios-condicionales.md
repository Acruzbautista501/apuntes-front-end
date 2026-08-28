# Módulo 9: Comentarios Condicionales de Outlook (MSO)

Ya se usaron comentarios condicionales en los Módulos 6 y 7 sin explicarlos a fondo. Este módulo cubre la mecánica completa de esta técnica — la herramienta más importante para "hablarle" específicamente a Outlook sin afectar al resto de clientes.

## 9.1 Qué Son los Comentarios Condicionales

Los comentarios condicionales son una característica heredada de Internet Explorer que Outlook de escritorio conserva (porque su motor de renderizado, basado en Word, comparte ese linaje). Un comentario HTML normal (`<!-- ... -->`) es invisible para todos los clientes; un comentario **condicional** con una sintaxis especial es interpretado selectivamente solo por Outlook.

```html
<!--[if mso]>
  Este contenido SOLO lo procesa Outlook (Word)
<![endif]-->
```

Cualquier otro cliente (Gmail, Apple Mail, Yahoo) ve esto como un comentario HTML común y lo ignora por completo — el contenido dentro nunca se renderiza para ellos.

## 9.2 `[if !mso]` — Lo Opuesto: Todo Menos Outlook

```html
<!--[if !mso]><!-->
  Este contenido lo ve TODO cliente excepto Outlook
<!--<![endif]-->
```

La sintaxis es más compleja porque combina dos mecanismos: el comentario condicional (`[if !mso]`) que Outlook entiende y usa para *ocultar* el bloque, con un truco adicional (`<!-->` y `<!--<![endif]-->`) que hace que el resto de clientes vean el contenido como HTML normal, no como un comentario.

## 9.3 El Patrón "Mostrar/Ocultar" Combinado

Es el patrón central detrás de los fondos con VML (Módulo 6) y los botones a prueba de balas (Módulo 7): mostrar una versión a Outlook, y la versión estándar al resto.

```html
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
<tr><td>
<![endif]-->

<div style="max-width:600px; margin:0 auto;">
  Contenido con layout moderno para clientes que lo soportan
</div>

<!--[if mso]>
</td></tr>
</table>
<![endif]-->
```

Outlook recibe una estructura de tabla envolvente (que sí entiende); el resto de clientes ve directamente el `<div>` con CSS moderno.

## 9.4 Detectar Versiones Específicas de Outlook

```html
<!--[if mso 12]>
  Solo Outlook 2007
<![endif]-->

<!--[if gte mso 9]>
  Outlook 2000 en adelante (gte = "greater than or equal", mayor o igual)
<![endif]-->
```

| Valor | Versión de Outlook |
| :--- | :--- |
| `mso 9` | Outlook 2000 |
| `mso 11` | Outlook 2003 |
| `mso 12` | Outlook 2007 |
| `mso 14` | Outlook 2010 |
| `mso 15` | Outlook 2013 |
| `mso 16` | Outlook 2016 en adelante (incluye 2019, 2021, 365) |

En la práctica, la gran mayoría de proyectos solo necesitan `[if mso]` genérico — apuntar a versiones específicas es necesario únicamente cuando un bug de renderizado afecta solo a una versión particular.

## 9.5 Corregir el Ancho en Outlook con `<!--[if mso]>` + Tablas "Ghost"

Un problema recurrente: Outlook a veces ignora `max-width` en un `<div>`, haciendo que el contenido se estire al ancho completo de la ventana. La solución agrega una tabla invisible ("fantasma") que fuerza el ancho correcto solo para Outlook.

```html
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center">
<tr><td width="600">
<![endif]-->

<div style="max-width:600px; margin:0 auto;">
  Contenido
</div>

<!--[if mso]>
</td></tr>
</table>
<![endif]-->
```

## 9.6 Ocultar Elementos Completamente en Outlook

```html
<!--[if !mso]><!-->
<img src="animacion.gif" alt="Animación" style="display:block; width:100%;">
<!--<![endif]-->
```

Útil para GIFs animados (Outlook solo muestra el primer fotograma de forma estática, y a veces de forma distorsionada) o cualquier elemento decorativo que simplemente se omite para Outlook en lugar de mostrarse roto.

## 9.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Contenido que solo vea Outlook | `<!--[if mso]>...<![endif]-->` |
| Contenido que vea todo menos Outlook | `<!--[if !mso]><!-->...<!--<![endif]-->` |
| Apuntar a una versión específica de Outlook | `<!--[if mso 16]>...<![endif]-->` (con el número de versión correspondiente) |
| Forzar un ancho correcto en Outlook | Tabla "fantasma" envolviendo el `<div>` con `max-width` |

## 9.8 Errores Comunes

- **Confundir `[if !mso]><!--` con `[if !mso]>`**: la sintaxis exacta (incluyendo el `<!--` extra) es lo que hace que el resto de clientes procese el contenido como HTML real en vez de como un comentario — un error tipográfico aquí rompe el bloque completo silenciosamente.
- **Olvidar cerrar correctamente las etiquetas abiertas dentro de un bloque condicional**: un `<table>`/`<tr>`/`<td>` abierto en un bloque `[if mso]` que nunca se cierra correctamente puede romper la estructura completa del documento para Outlook.
- **Sobreusar comentarios condicionales donde no son necesarios**: si una propiedad CSS ya es compatible universalmente, envolverla en `[if mso]` solo agrega complejidad innecesaria al código.
