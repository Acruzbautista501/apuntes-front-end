# Apuntes de Frontend Development

Bienvenido a mi repositorio personal de documentación técnica y hojas de referencia (*cheat sheets*), construido con **VitePress**. Aquí centralizo conceptos clave, mejores prácticas y ejemplos de implementación sobre las tecnologías que utilizo para construir interfaces web modernas, escalables y tipadas — con temarios que van de cero a nivel avanzado en cada tecnología.

## Contenido del Repositorio

El repositorio está organizado por módulos para facilitar la consulta rápida de sintaxis y lógica de programación:

### 1. **Fundamentos de Programación y TypeScript 📘**
Base de programación con TypeScript, más su aplicación práctica en el frontend (16 módulos en total).
* **Fundamentos (8 módulos):** Tipado y estructuras, control de flujo, funciones, interfaces y tipos, POO avanzada, asincronismo y consumo de APIs REST, Vite y despliegue.
* **TypeScript para Frontend (8 módulos):** Tipado básico, objetos e interfaces, funciones, control de flujo, genéricos, APIs y el DOM, integración con frameworks modernos.

### 2. **Vue.js 3 con TypeScript 🟢**
Documentación completa de la **Composition API** y el azúcar sintáctico de `<script setup>` (22 módulos).
* **Reactividad:** `ref`, `reactive`, `computed`, `watch`/`watchEffect` y ciclo de vida.
* **Componentes:** Props, Emits y `v-model` personalizado, Slots, Template Refs, Componentes Dinámicos, `KeepAlive`, `Teleport`, `Suspense`.
* **Lógica reutilizable:** Composables propios, Provide/Inject, consumo de APIs, directivas personalizadas.
* **Ecosistema:** Vue Router, Pinia, Transiciones, testing con Vitest + Vue Test Utils.
* **Calidad:** TypeScript avanzado (genéricos en componentes), rendimiento, arquitectura de proyectos grandes y accesibilidad.

### 3. **Ecosistema CSS & UI 🎨**
Hojas de estilo y frameworks de utilidad para maquetación ágil.
* **CSS3 (19 módulos):** Layout, Flexbox y Grid a fondo, selectores avanzados (`:has()`, `:is()`, `:where()`), Container Queries, CSS Nesting nativo, `@layer`, scroll-driven animations, View Transitions API y accesibilidad.
* **Tailwind CSS 4 (20 módulos):** Sintaxis "CSS-first", `@theme`, `@utility` y variantes personalizadas, CSS moderno (3D, Subgrid, gradientes), theming y migración v3→v4.
* **Bootstrap 5 (17 módulos):** Sistema de rejilla (Grid), catálogo completo de componentes, personalización con Sass, Utility API, modo oscuro nativo e integración con Vue/React.

---

## 🛠️ Stack Tecnológico

* **Lenguajes:** TypeScript, JavaScript (ES6+), HTML5.
* **Frameworks:** Vue.js 3 (Composition API), Vue Router, Pinia.
* **Estilos:** CSS3, Tailwind CSS 4, Bootstrap 5.
* **Herramientas:** Vite, VitePress, Vitest, Git.

---

## Estructura del Proyecto

```text
apuntes-front-end/
├── docs/
│   ├── fundamentos/       # Fundamentos de Programación con TypeScript
│   ├── typescript/        # TypeScript aplicado al Frontend
│   ├── css/                # CSS3 (layout, selectores, moderno, accesibilidad)
│   ├── bootstrap/          # Bootstrap 5
│   ├── tailwind/           # Tailwind CSS 4
│   ├── vue/                 # Vue.js 3 con Composition API + TypeScript
│   ├── guia/                # Página de introducción
│   └── .vitepress/          # Configuración del sitio (sidebar, tema)
└── README.md
```

---

## Autor

**Aldair Cruz Bautista**
* **Rol:** Frontend Developer / Maquetador Web
* **Especialidad:** Vue.js, TypeScript y Maquetación Responsiva
* **Ubicación:** México 🇲🇽

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. ¡Siéntete libre de usar estos apuntes para tu propio aprendizaje!

---
> **Nota:** Este repositorio se mantiene en constante actualización a medida que exploro nuevas versiones y herramientas del ecosistema frontend.
