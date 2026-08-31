# Módulo 28: Vite vs Webpack/Otros Bundlers: Migración y Decisiones de Arquitectura

Con Vite dominado en profundidad, este módulo cierra el círculo comparándolo explícitamente con las alternativas más relevantes, y cubre cómo migrar un proyecto Webpack existente hacia Vite.

## 28.1 Comparación General

| | Webpack | Vite | esbuild/Turbopack (solos) |
| :--- | :--- | :--- | :--- |
| Estrategia en desarrollo | Empaqueta todo por adelantado | Sirve ESM nativo bajo demanda (Módulo 1) | Empaquetado extremadamente rápido, pero no HMR nativo tan pulido |
| Madurez del ecosistema de plugins | Muy alta, más de una década | Alta, creciendo rápidamente, basada en Rollup | Menor, más orientado a integrarse en otras herramientas |
| Velocidad de arranque en desarrollo | Se degrada con el tamaño del proyecto | Prácticamente constante | Muy rápido, pero con menos garantías de compatibilidad universal |
| Curva de configuración | Considerable, mucha configuración manual histórica | Configuración mínima por defecto | Variable según la herramienta específica |

## 28.2 Por Qué Webpack Sigue Siendo Relevante

```text
Proyectos existentes GRANDES ya construidos sobre Webpack:
  migrar tiene un costo real, no siempre justificado
Necesidades muy específicas de plugins de Webpack sin equivalente en Rollup:
  algunos casos de nicho aún carecen de una alternativa madura
```

Webpack no es "peor" en un sentido absoluto — es una herramienta más antigua, con más de una década de plugins acumulados para prácticamente cualquier caso de uso imaginable, y con un modelo de configuración que, aunque más verboso, ofrece un control extremadamente granular. Proyectos legacy grandes con configuraciones de Webpack muy específicas y maduras no siempre justifican el costo de migrar, especialmente si el equipo no está experimentando problemas reales de velocidad de desarrollo.

## 28.3 Señales de que Vale la Pena Migrar

- El equipo pierde tiempo real esperando el arranque del servidor de desarrollo o HMR lento en cada guardado.
- Se está iniciando un proyecto **nuevo** — no hay ninguna razón de peso para elegir Webpack sobre Vite en un proyecto desde cero hoy en día.
- El proyecto usa un framework (Vue, React, Svelte) cuya herramienta oficial recomendada ya es Vite, y la configuración de Webpack actual es esencialmente la configuración estándar sin personalizaciones profundas.

## 28.4 Migrar de Create React App a Vite

```bash
npm create vite@latest mi-proyecto-migrado -- --template react-ts
```

```text
1. Crear un proyecto Vite nuevo (paso anterior)
2. Copiar src/ y public/ del proyecto CRA existente
3. Mover index.html de public/ a la raíz, ajustando su estructura (Módulo 3.2)
4. Reemplazar process.env.REACT_APP_* por import.meta.env.VITE_* (Módulo 7)
5. Ajustar imports de assets si CRA usaba una convención distinta
6. Revisar cualquier configuración específica de CRA (proxy, service workers) y su equivalente en Vite
```

## 28.5 Migrar de Vue CLI a Vite

```bash
npm create vite@latest mi-proyecto-migrado -- --template vue-ts
```

```text
1. Crear un proyecto Vite nuevo con la plantilla Vue
2. Copiar src/ y public/
3. Reemplazar vue.config.js por vite.config.ts (sintaxis distinta, mismos conceptos)
4. Reemplazar process.env.VUE_APP_* por import.meta.env.VITE_*
5. Verificar que cualquier plugin de Webpack específico usado tenga equivalente para Rollup/Vite
```

## 28.6 El Patrón Común de Migración de Variables de Entorno

```text
Webpack (CRA):   process.env.REACT_APP_API_URL
Webpack (Vue CLI): process.env.VUE_APP_API_URL
Vite:               import.meta.env.VITE_API_URL
```

Un cambio consistente en prácticamente cualquier migración: el prefijo de variables de entorno expuestas al cliente cambia, y la forma de acceder a ellas pasa de `process.env` (una emulación específica de cada herramienta) a `import.meta.env` (una API estándar del navegador extendida por Vite, Módulo 7.3).

## 28.7 Compatibilidad de Plugins de Webpack

```text
Un plugin de Webpack NO es compatible directamente con Vite
→ Vite usa la API de plugins de Rollup (Módulo 21.1), un modelo completamente distinto
```

A diferencia de la migración entre distintas herramientas basadas en Rollup (donde muchos plugins son directamente reutilizables), un plugin de Webpack requiere encontrar un equivalente construido específicamente para Rollup/Vite, o escribir uno propio (Módulo 22) — no existe ninguna capa de compatibilidad automática entre ambos sistemas de plugins.

## 28.8 Turbopack: la Alternativa de Next.js

```text
Turbopack: escrito en Rust, desarrollado por Vercel, integrado específicamente en Next.js
```

Turbopack es otra herramienta de build moderna orientada a velocidad, pero su desarrollo está estrechamente ligado al ecosistema de Next.js específicamente — no es una alternativa de propósito general como Vite, que permanece deliberadamente agnóstica de framework (Módulo 1.4).

## 28.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Iniciar un proyecto nuevo hoy | Vite, salvo una razón específica y justificada para otra herramienta |
| Migrar un proyecto Create React App | `npm create vite -- --template react-ts` + ajustes de 28.4 |
| Migrar un proyecto Vue CLI | `npm create vite -- --template vue-ts` + ajustes de 28.5 |
| Encontrar el equivalente de un plugin de Webpack | Buscar en el directorio de plugins de Vite (Módulo 21.8), no asumir compatibilidad directa |

## 28.10 Errores Comunes

- **Migrar un proyecto legacy grande y estable a Vite sin una razón de negocio clara**: el costo de migración (reescribir configuración, verificar cada plugin, testing exhaustivo posterior) debe justificarse con un beneficio real y medible, no solo "porque es más nuevo".
- **Asumir que un plugin de Webpack funcionará directamente en Vite**: son sistemas de plugins fundamentalmente distintos (28.7) — siempre verificar la existencia de un equivalente específico antes de comenzar una migración.
- **Olvidar actualizar el prefijo y la sintaxis de acceso a variables de entorno durante una migración**: `process.env.REACT_APP_*`/`VUE_APP_*` simplemente no existen en un proyecto Vite — deben reemplazarse sistemáticamente por `import.meta.env.VITE_*` en todo el código migrado.
