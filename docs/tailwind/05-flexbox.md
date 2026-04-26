# MÓDULO 5: Flexbox con Tailwind CSS

Flexbox es el motor de diseño más importante en el desarrollo frontend moderno. Permite alinear, distribuir y reorganizar elementos dentro de un contenedor de manera fluida y responsiva. En *Soccer League Elite*, lo usarás para todo: desde las filas de la tabla de posiciones hasta la cabecera de los perfiles de los jugadores.

## 5.1 Flex Container (Profundización)

Para que Flexbox funcione, primero debes definir un "contenedor" que dicte las reglas de juego para sus hijos inmediatos. En Tailwind, esto es tan sencillo como aplicar una clase al elemento padre.

### El concepto de "Flex Context"
Cuando aplicas `flex` o `inline-flex` a un elemento, automáticamente conviertes a todos sus **hijos directos** en "Flex Items". Los nietos o elementos más profundos no se ven afectados por este contenedor; mantienen su comportamiento normal a menos que tú decidas convertirlos en contenedores Flex también.

### `flex` (El estándar)
Es el equivalente a `display: flex`. El contenedor se comporta como un bloque (`block`) y ocupa el **100% del ancho disponible**.

* **Uso:** Es lo que usarás el 95% de las veces. Es ideal para construir secciones enteras, barras de navegación, tablas y layouts de tarjetas donde quieres que el contenedor ocupe todo el espacio horizontal.

```html
<div class="flex bg-gray-100 p-4">
  <div class="bg-blue-500 text-white p-2">Item 1</div>
  <div class="bg-blue-500 text-white p-2">Item 2</div>
</div>
```

### `inline-flex` (El híbrido de texto)
Es el equivalente a `display: inline-flex`. El contenedor se comporta como un elemento en línea (`inline`). Esto significa que **solo ocupa el ancho de su contenido** y permite que otros elementos se sitúen a su izquierda o derecha.

* **Uso:** Es perfecto cuando quieres alinear iconos o etiquetas junto a texto dentro de una misma línea sin romper el flujo del párrafo.

```html
<p>
  El estado del partido es: 
  <span class="inline-flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded">
    <span class="w-2 h-2 rounded-full bg-green-500"></span>
    En Vivo
  </span>
  ¡Sigue la transmisión!
</p>
```

### Diferencias Clave para tu toma de decisiones

| Característica | `flex` | `inline-flex` |
| :--- | :--- | :--- |
| **Comportamiento en página** | Ocupa toda la línea (bloque) | Se ajusta al contenido (inline) |
| **¿Permite vecinos a los lados?** | No | Sí |
| **¿Controla alineación Flex?** | Sí | Sí |
| **Uso principal en Soccer League Elite** | Estructura de filas/columnas | Etiquetas, botones, estados de texto |

### ¿Por qué esto es vital para *Soccer League Elite*?
Si estás diseñando la **cabecera de un equipo** donde quieres el logo a la izquierda y el nombre a la derecha en la misma línea, usarás `flex`. Pero si dentro del nombre del equipo quieres poner un pequeño icono de "verificado" o "campeón" justo al lado del texto sin que se baje a la siguiente línea, `inline-flex` es tu mejor aliado.

::: tip 💡 Consejo del Diseñador Frontend:
Si alguna vez aplicas `flex` a un contenedor y los elementos se ven "aplastados" o no toman el tamaño que esperas, recuerda que Flexbox intenta por defecto poner todo en una sola línea. Si el contenido es demasiado largo, los elementos se ajustarán (se encogerán) a menos que uses clases como `flex-wrap` para permitir que salten a una nueva línea.
:::

## 5.2 Dirección (Flex-Direction)

La propiedad `flex-direction` es el "mapa" de tu contenedor. Define en qué dirección se organizan los elementos (el **eje principal**). Si dominas esto, controlas el diseño de toda tu aplicación, desde una simple tarjeta de jugador hasta el dashboard de tu liga.

### Los 4 modos de dirección

####  `flex-row` (Horizontal - El estándar)
Es el valor por defecto. Los elementos se colocan uno tras otro, de izquierda a derecha.
* **Uso:** Barras de navegación, filas de una tabla de posiciones, botones lado a lado.

#### `flex-col` (Vertical - La base responsiva)
Los elementos se apilan uno debajo del otro, de arriba hacia abajo.
* **Uso:** Es el estándar en **diseño móvil**. Cuando tu pantalla es estrecha, conviertes tus filas en columnas para que todo encaje verticalmente.

#### `flex-row-reverse` (Horizontal invertido)
Los elementos se organizan de derecha a izquierda.
* **Uso:** Casos de diseño específicos, como alinear botones de "Guardar" y "Cancelar" donde quieres que el botón principal aparezca visualmente a la derecha pero el orden del DOM se mantenga lógico.

#### `flex-col-reverse` (Vertical invertido)
Los elementos se apilan de abajo hacia arriba.
* **Uso:** Chats o logs de partidos donde el último evento (ej. un gol) debe aparecer al final visualmente, pero se agrega al final del código.


### Ejemplo de código: Sistema Responsivo de Liga
En *Soccer League Elite*, tus tarjetas de equipo deben cambiar de orientación según el tamaño de pantalla:

```html
<div class="flex flex-col md:flex-row gap-4 p-4">
  <div class="p-4 bg-blue-100">Logo del Equipo</div>
  <div class="p-4 bg-blue-200">Datos del Equipo</div>
  <div class="p-4 bg-blue-300">Estadísticas</div>
</div>
```

### Diferencias Clave para tu toma de decisiones

| Dirección | Eje Principal | ¿Cómo se alinean los hijos? |
| :--- | :--- | :--- |
| **`flex-row`** | Horizontal | Izquierda a derecha |
| **`flex-col`** | Vertical | Arriba a abajo |
| **`flex-row-reverse`**| Horizontal | Derecha a izquierda |
| **`flex-col-reverse`**| Vertical | Abajo a arriba |

### ¿Por qué esto es vital para *Soccer League Elite*?
Imagínate la tarjeta de un partido:
* En una **pantalla de escritorio**, quieres mostrar: `[Escudo Local] [Marcador] [Escudo Visitante]` (`flex-row`).
* En un **celular**, quieres: `[Escudo Local vs Visitante]` arriba y el `[Marcador]` debajo (`flex-col`). 
Con Tailwind, basta con escribir `flex flex-col md:flex-row` para lograr esta adaptabilidad instantánea.

::: tip 💡 Consejo del Diseñador Frontend:
Ten cuidado con los valores `-reverse`. Aunque visualmente funcionan, pueden confundir a los usuarios que usan lectores de pantalla, ya que el orden visual no coincidirá con el orden de tabulación del teclado. Úsalos solo cuando la estética lo justifique plenamente.
:::

## 5.3 Justify Content (Alineación en el Eje Principal)
La propiedad `justify-content` define cómo se distribuyen los elementos y el espacio sobrante a lo largo del **eje principal** del contenedor. Si tu dirección es `flex-row`, controlas la alineación horizontal; si es `flex-col`, controlas la vertical.

En tu sistema **Soccer League Elite**, esta propiedad es la que determina si un botón se queda pegado a la derecha, si el marcador del partido queda centrado o si los elementos del menú se reparten equitativamente.

### Los Modos de Distribución

#### `justify-start` (Al inicio)
Es el valor por defecto. Los elementos se amontonan al principio del eje. 
* **Uso:** Listas de jugadores o una hilera de etiquetas donde quieres que todo empiece desde la izquierda.

#### `justify-center` (Al centro)
Agrupa todos los elementos en el medio del contenedor.
* **Uso:** El marcador de un partido (`2 - 1`) o el logo de la liga en el encabezado.

#### `justify-end` (Al final)
Empuja todos los elementos hacia el final del eje.
* **Uso:** Alineación de botones de "Cerrar sesión" o acciones secundarias a la derecha de la pantalla.

#### `justify-between` (Espacio entre elementos)
El primer elemento va al inicio, el último al final, y los del medio se reparten el espacio. **Es la clase más usada en layouts profesionales.**
* **Uso:** Cabeceras de tarjetas: `[Nombre del Equipo] ........... [Puntos]`.

#### `justify-around` y `justify-evenly` (Espacio equitativo)
* **`around`**: Añade espacio igual a ambos lados de cada elemento (el espacio entre elementos es el doble que el de los bordes).
* **`evenly`**: Asegura que el espacio entre elementos y los bordes sea exactamente el mismo.
* **Uso:** Mostrar los patrocinadores de la liga en el footer de forma armoniosa.

### Ejemplo de código: La Cabecera del Partido
Este es un ejemplo real de cómo alinearías los elementos de un enfrentamiento en tu app:

```html
<div class="flex justify-between items-center p-4 bg-slate-900 text-white rounded-t-lg">
  
  <div class="flex items-center gap-2">
    <div class="w-8 h-8 bg-white rounded-full"></div>
    <span>Local FC</span>
  </div>

  <div class="text-2xl font-black">
    2 - 0
  </div>

  <div class="flex items-center gap-2">
    <span>Visita CF</span>
    <div class="w-8 h-8 bg-white rounded-full"></div>
  </div>
  
</div>
```

### Resumen para tu toma de decisiones

| Clase | Efecto Visual | Ideal para... |
| :--- | :--- | :--- |
| **`justify-center`** | Todo al centro | Marcadores, modales de confirmación. |
| **`justify-between`** | Extremos ocupados | Barra de navegación (Logo vs Menú). |
| **`justify-end`** | Todo a la derecha | Botones de formulario (Guardar/Cancelar). |
| **`justify-evenly`** | Distribución perfecta | Galería de trofeos o patrocinadores. |

::: tip 💡 Consejo del Diseñador Frontend:
Si usas `justify-between` y solo tienes un elemento, se quedará a la izquierda. Si tienes dos, uno a cada lado. Si necesitas que un elemento específico se "empuje" al final mientras los otros se quedan al inicio, también puedes usar la clase `ml-auto` (margen izquierdo automático) en el último elemento.
:::

## 5.4 Align Items (Alineación en el Eje Cruzado)
Mientras que `justify-content` controla el eje principal (donde "fluyen" los elementos), `align-items` controla el **eje cruzado** (la dirección perpendicular). Si tienes una fila (`flex-row`), `align-items` controla la altura vertical. Si tienes una columna (`flex-col`), controla la anchura horizontal.

### Los Modos de Alineación

#### `items-stretch` (Por defecto)
Los elementos se estiran para ocupar toda la altura del contenedor. Si un elemento no tiene un `height` definido, crecerá automáticamente hasta igualar al elemento más alto de la fila.
* **Uso:** Tablas donde quieres que el fondo gris de la fila cubra toda la altura disponible.

#### `items-start`
Alinea todos los elementos al borde superior del contenedor.
* **Uso:** Cuando tienes un título (grande) y un botón (pequeño) y quieres que el botón se mantenga alineado con la parte superior del texto en lugar de centrarse.

#### `items-center` (El más usado)
Centra los elementos verticalmente dentro del contenedor.
* **Uso:** Es la forma más profesional de alinear iconos junto a texto o fotos de perfil con nombres de usuario.

#### `items-end`
Alinea los elementos al borde inferior del contenedor.
* **Uso:** Elementos de pie de página o acciones que deben alinearse con la base de un contenedor grande.

### Ejemplo de código: Perfil de Jugador con Iconos
En tu proyecto, necesitarás esto para que el texto de la posición del jugador esté perfectamente centrado junto al icono:

```html
<div class="flex items-center gap-2 h-16 p-4 bg-white border rounded-lg">
  
  <div class="w-8 h-8 bg-blue-500 rounded-full"></div>
  
  <div class="flex flex-col">
    <span class="font-bold">Diego L.</span>
    <span class="text-xs text-gray-500">Delantero Centro</span>
  </div>

  <button class="ml-auto px-3 py-1 bg-gray-200 rounded">
    Editar
  </button>
  
</div>
```

### Resumen para tu toma de decisiones

| Clase | Efecto Visual | Ideal para... |
| :--- | :--- | :--- |
| **`items-center`** | Centro vertical | Botones con iconos, logos con texto. |
| **`items-start`** | Arriba | Listas de tarjetas con alturas variables. |
| **`items-end`** | Abajo | Alinear etiquetas de fecha al final de una tarjeta. |
| **`items-stretch`**| Estirado | Crear filas de tabla uniformes. |

::: tip 💡 Consejo del Diseñador Frontend:
El error más común al usar `items-center` es olvidar que el contenedor **necesita tener una altura mayor a la de los hijos**. Si tu contenedor (`div`) mide lo mismo que los iconos, no verás ninguna diferencia visual. Asegúrate siempre de que tu contenedor tenga una altura (`h-*` o `padding`) suficiente para que el centrado sea perceptible.
:::

## 5.5 Flex Grow, Shrink y Basis (Control de Tamaño Avanzado)

Si `justify-content` y `align-items` controlan la **posición** de los elementos, `grow`, `shrink` y `basis` controlan el **tamaño y la flexibilidad** individual de cada elemento. Esto es lo que permite que un diseño sea realmente responsivo.

---

### `flex-basis` (El tamaño inicial)
Define el tamaño base de un elemento antes de calcular cuánto espacio sobrante hay. Es como decirle: "Empieza midiendo esto".
* **Clases:** `basis-1/4` (25%), `basis-full` (100%), `basis-auto` (tamaño natural del contenido).

### `flex-grow` (El superpoder de expansión)
Define cuánto espacio "extra" puede ocupar un elemento.
* **`grow` (1)**: El elemento tomará todo el espacio sobrante disponible en el contenedor.
* **`grow-0` (0)**: El elemento mantendrá su tamaño original, aunque sobre espacio.
* **Uso:** Fundamental para que el "Nombre del Jugador" o el "Título de la Noticia" ocupe todo el ancho disponible mientras los iconos se quedan fijos.

### `flex-shrink` (El superpoder de contracción)
Define si un elemento puede hacerse más pequeño para evitar que se salga del contenedor.
* **`shrink` (1)**: El elemento se encogerá si el contenedor es demasiado pequeño.
* **`shrink-0` (0)**: El elemento **se niega a encogerse**. Se mantendrá en su tamaño original, incluso si eso rompe el layout o fuerza un scroll.
* **Uso:** Indispensable para los botones o fotos de perfil que quieres que mantengan su forma pase lo que pase.

### Ejemplo de código: Tarjeta con ancho dinámico
Imagina una fila de estadísticas donde la barra de progreso debe crecer, pero el icono debe ser rígido:

```html
<div class="flex items-center gap-4 w-full">
  
  <div class="shrink-0 w-10 h-10 bg-blue-500 rounded-full"></div>
  
  <div class="grow h-4 bg-gray-200 rounded-full">
    <div class="h-full bg-blue-600" style="width: 70%"></div>
  </div>
  
  <span class="shrink-0 font-bold">70%</span>
  
</div>
```

### Resumen para tu toma de decisiones

| Clase | Propiedad CSS | Acción |
| :--- | :--- | :--- |
| **`grow`** | `flex-grow: 1` | Crece para ocupar el espacio vacío. |
| **`grow-0`** | `flex-grow: 0` | Mantiene el tamaño original. |
| **`shrink-0`** | `flex-shrink: 0` | **No se encoge nunca.** |
| **`basis-1/2`** | `flex-basis: 50%` | Establece un punto de partida del 50%. |


::: tip 💡 Consejo del Diseñador Frontend:
La combinación **`flex-grow`** y **`flex-shrink-0`** es la técnica maestra en UI moderna.
* Aplica `grow` a los elementos que tienen texto que puede variar de longitud.
* Aplica `shrink-0` a los iconos, botones o escudos que tienen un tamaño exacto que quieres preservar.

Esta combinación garantiza que, sin importar cuánto texto tenga un jugador, la estructura de tu tabla nunca se deformará ni se romperá.
:::
