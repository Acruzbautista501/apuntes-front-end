# Módulo 19: Checklist de QA y Buenas Prácticas

Este módulo consolida en un único checklist recorrible todo lo cubierto en los Módulos 1-18 — el documento de referencia que un maquetador de email profesional revisa antes de dar cualquier plantilla por terminada.

## 19.1 Estructura y Compatibilidad Base

* [ ] El documento usa el `DOCTYPE` HTML5 y los namespaces VML en `<html>` (Módulo 2).
* [ ] Todo el layout está construido con tablas anidadas, no Flexbox/Grid como base (Módulo 5).
* [ ] Todas las tablas de layout tienen `role="presentation"` (Módulos 2, 13).
* [ ] El contenedor principal tiene un ancho de referencia (600px) con `max-width` (Módulo 2).

## 19.2 CSS y Tipografía

* [ ] Los estilos críticos están inline, no solo en `<style>` (Módulo 3).
* [ ] `<style>` en el `<head>` se usa únicamente para media queries y `:hover` (Módulo 3).
* [ ] No se usan propiedades sin soporte confiable (`position`, `float`, Flexbox/Grid como base) (Módulo 3).
* [ ] El *font stack* incluye una *web-safe font* como respaldo final (Módulo 4).
* [ ] El tamaño de fuente del cuerpo es de al menos 14px (Módulos 4, 13).

## 19.3 Imágenes

* [ ] Todas las imágenes tienen `alt` descriptivo (o `alt=""` si son decorativas) (Módulos 6, 13).
* [ ] Todas las imágenes tienen `display:block` (Módulo 6).
* [ ] Las imágenes están comprimidas y alojadas externamente, nunca adjuntas (Módulos 6, 18).
* [ ] El email tiene sentido y comunica su mensaje incluso con las imágenes bloqueadas (Módulos 6, 18).

## 19.4 Botones y CTAs

* [ ] Los botones usan la técnica a prueba de balas (VML + HTML) si tienen esquinas redondeadas (Módulo 7).
* [ ] El área táctil de los botones es de al menos 44x44px (Módulo 7).
* [ ] El texto de los CTAs es descriptivo, no genérico ("Comprar ahora" en vez de "Haz clic aquí") (Módulos 7, 13).

## 19.5 Responsividad y Modo Oscuro

* [ ] El email incluye `<meta name="viewport">` (Módulo 8).
* [ ] Las columnas se apilan correctamente en pantallas móviles (Módulo 8).
* [ ] El email fue probado explícitamente en modo oscuro (Módulo 10).
* [ ] Los logos son legibles en ambos modos de color (Módulo 10).

## 19.6 Outlook Específicamente

* [ ] Los fondos con imagen tienen su alternativa VML para Outlook (Módulo 6).
* [ ] El ancho del contenedor está forzado correctamente para Outlook si es necesario (Módulo 9).
* [ ] `mso-line-height-rule: exactly` está presente donde el espaciado de línea es crítico (Módulo 4).

## 19.7 Accesibilidad

* [ ] Se usan encabezados semánticos reales (`<h1>`-`<h6>`), no solo texto grande (Módulo 13).
* [ ] El contraste de color cumple un mínimo de 4.5:1 (texto normal) (Módulo 13).
* [ ] El documento declara `lang="es"` (o el idioma correspondiente) en `<html>` (Módulo 13).

## 19.8 Personalización y Contenido Dinámico

* [ ] Los *merge tags*/variables usan la sintaxis correcta del ESP de destino (Módulo 15).
* [ ] Existe un valor de reserva para datos que pueden faltar (Módulo 15).
* [ ] Se probó la vista previa con datos reales antes del envío (Módulos 15, 17).

## 19.9 Legal y Deliverability

* [ ] El enlace de baja (*unsubscribe*) está presente y funciona (Módulos 14, 17, 18).
* [ ] El email tiene una proporción razonable de texto real frente a imágenes (Módulo 18).
* [ ] Los enlaces usan dominios de confianza, no acortadores genéricos (Módulo 18).
* [ ] El email pasó un test de spam con puntaje aceptable (Módulo 18).

## 19.10 Testing Final

* [ ] El HTML fue validado sintácticamente (Módulo 14).
* [ ] Se revisaron las capturas de los clientes prioritarios de la audiencia (Módulo 14).
* [ ] Se envió una prueba real a al menos un dispositivo móvil físico (Módulo 14).
* [ ] Se volvió a validar después de subir la plantilla al ESP, no solo antes (Módulo 17).

## 19.11 Buenas Prácticas Generales de Código

* [ ] El código sigue una indentación y nomenclatura de clases consistente en todo el proyecto.
* [ ] Los comentarios condicionales están correctamente balanceados (cada `[if mso]` tiene su `[endif]` correspondiente) (Módulo 9).
* [ ] Los partials/componentes reutilizables (header, footer) están extraídos, no duplicados manualmente en cada plantilla (Módulo 16).
* [ ] El HTML final fue minificado sin eliminar los comentarios condicionales (Módulo 16).

## 19.12 Por Qué un Checklist y no Solo "Buen Criterio"

La cantidad de detalles no obvios cubiertos en este curso (VML, `mso-line-height-rule`, `role="presentation"`, la sintaxis exacta de `[if !mso]`) hace que confiar únicamente en la memoria sea poco confiable, incluso para maquetadores experimentados — un checklist recorrible sistemáticamente antes de cada envío es la práctica estándar de la industria, no una señal de inexperiencia.

## 19.13 Errores Comunes

- **Saltarse el checklist "porque el email es simple"**: incluso emails simples pueden fallar en Outlook o disparar filtros de spam por detalles que un checklist sistemático captura y la revisión visual pasa por alto.
- **Revisar el checklist solo antes del primer envío de una plantilla, y no en reenvíos posteriores con cambios menores**: un cambio aparentemente pequeño (una imagen nueva, un botón reposicionado) puede reintroducir un problema ya resuelto anteriormente.
- **Confiar en que el ESP detectará los problemas por ti**: la mayoría de ESPs no validan compatibilidad de renderizado ni accesibilidad — esa responsabilidad recae enteramente en el maquetador.
