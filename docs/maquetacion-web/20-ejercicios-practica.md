# Módulo 20: Ejercicios de Práctica

Antes de abordar el Proyecto Integrador, conviene practicar cada bloque de conceptos por separado, en piezas pequeñas y autocontenidas. Cada ejercicio indica los módulos que pone en juego para que puedas repasarlos si te atoras.

## 20.1 Introducción a la Maquetación (Módulo 1)

1. **Flujo de trabajo completo.** Define el flujo de trabajo completo (de diseño a código) para una página ficticia, documentando en qué punto usarías mobile-first vs. desktop-first según el proyecto.
2. **Maquetación vs. desarrollo frontend.** Compara, en una tabla propia, qué tareas son "maquetación" y cuáles son "desarrollo frontend" en un componente con lógica de estado (ej. un carrito de compras).

## 20.2 HTML Semántico (Módulo 2)

3. **Landmarks y jerarquía.** Maqueta una página completa (header, nav, main con article/section, aside, footer) usando solo landmarks semánticos, con jerarquía de encabezados correcta.
4. **Article, figure y time.** Marca una noticia con `<article>`, una imagen con `<figure>`/`<figcaption>`, y una fecha con `<time>`.

## 20.3 Modelo de Caja en Layouts Reales (Módulo 3)

5. **Colapso de márgenes.** Diagnostica y corrige un caso de colapso de márgenes verticales entre dos secciones, documentando por qué ocurrió.
6. **Tres formas de centrar.** Centra un elemento horizontalmente con 3 técnicas distintas (margin auto, flexbox, grid) y explica cuándo usarías cada una.

## 20.4 Formularios Accesibles (Módulo 4)

7. **Formulario con validación nativa.** Construye un formulario de registro con labels correctos, tipos de input semánticos, validación nativa HTML5 y mensajes de error asociados con `aria-describedby`.
8. **Fieldset y pseudo-clases.** Agrupa campos relacionados con `<fieldset>`/`<legend>` (ej. dirección de envío) y estiliza los estados de validación con pseudo-clases CSS.

## 20.5 Metodologías CSS (Módulo 5)

9. **Refactor a BEM.** Refactoriza un componente con CSS "espagueti" aplicando BEM.
10. **Organización ITCSS.** Organiza los estilos de un mini-proyecto siguiendo ITCSS, documentando en qué capa iría cada archivo.

## 20.6 Imágenes Responsivas (Módulo 6)

11. **srcset y sizes.** Implementa una imagen con `srcset` + `sizes` para distintos anchos de viewport, con dimensiones explícitas para evitar layout shift.
12. **Picture con art direction.** Usa `<picture>` para un recorte distinto en móvil (art direction) y un formato moderno (AVIF/WebP) con respaldo, con `loading="lazy"`.

## 20.7 Meta Tags (Módulo 7)

13. **Set completo de meta tags.** Agrega el set completo de meta tags a una página (Open Graph, Twitter Cards, favicons, canonical) y valida el resultado con una herramienta de vista previa.

## 20.8 De Figma al Código (Módulo 8)

14. **Sistema de diseño antes de maquetar.** A partir de un diseño en Figma (o una captura cualquiera), extrae un sistema de diseño básico en CSS (colores, tipografía, espaciado) antes de maquetar el primer componente.
15. **Estados no especificados.** Identifica en un diseño un componente que se repite, y decide qué estados (hover, error, vacío) no están especificados y cómo los resolverías.

## 20.9 Compatibilidad Cross-Browser (Módulo 9)

16. **Fallback con @supports.** Verifica en Can I Use el soporte de una propiedad CSS moderna que hayas usado, y agrega un fallback con `@supports`.
17. **Testing en navegadores reales.** Prueba una página en al menos 2 navegadores reales distintos y documenta una diferencia encontrada (especialmente en Safari/WebKit).

## 20.10 Rendimiento Web (Módulo 10)

18. **Medir y mejorar Core Web Vitals.** Mide el LCP, INP y CLS de una página con las herramientas del navegador, y aplica al menos una mejora concreta para cada métrica.

## 20.11 Accesibilidad Web (Módulo 11)

19. **Navegación solo con teclado.** Navega una página completa solo con teclado, documentando cada punto donde el foco se pierde o no es visible, y corrígelo.
20. **Skip link y aria-live.** Agrega un skip link funcional y usa `aria-live` para anunciar un cambio dinámico (ej. resultado de una búsqueda).

## 20.12 SEO Técnico (Módulo 12)

21. **Datos estructurados JSON-LD.** Agrega datos estructurados JSON-LD (Schema.org) a una página de producto o artículo, y valida el resultado.
22. **Sitemap y robots.txt.** Crea un `sitemap.xml` y un `robots.txt` básicos para un sitio de varias páginas.

## 20.13 Preprocesadores y Build Tools (Módulo 13)

23. **De CSS plano a Sass.** Convierte una hoja de estilos CSS plana a Sass, usando variables, anidamiento y al menos un mixin reutilizable.
24. **Parciales con ITCSS.** Organiza esos mismos estilos en parciales siguiendo ITCSS (Módulo 5).

## 20.14 Control de Versiones (Módulo 14)

25. **Rama, commits y merge conflict.** Crea una rama por funcionalidad para un cambio de maquetación, con commits descriptivos, y resuelve un conflicto de merge simulado en un archivo `.scss`.

## 20.15 Sistemas de Diseño (Módulo 15)

26. **Design tokens y documentación.** Define un set de design tokens (color, tipografía, espaciado) y documenta un componente (ej. botón) con sus variantes en Storybook o en un documento simple.

## 20.16 Testing Visual (Módulo 16)

27. **Regresión visual y falso positivo.** Configura un test de regresión visual básico (Percy, Chromatic o Playwright) para un componente, y provoca un cambio visual a propósito para ver el "falso positivo" que genera.

## 20.17 Internacionalización (Módulo 17)

28. **Expansión de texto y RTL.** Traduce una página a un idioma con expansión de texto significativa (ej. alemán) y verifica que el layout no se rompa; agrega soporte RTL básico con `dir="rtl"`.

## 20.18 Fundamentos PWA (Módulo 18)

29. **Manifest, Service Worker y offline.** Crea un Web App Manifest con íconos en varios tamaños, un Service Worker de registro básico y una página offline.

## 20.19 Documentación y Handoff (Módulo 19)

30. **Documentar un componente y un README.** Documenta un componente que hayas construido (uso, modificadores, notas) y escribe un README de proyecto con stack, estructura y convenciones.

## 20.20 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto, a diferencia del Módulo 21.
* Cuando te sientas cómodo resolviendo estos ejercicios sueltos, estás listo para el Proyecto Integrador.
