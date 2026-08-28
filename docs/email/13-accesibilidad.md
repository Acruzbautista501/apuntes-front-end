# Módulo 13: Accesibilidad en Email

Un email inaccesible excluye a una parte real de la audiencia — usuarios con lectores de pantalla, baja visión, o dificultades motoras. Este módulo cubre las prácticas de accesibilidad específicas de email, que difieren en varios puntos de la accesibilidad web estándar por las limitaciones estructurales ya vistas (tablas como base de layout, CSS inline).

## 13.1 `role="presentation"` en Todas las Tablas de Layout

Ya introducido en el Módulo 2, vale la pena remarcarlo como la regla de accesibilidad más importante de todo el documento: **toda** tabla usada para estructurar el layout (no para mostrar datos tabulares reales) debe llevar `role="presentation"`.

```html
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
```

Sin este atributo, un lector de pantalla anuncia cada tabla de layout como si fuera una tabla de datos real ("tabla, 4 filas, 2 columnas"), generando ruido innecesario y confuso en cada una de las decenas de tablas anidadas de un email típico.

## 13.2 Jerarquía de Encabezados Real

```html
<!-- ❌ Un <span> con estilo grande no es un encabezado real para un lector de pantalla -->
<span style="font-size:28px; font-weight:bold;">Bienvenida</span>

<!-- ✅ Un encabezado semántico real, con el tamaño controlado por CSS -->
<h1 style="font-size:28px; font-weight:bold; margin:0; font-family:Arial, sans-serif;">
  Bienvenida
</h1>
```

Usar etiquetas de encabezado reales (`<h1>`-`<h6>`) permite que los usuarios de lector de pantalla naveguen el email por su estructura (saltando de encabezado en encabezado), en lugar de tener que escuchar todo el contenido de forma lineal.

## 13.3 `alt` Descriptivo, No Solo Presente

```html
<!-- ❌ Técnicamente tiene alt, pero no aporta información real -->
<img src="banner.jpg" alt="banner">

<!-- ✅ Describe el mensaje real que la imagen comunica -->
<img src="banner.jpg" alt="20% de descuento en toda la tienda hasta el domingo">

<!-- Para imágenes puramente decorativas, alt vacío indica "ignórame" explícitamente -->
<img src="separador-decorativo.png" alt="">
```

Un `alt` vacío (`alt=""`) en una imagen puramente decorativa es la práctica correcta — le indica al lector de pantalla que la omita, en lugar de anunciar un nombre de archivo poco útil como "separador-decorativo-png".

## 13.4 Contraste de Color

Las mismas pautas WCAG de la web aplican en email: un contraste mínimo de **4.5:1** entre texto y fondo para texto normal, y **3:1** para texto grande (18px+ o 14px+ en negrita).

```html
<!-- ❌ Contraste insuficiente: gris claro sobre blanco -->
<td style="color:#cccccc; background-color:#ffffff;">Texto difícil de leer</td>

<!-- ✅ Contraste adecuado -->
<td style="color:#333333; background-color:#ffffff;">Texto legible</td>
```

Herramientas como el *Color Contrast Checker* de WebAIM permiten verificar cualquier combinación de colores antes de finalizar el diseño.

## 13.5 Texto de Enlaces Descriptivo

```html
<!-- ❌ Sin contexto fuera de su posición visual en la página -->
<a href="...">Haz clic aquí</a>

<!-- ✅ Describe el destino incluso fuera de contexto -->
<a href="...">Ver todos los productos en oferta</a>
```

Algunos lectores de pantalla permiten navegar por una lista de todos los enlaces de una página de forma aislada — "Haz clic aquí" repetido varias veces en esa lista no comunica nada útil sobre a dónde lleva cada uno.

## 13.6 Orden de Lectura Lógico

El orden del código HTML determina el orden en que un lector de pantalla anuncia el contenido — un layout construido visualmente con trucos de posicionamiento (poco comunes en email, pero posibles con VML) puede desincronizar el orden visual del orden de lectura real.

```html
<!-- El orden en el código DEBE coincidir con el orden de lectura esperado -->
<table role="presentation">
  <tr><td>1. Primero esto</td></tr>
  <tr><td>2. Luego esto</td></tr>
  <tr><td>3. Finalmente esto</td></tr>
</table>
```

## 13.7 Idioma del Documento

```html
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
```

El atributo `lang` en `<html>` le indica al lector de pantalla qué pronunciación e idioma usar — sin él, un lector de pantalla configurado en otro idioma puede pronunciar el contenido de forma incorrecta o ininteligible.

## 13.8 Tamaño de Fuente Mínimo

Ya mencionado en el Módulo 4 desde la perspectiva de legibilidad general — también es un requisito de accesibilidad: texto menor a 14px es difícil de leer para usuarios con baja visión, incluso con zoom disponible en la mayoría de clientes.

## 13.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Que las tablas de layout no generen ruido en lectores de pantalla | `role="presentation"` en cada una |
| Navegación por estructura para usuarios de lector de pantalla | Encabezados reales (`<h1>`-`<h6>`), no texto grande sin semántica |
| Que las imágenes comuniquen su mensaje sin verse | `alt` descriptivo del contenido, o `alt=""` si es decorativa |
| Contraste legible para baja visión | Mínimo 4.5:1 (texto normal) / 3:1 (texto grande) |
| Enlaces comprensibles fuera de contexto | Texto descriptivo, nunca "haz clic aquí" |

## 13.10 Errores Comunes

- **Usar `<span>`/`<div>` con estilos grandes en lugar de encabezados reales**: elimina por completo la capacidad de navegación estructural para usuarios de lector de pantalla.
- **Omitir `role="presentation"` en las tablas de layout**: genera ruido acumulativo severo a lo largo de todo el email, dado el número de tablas anidadas típico.
- **Enlaces genéricos repetidos ("Ver más", "Haz clic aquí")**: sin contexto adicional, resultan indistinguibles entre sí para quien navega por una lista de enlaces aislada del resto del contenido.
