# MÓDULO 4: Layout y Posicionamiento

Este módulo es fundamental para dejar de "adivinar" dónde se ubican los elementos en la pantalla. Aprenderás a dominar el flujo del documento y cómo sacar elementos de él para crear interfaces avanzadas como menús, modales o *badges* de notificación para *Soccer League Elite*.

## 4.1 Display

La propiedad `display` es el componente más básico del CSS. En Tailwind, estas utilidades permiten alterar la forma en que los elementos ocupan espacio en el flujo del documento sin necesidad de editar archivos CSS.

### ¿Qué es el flujo normal del documento?
Por defecto, los navegadores apilan los elementos de arriba a abajo (bloque) o de izquierda a derecha (en línea). Las utilidades `display` te permiten romper o modificar este comportamiento.

### `block` (El elemento es un "párrafo")
* **Comportamiento:** El elemento toma todo el ancho disponible del contenedor padre. Si pones dos elementos `block` seguidos, el segundo siempre aparecerá debajo del primero.
* **Uso:** Ideal para estructuras de página principales, encabezados (`h1`, `h2`), párrafos (`p`) y contenedores de secciones (`div`).
* **Nota:** Puedes definir `width` y `height` manualmente.

### `inline` (El elemento es parte del texto)
* **Comportamiento:** Solo ocupa el espacio que requiere su contenido. No puedes asignarle `width` o `height` (se ignoran). No respeta `margin-top` o `margin-bottom` de la misma manera que los bloques.
* **Uso:** Ideal para enlaces (`a`), resaltados (`span`) o textos dentro de un párrafo que necesitan un estilo especial.
* **Ejemplo:** `<span class="inline text-blue-500">Haz clic aquí</span>` en medio de una oración.

### `inline-block` (El híbrido)
* **Comportamiento:** Se comporta como `inline` (no rompe la línea y respeta el espacio de otros elementos), pero mantiene las propiedades de `block` (puedes ajustar `width`, `height`, `padding` y `margin` sin restricciones).
* **Uso:** Es el preferido para botones, etiquetas (badges) de estado de partidos o iconos que deben estar en medio de un texto.

### `hidden` (La desaparición)
* **Comportamiento:** Aplica `display: none`. El elemento no solo se vuelve invisible, sino que **deja de ocupar espacio físico** en la página. Los elementos adyacentes "llenarán" el hueco que dejó el elemento oculto.
* **Uso:** Muy usado en la lógica de tu aplicación para mostrar/ocultar paneles, menús móviles o mensajes de alerta.


### Resumen visual de comparación
Para entender mejor cómo se comportan, observa la diferencia en este esquema:

Tienes toda la razón, te pido una disculpa. Como soy una IA basada en texto, el tag `` es una instrucción para que el sistema genere o busque una representación visual. Aquí tienes la explicación conceptual detallada y el esquema visual para que comprendas la diferencia fundamental:

### Esquema Visual de Comparación: `display`

Imagina que cada elemento es una caja dentro de un documento. Así es como se comportan en el espacio:

| Propiedad | ¿Ocupa toda la línea? | ¿Permite `width`/`height`? | ¿Permite `margin`/`padding` vertical? |
| :--- | :--- | :--- | :--- |
| **`block`** | **Sí** (ocupa el 100%) | Sí | Sí |
| **`inline`** | **No** (solo lo necesario) | **No** | **No** (solo horizontal) |
| **`inline-block`**| **No** (solo lo necesario) | **Sí** | **Sí** |


### Explicación detallada del esquema

Para que no vuelvas a tener problemas de diseño en tu proyecto, visualízalo así:

1.  **`block` (El "Muro"):** Imagina un muro de ladrillos. Cada bloque (`div`, `section`) se coloca uno debajo del otro, sin importar qué tan pequeño sea su contenido. Es ideal para la **estructura** de tu página.
2.  **`inline` (El "Texto"):** Imagina las palabras en este párrafo. No puedes hacer que una palabra sea más "alta" (alto de línea) mediante `height` porque romperías la fluidez del texto. Se usa estrictamente para **estilo de contenido** (links, negritas, cursivas).
3.  **`inline-block` (El "Botón"):** Imagina un botón. Quieres que se quede en medio de un renglón de texto (`inline`), pero también quieres poder darle un tamaño fijo, un color de fondo y un espacio interno (`padding`) profesional (`block`). **Esta es la propiedad que más usarás para componentes interactivos.**


### Ejemplo Práctico: Tabla de Posiciones
En tu proyecto de *Soccer League Elite*, podrías usar estas propiedades así:

```html
<div class="block w-full p-4">
  
  <span class="inline-block px-3 py-1 bg-green-500 text-white rounded-full">
    En Vivo
  </span>

  <a href="#" class="inline text-blue-600 underline">
    Ver detalle del partido
  </a>

  <div id="panel-estadisticas" class="hidden">
    </div>
</div>
```

::: tip 💡 Consejo del Diseñador Frontend:
Si alguna vez intentas centrar algo y no funciona, o un elemento no toma el tamaño que le asignas, el 90% de las veces es porque el `display` configurado no lo permite (por ejemplo, intentar darle `width` a un elemento `inline`). ¡Verifica siempre esto primero!
:::

## 4.2 Position

La propiedad `position` es la herramienta de "control de tráfico" del CSS. Por defecto, los elementos siguen el flujo natural del documento, pero `position` te permite sacar elementos de ese flujo, fijarlos en pantalla o superponerlos con precisión quirúrgica.

### `static` (El valor por defecto)
Es el estado natural. El elemento se coloca en el orden en que aparece en el código HTML. Las propiedades `top`, `bottom`, `left` y `right` **se ignoran** completamente. Si alguna vez quieres "resetear" la posición de un elemento, esto es lo que buscas.

### `relative` (El punto de anclaje)
El elemento se posiciona respecto a su lugar original. 
* **La clave:** Al ser `relative`, te permite usar `top`, `left`, etc., para moverlo levemente sin que los demás elementos se muevan. 
* **El "Superpoder":** Es el contenedor favorito para elementos `absolute`. Si un hijo es `absolute`, se posicionará respecto al primer ancestro que sea `relative`.

### `absolute` (Fuera del flujo)
El elemento se elimina del flujo normal: es como si "flotara" por encima de los demás. Los elementos debajo de él ocupan el espacio que él dejó.
* **Uso:** Ideal para insignias (badges), iconos de cerrar en modales o imágenes superpuestas.
* **Cuidado:** Siempre debe haber un contenedor `relative` padre para evitar que el elemento se posicione respecto a todo el documento (`<body>`).

### `fixed` (Anclado al cristal)
El elemento se saca del flujo y se fija en el navegador. No importa cuánto haga scroll el usuario, el elemento permanecerá visible en la misma coordenada.
* **Uso:** Menús de navegación, botones flotantes de "Ir arriba" o chats de soporte en tu plataforma.

### `sticky` (El elemento inteligente)
Es un híbrido entre `relative` y `fixed`. El elemento fluye normalmente hasta que alcanza un umbral (ej. `top-0`). Al llegar ahí, se "pega" y se comporta como `fixed`.
* **Uso:** Encabezados de tablas de posiciones que quieres que sigan visibles mientras el usuario hace scroll hacia abajo.

### Resumen para Soccer League Elite

| Posición | Comportamiento | Ejemplo en tu App |
| :--- | :--- | :--- |
| **`relative`** | Se queda en su lugar base | El contenedor principal de una tarjeta de equipo. |
| **`absolute`** | Flota dentro del padre | El escudo o una estrella de "Campeón" sobre la foto. |
| **`fixed`** | Flota en la pantalla | El menú de navegación que siempre ves arriba. |
| **`sticky`** | Se pega al hacer scroll | El encabezado de la tabla de posiciones de la liga. |

### Ejemplo Práctico: Badge de "Top Goleador"
```html
<div class="relative w-32 h-32 bg-gray-200">
  <img src="jugador.jpg" class="w-full h-full" />
  
  <span class="absolute -top-2 -right-2 bg-yellow-500 text-black p-2 rounded-full z-10">
    #1
  </span>
</div>
```
::: tip 💡 Consejo del Diseñador Frontend:
Si usas `absolute` y el elemento aparece en cualquier lado de la pantalla menos donde quieres, es porque olvidaste poner `relative` en el elemento padre. ¡Ese es el error número 1 de los desarrolladores frontend!
:::

## 4.3 Z-Index y Contextos de Apilamiento

El `z-index` es la propiedad que define la profundidad en el eje Z (la "tercera dimensión" de tu pantalla). Imagina que tu página web es un sándwich de capas; el `z-index` decide qué capa está arriba de cuál.

### El Problema del "Contexto de Apilamiento" (Stacking Context)
Este es el error más común: creer que un `z-index: 9999` siempre irá al frente. **No es así.** Un elemento solo puede compararse con otros elementos que vivan dentro de su mismo "Contexto de Apilamiento".

* **¿Qué crea un nuevo Contexto?** Cuando a un elemento le das `position: relative`, `absolute`, `fixed` o `sticky` y además le asignas un `z-index` (distinto de `auto`), ese elemento se convierte en un "padre" de un nuevo contexto.
* **La Regla de Oro:** Si un hijo tiene `z-index: 9999` pero su padre tiene `z-index: 1`, y otro elemento (fuera de ese padre) tiene `z-index: 2`, **el hijo nunca podrá superar al elemento externo**. El padre está limitado por su propio contexto.

### La escala de Tailwind (z-index predefinido)
Tailwind no te obliga a usar números aleatorios como 999 o 1000. Utiliza una escala semántica que ayuda a organizar tu código:

* `z-0`: Fondo absoluto.
* `z-10`: Elementos básicos (textos, tarjetas).
* `z-20`: Elementos ligeramente elevados.
* `z-30`: Dropdowns o menús sencillos.
* `z-40`: Modales o *overlays*.
* `z-50`: Popovers, notificaciones tipo "toast" o *tooltips*.

### Ejemplo Práctico en Soccer League Elite
Imagina un modal que muestra los detalles de un jugador. Quieres asegurarte de que siempre esté encima de todo:

```html
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  
  <div class="bg-white p-8 rounded-lg shadow-2xl">
    <h2 class="text-xl font-bold">Detalles del Jugador</h2>
    </div>
</div>

<nav class="fixed top-0 w-full z-40 bg-white">
  </nav>
```

### ¿Cómo visualizar las capas?
Si alguna vez tienes dos elementos que deberían superponerse y no lo hacen:
1.  **Verifica el padre:** ¿Tiene algún `z-index` o `position` asignado?
2.  **Verifica la escala:** ¿Estás usando una capa superior (ej. `z-50`) contra una inferior (ej. `z-10`)?
3.  **Depuración:** En Chrome/Firefox DevTools, usa la pestaña "Layers" o "3D View" para ver cómo tu navegador está apilando físicamente los elementos.

::: tip 💡 Consejo del Diseñador Frontend:
En el desarrollo profesional de dashboards (como tu sistema de gestión), mantén una convención estricta. Usa siempre los valores de Tailwind (`z-10`, `z-20`, etc.). Nunca fuerces valores arbitrarios en el CSS a menos que sea estrictamente necesario, ya que esto crea "código espagueti" donde nadie sabe qué elemento está encima de qué.
:::

## 4.4 Overflow (Gestión del desbordamiento)

La propiedad `overflow` controla qué sucede cuando el contenido de un elemento es **más grande** que el área definida para él. En una aplicación de gestión deportiva como *Soccer League Elite*, donde manejas tablas largas de jugadores o listas de resultados, esto es vital para mantener un diseño limpio.


### Los 4 Estados de Overflow

* **`overflow-visible` (Por defecto):** El contenido se "sale" del contenedor y se dibuja encima de otros elementos. Es arriesgado si no controlas bien las dimensiones.
* **`overflow-hidden`:** El contenido que excede los límites se corta y se vuelve invisible. Es perfecto para crear recortes de imágenes en tarjetas de jugadores.
* **`overflow-scroll`:** El navegador añade barras de desplazamiento (scrollbars) siempre, incluso si el contenido cabe perfectamente. Se siente poco profesional y a veces es confuso para el usuario.
* **`overflow-auto`:** El navegador es "inteligente". Solo añade barras de scroll si es **estrictamente necesario**. Si el contenido cabe, no muestra nada. **Esta es la opción estándar para interfaces profesionales.**


### Control preciso: Ejes X e Y
Tailwind te permite ser muy específico si necesitas que un elemento solo haga scroll en una dirección (muy común en tablas de datos):

* **`overflow-x-auto`**: Crea scroll horizontal si el contenido es demasiado ancho.
* **`overflow-y-auto`**: Crea scroll vertical si el contenido es demasiado alto.

### Ejemplo Práctico: Tabla de Posiciones Responsiva
Imagina tu tabla de posiciones. En móviles, las columnas son muchas y el ancho de pantalla es poco. Si no usas `overflow`, la tabla romperá tu diseño. Con `overflow-auto`, el usuario puede deslizar la tabla con el dedo sin mover toda la página.

```html
<div class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
  <table class="w-full text-left">
    <thead>
      <tr class="bg-gray-100">
        <th class="p-2">Equipo</th>
        <th class="p-2">Pts</th>
      </tr>
    </thead>
    <tbody>
      </tbody>
  </table>
</div>
```

### Resumen Técnico: ¿Cuándo usar cada uno?

| Clase | Comportamiento | Uso en *Soccer League Elite* |
| :--- | :--- | :--- |
| `overflow-hidden` | Corta el contenido | Recortar fotos de jugadores en un círculo o cuadrado. |
| `overflow-auto` | Scroll dinámico | Tablas de posiciones, listas de comentarios. |
| `overflow-x-auto` | Scroll horizontal | Tablas con muchas columnas (ej: estadísticas detalladas). |

::: tip 💡 Consejo del Diseñador Frontend:
Si aplicas `overflow-auto` y aun así no aparece el scroll, recuerda que el contenedor **necesita una altura definida** (como `max-h-64` o `h-96`). Si el contenedor no tiene límite de altura, se estirará hasta el infinito para mostrar todo el contenido y el scroll nunca será necesario.
:::