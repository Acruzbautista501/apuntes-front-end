# MÓDULO 20 — Ejercicios de Práctica

Antes de abordar el Proyecto Integrador, conviene practicar cada bloque de conceptos por separado, en piezas pequeñas y autocontenidas. Cada ejercicio indica los módulos que pone en juego para que puedas repasarlos si te atoras.

## 20.1 Fundamentos, Instalación y Sintaxis Base (Módulos 1-3)

1. **Proyecto desde cero.** Configura un proyecto con Vite + Tailwind 4 sin plantillas, y verifica que el motor JIT solo genere las clases realmente usadas en tu HTML.
2. **Tarjeta de perfil.** Construye una tarjeta de perfil con la escala de espaciado (`p-`, `m-`, `gap-`), tamaños (`w-`, `h-`), colores de la paleta y al menos 3 niveles de jerarquía tipográfica.

## 20.2 Layout y Flexbox (Módulos 4-5)

3. **Navbar sticky.** Recrea una barra de navegación fija arriba (`sticky`), con logo a la izquierda y enlaces a la derecha usando `flex` y `justify-between`.
4. **Listado desplazable.** Construye un listado tabular desplazable en móvil (`overflow-x-auto`) con un badge posicionado (`absolute`/`relative`) sobre una fila destacada.

## 20.3 CSS Grid (Módulo 6)

5. **Dashboard con celdas expandidas.** Diseña un panel con `grid-cols-*`, usando `col-span-*`/`row-span-*` para que una tarjeta ocupe el doble de espacio que las demás.
6. **Galería con relleno automático.** Construye una galería de tarjetas de tamaño desigual con flujo automático que rellene los huecos (`grid-flow-dense`).

## 20.4 Responsive Design (Módulo 7)

7. **Stack-to-Row.** Toma una tarjeta ya construida y aplícale este patrón: apilada en móvil, en fila desde `md:`.
8. **Sidebar-to-Hamburger.** Implementa un menú lateral visible en escritorio (`lg:`) que se colapsa en móvil.

## 20.5 Estados y Variantes (Módulo 8)

9. **Formulario con feedback visual.** Construye un login con `hover:`, `focus:` y `disabled:` en el botón de envío, validando un campo de email con `peer-invalid:`.
10. **Tarjeta con group-hover.** Crea una tarjeta donde, al pasar el mouse sobre el contenedor, cambien a la vez el color del título, la opacidad de una imagen y la visibilidad de un botón oculto.

## 20.6 Borders, Shadows, Backgrounds y Efectos (Módulos 9-10)

11. **Progresión de elevación.** Diseña 3 variantes de una misma tarjeta jugando solo con `shadow-*`, `rounded-*` y `border`.
12. **Hero con overlay y glassmorphism.** Construye una sección hero con imagen de fondo y overlay oscuro semitransparente, y una segunda versión con efecto glassmorphism (`backdrop-blur`).

## 20.7 Animaciones y Transiciones (Módulo 11)

13. **Botón táctil.** Anima un botón con `transition`, `hover:scale-*` y `active:scale-*` para dar sensación de "presión táctil".
14. **Animación personalizada.** Define una animación propia en Tailwind 4 (por ejemplo "fade-in-up") con `@theme` y aplícala con una clase `animate-*`.

## 20.8 Personalización y Modo Oscuro (Módulo 12)

15. **Paleta de marca.** Define una paleta propia en `@theme` y reemplaza los colores por defecto de un componente ya construido.
16. **Toggle de tema.** Implementa un modo oscuro con `dark:` persistido en `localStorage`, aplicado a al menos 3 componentes.

## 20.9 Componentización y Buenas Prácticas (Módulos 13-14)

17. **Extracción de componente.** Extrae a un componente reutilizable (o a una clase con `@apply`) un bloque con más de 10 clases repetidas en 3 lugares del proyecto, y justifica la elección.
18. **Refactor de HTML sucio.** Reordena un bloque de HTML con clases desordenadas siguiendo el orden mental recomendado (layout → spacing → tipografía → color → estados).

## 20.10 Container Queries (Módulo 15)

19. **Tarjeta adaptable a su contenedor.** Construye una tarjeta que cambie de layout vertical a horizontal según el ancho de su *contenedor* (no del viewport) con `@container`/`@min-*`, y colócala en dos contenedores de distinto ancho para comprobarlo.

## 20.11 CSS Moderno (Módulo 16)

20. **Flip 3D.** Crea una tarjeta con efecto "flip" al pasar el mouse, usando `perspective` y rotación en el eje Y.
21. **Modal con `@starting-style`.** Implementa un modal con entrada y salida suaves, sin JavaScript de animación.

## 20.12 Utility API (Módulo 17)

22. **Utilidades propias.** Crea una utilidad estática con `@utility` (por ejemplo `text-shadow-sm`) y otra funcional con valor dinámico, y úsalas en un componente.

## 20.13 Migración y Arquitectura (Módulo 18)

23. **Migración v3 → v4.** Si tienes o encuentras un proyecto en Tailwind 3, corre la herramienta oficial de migración y documenta al menos 2 cambios manuales que tuviste que aplicar.
24. **Organización con `@layer`.** Organiza los estilos de un proyecto pequeño en capas (`base`, `components`, `utilities`) en vez de tenerlo todo mezclado.

## 20.14 Sistemas de Diseño, Rendimiento y Accesibilidad (Módulo 19)

25. **Mini design system.** Publica tokens semánticos con `@theme` (por ejemplo `--color-surface`, `--color-text`) reutilizados en 3 componentes, y agrega un segundo tema que los sobrescriba.
26. **Auditoría de accesibilidad.** Revisa un componente interactivo (por ejemplo un menú desplegable) con el checklist del módulo: `sr-only` en íconos sin texto, `focus-visible:` en vez de `focus:`, y verifica que respete `prefers-reduced-motion`.

## 20.15 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto, a diferencia del Módulo 21.
* Cuando te sientas cómodo resolviendo estos ejercicios sueltos, estás listo para el Proyecto Integrador.
