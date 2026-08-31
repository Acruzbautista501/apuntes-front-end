# Módulo 16: Code Splitting y Carga Diferida (Lazy Loading)

Un bundle único y monolítico obliga a descargar toda la aplicación antes de mostrar cualquier cosa — code splitting divide el código en fragmentos (*chunks*) cargados solo cuando se necesitan. Este módulo cubre cómo Vite/Rollup lo automatizan y cómo controlarlo manualmente.

## 16.1 Code Splitting Automático vía Imports Dinámicos

```ts
// En lugar de un import estático (incluido siempre en el bundle inicial):
import GraficoComplejo from './GraficoComplejo'

// Un import dinámico crea un chunk SEPARADO, cargado solo cuando se ejecuta esta línea:
const cargarGrafico = () => import('./GraficoComplejo')
```

Cualquier `import()` dinámico (a diferencia de un `import` estático en la parte superior del archivo) le indica a Rollup que ese módulo, y todas sus dependencias exclusivas, deben separarse en un archivo `.js` independiente — descargado por el navegador solo en el momento en que ese código realmente se ejecuta.

## 16.2 Lazy Loading de Rutas: el Caso de Uso Más Común

```ts
// Vue Router
const routes = [
  { path: '/perfil', component: () => import('./views/Perfil.vue') },
  { path: '/configuracion', component: () => import('./views/Configuracion.vue') },
]
```

```tsx
// React Router, con React.lazy (Módulo 13.6)
const Perfil = lazy(() => import('./views/Perfil'))
```

Dividir el código por ruta es, con diferencia, el patrón de code splitting más impactante en aplicaciones reales: un usuario que solo visita la página de inicio nunca descarga el código de la página de configuración, reduciendo significativamente el tiempo de carga inicial de la aplicación completa.

## 16.3 Chunks Compartidos entre Rutas

```text
dist/assets/
├── index-a1b2c3d4.js         ← código de la aplicación principal
├── vendor-e5f6g7h8.js          ← dependencias compartidas (Vue, librerías comunes)
├── Perfil-i9j0k1l2.js           ← código exclusivo de la ruta /perfil
└── Configuracion-m3n4o5p6.js     ← código exclusivo de la ruta /configuracion
```

Rollup detecta automáticamente cuándo un módulo es usado por **múltiples** puntos de entrada dinámicos, y lo extrae a un chunk compartido en lugar de duplicarlo en cada uno — sin necesitar ninguna configuración manual para este caso común.

## 16.4 `manualChunks`: Control Explícito de Agrupación

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-utils': ['lodash-es', 'date-fns'],
        },
      },
    },
  },
})
```

Por defecto, Rollup decide automáticamente cómo agrupar el código en chunks — `manualChunks` permite forzar una agrupación específica, típicamente para separar dependencias de terceros (que cambian con poca frecuencia) del código propio de la aplicación (que cambia constantemente), mejorando la efectividad de la caché de navegador entre despliegues.

## 16.5 `manualChunks` como Función

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
```

Para lógica de agrupación más dinámica, `manualChunks` acepta una función que recibe el `id` (la ruta) de cada módulo, decidiendo a qué chunk pertenece — este ejemplo agrupa **todas** las dependencias de `node_modules` en un único chunk `vendor`, separado del código propio.

## 16.6 Precarga de Módulos: `<link rel="modulepreload">`

```html
<!-- Generado automáticamente por Vite en el build de producción -->
<link rel="modulepreload" href="/assets/vendor-e5f6g7h8.js" />
```

Vite inserta automáticamente etiquetas de precarga para los módulos que la página inicial necesitará con alta probabilidad — le indica al navegador que descargue esos recursos con prioridad, sin bloquear el renderizado inicial, mejorando el rendimiento percibido sin ninguna configuración manual necesaria.

## 16.7 Cuándo NO Dividir el Código

```text
Una aplicación de una sola pantalla, muy pequeña
→ el overhead de múltiples peticiones HTTP puede superar el beneficio de dividir el bundle
```

Code splitting no es gratuito: cada chunk adicional implica una petición HTTP separada — en aplicaciones muy pequeñas o de una sola pantalla, un único bundle bien optimizado puede ser preferible a fragmentarlo innecesariamente; el beneficio real aparece en aplicaciones con múltiples rutas o secciones claramente independientes entre sí.

## 16.8 Analizar el Resultado del Splitting (Anticipo del Módulo 18)

```bash
npm run build -- --mode analyze
```

Se retoma con herramientas dedicadas de visualización en el Módulo 18 — por ahora, basta con revisar el resumen de tamaños que `vite build` imprime directamente en la terminal al finalizar, que ya lista cada chunk generado con su tamaño correspondiente.

## 16.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Cargar código solo cuando se necesita | `import()` dinámico |
| Dividir el código por ruta de la aplicación | Lazy loading de componentes de ruta (`() => import(...)`) |
| Agrupar dependencias específicas en su propio chunk | `build.rollupOptions.output.manualChunks` |
| Separar TODO `node_modules` del código propio | `manualChunks` como función, verificando `id.includes('node_modules')` |

## 16.10 Errores Comunes

- **Aplicar code splitting agresivo a una aplicación muy pequeña**: puede degradar el rendimiento en lugar de mejorarlo, al multiplicar peticiones HTTP sin un beneficio real de carga diferida (16.7).
- **No dividir código por ruta en una aplicación grande con muchas secciones**: obliga a todos los usuarios a descargar el código de funcionalidades que quizás nunca visiten, inflando innecesariamente el tiempo de carga inicial.
- **Configurar `manualChunks` sin medir el resultado real**: una agrupación manual mal pensada puede producir chunks desbalanceados (uno enorme, otros diminutos) sin ninguna mejora real sobre la agrupación automática de Rollup — siempre verificar con un análisis de bundle (Módulo 18) antes y después del cambio.
