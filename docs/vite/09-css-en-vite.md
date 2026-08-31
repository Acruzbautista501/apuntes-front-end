# Módulo 9: CSS en Vite: Módulos, Preprocesadores y PostCSS

Vite incluye soporte completo para CSS moderno sin ninguna configuración adicional en la mayoría de los casos: CSS Modules, preprocesadores populares y PostCSS funcionan directamente. Este módulo cubre cada uno.

## 9.1 Importar CSS Directamente

```ts
// main.ts
import './style.css'
```

Al importar un archivo `.css` desde JavaScript, Vite lo inyecta automáticamente en el documento (mediante una etiqueta `<style>` durante desarrollo, o un archivo `.css` enlazado en producción) — no requiere ningún loader adicional ni configuración, a diferencia de bundlers tradicionales donde importar CSS desde JS típicamente requería configurar un `css-loader` explícitamente.

## 9.2 CSS Modules: Alcance Local Automático

```css
/* Button.module.css */
.boton {
  background: blue;
  color: white;
}
```

```ts
import estilos from './Button.module.css'

document.querySelector('button').className = estilos.boton
// La clase real generada es algo como "_boton_a1b2c3"
```

Cualquier archivo con el sufijo `.module.css` (también `.module.scss`, etc.) se trata automáticamente como un CSS Module — las clases definidas ahí se renombran a identificadores únicos por archivo, eliminando el riesgo de colisión de nombres de clases entre distintos componentes del proyecto, sin ninguna configuración adicional necesaria.

## 9.3 Preprocesadores: Sass, Less, Stylus

```bash
npm install -D sass
```

```ts
import './style.scss'
```

```scss
$color-primario: #3498db;

.tarjeta {
  border: 1px solid $color-primario;

  &:hover {
    background: lighten($color-primario, 40%);
  }
}
```

Vite detecta la extensión del archivo (`.scss`, `.less`, `.styl`) y usa el preprocesador correspondiente automáticamente — la **única** instalación requerida es la dependencia del preprocesador en sí (`sass`, `less`, `stylus`); no existe ningún paquete adicional de "integración con Vite" que instalar por separado.

## 9.4 Pasar Opciones al Preprocesador

```ts
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables" as *;`,
      },
    },
  },
})
```

`additionalData` inyecta código adicional (típicamente variables o mixins compartidos) al inicio de **cada** archivo `.scss` procesado, automáticamente — evita tener que repetir un `@use`/`@import` de variables compartidas en cada archivo individual del proyecto.

## 9.5 PostCSS: Transformaciones Adicionales

```js
// postcss.config.js
export default {
  plugins: {
    autoprefixer: {},
    'postcss-nested': {},
  },
}
```

Vite integra PostCSS automáticamente si detecta un archivo de configuración (`postcss.config.js` u otros formatos soportados) en la raíz del proyecto — sin necesitar habilitarlo explícitamente en `vite.config.ts`. Autoprefixer (agregar prefijos de proveedor automáticamente) es el caso de uso más común.

## 9.6 Tailwind CSS con Vite

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

Desde Tailwind CSS 4, la integración oficial es un **plugin de Vite** (no PostCSS, como en versiones anteriores) — la forma recomendada actual de usar Tailwind en un proyecto Vite, cubierta en profundidad en la sección de Tailwind CSS de este sitio.

## 9.7 CSS Global vs Scoped por Framework

```vue
<style scoped>
.tarjeta { border: 1px solid gray; } /* Solo aplica a ESTE componente */
</style>
```

Frameworks como Vue tienen su propio mecanismo de encapsulamiento de estilos (`<style scoped>`), gestionado por el plugin de framework correspondiente (`@vitejs/plugin-vue`) — distinto pero complementario a los CSS Modules genéricos cubiertos en 9.2, que funcionan igual sin importar el framework usado.

## 9.8 Extraer CSS en Producción

```text
dist/
├── assets/
│   ├── index-a1b2c3.css   ← Todo el CSS, extraído a un único archivo
│   └── index-e5f6g7.js
```

En producción, Vite extrae automáticamente todo el CSS importado a archivos `.css` separados, enlazados vía `<link>` en el HTML final — en lugar de inyectarlo dinámicamente vía JavaScript como hace en desarrollo, permitiendo que el navegador cargue los estilos en paralelo antes de ejecutar cualquier JavaScript.

## 9.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Alcance local automático de clases CSS | Sufijo `.module.css` (o `.module.scss`, etc.) |
| Usar Sass/Less/Stylus | Instalar el paquete del preprocesador; ninguna configuración adicional |
| Inyectar variables compartidas en cada archivo Sass | `css.preprocessorOptions.scss.additionalData` |
| Agregar prefijos de proveedor automáticamente | Autoprefixer vía `postcss.config.js` |
| Usar Tailwind CSS 4 | El plugin oficial `@tailwindcss/vite` |

## 9.10 Errores Comunes

- **Instalar un paquete de "integración Vite + Sass" que no existe**: Vite soporta preprocesadores de forma nativa con solo instalar el preprocesador en sí (`sass`) — no requiere ningún adaptador adicional.
- **Usar `.module.css` esperando estilos globales, o viceversa**: el sufijo `.module.css` activa un comportamiento de alcance local automático que puede sorprender si se esperaba CSS global tradicional — verificar la extensión del archivo antes de depurar "clases que no aplican".
- **Configurar Tailwind CSS 4 con el enfoque de PostCSS de versiones anteriores**: la integración recomendada actual es el plugin de Vite dedicado (9.6), con configuración distinta a las guías más antiguas basadas puramente en PostCSS.
