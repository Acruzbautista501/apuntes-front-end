# Módulo 19: Aplicaciones Multi-Página (MPA) con Vite

Aunque Vite es popular principalmente para SPAs (Single Page Applications), soporta de forma nativa proyectos con múltiples páginas HTML independientes — este módulo cubre cómo configurarlos.

## 19.1 El Caso de Uso: Múltiples Puntos de Entrada HTML

```text
proyecto/
├── index.html          # Página de inicio
├── acerca-de.html        # Página "Acerca de"
├── contacto.html           # Página de contacto
```

A diferencia de una SPA (donde una única `index.html` carga una aplicación que gestiona el enrutamiento internamente vía JavaScript), una aplicación multi-página tiene un archivo `.html` real y separado por cada ruta — cada uno con su propio punto de entrada de JavaScript/CSS, cargado independientemente por el navegador en una navegación tradicional.

## 19.2 Configurar Múltiples Entradas

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        acercaDe: resolve(__dirname, 'acerca-de.html'),
        contacto: resolve(__dirname, 'contacto.html'),
      },
    },
  },
})
```

Sin esta configuración explícita, Vite por defecto solo trata `index.html` en la raíz como punto de entrada — `rollupOptions.input` con un objeto de múltiples rutas le indica explícitamente cada página HTML que debe procesarse de forma independiente durante el build.

## 19.3 Cada Página con su Propio Script

```html
<!-- acerca-de.html -->
<!doctype html>
<html>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/acerca-de.ts"></script>
  </body>
</html>
```

Cada archivo HTML referencia su propio punto de entrada de JavaScript — no existe ningún requisito de compartir el mismo `main.ts` entre páginas, aunque código y componentes comunes (como un header o un footer compartido) sí pueden importarse desde módulos compartidos en ambos.

## 19.4 Estructura de Carpetas Alternativa

```text
proyecto/
├── src/
│   ├── pages/
│   │   ├── inicio/
│   │   │   ├── index.html
│   │   │   └── main.ts
│   │   └── contacto/
│   │       ├── index.html
│   │       └── main.ts
```

Para proyectos con muchas páginas, es común organizar cada una en su propia subcarpeta — el enfoque de configuración (`rollupOptions.input`) sigue siendo el mismo, simplemente apuntando a rutas anidadas en lugar de archivos en la raíz.

## 19.5 Navegación entre Páginas: Enlaces HTML Normales

```html
<a href="/acerca-de.html">Acerca de</a>
```

A diferencia de una SPA (donde la navegación interna evita recargar la página completa, gestionada por un router de JavaScript), en una MPA la navegación entre páginas usa enlaces `<a href="...">` normales — cada clic dispara una **navegación real del navegador**, cargando el HTML correspondiente desde cero.

## 19.6 Cuándo Elegir MPA en Lugar de SPA

| | SPA | MPA |
| :--- | :--- | :--- |
| Navegación entre secciones | Sin recarga, gestionada por JavaScript | Recarga completa de página en cada navegación |
| SEO sin configuración adicional | Requiere SSR/prerendering (Módulo 24) | Cada página es HTML real, indexable directamente |
| Ideal para | Aplicaciones interactivas con estado complejo compartido | Sitios de contenido, landing pages, documentación |

Un sitio de marketing con varias páginas mayormente estáticas (inicio, precios, contacto) suele beneficiarse más del enfoque MPA —cada página se indexa naturalmente sin configuración de SEO adicional— mientras que una aplicación con estado complejo compartido entre secciones (un dashboard, una herramienta interactiva) se beneficia más del modelo SPA tradicional.

## 19.7 Compartir Código entre Páginas

```ts
// src/shared/header.ts — importado desde CADA página independiente
export function renderizarHeader() {
  // ...
}
```

Aunque cada página tiene su propio punto de entrada, nada impide compartir módulos comunes entre ellas mediante imports normales — Rollup detecta automáticamente ese código compartido y lo extrae a un chunk común (el mismo mecanismo cubierto en el Módulo 16.3 para code splitting de rutas en una SPA).

## 19.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Configurar múltiples páginas HTML independientes | `build.rollupOptions.input` con un objeto de rutas |
| Compartir código común entre páginas | Imports normales desde módulos compartidos |
| Navegar entre páginas de una MPA | Enlaces `<a href="...">` estándar del navegador |
| Decidir entre SPA y MPA | Evaluar necesidad de SEO directo vs estado interactivo complejo compartido |

## 19.9 Errores Comunes

- **Olvidar registrar una página nueva en `rollupOptions.input`**: Vite solo procesa explícitamente las entradas configuradas — un archivo `.html` adicional sin registrar no se incluye en el build de producción, aunque funcione en desarrollo al acceder directamente a su ruta.
- **Intentar usar un router de SPA (Vue Router, React Router) en un proyecto MPA**: son modelos de navegación incompatibles — un router de SPA gestiona rutas dentro de una única página cargada, sin sentido en un proyecto donde cada ruta es un archivo HTML real distinto.
- **Elegir MPA por costumbre en un proyecto que realmente necesita el modelo SPA**: si la aplicación requiere estado complejo compartido de forma fluida entre secciones sin recargas, forzar un enfoque MPA complica innecesariamente la gestión de ese estado a través de recargas completas de página.
