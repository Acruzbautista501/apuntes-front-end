# Módulo 12: Vite con Vue

Vite y Vue comparten autor original y una integración particularmente pulida — este módulo cubre `@vitejs/plugin-vue` y las particularidades específicas de trabajar con componentes de un solo archivo (SFC) bajo Vite.

## 12.1 El Plugin Oficial

```bash
npm install -D @vitejs/plugin-vue
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

`@vitejs/plugin-vue` es lo que le enseña a Vite cómo procesar archivos `.vue` (Single File Components) — sin él, Vite no tiene forma de interpretar la sintaxis de un SFC, que combina plantilla, script y estilos en un único archivo.

## 12.2 Anatomía de un Componente Procesado

```vue
<template>
  <button @click="incrementar">Contador: {{ contador }}</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const contador = ref(0)
const incrementar = () => contador.value++
</script>

<style scoped>
button {
  padding: 0.5rem 1rem;
}
</style>
```

El plugin divide internamente este único archivo en tres piezas procesadas por separado: la plantilla se compila a funciones de renderizado de JavaScript, el script se transpila normalmente (con soporte completo de HMR con preservación de estado), y el estilo se procesa como CSS con alcance local automático gracias a `scoped`.

## 12.3 HMR con Preservación de Estado en Componentes Vue

```text
Modificar la plantilla → el componente se re-renderiza, EL ESTADO (contador.value) se conserva
Modificar la lógica del script → en la mayoría de los casos, también se conserva el estado
```

Esta es la experiencia de HMR más pulida que ofrece la combinación Vite + Vue: editar el markup o los estilos de un componente actualiza la interfaz al instante sin perder el estado reactivo actual — comportamiento implementado específicamente por `@vitejs/plugin-vue` sobre la API genérica de HMR cubierta en el Módulo 4.4.

## 12.4 `<script setup>`: la Sintaxis Recomendada

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const cantidad = ref(1)
const precio = ref(29.99)
const total = computed(() => cantidad.value * precio.value)
</script>
```

`<script setup>` es la sintaxis moderna recomendada para componentes Vue 3 — todo lo declarado en su nivel superior está disponible automáticamente en la plantilla, sin necesitar un objeto `return` explícito como en la Options API o el `setup()` tradicional.

## 12.5 Vue DevTools con Vite

```bash
npm install -D vite-plugin-vue-devtools
```

```ts
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
})
```

Además de la extensión de navegador tradicional, existe un plugin de Vite que integra Vue DevTools directamente en la aplicación durante desarrollo — útil en entornos donde instalar una extensión de navegador no es viable (algunos navegadores embebidos, por ejemplo).

## 12.6 TypeScript en Componentes Vue

```vue
<script setup lang="ts">
interface Props {
  titulo: string
  cantidad?: number
}

const props = defineProps<Props>()
</script>
```

`defineProps<Props>()` con un genérico de tipo es la forma recomendada de tipar props en `<script setup>` — como se explicó en el Módulo 11.1, esta verificación de tipos ocurre en el editor y en `vue-tsc` (no en esbuild directamente), retomado en el siguiente punto.

## 12.7 `vue-tsc`: Verificación de Tipos para Archivos `.vue`

```json
{
  "scripts": {
    "build": "vue-tsc --noEmit && vite build"
  }
}
```

El compilador estándar de TypeScript (`tsc`) no entiende archivos `.vue` de forma nativa — `vue-tsc` es una variante especializada que sí comprende la sintaxis de los SFC, usada en lugar de `tsc` puro para el paso de verificación de tipos antes del build (equivalente al `tsc --noEmit` genérico del Módulo 11.3).

## 12.8 Componentes Asíncronos y Code Splitting Automático

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const GraficoComplejo = defineAsyncComponent(() => import('./GraficoComplejo.vue'))
</script>
```

`defineAsyncComponent` combinado con un `import()` dinámico aprovecha directamente el code splitting de Rollup (Módulo 16) — el componente (y sus dependencias exclusivas) se separa en un chunk independiente, cargado solo cuando efectivamente se renderiza, no incluido en el bundle inicial.

## 12.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Que Vite entienda archivos `.vue` | El plugin `@vitejs/plugin-vue` |
| La sintaxis moderna recomendada para componentes | `<script setup>` |
| Tipar props en TypeScript dentro de un SFC | `defineProps<Interfaz>()` |
| Verificar tipos en archivos `.vue` antes del build | `vue-tsc --noEmit` |
| Cargar un componente solo cuando se necesita | `defineAsyncComponent(() => import('./Componente.vue'))` |

## 12.10 Errores Comunes

- **Usar `tsc` en lugar de `vue-tsc` para verificar tipos**: `tsc` puro no entiende la sintaxis de archivos `.vue`, produciendo errores confusos o simplemente ignorando esos archivos por completo.
- **Esperar que las props tipadas con `defineProps<Interfaz>()` se validen en tiempo de ejecución**: es únicamente verificación estática (en el editor y en `vue-tsc`) — a diferencia de la sintaxis alternativa con validadores en runtime, no lanza ningún error real si se pasa un tipo incorrecto durante la ejecución.
- **Olvidar instalar `@vitejs/plugin-vue` al configurar Vite manualmente sin el andamiaje oficial**: sin él, cualquier archivo `.vue` produce un error de "tipo de módulo no soportado" al intentar importarlo.
