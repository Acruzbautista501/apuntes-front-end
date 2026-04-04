import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'es-ES',
  title: "Apuntes de Front End",
  description: "Mi base de conocimientos",
  
  // Mejora el SEO y la apariencia en pestañas
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

  themeConfig: {
    // 1. Añadimos buscador (Esencial para "profesionalizar")
    search: {
      provider: 'local'
    },

    outlineTitle: 'En esta página',
    
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guías', link: '/guia/intro', activeMatch: '/fundamentos/' }
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
              { text: 'Funciones en TypeScript', link: '/fundamentos/04-functions' },
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
            text: 'CSS3 Avanzado', 
            collapsed: true,
            items: [
              { text: 'Flexbox & Grid', link: '/css/layout' },
              { text: 'SASS & Preprocesadores', link: '/css/sass' },
              { text: 'Bootstrap 5', link: '/css/bootstrap' }
            ]
          },
          { text: 'Tailwind CSS 4', link: '/css/tailwind' },
        ]
      },
      {
        text: '⚡ Frameworks y Ecosistema',
        collapsed: true,
        items: [
          { text: 'Vue.js 3', link: '/frameworks/vue-3' },
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
      copyright: `Copyright © ${new Date().getFullYear()} - Aldair Cruz`
    }
  }
})