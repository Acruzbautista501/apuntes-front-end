# Módulo 17: Proyecto Integrador — Panel de Administración

Has recorrido el camino completo: desde `.container` y `.row` hasta la Utility API y la integración con Vue/React. Este módulo no enseña conceptos nuevos; es un **plano de construcción** para aplicar todo lo anterior en un solo proyecto coherente y de nivel profesional.

## 17.1 El Encargo

Vas a construir un **Panel de Administración** (dashboard) completo:

1. Navbar superior con logo, buscador y menú de usuario (Dropdown).
2. Sidebar de navegación, colapsable a Offcanvas en móvil.
3. Una tabla de datos responsiva con paginación.
4. Un formulario de "Crear registro" dentro de un Modal, con validación visual.
5. Notificaciones tipo Toast al guardar exitosamente.
6. Modo oscuro funcional con `data-bs-theme` y persistencia.
7. Una paleta de color de marca personalizada, compilada con Sass (no clases sueltas sobrescritas).

## 17.2 Checklist de Requisitos Técnicos

Cada punto remite al módulo donde se explicó la técnica. Autoevalúate antes de dar el proyecto por terminado.

### Fundamentos y Setup
- [ ] El proyecto instala Bootstrap vía `npm install bootstrap`, no CDN (Módulo 1).
- [ ] Existe un archivo `mi-tema.scss` que importa Bootstrap por partes, con variables propias definidas antes de `variables` (Módulo 12).
- [ ] El HTML base incluye el meta *viewport* correcto (Módulo 1).

### Layout
- [ ] El layout general usa `.container-fluid` + Grid con al menos un `row-cols-*` para las tarjetas de KPIs (Módulo 2, Módulo 7).
- [ ] El Sidebar usa `offset`/`order` o Flexbox del Grid para su alineación en pantallas grandes (Módulo 7).
- [ ] En móvil, el Sidebar se convierte en un `.offcanvas` (Módulo 9).

### Componentes
- [ ] La tabla de datos usa `.table-responsive`, `.table-striped` y `.table-hover` (Módulo 3).
- [ ] Existe paginación funcional con `.pagination` (Módulo 8).
- [ ] El menú de usuario en la navbar es un `.dropdown` (Módulo 8).
- [ ] Los íconos usan Bootstrap Icons, no imágenes sueltas (Módulo 3).

### Formularios e Interactividad
- [ ] El formulario del Modal usa `.is-valid`/`.is-invalid` con `.valid-feedback`/`.invalid-feedback` (Módulo 6).
- [ ] Al menos un campo usa `.input-group` o `.form-floating` (Módulo 6).
- [ ] El Toast de confirmación se muestra vía JavaScript (`new bootstrap.Toast(...).show()`), no por clic directo (Módulo 9, Módulo 10).
- [ ] Al menos un componente usa un evento de ciclo de vida (`shown.bs.modal` para enfocar el primer input) (Módulo 10).

### Modo Oscuro y Accesibilidad
- [ ] El toggle de tema usa `data-bs-theme` y persiste en `localStorage` (Módulo 13).
- [ ] Los fondos/textos personalizados usan `.bg-body`/`.text-body`, no colores fijos (Módulo 13).
- [ ] Los botones de solo ícono tienen `.visually-hidden` o `aria-label` (Módulo 11).
- [ ] Se verificó el contraste de la paleta personalizada en ambos modos (Módulo 11).

### Personalización y Rendimiento
- [ ] Al menos un color de marca nuevo se agregó al mapa `$theme-colors` (Módulo 12).
- [ ] El proyecto importa solo los parciales de Sass que usa, o tiene PurgeCSS configurado (Módulo 16).
- [ ] Se probó `npm run build` + `npm run preview` antes de dar el proyecto por terminado (Módulo 16).

## 17.3 Estructura de Archivos Sugerida

```text
src/
├── styles/
│   ├── mi-tema.scss        # Importaciones parciales de Bootstrap + variables propias
│   └── utilidades.scss     # Utility API personalizada (Módulo 14)
├── components/
│   ├── AppNavbar.vue
│   ├── AppSidebar.vue       # Offcanvas en móvil
│   ├── DataTable.vue
│   ├── CreateRecordModal.vue
│   └── ThemeToggle.vue
├── composables/
│   └── useTheme.ts          # Lógica de data-bs-theme + localStorage
└── main.ts                  # import './styles/mi-tema.scss'
```

## 17.4 Criterios de "Terminado" (Definition of Done)

1. **¿Funciona en 320px de ancho, con el Sidebar convertido en Offcanvas?**
2. **¿Un usuario que navega solo con teclado puede abrir el Modal, llenar el formulario y cerrarlo sin perder el foco?**
3. **¿El modo oscuro usa la paleta de marca personalizada correctamente, no solo los colores por defecto de Bootstrap invertidos?**
4. **¿El bundle de producción (`npm run build`) pesa notablemente menos que importar Bootstrap completo sin optimizar?**

## 17.5 Siguientes Pasos

Con este proyecto terminado, ya tienes el criterio para:

* Auditar y mejorar proyectos de Bootstrap escritos por otras personas (revisiones de PR con fundamento técnico).
* Decidir con criterio entre Bootstrap, Tailwind CSS o CSS puro según el proyecto — ya conoces las fortalezas reales de cada enfoque.
* Construir un sistema de diseño propio sobre la base de Bootstrap, en lugar de pelear contra sus valores por defecto.
