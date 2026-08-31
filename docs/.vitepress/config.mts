import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  lang: 'es-ES',
  title: "Apuntes de Front End",
  description: "Mi base de conocimientos",
  
  // Mejora el SEO y la apariencia en pestañas
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap', rel: 'stylesheet' }]    
  ],

  themeConfig: {
    // 1. Añadimos buscador (Esencial para "profesionalizar")
    search: {
      provider: 'local',
      options: {
        translations: { // Quita la capa de 'locales' y 'root' si solo usas español
          button: {
            buttonText: 'Buscar',
            buttonAriaLabel: 'Buscar documentos'
          },
          modal: {
            noResultsText: 'No se han encontrado resultados',
            resetButtonTitle: 'Borrar criterios de búsqueda',
            footer: {
              selectText: 'para seleccionar',
              navigateText: 'para navegar',
              closeText: 'para cerrar'
            }
          }
        }
      }
    },

    outlineTitle: 'En esta página',
    darkModeSwitchLabel: 'Apariencia',
    lightModeSwitchTitle: 'Cambiar a modo claro',
    darkModeSwitchTitle: 'Cambiar a modo oscuro',
    sidebarMenuLabel: 'Menú',
    returnToTopLabel: 'Volver al principio',
    langMenuLabel: 'Seleccionar idioma',
    
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guías', link: '/guia/intro', activeMatch: '/guia/intro' }
    ],

    sidebar: [
      {
        text: '🚀 Lógica y Lenguaje',
        collapsed: false, // El primero siempre abierto
        items: [
          { 
            text: 'Fundamentos de Programación',
            collapsed: true, // Subsecciones colapsables para limpiar la vista
            items: [
              { text: 'Introducción y Configuración', link: '/fundamentos/01-introduccion' },
              { text: 'Tipado y Estructuras', link: '/fundamentos/02-estructuras' },
              { text: 'Control de Flujo', link: '/fundamentos/03-flujo' },
              { text: 'Funciones en TypeScript', link: '/fundamentos/04-funciones' },
              { text: 'Interfaces y Tipos', link: '/fundamentos/05-interfaces' },
              { text: 'POO Avanzada', link: '/fundamentos/06-poo' },
              { text: 'Asincronismo y API Rest', link: '/fundamentos/07-asincronismo' },
              { text: 'Vite y Despliegue', link: '/fundamentos/08-vite' },
              { text: 'Ejercicios de Práctica', link: '/fundamentos/09-ejercicios-practica' },
            ]
          },          
          { 
            text: 'TypeScript para Frontend',
            collapsed: true,
            items: [
              { text: 'Fundamentos', link: '/typescript/01-fundamentos' },
              { text: 'Tipado Básico', link: '/typescript/02-tipado' },
              { text: 'Objetos e Interfaces', link: '/typescript/03-objetos' },
              { text: 'Funciones en el FE', link: '/typescript/04-funciones' },
              { text: 'Control de Flujo', link: '/typescript/05-control' },
              { text: 'Genéricos', link: '/typescript/06-genericos' },
              { text: 'APIs y el DOM', link: '/typescript/07-apis' },
              { text: 'Frameworks Modernos', link: '/typescript/08-frameworks' },
              { text: 'Ejercicios de Práctica', link: '/typescript/09-ejercicios-practica' },
            ]
          },
        ]
      },
      {
        text: '🎨 Diseño y Maquetación',
        collapsed: true,
        items: [
          {
            text: 'CSS3',
            collapsed: true,
            items: [
              { text: '¿Qué es CSS?', link: '/css/01-introduccion' },
              { text: 'Layout y Posicionamiento', link: '/css/02-layout' },
              { text: 'Diseño Adaptativo y Fluidez Moderna', link: '/css/03-responsive' },
              { text: 'Animaciones y Experiencia de Usuario (UX)', link: '/css/04-animaciones' },
              { text: 'CSS Avanzado y Ecosistema', link:'/css/05-avanzado'},
              { text: 'Color y Gradientes', link:'/css/06-color'},
              { text: 'Tipografía Web', link:'/css/07-tipografia'},
              { text: 'Selectores y Pseudo-clases Avanzadas', link:'/css/08-selectores-avanzados'},
              { text: 'Flexbox a Fondo', link:'/css/09-flexbox'},
              { text: 'CSS Grid a Fondo', link:'/css/10-grid'},
              { text: 'Backgrounds, Bordes y Sombras', link:'/css/11-backgrounds-bordes-sombras'},
              { text: 'CSS Moderno: Nesting, @layer y @supports', link:'/css/12-css-moderno'},
              { text: 'Formularios y Estados Interactivos', link:'/css/13-formularios'},
              { text: 'Container Queries', link:'/css/14-container-queries'},
              { text: 'Scroll Moderno', link:'/css/15-scroll-moderno'},
              { text: 'Layouts Avanzados', link:'/css/16-layouts-avanzados'},
              { text: 'Accesibilidad en CSS', link:'/css/17-accesibilidad'},
              { text: 'Novedades de CSS (2024+)', link:'/css/18-novedades-2024'},
              { text: 'Ejercicios de Práctica', link:'/css/19-ejercicios-practica'},
              { text: 'Proyecto Integrador', link:'/css/20-proyecto-integrador'},
            ]
          },
          {
            text: 'Bootstrap 5',
            collapsed: true,
            items: [
              { text: 'Fundamentos e Instalación', link:'/bootstrap/01-fundamentos'},
              { text: 'El Sistema de Grid y Layout', link: '/bootstrap/02-grid'},
              { text: 'Componentes Esenciales de Interfaz', link:'/bootstrap/03-componentes'},
              { text: 'Utilidades (Espaciado, Bordes y Visibilidad)', link:'/bootstrap/04-utilidades'},
              { text: 'Interactividad y Componentes Avanzados', link:'/bootstrap/05-interactividad'},
              { text: 'Formularios Completos', link:'/bootstrap/06-formularios'},
              { text: 'Grid Avanzado', link:'/bootstrap/07-grid-avanzado'},
              { text: 'Componentes Adicionales', link:'/bootstrap/08-componentes-adicionales'},
              { text: 'Offcanvas y Toasts', link:'/bootstrap/09-offcanvas-toasts'},
              { text: 'API de JavaScript Programática', link:'/bootstrap/10-api-javascript'},
              { text: 'Accesibilidad en Bootstrap', link:'/bootstrap/11-accesibilidad'},
              { text: 'Personalización con Sass', link:'/bootstrap/12-personalizacion-sass'},
              { text: 'CSS Variables y Modo Oscuro', link:'/bootstrap/13-css-variables-dark-mode'},
              { text: 'Utility API', link:'/bootstrap/14-utility-api'},
              { text: 'Integración con Vue y React', link:'/bootstrap/15-integracion-frameworks'},
              { text: 'Rendimiento y Build para Producción', link:'/bootstrap/16-rendimiento'},
              { text: 'Ejercicios de Práctica', link:'/bootstrap/17-ejercicios-practica'},
              { text: 'Proyecto Integrador', link:'/bootstrap/18-proyecto-integrador'},
            ]
          },
          { 
            text: 'Tailwind CSS 4', 
            collapsed: true,
            items: [
              { text: 'Fundamentos de Tailwind CSS 4', link:'/tailwind/01-fundamentos'},
              { text: 'Instalación y Entorno ', link: '/tailwind/02-instalacion'},
              { text: 'Sintaxis Base de Tailwind', link:'/tailwind/03-sintaxis'},
              { text: 'Layout y Posicionamiento', link:'/tailwind/04-layout'},
              { text: 'Flexbox con Tailwind CSS', link:'/tailwind/05-flexbox'},
              { text: 'Grid con Tailwind CSS', link:'/tailwind/06-grid'},
              { text: 'Responsive Design con Tailwind', link:'/tailwind/07-responsive'},
              { text: 'Container Queries (Novedad v4)', link:'/tailwind/15-container-queries'},
              { text: 'Estados y Variantes con Tailwind', link:'/tailwind/08-estados'},
              { text: 'Borders, Radius y Shadows con Tailwind', link:'/tailwind/09-borders'},
              { text: 'Backgrounds y Efectos con Tailwind', link:'/tailwind/10-backgrounds'},
              { text: 'Animaciones y Transiciones con Tailwind', link:'/tailwind/11-animaciones'},
              { text: 'CSS Moderno: 3D, Subgrid y Gradientes (v4)', link:'/tailwind/16-css-moderno'},
              { text: 'Personalización de Tailwind', link:'/tailwind/12-personalizacion'},
              { text: 'Utilidades y Variantes Personalizadas (@utility)', link:'/tailwind/17-utility-api'},
              { text: 'Componentización Profesional con Tailwind', link:'/tailwind/13-componentizacion'},
              { text: 'Buenas Prácticas con Tailwind', link:'/tailwind/14-practicas'},
              { text: 'Migración v3→v4 e Integración con Frameworks', link:'/tailwind/18-migracion-arquitectura'},
              { text: 'Sistemas de Diseño, Rendimiento y Accesibilidad', link:'/tailwind/19-diseno-rendimiento-a11y'},
              { text: 'Ejercicios de Práctica', link:'/tailwind/20-ejercicios-practica'},
              { text: 'Proyecto Integrador', link:'/tailwind/21-proyecto-integrador'},
            ]
          },
          {
            text: 'Maquetación Web',
            collapsed: true,
            items: [
              { text: 'Introducción a la Maquetación Web Profesional', link:'/maquetacion-web/01-introduccion'},
              { text: 'HTML Semántico a Fondo', link:'/maquetacion-web/02-html-semantico'},
              { text: 'El Modelo de Caja Aplicado a Layouts Reales', link:'/maquetacion-web/03-modelo-caja'},
              { text: 'Formularios Accesibles y Validación Nativa HTML5', link:'/maquetacion-web/04-formularios-accesibles'},
              { text: 'Metodologías CSS: BEM, OOCSS e ITCSS', link:'/maquetacion-web/05-metodologias-css'},
              { text: 'Imágenes Responsivas', link:'/maquetacion-web/06-imagenes-responsivas'},
              { text: 'Meta Tags Esenciales', link:'/maquetacion-web/07-meta-tags'},
              { text: 'De Figma/XD al Código', link:'/maquetacion-web/08-de-figma-al-codigo'},
              { text: 'Compatibilidad Cross-Browser', link:'/maquetacion-web/09-compatibilidad-cross-browser'},
              { text: 'Rendimiento Web (Core Web Vitals)', link:'/maquetacion-web/10-rendimiento-web'},
              { text: 'Accesibilidad Web a Fondo (WCAG y ARIA)', link:'/maquetacion-web/11-accesibilidad-web'},
              { text: 'SEO Técnico para Maquetadores', link:'/maquetacion-web/12-seo-tecnico'},
              { text: 'Preprocesadores y Build Tools', link:'/maquetacion-web/13-preprocesadores-build'},
              { text: 'Control de Versiones para Maquetadores', link:'/maquetacion-web/14-control-versiones'},
              { text: 'Sistemas de Diseño y Librerías de Componentes', link:'/maquetacion-web/15-sistemas-diseno'},
              { text: 'Testing Visual y de Regresión', link:'/maquetacion-web/16-testing-visual'},
              { text: 'Internacionalización (i18n) en Maquetación', link:'/maquetacion-web/17-internacionalizacion'},
              { text: 'Fundamentos de Maquetación para PWA', link:'/maquetacion-web/18-fundamentos-pwa'},
              { text: 'Documentación y Handoff a Desarrollo', link:'/maquetacion-web/19-documentacion-handoff'},
              { text: 'Ejercicios de Práctica', link:'/maquetacion-web/20-ejercicios-practica'},
              { text: 'Proyecto Integrador', link:'/maquetacion-web/21-proyecto-integrador'},
            ]
          },
          {
            text: 'Maquetación Email',
            collapsed: true,
            items: [
              { text: 'Introducción a la Maquetación de Email', link:'/email/01-introduccion'},
              { text: 'Estructura Base de un Email HTML', link:'/email/02-estructura-base'},
              { text: 'CSS en Email: Qué Funciona y Qué No', link:'/email/03-css-inline'},
              { text: 'Tipografía y Web-Safe Fonts en Email', link:'/email/04-tipografia'},
              { text: 'Layouts con Tablas', link:'/email/05-layouts-tablas'},
              { text: 'Imágenes en Email', link:'/email/06-imagenes'},
              { text: 'Botones a Prueba de Balas (Bulletproof Buttons)', link:'/email/07-botones-bulletproof'},
              { text: 'Responsive Email con Media Queries', link:'/email/08-responsive'},
              { text: 'Comentarios Condicionales de Outlook (MSO)', link:'/email/09-comentarios-condicionales'},
              { text: 'Modo Oscuro en Email', link:'/email/10-modo-oscuro'},
              { text: 'MJML', link:'/email/11-mjml'},
              { text: 'Foundation for Emails', link:'/email/12-foundation-emails'},
              { text: 'Accesibilidad en Email', link:'/email/13-accesibilidad'},
              { text: 'Testing Cross-Client', link:'/email/14-testing-cross-client'},
              { text: 'Personalización y Contenido Dinámico', link:'/email/15-personalizacion'},
              { text: 'Automatización del Build de Emails', link:'/email/16-automatizacion-build'},
              { text: 'Integración con ESPs', link:'/email/17-integracion-esps'},
              { text: 'Deliverability Básica para Maquetadores', link:'/email/18-deliverability'},
              { text: 'Checklist de QA y Buenas Prácticas', link:'/email/19-checklist-buenas-practicas'},
              { text: 'Ejercicios de Práctica', link:'/email/20-ejercicios-practica'},
              { text: 'Proyecto Integrador', link:'/email/21-proyecto-integrador'},
            ]
          },
        ]
      },
      {
        text: '⚡ Frameworks y Ecosistema',
        collapsed: true,
        items: [
          { 
            text: 'Vue.js 3 con Typescript', 
            collapsed: true,
            items: [
              { text: 'Introducción a Vue.js 3', link:'/vue/01-introduccion'},
              { text: 'Fundamentos del Composition API', link: '/vue/02-composition-api'},
              { text: 'Props, Emits y v-model Personalizado', link:'/vue/03-props-emits'},
              { text: 'Slots', link:'/vue/04-slots'},
              { text: 'Template Refs y Acceso al DOM', link:'/vue/05-template-refs'},
              { text: 'Composables: Lógica Reutilizable', link:'/vue/06-composables'},
              { text: 'Provide/Inject', link:'/vue/07-provide-inject'},
              { text: 'Formularios y Modificadores de v-model', link:'/vue/08-formularios'},
              { text: 'Componentes Dinámicos, KeepAlive y Teleport', link:'/vue/09-componentes-dinamicos'},
              { text: 'Vue Router', link:'/vue/10-vue-router'},
              { text: 'Transiciones y Animaciones', link:'/vue/11-transiciones'},
              { text: 'Pinia: Gestión de Estado Global', link:'/vue/12-pinia'},
              { text: 'Consumo de APIs con Composables', link:'/vue/13-consumo-apis'},
              { text: 'TypeScript Avanzado en Vue', link:'/vue/14-typescript-avanzado'},
              { text: 'Suspense y Componentes Asíncronos', link:'/vue/15-suspense'},
              { text: 'Directivas Personalizadas', link:'/vue/16-directivas-personalizadas'},
              { text: 'Testing con Vitest y Vue Test Utils', link:'/vue/17-testing'},
              { text: 'Rendimiento y Optimización', link:'/vue/18-rendimiento'},
              { text: 'Arquitectura de Proyectos Grandes', link:'/vue/19-arquitectura'},
              { text: 'Plugins y Configuración Global', link:'/vue/20-plugins'},
              { text: 'Accesibilidad en Aplicaciones Vue', link:'/vue/21-accesibilidad'},
              { text: 'Ejercicios de Práctica', link:'/vue/22-ejercicios-practica'},
              { text: 'Proyecto Integrador', link:'/vue/23-proyecto-integrador'},
            ]
          },
          {
            text: 'React 18 con Typescript',
            collapsed: true,
            items: [
              { text: 'Introducción a React y Setup', link:'/react/01-introduccion'},
              { text: 'JSX, Renderizado y Componentes', link:'/react/02-jsx-componentes'},
              { text: 'Props y Tipado con TypeScript', link:'/react/03-props-typescript'},
              { text: 'Estado con useState', link:'/react/04-usestate'},
              { text: 'Eventos y Formularios Controlados', link:'/react/05-eventos-formularios'},
              { text: 'Renderizado Condicional y Listas', link:'/react/06-listas-condicional'},
              { text: 'useEffect y Ciclo de Vida', link:'/react/07-useeffect'},
              { text: 'useRef y Manipulación del DOM', link:'/react/08-useref'},
              { text: 'Context API', link:'/react/09-context-api'},
              { text: 'Custom Hooks', link:'/react/10-custom-hooks'},
              { text: 'Consumo de APIs con Hooks', link:'/react/11-consumo-apis'},
              { text: 'useReducer y Estado Complejo', link:'/react/12-usereducer'},
              { text: 'useMemo, useCallback y React.memo', link:'/react/13-rendimiento-memo'},
              { text: 'React Router', link:'/react/14-react-router'},
              { text: 'Gestión de Estado Global (Zustand/Redux)', link:'/react/15-estado-global'},
              { text: 'TypeScript Avanzado en React', link:'/react/16-typescript-avanzado'},
              { text: 'Patrones de Composición', link:'/react/17-patrones-composicion'},
              { text: 'Code Splitting y Suspense', link:'/react/18-code-splitting-suspense'},
              { text: 'TanStack Query (Server State)', link:'/react/19-tanstack-query'},
              { text: 'React Hook Form + Zod', link:'/react/20-react-hook-form'},
              { text: 'Testing con Vitest y RTL', link:'/react/21-testing'},
              { text: 'Accesibilidad en React', link:'/react/22-accesibilidad'},
              { text: 'Introducción a Next.js', link:'/react/23-nextjs'},
              { text: 'Arquitectura de Proyectos', link:'/react/24-arquitectura-proyectos'},
              { text: 'Ejercicios de Práctica', link:'/react/25-ejercicios-practica'},
              { text: 'Proyecto Integrador', link:'/react/26-proyecto-integrador'},
            ]
          },
          // { text: 'Nuxt (SSR/Static)', link: '/frameworks/nuxt' },
          // { text: 'Angular', link: '/frameworks/angular' }
        ]
      },
      {
        text: '🔧 Backend y Bases de Datos',
        collapsed: true,
        items: [
          {
            text: 'Node.js + TypeScript + Express + MongoDB',
            collapsed: true,
            items: [
              { text: 'Introducción a Node.js y su Ecosistema', link:'/node/01-introduccion'},
              { text: 'Configuración de un Proyecto Node.js con TypeScript', link:'/node/02-configuracion-proyecto'},
              { text: 'Módulos, el Sistema de Archivos y Streams', link:'/node/03-modulos-fs-streams'},
              { text: 'El Event Loop y Asincronismo a Fondo', link:'/node/04-event-loop-asincronismo'},
              { text: 'NPM y Gestión de Dependencias', link:'/node/05-npm-dependencias'},
              { text: 'Introducción a Express con TypeScript', link:'/node/06-express-introduccion'},
              { text: 'Rutas, Middlewares y Controladores', link:'/node/07-rutas-middlewares'},
              { text: 'Validación de Datos con Zod', link:'/node/08-validacion-zod'},
              { text: 'Manejo de Errores Centralizado', link:'/node/09-manejo-errores'},
              { text: 'Arquitectura en Capas de una API REST', link:'/node/10-arquitectura-capas'},
              { text: 'Autenticación y Autorización', link:'/node/11-autenticacion'},
              { text: 'Documentación de API con OpenAPI/Swagger', link:'/node/12-documentacion-api'},
              { text: 'Fundamentos de MongoDB y Modelado de Documentos', link:'/node/13-mongodb-fundamentos'},
              { text: 'Mongoose con TypeScript', link:'/node/14-mongoose'},
              { text: 'Consultas Avanzadas y el Pipeline de Agregación', link:'/node/15-agregaciones'},
              { text: 'Relaciones, Transacciones e Índices en MongoDB', link:'/node/16-relaciones-transacciones'},
              { text: 'Testing de APIs (Vitest + Supertest)', link:'/node/17-testing-apis'},
              { text: 'WebSockets con Socket.io', link:'/node/18-websockets'},
              { text: 'Colas de Trabajo con BullMQ + Redis', link:'/node/19-colas-trabajo'},
              { text: 'Caché con Redis', link:'/node/20-cache-redis'},
              { text: 'Seguridad en APIs', link:'/node/21-seguridad-apis'},
              { text: 'Docker para Aplicaciones Node.js', link:'/node/22-docker'},
              { text: 'CI/CD y Despliegue en Producción', link:'/node/23-cicd-despliegue'},
              { text: 'Logging, Monitoreo y Observabilidad', link:'/node/24-logging-monitoreo'},
              { text: 'Ejercicios de Práctica', link:'/node/25-ejercicios-practica'},
              { text: 'Proyecto Integrador', link:'/node/26-proyecto-integrador'},
            ]
          },
          {
            text: 'PHP Puro para APIs',
            collapsed: true,
            items: [
              { text: 'Introducción a PHP y Configuración del Entorno', link:'/php/01-introduccion'},
              { text: 'Sintaxis Básica, Variables y Tipos de Datos', link:'/php/02-sintaxis-variables'},
              { text: 'Estructuras de Control y Funciones', link:'/php/03-control-funciones'},
              { text: 'Arrays y Manipulación de Datos', link:'/php/04-arrays'},
              { text: 'Programación Orientada a Objetos en PHP', link:'/php/05-poo'},
              { text: 'Manejo de Errores y Excepciones', link:'/php/06-errores-excepciones'},
              { text: 'Composer y Gestión de Dependencias', link:'/php/07-composer'},
              { text: 'Estándares PSR y Buenas Prácticas', link:'/php/08-psr-buenas-practicas'},
              { text: 'Autoloading, Namespaces y Estructura de Proyectos', link:'/php/09-autoloading-namespaces'},
              { text: 'Superglobales, HTTP y Petición-Respuesta', link:'/php/10-superglobales-http'},
              { text: 'Enrutamiento y Arquitectura en Capas sin Framework', link:'/php/11-enrutamiento-arquitectura'},
              { text: 'PDO y Bases de Datos Relacionales', link:'/php/12-pdo-bases-datos'},
              { text: 'Construir una API REST Completa con PHP Puro', link:'/php/13-api-rest'},
              { text: 'Validación de Datos y Manejo de Errores Centralizado', link:'/php/14-validacion-errores'},
              { text: 'Autenticación con JWT en PHP Puro', link:'/php/15-jwt-autenticacion'},
              { text: 'Autorización y Control de Acceso', link:'/php/16-autorizacion'},
              { text: 'Una Capa de Acceso a Datos Propia', link:'/php/17-capa-acceso-datos'},
              { text: 'Middleware y el Patrón PSR-15', link:'/php/18-middleware-psr15'},
              { text: 'Seguridad en APIs PHP', link:'/php/19-seguridad'},
              { text: 'Testing con PHPUnit', link:'/php/20-testing-phpunit'},
              { text: 'Documentación de API con OpenAPI/Swagger', link:'/php/21-openapi-docs'},
              { text: 'Caché con Redis en PHP', link:'/php/22-cache-redis'},
              { text: 'Colas de Trabajo en PHP', link:'/php/23-colas-trabajo'},
              { text: 'Docker para Aplicaciones PHP', link:'/php/24-docker'},
              { text: 'CI/CD y Despliegue en Producción', link:'/php/25-cicd-despliegue'},
              { text: 'Ejercicios de Práctica', link:'/php/26-ejercicios-practica'},
              { text: 'Proyecto Integrador: API REST Completa en PHP Puro', link:'/php/27-proyecto-integrador'},
            ]
          },
        ]
      },
      {
        text: '🛠️ Herramientas y Flujo de Trabajo',
        collapsed: true,
        items: [
          {
            text: 'Git',
            collapsed: true,
            items: [
              { text: 'Introducción a Git y Control de Versiones', link:'/git/01-introduccion'},
              { text: 'Instalación y Configuración Inicial', link:'/git/02-instalacion-configuracion'},
              { text: 'El Flujo Básico: init, add, commit', link:'/git/03-flujo-basico'},
              { text: 'Historial y Diferencias (log, diff, show)', link:'/git/04-historial-diferencias'},
              { text: 'Ramas (Branches): Crear, Cambiar, Eliminar', link:'/git/05-ramas'},
              { text: 'Fusionar Ramas (Merge)', link:'/git/06-merge'},
              { text: 'Repositorios Remotos: GitHub/GitLab/Bitbucket', link:'/git/07-repositorios-remotos'},
              { text: 'Clonar, Fetch, Pull y Push', link:'/git/08-clonar-fetch-pull-push'},
              { text: 'Pull Requests / Merge Requests', link:'/git/09-pull-requests'},
              { text: 'Forks y Contribución a Proyectos de Terceros', link:'/git/10-forks-contribucion'},
              { text: 'Deshacer Cambios: checkout, restore, reset y revert', link:'/git/11-deshacer-cambios'},
              { text: 'Stash: Guardar Cambios Temporalmente', link:'/git/12-stash'},
              { text: '.gitignore y Archivos Ignorados', link:'/git/13-gitignore'},
              { text: 'Tags y Versionado Semántico', link:'/git/14-tags-versionado'},
              { text: 'Resolución de Conflictos de Merge', link:'/git/15-resolucion-conflictos'},
              { text: 'Rebase: Reescribir Historial', link:'/git/16-rebase'},
              { text: 'Rebase Interactivo (squash, fixup, reorder)', link:'/git/17-rebase-interactivo'},
              { text: 'Cherry-pick', link:'/git/18-cherry-pick'},
              { text: 'Reflog y Recuperación de Commits Perdidos', link:'/git/19-reflog'},
              { text: 'Git Bisect: Depuración por Bisección', link:'/git/20-bisect'},
              { text: 'Submódulos y Subtrees', link:'/git/21-submodulos-subtrees'},
              { text: 'Estrategias de Branching (Git Flow, GitHub Flow, Trunk-Based)', link:'/git/22-estrategias-branching'},
              { text: 'Conventional Commits y Buenas Prácticas de Mensajes', link:'/git/23-conventional-commits'},
              { text: 'Git Hooks', link:'/git/24-git-hooks'},
              { text: 'Protección de Ramas, CODEOWNERS y Revisión de Código', link:'/git/25-proteccion-ramas-codeowners'},
              { text: 'Cómo Funciona Git Internamente', link:'/git/26-git-interno'},
              { text: 'Rendimiento en Repositorios Grandes', link:'/git/27-rendimiento-repos-grandes'},
              { text: 'Firmas GPG/SSH y Seguridad en Commits', link:'/git/28-firmas-gpg-ssh'},
              { text: 'Proyecto Integrador: Flujo de Trabajo Git Completo en Equipo', link:'/git/29-proyecto-integrador'},
            ]
          },
          {
            text: 'Vite',
            collapsed: true,
            items: [
              { text: 'Introducción a Vite: Qué es y Por Qué Existe', link:'/vite/01-introduccion'},
              { text: 'Instalación y Primer Proyecto', link:'/vite/02-instalacion-primer-proyecto'},
              { text: 'Estructura de un Proyecto Vite', link:'/vite/03-estructura-proyecto'},
              { text: 'El Servidor de Desarrollo y HMR', link:'/vite/04-servidor-desarrollo-hmr'},
              { text: 'Módulos ES Nativos, esbuild y Rollup', link:'/vite/05-esbuild-rollup'},
              { text: 'El Archivo de Configuración vite.config', link:'/vite/06-vite-config'},
              { text: 'Variables de Entorno y Modos (.env)', link:'/vite/07-variables-entorno-modos'},
              { text: 'Manejo de Assets Estáticos', link:'/vite/08-assets-estaticos'},
              { text: 'CSS en Vite: Módulos, Preprocesadores y PostCSS', link:'/vite/09-css-en-vite'},
              { text: 'Resolución de Módulos y Alias de Rutas', link:'/vite/10-resolucion-modulos-alias'},
              { text: 'Vite con TypeScript', link:'/vite/11-vite-typescript'},
              { text: 'Vite con Vue', link:'/vite/12-vite-vue'},
              { text: 'Vite con React', link:'/vite/13-vite-react'},
              { text: 'Vite con Otros Frameworks (Svelte, Solid, Preact)', link:'/vite/14-vite-otros-frameworks'},
              { text: 'El Proceso de Build con Rollup', link:'/vite/15-build-rollup'},
              { text: 'Code Splitting y Carga Diferida', link:'/vite/16-code-splitting-lazy-loading'},
              { text: 'Optimización de Dependencias (Pre-Bundling)', link:'/vite/17-optimizacion-dependencias'},
              { text: 'Análisis y Optimización del Bundle Final', link:'/vite/18-analisis-bundle'},
              { text: 'Aplicaciones Multi-Página (MPA) con Vite', link:'/vite/19-multi-page-apps'},
              { text: 'Modo Librería: Publicar un Paquete con Vite', link:'/vite/20-modo-libreria'},
              { text: 'El Sistema de Plugins de Vite', link:'/vite/21-sistema-plugins'},
              { text: 'Crear un Plugin Propio', link:'/vite/22-crear-plugin-propio'},
              { text: 'Vite en Modo Middleware y su API Programática', link:'/vite/23-modo-middleware-api-programatica'},
              { text: 'Renderizado del Lado del Servidor (SSR) con Vite', link:'/vite/24-ssr'},
              { text: 'Testing con Vitest', link:'/vite/25-testing-vitest'},
              { text: 'Vite en Monorepos', link:'/vite/26-monorepos'},
              { text: 'CI/CD y Despliegue de Proyectos Vite', link:'/vite/27-cicd-despliegue'},
              { text: 'Vite vs Webpack/Otros Bundlers', link:'/vite/28-vite-vs-webpack'},
              { text: 'Proyecto Integrador: Configuración Vite Completa', link:'/vite/29-proyecto-integrador'},
            ]
          },
        ]
      }
    ],

    // Mejoras de UX adicionales
    docFooter: {
      prev: 'Página anterior',
      next: 'Página siguiente'
    },

    lastUpdated: {
      text: 'Actualizado el',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tu-usuario' }
    ],

    footer: {
      message: 'Liberado bajo la licencia MIT.',
      copyright: `Copyright © ${new Date().getFullYear()} - Aldair Cruz Bautista`
    }
  }
})