# MÓDULO 7 — Responsive Design

El diseño responsivo es lo que separa a una web que "se rompe" en el celular de una aplicación profesional. En Tailwind, el diseño responsivo no es una ocurrencia tardía, es una parte fundamental de cómo se escriben las clases CSS.

## 7.1 Filosofía Mobile First

La filosofía **Mobile First** no es solo una técnica de diseño; es una estrategia de desarrollo que cambia cómo escribes tu código CSS. En lugar de diseñar una web compleja para escritorio y luego intentar "comprimirla" para que quepa en un celular, haces lo opuesto: diseñas la experiencia esencial para el dispositivo más pequeño y luego la **enriqueces** para pantallas más grandes.

### ¿Por qué adoptar esta mentalidad?

1.  **Priorización de contenido:** Obliga a decidir qué es lo realmente importante. Si no cabe bien en una pantalla de 375px, probablemente sea ruido visual.
2.  **Rendimiento (Performance):** El CSS base que escribes es ligero y simple. Los dispositivos móviles no tienen que procesar reglas complejas de escritorio que luego son sobreescritas o anuladas.
3.  **Código más limpio:** Evitas el infierno de los "resets". En un enfoque *Desktop First*, tienes que escribir `width: 100%` en móvil para anular el `width: 50%` que pusiste en escritorio. En *Mobile First*, simplemente declaras `w-full` y luego, si el espacio lo permite, usas `md:w-1/2`.

### La lógica técnica: `min-width`

Tailwind CSS usa *media queries* de tipo `min-width`. Esto significa que cada clase responsiva (como `md:`, `lg:`) es una instrucción que dice: *"Si la pantalla mide MÁS que X, aplica esto"*.

* **Sin prefijo:** Se aplica de 0px a infinito (el estilo base).
* **Con prefijo `md:`:** Se aplica de 768px a infinito (el estilo mejorado).

Esto crea una **cascada lógica**: el estilo base es la cimentación, y los prefijos son capas que se añaden encima.


### Ejemplo Práctico: Tarjeta de "Estadísticas del Jugador"

Imagina que estás construyendo una ficha técnica para *Soccer League Elite*.

#### El enfoque "Mobile First" (Correcto y profesional)
Primero definimos cómo se ve en el celular (simple, vertical). Luego, usamos `md:` para mejorar el layout en escritorio.

```html
<div class="p-4 bg-white shadow rounded-lg flex flex-col gap-4">
  
  <div class="w-full h-48 bg-gray-200 rounded"></div>
  
  <div>
    <h2 class="text-xl font-bold">Juan Pérez</h2>
    <p>Delantero - 20 Goles</p>
  </div>

  <style>
    /* Tailwind lo hace así internamente al poner 'md:flex-row' */
    @media (min-width: 768px) {
      .card { flex-direction: row; }
    }
  </style>
</div>

<div class="p-4 bg-white shadow rounded-lg flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/3 h-48 bg-gray-200 rounded"></div>
  <div class="flex flex-col justify-center">
    <h2 class="text-xl font-bold">Juan Pérez</h2>
    <p>Delantero - 20 Goles</p>
  </div>
</div>
```

### Resumen de la mentalidad Mobile First

| Acción | Mentalidad |
| :--- | :--- |
| **Estilos Base** | Escribe pensando en el diseño vertical, una sola columna, tipografía clara. |
| **Uso de Prefijos** | Añade prefijos solo cuando el espacio **sobra** y puedes permitirte más complejidad. |
| **Evita** | No intentes poner `sm:w-full`, `md:w-full`, `lg:w-full`. Si el ancho es siempre el 100%, solo escribe `w-full`. |

::: tip 💡 Consejo del Diseñador Frontend:
El mejor ejercicio para dominar esto es desarrollar tu aplicación en el navegador con el inspector abierto, pero **empezando siempre desde el ancho más pequeño posible** (ej. 320px). Si tu diseño funciona ahí, añadir complejidad para escritorio es un paseo. Si empiezas en escritorio, el celular siempre se sentirá como una "versión recortada" en lugar de una experiencia optimizada.
:::

## 7.2 Breakpoints (Puntos de ruptura)

Los **breakpoints** son los límites específicos de ancho de pantalla donde tu diseño cambia para adaptarse al dispositivo. En Tailwind, no intentas adivinar el tamaño de cada teléfono del mercado; en su lugar, utilizas una escala estándar que cubre la inmensa mayoría de los dispositivos modernos.

### La Escala Oficial de Tailwind
Cada clase que prefijas con estos nombres se activa automáticamente cuando el navegador supera ese ancho mínimo.

| Prefijo | Ancho Mínimo | Contexto típico |
| :--- | :--- | :--- |
| **`sm`** | 640px | Teléfonos en modo horizontal o tablets pequeñas. |
| **`md`** | 768px | Tablets estándar (iPad, etc.). |
| **`lg`** | 1024px | Laptops pequeñas y monitores de oficina. |
| **`xl`** | 1280px | Pantallas de escritorio estándar. |
| **`2xl`** | 1536px | Monitores de alta resolución o *Ultra-wide*. |


### La lógica detrás del `min-width`
Es fundamental entender que Tailwind usa **min-width** (ancho mínimo). Esto significa que **las reglas se heredan hacia arriba**.

Si escribes `md:text-lg`, no significa que el texto sea grande *solo* en tablets; significa que desde 768px en adelante, el texto será grande. Si no especificaste nada para `lg` o `xl`, el estilo `md` se mantendrá hasta que tú decidas cambiarlo.

> **Regla de oro:** Piensa en las clases sin prefijo como el diseño para "todo" (móvil hacia arriba). Los prefijos son "mejoras" para pantallas que tienen espacio suficiente para mostrar más.

### Ejemplo Práctico: Grid Responsivo para *Soccer League Elite*

Imagina el panel de control de tu liga. Quieres mostrar los bloques de información (Estadísticas, Resultados, Próximos Partidos) de forma diferente según el dispositivo del usuario:

* **Móvil:** 1 sola columna (apilado).
* **Tablet (`md`):** 2 columnas.
* **Laptop (`lg`):** 3 columnas (diseño completo).

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
  
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="font-bold text-xl">Estadísticas</h2>
    </div>

  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="font-bold text-xl">Resultados</h2>
    </div>

  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="font-bold text-xl">Partidos</h2>
    </div>

</div>
```

### ¿Por qué esta estructura es más eficiente?
1.  **Menos código:** Si quisieras que el `gap` fuera de `4` en todos los dispositivos, solo escribes `gap-4`. No necesitas escribir `sm:gap-4 md:gap-4 lg:gap-4`.
2.  **Predictibilidad:** Si cambias algo en el diseño móvil (`grid-cols-1`), automáticamente se refleja en todas las demás pantallas, a menos que el prefijo `md:` o `lg:` lo redefina.

### Resumen Técnico
Cuando veas un componente, pregúntate:
1.  ¿Cómo se ve esto en el tamaño más pequeño? (Esto es tu **clase base**).
2.  ¿Dónde se rompe el diseño o dónde tengo espacio de sobra? (Esto es tu **breakpoint**).
3.  Aplica el prefijo (`md:`, `lg:`) y ajusta la propiedad.

## 7.3 Responsive Utilities (Clases Condicionales)

Las **Responsive Utilities** son la herramienta más potente en tu cinturón de desarrollador. Permiten aplicar cambios de estilo de forma condicional, activándose solo cuando la pantalla cumple con el tamaño definido por el *breakpoint*.

En lugar de escribir pesadas *media queries* en un archivo CSS aparte, escribes la lógica directamente en tu HTML.


### La Sintaxis: `prefijo:clase`

La estructura es siempre la misma: **`prefijo` + `:` + `clase`**.

* **Sin prefijo:** Es el estilo por defecto (móvil).
* **Con prefijo (`sm:`, `md:`, etc.):** Es la instrucción que se activa al alcanzar el ancho mínimo definido.

#### Ejemplo de lógica de sobreescritura:
```html
<div class="bg-blue-500 md:bg-red-500 lg:bg-green-500">
  </div>
```

### Aplicaciones Comunes de Utilidades

#### Visibilidad (Ocultar/Mostrar)
Este es el uso más frecuente: mostrar una versión simplificada en móvil y una completa en escritorio.

* `hidden`: Oculta el elemento (`display: none`).
* `block` / `flex`: Muestra el elemento.

```html
<aside class="hidden lg:block w-64">
  Menú de Navegación Lateral
</aside>
```

#### Tipografía Responsiva
Ajustar el tamaño de fuente según el dispositivo asegura legibilidad.

```html
<h1 class="text-base md:text-xl lg:text-2xl font-bold">
  Resultados de la Jornada
</h1>
```

#### Espaciado y Layout
Ajustar los márgenes o paddings permite aprovechar el espacio extra.

```html
<div class="p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-12">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Ejemplo Maestro: Tarjeta de "Partido" (Soccer League Elite)

Vamos a poner en práctica todo lo anterior. Esta tarjeta cambia totalmente su diseño entre un celular y una computadora.

```html
<div class="flex flex-col md:flex-row p-4 md:p-6 bg-gray-100 md:bg-white border rounded-lg shadow-sm">
  
  <div class="w-16 h-16 md:w-24 md:h-24 bg-blue-500 rounded-full shrink-0"></div>
  
  <div class="mt-4 md:mt-0 md:ml-6 flex flex-col justify-center">
    <h2 class="text-lg md:text-2xl font-bold">Atlético vs Lobos</h2>
    <p class="text-sm md:text-base text-gray-600">Jornada 12 - Estadio Central</p>
  </div>
  
  <button class="hidden md:block ml-auto px-4 py-2 bg-blue-600 text-white rounded">
    Ver Detalles
  </button>
  
</div>
```

### Resumen Técnico: Guía de Referencia

| Utilidad | Clase Ejemplo | Uso |
| :--- | :--- | :--- |
| **Visibility** | `hidden`, `md:block` | Mostrar/ocultar elementos. |
| **Typography** | `text-sm`, `md:text-base` | Aumentar legibilidad en pantallas grandes. |
| **Layout** | `flex-col`, `md:flex-row` | Cambiar orientación de bloques. |
| **Spacing** | `p-2`, `md:p-6` | Ajustar respiración del diseño. |


::: tip 💡 Consejo del Diseñador Frontend:
No intentes aplicar prefijos a *todas* tus clases. Si una propiedad no necesita cambiar entre dispositivos (por ejemplo, el color de fondo o la familia tipográfica), déjala limpia sin prefijos (`bg-blue-500`). Solo usa `prefijo:` cuando **necesites cambiar** el valor. Esto mantiene tu HTML limpio y tu CSS mucho más fácil de mantener.
:::

## 7.4 Diseño Adaptativo Real (Patrones de Diseño)

El "Diseño Adaptativo" va más allá de cambiar un par de anchos; se trata de **cambiar la experiencia de usuario** para que cada dispositivo sea funcional y útil. No se trata de "encoger" el escritorio, sino de optimizar la interfaz para el contexto.

En el desarrollo de *Soccer League Elite*, te enfrentarás a problemas comunes que se resuelven con estos 4 patrones de diseño adaptativo probados en la industria.

### 1. Patrón: "Stack-to-Row" (Apilamiento Dinámico)
Es el patrón más común. En móvil, el usuario necesita ver la información de forma secuencial (uno tras otro). En escritorio, el usuario tiene espacio horizontal para comparar elementos.

```html
<div class="flex flex-col md:flex-row gap-4">
  <div class="flex-1 p-4 bg-gray-100 rounded">Goles: 12</div>
  <div class="flex-1 p-4 bg-gray-100 rounded">Asistencias: 5</div>
  <div class="flex-1 p-4 bg-gray-100 rounded">Faltas: 2</div>
</div>
```

### Patrón: "Progressive Disclosure" (Ocultar/Mostrar)
En pantallas pequeñas, el exceso de información satura al usuario. El patrón de diseño adaptativo consiste en **ocultar detalles secundarios** y mostrarlos solo cuando hay espacio (desktop) o mediante una acción (botón/menú).

```html
<div class="flex items-center gap-4">
  <img src="escudo.png" class="w-12 h-12" />
  <div>
    <h1 class="text-lg font-bold">Real Madrid</h1>
    <p class="hidden md:block text-sm text-gray-500">Fundado: 1902 | Estadio: Santiago Bernabéu</p>
  </div>
</div>
```

### Patrón: "Table Reflow" (De Tabla a Tarjeta)
Las tablas de datos son el mayor enemigo del diseño responsivo. En móvil, una tabla con 6 columnas se ve fatal. El patrón adaptativo aquí es **transformar la fila de la tabla en una "tarjeta" (card)** cuando la pantalla es pequeña.

* **Estrategia:** En móvil, usas `flex-col` para mostrar la información como una ficha. En escritorio, usas `grid` o `table` para mostrarla como fila.

```html
<div class="border p-4 rounded-lg">
  <div class="flex justify-between font-bold">
    <span>Juan Pérez</span>
    <span>#10</span>
  </div>
  
  <div class="hidden md:flex gap-4 mt-2 text-sm">
    <span>Posición: DC</span>
    <span>Edad: 24</span>
    <span>Nacionalidad: MX</span>
  </div>
</div>
```

### Patrón: "Sidebar-to-Hamburger" (El menú adaptativo)
El menú de navegación nunca debe ser el mismo en móvil que en desktop.

* **Mobile:** Un botón (hamburguesa) que despliega un menú lateral o un modal.
* **Desktop:** Una barra horizontal simple con enlaces directos.

```html
<nav class="flex justify-between items-center p-4">
  <div class="logo">SoccerLeagueElite</div>
  
  <ul class="hidden md:flex gap-6">
    <li>Inicio</li>
    <li>Liga</li>
    <li>Jugadores</li>
  </ul>
  
  <button class="md:hidden">
    <svg class="w-6 h-6"> </svg>
  </button>
</nav>
```

### Resumen para tu toma de decisiones

| Patrón | Problema que resuelve | Clase Clave |
| :--- | :--- | :--- |
| **Stacking** | Falta de espacio horizontal | `flex-col` -> `md:flex-row` |
| **Disclosure** | Sobrecarga de información | `hidden` -> `md:block` |
| **Reflow** | Tablas ilegibles en móvil | Transformar filas en tarjetas |
| **Navigation** | Menú inmanejable | `md:hidden` (botón) + `hidden md:flex` (links) |

::: tip 💡 Consejo del Diseñador Frontend:
El secreto del "Diseño Adaptativo Real" es no intentar que todo se vea *igual* en todos lados. Acepta que tu app debe comportarse diferente. En un celular, tu usuario busca rapidez (botones grandes, menos texto). En una computadora, busca productividad (comparativas, tablas, más datos). **Diseña para el contexto, no solo para el tamaño de pantalla.**
:::

### Resumen de estrategia para tus proyectos

1.  **Diseña primero en móvil:** Asegúrate de que el contenido principal sea legible y usable sin `md:` o `lg:` clases.
2.  **Define tus estados:** ¿Qué elemento sobra en móvil? Ocúltalo con `hidden`. ¿Qué elemento debe ser más grande? Ajusta `text-*` o `p-*` con prefijos.
3.  **No fuerces:** Si algo no necesita cambiar entre móvil y escritorio, **no le pongas prefijos**. Mantén el HTML lo más limpio posible.

::: tip 💡 Consejo del Diseñador Frontend:
Cuando estés probando la responsividad en Chrome/Firefox (DevTools), no arrastres la ventana manualmente. Usa el modo "Device Toolbar" (Ctrl+Shift+M). Esto te permitirá ver exactamente en qué pixel se activan tus `md` o `lg` y ajustar tus clases con precisión matemática.
:::