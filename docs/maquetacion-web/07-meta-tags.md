# Módulo 7: Meta Tags Esenciales

Los meta tags viven en el `<head>` y son invisibles en la página, pero determinan cómo motores de búsqueda y redes sociales interpretan y muestran el sitio — un `<head>` incompleto es una de las causas más comunes de que un enlace compartido se vea genérico o roto en redes sociales, o de que el sitio tenga problemas de SEO evitables.

## 7.1 Meta Tags Base

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nombre de la Página | Nombre del Sitio</title>
  <meta name="description" content="Una descripción concisa y atractiva de 150-160 caracteres que resume el contenido de esta página específica.">
</head>
```

* `<title>` es el factor de SEO on-page más influyente después del propio contenido — único por página, descriptivo, idealmente bajo 60 caracteres para no truncarse en resultados de búsqueda.
* `meta description` no afecta directamente el ranking, pero sí la tasa de clics desde los resultados de búsqueda — es el texto que Google muestra debajo del título.

## 7.2 Open Graph — Cómo se Ve al Compartir en Facebook/LinkedIn

```html
<meta property="og:title" content="Título optimizado para compartir">
<meta property="og:description" content="Descripción atractiva para la vista previa social.">
<meta property="og:image" content="https://ejemplo.com/imagen-social.jpg">
<meta property="og:url" content="https://ejemplo.com/pagina-actual">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nombre del Sitio">
```

Sin estos tags, la mayoría de plataformas intentan adivinar una imagen y descripción automáticamente del contenido de la página — con resultados frecuentemente pobres o incorrectos. `og:image` debe tener al menos 1200x630px para mostrarse correctamente en la mayoría de plataformas.

## 7.3 Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Título optimizado para X/Twitter">
<meta name="twitter:description" content="Descripción para la vista previa.">
<meta name="twitter:image" content="https://ejemplo.com/imagen-social.jpg">
```

X/Twitter usa sus propios meta tags en lugar de Open Graph completo (aunque cae de regreso a Open Graph si los tags de Twitter no están presentes) — `summary_large_image` es el formato de tarjeta más común, mostrando una imagen grande sobre el texto.

## 7.4 Favicons — El Set Completo Moderno

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

Un solo `favicon.ico` ya no es suficiente para cubrir todos los contextos modernos: pestañas del navegador, íconos de acceso directo en iOS (`apple-touch-icon`), y la Progressive Web App manifest (retomada en el Módulo 18).

## 7.5 Canonical URL — Evitar Contenido Duplicado

```html
<link rel="canonical" href="https://ejemplo.com/pagina-original">
```

Cuando el mismo contenido es accesible desde varias URLs (con o sin parámetros de tracking, con o sin barra final), la etiqueta canonical le indica a los motores de búsqueda cuál es la versión "oficial" a indexar, evitando que dividan la autoridad de SEO entre duplicados.

## 7.6 `robots` — Control de Indexación por Página

```html
<meta name="robots" content="index, follow">        <!-- Comportamiento por defecto -->
<meta name="robots" content="noindex, nofollow">     <!-- Excluir esta página específica de los resultados -->
```

Útil para páginas que no deben aparecer en resultados de búsqueda (páginas de agradecimiento tras un formulario, entornos de staging) sin necesitar bloquear todo el sitio con `robots.txt` (Módulo 12).

## 7.7 Meta Tags Específicos de Idioma y Región

```html
<html lang="es-MX">
<link rel="alternate" hreflang="es-MX" href="https://ejemplo.com/mx/">
<link rel="alternate" hreflang="en-US" href="https://ejemplo.com/us/">
<link rel="alternate" hreflang="x-default" href="https://ejemplo.com/">
```

Para sitios multi-región/idioma, `hreflang` le indica a los motores de búsqueda qué versión mostrar según el idioma/ubicación del usuario que busca — evita que Google muestre la versión equivocada del sitio a la audiencia equivocada.

## 7.8 Theme Color para Navegadores Móviles

```html
<meta name="theme-color" content="#0066cc">
```

Colorea la barra de direcciones/interfaz del navegador en dispositivos móviles compatibles (principalmente Chrome en Android) para que coincida con la identidad visual de la marca.

## 7.9 Validar los Meta Tags Antes de Publicar

* **Facebook Sharing Debugger**: previsualiza exactamente cómo se verá el enlace al compartirse en Facebook/LinkedIn, y fuerza a la plataforma a re-escanear si ya cacheó una vista previa desactualizada.
* **X/Twitter Card Validator**: equivalente para X/Twitter.
* **Google Rich Results Test**: valida tags de SEO y datos estructurados (retomado en el Módulo 12).

## 7.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un título único y descriptivo por página | `<title>` |
| Mejorar el clic desde resultados de búsqueda | `meta name="description"` |
| Una vista previa correcta al compartir en redes sociales | Open Graph (`og:*`) + Twitter Cards |
| Íconos correctos en todos los contextos (pestaña, iOS, PWA) | El set completo de favicons |
| Evitar penalización por contenido duplicado | `rel="canonical"` |
| Excluir una página específica de los resultados de búsqueda | `meta name="robots" content="noindex"` |

## 7.11 Errores Comunes

- **Usar el mismo `<title>`/`description` en todas las páginas del sitio**: desperdicia una de las señales de SEO más directas y produce vistas previas idénticas y poco útiles al compartir distintas páginas.
- **Olvidar `og:image` o usar una imagen de baja resolución**: produce vistas previas rotas o de baja calidad al compartir en redes sociales, afectando directamente la tasa de clics.
- **No validar los meta tags con las herramientas oficiales antes de publicar**: un error de sintaxis o una imagen con ruta incorrecta puede pasar desapercibido en el código pero romper por completo la vista previa social.
