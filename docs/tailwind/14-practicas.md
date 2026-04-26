# MÓDULO 14 — Buenas Prácticas (Nivel Pro)

La diferencia entre un desarrollador que "hace que funcione" y un desarrollador profesional radica en una sola palabra: **Mantenibilidad**. En Tailwind CSS, es increíblemente fácil escribir código que funcione hoy pero sea imposible de modificar mañana. Este módulo establece el estándar de oro para evitar deuda técnica.

## 14.1 Cómo evitar HTML sucio (La gestión de la carga cognitiva)

El "HTML sucio" en Tailwind no es un problema de estilo, es un problema de **mantenibilidad y carga cognitiva**. Cuando un desarrollador senior abre tu archivo y ve una pared de texto con 30 clases mezcladas sin orden, su cerebro tarda el triple de tiempo en procesar qué hace ese elemento.

La limpieza del HTML no debe ser un esfuerzo manual; **debe ser un proceso automatizado.**

### 1. La Regla de Oro: Automatización (Prettier)
Nunca pierdas tiempo ordenando clases manualmente. El estándar de la industria para resolver esto es `prettier-plugin-tailwindcss`. Este plugin no solo ordena tus clases, sino que las agrupa de manera lógica y coherente.

#### Instalación
```bash
npm install -D prettier prettier-plugin-tailwindcss
```

Una vez instalado, Prettier automáticamente detectará el orden correcto cada vez que guardes tu archivo (`Ctrl + S`). Si trabajas con otros en *Soccer League Elite* o *CitaFacil*, esto asegura que el código de todos se vea igual.


### 2. El Orden Mental (Jerarquía de Clases)
El plugin utiliza una jerarquía lógica basada en cómo el navegador interpreta el DOM. Entender este orden te ayudará a detectar "HTML sucio" visualmente, incluso antes de que Prettier lo formatee.

| Orden | Categoría | Qué define |
| :--- | :--- | :--- |
| **1** | **Layout** | Posicionamiento (`flex`, `grid`, `absolute`, `fixed`) |
| **2** | **Box Model** | Tamaño y espacio (`w-*`, `h-*`, `p-*`, `m-*`) |
| **3** | **Typography** | Estilo de texto (`text-*`, `font-*`, `leading-*`) |
| **4** | **Visuals** | Apariencia (`bg-*`, `border-*`, `shadow-*`) |
| **5** | **Effects** | Interactividad (`hover:`, `focus:`, `transition-*`) |

### 3. Ejemplo Práctico: El Antes y el Después

Observa cómo la desorganización "ensucia" el código y dificulta encontrar errores.

#### HTML "Sucio" (Difícil de leer)
Las clases están mezcladas: tamaños, colores y posicionamiento aparecen en desorden aleatorio.
```html
<div class="text-sm p-4 flex bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors w-full border border-blue-400">
  ...
</div>
```

#### HTML "Pro" (Ordenado por el Plugin)
La jerarquía (`flex` -> `w-full` -> `p-4` -> `rounded` -> `bg` -> `border` -> `text` -> `hover`) permite leer el elemento como si fuera una oración.
```html
<div class="flex w-full rounded-lg border border-blue-400 bg-blue-500 p-4 text-sm transition-colors hover:bg-blue-600">
  ...
</div>
```

### 4. ¿Cuándo el formato no es suficiente? (La línea divisoria)

Incluso con Prettier, a veces el HTML sigue viéndose "sucio". **Aquí es donde entra la componentización**.

* **Si el HTML tiene más de 15 clases:** No intentes formatearlo. Extrae ese elemento a un componente (como vimos en el Módulo 13). 
* **La prueba del "Vistazo":** Si al mirar el HTML no puedes identificar en 2 segundos qué hace ese elemento (¿es un botón? ¿es un contenedor de perfil?), entonces tu HTML está demasiado denso.

::: tip 💡 Consejo del Diseñador Frontend:
Si ves que tu HTML tiene muchas clases de estado (ej: `hover:bg-red-500 hover:text-white focus:ring-2 focus:ring-red-500`), no ensucies el componente padre con estas clases. Crea una **variante de componente** o simplemente extrae la lógica a un componente visual dedicado.
:::

## 14.2 ¿Cuándo usar demasiadas clases? (La paradoja del Utility-First)

Muchos desarrolladores sienten ansiedad al ver 20 o 30 clases en un solo elemento HTML. Creen que están escribiendo "código sucio". **La realidad es que en Tailwind, un número alto de clases no es intrínsecamente malo.**

La filosofía *utility-first* depende precisamente de esa composición. El problema no es el *número* de clases, sino la **legibilidad** y la **repetición**.

### El Diagnóstico: ¿Cuándo es "demasiado"?

No te guíes por un número arbitrario. Guíate por la **carga cognitiva**. Debes extraer a un componente cuando el código deja de ser legible o cuando la misma configuración se repite en más de dos lugares.

#### 1. El escenario aceptable: Clases Inline
Si un elemento es único en tu aplicación (por ejemplo, el diseño específico de una página de inicio) y no se reutiliza, es perfectamente aceptable tener muchas clases. Tailwind está diseñado para esto.

**Tip Pro:** Usa multilínea en tu editor para organizar las clases por categorías. Tailwind lo permite y mejora drásticamente la lectura.

```html
<div 
  class="
    flex flex-col items-center justify-center 
    w-full max-w-4xl mx-auto 
    bg-gradient-to-r from-emerald-500 to-teal-600 
    p-8 rounded-2xl shadow-xl
  "
>
  <h1 class="text-white text-3xl font-bold">Bienvenido</h1>
</div>
```

#### 2. El escenario inaceptable: "Duplicación de lógica"
Aquí es donde "demasiadas clases" se convierte en deuda técnica. Si este botón, con todas sus clases, lo necesitas en 5 lugares diferentes, **no es un problema de cantidad de clases, es un problema de mantenimiento.**

```html
<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition-all duration-200">Guardar</button>
<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition-all duration-200">Editar</button>
```

### La Matriz de Decisión (Cuándo abstraer)

Usa esta matriz mental para decidir si tienes "demasiadas clases" o si es simplemente el uso correcto de Tailwind:

| Situación | Acción | Razón |
| :--- | :--- | :--- |
| Elemento único (layout único) | **Manténlo inline** | No compliques la arquitectura con abstracciones innecesarias. |
| Elemento repetitivo (botones, cards) | **Extrae a componente** | Dry (Don't Repeat Yourself). Facilita cambios globales. |
| Elemento muy complejo (50+ clases) | **Extrae a componente** | Incluso si es único, 50 clases ocultan el propósito del HTML. |

### Cómo manejar "Demasiadas clases" (Refactorización)

Si sientes que el HTML es inmanejable, pero no quieres (o no puedes) crear un componente completo, usa **objetos de clase** en tu script (Vue 3 / React). Esto mantiene tu HTML limpio y la lógica de estilos en el script.

#### Ejemplo de refactorización pro:

```vue
<script setup lang="ts">
import { computed } from 'vue';

// Definimos las clases dinámicas en el script
const buttonStyles = computed(() => [
  'bg-blue-600 hover:bg-blue-700',
  'text-white font-bold py-2 px-4',
  'rounded shadow transition-all duration-200'
]);
</script>

<template>
  <button :class="buttonStyles">
    Guardar
  </button>
</template>
```

### Resumen para tu desarrollo
* **No temas a las clases largas** si el elemento es único y el código es legible (usa multilínea).
* **Temed a la repetición.** Si ves que estás copiando y pegando grupos de clases, estás usando "demasiadas clases" de la manera incorrecta.
* **Usa la técnica de `computed` o `cva`** (Class Variance Authority) si necesitas manejar muchas variantes (ej: botones de diferentes colores, tamaños y estados) sin ensuciar tu HTML.

## 14.3 Cuándo abstraer componentes: La línea fina

La abstracción es un arma de doble filo. Si no abstraes, tu código se vuelve repetitivo y difícil de actualizar (deuda técnica). Si abstraes demasiado pronto (abstracción prematura), terminas con un proyecto lleno de archivos "fantasmas" de 5 líneas que añaden complejidad innecesaria al navegar por tu código.

Para proyectos SaaS como **Soccer League Elite** o **CitaFacil**, la clave es la **moderación estratégica**.

### La Regla de los Tres Usos
Como regla general, no extraigas un componente hasta que hayas copiado y pegado la estructura al menos **tres veces**.

1.  **Primer uso:** Escríbelo inline en tu página. Aprende cómo se siente el diseño.
2.  **Segundo uso:** Si es un elemento complejo (ej. una tarjeta con mucha lógica), considera extraerlo.
3.  **Tercer uso:** **Es obligatorio.** Si copias y pegas por tercera vez, has encontrado un patrón real que merece ser encapsulado.

### ¿Cuándo abstraer obligatoriamente? (La Prueba de Complejidad)

Independientemente de la "Regla de los tres usos", debes abstraer inmediatamente si cumple alguno de estos criterios:

* **Lógica de Estado:** Si el elemento requiere lógica JavaScript para cambiar su apariencia (ej. un `button` que cambia de color según el estado `loading`, `error` o `success`).
* **Carga Cognitiva:** Si el elemento tiene más de 15-20 clases de Tailwind. Aunque solo se use una vez, si es ilegible, extráelo para que tu vista principal se lea como un índice (semántico) y no como un libro de estilo (utilidades).
* **Contrato de Datos:** Si el elemento necesita recibir props (datos externos) para mostrarse correctamente.

### Código: Evolución de un Elemento

Veamos el caso de un "Badge de Estado" para los partidos en *Soccer League Elite*.

#### Paso 1: El inicio (Inline)
No abstraigas. Es simple y está bien aquí.
```html
<span class="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
  Finalizado
</span>
```

#### Paso 2: El punto de quiebre (Lógica)
Ahora necesitas manejar diferentes estados (`live`, `scheduled`, `finished`). La lógica en el HTML ensucia la vista. **Aquí abstraemos.**

```vue
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status: 'live' | 'finished' | 'scheduled' }>();

const statusStyles = computed(() => ({
  'live': 'bg-red-100 text-red-800 animate-pulse',
  'finished': 'bg-slate-100 text-slate-800',
  'scheduled': 'bg-blue-100 text-blue-800'
}[props.status]));
</script>

<template>
  <span :class="['px-2 py-1 text-xs font-bold rounded-full', statusStyles]">
    {{ status.toUpperCase() }}
  </span>
</template>
```

### Matriz de Decisión: ¿Debería extraer esto?

Si tienes dudas, consulta esta tabla mental antes de crear un nuevo archivo:

| Situación | ¿Abstraer? | ¿Por qué? |
| :--- | :--- | :--- |
| Elemento único de página | **NO** | Evitas "boilerplate" innecesario. |
| Patrón visual repetido | **SÍ** | DRY (Don't Repeat Yourself). |
| HTML con >20 clases | **SÍ** | Mejora la legibilidad del archivo padre. |
| Lógica compleja (JS) | **SÍ** | Separas la lógica de la presentación. |
| Componente sin props | **NO** | Probablemente solo necesites un archivo de CSS global o constantes. |

::: tip 💡 Consejos del Diseñador Frontend:
* **No seas purista:** A veces, tener un componente que solo se usa una vez está bien si ese componente es "la caja que contiene toda la lógica de una sección compleja". La abstracción no es solo para reutilizar, es para **organizar**.
* **El costo del componente:** Recuerda que cada componente tiene un costo de mantenimiento: tienes que darle nombre, pensar en sus props y documentarlo. Solo paga ese precio si el beneficio de limpieza es claro.
:::

## 14.4 Naming y Organización Visual (Arquitectura del Caos al Orden)

El *naming* (nomenclatura) y la organización son los pilares que separan un proyecto que escala de uno que se colapsa. En Tailwind CSS, el *naming* no solo ocurre en tus clases, sino fundamentalmente en tus **variables CSS** dentro del bloque `@theme`.

### 1. Naming Semántico: "Intención" sobre "Descripción"

El error más grave es nombrar variables o clases basándote en cómo se ven (descripción). **Nómbralas basándote en para qué sirven (intención).**

#### El Problema del Naming Funcional
Si nombras tu variable `--color-blue-dark`, y en seis meses decides que *Soccer League Elite* tendrá una paleta de colores "Negro y Dorado", esa variable `--color-blue-dark` se vuelve una mentira en tu código.

#### La Solución: Naming Semántico (Pro)
Define roles. Si el color es para fondos principales, nómbralo según su función.

```css
/* theme.css - Estrategia Semántica */
@theme {
  /* MAL: --color-blue-dark: #1e3a8a; */
  
  /* BIEN: Define roles de la aplicación */
  --color-brand-primary: #1e3a8a; /* El color de tu marca */
  --color-surface-main: #ffffff;  /* Fondo principal */
  --color-surface-muted: #f8fafc; /* Fondo secundario/gris claro */
  --color-text-emphasis: #0f172a; /* Texto importante */
}
```

### 2. Organización Visual: El "Orden del DOM"

El orden en el que escribes tus clases dentro del atributo `class="..."` importa. Si mezclas aleatoriamente `flex` con `text-sm` y `bg-red`, el ojo humano no puede "escanear" el código.

**La Regla del Flujo de Diseño:** Sigue el flujo del navegador.

| Categoría | Concepto | Ejemplo |
| :--- | :--- | :--- |
| **1. Layout** | ¿Dónde está el elemento? | `flex`, `grid`, `absolute`, `z-10` |
| **2. Box Model** | ¿Qué tamaño/espacio ocupa? | `w-full`, `h-screen`, `m-4`, `p-2` |
| **3. Typo** | ¿Cómo se ve el texto? | `text-lg`, `font-bold`, `leading-tight` |
| **4. Visuals** | ¿Colores y decoraciones? | `bg-surface-main`, `border-2`, `shadow-md` |
| **5. States** | ¿Qué pasa al interactuar? | `hover:bg-brand-primary`, `transition` |

#### Ejemplo Pro:
```html
<div class="flex items-center justify-between w-full p-6 text-lg font-bold bg-surface-main border border-slate-200 transition-all hover:bg-surface-muted">
  ...
</div>
```

### 3. Organización de Archivos y Componentes

Para proyectos como *CitaFacil* o *Soccer League Elite*, la organización debe seguir una jerarquía de "baja a alta fidelidad".

* **`components/ui/`**: Componentes atómicos. *Naming:* PascalCase (ej. `BaseButton.vue`).
* **`components/features/`**: Lógica de negocio. *Naming:* Basado en el dominio (ej. `AppointmentCalendar.vue`).
* **`composables/`**: Funciones de lógica. *Naming:* `use[Accion].ts` (ej. `useLeagueMatch.ts`).

### 4. Clean Code Checklist (Resumen para tus proyectos)

Para asegurar que tu código sea profesional, revisa siempre estos tres puntos antes de subir un commit:

1.  **¿El nombre de la variable CSS es genérico?**
    * Si es `var(--color-primary)`, excelente.
    * Si es `var(--color-sky-500)`, considera si deberías abstraerlo a un nombre de rol.
2.  **¿Mis clases siguen el flujo del navegador?**
    * Si tienes `bg-red` antes que `flex`, usa el plugin de Prettier para que se ordene automáticamente.
3.  **¿La jerarquía de carpetas es predecible?**
    * Si un nuevo desarrollador tiene que adivinar dónde está el archivo `MatchCard.vue`, la organización visual de tus archivos necesita ajustes.

::: tip 💡 Regla de oro:
Si te toma más de 5 segundos entender qué hace un componente por su nombre y dónde encontrar su lógica, es hora de renombrar o reorganizar.
:::

## 14.5 Clean Code con Tailwind: El Arte de la Legibilidad

El "Clean Code" en el ecosistema Tailwind no se trata de escribir menos clases; se trata de escribir clases que **cuenten una historia**. Cuando un desarrollador abre tu archivo, no debería tener que descifrar qué hace cada propiedad CSS; debería entender el propósito funcional del elemento en segundos.

### La Filosofía del DOM Semántico

Un código limpio en Tailwind es aquel donde el HTML se lee como un esquema funcional, no como una hoja de estilos desglosada. Para lograr esto, aplicamos tres pilares: **Separación de Lógica**, **Nomenclatura Semántica** y **Encapsulamiento de Estados**.

#### 1. Separación de Lógica (Vue 3 Context)
El error más común es ensuciar la etiqueta `<template>` con lógica condicional compleja. Si tienes `v-if`, `v-for` y operaciones ternarias (`? :`) dentro de tu `class=""`, el código es difícil de testear y mantener.

* **Regla:** Si una clase depende de un estado (ej. "si está activo, verde; si no, rojo"), **mueve esa lógica al `script`**.

#### 2. Evitar el "Magic String"
No inyectes valores arbitrarios directamente en el HTML si puedes evitarlos. Utiliza tus variables definidas en `@theme` (Módulo 12). Esto asegura que si el diseño de *Soccer League Elite* cambia, solo tengas que actualizar un archivo CSS y todo el sistema se ajuste automáticamente.

### Código: Refactorización Profesional (Antes vs. Después)

Imagina un componente de "Estado de Partido" que muestra un punto parpadeante si el partido es en vivo.

#### ❌ Código "Sucio" (Difícil de mantener)
Aquí, el HTML tiene demasiada carga mental. Entender qué hace requiere leer varias condiciones.
```vue
<template>
  <div class="flex items-center gap-2 p-4 rounded-lg border" 
       :class="match.isLive ? 'bg-red-50 border-red-200' : 'bg-gray-100 border-gray-200'">
    <span class="w-2 h-2 rounded-full" 
          :class="match.isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'"></span>
    <span class="font-bold" :class="match.isLive ? 'text-red-900' : 'text-gray-900'">
      {{ match.status }}
    </span>
  </div>
</template>
```

#### ✅ Código "Clean" (Nivel Profesional)
Hemos movido la lógica a una propiedad computada. El HTML ahora es declarativo: simplemente muestra el estado.
```vue
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ match: Match }>();

// La lógica está centralizada, tipada y es fácil de leer
const matchStatusClasses = computed(() => ({
  container: props.match.isLive 
    ? 'bg-red-50 border-red-200' 
    : 'bg-gray-100 border-gray-200',
  indicator: props.match.isLive 
    ? 'bg-red-500 animate-pulse' 
    : 'bg-gray-400',
  text: props.match.isLive 
    ? 'text-red-900' 
    : 'text-gray-900'
}));
</script>

<template>
  <div class="flex items-center gap-2 p-4 rounded-lg border" :class="matchStatusClasses.container">
    <span class="w-2 h-2 rounded-full" :class="matchStatusClasses.indicator"></span>
    <span class="font-bold" :class="matchStatusClasses.text">
      {{ match.status }}
    </span>
  </div>
</template>
```

### Lista de Control de Clean Code para tus Proyectos

Para mantener la calidad de *CitaFacil* y *Soccer League Elite*, aplica este checklist antes de hacer un commit:

| Principio | Acción | ¿Por qué? |
| :--- | :--- | :--- |
| **Declarativo** | ¿El nombre de la clase describe *qué* hace? | El código debe ser autodescriptivo. |
| **Lógica Extraída** | ¿La lógica condicional está en el `<script>`? | Facilita las pruebas unitarias. |
| **Sin Magia** | ¿Hay valores `px` o hex hardcoded? | Deben ir en `@theme` o ser constantes. |
| **Consistencia** | ¿El orden de clases sigue la convención? | Reduce la fatiga visual. |
| **Componentización** | ¿Este bloque tiene más de 20 líneas? | Reduce la complejidad del archivo padre. |

### Consejos de Colaborador

1.  **Tipado fuerte:** En Vue 3 + TypeScript, siempre tipa tus `props`. Si un componente recibe un objeto, crea una `interface`. Esto habilita el autocompletado y previene errores de "cero" en tiempo de ejecución.
2.  **No fuerces la abstracción:** Si el código "clean" es demasiado complejo para una funcionalidad simple, no lo fuerces. El equilibrio es clave: si el código se entiende perfectamente con 5 clases, déjalo así. No sobre-ingenierices.
3.  **Usa `cva` (Class Variance Authority):** Si te encuentras creando muchas `computed properties` para manejar variantes de componentes (ej: `button-primary`, `button-outline`, `button-large`), investiga la librería `cva`. Es el estándar industrial para gestionar variantes de Tailwind de forma limpia y tipada.



::: tip 💡 Consejos del Diseñador Frontend:
1.  **Evita el `@apply` en CSS:** Solo úsalo si es estrictamente necesario para estilos globales. Si abusas de `@apply`, estás recreando CSS tradicional y perdiendo los beneficios de la inspección visual de Tailwind.
2.  **Tipado fuerte:** En componentes reutilizables, usa `interface` para tus `props`. Si un botón acepta variantes, usa un `enum` o `union type` (`'primary' | 'secondary'`). Esto evita que alguien escriba clases erróneas.
3.  **Documentación interna:** Si creas una variable compleja en `@theme` (ej. una animación con `cubic-bezier`), deja un comentario encima en tu CSS explicando *por qué* ese valor específico.
:::
