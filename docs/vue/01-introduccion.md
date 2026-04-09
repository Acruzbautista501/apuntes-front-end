# Módulo 1: Introducción a Vue.js 3

## 1.1 ¿Qué es Vue y su enfoque *progresivo*?

- **Vue.js** es un *framework* JavaScript para construir interfaces de usuario.
- *Progresivo* significa que puedes usarlo **poco a poco**: desde añadir interactividad a una sola página HTML hasta crear aplicaciones complejas con routing, store, tests, etc.
- Ventajas: sintaxis clara, reactividad sencilla, buen soporte TypeScript, rendimiento con Vite, comunidad activa.

## 1.2 Requisitos y preparación del entorno

### Requisitos mínimos recomendados

- **Node.js**: versión LTS (recomiendo Node 18+).
- **npm** (viene con Node) o `pnpm` / `yarn` si prefieres.
- Editor: **VS Code** (recomendado).

### Extensiones útiles en VS Code

- **Volar** (imprescindible para Vue 3 + TypeScript).
- **ESLint** (ayuda a mantener estilo/errores).
- **Prettier** (formato).
- **GitLens** (opcional).
- **Tailwind CSS IntelliSense** (si luego usas Tailwind).

> Nota: No uses Vetur si trabajas con TypeScript + Vue 3; Volar es la opción recomendada.
> 

## 1.3 Crear un proyecto Vue 3 + TypeScript (Vite)

Abre una terminal y ejecuta (elige npm / pnpm / yarn):

```bash
# con npm
npm create vite@latest mi-vue-app -- --template vue-ts

# o (alternativa)
npm init vite@latest mi-vue-app -- --template vue-ts

# con pnpm
pnpm create vite mi-vue-app --template vue-ts

# con yarn
yarn create vite mi-vue-app --template vue-ts

```

Luego:

```bash
cd mi-vue-app
npm install        # o pnpm install / yarn
npm run dev        # arranca el servidor de desarrollo (Vite)

```

Vite te dará una URL local (por defecto `http://localhost:5173`) — ábrela en tu navegador.

## 1.4 Estructura básica del proyecto (Archivos clave)

Al crear el template `vue-ts`, verás archivos importantes:

```
mi-vue-app/
├─ index.html            # entrada HTML
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ src/
│  ├─ main.ts            # punto de arranque: monta la app
│  ├─ App.vue            # componente raíz
│  ├─ assets/            # imágenes, etc.
│  └─ components/        # tus componentes .vue
└─ public/               # archivos estáticos

```

- `src/main.ts` crea la app `createApp(App).mount('#app')` (con Vue 3 y Composition API normalmente usamos `createApp` o `createSSRApp` si aplica).
- `App.vue` es tu componente raíz (SFC).

## 1.5 ¿Qué es una SFC (Single File Component)?

Una **SFC** es un archivo `.vue` que contiene **Template**, **Script** y **Style** en el mismo archivo:

```vue
<!-- ExampleComponent.vue -->
<template>
  <div>Hola desde template</div>
</template>

<script setup lang="ts">
  // lógica en TypeScript (Composition API)
</script>

<style scoped>
  /* estilos locales a este componente */
</style>

```

- `template`: HTML reactivo con directivas de Vue (`v-for`, `v-if`, `@click`, etc.).
- `script` (a menudo `lang="ts"`): lógica del componente.
- `style`: CSS; `scoped` aísla estilos al componente.

> A veces verás "SFA" (single-file application) o SFC — aquí nos referimos a SFC: HTML + JS + CSS en un archivo.
> 

## 1.6 Primer componente práctico usando `<script setup>`

`<script setup>` es la forma más simple y moderna de escribir lógica en SFCs con Composition API.

**Ejemplo:** `src/components/Counter.vue`

```vue
<template>
  <div class="counter">
    <h3>{{ title }}</h3>
    <p>Cuenta: {{ count }}</p>
    <button @click="decrement">-</button>
    <button @click="increment">+</button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  /* props tipadas */
  const props = defineProps<{ title?: string }>()

  /* estado local (reactivo) */
  const count = ref(0)

  /* métodos */
  function increment() {
    count.value++
  }
  function decrement() {
    count.value--
  }
</script>

<style scoped>
.counter { padding: 1rem; border: 1px solid #ddd; display:inline-block; }
button { margin: 0 0.25rem; }
</style>

```

**Usarlo en `App.vue`:**

```vue
<template>
  <main>
    <Counter title="Mi primer contador" />
  </main>
</template>

<script setup lang="ts">
  import Counter from './components/Counter.vue'
</script>

```

Explicaciones rápidas:

- `ref(0)` crea un valor reactivo: para acceder/modificar usamos `count.value`.
- `defineProps` tipa las props en TS sin necesidad de declarar `export default`.
- No necesitas `return` en `<script setup>` — las variables declaradas son accesibles en el template.


## 1.7 De HTML a Vue: transformar marcado estático en componentes

### HTML estático:

```html
<div class="card">
  <h2>Producto A</h2>
  <button>Comprar</button>
</div>

```

### En Vue, dinámico y reactivo:

```vue
<template>
  <div class="card">
    <h2>{{ product.name }}</h2>
    <button @click="addToCart(product.id)">Comprar</button>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'

  const product = reactive({ id: 1, name: 'Producto A' })
  function addToCart(id: number) {
    console.log('añadir producto', id)
  }
</script>

```

- `{{ variable }}` = interpolación.
- `@click="..."` = escucha de eventos (equiv. `v-on:click`).
- `:class="..."` o `v-bind:attribute` para enlazar atributos.

## 1.8 Composition API vs Options API (visión general y ejemplos)

### Options API (estilo "clásico"):

```vue
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    data() { return { count: 0 } },
    methods: {
      increment() { this.count++ }
    },
    mounted() { console.log('montado') }
  })
</script>

```

### Composition API (modular, recomendado para apps TS):

```vue
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  const count = ref(0)
  function increment() { count.value++ }
  onMounted(() => console.log('montado'))
</script>

```

**Diferencias prácticas**

- *Options* organiza la lógica por opciones (`data`, `methods`, `computed`). Fácil para componentes pequeños.
- *Composition* organiza por **funcionalidad**: todo lo relacionado con "contar" está en un mismo bloque. Mejor para componentes grandes y TypeScript.
- `<script setup>` simplifica aún más la sintaxis de Composition.


## 1.9 Conceptos claves que ya viste (resumen breve)

- `ref()` → para valores primitivos reactivos (`number`, `string`, `boolean`). Acceso: `value`.
- `reactive()` → para objetos/arrays reactivos.
- `computed()` → valores derivados (caché).
- `watch()` → observar cambios y reaccionar.
- `onMounted()` → hook de ciclo de vida cuando el componente se monta.
- `props` y `emits` → comunicación padre-hijo.
- `v-if`, `v-for`, `v-show`, `v-bind`, `v-on` → directivas de template.


## 1.10 Buenas prácticas iniciales

- Usa **`<script setup lang="ts">`** si trabajas con TypeScript.
- Mantén los componentes pequeños y con una sola responsabilidad.
- Para lógica reutilizable, crea **composables** (ej.: `src/composables/useCounter.ts`).
- Instala **Volar** en VSCode para autocompletado/errores TS.
- Usa `scoped` en `<style>` para evitar fugas de CSS entre componentes.
