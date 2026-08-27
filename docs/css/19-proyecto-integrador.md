# Módulo 19: Proyecto Integrador — Landing Page Completa

Has recorrido el camino completo: desde el modelo de caja hasta Anchor Positioning. Este módulo no enseña conceptos nuevos; es un **plano de construcción** para aplicar todo lo anterior en un solo proyecto coherente.

## 19.1 El Encargo

Vas a construir una **landing page de producto** completa, de una sola página, con las siguientes secciones:

1. Navbar fija con menú responsivo (hamburguesa en móvil).
2. Sección *hero* con título de tipografía fluida y un fondo con gradiente.
3. Una rejilla de tarjetas de características (*features*) que se autoajusta sin media queries.
4. Un formulario de contacto con validación visual nativa.
5. Un *footer* con enlaces organizados en columnas.
6. Modo oscuro funcional, basado en variables CSS y `prefers-color-scheme`.

## 19.2 Checklist de Requisitos Técnicos

Cada punto remite al módulo donde se explicó la técnica. Autoevalúate antes de dar el proyecto por terminado.

### Fundamentos
- [ ] Todo el CSS vive en un archivo externo enlazado con `<link>`, nunca inline (Módulo 1).
- [ ] Se aplicó un reset con `box-sizing: border-box` al inicio del archivo (Módulo 1).
- [ ] Las propiedades de texto (color, tipografía) se definen en el `body` y se dejan heredar; el layout (`margin`, `padding`) se define por componente (Módulo 1, herencia).

### Color y Tipografía
- [ ] La paleta de color usa variables CSS semánticas (`--color-primario`, no un hex suelto repetido) (Módulo 3, Módulo 6).
- [ ] El *hero* usa al menos un `linear-gradient` (Módulo 6).
- [ ] Se cargó una fuente personalizada con `@font-face` y `font-display: swap`, o se usó `system-ui` deliberadamente (Módulo 7).
- [ ] El título principal usa `text-wrap: balance` (Módulo 7).

### Layout
- [ ] La estructura general usa CSS Grid con `grid-template-areas` (Módulo 10).
- [ ] La rejilla de *features* usa `repeat(auto-fit, minmax(...))` — cero media queries para las columnas (Módulo 10).
- [ ] La navbar interna usa Flexbox con `gap` (Módulo 9).
- [ ] El diseño es Mobile First: funciona en 320px antes de añadir breakpoints (Módulo 3).

### Interactividad
- [ ] El formulario usa `:invalid:not(:placeholder-shown)` para mostrar errores solo después de la interacción (Módulo 13).
- [ ] Los inputs, checkboxes o radios usan `accent-color` (Módulo 13).
- [ ] Los botones tienen `:hover`, `:focus-visible` y `:active` definidos, con `transition` (Módulo 4).
- [ ] Al menos un componente usa `:has()` para reaccionar al estado de un hijo (Módulo 8).

### Modo Oscuro y Accesibilidad
- [ ] El tema oscuro se implementa sobreescribiendo variables CSS dentro de `@media (prefers-color-scheme: dark)` (Módulo 3).
- [ ] Las animaciones respetan `prefers-reduced-motion` (Módulo 4, Módulo 17).
- [ ] Los íconos sin texto tienen una clase `.sr-only` con su descripción (Módulo 17).
- [ ] El contraste de texto sobre fondo cumple al menos AA (4.5:1) en ambos modos (Módulo 17).

### CSS Moderno
- [ ] Al menos un componente usa nesting nativo con `&` (Módulo 12).
- [ ] Los estilos están organizados con `@layer` (reset, base, componentes, utilidades) (Módulo 12).
- [ ] Una característica reciente (`:has()`, `subgrid`, `@starting-style`) está envuelta en `@supports` con un respaldo funcional (Módulo 12, Módulo 18).

## 19.3 Estructura de Archivos Sugerida

```text
proyecto/
├── index.html
├── css/
│   ├── reset.css        # @layer reset
│   ├── variables.css     # :root con la paleta y el modo oscuro
│   ├── base.css          # @layer base (tipografía, body)
│   ├── componentes.css   # @layer componentes (navbar, tarjetas, formulario)
│   ├── utilidades.css    # @layer utilidades
│   └── main.css          # Importa todo lo anterior en orden con @layer
└── assets/
    └── fonts/
```

```css
/* main.css */
@layer reset, base, componentes, utilidades;

@import url("reset.css") layer(reset);
@import url("variables.css");
@import url("base.css") layer(base);
@import url("componentes.css") layer(componentes);
@import url("utilidades.css") layer(utilidades);
```

## 19.4 Criterios de "Terminado" (Definition of Done)

No consideres el proyecto completo hasta poder responder "sí" a estas preguntas:

1. **¿Funciona en 320px de ancho sin scroll horizontal ni elementos rotos?**
2. **¿Un usuario que navega solo con teclado puede llegar a cada botón y ver claramente cuál tiene el foco?**
3. **¿El modo oscuro se ve intencional, con buen contraste en ambos modos, no solo "colores invertidos"?**
4. **¿Si duplicas la tarjeta de *feature* y la mueves a un sidebar angosto, se sigue viendo bien sin tocar su CSS?** (Esto valida que entendiste el layout responsivo real, no solo breakpoints fijos.)

## 19.5 Siguientes Pasos

Con este proyecto terminado, ya tienes el criterio para:

* Adoptar metodologías de arquitectura como BEM o ITCSS en proyectos de equipo (Módulo 5).
* Evaluar cuándo un preprocesador como SASS sigue aportando valor frente al CSS nativo moderno (Módulo 5, Módulo 12).
* Auditar el rendimiento de una hoja de estilos real: minificación, *critical CSS*, *purge* (Módulo 5).
* Explorar frameworks de utilidades como Tailwind CSS con una base sólida de CSS puro debajo.
