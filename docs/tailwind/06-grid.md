# MÓDULO 6: CSS Grid con Tailwind CSS

CSS Grid es el sistema de diseño más potente disponible. A diferencia de Flexbox, que es unidimensional (fila **o** columna), Grid es **bidimensional**; te permite controlar filas y columnas simultáneamente. Es perfecto para las "rejillas" de tu aplicación: el dashboard de estadísticas, la galería de fotos de los equipos o el diseño completo de *Soccer League Elite*.

## 6.1 Grid Container

El **Grid Container** es la base de todo layout bidimensional. A diferencia de Flexbox, que se enfoca en una sola línea (o columna), Grid crea una rejilla lógica sobre la cual tú posicionas tus elementos.

### ¿Qué sucede cuando activas `grid`?
Al aplicar la clase `grid`, el elemento padre establece un nuevo contexto de diseño. A partir de este momento, todos sus hijos directos son "Grid Items".

* **Flujo automático:** Por defecto, si no defines más, Grid colocará cada hijo en una nueva fila, ocupando el 100% del ancho del contenedor (actuando similar a un bloque).
* **Control total:** La magia ocurre cuando defines la **estructura de la rejilla** (las columnas y filas).

### La anatomía de la estructura
Para que una rejilla sea útil, debes definir cuántas "vías" tendrá. Imagina una hoja de Excel: necesitas definir cuántas columnas habrá antes de empezar a escribir.

#### Definición de columnas (`grid-cols-*`)
Tailwind te permite definir columnas con números del 1 al 12. Esto divide el ancho total del contenedor en partes iguales.
* `grid-cols-2`: Crea 2 columnas de 50% cada una.
* `grid-cols-4`: Crea 4 columnas de 25% cada una.

#### Definición de filas (`grid-rows-*`)
Aunque no siempre es necesario (ya que Grid puede crear filas nuevas automáticamente según el contenido), puedes fijar una estructura rígida si lo deseas.

### Ejemplo de código: Rejilla base de Soccer League Elite
Imagina que quieres mostrar una lista de 6 equipos en tu dashboard. Usando Grid, puedes controlar exactamente cuántos equipos aparecen por fila sin importar el tamaño de la pantalla.

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="bg-blue-500 text-white p-4">Equipo A</div>
  <div class="bg-blue-500 text-white p-4">Equipo B</div>
  <div class="bg-blue-500 text-white p-4">Equipo C</div>
  <div class="bg-blue-500 text-white p-4">Equipo D</div>
  <div class="bg-blue-500 text-white p-4">Equipo E</div>
  <div class="bg-blue-500 text-white p-4">Equipo F</div>
</div>
```

### Diferencias Clave para tu toma de decisiones

| Característica | `flex` | `grid` |
| :--- | :--- | :--- |
| **Dimensión** | 1D (Fila o Columna) | 2D (Fila y Columna) |
| **Control** | Basado en el contenido | Basado en el layout (la rejilla) |
| **Ideal para...** | Componentes (botones, listas) | Estructura de página (dashboards, galerías) |

### ¿Por qué Grid es mejor para tu dashboard?
Si usas `flex` para una tabla compleja, tendrías que envolver grupos de elementos en contenedores intermedios (`div`) para crear filas. Con `grid`, simplemente defines cuántas columnas quieres y colocas los elementos. El navegador se encarga automáticamente de moverlos a la fila correcta.

::: tip 💡 Consejo del Diseñador Frontend:
El error más común al empezar con Grid es intentar "forzar" elementos con `padding` o `margin` para que se alineen. En Grid, **el elemento no controla su posición, la rejilla sí**. Si quieres que un elemento ocupe más espacio, no le cambies el ancho (`w-*`), usa la clase `col-span-*` que veremos a continuación.
:::


## 6.2 Columnas y Filas (`grid-cols-*`, `grid-rows-*`)

Si `grid` es el terreno donde construirás tu interfaz, las columnas y filas son las vigas maestras. Definen cuántos espacios horizontales y verticales tendrá tu rejilla. En Tailwind, estas clases son sumamente intuitivas y poderosas para crear layouts responsivos.

### Columnas (`grid-cols-*`)
Las columnas definen cuántos elementos caben "a lo ancho" antes de que el siguiente elemento salte a la siguiente fila.

* **Tailwind Scale:** Va desde `grid-cols-1` hasta `grid-cols-12`.
* **Flexibilidad:** Al usar `grid-cols-N`, Tailwind automáticamente divide el ancho del contenedor en `N` partes iguales.
* **Responsive:** Aquí es donde brilla el diseño moderno. Puedes definir una estructura para móviles y otra para escritorio: `grid-cols-1 md:grid-cols-3` (1 columna en móvil, 3 en pantallas medianas o mayores).

### Filas (`grid-rows-*`)
Las filas definen cuántas divisiones verticales tiene tu rejilla. 

* **¿Cuándo usarlas?**: Es menos común definir filas explícitas que columnas, ya que por defecto Grid es "inteligente": si tienes 12 elementos y una rejilla de 3 columnas, Grid creará automáticamente 4 filas (`12 / 3 = 4`). Solo usarás `grid-rows-*` cuando necesites que el layout tenga una altura fija o un número exacto de filas predefinidas.
* **Tailwind Scale:** Comúnmente `grid-rows-1` hasta `grid-rows-6` (aunque puedes extenderlo en tu configuración si lo necesitas).

### Ejemplo Práctico: Dashboard de "Soccer League Elite"
Vamos a construir la vista principal de un torneo. Usaremos **3 columnas** para escritorio y **1 sola columna** para móviles.

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  
  <div class="p-4 bg-white rounded-lg shadow">
    <h2 class="font-bold">Tabla de Posiciones</h2>
    </div>

  <div class="p-4 bg-white rounded-lg shadow">
    <h2 class="font-bold">Próximo Partido</h2>
    </div>

  <div class="p-4 bg-white rounded-lg shadow">
    <h2 class="font-bold">Tabla de Goleadores</h2>
    </div>
  
</div>
```

### Resumen Técnico para tu toma de decisiones

| Clase | Acción | Uso en tu proyecto |
| :--- | :--- | :--- |
| **`grid-cols-N`** | Define el ancho de los carriles | Layout principal del dashboard o galería de equipos. |
| **`grid-rows-N`** | Define la altura de las filas | Layouts de tipo calendario o tablas de resultados fijas. |
| **`gap-N`** | Define el canal entre celdas | Separar visualmente las tarjetas de estadísticas. |

::: tip 💡 Consejo del Diseñador Frontend:
No te compliques intentando definir las filas (`grid-rows`) a menos que sea estrictamente necesario. Deja que Grid cree las filas automáticamente basándose en la cantidad de contenido; es la forma más limpia de mantener tu código mantenible y libre de errores. ¿Cuántas columnas crees que necesitarías para mostrar los escudos de 10 equipos en una sola sección?
:::

## 6.3 Span (Control de expansión de celdas)

El `span` es el "superpoder" de CSS Grid. Mientras que `grid-cols` y `grid-rows` definen la estructura general (el esqueleto), las clases `span` permiten que elementos individuales **se expandan** para ocupar más de una celda.

Es el equivalente a la función "Combinar celdas" en Excel, pero sin romper la estructura lógica de tu página.

### `col-span-*` (Expansión Horizontal)
Permite que un elemento ocupe varias columnas hacia la derecha.
* **Escala:** `col-span-1` hasta `col-span-12`.
* **Uso:** Ideal para crear "Tarjetas Destacadas". Si tienes un grid de 3 columnas, un elemento con `col-span-3` ocupará todo el ancho disponible, creando un encabezado que resalta sobre el resto del contenido.

### `row-span-*` (Expansión Vertical)
Permite que un elemento ocupe varias filas hacia abajo.
* **Escala:** `row-span-1` hasta `row-span-6` (puedes añadir más en tu configuración si lo necesitas).
* **Uso:** Ideal para elementos que requieren más altura visual, como una imagen de un jugador o una sección de "Noticias Destacadas" que quieres que acompañe a otras dos tarjetas más pequeñas.

### Ejemplo Práctico: Dashboard de "Soccer League Elite"
Vamos a diseñar una sección donde el **partido principal** es más grande que los resultados secundarios. 

Imagina un layout de **3 columnas**:

```html
<div class="grid grid-cols-3 gap-4">
  
  <div class="col-span-2 row-span-2 bg-slate-900 text-white p-6 rounded-lg">
    <h2 class="text-2xl font-bold">Gran Final: Atlético vs Lobos</h2>
    <p>Detalles del partido principal...</p>
  </div>

  <div class="bg-white p-4 shadow rounded-lg">
    <h3 class="font-bold">Resultado 1</h3>
  </div>

  <div class="bg-white p-4 shadow rounded-lg">
    <h3 class="font-bold">Resultado 2</h3>
  </div>
  
  <div class="bg-white p-4 shadow rounded-lg">
    <h3 class="font-bold">Resultado 3</h3>
  </div>

</div>
```

### Resumen para tu toma de decisiones

| Clase | Acción | Efecto en la interfaz |
| :--- | :--- | :--- |
| **`col-span-N`** | Estira el ancho | El elemento se vuelve más ancho, empujando a los vecinos. |
| **`row-span-N`** | Estira la altura | El elemento se vuelve más alto, ocupando filas inferiores. |
| **`col-span-full`**| Ocupa todo el ancho | El elemento salta a una línea propia y ocupa el 100%. |


::: tip 💡 Consejo del Diseñador Frontend:
Al usar `span`, **no estás cambiando el tamaño del contenedor, sino la cantidad de celdas que el hijo "secuestra"**. 

* **Regla de oro:** Si tu `grid-cols-3` tiene 3 columnas, nunca pongas un `col-span-4`. Si lo haces, Grid creará una nueva columna extra o se desbordará, rompiendo el diseño que tenías planeado.
* **Tip Responsivo:** Puedes combinar esto con media queries de Tailwind:
  * `col-span-1 md:col-span-2`: En móvil ocupa 1 columna, pero en escritorio se expande a 2.
:::


## 6.4 Gap (Separación entre elementos)

El `gap` es, sin duda, la propiedad que más agradecerás al diseñar. En el pasado, para separar elementos, los desarrolladores usaban `margin` en los hijos. El problema es que el `margin` a veces causaba problemas en los bordes del contenedor (el margen "sobraba" fuera de la caja) o duplicaba espacios.

El `gap` (también llamado *gutter* o canal) soluciona esto de forma elegante: **solo inserta espacio entre las celdas**, nunca en los bordes externos de la rejilla.

### Las 3 variantes de Gap en Tailwind

Tailwind te permite controlar el espacio con precisión quirúrgica usando su escala de espaciado estándar (desde `gap-0` hasta `gap-96` o `gap-px`):

#### `gap-N` (Unificado)
Aplica la misma separación tanto para las filas como para las columnas. Es la opción estándar.
* **Uso:** Cuando buscas un diseño simétrico y limpio.

#### `gap-x-N` (Horizontal)
Aplica espacio **solo entre columnas**.
* **Uso:** Cuando tienes una tabla de posiciones donde las columnas de "Nombre" y "Puntos" deben estar separadas, pero no quieres espacio adicional entre las filas de los equipos.

#### `gap-y-N` (Vertical)
Aplica espacio **solo entre filas**.
* **Uso:** Listas de resultados donde quieres que los partidos estén separados, pero que el contenido interno de cada fila esté compacto.

### Ejemplo de código: Tarjetas de "Próximos Partidos"
Vamos a crear una rejilla donde los partidos tienen una separación constante, pero usamos `gap` para que el diseño sea fluido y profesional.

```html
<div class="grid grid-cols-2 gap-x-8 gap-y-4">
  
  <div class="bg-slate-100 p-4 rounded">Partido 1: Local vs Visita</div>
  
  <div class="bg-slate-100 p-4 rounded">Partido 2: Equipo A vs Equipo B</div>
  
  <div class="bg-slate-100 p-4 rounded">Partido 3: Equipo C vs Equipo D</div>
  
  <div class="bg-slate-100 p-4 rounded">Partido 4: Equipo E vs Equipo F</div>
  
</div>
```

### Resumen para tu toma de decisiones

| Clase | Acción | ¿Cuándo usarla? |
| :--- | :--- | :--- |
| **`gap-N`** | Espacio igual en X e Y | Diseños de tarjetas, galerías de trofeos. |
| **`gap-x-N`** | Espacio solo entre columnas | Tablas de datos, formularios en paralelo. |
| **`gap-y-N`** | Espacio solo entre filas | Listas verticales de resultados o noticias. |

### El "Pro Tip" de Colaborador: Espaciado Responsivo
Lo mejor de Tailwind es que el `gap` también puede cambiar según el tamaño de la pantalla. No es lo mismo el espacio que necesitas en un celular (donde el espacio es limitado) que en una computadora de escritorio.

```html
<div class="grid grid-cols-2 gap-2 md:gap-8">
   </div>
```

**¿Por qué es esto vital para tu App?**
Si usas `margin` para separar tus tarjetas de equipo, te encontrarás constantemente peleando con el `margin` del primer elemento (que hace que se desplace el contenedor) o el del último elemento (que deja un espacio vacío al final). Con `gap`, la rejilla gestiona el espacio **dentro** de sus límites, haciendo que tu contenedor padre siempre se ajuste perfectamente al tamaño de sus elementos.


## 6.5 Grid Auto Flow (El algoritmo de ubicación automática)

Hasta ahora hemos posicionado elementos manualmente. Pero, ¿qué pasa cuando tienes una lista dinámica de jugadores o equipos y no quieres decirle a cada uno "tú vas aquí"? Aquí es donde entra **Grid Auto Flow**.

El "Auto Placement Algorithm" (algoritmo de ubicación automática) es el cerebro de CSS Grid. Decide dónde colocar un elemento si no le has asignado una posición específica (como `col-span` o `row-start`).

### Los 3 Modos de Flujo

#### `grid-flow-row` (Por defecto)
El navegador coloca los elementos uno tras otro, rellenando la fila actual de izquierda a derecha. Si se acaba el espacio en la fila, salta a la siguiente.
* **Uso:** El 99% de las veces. Es el estándar para listas, tablas y galerías.

#### `grid-flow-col`
Cambia la lógica: el navegador intenta rellenar una sola columna hacia abajo antes de empezar una columna nueva a la derecha.
* **Uso:** Muy poco común, pero útil para carruseles de elementos o layouts que se desplazan horizontalmente.

#### `grid-flow-dense` (La magia del relleno)
Esta es la función avanzada. Por defecto, Grid respeta el orden del HTML. Si un elemento es grande (`col-span-2`) y no cabe en el hueco que dejó el anterior, Grid dejará un hueco vacío.
* **El efecto "Dense":** Con `grid-flow-dense`, Grid revisa si los elementos más pequeños que vienen *después* en el código pueden caber en ese hueco vacío. Básicamente, intenta "cerrar" todos los huecos posibles para que la rejilla se vea compacta (estilo *Masonry*).

### Ejemplo de código: Galería de tarjetas desiguales

Imagina que tienes una galería donde algunos elementos son grandes (destacados) y otros son pequeños. Sin `dense`, tendrías huecos vacíos. Con `dense`, todo se compacta.

```html
<div class="grid grid-cols-3 gap-4 grid-flow-dense">
  
  <div class="col-span-2 bg-blue-500 h-32 p-4">Destacado (Grande)</div>
  
  <div class="bg-gray-300 h-32 p-4">Elemento 1</div>
  
  <div class="bg-gray-300 h-32 p-4">Elemento 2</div>
  
  <div class="bg-gray-300 h-32 p-4">Elemento 3</div>

</div>
```

### Resumen para tu toma de decisiones

| Clase | Acción | Ideal para... |
| :--- | :--- | :--- |
| **`grid-flow-row`** | Orden secuencial | Tablas de posiciones, listas de jugadores. |
| **`grid-flow-col`** | Orden vertical | Layouts que crecen hacia la derecha. |
| **`grid-flow-dense`** | Relleno inteligente | Galerías de fotos, layouts con items de tamaños variados. |

::: tip 💡 Consejo del Diseñador Frontend:
`grid-flow-dense` es una herramienta brillante, pero úsala con precaución. Al permitir que el navegador reordene visualmente los elementos para llenar huecos, **el orden visual ya no coincidirá con el orden del código HTML**. 

* **Advertencia:** Si el orden de tus elementos es importante para la lectura lógica (por ejemplo, si los partidos de la liga deben seguir un orden cronológico), **no uses `dense`**. Mantén el orden natural (`grid-flow-row`) para que la experiencia de usuario sea predecible.
:::

### Ejemplo Maestro: Dashboard de *Soccer League Elite*
Este código crea un dashboard donde la tarjeta principal de estadísticas destaca y las demás se organizan debajo:

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="md:col-span-3 p-6 bg-slate-900 text-white">
    <h1 class="text-3xl">Torneo Apertura 2026</h1>
  </div>
  
  <div class="p-4 bg-white shadow">Jugador Top</div>
  <div class="p-4 bg-white shadow">Próximo Partido</div>
  <div class="p-4 bg-white shadow">Últimos Resultados</div>
</div>
```

### Resumen para tu toma de decisiones

| Clase | Función | Uso en *Soccer League Elite* |
| :--- | :--- | :--- |
| `grid-cols-N` | Define la estructura | Crear la rejilla de los equipos de la liga. |
| `col-span-N` | Expande elementos | Hacer que una estadística sea más importante. |
| `gap-N` | Espaciado limpio | Separar tarjetas de resultados. |
| `grid-flow-dense`| Relleno automático | Organizar fotos de jugadores de diversos tamaños. |

::: tip 💡 Consejo del Diseñador Frontend:
No intentes usar Grid para elementos lineales (como una fila de botones). Para eso sigue usando Flexbox. Usa Grid cuando tu layout requiera **ambas** dimensiones: filas y columnas. ¡Es la herramienta perfecta para la estructura general de tus páginas (los "layouts madre")!
:::
