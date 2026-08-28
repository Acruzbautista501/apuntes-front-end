# Módulo 17: Internacionalización (i18n) en Maquetación

Un sitio diseñado y probado únicamente en español (o cualquier idioma único) frecuentemente se rompe visualmente al traducirse: texto que se desborda porque el alemán es más largo, layouts que no funcionan en idiomas de derecha a izquierda como el árabe, o formatos de fecha/número que confunden a la audiencia. Este módulo cubre las consideraciones de maquetación específicas de internacionalización.

## 17.1 El Atributo `lang` — La Base

```html
<html lang="es">
```

```html
<!-- Contenido específico en otro idioma dentro de una página -->
<p>El término <span lang="en">"call to action"</span> se usa frecuentemente en marketing digital.</p>
```

Ya visto en el Módulo 2 (HTML semántico) y en la sección de Email — vale la pena remarcarlo aquí desde la perspectiva de un sitio multi-idioma: cada versión del sitio debe declarar su `lang` correcto, y fragmentos de texto en un idioma distinto al principal de la página deben marcarse individualmente.

## 17.2 Expansión y Contracción de Texto

```text
Español: "Agregar al carrito" (18 caracteres)
Alemán: "In den Warenkorb legen" (23 caracteres)
Finlandés: "Lisää ostoskoriin" (18 caracteres, pero palabras más largas sin espacios)
```

Como regla general, el texto en inglés suele ser el más corto entre idiomas comunes — diseñar y maquetar basándose únicamente en textos en inglés (o cualquier idioma particularmente compacto) es una causa común de layouts que se rompen al traducirse a idiomas más largos.

```css
.btn {
  /* ❌ Un ancho fijo no deja espacio para expansión de texto */
  width: 150px;

  /* ✅ Se adapta al contenido real, con límites razonables */
  width: fit-content;
  min-width: 120px;
  max-width: 100%;
  padding: 12px 24px;
}
```

## 17.3 Soporte para Idiomas de Derecha a Izquierda (RTL)

```html
<html lang="ar" dir="rtl">
```

```css
/* Propiedades lógicas (ya cubiertas en la sección de CSS3): se adaptan automáticamente a RTL */
.tarjeta {
  padding-inline-start: 1rem;  /* En LTR: padding-left. En RTL: padding-right, automáticamente */
  margin-inline-end: 0.5rem;
}

/* ❌ Propiedades físicas: requieren reglas RTL manuales y duplicadas */
.tarjeta-antigua {
  padding-left: 1rem;
  margin-right: 0.5rem;
}
```

El uso de **propiedades lógicas** (`inline-start`/`inline-end` en lugar de `left`/`right`) — ya cubierto en profundidad en la sección de CSS3 de este sitio — es la técnica moderna que hace que el mismo CSS funcione correctamente en LTR y RTL sin duplicar reglas para cada dirección.

## 17.4 Iconografía y Elementos Direccionales

```css
/* Un ícono de flecha "siguiente" debe voltearse en RTL */
[dir="rtl"] .icono-flecha-siguiente {
  transform: scaleX(-1);
}
```

Íconos con significado direccional (flechas de "atrás"/"siguiente", indicadores de progreso) deben invertirse visualmente en contextos RTL para mantener su significado correcto — no todos los íconos necesitan esto (un ícono de "play" de video, por convención, no se invierte).

## 17.5 Formatos de Fecha, Número y Moneda

```javascript
// API nativa Intl del navegador, sin librerías externas
const formateadorFecha = new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' })
formateadorFecha.format(new Date()) // "28 de agosto de 2026"

const formateadorMoneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
formateadorMoneda.format(1234.5) // "$1,234.50"

const formateadorMonedaAleman = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
formateadorMonedaAleman.format(1234.5) // "1.234,50 €" — separadores de miles/decimales invertidos
```

La API `Intl` nativa del navegador maneja automáticamente las convenciones regionales de formato — nunca se debe asumir que un formato de fecha/número es universal (`MM/DD/YYYY` es específico de EE.UU.; la mayoría del mundo usa `DD/MM/YYYY`).

## 17.6 Tipografía y Fuentes para Distintos Sistemas de Escritura

```css
body {
  font-family: 'Inter', Arial, sans-serif; /* Puede no cubrir bien caracteres CJK (chino/japonés/coreano) */
}

:lang(ja) {
  font-family: 'Noto Sans JP', sans-serif; /* Fuente específica con buen soporte de caracteres japoneses */
}
```

Una fuente diseñada para alfabeto latino frecuentemente no incluye (o renderiza mal) caracteres de otros sistemas de escritura — proyectos verdaderamente multi-idioma necesitan verificar el soporte de caracteres de cada fuente para cada idioma objetivo.

## 17.7 Selectores de Idioma en la Interfaz

```html
<nav aria-label="Selector de idioma">
  <a href="/es/" hreflang="es" lang="es">Español</a>
  <a href="/en/" hreflang="en" lang="en">English</a>
</nav>
```

Cada enlace de idioma debe usar el nombre del idioma **en ese mismo idioma** (no "Inglés" para el enlace que lleva a la versión en inglés, sino "English") — una convención estándar que ayuda a cualquier usuario a reconocer su idioma incluso sin entender el idioma actual de la página.

## 17.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Declarar el idioma correcto de cada página/fragmento | `lang` en `<html>` y en elementos específicos |
| Layouts que no se rompan con texto más largo | Anchos flexibles (`fit-content`, `min-width`) en lugar de fijos |
| Soporte para idiomas de derecha a izquierda | `dir="rtl"` + propiedades lógicas CSS |
| Formatos de fecha/número/moneda correctos por región | La API nativa `Intl` |
| Buen renderizado tipográfico en distintos sistemas de escritura | Fuentes específicas por idioma con `:lang()` |

## 17.9 Errores Comunes

- **Diseñar y maquetar basándose solo en el idioma más corto disponible**: rompe el layout al traducir a idiomas con palabras/frases más largas.
- **Usar propiedades físicas (`left`/`right`) en un proyecto que necesita soporte RTL**: obliga a duplicar reglas CSS completas para cada dirección, en lugar de que las propiedades lógicas se adapten automáticamente.
- **Formatear fechas/números manualmente con lógica propia en lugar de `Intl`**: reinventa un problema ya resuelto de forma robusta por el navegador, con alto riesgo de errores sutiles por región.
