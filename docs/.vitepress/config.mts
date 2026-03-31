import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Apuntes de Front End",
  description: "Mi base de conocimientos",
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guías', link: '/guia/intro' }
    ],
    sidebar: [
      {
        text: 'Lógica y Lenguaje',
        items: [
          { text: 'TypeScript Esencial para Frontend',
            items: [
              {text: 'Fundamentos de Typescript', link: '/typescript/01-fundamentos'}
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
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tu-usuario' }
    ]
  }
})