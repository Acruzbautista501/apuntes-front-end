# Módulo 20: Proyecto Integrador — Newsletter Responsiva Completa

Has recorrido el camino completo: desde la estructura base de tablas hasta la integración con ESPs y la entregabilidad. Este módulo no enseña conceptos nuevos; es un **plano de construcción** para aplicar todo lo anterior en un solo proyecto coherente y de nivel profesional.

## 20.1 El Encargo

Vas a construir una **Newsletter Mensual** completa para una marca ficticia:

1. Encabezado con logo (con alternativa para modo oscuro) y navegación simple de texto.
2. *Preheader* con texto de vista previa personalizado.
3. Sección hero con imagen de banner responsiva y un botón CTA a prueba de balas.
4. Layout de dos columnas para "Artículos destacados" (con imagen + texto en cada uno), que se apila en móvil.
5. Una sección con fondo de color/imagen (usando la técnica VML de Outlook si es con imagen).
6. Bloque condicional de contenido personalizado según un segmento del destinatario (Handlebars).
7. Pie de página con enlaces sociales, dirección física y enlace de baja.
8. Soporte completo de modo oscuro.
9. Compatibilidad validada en Outlook, Gmail y Apple Mail.

## 20.2 Checklist de Requisitos Técnicos

Cada punto remite al módulo donde se explicó la técnica. Autoevalúate antes de dar el proyecto por terminado.

### Estructura y CSS
- [ ] El HTML usa el *boilerplate* completo con namespaces VML (Módulo 2).
- [ ] Todos los estilos críticos están inline; `<style>` solo para media queries y modo oscuro (Módulo 3).
- [ ] La tipografía usa un *font stack* con respaldo *web-safe* (Módulo 4).

### Layout
- [ ] El contenedor principal tiene 600px con `max-width` (Módulo 2).
- [ ] Las columnas de "Artículos destacados" se apilan correctamente en móvil (Módulos 5, 8).
- [ ] Los espaciadores usan filas/columnas dedicadas, no `margin` (Módulo 5).

### Imágenes y Botones
- [ ] Todas las imágenes tienen `alt` descriptivo y `display:block` (Módulo 6).
- [ ] El fondo de sección con imagen tiene su alternativa VML para Outlook (Módulo 6).
- [ ] El botón CTA principal usa la técnica a prueba de balas completa (Módulo 7).

### Responsividad y Modo Oscuro
- [ ] El email incluye `<meta name="viewport">` (Módulo 8).
- [ ] El modo oscuro está implementado con `prefers-color-scheme` y probado explícitamente (Módulo 10).
- [ ] El logo tiene una versión alterna legible en modo oscuro (Módulo 10).

### Outlook
- [ ] Se usan comentarios condicionales `[if mso]`/`[if !mso]` donde corresponde (Módulo 9).
- [ ] El ancho se fuerza correctamente para Outlook con una tabla "fantasma" si es necesario (Módulo 9).

### Personalización
- [ ] El bloque condicional de contenido usa la sintaxis Handlebars correctamente (Módulo 15).
- [ ] Existe un valor de reserva para el nombre del destinatario (Módulo 15).

### Accesibilidad y Legal
- [ ] Se usan encabezados semánticos reales (Módulo 13).
- [ ] El contraste de color cumple el mínimo de 4.5:1 (Módulo 13).
- [ ] El enlace de baja está presente y funcional (Módulos 14, 18).

### Testing
- [ ] El HTML fue validado sintácticamente (Módulo 14).
- [ ] Se revisaron capturas en Outlook, Gmail y Apple Mail como mínimo (Módulo 14).
- [ ] El email pasó un test de spam con puntaje aceptable (Módulo 18).

## 20.3 Estructura de Archivos Sugerida

```text
newsletter-mensual/
├── src/
│   ├── plantillas/
│   │   └── newsletter.mjml
│   └── partials/
│       ├── header.mjml
│       └── footer.mjml
├── dist/
│   └── newsletter.html          # HTML final, con CSS inline
├── gulpfile.js
└── package.json
```

## 20.4 Criterios de "Terminado" (Definition of Done)

1. **¿El email se ve correctamente en Outlook de escritorio, Gmail (web) y Apple Mail (iOS/macOS)?**
2. **¿El email comunica su mensaje principal incluso con las imágenes bloqueadas?**
3. **¿Un usuario en modo oscuro ve texto legible en todas las secciones?**
4. **¿El enlace de baja funciona y es claramente visible?**
5. **¿El email pasa un test de spam (Mail Tester o equivalente) con un puntaje aceptable?**

## 20.5 Siguientes Pasos

Con este proyecto terminado, ya tienes el criterio para:

* Auditar y corregir plantillas de email existentes escritas por otras personas, con fundamento técnico sobre por qué cada técnica de compatibilidad existe.
* Elegir con criterio entre HTML manual, MJML o Foundation for Emails según la complejidad y el equipo del proyecto.
* Integrar plantillas con cualquier ESP moderno, entendiendo las diferencias de sintaxis de personalización entre plataformas.
* Diagnosticar problemas de entregabilidad distinguiendo entre lo que está bajo tu control como maquetador y lo que depende de infraestructura externa.
