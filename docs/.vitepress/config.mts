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
              { text: 'Proyecto Integrador', link:'/css/19-proyecto-integrador'},
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
              { text: 'Proyecto Integrador', link:'/bootstrap/17-proyecto-integrador'},
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
              { text: 'Proyecto Integrador', link:'/tailwind/20-proyecto-integrador'},
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
              { text: 'Proyecto Integrador', link:'/vue/22-proyecto-integrador'},
            ]
          },
          // { text: 'Nuxt (SSR/Static)', link: '/frameworks/nuxt' },
          // { text: 'Angular', link: '/frameworks/angular' }
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