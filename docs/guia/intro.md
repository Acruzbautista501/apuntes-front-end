# 📚 Mis Guías de Desarrollo Frontend

Bienvenido a mi repositorio personal de conocimientos. Aquí documento conceptos clave, snippets de código y mejores prácticas sobre el stack moderno que utilizo en mis proyectos, con temarios completos que van de cero a nivel avanzado en cada tecnología.

## 🚀 Lógica y Lenguaje

### [Fundamentos de Programación](../fundamentos/01-pensamiento-computacional)
Bases universales de la computación y la algoritmia: pensamiento computacional, arquitectura de hardware y memoria, tipos primitivos, lógica booleana, ciclos, funciones puras, ámbito y closures, mutabilidad vs inmutabilidad, estructuras de datos (arrays, pilas, colas, objetos y colecciones), depuración, introducción al asincronismo y POO.

### [TypeScript para Frontend](../typescript/01-entorno-frontend)
Desarrollo web tipado y defensivo en el navegador: configuración de `tsconfig` para el DOM, manipulación segura de nodos y colecciones, eventos y formularios sin casting inseguro, modelado de estado con uniones discriminadas y verificación exhaustiva (`never`), genéricos aplicados, tipos utilitarios (`Omit`, `Pick`, etc.), Type Guards y predicados (`is`), consumo HTTP con Fetch y Axios, validación en runtime con Zod, Web APIs (`localStorage`, `IntersectionObserver`), integración en Vue 3 y React 18, y archivos de declaración (`.d.ts`).

## 🎨 Diseño y Maquetación

### [CSS3](../css/01-fundamentos-caja)
Desde el modelo de caja, colorimetría moderna (OKLCH, `color-mix()`) y tipografía web hasta Flexbox y CSS Grid con Subgrid a fondo; diseño responsivo mobile-first, Container Queries, funciones matemáticas (`clamp`, `calc`), variables CSS y modo oscuro (`light-dark()`), selectores modernos (`:has()`, `:is()`), formularios accesibles, animaciones aceleradas por GPU, arquitectura modular con `@layer` y Nesting nativo, scroll-driven animations y View Transitions.

### [Bootstrap 5](../bootstrap/01-fundamentos)
Instalación vía npm, el sistema de Grid, catálogo completo de componentes, personalización con Sass (`$theme-colors`, Utility API), variables CSS y modo oscuro nativo, la API de JavaScript programática, integración con Vue/React y optimización para producción.

### [Tailwind CSS 4](../tailwind/01-fundamentos)
Exploración de la nueva versión "CSS-first": `@theme`, Container Queries, `@utility` y variantes personalizadas, CSS moderno (3D, Subgrid, gradientes), theming, componentización profesional y migración v3→v4.

### [Maquetación Web](../maquetacion-web/01-introduccion)
HTML semántico a fondo, el modelo de caja aplicado a layouts reales, formularios accesibles, metodologías CSS (BEM, OOCSS, ITCSS), imágenes responsivas, rendimiento (Core Web Vitals), accesibilidad WCAG/ARIA, SEO técnico y el flujo de trabajo de Figma/XD al código.

### [Maquetación Email](../email/01-introduccion)
Estructura HTML basada en tablas, CSS soportado por clientes de correo, botones a prueba de balas, comentarios condicionales de Outlook (MSO), modo oscuro, MJML y Foundation for Emails, testing cross-client y buenas prácticas de deliverability.

## ⚡ Frameworks y Ecosistema

### [Vue.js 3 con TypeScript](../vue/01-introduccion)
Composition API a fondo (`ref`, `reactive`, `computed`, `watch`), props/emits/slots tipados, composables, Vue Router, Pinia, `Suspense`, directivas personalizadas, testing con Vitest y Vue Test Utils, rendimiento, arquitectura de proyectos grandes y accesibilidad.

### [React 18 con TypeScript](../react/01-introduccion)
JSX y componentes, hooks (`useState`, `useEffect`, `useReducer`, `useMemo`/`useCallback`), Context API, custom hooks, React Router, gestión de estado global (Zustand/Redux), TanStack Query, React Hook Form + Zod, testing con Vitest y RTL, y una introducción a Next.js.

<!-- ### [Nuxt](../frameworks/nuxt)
Renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG) y manejo automático de rutas y módulos.

### [Angular](../frameworks/angular)
Estructura de módulos, servicios, inyección de dependencias y el manejo de RxJS para flujos de datos asíncronos. -->

## 🔧 Backend y Bases de Datos

### [Node.js + TypeScript + Express + MongoDB](../node/01-introduccion)
El Event Loop y asincronismo a fondo, Express con middlewares y validación con Zod, arquitectura en capas de una API REST, autenticación y autorización, Mongoose y agregaciones en MongoDB, testing con Vitest + Supertest, WebSockets, colas con BullMQ, caché con Redis y despliegue con Docker/CI-CD.

### [PHP Puro para APIs](../php/01-introduccion)
POO en PHP, Composer y estándares PSR, PDO y bases de datos relacionales, construcción de una API REST completa sin framework, autenticación JWT, autorización, middleware con PSR-15, seguridad, testing con PHPUnit y despliegue con Docker.

## 🛠️ Herramientas y Flujo de Trabajo

### [Git](../git/01-introduccion)
Desde el flujo básico (`init`, `add`, `commit`) hasta ramas, merge, rebase interactivo, resolución de conflictos, cherry-pick, reflog, bisect, submódulos, estrategias de branching, Git Hooks y firmas GPG/SSH.

### [Vite](../vite/01-introduccion)
El servidor de desarrollo y HMR, módulos ES nativos con esbuild y Rollup, configuración e integración con TypeScript/Vue/React, optimización de dependencias, code splitting, SSR, testing con Vitest, monorepos y despliegue.

::: info OBJETIVO
El fin de estas guías es servir como consulta rápida durante el desarrollo de proyectos reales, manteniendo ejemplos prácticos y actualizados a las últimas versiones de cada tecnología.
:::
