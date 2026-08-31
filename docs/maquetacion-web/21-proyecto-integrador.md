# Módulo 21: Proyecto Integrador — Landing Page de Nivel Producción

Has recorrido el camino completo: desde HTML semántico hasta sistemas de diseño, rendimiento, accesibilidad y handoff a desarrollo. Este módulo no enseña conceptos nuevos; es un **plano de construcción** para aplicar todo lo anterior en un solo proyecto coherente y de nivel profesional.

## 21.1 El Encargo

Vas a construir una **Landing Page de Producto** completa, lista para producción real:

1. Header con navegación responsiva (menú hamburguesa en móvil).
2. Sección hero con imagen optimizada y CTA principal.
3. Sección de características con imágenes responsivas (`srcset`/`picture`).
4. Sección de testimonios/reseñas con datos estructurados (`AggregateRating`).
5. Sección de preguntas frecuentes con datos estructurados (`FAQPage`).
6. Formulario de contacto completamente accesible con validación nativa.
7. Footer con enlaces legales y redes sociales.
8. Soporte de modo oscuro.
9. Web App Manifest básico (instalable como PWA).

## 21.2 Checklist de Requisitos Técnicos

Cada punto remite al módulo donde se explicó la técnica. Autoevalúate antes de dar el proyecto por terminado.

### Estructura y Semántica
- [ ] Un único `<h1>` con jerarquía de encabezados descendente correcta (Módulo 2).
- [ ] Landmarks semánticos completos: `<header>`, `<main>`, `<nav>`, `<footer>` (Módulo 2).
- [ ] `box-sizing: border-box` aplicado globalmente (Módulo 3).

### Metodología y Organización
- [ ] Las clases siguen la convención BEM consistentemente (Módulo 5).
- [ ] Los estilos están organizados según capas de ITCSS (Módulo 5, 13).
- [ ] Existe un sistema de variables CSS/Sass para colores, tipografía y espaciado (Módulo 8).

### Imágenes y Rendimiento
- [ ] Las imágenes usan `srcset`/`sizes` o `<picture>` según corresponda (Módulo 6).
- [ ] La imagen del hero (LCP) tiene `fetchpriority="high"`, nunca `loading="lazy"` (Módulo 10).
- [ ] Las imágenes fuera de pantalla usan `loading="lazy"` (Módulo 6).
- [ ] Todas las imágenes tienen `width`/`height` explícitos (Módulo 6, 10).

### SEO y Metadatos
- [ ] `<title>` y `meta description` únicos y descriptivos (Módulo 7).
- [ ] Open Graph y Twitter Cards completos (Módulo 7).
- [ ] Datos estructurados JSON-LD para reseñas y FAQ (Módulo 12).
- [ ] `sitemap.xml` y `robots.txt` presentes (Módulo 12).

### Formularios y Accesibilidad
- [ ] Todo campo tiene un `<label>` asociado correctamente (Módulo 4).
- [ ] Validación nativa HTML5 (`required`, `type`, `pattern`) (Módulo 4).
- [ ] Contraste de color mínimo 4.5:1 en todo el sitio (Módulo 11).
- [ ] Navegación completa posible solo con teclado, con `:focus-visible` (Módulo 11).
- [ ] Skip link al contenido principal (Módulo 11).

### Responsividad y Compatibilidad
- [ ] El sitio funciona correctamente desde 320px hasta pantallas grandes (Módulo 1, 8).
- [ ] Probado en al menos Chrome, Firefox y Safari (Módulo 9).
- [ ] `@supports` usado para alguna mejora progresiva (Módulo 9).

### PWA
- [ ] `manifest.json` con íconos en múltiples tamaños (Módulo 18).
- [ ] Un service worker básico con página offline (Módulo 18).

### Documentación
- [ ] README con stack, estructura y convenciones del proyecto (Módulo 19).
- [ ] Comentarios documentando decisiones no evidentes (Módulo 19).

## 21.3 Estructura de Archivos Sugerida

```text
landing-producto/
├── src/
│   ├── styles/
│   │   ├── settings/_variables.scss
│   │   ├── generic/_reset.scss
│   │   ├── objects/_grid.scss
│   │   ├── components/
│   │   │   ├── _header.scss
│   │   │   ├── _hero.scss
│   │   │   ├── _tarjeta-testimonio.scss
│   │   │   └── _formulario.scss
│   │   └── app.scss
│   ├── scripts/
│   │   └── menu-movil.js
│   └── assets/
│       └── imagenes/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── robots.txt
│   └── sitemap.xml
├── index.html
├── vite.config.js
└── README.md
```

## 21.4 Criterios de "Terminado" (Definition of Done)

1. **¿Un usuario que navega solo con teclado puede completar el formulario de contacto sin perder el foco en ningún punto?**
2. **¿Lighthouse reporta un puntaje de 90+ en Rendimiento, Accesibilidad y SEO?**
3. **¿El sitio se ve y funciona correctamente en Chrome, Firefox y Safari?**
4. **¿El sitio es instalable como PWA y muestra una página offline propia sin conexión?**
5. **¿La vista previa al compartir el enlace en redes sociales muestra la imagen y descripción correctas?**

## 21.5 Siguientes Pasos

Con este proyecto terminado, ya tienes el criterio para:

* Auditar y mejorar sitios existentes con fundamento técnico en rendimiento, accesibilidad y SEO, no solo apariencia visual.
* Decidir con criterio entre CSS puro, Sass, Tailwind o Bootstrap según las necesidades reales de cada proyecto (todos cubiertos en este sitio).
* Preparar maquetación estática para su conversión a componentes de Vue.js o React, anticipando lo que un equipo de desarrollo necesitará.
* Establecer y documentar convenciones de equipo (BEM, ITCSS, control de versiones) que escalen más allá de un solo proyecto.
