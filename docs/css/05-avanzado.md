# Módulo 5: Arquitectura, SASS y Ecosistema Profesional
El **Módulo 5** es el que define si tu proyecto será un éxito mantenible o una pesadilla de código espagueti. Aquí dejamos de escribir CSS "al azar" y empezamos a construir **sistemas de diseño escalables** utilizando metodologías profesionales y herramientas de preprocesamiento.


## 5.1 Metodología BEM (Block Element Modifier)
Escribir CSS sin una convención de nombres hace que, al crecer el proyecto, las clases choquen entre sí. **BEM** es el estándar de la industria para evitar esto.

### Teoría Explícita
* **Block (`.bloque`)**: El componente raíz (ej. `.card`).
* **Element (`__elemento`)**: Una parte interna que no tiene sentido sola (ej. `.card__button`).
* **Modifier (`--modificador`)**: Una variante de estilo (ej. `.card__button--red`).

### Código de Aplicación
```css
/* Estructura limpia y predecible */
.producto-card { } /* Bloque */
.producto-card__img { width: 100%; } /* Elemento */
.producto-card__title { font-size: 1.5rem; } /* Elemento */
.producto-card__btn { padding: 10px; } /* Elemento */
.producto-card__btn--oferta { background: red; } /* Modificador */
```

## 5.2 ITCSS: Arquitectura por Capas de Especificidad

Mientras **BEM** resuelve *cómo nombras* una clase, **ITCSS** (Inverted Triangle CSS) resuelve *en qué orden* organizas tus archivos para que la especificidad crezca de forma predecible, de principio a fin del proyecto.

### Teoría Explícita
La metodología ordena el CSS en capas, de la más genérica y de menor especificidad, a la más específica:

1.  **Settings:** Variables globales (colores, tipografía) — nada de estilos reales aún.
2.  **Tools:** Mixins y funciones (si usas SASS).
3.  **Generic:** Resets (`box-sizing: border-box`, normalize).
4.  **Elements:** Estilos para etiquetas HTML puras, sin clases (`h1`, `a`, `body`).
5.  **Objects:** Patrones de layout reutilizables y sin apariencia visual (`.o-container`, `.o-grid`).
6.  **Components:** Los componentes visuales reales de tu UI (`.c-boton`, `.c-tarjeta`) — normalmente aquí es donde vive la mayoría de tu BEM.
7.  **Utilities:** Clases de una sola responsabilidad que sobrescriben todo lo anterior (`.u-text-center`, `.u-hidden`), con `!important` si hace falta.

```text
styles/
├── 1-settings/
├── 2-tools/
├── 3-generic/
├── 4-elements/
├── 5-objects/
├── 6-components/
└── 7-utilities/
```

> **Por qué "triángulo invertido":** de la capa 1 a la 7, la **cantidad de código** disminuye (pocas variables, muchos componentes) mientras la **especificidad** aumenta (un selector de etiqueta pesa menos que una clase de utilidad). Seguir este orden al importar los archivos evita que un componente "gane" por accidente a una utilidad que debía sobrescribirlo — el mismo problema que resuelve `@layer` (Módulo 12) de forma nativa en CSS moderno.

## 5.3 SASS: El Superpoder de CSS
SASS (Syntactically Awesome Style Sheets) es un preprocesador. Escribes código con esteroides y SASS lo "traduce" a CSS normal que el navegador entiende.

### Funciones Pro de SASS:
* **Nesting (Anidamiento)**: Escribe CSS siguiendo la estructura del HTML.
* **Mixins**: Son funciones que puedes reutilizar.
* **Variables Avanzadas**: `$color-primario: #3b82f6;`.

### Código de Aplicación (SASS/SCSS)
```scss
$primario: #4f46e5;

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar {
  background: $primario;
  height: 80px;
  @include flex-center; /* Reutilizamos la función */

  &__logo { /* Se compila como .navbar__logo */
    width: 50px;
    &:hover { opacity: 0.8; }
  }
}
```

## 5.4 Arquitectura de Archivos (El patrón 7-1)
En un proyecto real, no tienes un solo archivo `style.css` de 5000 líneas. Lo divides en carpetas para que sea fácil de navegar.

### Teoría Explícita
La arquitectura típica divide el CSS en:
1.  **Base/**: Resets, tipografía global.
2.  **Components/**: Botones, inputs, tarjetas.
3.  **Layout/**: Header, footer, grid global.
4.  **Utils/**: Clases de ayuda (ej. `.text-center`).

```text
sass/
|-- base/
|-- components/
|-- layout/
|-- main.scss  <-- Aquí se importa todo
```

## 5.5 Tailwind CSS y Frameworks de Utilidad
Tailwind ha cambiado la forma de trabajar. En lugar de escribir CSS en archivos separados, aplicas clases directamente en el HTML.

### Teoría Explícita
* **Productividad**: No tienes que pensar en nombres de clases (como en BEM).
* **Consistencia**: Usas escalas predefinidas de colores y espaciados.
* **Customización**: Se configura mediante un archivo `tailwind.config.js`.

### Código de Aplicación (Simulando Tailwind en HTML)
```html
<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105">
  Comprar ahora
</button>
```

## 5.6 Optimización y Rendimiento (Performance)
El CSS pesado ralentiza la carga. Un profesional debe saber limpiar su código antes de subirlo a producción.

### Teoría Explícita
* **Minificación**: Elimina espacios y comentarios para reducir el peso del archivo.
* **Purge CSS**: Escanea tu HTML y elimina todas las reglas de CSS que **no** estás usando (vital cuando usas frameworks como Bootstrap o Tailwind).
* **Critical CSS**: Carga primero solo el CSS necesario para ver la parte de arriba de la página (Above the Fold) y el resto después.

### Herramientas del Ecosistema
* **PostCSS**: Una herramienta que añade prefijos automáticos (Autoprefixer) para que tu CSS funcione en versiones viejas de Safari o Internet Explorer.
* **Vite / Webpack**: Herramientas que automatizan todo este proceso de compilación y limpieza.

### Resumen del Módulo 5:
1.  Usa **BEM** para que tu código sea legible por otros humanos.
2.  Aprende **SASS** para no repetir código constantemente.
3.  Divide tus archivos; el orden es poder.
4.  Explora **Tailwind CSS** para prototipado rápido y consistente.
5.  **Optimiza siempre:** un sitio rápido es un sitio que retiene usuarios.
