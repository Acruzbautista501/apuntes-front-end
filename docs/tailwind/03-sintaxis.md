# MÓDULO 3: Sintaxis Base de Tailwind CSS

Este módulo es el núcleo del framework. Aprender la sintaxis de Tailwind es como aprender un nuevo idioma: una vez que entiendes la estructura (la gramática), puedes construir cualquier interfaz sin escribir una sola línea de CSS manual.

## 3.1 Anatomía de una Utility Class

Para dominar Tailwind, debes entender que **toda clase utilitaria es una representación directa de una propiedad de CSS**. En lugar de escribir reglas complejas en un archivo `.css`, Tailwind te permite aplicar esas reglas directamente como etiquetas en tu HTML.

### La estructura lógica
Las clases se construyen mediante una jerarquía predecible. Imagina que es una "oración" para el navegador:

1.  **Modificador (Opcional):** Define *cuándo* aplicar el estilo (ej. `hover:`, `focus:`, `md:` para responsividad).
2.  **Propiedad:** El prefijo que indica qué aspecto de CSS estamos modificando (`text`, `bg`, `w`, `p`, `m`).
3.  **Valor:** La magnitud o variante (ej. `500`, `full`, `4`).



### Desglose paso a paso: Ejemplo `hover:bg-blue-600`
Analicemos esta clase común para un botón de tu *Soccer League Elite*:

* **`hover:`**: Es un **modificador**. Le dice a Tailwind: "Solo aplica esto cuando el puntero del mouse esté sobre el elemento".
* **`bg-`**: Es la **propiedad**. Es el alias abreviado de `background-color`.
* **`blue-600`**: Es el **valor**. Tailwind no usa el código hexadecimal `#2563eb` directamente, sino una paleta de colores con nombres y pesos (del 50 al 950) para asegurar consistencia visual.

### Convenciones de nomenclatura clave
Para ser rápido escribiendo, Tailwind utiliza abreviaturas estándar que encontrarás en toda la web:

| Abreviatura | Propiedad CSS | Ejemplos comunes |
| :--- | :--- | :--- |
| **`p` / `m`** | `padding` / `margin` | `p-4` (16px), `mt-2` (8px arriba) |
| **`text`** | `color` / `font-size` | `text-red-500`, `text-lg` |
| **`bg`** | `background-color` | `bg-white`, `bg-slate-900` |
| **`w` / `h`** | `width` / `height` | `w-full`, `h-screen`, `w-1/2` |
| **`rounded`** | `border-radius` | `rounded-md`, `rounded-full` |

### ¿Por qué esto es mejor que CSS tradicional?
Si quisieras hacer esto mismo en CSS tradicional, tendrías que crear una clase y un archivo aparte:

**CSS Tradicional (El camino largo):**
```css
.btn-primary {
  background-color: #2563eb;
  padding: 16px;
  border-radius: 8px;
}
.btn-primary:hover {
  background-color: #1d4ed8;
}
```

**Tailwind CSS (El camino eficiente):**
```html
<button class="bg-blue-600 p-4 rounded-lg hover:bg-blue-700">
  Guardar Registro
</button>
```

### La regla de oro del "Atomic CSS"
Una **Utility Class** es "atómica" porque solo modifica un aspecto. Si un elemento necesita cambiar de color, tamaño y posición, no buscas una clase que haga las tres cosas; **combinas** las clases atómicas:

* `bg-blue-500` (Solo color)
* `w-full` (Solo ancho)
* `text-center` (Solo alineación)

Al combinar `class="bg-blue-500 w-full text-center"`, estás creando un componente personalizado sin haber escrito ni una línea de CSS en un archivo externo.

## 3.2 Sistema de Espaciado (Spacing Scale)

El espaciado es la herramienta más importante para lograr interfaces con un aspecto profesional y equilibrado. Tailwind utiliza una **escala de espaciado** consistente que garantiza que tus elementos mantengan proporciones armoniosas.

### La Escala Base (La Regla del 4)
Tailwind trabaja por defecto con una escala de **4 píxeles por unidad**. 
* **Cálculo:** `número * 4 = píxeles`.
* Ejemplo: `p-2` es `2 * 4px = 8px`. `p-4` es `4 * 4px = 16px`.

Esta escala cubre desde el `0` hasta el `96` (384px), permitiendo precisión absoluta sin tener que definir valores manuales constantemente.

### Padding (`p-*`): Espacio Interno
El `padding` se aplica dentro del borde del elemento. Es fundamental para dar "aire" a los botones, tarjetas o contenedores.

* **Direccional:** Puedes controlar lados específicos o ejes.
    * `p-4`: Padding en los 4 lados.
    * `px-4`: Padding en el eje X (izquierda y derecha).
    * `py-4`: Padding en el eje Y (arriba y abajo).
    * `pt-4`, `pr-4`, `pb-4`, `pl-4`: Padding específico para top, right, bottom o left.

### Margin (`m-*`): Espacio Externo
El `margin` crea separación **fuera** del elemento. Se usa para empujar elementos entre sí.

* **La magia del auto:** `m-auto` es la forma más rápida de centrar un elemento horizontalmente (dentro de un contenedor de ancho definido).
* **Márgenes negativos:** Tailwind permite usar valores negativos anteponiendo un guion.
    * `-mt-4`: Mueve el elemento hacia arriba 16px, permitiendo "solapamientos" creativos entre elementos.

### Gap (`gap-*`): La joya de la corona
Cuando trabajas con `flex` o `grid` (que es el 90% de tus layouts en *Soccer League Elite*), **nunca uses márgenes individuales** en los elementos hijos. Usa `gap`.

```html
<div class="flex">
  <div class="mr-4">Jugador 1</div>
  <div class="mr-4">Jugador 2</div>
</div>

<div class="flex gap-4">
  <div>Jugador 1</div>
  <div>Jugador 2</div>
</div>
```

### Resumen de la escala de valores
Para que tengas una guía rápida de implementación en tu proyecto:

| Clase | Valor | Equivalencia |
| :--- | :--- | :--- |
| `p-0` | 0px | Nada |
| `p-1` | 4px | Muy pequeño |
| `p-2` | 8px | Estándar pequeño |
| `p-4` | 16px | **Base para la mayoría** |
| `p-8` | 32px | Grande |
| `p-16` | 64px | Muy grande |

### Ejemplo Práctico: Tarjeta de Partido
Imagina la estructura de un elemento de "próximo partido" en tu liga:

```html
<div class="p-4 border border-gray-200 rounded-lg">
  <div class="flex flex-col gap-2">
    <h3 class="text-xl font-bold">Atlético Naranjos vs. Lobos FC</h3>
    <p class="text-sm text-gray-500">Sábado 18:00 hrs</p>
  </div>
</div>
```

::: tip 💡 Consejo del Diseñador Frontend:
Si intentas alinear elementos y ves que el espaciado se ve "descuadrado", verifica que no estés mezclando `padding` con `margin` innecesariamente. En Tailwind, siempre prefiere `gap` para listas y `padding` para el interior de componentes.
:::

## 3.3 Tamaños (Sizing)

Para construir interfaces profesionales y consistentes en tu sistema **Soccer League Elite**, el control del tamaño es fundamental. Tailwind te ofrece un control granular tanto sobre el **ancho** (*width*) como sobre la **altura** (*height*) de cualquier elemento.


### Width (w-*) y Height (h-*)
El control de dimensiones se divide en dos enfoques principales: valores basados en la escala y valores relativos al contenedor o la pantalla.

* **Valores de escala (números):** Siguen la misma lógica que el espaciado (multiplicado por 4px).
    * `w-16` (64px), `h-32` (128px).
* **Fracciones (para layouts):** Tailwind es excelente para crear rejillas (grids) simples usando fracciones.
    * `w-1/2` (50%), `w-1/3` (33.33%), `w-full` (100%).
* **Relativos al Viewport (Pantalla):**
    * `w-screen` / `h-screen`: Ocupa el 100% del ancho o alto de la pantalla del usuario.
    * **`h-dvh` (Dynamic Viewport Height):** *Indispensable en móviles.* A diferencia de `100vh`, `dvh` se ajusta automáticamente cuando los navegadores móviles ocultan o muestran las barras de herramientas al hacer scroll.

### Min / Max Width y Height
Son herramientas de seguridad para que tus diseños no se rompan en diferentes tamaños de pantalla (ej. de celular a monitor de escritorio).

* **Max-Width (`max-w-*`):** Define el límite máximo. Es vital para que un contenedor no se estire demasiado en pantallas grandes.
    * `max-w-sm` (640px), `max-w-md` (768px), `max-w-7xl` (1280px).
* **Min-Width / Min-Height:** Asegura que un elemento siempre tenga al menos un tamaño mínimo, evitando que el contenido interno se desborde o se colapse.

### Ejemplo Práctico: El Layout del "Soccer League Elite"
Para tu sistema de gestión de liga, imagina que necesitas un contenedor que nunca supere los 1200px de ancho y que tenga una altura mínima para mostrar los partidos:

```html
<div class="w-full max-w-6xl min-h-[500px] mx-auto p-4 bg-white shadow-lg">
  
  <div class="w-full md:w-48 h-48 bg-gray-200 overflow-hidden">
    <img src="logo-equipo.png" class="w-full h-full object-cover" />
  </div>

  <div class="w-full">
    <h2 class="text-2xl font-bold">Datos del Club</h2>
  </div>
</div>
```

### Tabla de utilidades de tamaño rápido

| Clase | Propiedad CSS | Uso típico |
| :--- | :--- | :--- |
| `w-full` | `width: 100%` | Contenedores que ocupan todo el espacio |
| `h-screen` | `height: 100vh` | Secciones hero o modales |
| `max-w-prose` | `max-width: 65ch` | Ideal para leer artículos o noticias |
| `w-fit` | `width: fit-content` | Elementos que se ajustan al tamaño de su texto |


### ¿Por qué esto es mejor que el CSS tradicional?
Si usas CSS tradicional, tendrías que gestionar `@media queries` para cada tamaño de pantalla (ej. "si el ancho es mayor a 768px, pon el ancho a 50%"). Con Tailwind, basta con combinar utilidades: `w-full md:w-1/2`. Tailwind maneja el *breakpoint* por ti automáticamente.

## 3.4 Colores (Colors)

El sistema de colores de Tailwind es uno de sus puntos más fuertes. En lugar de lidiar con cientos de códigos hexadecimales dispersos, Tailwind ofrece una **paleta estandarizada y coherente** que funciona perfectamente en conjunto.

### La estructura de la paleta
Cada color en Tailwind tiene un nombre base y un peso numérico que va del **50 al 950**.
* **Ejemplo:** `bg-blue-500`.
    * `50` es el tono más claro (casi blanco).
    * `500` es el tono "estándar" (saturación media).
    * `950` es el tono más oscuro (casi negro).

¿Quieres que te ayude a definir una paleta completa de 3 colores principales para tu liga (Primario, Secundario y de Error/Alerta) para que la copies en tu CSS?


### Aplicación de Colores
Las clases de color siguen el mismo patrón de `propiedad-color-peso`:

* **Fondos (`bg-*`):** Controla el color de fondo de cualquier contenedor.
    * `bg-blue-600`: Un azul vibrante ideal para botones de acción.
    * `bg-slate-900`: Un tono oscuro perfecto para encabezados o *footers*.
* **Texto (`text-*`):** Controla el color de la fuente.
    * `text-gray-700`: Ideal para párrafos (menos contraste que el negro puro).
    * `text-white`: Para leer sobre fondos oscuros.
* **Bordes (`border-*`):** Controla el color de los bordes.
    * `border-indigo-500`: Añade un toque de marca a tus tarjetas.

### Modificadores de Opacidad
¿Necesitas un color semitransparente? No necesitas calcular el canal alfa (`rgba`). Tailwind permite añadir un modificador de opacidad directamente a la clase con una barra `/`.

* **Ejemplo:** `bg-blue-500/50` crea un fondo azul al 50% de opacidad.
* **Escala:** Funciona en incrementos de 5 (`/0`, `/5`, `/10`... `/100`).

```html
<div class="bg-blue-500/20 border border-blue-500/50 p-6 rounded-xl">
  <h2 class="text-blue-900 font-bold">Resumen de la Jornada</h2>
</div>
```

### Personalización del Tema (La forma moderna en Tailwind 4)
Para tu sistema de **Soccer League Elite**, no debes usar colores genéricos. Debes definir los colores de tu propia marca en tu CSS principal para reutilizarlos como clases (`bg-liga-primary`, `text-liga-accent`).

**En tu `src/assets/index.css`:**
```css
@import "tailwindcss";

@theme {
  --color-liga-primary: #1e3a8a; /* Azul de tu liga */
  --color-liga-accent: #f59e0b;  /* Dorado/Amarillo de detalles */
}
```

* **¿Qué logras con esto?** Tailwind generará automáticamente clases para ti:
    * `bg-liga-primary`
    * `text-liga-accent`
    * `border-liga-primary`

### Resumen para tu proyecto
Para un sistema de gestión deportiva:
1.  **Usa `slate` o `gray`** para textos y fondos de tarjetas (dan un aspecto serio y profesional).
2.  **Usa tu color `liga-primary`** para elementos interactivos (botones, enlaces).
3.  **Usa `border-opacity`** (ej: `border-slate-200/50`) para separar secciones de manera sutil sin saturar la vista con líneas demasiado marcadas.

## 3.5 Tipografía (Typography)

La tipografía es el pilar que define la "voz" y la legibilidad de tu sistema *Soccer League Elite*. En Tailwind, el control tipográfico va mucho más allá de simplemente cambiar el tamaño de letra; te permite gestionar la jerarquía visual de forma profesional.

### 1. Jerarquía de Tamaño y Peso
* **`text-*` (Tamaño):** Tailwind escala desde `text-xs` (12px) hasta `text-9xl` (128px). 
    * *Consejo:* Usa `text-base` (16px) como punto de partida para párrafos y `text-xl` o superior para títulos.
* **`font-*` (Peso):** Controla el grosor de la fuente. 
    * `font-light` (300), `font-normal` (400), `font-bold` (700), `font-black` (900).

### Control de Espaciado (Legibilidad)
Un texto bien espaciado es la diferencia entre una web amateur y una profesional.
* **`leading-*` (Altura de línea):** Define el espacio vertical entre líneas.
    * `leading-tight`: (1.25) Ideal para títulos.
    * `leading-normal`: (1.5) El estándar para párrafos.
    * `leading-loose`: (2) Para textos largos con mucha necesidad de aire.
* **`tracking-*` (Letter Spacing):** Ajusta la distancia entre caracteres.
    * `tracking-tighter` (más cerrado) hasta `tracking-widest` (muy abierto). Muy útil para títulos en mayúsculas.

---

### Alineación y Transformación
Controla cómo se muestra el texto sin tocar el contenido original.
* **`text-*` (Alineación):** `text-left`, `text-center`, `text-right`, `text-justify`.
* **Transformación:** `uppercase` (MAYÚSCULAS), `lowercase` (minúsculas), `capitalize` (Primera letra de cada palabra).

---

### Ejemplo Práctico: Componente "Noticia de Liga"
Para un sistema de noticias en tu liga, la tipografía debe guiar al usuario:

```html
<article class="p-6 bg-white shadow-sm rounded-lg">
  <h2 class="text-3xl font-black uppercase tracking-tight leading-tight text-slate-900">
    ¡Gran final del torneo!
  </h2>
  
  <p class="mt-2 text-sm font-medium text-slate-500 uppercase tracking-widest">
    Por: Admin | 15 de Abril, 2026
  </p>

  <p class="mt-4 text-base text-slate-700 leading-relaxed">
    El partido decisivo entre Atlético Naranjos y Lobos FC 
    se llevará a cabo este fin de semana en el campo principal.
  </p>
</article>
```

### Tabla de utilidades tipográficas útiles

| Clase | Propiedad CSS | Caso de uso |
| :--- | :--- | :--- |
| `font-sans` | `font-family: sans-serif` | UI moderna y limpia |
| `font-mono` | `font-family: monospace` | Estadísticas, códigos de jugador |
| `italic` | `font-style: italic` | Citas o notas adicionales |
| `underline` | `text-decoration: underline` | Enlaces dentro de párrafos |
| `truncate` | `overflow: hidden; text-overflow: ellipsis;` | Recortar nombres de equipos largos |

::: tip 💡 Consejo del Diseñador Frontend:
En proyectos de gestión de datos como *Soccer League Elite*, usa la utilidad **`font-mono`** para los números en las tablas de posiciones. Los números monoespaciados hacen que las columnas de "Goles a favor" y "Goles en contra" se alineen verticalmente de forma perfecta, facilitando la lectura de un vistazo.
:::