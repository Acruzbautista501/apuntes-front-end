# Módulo 19: Arquitectura de Proyectos Grandes

Un proyecto Vue que crece de 5 a 50 (o 500) componentes necesita una organización deliberada. Este módulo cubre cómo estructurar carpetas, dónde vive cada tipo de lógica, y patrones que evitan que la aplicación se vuelva difícil de mantener.

## 19.1 Estructura de Carpetas por Tipo (Proyectos Pequeños)

Para proyectos pequeños o medianos, agrupar por tipo de archivo es simple y suficiente.

```text
src/
├── assets/            # Imágenes, fuentes, estilos globales
├── components/        # Componentes reutilizables (BaseButton, BaseCard...)
├── composables/        # useFetch, useLocalStorage, useAuth...
├── views/              # Componentes de página, uno por ruta
├── router/
│   └── index.ts
├── stores/             # Stores de Pinia
├── types/              # Interfaces y tipos compartidos
├── utils/              # Funciones puras sin estado (formatDate, slugify...)
├── App.vue
└── main.ts
```

## 19.2 Estructura por Dominio/Feature (Proyectos Grandes)

Cuando el proyecto crece, agrupar por tipo de archivo obliga a saltar entre carpetas lejanas para trabajar en una sola funcionalidad. Agrupar **por dominio** mantiene junto todo lo relacionado con una misma característica.

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   └── FormularioLogin.vue
│   │   ├── composables/
│   │   │   └── useAuth.ts
│   │   ├── stores/
│   │   │   └── authStore.ts
│   │   └── types/
│   │       └── usuario.types.ts
│   ├── productos/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   └── views/
│   └── carrito/
│       ├── components/
│       ├── composables/
│       └── stores/
├── shared/             # Lo que de verdad se usa en más de un feature
│   ├── components/     # BaseButton, BaseModal, BaseInput...
│   ├── composables/
│   └── utils/
├── router/
└── main.ts
```

La regla práctica: si un componente, composable o tipo solo lo usa un feature, vive dentro de ese feature; solo sube a `shared/` cuando un **segundo** feature realmente lo necesita.

## 19.3 Componentes "Base" (Design System Interno)

Los componentes de UI genéricos y sin lógica de negocio (botones, inputs, modales) se prefijan por convención con `Base` y viven en `shared/components/`, disponibles para toda la aplicación.

```text
shared/components/
├── BaseButton.vue
├── BaseInput.vue
├── BaseModal.vue
└── BaseCard.vue
```

```vue
<!-- Uso en cualquier feature -->
<BaseButton variante="primario" @click="guardar">Guardar</BaseButton>
```

Ver el Módulo 3 (Props/Emits) y el Módulo 4 (Slots) para diseñar la API de estos componentes de forma flexible.

## 19.4 Separar Lógica de Presentación (Componentes "Tontos" vs. "Inteligentes")

Un patrón que escala bien: los componentes de `views/` (o cada feature) manejan datos, llaman composables y stores — los componentes de `components/` solo reciben props y emiten eventos, sin saber de dónde vienen los datos.

```vue
<!-- ProductosView.vue — "inteligente": conoce el store, el composable, la API -->
<script setup lang="ts">
import { useProductosStore } from '@/features/productos/stores/productosStore'
import TarjetaProducto from '../components/TarjetaProducto.vue'

const store = useProductosStore()
</script>

<template>
  <TarjetaProducto
    v-for="producto in store.productos"
    :key="producto.id"
    :producto="producto"
    @agregar-al-carrito="store.agregarAlCarrito"
  />
</template>
```

```vue
<!-- TarjetaProducto.vue — "tonto": solo props y emits, reutilizable en cualquier contexto -->
<script setup lang="ts">
defineProps<{ producto: Producto }>()
defineEmits<{ 'agregar-al-carrito': [id: number] }>()
</script>
```

`TarjetaProducto` puede probarse (Módulo 17) y reutilizarse sin depender de Pinia ni de ninguna API — solo necesita las props que se le pasen.

## 19.5 Alias de Importación (`@/`)

Evitar rutas relativas largas (`../../../composables/useAuth`) mejorando la legibilidad y evitando errores al mover archivos.

```typescript
// vite.config.ts
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

```typescript
import { useAuth } from '@/features/auth/composables/useAuth' // En vez de una ruta relativa larga
```

## 19.6 Barrel Files (`index.ts`) — Usar con Moderación

Un archivo `index.ts` que reexporta todo un módulo simplifica los imports, pero en proyectos grandes puede generar problemas de *tree-shaking* y ciclos de dependencia si se abusa de él.

```typescript
// features/productos/index.ts
export { default as TarjetaProducto } from './components/TarjetaProducto.vue'
export { useProductosStore } from './stores/productosStore'
```

> Úsalo para la API pública de un feature completo hacia el resto de la app — no como costumbre en cada subcarpeta.

## 19.7 Tabla de Referencia Rápida

| Necesitas... | Estrategia |
| :--- | :--- |
| Proyecto pequeño/mediano, pocas features | Estructura por tipo de archivo |
| Proyecto grande, varios equipos o dominios claros | Estructura por feature/dominio |
| Componentes de UI genéricos sin lógica de negocio | Carpeta `shared/components/`, prefijo `Base` |
| Separar datos de presentación | Vistas "inteligentes" + componentes "tontos" con props/emits |
| Rutas de import largas y frágiles | Alias `@/` en `vite.config.ts` |

## 19.8 Errores Comunes

- **Poner todo en `shared/` "por si acaso se reutiliza después"**: mueve algo a compartido solo cuando un segundo lugar realmente lo necesita — mover código es barato, una abstracción prematura y mal diseñada es cara.
- **Componentes que mezclan lógica de negocio y presentación**: dificulta reutilizarlos y probarlos de forma aislada (Módulo 17).
- **Carpetas `utils/` que terminan siendo un cajón de sastre**: si una función usa `ref`/reactividad, probablemente es un composable, no un util — los utils deben ser funciones puras sin estado de Vue.
