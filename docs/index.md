---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Frontend Docs"
  text: "Guías, Snippets y Mejores Prácticas"
  tagline: "Documentación técnica personal enfocada en el ecosistema moderno de desarrollo web."
  image:
    src: /logo.png        # Ruta desde .vitepress/public/logo.png
    alt: Frontend Logo
    style:
      max-width: 500px    # Ajusta el tamaño si es necesario
    fallback: /fallback.png  # Imagen alternativa en caso de que logo.png falle
  actions:
    - theme: brand
      text: Empezar a leer
      link: /guia/intro
    - theme: alt
      text: Ver en GitHub
      link: https://github.com/Acruzbautista501/apuntes-front-end

features:
  - title: Vue.js 3 & React 18
    details: Composition API, Pinia y Vue Router; hooks, Context API y TanStack Query. Testing y accesibilidad en ambos.
    icon: ⚡
  - title: TypeScript Estricto
    details: Fundamentos de programación, tipado avanzado, genéricos y aplicación práctica en el frontend.
    icon: 🟦
  - title: Styling & Maquetación
    details: CSS3 avanzado, Tailwind CSS 4, Bootstrap 5, maquetación web semántica y maquetación de emails.
    icon: 🎨
  - title: Backend & Herramientas
    details: APIs REST con Node.js/Express y PHP puro, control de versiones con Git y tooling con Vite.
    icon: 🔧
---

## ¿Qué encontrarás en este repositorio?

Este espacio funciona como una **Single Source of Truth** (Fuente única de verdad) para mi proceso de aprendizaje. El objetivo es mantener notas claras y reutilizables que faciliten la maquetación y el desarrollo de interfaces robustas, con temarios que van de cero a nivel avanzado en cada tecnología.

### 🛠️ Stack Principal
- **Frameworks:** Vue 3 (Composition API) y React 18, ambos con Vite
- **Lenguaje:** TypeScript
- **Estilos:** CSS3 avanzado, Tailwind CSS 4, Bootstrap 5, maquetación web y de emails
- **Backend:** Node.js + Express + MongoDB, PHP puro
- **Herramientas:** Vue Router, Pinia, Vitest, Git, Vite

---

> "La mejor forma de aprender es documentar el camino."