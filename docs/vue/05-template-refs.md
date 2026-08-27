# Módulo 5: Template Refs y Acceso al DOM

Vue evita que manipules el DOM directamente porque él ya se encarga de mantenerlo sincronizado con tu estado. Pero hay casos legítimos donde necesitas el elemento real: enfocar un input, medir el tamaño de un elemento, o controlar un componente hijo desde fuera. Para eso existen las *template refs*.

## 5.1 Referenciar un Elemento del DOM

Se crea un `ref()` normal y se enlaza al elemento con el atributo especial `ref`, usando el **mismo nombre**.

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" placeholder="Se enfoca automáticamente" />
</template>
```

> **Por qué `HTMLInputElement | null`:** el elemento no existe hasta que el componente se monta, así que el tipo debe incluir `null`. Por eso el acceso siempre usa `?.` (optional chaining) o se hace dentro de `onMounted`.

## 5.2 Por Qué Debe Usarse Dentro de `onMounted`

Antes de que Vue monte el componente, el DOM real todavía no existe — el `ref` vale `null`. Acceder a `inputRef.value.focus()` fuera de `onMounted` (por ejemplo, directamente en el `<script setup>`) fallará.

```typescript
const inputRef = ref<HTMLInputElement | null>(null)

inputRef.value?.focus() // ❌ Aquí siempre es null, el DOM no existe todavía

onMounted(() => {
  inputRef.value?.focus() // ✅ El elemento ya está montado
})
```

## 5.3 Refs Dentro de `v-for`

Cuando el `ref` está dentro de un elemento repetido con `v-for`, Vue no permite un `ref` de string fijo — se usa una función que recibe cada elemento y lo agrega a un array.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref(['Uno', 'Dos', 'Tres'])
const itemRefs = ref<HTMLLIElement[]>([])

function guardarRef(el: Element | null) {
  if (el) itemRefs.value.push(el as HTMLLIElement)
}
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item" :ref="guardarRef">
      {{ item }}
    </li>
  </ul>
</template>
```

> **Cuidado:** este array se reconstruye en cada render. Si necesitas limpiarlo antes de repoblarlo, hazlo en un hook como `onBeforeUpdate`.

## 5.4 Template Refs sobre Componentes Hijos

Un `ref` también puede apuntar a una **instancia de componente**, no solo a un elemento del DOM — te da acceso a lo que ese componente exponga explícitamente (ver siguiente sección).

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FormularioLogin from './FormularioLogin.vue'

const formularioRef = ref<InstanceType<typeof FormularioLogin> | null>(null)

onMounted(() => {
  formularioRef.value?.enfocarPrimerCampo()
})
</script>

<template>
  <FormularioLogin ref="formularioRef" />
</template>
```

## 5.5 `defineExpose` — Controlar Qué Expone un Componente

Por defecto, con `<script setup>`, **nada** dentro del componente es accesible desde fuera a través de un template ref — es una decisión deliberada de Vue para evitar acoplamientos frágiles. `defineExpose` declara explícitamente qué métodos o propiedades sí pueden usarse desde el padre.

**`FormularioLogin.vue`:**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const primerCampoRef = ref<HTMLInputElement | null>(null)

function enfocarPrimerCampo() {
  primerCampoRef.value?.focus()
}

defineExpose({ enfocarPrimerCampo })
</script>

<template>
  <input ref="primerCampoRef" type="email" placeholder="Correo" />
</template>
```

Sin `defineExpose`, `formularioRef.value?.enfocarPrimerCampo()` desde el padre sería `undefined`.

## 5.6 Caso de Uso Real: Medir un Elemento

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const cajaRef = ref<HTMLDivElement | null>(null)
const alto = ref(0)

onMounted(() => {
  if (cajaRef.value) {
    alto.value = cajaRef.value.offsetHeight
  }
})
</script>

<template>
  <div ref="cajaRef" class="caja">Contenido de altura variable</div>
  <p>Altura medida: {{ alto }}px</p>
</template>
```

## 5.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Acceder a un elemento del DOM tras montar | `ref<HTMLElement \| null>(null)` + `ref="miRef"` + `onMounted` |
| Refs sobre elementos repetidos (`v-for`) | `:ref="funcionQueAcumulaElArray"` |
| Llamar un método de un componente hijo | `ref` sobre el componente + `defineExpose` en el hijo |
| Controlar qué expone un componente con `<script setup>` | `defineExpose({ ... })` |

## 5.8 Errores Comunes

- **Acceder al ref antes de `onMounted`**: siempre será `null` en ese punto del ciclo de vida.
- **Olvidar `defineExpose` y esperar que un método del hijo esté disponible**: con `<script setup>`, todo es privado por defecto.
- **Usar template refs cuando un binding declarativo (`:class`, `v-model`) resolvería lo mismo**: los refs son para casos donde el DOM imperativo es realmente necesario (foco, medición, integración con librerías externas), no un atajo general.
