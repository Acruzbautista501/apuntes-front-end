# Módulo 17: Integración con ESPs

Un ESP (*Email Service Provider* — Mailchimp, SendGrid, Klaviyo, HubSpot) es la plataforma que efectivamente **envía** el email a la lista de destinatarios, gestiona la personalización (Módulo 15), y da métricas de apertura/clics. Este módulo cubre qué espera cada tipo de plataforma del HTML que le entregas, desde la perspectiva del maquetador.

## 17.1 El Rol del Maquetador Frente al ESP

El maquetador entrega HTML ya terminado (con CSS inline, comentarios condicionales, botones a prueba de balas — Módulos 1-14) que el ESP simplemente **aloja e inyecta datos de personalización**. El ESP no corrige errores de compatibilidad del HTML — cualquier problema de renderizado que llegue hasta ahí, llega también a la bandeja de entrada real de la audiencia.

## 17.2 Subir una Plantilla a Mailchimp

Mailchimp acepta HTML personalizado a través de su editor de "Código" (*Code your own*), donde se pega el HTML final ya con CSS inline.

```html
<p>Hola, *|FNAME|*,</p>
<p>*|UNSUB|*</p> <!-- Mailchimp reemplaza esto con el enlace real de baja -->
```

* `*|FNAME|*`, `*|LNAME|*`, `*|EMAIL|*` son los *merge tags* estándar de Mailchimp (Módulo 15).
* `*|UNSUB|*` es un marcador especial obligatorio: Mailchimp requiere que el enlace de baja esté presente en el HTML, y lo reemplaza automáticamente con la URL de baja específica de cada destinatario.

## 17.3 Plantillas Dinámicas en SendGrid

SendGrid usa Handlebars (Módulo 15) directamente en su editor de plantillas dinámicas, con soporte completo para condicionales e iteración.

```handlebars
<p>Hola, {{ first_name }},</p>

{{#if is_premium}}
  <p>Gracias por ser cliente premium.</p>
{{/if}}
```

Los datos (`first_name`, `is_premium`) se envían desde tu backend al llamar a la API de SendGrid, no se configuran dentro del propio HTML — el maquetador solo necesita saber qué nombres de variable espera el equipo de desarrollo que la integre.

## 17.4 Flujos Automatizados en Klaviyo

Klaviyo (fuerte en e-commerce) también usa Handlebars, con acceso a objetos de datos más complejos relacionados con el comportamiento de compra.

```handlebars
<p>Hola {{ person.first_name|default:'amig@' }},</p>
<p>Vimos que dejaste {{ event.extra.items.length }} producto(s) en tu carrito.</p>
```

Este tipo de contenido (emails de "carrito abandonado") requiere coordinación estrecha entre el maquetador y quien configura el flujo automatizado en Klaviyo, ya que los nombres exactos de las variables dependen de cómo esté configurada la integración de la tienda.

## 17.5 Bloques de Contenido Editables (*Drag & Drop*)

Muchos ESPs ofrecen también un editor visual de arrastrar y soltar, pensado para usuarios sin conocimientos de HTML — pero un maquetador que necesita control total del diseño casi siempre prefiere el modo de "código personalizado", ya que el editor visual limita las técnicas de compatibilidad vistas en este curso (VML, comentarios condicionales, layouts complejos).

## 17.6 Checklist al Entregar una Plantilla a un ESP

* [ ] El HTML incluye el marcador de baja (*unsubscribe*) requerido por la plataforma específica.
* [ ] Los nombres de los *merge tags*/variables coinciden exactamente con los que espera el ESP (o el equipo de desarrollo, en integraciones vía API).
* [ ] El HTML fue validado en Litmus/Email on Acid (Módulo 14) **antes** de subirlo — no después.
* [ ] Las imágenes están alojadas en una URL pública y permanente, no en rutas locales.
* [ ] Se probó el envío real de una prueba desde la propia plataforma del ESP (algunos ESPs procesan el CSS de forma ligeramente distinta a un archivo HTML aislado).

## 17.7 Diferencias de Procesamiento Entre ESPs

Algunos ESPs modifican el HTML antes de enviarlo (agregan tracking de clics envolviendo enlaces, insertan un píxel de seguimiento de apertura, a veces reformatean espacios en blanco) — es normal, pero conviene volver a validar en un testing dedicado **después** de subir la plantilla al ESP, no solo antes, ya que esas modificaciones automáticas ocasionalmente introducen problemas de renderizado propios.

## 17.8 Tabla de Referencia Rápida

| ESP | Sintaxis de variables | Marcador de baja obligatorio |
| :--- | :--- | :--- |
| Mailchimp | `*\|TAG\|*` | `*\|UNSUB\|*` |
| SendGrid | Handlebars | Configurado por política de cuenta, no siempre un marcador en el HTML |
| Klaviyo | Handlebars con filtros tipo Liquid | Bloque de plantilla dedicado en el editor |
| HubSpot | Handlebars | Módulo de "unsubscribe" nativo del editor |

## 17.9 Errores Comunes

- **Omitir el marcador de baja requerido por la plataforma**: la mayoría de ESPs rechazan el envío por completo, o lo marcan automáticamente como incumplimiento de políticas antispam.
- **No volver a validar después de subir al ESP**: las modificaciones automáticas de la plataforma (tracking, reformateo) pueden introducir problemas de renderizado que no existían en el HTML original.
- **Asumir que el nombre de una variable es universal entre ESPs**: cada plataforma (e incluso cada integración específica dentro de la misma plataforma) puede usar nombres de variable distintos para el mismo dato — siempre confirma con la documentación o el equipo de integración correspondiente.
