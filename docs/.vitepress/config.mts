import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'es-ES', // 👈 idioma general
  title: "Apuntes de Front End",
  description: "Mi base de conocimientos",
  themeConfig: {
    outlineTitle: 'En esta página', 
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guías', link: '/guia/intro' }
    ],
    sidebar: [
      {
        text: 'Lógica y Lenguaje',
        items: [
          { text: 'Fundamentos de Programación',
            items: [
              {text: 'Introducción y Configuración del Entorno', link: '/fundamentos/01-introduccion'},
              {text: 'Tipado Básico y Estructuras de Datos', link: '/fundamentos/02-estructuras'},
              {text: 'Control de Flujo y Lógica', link: '/fundamentos/03-flujo'},
              {text: 'Funciones en TypeScript', link: '/fundamentos/04-funciones'},
              {text: 'Tipado Avanzado y Control de Flujo', link: '/typescript/05-control'},
              {text: 'Genéricos (El superpoder de TS)', link: '/typescript/06-genericos'},
              {text: 'Integración con APIs y el DOM', link: '/typescript/07-apis'},
              {text: 'TypeScript en Frameworks Modernos', link: '/typescript/08-frameworks'},
            ]
          },          
          { text: 'TypeScript Esencial para Frontend',
            items: [
              {text: 'Introducción y configuración', link: '/typescript/01-fundamentos'},
              {text: 'Tipado Básico y Primitivos', link: '/typescript/02-tipado'},
              {text: 'Tipado de Objetos e Interfaces', link: '/typescript/03-objetos'},
              {text: 'Funciones en el Front End', link: '/typescript/04-funciones'},
              {text: 'Tipado Avanzado y Control de Flujo', link: '/typescript/05-control'},
              {text: 'Genéricos (El superpoder de TS)', link: '/typescript/06-genericos'},
              {text: 'Integración con APIs y el DOM', link: '/typescript/07-apis'},
              {text: 'TypeScript en Frameworks Modernos', link: '/typescript/08-frameworks'},
            ]
          },
        ]
      },
      {
        text: 'Diseño y Maquetación',
        items: [
          { 
            text: 'CSS3 Avanzado', 
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
        text: 'Frameworks y Ecosistema',
        items: [
          { text: 'Vue.js 3 (Composition API + TS)', link: '/frameworks/vue-3' },
          { text: 'Nuxt (SSR/Static)', link: '/frameworks/nuxt' },
          { text: 'Angular', link: '/frameworks/angular' }
        ]
      }
    ],

    // 👇 AQUÍ está la clave
    docFooter: {
      prev: 'Página anterior',
      next: 'Página siguiente'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tu-usuario' }
    ]
  }
})