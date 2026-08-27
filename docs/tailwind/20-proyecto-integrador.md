# MÓDULO 20 — Proyecto Integrador: Dashboard de Gestión

Has recorrido el camino completo: desde `¿Qué es Tailwind?` hasta el motor Oxide y la accesibilidad. Este módulo final no enseña conceptos nuevos; es un **plano de construcción** para que apliques todo lo anterior en un solo proyecto coherente, tal como lo harías en un entorno profesional real.

## 20.1 El Encargo

Vas a construir el **Dashboard Principal** de tu aplicación: la pantalla que un administrador ve al iniciar sesión. Debe incluir:

1. Una barra de navegación superior con logo y menú (responsivo, patrón "Sidebar-to-Hamburger" del Módulo 7.4).
2. Un sidebar de navegación lateral (oculto en móvil, visible en escritorio).
3. Una sección de **tarjetas de estadísticas** (KPIs: partidos jugados, goles totales, equipos activos).
4. Una **tabla de posiciones** alineada con `subgrid` (Módulo 16.4).
5. Una tarjeta de "Próximo Partido en Vivo" con indicador `animate-ping` (Módulo 11.3).
6. Modo oscuro funcional con persistencia (Módulo 12.4).
7. Al menos un componente diseñado con **Container Queries** para que se adapte tanto al sidebar como al área principal (Módulo 15).

## 20.2 Checklist de Requisitos Técnicos

Usa esta lista para autoevaluar tu implementación antes de darla por terminada. Cada punto remite al módulo donde se explicó la técnica.

### Fundamentos y Setup
- [ ] El proyecto usa `@import "tailwindcss";` sin `tailwind.config.js` (Módulo 2).
- [ ] Existe un archivo `theme.css` dedicado, separado de los estilos de componentes (Módulo 12).
- [ ] Los colores de marca están definidos como variables semánticas (`--color-brand-primary`, no `--color-blue-600`) (Módulo 12.3).

### Layout
- [ ] El sidebar y el grid de tarjetas usan CSS Grid, no Flexbox forzado (Módulo 6).
- [ ] La tabla de posiciones usa `grid-cols-subgrid` para alinear encabezado y filas (Módulo 16.4).
- [ ] El layout completo es Mobile First: funciona en 320px antes de añadir `md:`/`lg:` (Módulo 7.1).

### Interactividad y Estado
- [ ] Los botones tienen `hover:`, `focus-visible:` y `active:` definidos (Módulo 8, Módulo 19.3).
- [ ] El indicador de "en vivo" usa `animate-ping` combinado correctamente con un punto estático (Módulo 11.3).
- [ ] Al menos un componente usa `group-hover:` o `peer-*` (Módulo 8.5, 8.6).

### Modo Oscuro
- [ ] El toggle de tema persiste en `localStorage` y evita el "flash" de color al recargar (Módulo 12.4).
- [ ] Todos los textos mantienen contraste suficiente en ambos modos (Módulo 19.3).

### Componentización
- [ ] Existe al menos un `BaseButton`, un `BaseCard` y un `MatchCard` extraídos como componentes con props tipadas (Módulo 13).
- [ ] Ningún componente recibe clases de Tailwind como prop directa (antipatrón cubierto en 13.2).
- [ ] La estructura de carpetas sigue el modelo `components/ui/` vs. `components/features/` (Módulo 13.4).

### Novedades de v4
- [ ] Al menos una tarjeta usa `@container` para adaptarse a su contenedor, no al viewport (Módulo 15).
- [ ] El modal de confirmación (si lo incluyes) usa `starting:*` para su animación de entrada (Módulo 16.2).

### Accesibilidad
- [ ] Los íconos sin texto tienen un `sr-only` con su descripción (Módulo 19.3).
- [ ] El estado "sidebar abierto/cerrado" en móvil usa `aria-expanded` sincronizado con clases Tailwind (Módulo 19.3).
- [ ] Las animaciones respetan `motion-reduce:` (Módulo 11.3, 19.3).

### Calidad de Código
- [ ] `prettier-plugin-tailwindcss` está instalado y las clases están ordenadas automáticamente (Módulo 14.1).
- [ ] Ningún elemento tiene más de ~20 clases sin haber sido evaluado para extracción a componente (Módulo 14.2, 14.3).

## 20.3 Estructura de Archivos Sugerida

```text
src/
├── assets/
│   └── theme.css              # @theme + variables semánticas + dark mode
├── components/
│   ├── ui/
│   │   ├── BaseButton.vue
│   │   ├── BaseCard.vue
│   │   └── ThemeToggle.vue
│   └── features/
│       └── dashboard/
│           ├── StatCard.vue       # Usa @container
│           ├── StandingsTable.vue # Usa subgrid
│           ├── MatchLiveCard.vue  # Usa animate-ping
│           └── AppSidebar.vue
├── composables/
│   └── useTheme.ts
└── views/
    └── DashboardView.vue
```

## 20.4 Criterios de "Terminado" (Definition of Done)

No consideres el proyecto completo hasta poder responder "sí" a estas cuatro preguntas:

1. **¿Funciona en 320px de ancho sin scroll horizontal ni elementos rotos?**
2. **¿Un usuario que navega solo con teclado (`Tab`) puede llegar a cada botón y ver claramente cuál tiene el foco?**
3. **¿El modo oscuro se ve intencional (no solo "colores invertidos"), con buen contraste en ambos modos?**
4. **¿Podrías tomar `StatCard.vue` y pegarlo en un proyecto completamente distinto sin que se rompa?** (Esto valida que tu componentización, del Módulo 13, realmente logró independencia.)

::: tip 💡 Consejo del Diseñador Frontend:
Este proyecto integrador no tiene una única solución "correcta". Su valor está en obligarte a **tomar decisiones** con las herramientas de los 19 módulos anteriores en lugar de seguir instrucciones paso a paso. Si te atoras en una parte específica, vuelve al módulo correspondiente en lugar de improvisar una solución que ignore lo ya aprendido — es la mejor forma de consolidar el conocimiento a largo plazo.
:::

## 20.5 Siguientes Pasos Después de Este Temario

Una vez completado este proyecto, ya tienes el criterio necesario para:

* Auditar y mejorar código de Tailwind escrito por otras personas (revisiones de PR con fundamento técnico, no solo estético).
* Diseñar el sistema de tokens de un proyecto nuevo desde cero, en lugar de heredar uno existente.
* Evaluar si una librería de componentes de terceros (headless UI, componentes de shadcn/ui, etc.) se integra limpiamente con tu arquitectura de `@theme`.
* Explicarle a un equipo por qué Tailwind 4 representa un cambio de paradigma real y no solo una actualización incremental de versión.
