# Módulo 10: Rendimiento Web (Core Web Vitals)

El rendimiento no es solo "que el sitio cargue rápido" de forma subjetiva — Google define métricas específicas y medibles (**Core Web Vitals**) que afectan directamente tanto la experiencia de usuario como el ranking de búsqueda. Este módulo cubre esas métricas y las técnicas de maquetación que las mejoran.

## 10.1 Las Tres Métricas Principales

| Métrica | Qué mide | Objetivo |
| :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | Tiempo hasta que el elemento visual más grande se renderiza | Menos de 2.5 segundos |
| **INP** (Interaction to Next Paint) | Qué tan rápido responde la página a una interacción del usuario | Menos de 200 milisegundos |
| **CLS** (Cumulative Layout Shift) | Cuánto "saltan" visualmente los elementos mientras la página carga | Menos de 0.1 |

## 10.2 Mejorar el LCP

El elemento LCP suele ser una imagen grande, un video, o un bloque de texto principal — casi siempre el "hero" visual de la página.

```html
<!-- Precargar la imagen LCP para que empiece a descargarse lo antes posible -->
<link rel="preload" as="image" href="hero-banner.jpg" fetchpriority="high">
```

```html
<!-- NUNCA aplicar loading="lazy" a la imagen LCP -->
<img src="hero-banner.jpg" alt="..." fetchpriority="high">
```

`fetchpriority="high"` le indica al navegador que priorice esta descarga sobre otros recursos de la página — combinado con `preload`, adelanta el momento en que el elemento principal aparece visualmente.

## 10.3 Mejorar el INP

```css
/* Evitar animaciones costosas que bloquean el hilo principal durante la interacción */
.elemento-animado {
  /* ❌ Costoso: fuerza recálculo de layout en cada frame */
  transition: width 0.3s, height 0.3s, top 0.3s;

  /* ✅ Barato: el navegador puede animar en la GPU sin recalcular layout */
  transition: transform 0.3s, opacity 0.3s;
}
```

Animar `transform` y `opacity` (en lugar de `width`, `height`, `top`, `left`) es más barato computacionalmente porque el navegador puede procesarlas en la GPU sin recalcular el layout completo de la página en cada fotograma.

## 10.4 Mejorar el CLS

```html
<!-- Reservar espacio explícito para imágenes (Módulo 6) -->
<img src="foto.jpg" width="800" height="600" alt="...">

<!-- Reservar espacio para contenido cargado dinámicamente (anuncios, embebidos) -->
<div style="min-height: 250px;">
  <!-- Contenido que carga después -->
</div>
```

```css
/* Reservar espacio para fuentes web antes de que carguen, evitando el "salto" del texto */
@font-face {
  font-family: 'MiFuente';
  src: url('mifuente.woff2') format('woff2');
  font-display: swap; /* Muestra la fuente de respaldo inmediatamente, sin bloquear el render */
}
```

## 10.5 CSS Crítico (*Critical CSS*)

El CSS necesario para renderizar el contenido visible sin hacer scroll ("above the fold") se puede insertar directamente en el `<head>` con un `<style>` en línea, mientras el resto del CSS (para contenido que aparece más abajo) se carga de forma diferida — evita que el navegador tenga que esperar la descarga completa de una hoja de estilos externa antes de mostrar cualquier contenido.

```html
<head>
  <style>
    /* CSS mínimo para el contenido visible sin scroll, inyectado directamente */
    .header { ... }
    .hero { ... }
  </style>

  <link rel="preload" href="estilos-completos.css" as="style" onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="estilos-completos.css"></noscript>
</head>
```

Este proceso normalmente se automatiza con una herramienta (`critical`, o integrado en el pipeline de build) en lugar de extraerse manualmente.

## 10.6 Lazy Loading Más Allá de Imágenes

```html
<iframe src="video-embebido.html" loading="lazy"></iframe>
```

```javascript
// Componentes JavaScript pesados, cargados solo cuando son necesarios
const cargarWidgetChat = () => import('./widget-chat.js')
document.querySelector('#boton-chat').addEventListener('click', cargarWidgetChat, { once: true })
```

## 10.7 Minimizar Solicitudes de Red

* **Combinar/comprimir CSS y JS** en el build (retomado en el Módulo 13).
* **Usar un CDN** para servir assets estáticos desde un servidor geográficamente más cercano al usuario.
* **Preconectar a dominios externos críticos** (fuentes, APIs de terceros) antes de que se necesiten realmente.

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

## 10.8 Medir el Rendimiento Real

* **Lighthouse** (integrado en Chrome DevTools): audita rendimiento, accesibilidad, SEO y buenas prácticas con un puntaje concreto y recomendaciones específicas.
* **PageSpeed Insights**: la versión online de Lighthouse, que además muestra datos reales de usuarios (*Field Data*) recopilados por Chrome, no solo una simulación de laboratorio.
* **WebPageTest**: análisis más detallado con capacidad de probar desde distintas ubicaciones geográficas y condiciones de red.

## 10.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Que el elemento visual principal aparezca más rápido | `fetchpriority="high"` + `preload`, nunca `loading="lazy"` en él |
| Interacciones fluidas sin bloqueo del hilo principal | Animar `transform`/`opacity`, no propiedades de layout |
| Evitar saltos visuales durante la carga | `width`/`height` explícitos, `font-display: swap`, espacio reservado para contenido dinámico |
| Mostrar contenido visible más rápido | CSS crítico inline + el resto diferido |
| Medir el rendimiento real del sitio | Lighthouse / PageSpeed Insights |

## 10.10 Errores Comunes

- **Aplicar `loading="lazy"` a la imagen principal del hero**: empeora directamente el LCP, la métrica más visible de rendimiento percibido.
- **Animar `width`/`height`/`top`/`left` en lugar de `transform`**: fuerza recálculos de layout costosos que empeoran directamente el INP.
- **No reservar espacio para contenido que carga dinámicamente**: causa saltos de layout molestos que penalizan directamente el CLS y frustran al usuario que intenta interactuar con el contenido.
