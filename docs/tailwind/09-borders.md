# MÓDULO 9 — Borders, Radius y Shadows

Si los módulos anteriores fueron los cimientos y las estructuras de tu aplicación *Soccer League Elite*, este módulo es el **acabado de pintura y carpintería**. Un buen diseño visual (UI) no solo se trata de que las cosas funcionen, sino de que se sientan "agradables" y profesionales al tacto. Los bordes, el redondeo y las sombras definen la jerarquía visual de tu web.

## 9.1 Borders (Bordes)

En el diseño web, el borde no es solo una línea; es una **herramienta de arquitectura visual**. Los bordes definen los límites de los elementos, separan grupos de información y, cuando se usan correctamente, guían el ojo del usuario hacia lo que es importante.

En Tailwind, los bordes son utilidades altamente granulares. Esto significa que puedes controlar cada aspecto del borde de forma independiente sin tocar una sola línea de CSS externo.

### Border Width (Grosor)
El grosor del borde establece la "fuerza" del elemento. Un borde fino es sutil; un borde grueso es una declaración de diseño.

* **Por defecto:** Al poner solo `border`, Tailwind aplica `1px` de grosor.
* **Escala:** Va desde `border-0` hasta `border-8`.

| Clase | Grosor (px) | Uso Sugerido |
| :--- | :--- | :--- |
| `border-0` | 0px | Eliminar bordes (o "resetear"). |
| `border` | 1px | Estándar; ideal para listas, tablas y separadores. |
| `border-2` | 2px | Enfoque visual; para inputs activos o botones. |
| `border-4` | 4px | Resalte alto; para tarjetas de "destacado". |
| `border-8` | 8px | Estilo gráfico muy grueso. |

### Border Color
Tailwind usa la misma paleta de colores para los bordes que para el texto o el fondo. La sintaxis es `border-{color}-{intensidad}`.

* **Ejemplo:** `border-blue-500`
* **Transparencia:** Puedes ajustar la opacidad del borde con `border-opacity-{valor}`, útil para bordes que deben integrarse suavemente con fondos de colores.

### Border Style
A veces, una línea continua no es lo que necesitas. Los estilos definen la textura del borde.

* **`border-solid`:** El estándar (predeterminado).
* **`border-dashed`:** Línea de guiones. Excelente para áreas de "drag and drop" o carga de imágenes en tu proyecto *CitaFacil*.
* **`border-dotted`:** Línea de puntos. Útil para diseños muy minimalistas o separadores decorativos.
* **`border-double`:** Línea doble.

### Control de lados específicos (Arquitectura avanzada)
Este es el secreto para un diseño profesional: **no siempre necesitas bordes en los cuatro lados**. A menudo, un borde solo en la parte inferior o izquierda es más elegante que un recuadro completo.

* `border-t-*`: Solo arriba (top).
* `border-b-*`: Solo abajo (bottom).
* `border-l-*`: Solo a la izquierda (left).
* `border-r-*`: Solo a la derecha (right).

### Código: Implementación profesional

Para tu proyecto *Soccer League Elite*, imagina una fila de una tabla de posiciones. En lugar de encerrar todo en una caja pesada, usa un borde inferior sutil para separar las filas:

```html
<div class="p-4 border-b-2 border-gray-100 hover:bg-gray-50 transition-colors">
  <div class="flex justify-between items-center">
    <span class="font-semibold">1. Águilas FC</span>
    <span class="text-gray-600">30 pts</span>
  </div>
</div>

<div class="p-8 border-4 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
  Arrastra aquí la foto del escudo del equipo
</div>

<div class="border-l-4 border-green-500 bg-green-50 p-4">
  <p class="text-green-800 font-bold">Partido Finalizado: Victoria 3-1</p>
</div>
```

::: tip 💡 Consejos del Diseñador Frontend:
1.  **Menos es más:** Si tienes un contenedor con un color de fondo (`bg-gray-100`), es probable que no necesites un borde. Los bordes sirven para separar elementos cuando no hay contraste de color suficiente.
2.  **Contraste:** Si el fondo es blanco, un `border-gray-200` suele ser suficiente. Si usas un `border-black` en un fondo claro, el borde se verá "sucio" o demasiado agresivo.
3.  **Bordes como jerarquía:** En tus proyectos, usa `border-l-4` con un color llamativo (como un azul o verde de tu marca) para indicar el "tipo" de noticia o evento. Es una forma muy rápida de añadir jerarquía sin saturar el diseño.
:::

## 9.2 Border Radius (Redondeo de Esquinas)

El **Border Radius** es la propiedad de CSS que define la curvatura de las esquinas de un elemento. En el diseño de interfaces modernas, el redondeo no es solo un adorno; es un elemento psicológico. Las esquinas redondeadas se perciben como más seguras, amigables y accesibles, mientras que las esquinas perfectamente rectas se sienten más serias, técnicas o "duras".

### La Escala de Tailwind
Tailwind simplifica el uso de `border-radius` eliminando los píxeles arbitrarios y ofreciendo una escala lógica y consistente. Esto es vital para que tu aplicación *Soccer League Elite* no parezca un "collage" de estilos distintos.

| Clase | Radio (aprox) | Uso Recomendado |
| :--- | :--- | :--- |
| `rounded-none` | 0px | Elementos rectos (barras de progreso, bordes de página). |
| `rounded-sm` | 2px | Elementos pequeños (inputs, tags). |
| `rounded` | 4px | El estándar por defecto. Botones, inputs. |
| `rounded-md` | 6px | Ligeramente más suave. Ideal para botones llamativos. |
| `rounded-lg` | 8px | Estándar para **Tarjetas (Cards)**. |
| `rounded-xl` | 12px | Tarjetas modernas con más "aire". |
| `rounded-2xl` | 16px | Contenedores grandes o modales (Pop-ups). |
| `rounded-3xl` | 24px | Diseños muy orgánicos o tarjetas tipo "hero". |
| `rounded-full` | 9999px | **Círculo perfecto**. Esencial para avatares y badges. |

### Codificando con Redondeo Profesional

Para dominar el redondeo, no solo debes elegir una clase, debes entender **dónde** aplicarla.

#### Componentes Básicos (Botones e Inputs)
Para elementos interactivos, usa redondeo pequeño a medio. Si el botón es muy alto, un redondeo grande puede verse extraño.

```html
<button class="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
  Guardar
</button>

<input class="border rounded px-3 py-2" placeholder="Nombre..." />
```

#### Tarjetas de Contenido (Cards)
Aquí es donde el redondeo `lg` o `xl` realmente brilla. Ayuda a separar el contenido de la tarjeta del fondo de la página.

```html
<div class="bg-white p-6 rounded-xl shadow-lg border">
  <h3 class="font-bold">Juan Pérez</h3>
  <p class="text-gray-500">Delantero</p>
</div>
```

#### Avatares (La regla del "Full")
Nunca intentes adivinar el número de píxeles para hacer un círculo. Usa siempre `rounded-full`. Siempre que el contenedor sea cuadrado (ancho = alto), `rounded-full` creará una esfera perfecta.

```html
<div class="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
  <img src="avatar.jpg" alt="Jugador" />
</div>
```

### Técnicas Avanzadas: Redondeo Parcial
Un error común es intentar redondear todo el elemento. A veces, necesitas una "pestaña" o una tarjeta con la parte superior redondeada pero la inferior recta (para integrarse con otra sección).

Tailwind permite esto con prefijos de dirección:
* `rounded-t-*`: Redondea arriba (top).
* `rounded-b-*`: Redondea abajo (bottom).
* `rounded-l-*`: Redondea a la izquierda (left).
* `rounded-r-*`: Redondea a la derecha (right).

**Ejemplo: Cabecera de Tarjeta**
```html
<div class="w-full">
  <div class="bg-blue-500 p-4 rounded-t-xl text-white">
    Estadísticas del Partido
  </div>
  <div class="bg-white p-4 border-x border-b rounded-b-xl">
    Goles: 2 | Asistencias: 1
  </div>
</div>
```

::: tip 💡 Consejos del Diseñador Frontend:
1.  **Consistencia de Radio:** Si decides que tus tarjetas tendrán `rounded-xl`, asegúrate de que **todas** las tarjetas principales de tu app usen `rounded-xl`. No mezcles `lg` con `xl` en elementos del mismo nivel jerárquico.
2.  **Redondeo Interno:** ¿Sabías que si una tarjeta tiene `rounded-xl` y pones una imagen dentro que toca el borde, la imagen debe tener el mismo redondeo para no "salirse" de la forma?
    * *Truco:* Aplica `rounded-t-xl` a la imagen y `rounded-xl` al contenedor padre.
3.  **Accesibilidad:** Los botones con esquinas extremadamente redondeadas (`rounded-full` en botones de texto) son muy populares, pero asegúrate de que el texto dentro tenga suficiente margen (padding) para no tocar los bordes curvos, lo cual se ve poco profesional.amativo (como un azul o verde de tu marca) para indicar el "tipo" de noticia o evento. Es una forma muy rápida de añadir jerarquía sin saturar el diseño.
:::

## 9.3 Shadows (Sombras)
Las sombras son el lenguaje del **espacio y la profundidad** en el diseño digital. En un mundo bidimensional como una pantalla, la única forma que tiene el usuario de entender la jerarquía visual —qué está "encima" de qué— es mediante la luz y la sombra. Una buena sombra no debe parecer una mancha negra, sino una elevación sutil que hace que un elemento "flote" sobre el fondo.

### ¿Por qué utilizar sombras?
* **Jerarquía:** Las sombras indican importancia. Un botón que se eleva sugiere que es clickeable; una tarjeta con sombra sugiere que es un contenedor de contenido principal.
* **Separación:** Permiten separar elementos del fondo sin necesidad de bordes (lo cual limpia mucho el diseño).
* **Feedback visual:** Un cambio en la sombra (al hacer *hover*) confirma al usuario que su acción tuvo efecto.

### La Escala de Sombras en Tailwind
Tailwind no te obliga a definir valores de `box-shadow` complejos. Te ofrece una escala curada que va desde una sombra casi imperceptible hasta una sombra profunda.

| Clase | Nivel de Elevación | Uso Recomendado |
| :--- | :--- | :--- |
| `shadow-none` | Ninguna | Elementos planos (fondos, texto). |
| `shadow-sm` | Sutil | Detalles mínimos, listas de datos sutiles. |
| `shadow` | Estándar | Tarjetas (Cards) básicas. |
| `shadow-md` | Media | Componentes con un poco más de relevancia. |
| `shadow-lg` | Alta | Modales, menús desplegables. |
| `shadow-xl` | Muy alta | Elementos flotantes importantes o ventanas emergentes. |
| `shadow-2xl` | Máxima | Componentes "Hero" o tarjetas de impacto visual. |
| `shadow-inner` | Inversa | Para campos de texto o cajas que parecen "hundidas". |

### Código: Implementación Progresiva
Para tu dashboard de *Soccer League Elite*, la clave no es usar la sombra más grande, sino usar la sombra **correcta** para el componente adecuado. Observa cómo aplicamos niveles de profundidad:

```html
<div class="space-y-8 p-10 bg-gray-50">
  
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="font-bold">Tarjeta Estándar (shadow)</h3>
    <p>Ideal para elementos de lista o datos secundarios.</p>
  </div>

  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="font-bold">Tarjeta Destacada (shadow-lg)</h3>
    <p>Úsala para tarjetas de perfil de equipo o reportes de liga.</p>
  </div>

  <div class="p-6 bg-gray-200 rounded-lg shadow-inner">
    <h3 class="font-bold">Contenedor Hundido (shadow-inner)</h3>
    <p>Útil para mostrar áreas de código o logs de sistema.</p>
  </div>

</div>
```

### La Regla de Oro: Sombras Interactivas
El error de novato es usar sombras estáticas. En el diseño moderno, las sombras deben **cambiar** cuando el usuario interactúa con el elemento. Esto es lo que hace que una web se sienta "Premium".

```html
<div class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl cursor-pointer">
  <h3 class="font-bold">Tarjeta Interactiva</h3>
  <p>Pasa el ratón por encima para ver cómo se eleva.</p>
</div>
```

::: tip 💡 Consejos del Diseñador Frontend:
1.  **Consistencia de Luz:** Las sombras de Tailwind están diseñadas como si la luz viniera de arriba hacia abajo. Nunca intentes usar sombras personalizadas que parezcan venir de lados distintos, ya que romperás la coherencia visual.
2.  **Sombras vs Bordes:** No uses ambos a menos que sea estrictamente necesario. Si tu tarjeta tiene una sombra clara (`shadow-md`), a veces puedes omitir el borde (`border`). Esto evita que el diseño se vea saturado.
3.  **Transiciones suaves:** Siempre, repito, **siempre** acompaña tus cambios de sombra con una clase de transición (`transition-shadow` o `transition-all`). Un cambio brusco de sombra (sin animación) se siente como un error en la interfaz.
:::

## Integración: Tu tarjeta de perfil profesional
Para cerrar el módulo, veamos cómo combinar los tres elementos para crear un componente de UI de nivel profesional.

```html
<div class="border border-gray-200 rounded-xl shadow-lg p-6 bg-white w-64 hover:shadow-2xl transition-shadow">
  <img src="jugador.jpg" class="rounded-full w-20 h-20 border-4 border-white shadow-md mx-auto" />
  <h2 class="text-center font-bold mt-4">Aldair Cruz</h2>
  <p class="text-center text-gray-500 text-sm">Fullstack Developer</p>
</div>
```
::: tip 💡 Consejos del Diseñador Frontend:
1.  **Consistencia:** No mezcles `rounded-md` en un botón y `rounded-2xl` en otro botón similar. Define un "sistema de diseño" para tu app.
2.  **Sombras y Elevación:** Si algo es interactivo (ej. un botón), la sombra debe aumentar al hacer `hover`. Si es estático, mantén una sombra constante.
3.  **Menos es más:** A veces, el mejor diseño no necesita borde, solo una sombra muy sutil (`shadow-sm`) para definir el espacio.
:::