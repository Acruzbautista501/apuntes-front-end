# Módulo 15: `Suspense` y Componentes Asíncronos

Hasta ahora, cargar datos ha significado manejar manualmente un `ref` de "cargando" (Módulo 13). Vue ofrece un mecanismo complementario a nivel de componente: componentes `async` cuyo `<script setup>` puede esperar directamente una promesa con `await`, coordinados por `<Suspense>`.

## 15.1 Componentes Asíncronos con `await` en `<script setup>`

Con `<script setup lang="ts">`, un componente puede usar `await` en el nivel superior — Vue lo convierte automáticamente en un componente asíncrono ("async setup").

```vue
<!-- PerfilUsuario.vue -->
<script setup lang="ts">
interface Usuario { id: number; nombre: string }

const respuesta = await fetch('/api/usuario/actual')
const usuario: Usuario = await respuesta.json()
</script>

<template>
  <h2>{{ usuario.nombre }}</h2>
</template>
```

No hay `ref` de carga ni `onMounted` — el componente literalmente no termina de "montarse" hasta que la promesa se resuelve.

## 15.2 `<Suspense>` — Coordinar la Espera

Un componente padre no sabe, por sí solo, qué mostrar mientras `PerfilUsuario` espera su `fetch`. `<Suspense>` envuelve al componente asíncrono y define qué renderizar mientras tanto.

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const PerfilUsuario = defineAsyncComponent(() => import('./PerfilUsuario.vue'))
</script>

<template>
  <Suspense>
    <template #default>
      <PerfilUsuario />
    </template>

    <template #fallback>
      <p>Cargando perfil...</p>
    </template>
  </Suspense>
</template>
```

Mientras la promesa interna de `PerfilUsuario` no se resuelva, Vue muestra el contenido del slot `fallback`; en cuanto se resuelve, cambia automáticamente al slot `default`.

## 15.3 `defineAsyncComponent` — Carga Diferida de Componentes

Independientemente de si un componente usa `await` internamente, `defineAsyncComponent` permite cargar su código bajo demanda — el archivo `.vue` ni siquiera se descarga hasta que el componente necesita renderizarse.

```typescript
import { defineAsyncComponent } from 'vue'

const ModalPesado = defineAsyncComponent(() => import('./ModalPesado.vue'))
```

### Con Estados de Carga y Error Explícitos

```typescript
const ModalPesado = defineAsyncComponent({
  loader: () => import('./ModalPesado.vue'),
  loadingComponent: SpinnerCarga,
  errorComponent: MensajeError,
  delay: 200,      // Espera 200ms antes de mostrar el loading (evita parpadeos en cargas rápidas)
  timeout: 5000     // Si tarda más de 5s, muestra errorComponent
})
```

## 15.4 Manejar Errores dentro de `<Suspense>`

Si la promesa del componente asíncrono se rechaza (falla el `fetch`, por ejemplo), `<Suspense>` no captura ese error por sí solo — se combina con `onErrorCaptured` en un componente ancestro.

```vue
<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<string | null>(null)

onErrorCaptured((err) => {
  error.value = err instanceof Error ? err.message : 'Error al cargar el contenido'
  return false // Evita que el error siga propagándose hacia arriba
})
</script>

<template>
  <p v-if="error" class="error">{{ error }}</p>
  <Suspense v-else>
    <template #default><PerfilUsuario /></template>
    <template #fallback><p>Cargando...</p></template>
  </Suspense>
</template>
```

## 15.5 Cuándo Usar `<Suspense>` vs. un Composable de Fetch Manual

| Escenario | Recomendación |
| :--- | :--- |
| Un componente necesita datos antes de poder renderizarse en absoluto | `<Suspense>` + `async setup` |
| Necesitas mostrar contenido parcial mientras cargan otros datos (skeleton progresivo) | Composable `useFetch` manual (Módulo 13) |
| Varios componentes hermanos cargan datos independientes, cada uno con su propio estado de carga | Composables manuales — más control granular |
| Un formulario debe mostrarse instantáneamente y solo una sección espera datos | Composable manual solo en esa sección |

## 15.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Esperar una promesa antes de montar un componente | `await` en el nivel superior de `<script setup>` |
| Mostrar un estado de carga mientras eso ocurre | `<Suspense>` con slots `#default` y `#fallback` |
| Cargar el código de un componente bajo demanda | `defineAsyncComponent(() => import(...))` |
| Capturar errores de un componente asíncrono | `onErrorCaptured` en un ancestro |

## 15.7 Errores Comunes

- **Usar `<Suspense>` como solución universal para todo *loading***: sigue siendo una API oficialmente experimental en algunos aspectos — para casos simples, un composable de fetch manual (Módulo 13) suele ser más predecible y explícito.
- **Olvidar el slot `#fallback`**: sin él, la pantalla queda en blanco mientras el componente asíncrono resuelve su promesa.
- **Asumir que `<Suspense>` maneja errores automáticamente**: necesita `onErrorCaptured` explícito; por sí solo no muestra ningún mensaje de error ante un `fetch` fallido.
