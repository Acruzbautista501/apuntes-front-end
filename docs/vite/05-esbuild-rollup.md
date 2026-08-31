# Módulo 5: Módulos ES Nativos, esbuild y Rollup: la Base de Vite

Con los fundamentos prácticos ya cubiertos, este módulo profundiza en las piezas técnicas específicas que hacen posible la arquitectura de Vite: por qué esbuild en desarrollo, por qué Rollup en producción, y qué es exactamente el "pre-bundling" de dependencias.

## 5.1 esbuild: el Motor de Transformación en Desarrollo

```text
esbuild está escrito en Go, compilado a binario nativo
→ 10-100x más rápido que transformadores basados en JavaScript (Babel, TypeScript compiler)
```

Cada vez que el navegador solicita un módulo `.ts`, `.jsx`, o similar durante desarrollo, Vite usa esbuild para transformarlo a JavaScript plano al vuelo — su velocidad (al estar compilado a código nativo, en lugar de interpretado como JavaScript) es la razón fundamental por la que Vite puede permitirse transformar módulos individualmente bajo demanda, sin el costo de rendimiento que eso implicaría con transformadores más lentos.

## 5.2 Pre-Bundling de Dependencias: el Otro Uso de esbuild

```text
node_modules/lodash-es/  → cientos de archivos internos individuales
```

```bash
# Vite detecta esto automáticamente al iniciar, y genera:
node_modules/.vite/deps/lodash-es.js   # Un único archivo pre-empaquetado
```

Las dependencias de `node_modules` presentan un problema distinto al código propio: una biblioteca como `lodash-es` puede estar compuesta de cientos de archivos internos con muchos `import` entre sí — solicitar cada uno individualmente por HTTP (aunque sea en la misma máquina) tiene overhead de red real. Vite usa esbuild para **pre-empaquetar** cada dependencia en un único archivo antes de servirla, una operación que ocurre automáticamente la primera vez que se inicia el servidor (o cuando cambian las dependencias), cacheada en `node_modules/.vite/`.

## 5.3 Por Qué esbuild NO se Usa para el Build de Producción Completo

```text
esbuild: extremadamente rápido, pero con soporte de plugins y tree-shaking menos maduro
Rollup:   más lento, pero con un ecosistema de plugins extenso y probado en producción
```

Aunque esbuild también es capaz de generar bundles completos, Vite elige deliberadamente usar **Rollup** para el build final de producción — Rollup tiene años de madurez en optimizaciones específicas de producción (tree-shaking preciso, code splitting inteligente, un ecosistema de plugins mucho más amplio) que en 2024-2025 aún superan las capacidades equivalentes de esbuild para ese caso de uso específico.

## 5.4 El Resultado: Dos Herramientas, Dos Trabajos

| Fase | Herramienta | Por qué |
| :--- | :--- | :--- |
| Servidor de desarrollo (transformación por módulo) | esbuild | Velocidad extrema, adecuada para transformar constantemente módulos individuales |
| Pre-bundling de dependencias | esbuild | Mismo motivo: rapidez para una tarea que ocurre frecuentemente durante desarrollo |
| Build de producción (bundle final) | Rollup | Madurez en optimización real de bundles: tree-shaking, code splitting, plugins |

## 5.5 Módulos ES Nativos: el Requisito Base

```html
<script type="module" src="/src/main.ts"></script>
```

Todo el modelo de desarrollo de Vite depende de que el navegador soporte `type="module"` de forma nativa — una característica disponible en todos los navegadores modernos desde hace varios años, lo que hace viable la estrategia de servir módulos individuales sin empaquetar durante desarrollo. En producción, sin embargo, el build final sí puede transformarse para soportar navegadores más antiguos si es necesario (retomado con `@vitejs/plugin-legacy` en el Módulo 15).

## 5.6 Ver el Pre-Bundling en Acción

```bash
npm run dev
```

```text
  VITE v5.2.0  ready in 287 ms
  Pre-bundling dependencies:
    vue
    axios
  (this will be run only when your dependencies or config have changed)
```

Este mensaje aparece solo la **primera** vez (o cuando las dependencias cambian) — en ejecuciones posteriores, Vite reutiliza la caché en `node_modules/.vite/` sin repetir el proceso, otra razón por la que los arranques subsecuentes del servidor son incluso más rápidos que el primero.

## 5.7 Forzar la Regeneración de la Caché de Pre-Bundling

```bash
npm run dev -- --force
```

```bash
rm -rf node_modules/.vite   # Alternativa manual: eliminar la caché directamente
```

Útil cuando el pre-bundling parece desactualizado de forma inconsistente (poco común, pero puede ocurrir tras cambios manuales en `node_modules` fuera del flujo normal de instalación de paquetes).

## 5.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Entender por qué el servidor de desarrollo arranca tan rápido | esbuild transforma módulos individualmente, sin empaquetar todo el proyecto |
| Entender por qué las dependencias se pre-procesan al inicio | Pre-bundling con esbuild, para evitar cientos de peticiones HTTP internas |
| Entender por qué el build de producción usa una herramienta distinta | Rollup, por su madurez en tree-shaking y ecosistema de plugins |
| Forzar que se regenere la caché de dependencias | `vite --force` o eliminar `node_modules/.vite` |

## 5.9 Errores Comunes

- **Asumir que Vite usa la misma herramienta para desarrollo y producción**: la distinción esbuild (desarrollo) / Rollup (producción) es central a la arquitectura de Vite (Módulo 1.3) — comportamientos ligeramente distintos entre ambos modos no son necesariamente un bug.
- **Modificar manualmente archivos dentro de `node_modules/.vite/`**: es una caché generada automáticamente — cualquier cambio ahí se pierde en la próxima regeneración; los ajustes reales van en `vite.config.ts`.
- **Reportar como bug una diferencia de comportamiento entre esbuild y Rollup en un plugin de terceros**: algunos plugins de Rollup no tienen equivalente exacto en el pipeline de esbuild usado en desarrollo — vale la pena verificar la documentación específica del plugin antes de asumir un error de Vite.
