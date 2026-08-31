# Módulo 1: Introducción a Vite: Qué es y Por Qué Existe

Vite (del francés "rápido", pronunciado "vit") es una herramienta de build y servidor de desarrollo creada por Evan You, el mismo autor de Vue — hoy es una herramienta agnóstica de framework, usada tanto en proyectos Vue como React, Svelte y muchos otros. Este módulo cubre qué problema resuelve y por qué se volvió el estándar de facto para nuevos proyectos frontend.

## 1.1 El Problema de los Bundlers Tradicionales

```text
Con un bundler tradicional (Webpack, Parcel):
Iniciar el servidor → Empaquetar TODO el proyecto → Servir la app
                        (lento, crece con el proyecto)
```

Antes de Vite, iniciar un servidor de desarrollo requería que el bundler procesara y empaquetara **todo** el código fuente del proyecto por adelantado, incluso el código de módulos que quizás nunca se visitan en esa sesión de desarrollo — en proyectos grandes, esto podía tomar decenas de segundos, o incluso minutos, solo para ver la primera pantalla.

## 1.2 La Idea Central de Vite: Servir Módulos ES Nativos

```text
Con Vite:
Iniciar el servidor → Servir código bajo demanda usando ESM nativo del navegador
                        (casi instantáneo, sin importar el tamaño del proyecto)
```

Los navegadores modernos soportan módulos ES (`import`/`export`) de forma nativa — Vite aprovecha esto sirviendo cada archivo como un módulo independiente **bajo demanda**: solo se procesa y transforma el código que el navegador realmente solicita al navegar, no el proyecto completo por adelantado. El tiempo de arranque del servidor de desarrollo se vuelve prácticamente constante, sin importar si el proyecto tiene 10 o 10,000 módulos.

## 1.3 Dos Modos de Operación Distintos

| | Desarrollo | Producción |
| :--- | :--- | :--- |
| Herramienta subyacente | Servidor propio de Vite + esbuild | Rollup |
| Estrategia | Servir módulos ES nativos bajo demanda, sin empaquetar | Empaquetar y optimizar todo el código para distribución |
| Objetivo | Arranque instantáneo, HMR ultrarrápido | Bundle pequeño, optimizado, compatible con navegadores antiguos |

Esta es la distinción arquitectónica más importante de Vite, retomada en profundidad en los Módulos 4 y 15: usa una estrategia completamente distinta en desarrollo (sin empaquetar, servir ESM nativo) que en producción (empaquetar con Rollup) — cada una optimizada para su objetivo específico, en lugar de forzar una única estrategia para ambos casos como hacían los bundlers tradicionales.

## 1.4 Vite no es Solo para Vue

```bash
npm create vite@latest -- --template vue
npm create vite@latest -- --template react
npm create vite@latest -- --template svelte
npm create vite@latest -- --template vanilla
```

Pese a su origen y nombre asociado a Vue, Vite es completamente agnóstico de framework — funciona igual de bien con React, Svelte, Solid, o incluso proyectos sin ningún framework ("vanilla"). Se retoma con ejemplos concretos por framework en los Módulos 11 a 14.

## 1.5 esbuild y Rollup: las Dos Piezas que Vite Combina

Vite no reinventa el procesamiento de JavaScript desde cero — combina dos herramientas ya existentes y especializadas: **esbuild** (escrito en Go, extremadamente rápido) para transformaciones durante desarrollo y para pre-empaquetar dependencias, y **Rollup** (maduro, con un ecosistema de plugins extenso) para el build final de producción. Se explica en detalle por qué se usa cada uno en su contexto específico en el Módulo 5.

## 1.6 Vite vs Create React App / Vue CLI: el Cambio de Generación

```text
Generación anterior (Webpack-based):
create-react-app, Vue CLI → configuración pesada, arranque lento

Generación actual (Vite-based):
npm create vite → configuración mínima, arranque casi instantáneo
```

Herramientas como Create React App (ahora en desuso oficial) y Vue CLI (en modo de mantenimiento) fueron el estándar durante años, construidas sobre Webpack — Vite las reemplazó como recomendación oficial de ambos ecosistemas, principalmente por la diferencia radical en velocidad de desarrollo y simplicidad de configuración.

## 1.7 Tabla de Referencia Rápida

| Concepto | Qué es |
| :--- | :--- |
| Vite | Servidor de desarrollo + herramienta de build para proyectos frontend |
| ESM nativo | Módulos ES servidos directamente al navegador en desarrollo, sin empaquetar |
| esbuild | Motor ultrarrápido (Go) usado en desarrollo y pre-bundling de dependencias |
| Rollup | Empaquetador usado para generar el build final de producción |
| HMR | Hot Module Replacement: actualizar módulos en el navegador sin recargar la página (Módulo 4) |

## 1.8 Errores Comunes (Conceptuales)

- **Asumir que Vite es exclusivo de Vue**: es una herramienta agnóstica de framework, con soporte oficial de primera clase para React, Svelte, Solid y otros — el nombre y origen compartido con Vue no implica ninguna dependencia técnica entre ambos.
- **Esperar que el comportamiento de desarrollo sea idéntico al de producción**: Vite usa estrategias fundamentalmente distintas en cada modo (1.3) — un bug que solo aparece en el build de producción, o viceversa, no es necesariamente indicio de una configuración incorrecta.
- **Confundir Vite con un framework**: Vite es una herramienta de build y servidor de desarrollo — no dicta cómo estructurar componentes, manejar estado, ni enrutar; esas decisiones siguen correspondiendo al framework elegido (Vue, React, etc.) sobre el que se usa Vite.
