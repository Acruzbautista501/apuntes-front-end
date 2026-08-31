# Módulo 18: Análisis y Optimización del Bundle Final

Un build "que funciona" no es lo mismo que un build "optimizado" — este módulo cubre cómo medir exactamente qué compone el bundle final, identificar problemas de tamaño, y las técnicas más efectivas para reducirlo.

## 18.1 El Resumen que Imprime `vite build`

```text
dist/assets/index-a1b2c3d4.js     245.32 kB │ gzip: 78.14 kB
dist/assets/vendor-e5f6g7h8.js     412.87 kB │ gzip: 128.45 kB
dist/assets/index-i9j0k1l2.css       23.11 kB │ gzip:   5.02 kB
```

Cada build de producción imprime automáticamente el tamaño de cada archivo generado, tanto sin comprimir como con compresión gzip estimada — un primer vistazo rápido para detectar chunks sorprendentemente grandes sin necesitar ninguna herramienta adicional.

## 18.2 `rollup-plugin-visualizer`: Análisis Visual del Bundle

```bash
npm install -D rollup-plugin-visualizer
```

```ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({ open: true, gzipSize: true }),
  ],
})
```

Tras `npm run build`, este plugin genera un mapa de árbol (*treemap*) interactivo mostrando visualmente qué módulos ocupan qué proporción del bundle final — la herramienta más directa para identificar de un vistazo qué dependencia específica está inflando el tamaño total de forma desproporcionada.

## 18.3 Advertencia de Chunk Grande

```text
(!) Some chunks are larger than 500 kB after minification.
```

Vite advierte automáticamente cuando un chunk supera un umbral configurable — no es necesariamente un error, pero señala un candidato claro para investigar con el visualizador (18.2) o dividir mediante code splitting (Módulo 16).

```ts
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000, // Ajustar el umbral de advertencia (en KB)
  },
})
```

## 18.4 Identificar Dependencias Duplicadas

```text
En el treemap: "date-fns" aparece DOS VECES, en dos versiones distintas
```

Un problema común en proyectos con muchas dependencias: dos paquetes distintos dependen de versiones diferentes e incompatibles de una misma librería, resultando en que **ambas** versiones terminan incluidas en el bundle final — el visualizador hace este tipo de duplicación evidente de forma inmediata, mientras que revisar manualmente `package.json` casi nunca la revela.

## 18.5 Tree-Shaking: Por Qué a Veces No Funciona como se Espera

```ts
// ❌ Importar TODO el módulo, incluso si solo se usa una función
import _ from 'lodash'
_.debounce(fn, 300)

// ✅ Importar solo lo necesario, permite que tree-shaking elimine el resto
import { debounce } from 'lodash-es'
debounce(fn, 300)
```

Tree-shaking (eliminar código exportado pero nunca usado) depende de que Rollup pueda analizar estáticamente qué se usa realmente — bibliotecas distribuidas en CommonJS, o patrones de import que traen el módulo completo como un objeto (`import _ from 'lodash'`), dificultan o impiden ese análisis; preferir imports nombrados desde versiones ESM de las bibliotecas (`lodash-es` en lugar de `lodash`) cuando estén disponibles.

## 18.6 Reemplazar Dependencias Pesadas por Alternativas Ligeras

```text
moment.js (pesado, sin tree-shaking efectivo)  →  date-fns o dayjs (ligeros, modulares)
lodash completo                                  →  funciones nativas de JS, o lodash-es específico
```

Tras identificar (18.2, 18.4) qué dependencias específicas dominan el tamaño del bundle, a menudo la optimización más efectiva no es ajustar configuración de Vite, sino sustituir la dependencia por una alternativa más ligera con funcionalidad equivalente.

## 18.7 Comprimir con Brotli/Gzip en el Servidor (No en Vite)

```text
Vite genera archivos sin comprimir en dist/ (el tamaño "gzip" del resumen es solo una ESTIMACIÓN)
La compresión REAL ocurre en el servidor web (Nginx, un CDN) al momento de servir cada archivo
```

Es un malentendido común esperar que `dist/` contenga archivos ya comprimidos — Vite genera los archivos finales sin comprimir; la compresión gzip/Brotli real debe configurarse en el servidor o CDN que sirve esos archivos en producción, fuera del alcance de la configuración de Vite.

## 18.8 Medir el Impacto Real: Lighthouse y Web Vitals

```bash
npx lighthouse https://mi-sitio-desplegado.com --view
```

El tamaño del bundle es un indicador útil, pero la métrica que finalmente importa es la experiencia real de carga — herramientas como Lighthouse miden métricas de Core Web Vitals (LCP, FID/INP, CLS) directamente sobre el sitio desplegado, la validación definitiva de si las optimizaciones de bundle tuvieron un impacto perceptible real.

## 18.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ver un resumen rápido de tamaños tras el build | La salida estándar de `vite build` |
| Visualizar qué ocupa cada parte del bundle | `rollup-plugin-visualizer` |
| Detectar dependencias duplicadas en distintas versiones | El treemap del visualizador |
| Permitir que Rollup elimine código no usado | Preferir imports nombrados desde paquetes ESM (`lodash-es`) |
| Medir el impacto real en la experiencia de carga | Lighthouse / Core Web Vitals sobre el sitio desplegado |

## 18.10 Errores Comunes

- **Optimizar el tamaño del bundle sin medir primero con una herramienta de visualización**: ajustar configuración a ciegas rara vez identifica la causa real de un bundle inflado — el treemap casi siempre revela el problema real de forma más directa que la intuición.
- **Esperar que Vite comprima los archivos de `dist/` automáticamente**: la compresión gzip/Brotli ocurre en el servidor que sirve los archivos, no en el proceso de build de Vite (18.7).
- **Importar una biblioteca completa cuando solo se necesita una función específica**: impide que tree-shaking elimine el código no usado, inflando el bundle innecesariamente — preferir imports específicos y nombrados siempre que la biblioteca lo permita.
