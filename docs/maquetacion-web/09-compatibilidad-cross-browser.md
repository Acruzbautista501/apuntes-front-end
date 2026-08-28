# Módulo 9: Compatibilidad Cross-Browser

Los navegadores modernos convergen mucho más que los clientes de correo (contraste directo con la sección de Maquetación Email de este sitio), pero las diferencias siguen existiendo — nuevas características CSS con soporte parcial, versiones antiguas de navegadores todavía en uso, y comportamientos sutilmente distintos entre motores de renderizado. Este módulo cubre cómo detectar y manejar esas diferencias de forma sistemática.

## 9.1 Can I Use — La Herramienta de Referencia

Antes de usar cualquier característica CSS o API de JavaScript relativamente reciente, [caniuse.com](https://caniuse.com) muestra el soporte exacto por navegador y versión — la primera consulta obligatoria antes de adoptar cualquier característica nueva en un proyecto con requisitos de compatibilidad definidos.

```text
Ejemplo de decisión informada:
- Container Queries: soporte amplio en navegadores modernos desde 2023 → seguro para la mayoría de proyectos en 2026
- :has(): soporte amplio desde 2023 → seguro para la mayoría de proyectos
- Verificar siempre la audiencia específica del proyecto (analíticas reales) antes de asumir soporte universal
```

## 9.2 Autoprefixer — Prefijos de Proveedor Automáticos

Ciertas propiedades CSS todavía requieren prefijos de proveedor (`-webkit-`, `-moz-`) en navegadores específicos o versiones más antiguas — escribirlos manualmente es tedioso y propenso a quedar desactualizado.

```css
/* Lo que escribes */
.elemento {
  user-select: none;
  backdrop-filter: blur(10px);
}
```

```css
/* Lo que Autoprefixer genera automáticamente, según tu configuración de navegadores objetivo */
.elemento {
  -webkit-user-select: none;
  user-select: none;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
```

```json
// .browserslistrc o en package.json
{
  "browserslist": [
    "> 0.5%",
    "last 2 versions",
    "not dead"
  ]
}
```

Autoprefixer se integra en el pipeline de PostCSS (Módulo 13) y genera los prefijos automáticamente según el rango de navegadores objetivo definido en `browserslist` — la misma configuración que usan Babel y otras herramientas del ecosistema para saber qué compatibilidad garantizar.

## 9.3 Feature Detection con `@supports`

En lugar de intentar detectar navegadores específicos (frágil, cambia constantemente), CSS moderno permite detectar directamente si una **característica** es soportada, aplicando estilos alternativos si no lo es.

```css
/* Estilo base, funciona en todos los navegadores */
.galeria {
  display: flex;
  flex-wrap: wrap;
}

/* Mejora progresiva: solo se aplica si el navegador soporta CSS Grid con subgrid */
@supports (grid-template-columns: subgrid) {
  .galeria {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
```

Esta técnica (*progressive enhancement*, mejora progresiva) es más robusta que intentar bloquear navegadores específicos — el sitio funciona razonablemente en todos lados, y se ve mejor en los navegadores que soportan las características más nuevas.

## 9.4 Feature Detection en JavaScript

```javascript
if ('IntersectionObserver' in window) {
  // Usar la API moderna
} else {
  // Alternativa de respaldo, o cargar un polyfill
}
```

El mismo principio de `@supports` aplicado a JavaScript: verificar si una API existe antes de usarla, en lugar de asumir soporte universal basado en detección de navegador (`navigator.userAgent`, una técnica frágil y desaconsejada desde hace años).

## 9.5 Normalize/Reset CSS — Consistencia de Base

Cada navegador aplica estilos por defecto ligeramente distintos a elementos HTML (márgenes de `<h1>`, estilos de `<button>`, tamaño de `<ul>`) — un reset o normalize CSS establece una base consistente antes de aplicar los estilos propios del proyecto.

```css
/* Un reset moderno mínimo */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

img, picture, video {
  display: block;
  max-width: 100%;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

## 9.6 Testing en Navegadores Reales

* **BrowserStack/LambdaTest**: servicios que dan acceso a navegadores y dispositivos reales (incluyendo versiones antiguas de Safari, Samsung Internet) sin necesitar tener cada dispositivo físico.
* **DevTools de emulación**: útiles para una primera verificación rápida de responsividad, pero **no** son un sustituto de testing en un navegador/motor real — la emulación no reproduce diferencias reales de renderizado entre motores.
* **Navegadores mínimos recomendados para verificar manualmente**: Chrome/Edge (Chromium), Firefox, Safari (particularmente importante en iOS, donde **todos** los navegadores usan el motor WebKit por política de Apple, sin importar su nombre).

## 9.7 El Caso Especial de Safari/WebKit

Safari suele ser el navegador con el soporte más rezagado de características CSS/JS nuevas, y con más comportamientos idiosincráticos (especialmente en formularios y `position: sticky` dentro de contenedores con overflow) — conviene probarlo explícitamente en cualquier proyecto con audiencia significativa en iOS, en lugar de asumir que "si funciona en Chrome, funciona en todos lados".

## 9.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Verificar soporte de una característica antes de usarla | Can I Use |
| Prefijos de proveedor automáticos según tu rango de navegadores | Autoprefixer + configuración `browserslist` |
| Aplicar una mejora solo donde el navegador la soporte | `@supports (propiedad: valor)` |
| Una base visual consistente entre navegadores | Un reset/normalize CSS |
| Testing en navegadores/dispositivos reales | BrowserStack, o dispositivos físicos disponibles |

## 9.9 Errores Comunes

- **Confiar únicamente en la emulación de dispositivo de las DevTools**: no reproduce diferencias reales de motor de renderizado entre navegadores — siempre complementa con testing en navegadores reales.
- **Usar características CSS muy recientes sin verificar Can I Use ni definir mejora progresiva**: puede romper la experiencia completa en una porción real de la audiencia, en lugar de degradarse elegantemente.
- **Ignorar Safari/iOS asumiendo que el comportamiento de Chrome es universal**: WebKit tiene comportamientos propios suficientemente distintos como para justificar testing explícito, especialmente en formularios y layouts con `position: sticky`.
