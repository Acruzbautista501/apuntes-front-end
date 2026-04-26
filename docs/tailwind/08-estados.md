# MÓDULO 8: Estados y Variantes

Las "Variantes" en Tailwind son la forma en que aplicamos estilos basados en el **estado** de un elemento (interacción) o su relación con otros elementos en el DOM. Esto es lo que convierte una interfaz estática en una experiencia dinámica y profesional para *Soccer League Elite*.

## 8.1 Hover (`hover:*`)

El estado `hover` es la forma más directa de comunicación entre tu aplicación y el usuario. Es el feedback visual que ocurre cuando el cursor del ratón (o puntero) se sitúa sobre un elemento. En *Soccer League Elite* o cualquier dashboard, es lo que permite al usuario entender qué elementos son interactivos y cuáles son estáticos.

### ¿Cómo funciona la variante `hover:`?

En Tailwind, `hover:` es un **prefijo**. Cuando lo añades a cualquier clase de utilidad, le dices al navegador: *"No apliques este estilo de inmediato. Aplícalo solo cuando el usuario tenga el ratón encima de este elemento"*.

#### Anatomía básica:
`hover:[clase-que-quieres-activar]`

* **Si quieres cambiar el color de fondo:** `hover:bg-blue-700`
* **Si quieres cambiar el color de texto:** `hover:text-white`
* **Si quieres cambiar el tamaño (efecto zoom):** `hover:scale-105`

### Ejemplo 1: Botón "Call to Action" Profesional
Un botón estático es aburrido. Un botón con `hover` invita a ser clickeado.

```html
<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
  Inscribir Equipo
</button>
```

### Ejemplo 2: Tarjeta con Elevación (Efecto "Card Lift")
Este es un patrón de diseño muy popular en interfaces modernas (como las que estás construyendo para tus proyectos de gestión de ligas). Hace que la tarjeta "salte" visualmente hacia el usuario.

```html
<div class="p-6 bg-white border rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
  <h3 class="font-bold text-lg">Fecha 12: Atlético vs Lobos</h3>
  <p class="text-gray-600">Haz clic para ver estadísticas detalladas.</p>
</div>
```

### Buenas Prácticas para tu Desarrollo

1.  **Siempre usa `transition`**: Sin una transición, el cambio de estado es "brusco" (cero a cien). Añadir `transition` o `transition-all` hace que la UI se sienta fluida y de alta calidad.
2.  **No dependas únicamente del Hover**: Recuerda que en dispositivos móviles **no existe el "hover"** (no hay cursor). Si diseñas una función que *solo* se puede ver o activar con hover (ej. un menú que solo se despliega con hover), los usuarios de celular no podrán acceder a ella. El `hover` debe ser un *plus*, no la única forma de acceder a la información.
3.  **Cursor Pointer**: Si tu elemento no es un enlace (`<a>`) o un botón (`<button>`), asegúrate de añadir la clase `cursor-pointer` junto con el `hover` para que el usuario sepa que ese elemento es clickeable.

### Resumen para tu toma de decisiones

| Clase | Efecto Visual | Ideal para... |
| :--- | :--- | :--- |
| `hover:bg-*` | Cambio de color de fondo | Botones de acción, filas de tablas. |
| `hover:text-*` | Cambio de color de texto | Enlaces de navegación, títulos. |
| `hover:scale-*` | Efecto de zoom | Imágenes de jugadores, tarjetas de equipos. |
| `hover:shadow-*` | Efecto de elevación | Tarjetas, contenedores principales. |

::: tip 💡 Consejo del Diseñador Frontend:
En tu proyecto *Soccer League Elite*, intenta aplicar `hover:scale-105` a los escudos de los equipos cuando los muestres en una galería. Esa pequeña animación le dará un acabado profesional y pulido que distinguirá tu app de una simple lista de datos.
:::

## 8.2 Focus (`focus:*`)

El estado **`focus`** es la variante más importante para la **accesibilidad (A11y)** de tu aplicación. Un elemento recibe "foco" cuando está activo y listo para recibir entrada de usuario. Esto sucede principalmente cuando un usuario hace clic en un campo de texto, o cuando navega por tu interfaz usando la tecla `Tab` de su teclado.

### ¿Por qué es vital el `focus`?
Muchos usuarios, ya sea por preferencia o por necesidad (usuarios que no pueden usar mouse), navegan las webs exclusivamente con el teclado. Si no diseñas estados de `focus` claros, estos usuarios no sabrán qué botón o campo de texto tienen seleccionado actualmente, lo que hace que tu aplicación sea inutilizable para ellos.

### Cómo usar `focus:` en Tailwind
Tailwind facilita enormemente la creación de indicadores de foco personalizados. No tienes que confiar en el indicador por defecto del navegador (que suele ser un borde azul algo feo).

* **`focus:outline-none`**: Quita el borde por defecto del navegador (úselo solo si vas a poner otro!).
* **`focus:ring-*`**: Crea un "anillo" o halo alrededor del elemento, muy moderno y claro.
* **`focus:border-*`**: Cambia el color del borde del input.
* **`focus:bg-*`**: Cambia ligeramente el color de fondo para indicar selección.

### Ejemplo Práctico: Campo de búsqueda para *Soccer League Elite*

En este ejemplo, crearemos un buscador que se vuelve "brillante" cuando el usuario lo selecciona, ayudándole a concentrarse en esa tarea.

```html
<input 
  type="text" 
  class="w-full p-3 border-2 border-gray-300 rounded-lg transition-all 
         focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500" 
  placeholder="Buscar equipo o jugador..." 
/>
```

### Tabla de utilidades comunes para Focus

| Clase | Función | Uso |
| :--- | :--- | :--- |
| **`focus:ring-N`** | Crea un anillo exterior | Es el estándar moderno para mayor visibilidad. |
| **`focus:ring-opacity-N`**| Controla la transparencia | Útil para anillos suaves que no tapen otros elementos. |
| **`focus:border-*`** | Cambia color de borde | Excelente para campos de formulario. |
| **`focus:text-*`** | Cambia color de texto | Útil para enlaces de menú. |

::: tip 💡 Consejo del Diseñador Frontend, La Regla de Oro:
**Nunca, bajo ninguna circunstancia, utilices `focus:outline-none` sin reemplazarlo con otro indicador de enfoque.**

Es un error común en el desarrollo frontend eliminar el indicador del navegador para "que se vea más limpio" y olvidar poner uno propio. Esto destruye la navegación por teclado. Si eliminas el `outline`, *siempre* debes añadir un `ring` o un `border` que destaque claramente el elemento.

**Ejemplo de mal diseño (No hagas esto):**
`<button class="focus:outline-none">Click</button>` ❌ (El usuario no sabrá que el botón está seleccionado).

**Ejemplo de buen diseño (Haz esto):**
`<button class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Click</button>` ✅
:::

## 8.3 Active (`active:*`)

El estado **`active`** representa el instante preciso en el que un usuario interactúa con un elemento; es el "momento del clic". Mientras que el `hover` es el estado de "preparación" (el ratón está cerca), el `active` es la ejecución de la acción (el botón está presionado).

### ¿Por qué es vital el estado `active`?
Desde la perspectiva de la Experiencia de Usuario (UX), este estado proporciona **retroalimentación táctil**. En una interfaz digital, no tenemos botones físicos que se hunden, pero el estado `active` simula esa respuesta física. Si un usuario hace clic en un botón y no pasa nada visualmente, puede sentir inseguridad sobre si la aplicación "entendió" su acción.

### Cómo usar `active:` en Tailwind
Al igual que con `hover` o `focus`, simplemente prefijas la clase. El estado `active` se mantiene mientras el usuario mantenga presionado el botón (antes de soltarlo).

* **`active:bg-*`**: Oscurece el botón para simular profundidad.
* **`active:scale-*`**: Reduce ligeramente el tamaño, simulando un "hundimiento" físico.
* **`active:shadow-none`**: Elimina la sombra para que el botón parezca "planear" sobre la superficie al ser presionado.

### Ejemplo Práctico: Botón de "Acción Táctil" para *Soccer League Elite*
Para tus botones de gestión (como "Registrar Gol" o "Aceptar Cambio"), un efecto de escala sutil da una sensación de calidad premium.

```html
<button 
  class="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md 
         transition-all duration-100 
         hover:bg-blue-700 
         active:scale-95 active:bg-blue-900 active:shadow-inner"
>
  Registrar Gol
</button>
```

### Diferencia clave: `hover` vs `active`

Es común confundirlos, pero tienen objetivos muy distintos:

| Estado | ¿Cuándo ocurre? | Propósito |
| :--- | :--- | :--- |
| **`hover`** | El puntero está sobre el elemento. | Indicar que el elemento es **clickeable**. |
| **`active`** | El botón está siendo presionado. | Confirmar que la **acción ha comenzado**. |


::: tip 💡 Consejos del Diseñador Frontend para un UI Premium:
1.  **Sutileza es clave:** No necesitas cambiar drásticamente el diseño. Una reducción del `scale-95` o un cambio leve en el tono del color es suficiente. Demasiado movimiento puede resultar molesto.
2.  **Combínalo con `transition`:** El estado `active` ocurre muy rápido. Si no usas `transition-all` o `transition-transform`, el cambio se verá "glitcheado" o cortado. Asegúrate de que la duración sea corta (ej. `duration-75` o `duration-100`).
3.  **Accesibilidad:** El estado `active` no debe sustituir al `focus`. Recuerda que un usuario puede activar un botón con la tecla "Enter" o "Espacio" en su teclado; Tailwind manejará esto correctamente, pero siempre asegúrate de que tu botón tenga un buen estado de `focus` además del `active`.

**¿Por qué usar esto en tu dashboard?**
En una aplicación de gestión deportiva como la tuya, donde los usuarios podrían registrar datos rápidamente durante un partido o evento, un botón que "se siente" al presionar reduce la tasa de errores y mejora la satisfacción del usuario.
:::

## 8.4 Disabled (`disabled:*`)

El estado **`disabled`** es fundamental para la gestión de formularios y flujos de trabajo en tu aplicación. Se utiliza para indicar que un elemento (usualmente un botón o un campo de entrada) **no está disponible para interacción** en este momento.

### La lógica técnica
Es vital entender algo: Tailwind no "deshabilita" el elemento por sí solo. El estado `disabled` en CSS depende de que el elemento HTML tenga el atributo nativo `disabled` (ej. `<button disabled>`).

La variante `disabled:` de Tailwind simplemente le dice al navegador: *"Si este elemento tiene el atributo `disabled`, aplícale estos estilos visuales extra"*.

### ¿Por qué usarlo en *Soccer League Elite*?
Imagina que un usuario está registrando un equipo nuevo. Mientras el formulario se envía al servidor (Firebase), es una buena práctica deshabilitar el botón de "Guardar". Esto evita:
1.  **Doble envío de datos:** Que el usuario haga clic 5 veces y cree 5 equipos idénticos.
2.  **Confusión:** El usuario sabe que el proceso está "en curso" porque el botón cambió de color y se ve inactivo.

### Ejemplo Práctico: Botón de envío con estado de carga

Aquí verás cómo combinar clases normales con las clases `disabled:` para que el diseño cambie automáticamente cuando el atributo `disabled` esté presente.

```html
<button 
  disabled
  class="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg 
         transition-all duration-200
         hover:bg-blue-700
         disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
>
  Guardando datos...
</button>
```

### Tabla de utilidades recomendadas para `disabled`

Cuando diseñes un estado deshabilitado, busca que el usuario entienda inmediatamente que "no hay nada que hacer aquí".

| Clase | Efecto Visual | Por qué usarla |
| :--- | :--- | :--- |
| **`disabled:opacity-50`** | Desvanece el elemento | Indica visualmente que está "apagado". |
| **`disabled:cursor-not-allowed`** | Cambia cursor a icono de prohibido | Es la señal UX estándar de que no es clickeable. |
| **`disabled:bg-gray-*`** | Muta los colores vibrantes | Evita que el usuario confunda un botón deshabilitado con uno activo. |
| **`disabled:pointer-events-none`** | Bloquea clics totalmente | Impide que el código JavaScript se dispare accidentalmente. |


::: tip 💡 Consejos del Diseñador Frontend para un UI Premium:
1.  **Contraste:** No hagas el estado deshabilitado tan claro que sea ilegible. El usuario aún debe ser capaz de leer lo que dice el botón, aunque sepa que no puede presionarlo.
2.  **Accesibilidad (A11y):** Cuando deshabilitas un botón, los lectores de pantalla (para usuarios con discapacidad visual) ignorarán el botón. Si necesitas mostrar un botón deshabilitado pero quieres que el usuario sepa *por qué* no puede usarlo, considera dejarlo activo y, al hacer clic, mostrar un mensaje de error o aviso.
3.  **Consistencia:** Decide un estándar para todos los botones deshabilitados de tu app (por ejemplo, siempre `gray-400` con `opacity-50`). No cambies el estilo de "deshabilitado" entre diferentes páginas; la consistencia ayuda al usuario a aprender tu interfaz más rápido.
:::

## 8.5 Group Hover (`group-hover:*`)

El estado **`group-hover`** es la solución definitiva cuando necesitas que un elemento hijo reaccione cuando el usuario interactúa con su padre. Es una técnica de "estilo con alcance" (scoped styling) que evita que tengas que escribir JavaScript para coordinar efectos visuales complejos.

En interfaces profesionales, a menudo querrás que al pasar el mouse por una "tarjeta" completa, el contenido interno (iconos, texto, imágenes) cambie de apariencia simultáneamente. El `group-hover` hace esto posible de forma declarativa.

### ¿Cómo funciona la arquitectura `group`?

Esta variante funciona bajo una relación de dos pasos:

1.  **El Marcador (`group`):** Debes colocar la clase `group` en el elemento contenedor (el padre, abuelo o cualquier ancestro). Esto marca al contenedor como el "emisor" del estado.
2.  **El Receptor (`group-hover:*`):** En los elementos hijos, aplicas las clases con el prefijo `group-hover:`. Estos elementos estarán "escuchando" constantemente si el elemento marcado con `group` está siendo "hovereado".

### Anatomía del código
```html
<div class="group ..."> <p class="group-hover:text-blue-500 ..."> Texto que cambia de color.
  </p>
</div>
```

### Ejemplo Práctico: Tarjeta de Jugador en "Soccer League Elite"

Imagina una tarjeta de un jugador. Quieres que, al pasar el mouse por encima de la tarjeta, el nombre del jugador se vuelva azul y un icono de "ver perfil" pase de ser gris a ser de color activo.

```html
<div class="group p-6 bg-white border rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl">
  
  <div class="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>

  <h2 class="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
    Juan Pérez
  </h2>

  <p class="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
    Delantero Central - ID: 1023
  </p>
</div>
```

### Resumen de funcionamiento

| Elemento | Clase necesaria | Propósito |
| :--- | :--- | :--- |
| **Contenedor Padre** | `group` | Define el área que dispara el evento. |
| **Elemento Hijo** | `group-hover:[clase]` | Aplica el estilo cuando el padre es "hovereado". |

### Consideraciones técnicas clave

1.  **No necesita ser directo:** El elemento con `group-hover` no tiene que ser un hijo directo. Puede estar varios niveles de profundidad dentro del árbol HTML; siempre que esté dentro del elemento que tiene la clase `group`, el efecto funcionará.
2.  **Combinación de clases:** Puedes combinar `group-hover` con cualquier utilidad. Por ejemplo: `group-hover:translate-x-2`, `group-hover:scale-110`, `group-hover:opacity-100`.
3.  **No abuses:** Aunque es una herramienta poderosa, si usas `group-hover` en demasiados elementos dentro de una tarjeta, la interfaz puede volverse visualmente "ruidosa" o caótica. Úsalo para crear coherencia (por ejemplo, cambiar el color de todos los textos dentro de una tarjeta al mismo tiempo).
4.  **Compatibilidad:** Recuerda siempre combinarlo con `transition` o `transition-all` en los elementos hijos para que el cambio de estado se sienta natural y fluido.

Esta variante es especialmente potente en dashboards de gestión deportiva donde tienes listas de jugadores o partidos; permite que cada fila o tarjeta se sienta "viva" y responsiva al tacto del usuario, elevando la calidad percibida de tu aplicación sin una sola línea de lógica en JavaScript.

## 8.6 Peer (`peer-*`)

Si `group` es la herramienta para manejar la relación **padre-hijo**, **`peer`** es la herramienta maestra para manejar la relación entre **hermanos** (elementos al mismo nivel jerárquico).

El sistema `peer` te permite modificar el estilo de un elemento basándose en el estado de otro elemento que lo precede en el código HTML. Es increíblemente potente para crear validaciones de formularios, tooltips interactivos o menús desplegables sin escribir una sola línea de JavaScript.

### ¿Cómo funciona la arquitectura `peer`?

Para que esto funcione, debes cumplir dos condiciones obligatorias:

1.  **El Emisor (`peer`):** Al elemento que causará el cambio (el que el usuario va a clicar, escribir o enfocar) debes añadirle la clase `peer`.
2.  **El Receptor (`peer-state:class`):** Al elemento que debe cambiar de estilo, le añades clases que comiencen con el prefijo `peer-` seguido del estado que quieres escuchar (ej. `peer-focus`, `peer-invalid`, `peer-checked`).

> **Regla de Oro:** El elemento emisor (con `peer`) **debe estar definido antes** que el receptor en tu archivo HTML. Si el receptor está antes, el selector no funcionará.

### Ejemplo Práctico: Validación de Formulario (Formato de Email)

Vamos a construir un campo de email. Si el usuario escribe un formato inválido, queremos que aparezca un mensaje de error automáticamente, sin JavaScript.

```html
<div class="flex flex-col gap-2">
  <label class="font-medium text-gray-700">Correo Electrónico</label>
  
  <input 
    type="email" 
    class="peer border-2 border-gray-300 p-2 rounded-md focus:border-blue-500 focus:outline-none" 
    placeholder="ejemplo@correo.com" 
    required
  />

  <p class="hidden peer-invalid:block text-red-500 text-sm">
    Por favor, ingresa un formato de correo electrónico válido.
  </p>
  
  <p class="text-gray-400 text-xs peer-focus:text-blue-600">
    Escribe tu correo principal.
  </p>
</div>
```

### Comparativa: Group vs Peer

Es normal confundir estas variantes al principio. Esta tabla te ayudará a decidir cuándo usar cada una:

| Variante | Relación en el DOM | ¿Quién controla a quién? |
| :--- | :--- | :--- |
| **`group`** | Padre -> Hijo (Nesting) | El padre controla a sus descendientes. |
| **`peer`** | Hermano -> Hermano (Sibling) | Un elemento controla a los que vienen después. |

### Casos de uso avanzados para *Soccer League Elite*

* **Checkboxes Personalizados:** Puedes tener un `<input type="checkbox" class="peer hidden" />` y un `<div>` inmediatamente después que use `peer-checked:bg-green-500` para cambiar de color solo cuando el checkbox está marcado. Esto te permite crear checkboxes visualmente increíbles que el usuario puede estilizar a su gusto.
* **Mensajes de ayuda dinámicos:** Puedes ocultar un mensaje de ayuda y mostrarlo únicamente cuando el usuario hace `focus` en el campo correspondiente usando `peer-focus`.
* **Gestión de estados complejos:** Si tienes múltiples inputs, cada uno puede controlar su propio mensaje de error de forma independiente, algo que tradicionalmente requería coordinar selectores complejos en CSS o funciones de estado en JavaScript.

::: tip 💡 Consejos del Diseñador Frontend para un UI Premium:
El `peer` es tu mejor aliado para mantener tu HTML limpio. Recuerda que no tiene límites; puedes encadenar selectores. Por ejemplo, `peer-checked:peer-hover:bg-blue-600` permite que un elemento reaccione solo si su "peer" está marcado **y** está recibiendo un hover. ¡Experimenta con estas combinaciones para dar vida a tus formularios!
:::

### Resumen de Estados

| Variante | Se activa cuando... | Uso típico |
| :--- | :--- | :--- |
| `hover:` | El mouse está encima | Botones, tarjetas, links. |
| `focus:` | El usuario selecciona el elemento | Inputs, navegación por teclado. |
| `active:` | El usuario hace clic | Efecto de "presión" visual. |
| `disabled:` | El estado es desactivado | Deshabilitar acciones temporalmente. |
| `group-hover:` | El padre tiene el mouse encima | Efectos complejos en tarjetas. |
| `peer-*: ` | El hermano anterior cambia | Validaciones de formulario (error/success). |

::: tip 💡 Consejo del Diseñador Frontend:
Para tu aplicación *Soccer League Elite*, utiliza `group-hover` siempre que tengas una **"Tarjeta de Jugador"**. Si quieres que la foto del jugador haga un ligero *zoom* cuando el usuario pase el mouse por toda la tarjeta, aplica `group` al contenedor principal y `group-hover:scale-105` a la imagen. Es el detalle que hace que una web se sienta "Premium".mento reaccione solo si su "peer" está marcado **y** está recibiendo un hover. ¡Experimenta con estas combinaciones para dar vida a tus formularios!
:::
