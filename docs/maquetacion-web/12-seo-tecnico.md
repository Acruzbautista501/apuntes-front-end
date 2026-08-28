# Módulo 12: SEO Técnico para Maquetadores

El Módulo 7 cubrió meta tags. El SEO técnico va más allá: datos estructurados que permiten resultados enriquecidos en Google, el archivo `sitemap.xml` que ayuda a los motores de búsqueda a descubrir todo el contenido del sitio, y `robots.txt` que controla qué se rastrea. Ninguno de estos requiere backend — son responsabilidad directa de la maquetación.

## 12.1 Datos Estructurados (Schema.org) con JSON-LD

Los datos estructurados le dan a Google información explícita y sin ambigüedad sobre el contenido de la página — habilitando "resultados enriquecidos" (estrellas de reseña, precios, información de eventos) directamente en los resultados de búsqueda.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Zapatillas Deportivas Modelo X",
  "image": "https://ejemplo.com/imagenes/zapatillas.jpg",
  "description": "Zapatillas deportivas con amortiguación avanzada.",
  "offers": {
    "@type": "Offer",
    "price": "89.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "230"
  }
}
</script>
```

JSON-LD (*JSON for Linking Data*) es el formato recomendado por Google — se coloca como un bloque `<script>` independiente, sin necesitar mezclarse con los atributos HTML visibles del contenido.

## 12.2 Tipos de Schema Más Comunes

| Tipo de página | Schema recomendado |
| :--- | :--- |
| Producto de e-commerce | `Product` + `Offer` + `AggregateRating` |
| Artículo de blog | `Article` o `BlogPosting` |
| Receta | `Recipe` |
| Evento | `Event` |
| Negocio local | `LocalBusiness` |
| Preguntas frecuentes | `FAQPage` |
| Migas de pan (breadcrumbs) | `BreadcrumbList` |

## 12.3 FAQPage — Un Caso Práctico Común

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto tarda el envío?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El envío estándar tarda de 3 a 5 días hábiles."
      }
    }
  ]
}
</script>
```

Marcado correctamente, este contenido puede aparecer directamente expandible dentro de los propios resultados de búsqueda de Google, aumentando significativamente la visibilidad de la página sin necesitar mejorar el ranking en sí.

## 12.4 `sitemap.xml` — El Mapa del Sitio

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ejemplo.com/</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ejemplo.com/productos</loc>
    <lastmod>2026-08-20</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

El sitemap ayuda a los motores de búsqueda a **descubrir** todas las páginas del sitio, especialmente páginas que no están bien enlazadas internamente desde otras partes del sitio — no garantiza indexación, pero facilita significativamente el rastreo completo.

## 12.5 `robots.txt` — Control de Rastreo

```text
User-agent: *
Disallow: /admin/
Disallow: /carrito/
Allow: /

Sitemap: https://ejemplo.com/sitemap.xml
```

`robots.txt` vive en la raíz del dominio (`https://ejemplo.com/robots.txt`) y le indica a los rastreadores qué secciones del sitio **no** deben rastrear — nunca debe usarse para "ocultar" contenido sensible (no es un mecanismo de seguridad, es solo una sugerencia que los rastreadores respetuosos siguen).

## 12.6 URLs Amigables para SEO

```text
❌ https://ejemplo.com/producto?id=48291&cat=3
✅ https://ejemplo.com/productos/zapatillas-deportivas-modelo-x
```

URLs descriptivas, en minúsculas, con palabras separadas por guiones (no guiones bajos), sin parámetros innecesarios visibles — más fáciles de entender tanto para usuarios como para motores de búsqueda, y generalmente correlacionan con mejor rendimiento de SEO.

## 12.7 Enlazado Interno Estratégico

El texto ancla de los enlaces internos (el texto visible del `<a>`) es una señal de SEO relevante — un enlace con texto descriptivo ("Ver nuestra guía completa de mantenimiento") aporta más contexto semántico que uno genérico ("Ver más", ya mencionado también como problema de accesibilidad en el Módulo 11).

## 12.8 Validar los Datos Estructurados

* **Google Rich Results Test**: valida específicamente si el JSON-LD es correcto y qué tipo de resultado enriquecido podría generar.
* **Schema Markup Validator** (de Schema.org): validación más general de sintaxis, no específica a cómo Google la interpreta.

## 12.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Resultados enriquecidos en Google (estrellas, precio) | Datos estructurados JSON-LD con el `@type` correspondiente |
| Que los motores de búsqueda descubran todas las páginas | `sitemap.xml` |
| Controlar qué secciones no deben rastrearse | `robots.txt` |
| URLs fáciles de entender y mejor posicionadas | Rutas descriptivas en minúsculas con guiones |
| Contexto semántico adicional entre páginas internas | Texto ancla descriptivo en enlaces internos |

## 12.10 Errores Comunes

- **Usar `robots.txt` para intentar ocultar contenido sensible**: no es un mecanismo de seguridad — cualquiera puede leer el archivo directamente, y algunos rastreadores lo ignoran deliberadamente.
- **Marcar datos estructurados que no coinciden con el contenido visible de la página**: viola las políticas de Google y puede resultar en penalizaciones manuales.
- **No validar el JSON-LD antes de publicar**: un error de sintaxis JSON hace que el bloque completo sea ignorado silenciosamente, sin ningún error visible en la página renderizada.
