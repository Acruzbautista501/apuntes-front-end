# MÓDULO 15 — Container Queries (Novedad Nativa de Tailwind CSS 4)

Hasta ahora, todo el Módulo 7 giró en torno a una idea: adaptar el diseño según el tamaño de la **pantalla** (`md:`, `lg:`, etc.). Pero existe un problema que el *responsive design* tradicional nunca resolvió bien: ¿qué pasa cuando el mismo componente vive dentro de contenedores de distinto tamaño? Una `MatchCard` de tu aplicación puede estar en una columna angosta del sidebar o en el área principal, a pantalla completa. El viewport es el mismo en ambos casos, pero el espacio disponible **no**.

Las **Container Queries** resuelven exactamente esto: en lugar de preguntar "¿qué tan ancha es la pantalla?", el componente pregunta "¿qué tan ancho es *mi contenedor*?". En Tailwind CSS 4, esta característica llega **nativa**, sin plugins externos (en v3 requería instalar `@tailwindcss/container-queries` por separado).

## 15.1 El Problema que Resuelven

Imagina que tienes `MatchCard.vue` y la usas en dos lugares:

* En un grid de 3 columnas en el dashboard principal (contenedor ancho).
* En una lista lateral de "Próximos Partidos" (contenedor angosto).

Con `md:flex-row`, el componente reacciona al ancho de **toda la ventana del navegador**, no al espacio real que tiene disponible. Resultado: en el sidebar angosto, la tarjeta intentará ponerse en fila (`flex-row`) aunque físicamente no quepa, rompiendo el diseño.

```html
<!-- Este enfoque falla si la tarjeta vive en un sidebar angosto -->
<div class="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
  ...
</div>
```

## 15.2 Activar un Contenedor: `@container`

El primer paso es decirle a un elemento padre que **es** un contenedor de referencia. Se hace con la clase `@container`.

```html
<div class="@container">
  <!-- Los hijos de este div ahora pueden "preguntar" por su ancho -->
</div>
```

A partir de aquí, cualquier descendiente (no solo los hijos directos) puede usar variantes con el prefijo `@` en lugar de `md:`, `lg:`, etc.

### Sintaxis: Variantes de Contenedor

| Variante | Ancho mínimo del contenedor | Equivalente conceptual a... |
| :--- | :--- | :--- |
| `@xs:` | 320px | `sm:` pero relativo al padre |
| `@sm:` | 384px | — |
| `@md:` | 448px | — |
| `@lg:` | 512px | — |
| `@xl:` | 576px | — |
| `@2xl:` | 672px | — |

### Ejemplo Práctico: `MatchCard` que se adapta a su contenedor

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row gap-4 p-4 border rounded-lg bg-white">
    <div class="w-full @md:w-32 h-32 bg-slate-200 rounded shrink-0"></div>
    <div>
      <h3 class="font-bold text-lg">Atlético Naranjos vs. Lobos FC</h3>
      <p class="text-sm text-slate-500">Sábado 18:00 hrs</p>
    </div>
  </div>
</div>
```

Ahora, sin importar si este bloque vive en el sidebar (angosto) o en el área principal (ancha), `@md:flex-row` solo se activa cuando **el contenedor** (no la pantalla) alcanza 448px. La misma `MatchCard` se comporta de forma inteligente en cualquier lugar donde la insertes.

## 15.3 Contenedores con Nombre (`@container/nombre`)

En layouts anidados, puede haber más de un contenedor en juego (por ejemplo, un contenedor general de la página y otro específico de una tarjeta interna). Para evitar ambigüedad, Tailwind 4 permite **nombrar** contenedores.

```html
<div class="@container/sidebar w-72">
  <div class="@container/card p-4">

    <!-- Reacciona al contenedor "card", no al "sidebar" -->
    <p class="@md/card:text-lg">Texto que crece según la tarjeta</p>

    <!-- Reacciona al contenedor "sidebar" -->
    <p class="@lg/sidebar:hidden">Se oculta si el sidebar completo es angosto</p>

  </div>
</div>
```

## 15.4 Consultar el Tamaño (`@min-*` y valores arbitrarios)

Si los breakpoints estándar no se ajustan a tu diseño, puedes usar valores arbitrarios directamente:

```html
<div class="@container">
  <div class="grid grid-cols-1 @min-[500px]:grid-cols-2">
    ...
  </div>
</div>
```

## 15.5 Variantes `@max-*` y Rangos de Contenedor

Todas las variantes que hemos visto hasta ahora (`@md:`, `@lg:`, `@min-[500px]:`) aplican el estilo **a partir de** cierto ancho del contenedor, igual que `md:` en el viewport. Pero a veces necesitas justo lo contrario: un estilo que se aplique **por debajo** de un tamaño de contenedor. Para eso existen las variantes `@max-*`.

```html
<div class="@container">
  <!-- Se apila en columna solo cuando el contenedor es angosto -->
  <div class="flex flex-row @max-md:flex-col gap-4 p-4 border rounded-lg">
    <div class="w-32 h-32 bg-slate-200 rounded shrink-0"></div>
    <p>Alineación de la Copa Sudamericana, fase de grupos</p>
  </div>
</div>
```

Aquí `@max-md:flex-col` funciona al revés que `@md:flex-row`: en vez de activarse cuando el contenedor **crece**, se activa mientras el contenedor sigue **por debajo** de 448px. Es el equivalente, dentro de un contenedor, a lo que `max-md:` hace con el viewport.

### Combinar variantes para definir un rango

Puedes encadenar una variante normal (`@sm:`) con una `@max-*` (`@max-lg:`) para que el estilo aplique **solo dentro de un rango** de anchos del contenedor, ni antes ni después:

```html
<div class="@container">
  <!-- Fila de resultados: solo en columna cuando el contenedor
       mide entre @sm (384px) y @lg (512px) -->
  <div class="flex flex-row @sm:@max-lg:flex-col gap-4 p-4 border rounded-lg">
    <span>Tigres del Norte 2 — 1 Halcones FC</span>
  </div>
</div>
```

Fuera de ese rango —ya sea porque el contenedor es más angosto que `@sm` o más ancho que `@lg`— la clase `@sm:@max-lg:flex-col` simplemente no se aplica y prevalece el `flex-row` por defecto.

::: tip 💡 Consejo del Diseñador Frontend:
Los rangos de contenedor (`@sm:@max-lg:...`) son útiles para esos "tamaños intermedios incómodos" donde un componente no cabe cómodo ni con el layout angosto ni con el ancho. No abuses de ellos: si necesitas más de un rango para un mismo componente, probablemente es momento de dividirlo en variantes más simples o replantear su diseño.
:::

## 15.6 Container Queries vs. Media Queries: Cuándo usar cada una

| Escenario | Herramienta correcta | Razón |
| :--- | :--- | :--- |
| Cambiar el layout general de la **página** (navbar, sidebar visible/oculto) | Media Query (`md:`, `lg:`) | El layout de página depende del dispositivo del usuario. |
| Un **componente reutilizable** que se coloca en distintos contextos (tarjetas, widgets) | Container Query (`@md:`) | El componente no sabe (ni le importa) el tamaño de la pantalla; solo le importa su espacio disponible. |
| Un formulario que a veces va en un modal angosto y a veces en una página completa | Container Query | El mismo componente debe verse bien en ambos contextos sin duplicar código. |

::: tip 💡 Consejo del Diseñador Frontend:
La regla mental más simple: **si estás diseñando la estructura general del sitio (el "esqueleto"), usa media queries. Si estás diseñando un componente reutilizable que viajará por distintas partes de tu app, usa container queries.** En proyectos como tus proyectos, casi todos tus componentes de `components/ui/` deberían pensarse con `@container` desde el día uno; les da una portabilidad que un `md:` nunca podría ofrecer.
:::

## 15.6 Container Query Units (`cqw`, `cqh`)

Tailwind 4 también expone unidades CSS nativas relativas al contenedor a través de valores arbitrarios, útiles para tipografía fluida dentro de una tarjeta:

```html
<div class="@container">
  <h1 class="text-[5cqw]">Título fluido según el ancho del contenedor</h1>
</div>
```

::: tip 💡 Consejo del Diseñador Frontend:
Usa `cqw` (container query width) con moderación, solo en piezas decorativas como títulos de hero dentro de tarjetas. Para texto de lectura (párrafos, labels), sigue usando la escala fija de `text-*`: garantiza mejor legibilidad y consistencia que un tamaño que depende matemáticamente del contenedor.
:::
