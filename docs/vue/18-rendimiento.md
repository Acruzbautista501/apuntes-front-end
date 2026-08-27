# Módulo 18: Rendimiento y Optimización

Vue 3 es rápido por defecto gracias a su compilador y su sistema de reactividad basado en Proxies. Pero aplicaciones grandes, con listas extensas o árboles de componentes profundos, se benefician de técnicas específicas de optimización. Este módulo cubre las más relevantes.

## 18.1 `shallowRef` y `shallowReactive` — Reactividad Superficial

`ref()` y `reactive()` hacen la reactividad **profunda**: si un objeto anidado dentro cambia, Vue lo detecta. Eso tiene un costo — Vue debe envolver recursivamente cada nivel del objeto en un Proxy. Para estructuras grandes que se reemplazan por completo en lugar de mutarse parcialmente (una tabla de datos que llega entera desde una API), la reactividad profunda es trabajo desperdiciado.

```typescript
import { shallowRef } from 'vue'

// Solo la reasignación de "tabla.value" es reactiva; los cambios internos NO lo son
const tabla = shallowRef<Fila[]>([])

async function cargarDatos() {
  tabla.value = await obtenerFilasDesdeAPI() // Dispara actualización
}

tabla.value[0].nombre = 'Nuevo valor' // NO dispara actualización — no es lo que se busca aquí
```

`shallowReactive` funciona igual pero para objetos, en lugar de para el patrón `.value` de `ref`.

## 18.2 `v-memo` — Saltar Re-renderizados Innecesarios

`v-memo` memoriza un fragmento del template: mientras la lista de dependencias declarada no cambie, Vue **reutiliza el render anterior** sin volver a evaluarlo, incluso si el componente padre se re-renderiza por otra razón.

```vue
<template>
  <div v-for="item in listaLarga" :key="item.id" v-memo="[item.id, item.seleccionado]">
    <!-- Esta sección solo se vuelve a renderizar si "item.id" o "item.seleccionado" cambian -->
    <ComponenteCostoso :item="item" />
  </div>
</template>
```

> **Úsalo con moderación**: `v-memo` añade su propio costo de comparación. Solo aporta beneficio real en listas largas con elementos costosos de renderizar — en la mayoría de templates, el algoritmo de diffing normal de Vue ya es suficientemente rápido.

## 18.3 `computed` en Lugar de Métodos en el Template

Un método llamado directamente en el template (`{{ calcularTotal() }}`) se ejecuta en **cada render**, sin importar si sus dependencias cambiaron. `computed` cachea el resultado y solo recalcula cuando sus dependencias reactivas cambian.

```vue
<script setup lang="ts">
// ❌ Se recalcula en cada render del componente, sin importar la causa
function total() {
  return items.value.reduce((acc, i) => acc + i.precio, 0)
}

// ✅ Se recalcula solo cuando "items" cambia
const total = computed(() => items.value.reduce((acc, i) => acc + i.precio, 0))
</script>
```

## 18.4 Lazy Loading de Componentes y Rutas

Ya visto en el Módulo 10 (rutas) y el Módulo 15 (`defineAsyncComponent`) — vale la pena repetirlo como principio general de rendimiento: **el JavaScript que el navegador no descarga es JavaScript que no puede ralentizar nada**.

```typescript
// Componente pesado (un editor de texto enriquecido, un gráfico complejo)
const EditorEnriquecido = defineAsyncComponent(() => import('./EditorEnriquecido.vue'))
```

## 18.5 Virtualización de Listas Largas

Renderizar 10,000 elementos del DOM simultáneamente es costoso sin importar cuán optimizado esté Vue internamente — el cuello de botella pasa a ser el propio navegador. La virtualización solo renderiza los elementos visibles en el viewport.

```bash
npm install @tanstack/vue-virtual
```

```vue
<script setup lang="ts">
import { useVirtualizer } from '@tanstack/vue-virtual'
import { ref } from 'vue'

const contenedorRef = ref<HTMLElement | null>(null)
const items = ref(Array.from({ length: 10000 }, (_, i) => `Elemento ${i}`))

const virtualizador = useVirtualizer({
  count: items.value.length,
  getScrollElement: () => contenedorRef.value,
  estimateSize: () => 40
})
</script>

<template>
  <div ref="contenedorRef" style="height: 500px; overflow: auto;">
    <div :style="{ height: `${virtualizador.getTotalSize()}px`, position: 'relative' }">
      <div
        v-for="fila in virtualizador.getVirtualItems()"
        :key="fila.index"
        :style="{ position: 'absolute', top: `${fila.start}px`, height: `${fila.size}px` }"
      >
        {{ items[fila.index] }}
      </div>
    </div>
  </div>
</template>
```

Solo los ~15 elementos visibles en pantalla se renderizan realmente, sin importar si la lista completa tiene 10 o 10,000 elementos.

## 18.6 Evitar Watchers Innecesariamente Profundos

`{ deep: true }` (Módulo 2) es costoso en objetos grandes porque Vue debe recorrer recursivamente toda la estructura para detectar cambios. Cuando es posible, observar una propiedad específica es más barato.

```typescript
// ❌ Recorre todo el objeto "formulario" en cada cambio, sin importar qué campo cambió
watch(formulario, guardarBorrador, { deep: true })

// ✅ Solo observa el campo relevante
watch(() => formulario.value.titulo, guardarBorrador)
```

## 18.7 Herramientas de Diagnóstico

- **Vue DevTools**: la pestaña "Performance" graba renders y muestra qué componentes se actualizaron y por qué.
- **`app.config.performance = true`** (en desarrollo): habilita marcas de rendimiento del navegador (`Performance` tab de las DevTools del navegador) para el ciclo de init/compile/render/patch de cada componente.

## 18.8 Tabla de Referencia Rápida

| Problema | Solución |
| :--- | :--- |
| Reactividad profunda innecesaria en datos que se reemplazan enteros | `shallowRef` / `shallowReactive` |
| Re-render costoso de elementos en una lista grande que rara vez cambian | `v-memo` |
| Cálculo repetido en cada render dentro del template | `computed` en lugar de un método |
| Bundle inicial pesado | `defineAsyncComponent` + rutas con `import()` diferido |
| Miles de elementos de una lista en el DOM simultáneamente | Virtualización (`@tanstack/vue-virtual`) |
| `watch` costoso sobre un objeto grande | Observar solo la propiedad específica necesaria |

## 18.9 Errores Comunes

- **Optimizar antes de medir**: aplicar `v-memo` o virtualización sin haber confirmado con las DevTools que ese componente realmente es el cuello de botella — la mayoría del rendimiento de una app Vue 3 normal es aceptable sin ninguna de estas técnicas.
- **Usar `shallowRef` sobre datos que sí necesitan reactividad profunda**: causa bugs silenciosos donde la UI no se actualiza tras una mutación interna.
- **`{ deep: true }` por defecto "por si acaso"**: revisa si observar una propiedad específica resuelve el mismo caso de uso con mucho menor costo.
