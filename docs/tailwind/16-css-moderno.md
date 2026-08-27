# MÓDULO 16 — CSS Moderno: Las Novedades Visuales de Tailwind CSS 4

Tailwind 4 no solo cambió su motor y su configuración; también empezó a exponer, como utilidades de una sola clase, características de CSS que hace unos años eran territorio exclusivo de "magos del CSS" que escribían reglas a mano. Este módulo reúne cinco novedades que no existían (o eran muy limitadas) en Tailwind 3: **transformaciones 3D**, **`@starting-style`**, la variante **`not-*`**, **subgrid** y los **gradientes avanzados**.

## 16.1 Transformaciones 3D

En v3, `rotate-*`, `scale-*` y `translate-*` solo operaban en dos dimensions (X, Y). Tailwind 4 añade un juego completo de utilidades 3D que activan la propiedad `transform-style: preserve-3d` y trabajan con `perspective`.

### Perspectiva: el punto de vista de la "cámara"

Antes de rotar algo en 3D, el contenedor padre necesita una perspectiva; si no, la rotación se ve plana.

```html
<div class="perspective-distant">
  <div class="rotate-x-45 rotate-y-12 bg-blue-600 p-8 rounded-xl text-white">
    Tarjeta con inclinación 3D
  </div>
</div>
```

| Clase | Efecto |
| :--- | :--- |
| `perspective-none` | Sin efecto de profundidad. |
| `perspective-near` | Distorsión 3D muy pronunciada (la "cámara" está cerca). |
| `perspective-distant` | Distorsión 3D sutil (la "cámara" está lejos). Ideal para UI. |

### Rotación en los tres ejes

* `rotate-x-*`: Gira el elemento sobre el eje horizontal (como si abrieras una tapa).
* `rotate-y-*`: Gira sobre el eje vertical (como una puerta o una tarjeta que se voltea).
* `rotate-z-*`: Equivale al `rotate-*` clásico (gira sobre el plano de la pantalla).

### Ejemplo Práctico: Tarjeta de Jugador con "Flip" 3D

Un patrón muy popular: al hacer hover, la tarjeta se voltea como una carta de baraja para revelar las estadísticas del jugador.

```html
<div class="group perspective-distant w-64 h-80">
  <div class="relative w-full h-full transition-transform duration-500 preserve-3d group-hover:rotate-y-180">

    <div class="absolute inset-0 backface-hidden bg-white border rounded-xl p-4 flex items-center justify-center">
      <h3 class="font-bold text-lg">Juan Pérez</h3>
    </div>

    <div class="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 text-white rounded-xl p-4">
      <p>Goles: 12</p>
      <p>Asistencias: 5</p>
    </div>

  </div>
</div>
```

`backface-hidden` es la clave: oculta la cara trasera de cada elemento mientras gira, evitando que veas el "reverso invertido" del texto.

::: tip 💡 Consejo del Diseñador Frontend:
Los efectos 3D son vistosos, pero úsalos con moderación quirúrgica: uno o dos elementos "estrella" por vista (una tarjeta destacada, un logo). Si aplicas `rotate-x` a diez elementos de una lista, la interfaz se siente inestable en lugar de premium.
:::

## 16.2 `@starting-style`: Transiciones de Entrada Sin JavaScript

Este es, probablemente, el cambio más importante para animaciones en todo CSS moderno. Antes, animar la **aparición** de un elemento (por ejemplo, cuando pasa de `display: none` a visible, como un modal o un `<dialog>`) era imposible con CSS puro: el navegador nunca "veía" el estado inicial porque el elemento no existía en el DOM renderizado un instante antes.

`@starting-style` resuelve esto: define el estado desde el cual debe *empezar* la transición cuando el elemento aparece.

### Sintaxis en Tailwind 4

Se usa como variante: `starting:*`.

```html
<div
  popover
  class="
    opacity-100 scale-100
    transition-all duration-300
    starting:opacity-0 starting:scale-95
  "
>
  Este popover ahora aparece con un fundido y un ligero zoom,
  sin una sola línea de JavaScript.
</div>
```

### Ejemplo Práctico: Modal con Entrada y Salida Suaves

```html
<dialog
  open
  class="
    backdrop:bg-black/50
    opacity-100 scale-100
    transition-all duration-300
    starting:opacity-0 starting:scale-90
    closed:opacity-0 closed:scale-90
  "
>
  <h2 class="font-bold text-xl">Confirmar Resultado</h2>
  <p>¿Deseas guardar el marcador final del partido?</p>
</dialog>
```

::: tip 💡 Consejo del Diseñador Frontend:
`@starting-style` funciona en conjunto con los elementos nativos `<dialog>` y `[popover]`, que además resuelven accesibilidad (foco, cierre con `Esc`) de forma gratuita. Prefiere estos elementos nativos sobre un `<div>` con `v-if` cuando construyas modales: obtienes animación de entrada/salida y accesibilidad sin librerías externas.
:::

## 16.3 La Variante `not-*`

Tailwind 3 no tenía forma nativa de decir "aplica este estilo solo si **no** se cumple una condición". Tailwind 4 añade la variante `not-*`, que envuelve a `:not()` de CSS.

```html
<!-- Aplica el borde solo a los inputs que NO están deshabilitados -->
<input class="not-disabled:border-blue-500 disabled:opacity-50" />

<!-- Aplica hover solo si el dispositivo SÍ soporta hover real (no táctil) -->
<button class="not-hover:opacity-90">
  Botón que no se "apaga" en móviles al no tener hover verdadero
</button>
```

### Combinándola con otras variantes: `not-last:` para separadores

Un caso de uso clásico: poner un borde entre elementos de una lista, pero nunca en el último.

```html
<ul>
  <li class="not-last:border-b py-2">Jornada 10</li>
  <li class="not-last:border-b py-2">Jornada 11</li>
  <li class="not-last:border-b py-2">Jornada 12</li>
</ul>
```

Antes de `not-*`, esto se resolvía con el selector `divide-y` (que sigue existiendo y es más idiomático para este caso concreto), pero `not-*` te da el mismo poder para **cualquier** condición, no solo posición: `not-focus:`, `not-disabled:`, `not-checked:`, `not-first:`, etc.

## 16.4 Subgrid

Cuando anidas un `grid` dentro de otro `grid`, el hijo tradicionalmente crea **su propia** rejilla independiente; sus columnas no se alinean con las del padre. `subgrid` resuelve esto: el hijo hereda las líneas de la rejilla de su padre.

### El Problema sin Subgrid

```html
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2 grid grid-cols-2 gap-4">
    <!-- Estas 2 columnas NO se alinean con las 4 columnas del padre -->
    <div>A</div>
    <div>B</div>
  </div>
  ...
</div>
```

### La Solución con `grid-cols-subgrid`

```html
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2 grid grid-cols-subgrid gap-4">
    <!-- Ahora SÍ se alinea con las columnas 1 y 2 del padre -->
    <div>A</div>
    <div>B</div>
  </div>
</div>
```

### Ejemplo Práctico: Tabla de Posiciones con Encabezado Alineado

`subgrid` es ideal para tablas de posiciones donde el encabezado y cada fila deben compartir exactamente las mismas columnas, aunque cada fila sea técnicamente un componente distinto (`TeamRow.vue`).

```html
<div class="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 font-bold border-b pb-2">
  <span>Equipo</span>
  <span>PJ</span>
  <span>PG</span>
  <span>Pts</span>
</div>

<div class="grid grid-cols-subgrid col-span-4 items-center py-2 border-b">
  <span>Águilas FC</span>
  <span>12</span>
  <span>9</span>
  <span>27</span>
</div>
```

::: tip 💡 Consejo del Diseñador Frontend:
Usa `subgrid` cuando la alineación entre un contenedor y sus hijos debe ser **matemáticamente exacta** (tablas, formularios de varias columnas con labels alineados). Para el resto de tus layouts, un `grid` normal o `flex` sigue siendo más simple y suficiente.
:::

## 16.5 Gradientes Avanzados

El Módulo 10 cubrió los gradientes lineales básicos (`bg-gradient-to-r`). Tailwind 4 amplía la familia con gradientes **cónicos**, **radiales** y control sobre el **modo de interpolación de color**.

### Gradiente Radial (`bg-radial-*`)

Expande el color desde un punto central hacia afuera. Ideal para efectos de "foco de luz" o *spotlights*.

```html
<div class="bg-radial from-yellow-300 via-orange-500 to-transparent h-64 rounded-xl"></div>
```

### Gradiente Cónico (`bg-conic-*`)

Gira el color alrededor de un punto, como las agujas de un reloj. Perfecto para gráficos circulares de progreso (por ejemplo, "porcentaje de victorias" de un equipo) sin necesidad de SVG o `<canvas>`.

```html
<div class="size-32 rounded-full bg-conic from-emerald-500 via-emerald-500 to-slate-200" style="--tw-gradient-stops: conic-gradient(from 0deg, var(--tw-gradient-stops))"></div>
```

### Modos de Interpolación de Color (`/oklch`, `/srgb`)

Por defecto, Tailwind 4 interpola los gradientes en el espacio de color **OKLCH**, lo que produce transiciones de color más vivas y perceptualmente uniformes que el clásico RGB (evita esa "zona gris apagada" que aparece en el punto medio de un gradiente rojo-a-azul en RGB). Puedes forzar el modo de interpolación explícitamente:

```html
<!-- Interpolación por defecto (OKLCH): colores más vibrantes en el punto medio -->
<div class="bg-gradient-to-r from-red-500 to-blue-500"></div>

<!-- Forzar interpolación en el espacio HSL, por ejemplo -->
<div class="bg-gradient-to-r/hsl from-red-500 to-blue-500"></div>
```

::: tip 💡 Consejo del Diseñador Frontend:
No necesitas tocar el modo de interpolación en el 95% de los casos: el valor por defecto de v4 (OKLCH) ya resuelve el problema que teníamos en v3 con gradientes "sucios" en el punto medio. Solo experimenta con `/hsl` o `/srgb` si un diseñador te entrega specs que dependen de un espacio de color específico.
:::

## Resumen del Módulo

| Novedad | Clase clave | Reemplaza / Mejora |
| :--- | :--- | :--- |
| Transformaciones 3D | `rotate-x-*`, `perspective-*` | No existía en v3 sin CSS manual. |
| Transiciones de entrada | `starting:*` | Reemplaza librerías de animación de entrada basadas en JS. |
| Negación de estado | `not-*` | No existía; antes requería CSS manual con `:not()`. |
| Alineación de grids anidados | `grid-cols-subgrid` | No existía en v3. |
| Gradientes circulares/radiales | `bg-conic-*`, `bg-radial-*` | Antes requerían SVG o `background: conic-gradient()` manual. |
