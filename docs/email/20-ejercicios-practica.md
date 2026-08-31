# Módulo 20: Ejercicios de Práctica

Antes de abordar el Proyecto Integrador, conviene practicar cada bloque de conceptos por separado, en piezas pequeñas y autocontenidas. Cada ejercicio indica los módulos que pone en juego para que puedas repasarlos si te atoras.

## 20.1 Introducción (Módulo 1)

1. **Email vs. Web.** Compara en una tabla propia 3 diferencias clave entre maquetar para web y para email, y lista qué herramientas usarías en cada etapa del flujo de trabajo.

## 20.2 Estructura Base HTML (Módulo 2)

2. **Estructura desde cero.** Construye la estructura base de un email (DOCTYPE, meta tags, preheader oculto, tabla contenedora de 600px) desde cero, sin copiar una plantilla.

## 20.3 CSS Inline (Módulo 3)

3. **Inline manual.** Toma un componente con `<style>` y conviértelo a CSS inline manualmente, documentando qué propiedades eliminaste por no ser confiables.
4. **Inline automatizado.** Automatiza el inline de ese archivo con un inliner (ej. Juice o Premailer) y compara el resultado con tu versión manual.

## 20.4 Tipografía (Módulo 4)

5. **Font stack con mejora progresiva.** Define un font stack con mejora progresiva (web-safe + Google Font opcional) y ajusta `mso-line-height-rule` para que se vea consistente en Outlook.

## 20.5 Layouts con Tablas (Módulo 5)

6. **Una y dos columnas con espaciadores.** Construye un layout de una columna, y luego uno de dos columnas con tablas anidadas, usando espaciadores en vez de `margin`/`gap`.
7. **valign en 3 columnas.** Agrega `valign="top"` donde corresponda en un layout de 3 columnas y documenta qué se rompía sin él.

## 20.6 Imágenes (Módulo 6)

8. **display:block y retina.** Inserta una imagen con `display:block` obligatorio y una versión de alta densidad (retina), y verifica cómo se comporta con las imágenes bloqueadas por defecto.

## 20.7 Botones Bulletproof (Módulo 7)

9. **VML y alternativa con tabla.** Construye un botón "a prueba de balas" con la técnica VML para Outlook, y una versión más simple con tabla como alternativa.
10. **Ancho fluido y área táctil.** Haz que ese botón tenga ancho fluido (100% en móvil) con un área táctil mínima adecuada.

## 20.8 Responsive (Módulo 8)

11. **Fluid-hybrid con media queries.** Aplica el enfoque fluid-hybrid para apilar columnas en móvil con media queries, incluyendo el `<meta name="viewport">`.

## 20.9 Comentarios Condicionales MSO (Módulo 9)

12. **Mostrar/ocultar por cliente.** Usa `<!--[if mso]>` para corregir el ancho de una tabla solo en Outlook, y `[if !mso]` para mostrar contenido alternativo al resto de clientes.

## 20.10 Modo Oscuro (Módulo 10)

13. **color-scheme y logo transparente.** Implementa modo oscuro con `color-scheme` y `@media (prefers-color-scheme: dark)`, resolviendo el problema de un logo transparente que se ve mal en fondo oscuro.

## 20.11 MJML (Módulo 11)

14. **De HTML manual a MJML.** Recrea en MJML un email que ya hayas maquetado en HTML manual, usando `<mj-attributes>` para estilos globales reutilizables.

## 20.12 Foundation for Emails (Módulo 12)

15. **El mismo email con Foundation.** Construye el mismo email con Foundation for Emails, usando su sistema de grid, y compara el resultado con la versión MJML del ejercicio anterior.

## 20.13 Accesibilidad (Módulo 13)

16. **Auditoría de accesibilidad.** Audita un email existente: agrega `role="presentation"` a las tablas de layout, revisa el `alt` de las imágenes y verifica el contraste de color.

## 20.14 Testing Cross-Client (Módulo 14)

17. **Validación y clientes prioritarios.** Valida el HTML de un email con una herramienta de validación, y define una checklist de clientes prioritarios según una audiencia ficticia.

## 20.15 Personalización (Módulo 15)

18. **Handlebars con fallback.** Agrega personalización con Handlebars (merge tags, un condicional y una iteración sobre una lista de productos), con valores por defecto (fallback).

## 20.16 Automatización de Build (Módulo 16)

19. **Flujo de build con partials.** Configura un flujo de build simple (Gulp o similar) que compile partials reutilizables e infle el CSS automáticamente al final.

## 20.17 Integración con ESPs (Módulo 17)

20. **Checklist de entrega a un ESP.** Prepara una plantilla siguiendo el checklist de entrega a un ESP (ej. Mailchimp), documentando qué bloques dejarías como editables drag & drop.

## 20.18 Deliverability (Módulo 18)

21. **Checklist de deliverability.** Revisa un email contra la checklist de deliverability: proporción texto/imagen, HTML bien formado, enlace de baja visible, y corre un test de spam.

## 20.19 Checklist de QA (Módulo 19)

22. **QA completo sobre un ejercicio previo.** Usa la checklist completa del Módulo 19 sobre un email ya construido en ejercicios anteriores y documenta qué puntos fallaban antes de esta revisión.

## 20.20 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto, a diferencia del Módulo 21.
* Cuando te sientas cómodo resolviendo estos ejercicios sueltos, estás listo para el Proyecto Integrador.
