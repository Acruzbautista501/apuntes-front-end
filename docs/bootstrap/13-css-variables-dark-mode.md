# Módulo 13: CSS Variables y Modo Oscuro Nativo

El Módulo 12 mostró cómo personalizar Bootstrap **en tiempo de compilación** con Sass. Desde la versión 5.2, Bootstrap complementa eso con un segundo sistema: cientos de variables CSS nativas (`--bs-*`), que se pueden leer y modificar **en tiempo real**, directamente en el navegador — sin recompilar nada.

## 13.1 Las Variables `--bs-*`

Casi cada valor visual de Bootstrap (colores, espaciados, radios de borde) también existe como una variable CSS nativa, expuesta en el elemento raíz o en cada componente.

```css
:root {
  --bs-primary: #0d6efd;
  --bs-border-radius: 0.375rem;
  --bs-body-bg: #ffffff;
  --bs-body-color: #212529;
}
```

Puedes leerlas y usarlas en tu propio CSS, igual que cualquier variable:

```css
.mi-tarjeta-personalizada {
  border-radius: var(--bs-border-radius-lg);
  color: var(--bs-primary);
}
```

### Sobrescribirlas en Tiempo Real (Sin Recompilar Sass)
Como son variables CSS de verdad, puedes cambiarlas con JavaScript, sin tocar Sass ni recargar la página — útil para un selector de tema en vivo:

```javascript
document.documentElement.style.setProperty('--bs-primary', '#7c3aed');
// Cada botón .btn-primary, badge, link... cambia de color al instante
```

## 13.2 `data-bs-theme`: Modo Oscuro Integrado

Desde Bootstrap 5.3, el framework trae un **sistema de modo oscuro nativo**, sin necesitar tu propio CSS de `prefers-color-scheme` ni duplicar clases.

```html
<!-- Todo el documento en modo oscuro -->
<html data-bs-theme="dark">
```

```html
<!-- O solo una sección específica, como un panel dentro de una página clara -->
<div data-bs-theme="dark" class="p-4 bg-body text-body">
  Este panel es oscuro aunque el resto del sitio sea claro.
</div>
```

Al cambiar `data-bs-theme`, Bootstrap redefine automáticamente **todas** sus variables `--bs-*` (fondo, texto, bordes, colores de componentes) para la paleta oscura — no necesitas escribir un solo selector `.dark` tú mismo.

## 13.3 Toggle de Tema Controlado por JavaScript

> **Dónde colocar el script que lee el tema guardado:** ejecútalo en el `<head>`, en un `<script>` normal (no `defer`/`module`), **antes** de que el `<body>` se pinte. Si lo dejas para el final del documento, el usuario verá primero el tema por defecto (claro) y luego un salto brusco al tema guardado — el típico "flash" de tema incorrecto (*FOUC*). El código de abajo que lee `localStorage`/`prefers-color-scheme` es justamente el que debe ir ahí; el listener del botón sí puede quedarse donde esté el resto de tu JavaScript.

```html
<button id="toggleTema" class="btn btn-outline-secondary">
  <i class="bi bi-moon-stars"></i> Cambiar tema
</button>
```

```javascript
const boton = document.getElementById('toggleTema');
const html = document.documentElement;

// Aplica el tema guardado o el preferido del sistema, al cargar la página
const temaGuardado = localStorage.getItem('tema') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
html.setAttribute('data-bs-theme', temaGuardado);

boton.addEventListener('click', () => {
  const nuevoTema = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-bs-theme', nuevoTema);
  localStorage.setItem('tema', nuevoTema);
});
```

## 13.4 Usar `bg-body` y `text-body` en Vez de Colores Fijos

Para que tus propios componentes personalizados respeten el modo oscuro automáticamente, evita `bg-white` o `text-dark` (colores fijos) y usa las clases semánticas que apuntan a las variables del tema activo:

```html
<!-- MAL: se ve mal en modo oscuro, el fondo blanco no cambia -->
<div class="bg-white text-dark p-4">Contenido</div>

<!-- BIEN: usa la variable del tema activo, cambia solo con data-bs-theme -->
<div class="bg-body text-body p-4">Contenido</div>

<!-- También existen variantes para "superficies" secundarias y terciarias -->
<div class="bg-body-secondary p-4">Panel secundario</div>
<div class="bg-body-tertiary p-4">Panel terciario (opacidad aún más sutil)</div>
```

## 13.5 Combinar `data-bs-theme` con Sass Personalizado

Si personalizaste colores en el Módulo 12, también existen sus versiones para modo oscuro. Bootstrap importa `bootstrap/scss/_variables-dark.scss` específicamente para esto — puedes redefinir cómo se ve **tu** color de marca en modo oscuro:

```scss
@import "bootstrap/scss/functions";

$primary: #7c3aed;

@import "bootstrap/scss/variables";

// Redefine cómo se ve --bs-primary específicamente en data-bs-theme="dark"
$primary-text-emphasis-dark: #c4b5fd; // Un morado más claro, para que resalte sobre fondo oscuro

@import "bootstrap/scss/variables-dark";

// El resto del framework completo, ya con tus valores de claro y oscuro incluidos
// (no importes "maps"/"mixins"/"root" por separado: bootstrap.scss ya los trae)
@import "bootstrap/scss/bootstrap";
```

## 13.6 Más Allá de Claro/Oscuro: Temas Personalizados

`data-bs-theme` no está limitado a `"light"`/`"dark"` — puedes definir tus propios nombres de tema, redefiniendo las variables `--bs-*` que quieras dentro de un selector `[data-bs-theme="..."]`:

```css
[data-bs-theme="azul-corporativo"] {
  --bs-body-bg: #0a2540;
  --bs-body-color: #e0e7ff;
  --bs-primary: #38bdf8;
}
```

```html
<div data-bs-theme="azul-corporativo" class="p-4 bg-body text-body">
  Un tercer tema, más allá de "light" y "dark"
</div>
```

## 13.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Leer un color del tema activo en tu propio CSS | `var(--bs-primary)`, `var(--bs-border-radius)` |
| Cambiar un color en tiempo real, sin recompilar | `element.style.setProperty('--bs-primary', '...')` |
| Activar modo oscuro en todo el sitio | `<html data-bs-theme="dark">` |
| Modo oscuro solo en una sección | `data-bs-theme="dark"` en cualquier contenedor |
| Un fondo/texto que se adapte automáticamente al tema | `.bg-body` / `.text-body`, nunca `.bg-white` fijo |
| Persistir la elección del usuario entre visitas | `localStorage` + revisar `prefers-color-scheme` al cargar |
