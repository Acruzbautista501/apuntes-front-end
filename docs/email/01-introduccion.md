# Módulo 1: Introducción a la Maquetación de Email

Maquetar un email HTML parece, a primera vista, lo mismo que maquetar una página web: HTML y CSS. En la práctica es una disciplina distinta, con sus propias reglas, limitaciones y trucos — porque el "navegador" que va a renderizar tu código no es Chrome ni Firefox, sino decenas de clientes de correo con motores de renderizado radicalmente distintos entre sí.

## 1.1 Por Qué el Email es Tan Diferente a la Web

* **No hay un motor de renderizado único**: Gmail, Outlook, Apple Mail, Yahoo y decenas de clientes más interpretan el HTML/CSS de forma distinta — algunos usan motores de navegador modernos, otros usan motores propios muy limitados.
* **Outlook de escritorio no usa un motor de navegador**: desde Outlook 2007, el motor de renderizado es **Microsoft Word** — sí, el procesador de textos. Esto elimina el soporte de `float`, `position`, la mayoría de Flexbox/Grid, y muchas propiedades CSS modernas.
* **El CSS externo casi nunca funciona**: la mayoría de clientes de correo, por seguridad, eliminan `<link>` y a menudo también `<style>` en el `<head>` (Gmail es la excepción más notable que sí respeta `<style>` en ciertos contextos, pero no universalmente). El estándar de la industria es **CSS inline**, aplicado directamente en cada elemento.
* **JavaScript no funciona en absoluto**: ningún cliente de correo ejecuta JavaScript, por razones de seguridad — cualquier interactividad debe lograrse con trucos de CSS puro (como el *checkbox hack*) o simplemente no es posible.

## 1.2 El Panorama de Clientes de Correo

| Cliente | Motor de renderizado | Particularidad |
| :--- | :--- | :--- |
| Gmail (web) | Motor propio basado en Chromium | Elimina `<style>` en algunos contextos; soporta `srcset`, algo de Flexbox |
| Outlook 2007–2021 (Windows) | Microsoft Word | El más restrictivo; requiere tablas y trucos VML |
| Outlook.com / Nuevo Outlook | Motor basado en Chromium | Mucho más permisivo que el Outlook clásico |
| Apple Mail (macOS/iOS) | WebKit | El más permisivo; soporta la mayoría de CSS moderno, incluido dark mode |
| Yahoo Mail | Motor propio | Soporte intermedio |
| Clientes móviles nativos (Gmail app, Outlook app) | Varían por plataforma | A menudo distintos al webmail del mismo proveedor |

> **La regla de oro de la maquetación de email:** nunca asumas que una técnica funciona en todos lados. Todo debe probarse contra los clientes reales que tu audiencia usa (Módulo 14).

## 1.3 Herramientas del Oficio

* **Editor de código**: VS Code es suficiente; no se necesita nada especializado para empezar.
* **Un servicio de testing** (Litmus, Email on Acid — Módulo 14): renderiza tu HTML en decenas de clientes reales sin necesitar cuentas de correo en cada uno.
* **Un cliente de correo real para pruebas rápidas**: tener acceso a Gmail, Outlook y Apple Mail cubre la mayoría de los casos más comunes durante el desarrollo diario.

## 1.4 Estructura General del Flujo de Trabajo

1. Recibir el diseño (Figma/XD) del email.
2. Maquetar con HTML basado en tablas + CSS inline (Módulos 2-5).
3. Aplicar técnicas de compatibilidad para Outlook (Módulo 9).
4. Hacerlo responsivo (Módulo 8).
5. Probar en los clientes objetivo (Módulo 14).
6. Integrar con el ESP (*Email Service Provider* — Mailchimp, SendGrid, Klaviyo) y agregar personalización (Módulos 15-17).

## 1.5 Email vs Web — Comparación Directa

| Aspecto | Maquetación Web | Maquetación Email |
| :--- | :--- | :--- |
| Layout | Flexbox, Grid | Tablas HTML (con soporte parcial de Flexbox en clientes modernos) |
| CSS | Externo o en `<style>`, cualquier especificidad | Casi siempre inline, `<style>` con soporte inconsistente |
| JavaScript | Totalmente soportado | No soportado en ningún cliente |
| Consistencia entre "navegadores" | Alta (motores modernos convergen) | Baja (decenas de motores con soportes distintos) |
| Testing | Un puñado de navegadores | Decenas de combinaciones cliente/dispositivo/modo |

## 1.6 Errores Comunes al Empezar

* **Asumir que si se ve bien en el navegador, se verá bien en el email**: el navegador nunca es representativo de cómo lo renderizará Outlook o Gmail — siempre hay que probar en los clientes reales.
* **Usar Flexbox/Grid como base del layout**: funciona en clientes modernos (Apple Mail, Gmail web) pero falla por completo en Outlook de escritorio — la base del layout debe seguir siendo tablas (Módulo 5).
* **Depender de JavaScript para cualquier funcionalidad**: ningún cliente lo ejecuta; cualquier interactividad debe resolverse con CSS puro o quedar fuera del alcance del email.
