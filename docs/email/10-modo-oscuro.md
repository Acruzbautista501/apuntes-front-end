# Módulo 10: Modo Oscuro en Email

Cuando un usuario tiene el modo oscuro activado en su sistema o cliente de correo, muchos clientes **reinterpretan automáticamente** los colores del email — a veces con resultados desastrosos (texto oscuro sobre fondo oscuro, logos con fondo transparente que se vuelven ilegibles). Este módulo cubre cómo tomar el control de ese comportamiento.

## 10.1 Los Tres Comportamientos Posibles de un Cliente

1. **Sin soporte de modo oscuro**: el email se muestra siempre con sus colores originales, sin importar el tema del sistema (varios clientes antiguos).
2. **Inversión automática agresiva**: el cliente intenta invertir colores automáticamente para "adaptar" el email al modo oscuro, a menudo produciendo combinaciones ilegibles o antiestéticas (Outlook.com, Gmail app en ciertas versiones).
3. **Respeta `prefers-color-scheme`**: el cliente aplica el modo oscuro **solo** si el propio email lo define explícitamente vía CSS (Apple Mail, la mayoría de clientes modernos).

El objetivo de este módulo es **tomar el control explícito** para no depender del comportamiento impredecible del punto 2.

## 10.2 El Meta Tag `color-scheme`

```html
<head>
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
</head>
```

Estos dos meta tags le indican a los clientes compatibles que el email soporta **ambos** modos de forma intencional, reduciendo la probabilidad de que apliquen su propia inversión automática agresiva.

## 10.3 `@media (prefers-color-scheme: dark)` en Email

```html
<head>
  <style>
    @media (prefers-color-scheme: dark) {
      .fondo-email { background-color: #1a1a1a !important; }
      .fondo-tarjeta { background-color: #2a2a2a !important; }
      .texto-principal { color: #f4f4f4 !important; }
      .texto-secundario { color: #b0b0b0 !important; }
    }
  </style>
</head>

<td class="fondo-email" style="background-color:#ffffff;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td class="fondo-tarjeta texto-principal" style="background-color:#f9f9f9; color:#333333; padding:20px;">
        Este texto se adapta automáticamente al modo oscuro del sistema
      </td>
    </tr>
  </table>
</td>
```

El patrón es idéntico al de Módulo 8 (media queries responsivas): el estilo inline define el modo claro por defecto, y la regla en `<style>` con `!important` lo sobrescribe cuando el sistema está en modo oscuro.

## 10.4 El Problema de los Logos y Transparencias

Un logo con texto oscuro sobre fondo **transparente** (PNG) se vuelve invisible en modo oscuro, porque el fondo oscuro del email queda detrás de un texto que también es oscuro.

```html
<!-- ❌ Logo con texto oscuro, invisible en modo oscuro sobre fondo transparente -->
<img src="logo-oscuro.png" alt="Nombre de la Marca">

<!-- ✅ Alternativa: un logo con fondo blanco sólido siempre visible -->
<img src="logo-sobre-blanco.png" alt="Nombre de la Marca">
```

Para logos que deben verse bien en ambos modos, las opciones son: diseñar el logo con un fondo blanco sólido (nunca transparente), o servir dos versiones distintas del logo alternadas por CSS (10.5).

## 10.5 Alternar Imágenes según el Modo

```html
<head>
  <style>
    .logo-claro { display: block; }
    .logo-oscuro { display: none; }

    @media (prefers-color-scheme: dark) {
      .logo-claro { display: none !important; }
      .logo-oscuro { display: block !important; }
    }
  </style>
</head>

<img src="logo-claro.png" class="logo-claro" alt="Nombre de la Marca" style="display:block;">
<img src="logo-oscuro.png" class="logo-oscuro" alt="Nombre de la Marca" style="display:none;">
```

> **Soporte limitado:** esta técnica solo funciona en clientes que respetan `prefers-color-scheme` correctamente (10.1, punto 3) — en clientes con inversión automática agresiva, el resultado puede seguir siendo impredecible, sin importar cuánto se intente controlar.

## 10.6 Bordes y Sombras Sutiles para Separar Secciones en Modo Oscuro

En modo claro, una tarjeta blanca sobre un fondo gris claro se distingue por el contraste de color. En modo oscuro, si ambos fondos se oscurecen de forma similar, esa distinción visual puede perderse — un borde sutil ayuda a mantener la jerarquía visual en ambos modos.

```html
<td style="background-color:#f9f9f9; border:1px solid #e0e0e0;" class="fondo-tarjeta">
```

```html
<style>
  @media (prefers-color-scheme: dark) {
    .fondo-tarjeta { border-color: #3a3a3a !important; }
  }
</style>
```

## 10.7 Probar el Modo Oscuro

Cambiar el modo del sistema operativo y volver a abrir el cliente de correo es la única forma confiable de validar — herramientas de testing dedicadas (Módulo 14) suelen incluir capturas específicas en modo oscuro para los clientes principales, evitando tener que alternar el modo manualmente en cada dispositivo.

## 10.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Indicar que el email soporta ambos modos intencionalmente | `<meta name="color-scheme" content="light dark">` |
| Adaptar colores de fondo/texto según el modo | `@media (prefers-color-scheme: dark)` + `!important` |
| Un logo visible en ambos modos | Fondo blanco sólido en el diseño del logo, nunca transparente |
| Alternar completamente entre dos imágenes por modo | Clases `.logo-claro`/`.logo-oscuro` con `display` alternado |

## 10.9 Errores Comunes

- **No probar el email en modo oscuro antes de enviarlo**: la inversión automática de algunos clientes puede volver ilegible texto que se veía perfectamente bien en modo claro.
- **Logos con fondo transparente y texto oscuro**: se vuelven invisibles cuando el fondo del email se oscurece automáticamente.
- **Asumir que `prefers-color-scheme` funciona igual en todos los clientes**: el soporte varía enormemente (10.1) — siempre valida el resultado real en los clientes objetivo de la audiencia.
