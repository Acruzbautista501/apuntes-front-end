import { defineConfig } from 'vitepress'

export default defineConfig({
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
        locales: {
          root: {
            translations: {
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
              { text: 'CSS Avanzado y Ecosistema', link:'/css/05-avanzado'}
            ]
          },
          { 
            text: 'Tailwind CSS 4', 
            collapsed: true,
            items: [
              { text: 'Introducción y Fundamentos de Tailwind CSS 4', link:'/tailwind/01-fundamentos'},
              { text: 'Diseño y Maquetación (The Layout Engine)', link: '/tailwind/02-maquetacion'},
              { text: 'Responsive Design, Estados y Modo Oscuro', link:'/tailwind/03-responsive'},
              { text: 'Estilización Visual (Colores, Tipografía y Efectos)', link:'/tailwind/04-estilizacion'},
              { text: 'Personalización y Configuración (Theming)', link:'/tailwind/05-personalizacion'},
              { text: 'Optimización, Componentes y Buenas Prácticas', link:'/tailwind/06-optimizacion'},
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
              // { text: 'Responsive Design, Estados y Modo Oscuro', link:'/tailwind/03-responsive'},
              // { text: 'Estilización Visual (Colores, Tipografía y Efectos)', link:'/tailwind/04-estilizacion'},
              // { text: 'Personalización y Configuración (Theming)', link:'/tailwind/05-personalizacion'},
              // { text: 'Optimización, Componentes y Buenas Prácticas', link:'/tailwind/06-optimizacion'},
            ]
          },
          { text: 'Nuxt (SSR/Static)', link: '/frameworks/nuxt' },
          { text: 'Angular', link: '/frameworks/angular' }
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