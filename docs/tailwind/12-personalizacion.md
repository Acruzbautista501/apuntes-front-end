# MÓDULO 12 — Personalización de Tailwind (Nivel Avanzado)

Bienvenido a la verdadera potencia de **Tailwind CSS 4**. Si vienes de versiones anteriores, prepárate para un cambio de paradigma: **hemos eliminado `tailwind.config.js`**. En la versión 4, Tailwind se configura al 100% mediante CSS estándar utilizando la directiva `@theme`. Esto significa que tu configuración de diseño, tus colores y tu espaciado viven en tu archivo CSS, donde pertenecen.

## 12.1 Theme Configuration (Configuración del Tema)

En **Tailwind CSS 4**, la configuración del diseño ha sufrido una transformación radical. Hemos pasado de depender de un archivo JavaScript (`tailwind.config.js`) a utilizar **CSS estándar**. Ahora, todo tu sistema de diseño (tus *Design Tokens*) reside en tu archivo CSS mediante la directiva `@theme`.

Esta arquitectura no solo es más rápida, sino que es nativa del navegador. Cuando defines una variable en `@theme`, Tailwind la "lee" y genera automáticamente las clases de utilidad correspondientes.

### ¿Cómo funciona la "Magia" de Tailwind 4?

El motor de Tailwind 4 escanea tu bloque `@theme` y mapea las variables CSS directamente a nombres de utilidades. La convención es simple:
`--[grupo]-[nombre-de-la-utilidad]: [valor];`

| Variable CSS | Clase Generada | Propiedad CSS |
| :--- | :--- | :--- |
| `--color-brand-red: #ff0000;` | `bg-brand-red` | `background-color: #ff0000` |
| `--spacing-18: 4.5rem;` | `p-18`, `m-18`, `gap-18` | `padding`, `margin`, `gap` |
| `--font-heading: 'Inter', sans-serif;` | `font-heading` | `font-family: ...` |

### Implementación Paso a Paso

Para *Soccer League Elite*, vamos a crear un sistema de diseño profesional. Abre tu archivo CSS principal (por ejemplo, `app.css` o `theme.css`) y define el bloque `@theme`.

```css
@import "tailwindcss";

@theme {
  /* 1. Colores Personalizados */
  /* Generará: bg-soccer-green, text-soccer-green, border-soccer-green, etc. */
  --color-soccer-green: #059669; 
  --color-soccer-dark: #0f172a;
  
  /* 2. Spacing (Espaciado) */
  /* Generará: p-sidebar, m-sidebar, gap-sidebar, etc. */
  --spacing-sidebar: 16rem;
  --spacing-card-padding: 1.5rem;

  /* 3. Tipografía */
  /* Generará: font-display */
  --font-display: "Montserrat", sans-serif;
  
  /* 4. Sombras (Box Shadows) */
  /* Generará: shadow-gol */
  --shadow-gol: 0 10px 15px -3px rgba(5, 150, 105, 0.5);
}
```

### ¿Por qué esto es mejor que el método antiguo?

1.  **CSS Puro:** Si mañana decides cambiar tu color verde a azul, no necesitas recompilar un archivo JS complejo. Solo cambias el valor en tu archivo CSS y el navegador se encarga.
2.  **Autocomplete (IntelliSense):** El plugin de Tailwind en VS Code detecta estas variables CSS inmediatamente y te ofrece autocompletado en tu HTML.
3.  **No hay "Magic Strings":** Al usar variables CSS, si necesitas usar el color en un componente fuera de Tailwind, ya tienes la variable definida (`var(--color-soccer-green)`), no necesitas duplicar valores.

### Uso en el HTML

Ahora que has definido tus variables en el `@theme`, Tailwind ha creado automáticamente las clases. Úsalas tal cual lo harías con cualquier utilidad estándar de Tailwind:

```html
<aside class="w-sidebar bg-soccer-dark min-h-screen">
  
  <div class="p-card-padding">
    <h1 class="font-display text-soccer-green text-2xl">
      Soccer League Elite
    </h1>
  </div>
  
  <button class="shadow-gol bg-soccer-green text-white px-4 py-2 rounded-lg">
    Nuevo Partido
  </button>
  
</aside>
```

::: tip 💡 Consejos del Diseñador Frontend:
* **Agrupación Semántica:** No nombres tus colores por el color visual, sino por su **función**. 
    * *Mal:* `--color-light-gray: #ccc`
    * *Bien:* `--color-surface-dimmed: #ccc`
    * *Razón:* Si decides que tu gris sea ahora un tono azulado, el nombre `surface-dimmed` sigue teniendo sentido semántico, mientras que `light-gray` te obligaría a renombrar todas tus clases.
* **No te excedas:** No intentes recrear *todos* los colores del mundo. Tailwind ya incluye una paleta de colores inmensa y bien diseñada. Crea variables solo para tus **colores de marca** o valores de espaciado muy específicos de tu UI (como el ancho de tu sidebar o el padding estándar de tus tarjetas).
* **Orden de lectura:** Tailwind 4 prioriza las variables en tu CSS. Si defines una variable dentro de `@theme`, esta sobrescribirá cualquier valor por defecto de Tailwind si utilizas el mismo nombre (ej. si defines `--color-blue-600`, esa será la clase que se use).
:::

## 12.2 Extender Theme (La lógica de extensión en v4)

Si vienes de versiones anteriores de Tailwind, probablemente estés buscando el bloque `extend` dentro de un archivo `tailwind.config.js`. **¡Buenas noticias!** En **Tailwind CSS 4**, el concepto de "extender" ha cambiado radicalmente: ya no es necesario configurar nada explícitamente para "no borrar" los valores por defecto.

La arquitectura de la versión 4 es **aditiva por naturaleza**.

### ¿Por qué ya no usamos `extend`?

En Tailwind 3, si querías añadir un color nuevo, tenías que ponerlo dentro de `extend` para no sobrescribir toda la paleta de colores. Si lo ponías fuera de `extend`, Tailwind asumía que querías *reemplazar* la paleta completa.

En **Tailwind CSS 4**, esto desaparece. Al utilizar el bloque `@theme` en tu CSS, Tailwind simplemente **fusiona** tus nuevas variables con las que ya existen.

1.  **Si defines una variable nueva:** Tailwind la añade a las utilidades disponibles.
2.  **Si defines una variable que ya existe:** Tailwind la actualiza (sobrescribe).
3.  **Si NO tocas nada:** Los valores por defecto de Tailwind (colores, espaciados, fuentes) siguen ahí, vivos y funcionando.

### Código: Cómo extender con precisión

Para "extender" tu tema de *Soccer League Elite* sin perder los colores estándar de Tailwind, simplemente declara tus nuevas variables en el `@theme`.

#### Tu archivo `theme.css`
```css
@import "tailwindcss";

@theme {
  /* 1. EXTENSIÓN: Añadiendo nuevos colores sin borrar los de Tailwind */
  --color-soccer-field: #2d6a4f;
  --color-referee-yellow: #facc15;
  
  /* 2. REFERENCIA SEMÁNTICA: Puedes reutilizar colores de Tailwind */
  /* Aquí creamos un alias: 'primary' será siempre el 'blue-600' de Tailwind */
  --color-primary: var(--color-blue-600);
  
  /* 3. EXTENSIÓN DE ESPACIADO: Añadiendo medidas únicas */
  --spacing-sidebar-w: 20rem;
}
```

### Técnicas Avanzadas de Extensión

#### A. Alias Semántico (El secreto de los profesionales)
A veces, no quieres usar `bg-blue-600` en tu HTML, prefieres usar `bg-primary`. Esto hace que, si mañana decides que tu color de marca es verde, solo cambies una línea en tu CSS y todo el sitio se actualice.

```css
@theme {
  /* En lugar de usar colores específicos, usas alias de tu marca */
  --color-brand-accent: var(--color-emerald-500);
  --color-brand-surface: var(--color-slate-900);
}
```

#### B. Sobrescritura Selectiva (Cuando sí quieres cambiar un valor por defecto)
Si realmente quieres que el `blue-600` de Tailwind no sea el azul por defecto que trae la librería, sino uno específico tuyo, simplemente redefine la variable con el mismo nombre.

```css
@theme {
  /* Tailwind ya trae un --color-blue-600, al declararlo aquí, 
     lo estás "sobrescribiendo" globalmente */
  --color-blue-600: #0047AB; 
}
```

### Tabla comparativa: v3 vs v4

| Acción | Tailwind v3 (JS Config) | Tailwind v4 (CSS Theme) |
| :--- | :--- | :--- |
| **Añadir algo nuevo** | Obligatorio usar `extend` | Simplemente declararlo en `@theme` |
| **Sobrescribir** | Declarar fuera de `extend` | Sobrescribir la variable en `@theme` |
| **Referenciar valores**| Requiere `theme('colors.blue.500')` | Usar `var(--color-blue-500)` nativo |

::: tip 💡 Consejos del Diseñador Frontend:
1.  **La Regla de la Fuente Única:** No crees variables innecesarias. Si puedes usar una variable de color de Tailwind directamente, úsala. Solo crea variables nuevas cuando sea un color *específico* de tu marca (tu "color corporativo").
2.  **Modularidad:** Si tu proyecto crece mucho, no llenes tu archivo CSS principal con mil variables. Puedes crear archivos separados (ej. `colors.css`, `typography.css`) e importarlos antes del bloque de Tailwind:
    ```css
    @import "tailwindcss";
    @import "./brand-colors.css"; /* Tus variables aquí */
    ```
3.  **No le temas a los nombres:** Los nombres de las variables en CSS (CSS Custom Properties) son globales. Si usas un nombre muy genérico como `--color-main`, podrías tener colisiones. Intenta usar prefijos si el proyecto es muy grande, como `--soccer-color-main`.
:::

## 12.3 Variables CSS en Tailwind 4 (La Estrategia Semántica)

Esta es la frontera final de la personalización en Tailwind 4. Antes, Tailwind trataba los valores como estáticos (configurados al compilar). Ahora, con el soporte nativo de variables CSS en `@theme`, Tailwind permite **tematización dinámica en tiempo de ejecución**.

No solo estamos configurando colores; estamos creando un **"Contrato de Diseño"** entre tu CSS y tu HTML.

### ¿Por qué la "Estrategia Semántica"?

El error común es usar variables funcionales (`--color-blue-600: #1d4ed8`). Si decides que tu aplicación ya no es azul, tendrás que buscar y reemplazar ese nombre en todo tu código.

La **Estrategia Semántica** consiste en usar variables que describan el *propósito*, no el color:
* En lugar de `--color-blue-600`, usa `--color-brand-surface`.
* En lugar de `--color-white`, usa `--color-bg-primary`.

Si el día de mañana *Soccer League Elite* cambia su identidad visual de "Azul" a "Negro y Dorado", solo cambias el valor hexadecimal en el archivo CSS. **Tu HTML no necesita ni un solo cambio.**

### Código: Implementación Completa (Modo Oscuro Integrado)

Para implementar esto, seguiremos tres pasos fundamentales:

#### Paso 1: Definir los "Contratos" (Variables)
En tu archivo de estilos, separa los valores (los colores reales) de las variables semánticas.

```css
@import "tailwindcss";

/* Definición de los contratos semánticos */
@theme {
  --color-bg-primary: var(--bg-primary);
  --color-text-primary: var(--text-primary);
  --color-accent: var(--brand-accent);
}

/* Modo Claro: El contrato se llena con colores claros */
:root {
  --bg-primary: #ffffff;
  --text-primary: #0f172a;
  --brand-accent: #059669; /* Verde de Soccer League */
}

/* Modo Oscuro: El contrato se llena con colores oscuros */
.dark {
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
  --brand-accent: #10b981; /* Un verde más vibrante para el modo oscuro */
}
```

#### Paso 2: Uso en HTML
Ahora, tus clases en HTML son totalmente agnósticas al tema. No necesitas poner `dark:bg-gray-900`. El CSS se encarga de todo.

```html
<body class="bg-bg-primary text-text-primary transition-colors duration-300">
  
  <div class="p-8">
    <h1 class="text-accent text-3xl font-bold">Soccer League Elite</h1>
    <p>Bienvenido al dashboard. El tema cambia automáticamente.</p>
  </div>
  
</body>
```

### Beneficios de este enfoque (Arquitectura Senior)

| Característica | Beneficio para tu SaaS |
| :--- | :--- |
| **Cambio de Tema instantáneo** | Puedes cambiar todo el esquema de colores de la app con un simple `document.documentElement.classList.toggle('dark')`. |
| **Cero deuda técnica** | Tu HTML está limpio. No hay clases `dark:text-white` por todas partes. |
| **Soporte de Diseño** | Es mucho más fácil para un diseñador enviarte variables CSS que explicarte qué clases de Tailwind cambiar. |
| **Rendimiento** | Las variables CSS se procesan a nivel de motor de renderizado del navegador, evitando el costo de recompilar estilos. |

::: tip 💡 Consejos del Diseñador Frontend:
1.  **CSS `has()` y preferencias del sistema:** Puedes hacer que tu app detecte automáticamente si el usuario prefiere el modo oscuro sin necesidad de JS:
    ```css
    @media (prefers-color-scheme: dark) {
      :root:has(:not(.light)) {
        --bg-primary: #0f172a;
        --text-primary: #f8fafc;
      }
    }
    ```
    *Nota: Esta configuración hace que tu sitio sea "nativo" al OS del usuario.*

2.  **Transiciones suaves:** Nunca olvides añadir `transition-colors duration-300` al `body` o a los contenedores principales. Esto evita que el cambio de tema se sienta como un "parpadeo" y lo convierte en una transición elegante.

3.  **No sobre-variables:** No intentes convertir *todo* en una variable semántica. Usa variables para **colores de marca** y **colores de fondo/texto**. Mantén los colores de utilidad (como `red-500` para errores o `green-500` para éxitos) como están, ya que su significado es universal.
:::

## 12.4 Dark Mode (Implementación Avanzada)

En **Tailwind CSS 4**, el *Dark Mode* deja de ser una batalla de clases utilitarias (`dark:bg-black`) para convertirse en un **sistema de diseño fluido**. La forma profesional de implementarlo no es llenando tu HTML de variantes `dark:`, sino utilizando **Variables CSS Semánticas** en tu configuración `@theme`.

### El Cambio de Paradigma: De "Clases" a "Estado"

En versiones antiguas, tenías que añadir el prefijo `dark:` a cada elemento. Si se te olvidaba uno, el diseño se rompía. En Tailwind 4, definimos **Contratos de Diseño** que cambian de valor cuando la clase `.dark` está presente en el elemento `<html>` o `<body>`.

### Implementación Paso a Paso

#### 1. Definir el Contrato en tu CSS (`theme.css`)
Aquí establecemos que, independientemente de si estamos en modo claro u oscuro, la clase `bg-surface` siempre apunta a una variable (`--bg-surface`).

```css
@import "tailwindcss";

@theme {
  /* Contrato Semántico */
  --color-bg-surface: var(--bg-surface);
  --color-text-main: var(--text-main);
  --color-brand: var(--brand-color);
}

/* Modo Claro (Por defecto) */
:root {
  --bg-surface: #ffffff;
  --text-main: #0f172a;
  --brand-color: #059669; /* Verde de Soccer League */
}

/* Modo Oscuro (Se activa al añadir la clase .dark al HTML) */
.dark {
  --bg-surface: #0f172a;
  --text-main: #f8fafc;
  --brand-color: #10b981; /* Un verde más brillante para resaltar en oscuro */
}
```

#### 2. Uso en HTML (Limpio y escalable)
No necesitas `dark:text-white` ni `dark:bg-slate-900`. Al usar tus variables semánticas, el cambio es automático.

```html
<div class="bg-surface text-main p-6 transition-colors duration-300">
  <h1 class="text-brand">Soccer League Elite</h1>
  <p>Panel de administración de partidos.</p>
</div>
```

### 3. El Controlador: Lógica de Persistencia
Para que el usuario elija su tema y este se guarde (para que no vuelva a blanco al recargar la página), necesitamos un pequeño script en JavaScript. Coloca esto en el `<head>` de tu sitio para evitar el "flasheo" de colores.

```javascript
// Detectar preferencia inicial o guardar elección
const theme = localStorage.getItem('theme') || 
              (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}

// Función para alternar (usar en tu botón de Dark Mode)
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
```

### Tabla Comparativa: Estrategias de Dark Mode

| Estrategia | Tailwind v3 (Clases) | Tailwind v4 (Variables) |
| :--- | :--- | :--- |
| **Mantenimiento** | Alto (llenar todo de `dark:`) | Bajo (solo cambiar variables) |
| **Rendimiento** | Regular (muchas clases DOM) | Excelente (navegador nativo) |
| **Escalabilidad** | Difícil en proyectos SaaS grandes | Alta (sistema centralizado) |
| **Persistencia** | Requiere lógica similar | Requiere lógica similar |

::: tip 💡 Consejos del Diseñador Frontend:
1.  **Evitar el "Flicker" (Parpadeo):** Si aplicas la clase `.dark` mediante JS después de que la página carga, el usuario verá un flash blanco antes de que se vuelva oscuro. **Solución:** Pon el script de detección en el `<head>` de tu HTML antes de que cargue el `<body>`.
2.  **Transiciones:** Siempre añade `transition-colors duration-300` a tus contenedores principales. Esto suaviza la transición entre modos, haciendo que la aplicación se sienta mucho más costosa y pulida.
3.  **Contraste:** Al definir tus variables para el modo oscuro, asegúrate de que el contraste sea suficiente. Tailwind tiene una herramienta excelente llamada `color-contrast` (o simplemente usa las herramientas de inspección de Chrome/Firefox) para verificar que el texto sea legible sobre el fondo oscuro.
4.  **Imágenes:** Si tienes logos o gráficos que dependen del fondo, no uses la misma imagen. Usa una etiqueta `<picture>` o cambia el filtro CSS (`filter: invert(1) hue-rotate(180deg)`) si el diseño lo permite, aunque lo ideal es tener versiones `logo-light.svg` y `logo-dark.svg`.
:::

### Resumen Técnico

| Concepto | Tailwind 4 Syntax | Nota |
| :--- | :--- | :--- |
| **Definición** | `@theme { --color-x: val }` | Crea clases `bg-x`, `text-x`, etc. |
| **Extensión** | Automática | No requiere `extend` como en v3. |
| **Variables CSS** | `var(--mi-variable)` | Se integran directamente en el tema. |
| **Dark Mode** | `.dark { --var: val }` | CSS puro, mucho más rápido que JS. |

::: tip 💡 Consejos del Diseñador Frontend:
1.  **Mantén un archivo `theme.css`:** No mezcles tu configuración de tema con tus estilos de componentes. Crea un `theme.css` dedicado a importar el `tailwind` y definir tus variables. Esto mantendrá tu proyecto escalable.
2.  **Naming Convention:** Usa un sistema semántico para tus variables, no funcional. 
    * *Mal:* `--color-blue-dark: #000`. 
    * *Bien:* `--color-brand-surface: #000`. 
    Si mañana cambias la marca de azul a verde, no tendrás que renombrar variables en todo tu código.
3.  **Performance:** Al usar CSS variables para el modo oscuro, el navegador no tiene que recalcular todo el layout. Solo cambia el valor de la variable raíz. Esto es un nivel de optimización superior para tu SaaS.
:::
