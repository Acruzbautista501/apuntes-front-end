# Módulo 8: Manejo de Assets Estáticos

Imágenes, fuentes, íconos y otros archivos estáticos requieren un tratamiento distinto al código JavaScript/CSS — este módulo cubre cómo Vite los procesa cuando se importan desde el código, en contraste con los archivos servidos sin procesar desde `public/` (Módulo 3.4).

## 8.1 Importar un Asset desde el Código

```ts
import logoUrl from './assets/logo.png'

document.querySelector('img').src = logoUrl
```

```vue
<template>
  <img :src="logoUrl" alt="Logo" />
</template>
<script setup>
import logoUrl from '../assets/logo.png'
</script>
```

Importar un archivo de imagen (o cualquier asset no-código) devuelve la **URL final** de ese archivo, no su contenido — en desarrollo, es una ruta al archivo original; en producción, es una ruta al archivo ya procesado y con hash de contenido incluido en el nombre.

## 8.2 Por Qué Importar en Lugar de Escribir la Ruta Directamente

```ts
// ❌ Frágil: depende de que la estructura de carpetas se mantenga idéntica en producción
const logoUrl = '/src/assets/logo.png'

// ✅ Correcto: Vite resuelve la ruta real, la procesa, y la referencia sigue siendo válida
import logoUrl from './assets/logo.png'
```

Importar el asset permite que Vite lo incluya en el grafo de dependencias del build — solo los assets realmente referenciados desde el código terminan en el bundle final, y sus rutas se actualizan automáticamente para reflejar dónde termina viviendo el archivo tras el procesamiento (con su hash de caché incluido).

## 8.3 Hash de Contenido en Nombres de Archivo (Producción)

```text
src/assets/logo.png  →  dist/assets/logo-a1b2c3d4.png
```

En el build de producción, Vite renombra automáticamente cada asset incluyendo un hash derivado de su contenido — esto habilita **caché de navegador agresiva y segura**: el navegador puede cachear `logo-a1b2c3d4.png` indefinidamente, porque cualquier cambio futuro al contenido del archivo generará automáticamente un hash (y por tanto un nombre de archivo) distinto, invalidando la caché antigua sin necesitar ninguna configuración manual.

## 8.4 Assets Pequeños: Inlineado como Base64

```ts
// vite.config.ts
export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // Bytes; por defecto 4KB
  },
})
```

Assets por debajo del límite configurado (4KB por defecto) se convierten automáticamente en una cadena `data:` codificada en Base64, incrustada directamente en el CSS/JS que los referencia — evita una petición HTTP adicional para archivos muy pequeños (íconos simples, por ejemplo), a costa de un bundle ligeramente más grande.

## 8.5 Importar el Contenido Crudo (Raw) de un Archivo

```ts
import contenidoSvg from './icono.svg?raw'
```

El sufijo `?raw` fuerza a Vite a devolver el **contenido textual completo** del archivo como un string, en lugar de una URL — útil para incrustar SVGs directamente en el markup (permitiendo estilizarlos con CSS, algo imposible con una simple referencia `<img src="...">`).

## 8.6 Importar como URL Explícita

```ts
import workerUrl from './mi-worker.js?url'
```

El sufijo `?url` fuerza a que Vite devuelva la URL del archivo, incluso para tipos de archivo (como `.js`) que de otra forma se tratarían como código a procesar — un caso de uso común es instanciar un Web Worker a partir de su URL explícita.

## 8.7 Assets en CSS

```css
.logo {
  background-image: url('./assets/logo.png');
}
```

Las referencias a assets dentro de archivos CSS (`url(...)`) se procesan de la misma forma que las importaciones desde JavaScript: Vite resuelve la ruta, aplica hash de contenido en producción, y reescribe la URL final automáticamente.

## 8.8 La Carpeta `public/` Sigue Siendo Necesaria para Ciertos Casos

```html
<link rel="icon" href="/favicon.svg" />
```

Archivos referenciados por convenciones externas al propio código de la aplicación (un favicon enlazado directamente en `index.html`, un `robots.txt`, un manifiesto PWA con una ruta fija esperada) deben vivir en `public/` (Módulo 3.4) precisamente porque necesitan mantener un nombre y ruta predecibles, sin el hash de contenido que aplicaría un import normal desde `src/`.

## 8.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Referenciar un asset desde el código, con optimización de caché | `import url from './archivo.png'` |
| Obtener el contenido textual completo de un archivo | `import contenido from './archivo.svg?raw'` |
| Forzar que se devuelva la URL, no el contenido procesado | `import url from './archivo.js?url'` |
| Un archivo con una ruta fija y predecible (favicon, robots.txt) | Colocarlo en `public/` |
| Evitar peticiones HTTP para íconos muy pequeños | El inlineado automático por debajo de `assetsInlineLimit` |

## 8.10 Errores Comunes

- **Escribir rutas de assets como strings literales en lugar de importarlos**: rompe el procesamiento de Vite (hash de caché, inclusión en el build) — siempre preferir `import` para assets referenciados desde `src/`.
- **Colocar assets que sí deberían optimizarse dentro de `public/` por costumbre**: pierde el hash de contenido para invalidación de caché y cualquier optimización que Vite aplicaría automáticamente a assets importados.
- **Olvidar que `?raw` y `?url` cambian el tipo de dato devuelto**: sin este sufijo explícito, el comportamiento por defecto (URL procesada) puede no ser el esperado para casos como incrustar SVG editable o referenciar un Web Worker.
