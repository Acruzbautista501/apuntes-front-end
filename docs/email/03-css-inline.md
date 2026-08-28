# Módulo 3: CSS en Email — Qué Funciona y Qué No

El principio más importante de toda la maquetación de email: **el CSS inline es el único método verdaderamente confiable**. Este módulo explica por qué, qué propiedades evitar, y cómo automatizar el proceso para no escribir estilos repetidos a mano en cada elemento.

## 3.1 Por Qué CSS Inline y no `<style>`

```html
<!-- ❌ Poco confiable: muchos clientes eliminan el <style> del <head> -->
<style>
  .titulo { color: #333333; font-size: 24px; }
</style>
<h1 class="titulo">Bienvenida</h1>

<!-- ✅ Confiable en prácticamente todos los clientes -->
<h1 style="color:#333333; font-size:24px; margin:0;">Bienvenida</h1>
```

Gmail, en particular, elimina las etiquetas `<style>` colocadas fuera de ciertas ubicaciones específicas del `<head>`, y algunos clientes móviles hacen lo mismo. El CSS inline, en cambio, viaja pegado a cada elemento y sobrevive incluso a los filtros de seguridad más agresivos.

## 3.2 Dónde SÍ es Seguro Usar `<style>`

`<style>` en el `<head>` sí es útil (y necesario) para dos casos específicos que no pueden expresarse de forma inline:

1. **Media queries** (Módulo 8) — el CSS inline no admite `@media`.
2. **Estados como `:hover`** — el CSS inline no admite pseudo-clases.

```html
<head>
  <style>
    @media screen and (max-width: 600px) {
      .contenedor { width: 100% !important; }
    }
    .boton:hover { background-color: #005fa3 !important; }
  </style>
</head>
```

La estrategia estándar de la industria: **estilos base siempre inline** (garantiza la visualización correcta en todos lados) + **`<style>` solo para lo que el inline no puede lograr** (mejora progresiva en los clientes que sí lo soportan).

## 3.3 Propiedades CSS que NO Debes Usar

| Propiedad/técnica | Por qué evitarla |
| :--- | :--- |
| `position: absolute/fixed` | Sin soporte en Outlook (motor Word); comportamiento errático en otros clientes |
| `float` | Sin soporte confiable en Outlook |
| Flexbox y Grid | Soporte parcial solo en clientes modernos (Apple Mail, Gmail); Outlook los ignora por completo |
| `margin` negativo | Comportamiento inconsistente entre clientes |
| Selectores complejos (`>`, `~`, `:nth-child`) | Sin soporte fuera de un `<style>` con soporte limitado |
| `background-image` en `<div>` | Outlook de escritorio requiere VML en su lugar (Módulo 6) |

## 3.4 Propiedades CSS Confiables

| Propiedad | Soporte |
| :--- | :--- |
| `color`, `background-color` | Universal |
| `font-family`, `font-size`, `font-weight`, `line-height` | Universal (con matices de fuentes, Módulo 4) |
| `padding` en `<td>` | Universal (evitar `padding` en `<table>`/`<div>` en Outlook) |
| `border` | Universal |
| `text-align` | Universal |
| `width`/`height` en tablas e imágenes | Universal (mejor como atributos HTML además de CSS) |

## 3.5 El Doble Estándar: Atributos HTML + CSS Inline

Por la inconsistencia de soporte CSS, la práctica estándar es declarar propiedades críticas **dos veces**: como atributo HTML (el respaldo más compatible) y como CSS inline (el más preciso).

```html
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; border-collapse:collapse;">
  <tr>
    <td width="300" style="width:300px; padding:20px;">
      Columna
    </td>
  </tr>
</table>
```

## 3.6 Automatizar el CSS Inline con un Inliner

Escribir CSS inline a mano en cada elemento, para un email complejo, es tedioso y propenso a errores. El flujo de trabajo estándar: escribir el email con CSS normal en un `<style>` durante el desarrollo, y usar una herramienta que **convierte automáticamente** ese CSS a estilos inline antes de enviarlo.

```bash
npm install -g premailer
premailer entrada.html > salida-final.html
```

```javascript
// Alternativa como parte de un build con Node.js
import { juice } from 'juice'
import fs from 'fs'

const html = fs.readFileSync('entrada.html', 'utf-8')
const resultado = juice(html)
fs.writeFileSync('salida-final.html', resultado)
```

Este paso se automatiza como parte del proceso de build (retomado con MJML en el Módulo 11, y con herramientas de build dedicadas en el Módulo 16).

## 3.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Estilos que deben funcionar en todos los clientes | CSS inline en cada elemento |
| Media queries o `:hover` | `<style>` en el `<head>` (mejora progresiva) |
| Ancho/alto confiable en tablas e imágenes | Atributo HTML + CSS inline juntos |
| Evitar escribir CSS inline a mano | Un *inliner* automático (Premailer, `juice`) en el flujo de build |

## 3.8 Errores Comunes

* **Depender solo de clases CSS en un `<style>`**: funciona en el navegador del desarrollador, pero falla en Outlook y en varios clientes móviles que eliminan o ignoran esas reglas.
* **Usar `float`/Flexbox como base del layout "porque funciona en Gmail"**: el email debe funcionar en Outlook también — construir sobre tablas y usar mejoras progresivas de Flexbox solo donde sea seguro (Módulo 5).
* **Escribir CSS inline manualmente en emails grandes**: es lento y propenso a errores de copiar/pegar — automatiza este paso con un *inliner* desde el principio del flujo de trabajo.
