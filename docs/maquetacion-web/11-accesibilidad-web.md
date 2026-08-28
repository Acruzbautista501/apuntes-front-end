# Módulo 11: Accesibilidad Web a Fondo (WCAG y ARIA)

El Módulo 4 ya cubrió accesibilidad de formularios. Este módulo va más amplio: las pautas WCAG que rigen la accesibilidad web como disciplina, ARIA para los casos donde el HTML semántico no alcanza, y cómo auditar sistemáticamente un sitio completo.

## 11.1 WCAG — Los Cuatro Principios (POUR)

Las *Web Content Accessibility Guidelines* organizan la accesibilidad en cuatro principios, memorizables con el acrónimo POUR:

* **Perceptible**: la información debe poder percibirse de más de una forma (texto alternativo para imágenes, subtítulos para video, suficiente contraste de color).
* **Operable**: toda la funcionalidad debe ser usable con teclado, sin límites de tiempo imposibles de extender, sin contenido que cause convulsiones (parpadeo rápido).
* **Comprensible**: el contenido y la operación de la interfaz deben ser predecibles y estar en un idioma identificable.
* **Robusto**: el contenido debe funcionar de forma confiable con tecnologías asistivas actuales y futuras (HTML válido, ARIA usado correctamente).

## 11.2 Niveles de Conformidad: A, AA, AAA

| Nivel | Alcance |
| :--- | :--- |
| A | Requisitos mínimos básicos |
| AA | El estándar de la industria — requerido legalmente en muchas jurisdicciones (ADA en EE.UU., leyes de accesibilidad de la UE) |
| AAA | El nivel más estricto, generalmente no exigido para sitios completos (algunos criterios son incompatibles entre sí a este nivel) |

**AA es el objetivo práctico estándar** para la gran mayoría de proyectos profesionales.

## 11.3 Navegación Completa con Teclado

```css
/* Nunca elimines el indicador de foco sin reemplazarlo */
/* ❌ */
*:focus { outline: none; }

/* ✅ Un indicador de foco personalizado pero visible */
*:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

Todo elemento interactivo (enlaces, botones, campos de formulario) debe ser alcanzable y operable con `Tab`/`Enter`/`Espacio`/flechas, sin necesitar el mouse — la forma más rápida de auditar esto es literalmente navegar el sitio completo sin tocar el mouse.

## 11.4 Skip Links — Saltar la Navegación Repetitiva

```html
<body>
  <a href="#contenido-principal" class="skip-link">Saltar al contenido principal</a>

  <header>
    <nav><!-- Navegación con muchos enlaces --></nav>
  </header>

  <main id="contenido-principal">
    <!-- Contenido único de la página -->
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0066cc;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0; /* Se vuelve visible solo al recibir foco por teclado */
}
```

Sin un skip link, un usuario de teclado debe tabular por **cada enlace** del menú de navegación en cada página antes de llegar al contenido principal — extremadamente tedioso en sitios con navegación extensa.

## 11.5 ARIA — Solo Cuando el HTML Semántico No Alcanza

La primera regla de ARIA es **"no uses ARIA si un elemento HTML nativo ya resuelve el mismo problema"** — un `<button>` nativo ya tiene el rol, el estado de foco y el comportamiento de teclado correctos; reconstruir eso con `<div role="button">` es más trabajo y más propenso a errores.

```html
<!-- ❌ Innecesario: reconstruye lo que <button> ya hace nativamente -->
<div role="button" tabindex="0" onclick="enviar()">Enviar</div>

<!-- ✅ El elemento nativo correcto -->
<button onclick="enviar()">Enviar</button>
```

ARIA es necesario cuando se construyen **patrones de interfaz sin equivalente HTML nativo**: pestañas personalizadas, un menú desplegable complejo, un carrusel.

```html
<div role="tablist" aria-label="Secciones del producto">
  <button role="tab" aria-selected="true" aria-controls="panel-descripcion" id="tab-descripcion">
    Descripción
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-resenas" id="tab-resenas">
    Reseñas
  </button>
</div>

<div role="tabpanel" id="panel-descripcion" aria-labelledby="tab-descripcion">
  Contenido de la descripción
</div>
<div role="tabpanel" id="panel-resenas" aria-labelledby="tab-resenas" hidden>
  Contenido de las reseñas
</div>
```

## 11.6 `aria-label` vs `aria-labelledby` vs `aria-describedby`

```html
<!-- aria-label: un texto accesible directo, cuando no hay texto visible que lo cumpla -->
<button aria-label="Cerrar modal">×</button>

<!-- aria-labelledby: referencia el id de OTRO elemento que ya contiene el texto -->
<div role="dialog" aria-labelledby="titulo-modal">
  <h2 id="titulo-modal">Confirmar eliminación</h2>
</div>

<!-- aria-describedby: agrega información ADICIONAL, sin reemplazar el label principal -->
<input type="password" aria-describedby="ayuda-password">
<p id="ayuda-password">Mínimo 8 caracteres</p>
```

## 11.7 Contenido Dinámico: `aria-live`

```html
<div aria-live="polite" class="mensaje-estado"></div>
```

Ya cubierto en profundidad en las secciones de Vue.js y React de este sitio (accesibilidad en SPAs) — el mismo principio aplica en maquetación pura: cualquier contenido que cambia dinámicamente sin que el usuario mueva el foco necesita `aria-live` para ser anunciado por un lector de pantalla.

## 11.8 Auditoría Sistemática

* **axe DevTools** (extensión de navegador): detecta automáticamente una gran cantidad de problemas comunes (contraste insuficiente, `alt` faltante, ARIA mal usado) directamente en la página real.
* **Lighthouse** (pestaña Accesibilidad): da un puntaje y una lista de problemas específicos con enlaces a la documentación correspondiente.
* **Navegación manual solo con teclado**: detecta problemas que las herramientas automatizadas no pueden — orden de tabulación ilógico, trampas de foco, contenido inalcanzable.
* **Un lector de pantalla real** (VoiceOver en macOS/iOS, NVDA en Windows, gratuito): la validación más definitiva, aunque requiere práctica para interpretar correctamente lo que se escucha.

## 11.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| El nivel de accesibilidad estándar de la industria | WCAG nivel AA |
| Un indicador de foco visible y personalizado | `:focus-visible` con `outline` |
| Evitar tabular por toda la navegación en cada página | Un skip link al inicio del `<body>` |
| Un patrón de interfaz sin equivalente HTML nativo | ARIA (roles, `aria-*`), solo cuando sea realmente necesario |
| Detectar problemas automáticamente | axe DevTools o Lighthouse |

## 11.10 Errores Comunes

- **Eliminar `outline: none` sin reemplazarlo con un indicador de foco visible**: hace la navegación por teclado prácticamente imposible de seguir visualmente.
- **Usar ARIA para reconstruir elementos que HTML nativo ya resuelve**: más código, más superficie de error, sin ningún beneficio sobre el elemento nativo correspondiente.
- **Confiar solo en herramientas automatizadas para la auditoría**: detectan una fracción de los problemas reales de accesibilidad — la navegación manual con teclado y lector de pantalla sigue siendo indispensable.
