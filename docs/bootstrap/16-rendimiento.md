# Módulo 16: Rendimiento y Build para Producción

Un proyecto que usa Bootstrap completo desde el CDN carga CSS y JS que probablemente nunca usa por completo. Este módulo cubre cómo reducir ese peso antes de llevar tu sitio a producción.

## 16.1 El Costo Real del CDN

Cargar `bootstrap.min.css` completo desde el CDN significa descargar el CSS de **todos** los componentes (carrusel, offcanvas, toasts...) aunque tu página solo use botones y un navbar. Para un sitio pequeño esto es aceptable; para una aplicación grande, es peso desperdiciado en cada visita.

## 16.2 Importar Solo lo que Usas (Repaso del Módulo 12)

La optimización más efectiva ocurre en el origen: importar únicamente los parciales de Sass que tu proyecto realmente necesita, en lugar de `bootstrap/scss/bootstrap` completo.

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/root";
@import "bootstrap/scss/reboot";
@import "bootstrap/scss/grid";
@import "bootstrap/scss/buttons";
@import "bootstrap/scss/card";
@import "bootstrap/scss/navbar";
// Sin @import "bootstrap/scss/carousel" — ese CSS no existe en tu bundle final
```

## 16.3 PurgeCSS: Eliminar CSS No Usado Automáticamente

Aunque decidas importar Bootstrap completo (por comodidad, o porque no sabes de antemano qué componentes usarás), una herramienta de **purga** puede analizar tu HTML/JS/Vue finales y eliminar del CSS todas las clases que nunca aparecen en tu código.

```bash
npm install -D @fullhuman/postcss-purgecss
```

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
      safelist: ['show', 'fade', 'collapsing', /^modal/, /^offcanvas/], // Clases que Bootstrap agrega DINÁMICAMENTE por JS
    }),
  ],
};
```

> **El detalle crítico del `safelist`:** PurgeCSS solo detecta clases que aparecen como **texto literal** en tu HTML/JS. Clases como `.show`, `.fade` o `.collapsing`, que el JavaScript de Bootstrap **agrega dinámicamente** al abrir un modal o un acordeón, nunca aparecen escritas en tu código fuente — si no las proteges con `safelist`, PurgeCSS las elimina por error y el modal deja de animarse (o de mostrarse) en producción.

## 16.4 Minificación y Compresión

* **Minificación**: Vite y la mayoría de bundlers minifican el CSS/JS automáticamente en `npm run build` — quita espacios, comentarios y acorta nombres internos.
* **Compresión Gzip/Brotli**: Debe configurarse en el **servidor** (Nginx, Vercel, Netlify lo hacen automáticamente), no en el build. Reduce el peso de transferencia de un archivo `.css` de texto entre un 70–80% adicional.

## 16.5 Cargar JavaScript Solo Donde se Usa (*Code Splitting* Manual)

Si tu aplicación es grande y solo una página usa, por ejemplo, el Carrusel, no tiene sentido cargar ese código en todas las demás rutas.

```typescript
// En lugar de importar todo el bundle en main.ts:
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importa solo el componente que esa vista específica necesita:
import { Carousel } from 'bootstrap';

const carruselElemento = document.querySelector('#miCarrusel');
if (carruselElemento) {
  new Carousel(carruselElemento);
}
```

Esto se combina naturalmente con el *code splitting* por ruta que ya hacen Vue Router o React Router: si una página no se visita, su JavaScript (incluyendo el de Bootstrap que solo esa página usa) tampoco se descarga.

## 16.6 Checklist de Producción

| Verificación | Por qué importa |
| :--- | :--- |
| ¿Instalaste Bootstrap vía npm, no CDN? | Habilita Sass parcial y PurgeCSS |
| ¿Importas solo los parciales de Sass que usas? | Menos CSS generado desde el origen |
| ¿Configuraste PurgeCSS con `safelist` para clases dinámicas? | Evita romper animaciones de modales/acordeones |
| ¿Verificaste `npm run build` + `npm run preview` antes de desplegar? | El modo dev no refleja el peso real de producción |
| ¿El servidor de hosting comprime con Gzip/Brotli? | Reduce el peso de transferencia, no solo el peso del archivo |

> **Nota:** no optimices prematuramente. Para un proyecto pequeño o un prototipo, el CDN de Bootstrap sigue siendo la opción más simple y perfectamente válida — estas técnicas importan cuando el proyecto crece y el rendimiento empieza a medirse en producción real.
