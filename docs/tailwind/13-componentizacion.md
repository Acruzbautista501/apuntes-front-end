# MÓDULO 13 — Componentización Profesional

La componentización es el paso de "escribir HTML con clases" a "construir una interfaz de usuario como una aplicación de software". Para proyectos como **Soccer League Elite** o **CitaFacil**, donde la escalabilidad y el mantenimiento son críticos, Tailwind CSS no debe usarse como una lista interminable de clases en el HTML, sino como el motor de diseño de componentes encapsulados.

## 13.1 Reutilización de Clases: El paso de "Utilidades" a "Componentes"

En el desarrollo tradicional, solíamos reutilizar código creando clases CSS globales (ej. `.btn-primary { ... }`). En Tailwind, existe la tentación de hacer lo mismo usando `@apply` para copiar esas clases a un nombre nuevo. **Esto es un error de arquitectura.**

Si estás trabajando con Vue 3, la verdadera reutilización no ocurre en el CSS, sino en el **Componente**. La reutilización de clases mediante utilidades es una etapa transitoria; la reutilización mediante componentes es tu objetivo final.

### El "Antipatrón": Repetición de Clases (Lo que debes evitar)

Cuando copias y pegas las mismas 10 clases en 20 botones diferentes, has creado una **deuda técnica**. Si mañana el diseño cambia (por ejemplo, decides que todos los botones deben ser más redondeados), tendrás que editar 20 archivos manualmente.

**Ejemplo de lo que NO debes hacer:**
```html
<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Guardar</button>

<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Editar</button>
```

### La Solución Profesional: Componentes con Props

En lugar de crear una clase CSS personalizada, crea un componente `BaseButton.vue`. Esto centraliza el diseño. Tailwind 4 funciona de maravilla aquí porque tus variables semánticas (ej. `--color-brand`) se heredan perfectamente.

#### Código: `BaseButton.vue` (El estándar de oro)

```vue
<script setup lang="ts">
// Definimos las propiedades para que el botón sea flexible
interface Props {
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary'
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'px-4 py-2 rounded-lg transition-all duration-200 font-semibold',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Lógica de variantes (Tailwind 4 variables)
      variant === 'primary' 
        ? 'bg-brand-primary text-white hover:bg-brand-primary/90' 
        : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
    ]"
  >
    <slot />
  </button>
</template>
```

### ¿Por qué esto es superior?

1.  **Única Fuente de Verdad:** Si cambias el `rounded-lg` por `rounded-full` en `BaseButton.vue`, se actualiza automáticamente en toda tu aplicación.
2.  **Flexibilidad (Slots):** Al usar `<slot />`, el botón puede contener texto, iconos o incluso spinners de carga sin tener que modificar el componente base.
3.  **Estado Integrado:** El componente maneja estados (como `disabled`) de forma nativa. No tienes que recordar añadir clases de opacidad cada vez que creas un botón nuevo.

### El "Trampa" del `@apply`

Muchos desarrolladores preguntan: *¿Por qué no usar simplemente `@apply` en un CSS?*

Ejemplo:
```css
/* Esto es lo que debes evitar si usas Vue/React */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg;
}
```

**Por qué evitarlo:**
* **Leaky Abstractions:** Al usar `@apply`, estás ocultando las clases de Tailwind. Cuando necesites hacer un ajuste minúsculo (ej. más padding en un botón específico de *Soccer League Elite*), te verás obligado a crear otra clase o añadir más estilos en línea, ensuciando tu código.
* **Mantenibilidad:** Es mucho más fácil buscar `<BaseButton />` en tu IDE que buscar una clase CSS que podría estar en cualquier archivo.


::: tip 💡 Consejo del Diseñador Frontend:
Tailwind CSS 4 es extremadamente rápido, pero la **limpieza de tu DOM** también importa. Al usar componentes, generas un HTML más limpio y semántico. Si te preocupa el rendimiento, recuerda que los componentes de Vue se compilan y no tienen costo de "estilo" en tiempo de ejecución. 
:::

## 13.2 Extraer Componentes: El Arte del Encapsulamiento

Extraer componentes no significa simplemente "cortar y pegar" código para acortar un archivo. **Extraer es crear un contrato de diseño.** Cuando extraes un componente, estás definiendo una API (interfaz) para ese elemento: qué datos recibe (props), qué eventos emite y qué contenido puede proyectar (slots).

En proyectos profesionales, el objetivo de la extracción es la **independencia**: el componente debe ser capaz de renderizarse correctamente sin conocer el contexto donde se usa.

### La Filosofía del "Contrato de Componente"

En lugar de que tu página padre (ej. `Dashboard.vue`) controle el padding, el color de borde y la sombra de una tarjeta, el componente hijo (`MatchCard.vue`) debe poseer esos estilos. La página padre solo debe enviar los datos.

#### Ejemplo de Extracción Profesional: `MatchCard.vue`

Supongamos que en *Soccer League Elite* tienes tarjetas de partidos. No escribas el HTML dentro de la vista principal; extráelo a su propio componente.

```vue
<script setup lang="ts">
// Definimos el contrato: qué datos necesita el componente para existir
interface Props {
  homeTeam: string;
  awayTeam: string;
  score: string;
  date: string;
  status?: 'live' | 'finished' | 'scheduled';
}

// Valores por defecto para props opcionales
withDefaults(defineProps<Props>(), {
  status: 'scheduled'
});
</script>

<template>
  <div class="bg-surface border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex justify-between items-center mb-4">
      <span class="text-xs font-bold uppercase text-brand-accent tracking-wider">
        {{ date }}
      </span>
      <span :class="[
        'px-2 py-1 rounded-full text-[10px] font-bold',
        status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'
      ]">
        {{ status.toUpperCase() }}
      </span>
    </div>

    <div class="flex justify-between items-center font-bold text-lg text-text-main">
      <span>{{ homeTeam }}</span>
      <span class="text-2xl">{{ score }}</span>
      <span>{{ awayTeam }}</span>
    </div>
  </div>
</template>
```

### Por qué esta forma de extraer es "Senior"

1.  **Encapsulamiento de Estilos:** Si decides que el borde de las tarjetas debe ser más grueso, lo cambias en `MatchCard.vue` y se actualiza en toda la aplicación. No tienes que buscar clases en 10 páginas diferentes.
2.  **API Clara:** El desarrollador que usa tu componente (`<MatchCard homeTeam="..." ... />`) no tiene que saber qué clases de Tailwind se usan. Solo sabe qué datos debe pasar. Esto reduce la fricción en equipos de trabajo.
3.  **Lógica Local:** Observa cómo el estado (`live` vs `scheduled`) se gestiona dentro del componente mediante clases dinámicas. El componente es "inteligente"; sabe cómo pintarse a sí mismo según el estado.

### Cuándo extraer (Regla de los tres usos)

* **Uso 1:** Escríbelo directamente en la vista. No lo extraigas aún; no sabes si el diseño es definitivo.
* **Uso 2:** Empiezas a ver repetición. Considera extraerlo si el código es complejo.
* **Uso 3:** **Extracción Obligatoria.** Si copias y pegas el código por tercera vez, estás creando deuda técnica. Extrae el componente inmediatamente.

::: tip 💡 Consejos del Diseñador Frontend:
* **Props vs. Clases:** Nunca pases clases de Tailwind como *props* (ej. `class="mt-10"`). Esto rompe la encapsulación porque el padre está controlando el estilo del hijo. Si necesitas variantes de diseño (ej. una tarjeta más grande), añade una prop llamada `size` y maneja las clases internamente en el componente.
* **Slots:** Si el componente tiene partes que cambian mucho (por ejemplo, una sección de "acciones" en la tarjeta de partido), no intentes manejarlo con props booleanas. Usa `<slot name="actions" />`. Esto permite que el componente sea un contenedor flexible mientras mantiene su estructura visual base.
:::

## 13.3 Patrones DRY (Don't Repeat Yourself)

El principio **DRY (Don't Repeat Yourself)** es fundamental en el desarrollo de software, pero en el mundo de la UI con Tailwind CSS, existe una confusión común. Muchos desarrolladores intentan aplicar DRY eliminando la repetición de *clases* en el HTML, cuando en realidad, la repetición de clases es la esencia del enfoque *utility-first*.

El verdadero DRY en Tailwind no trata de evitar que escribas `flex` diez veces; trata de evitar que **repitas la estructura, la lógica y los estados** de tus componentes.

### La Distinción Crítica: Clases vs. Lógica

Es vital que entiendas esta diferencia para no caer en trampas de mantenimiento:

* **Clases (Utility-First):** Está perfectamente bien repetir clases. Si necesitas 50 botones con `bg-blue-600`, escríbelo 50 veces. Tailwind está optimizado para esto.
* **Lógica/Estructura (DRY):** **Aquí es donde aplicas DRY.** Si tus 50 botones tienen el mismo `padding`, `border-radius`, `transition` y estado `disabled`, no repitas esa lógica. **Extrae un componente.**

### Patrones de Abstracción Senior

Para mantener tus proyectos como *Soccer League Elite* o *CitaFacil* limpios, no intentes crear un "Componente Supremo" con 20 props. Eso genera **prop drilling** y un código ilegible. Usa estos dos patrones:

#### 1. Patrón de Composición (Slots)
En lugar de pasar props para todo (ej. `:show-icon="true"`, `:icon-name="'check'"`), usa **Slots**. Esto permite que el componente padre controle la estructura interna del hijo, manteniendo el componente hijo extremadamente "seco" (DRY) y genérico.

#### 2. Patrón de Renderizado Condicional
Si tienes un componente que a veces es un `div` y a veces un `a` (como un botón que a veces es un link), no hagas dos componentes. Usa un componente único que acepte un `as` (o `tag`) para renderizar el elemento HTML correcto.

### Código: Implementación DRY Profesional

Mira cómo un componente de "Tarjeta" (`BaseCard`) puede ser DRY sin ser rígido ni excesivamente complejo.

```vue
<script setup lang="ts">
// DRY: No definimos props para cada elemento interno. 
// Dejamos que el padre decida el contenido mediante slots.
</script>

<template>
  <article class="bg-surface border border-slate-200 rounded-xl p-6 shadow-sm">
    
    <header v-if="$slots.header" class="mb-4 border-b pb-4">
      <slot name="header" />
    </header>

    <main class="text-text-main">
      <slot />
    </main>

    <footer v-if="$slots.footer" class="mt-6 pt-4 border-t">
      <slot name="footer" />
    </footer>
    
  </article>
</template>
```

#### Uso en tu Vista (Extremadamente limpio):
```vue
<BaseCard>
  <template #header>
    <h3 class="font-bold">Detalle del Partido</h3>
  </template>
  
  <p>Resultado: 3 - 1</p>
  
  <template #footer>
    <button class="bg-brand-primary text-white px-4 py-2 rounded">Ver Acta</button>
  </template>
</BaseCard>
```

::: tip 💡 Reglas de Oro para un DRY efectivo
1.  **Regla de los tres usos:** No extraigas lógica o componentes hasta que hayas repetido el patrón tres veces. Si lo haces prematuramente, crearás abstracciones "falsas" que luego tendrás que deshacer cuando los requisitos cambien.
2.  **Composables para lógica:** Si notas que estás repitiendo lógica de JavaScript (ej. cálculos de fechas en *Soccer League Elite* o validación de formularios en *CitaFacil*), no lo metas en el componente de UI. Crea un **Composable** (ej. `useDateFormatter.ts`). Eso es DRY a nivel de lógica.
3.  **Evita el "Componente Frankenstein":** Si tu componente necesita un `v-if` para cada prop que recibe, estás haciendo algo mal. Ese componente intenta ser demasiadas cosas a la vez. Es mejor tener dos componentes distintos que un solo componente complejo que intente ser todo.
:::

## 13.4 Organización Escalable (Arquitectura de Proyectos)

En el desarrollo de software, la arquitectura de archivos no es un tema estético; es una decisión de **supervivencia**. Si tu proyecto crece y todo está en una sola carpeta `components/`, llegará un punto donde tardarás más buscando un archivo que escribiendo código. Esta es la fase donde los desarrolladores sufren de "fatiga de navegación".

Para proyectos como *Soccer League Elite* o *CitaFacil*, necesitamos un modelo **Híbrido de Escalabilidad**: combinamos una estructura por *tipos* (para componentes base) y una estructura por *dominios o características* (para lógica de negocio).

### La Arquitectura Recomendada: "Domain-Driven"

Esta estructura separa lo que es *genérico* (UI, utilidades) de lo que es *específico del negocio* (lógica de ligas, gestión de citas).

#### Propuesta de Estructura de Directorios

```text
src/
├── assets/           # CSS Global (theme.css), Imágenes
├── components/
│   ├── ui/           # "Átomos": Botones, Inputs, Modales (Genéricos)
│   └── features/     # Componentes de Negocio:
│       ├── matches/  # Todo lo relacionado a partidos (Soccer League)
│       │   ├── MatchCard.vue
│       │   ├── MatchList.vue
│       │   └── useMatchService.ts
│       └── appointments/ # Todo lo relacionado a citas (CitaFacil)
│           ├── AppointmentForm.vue
│           └── AppointmentCalendar.vue
├── composables/      # Lógica global (ej. useAuth, useTheme)
├── services/         # Llamadas API (Axios / Fetch)
├── types/            # Definiciones de TypeScript (interfaces)
└── views/            # Páginas (Rutas de la aplicación)
```

### Por qué esta organización es superior

1.  **Colocación (Colocation):** Fíjate en la carpeta `features/matches/`. Aquí guardamos el componente (`MatchCard.vue`) y su lógica asociada (`useMatchService.ts`) en el mismo lugar. Esto evita saltar entre carpetas lejanas cada vez que cambias algo en el flujo de "Partidos".
2.  **Desacoplamiento:** La carpeta `components/ui/` es totalmente independiente. Puedes copiar esa carpeta y pegarla en otro proyecto mañana, y funcionará perfectamente porque no tiene dependencias de negocio.
3.  **Navegación Intuitiva:** Cuando necesites arreglar un bug en la sección de "Partidos", sabes exactamente que debes ir a `features/matches/`. No tienes que adivinar dónde está.

### Pro-Tip Senior: El patrón "Index" (Barrel Files)

Para evitar imports infinitos y feos como `import Button from '../../../components/ui/Button.vue'`, usa archivos `index.ts` (conocidos como *Barrel Files*).

#### 1. Crea un `index.ts` en tus carpetas clave:
```typescript
// src/components/ui/index.ts
export { default as BaseButton } from './BaseButton.vue';
export { default as BaseInput } from './BaseInput.vue';
export { default as BaseCard } from './BaseCard.vue';
```

#### 2. Importa de forma limpia en cualquier parte del proyecto:
```typescript
// En tu View o Componente
import { BaseButton, BaseCard } from '@/components/ui';

// VS Code te autocompletará esto perfectamente.
```

### Reglas de oro para mantener la estructura

* **No crees carpetas profundas si no es necesario:** Si tu proyecto es pequeño, no crees 5 niveles de carpetas. La complejidad debe ser proporcional al tamaño del proyecto.
* **Componentes de página única:** Si un componente es tan específico que *solo* se usa en una página (ej. `MatchHeaderForEditScreen.vue`), no lo metas en `features/matches/`. Créale una carpeta `components/` dentro de esa vista o mantenlo cerca de la vista. No fuerces la reutilización donde no existe.
* **Mantén los estilos cerca:** Con Tailwind 4, no tienes archivos CSS dispersos. Tu `theme.css` vive en `assets/`, y los estilos específicos de un componente viven en el `template` del componente. Esto mantiene la carga cognitiva baja.

### Consejo del Colaborador (La prueba del escalado)

::: tip 💡 Consejo del Diseñador Frontend:
Hazte esta pregunta: *"Si añado un nuevo desarrollador al equipo mañana, ¿podría encontrar dónde está la lógica de las citas en menos de 2 minutos?"*. Si la respuesta es sí, tu arquitectura es exitosa.

Si tu estructura actual es un caos, no intentes mover todo de golpe. **Refactoriza por demanda**: cuando tengas que trabajar en la sección de "Partidos" de *Soccer League Elite*, aprovecha para mover sus archivos a `features/matches/`. Con el tiempo, el proyecto se organizará solo.
:::