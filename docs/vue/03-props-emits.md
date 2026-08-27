# Módulo 3: Props, Emits y `v-model` Personalizado

Los componentes solo son reutilizables si pueden recibir datos desde fuera (**props**) y avisar a su padre cuando algo pasa dentro (**emits**). Este módulo cubre ambos a fondo, incluyendo tipado estricto con TypeScript y el patrón más usado en Vue real: `v-model` sobre un componente propio.

## 3.1 `defineProps` — Tipado con Interfaz

En `<script setup lang="ts">`, `defineProps` es una macro especial del compilador: no necesitas importarla y acepta un genérico con la forma de tus props.

```vue
<script setup lang="ts">
interface Props {
  titulo: string
  descripcion?: string        // El '?' la hace opcional
  contador: number
}

const props = defineProps<Props>()
</script>

<template>
  <h2>{{ props.titulo }}</h2>
  <p v-if="props.descripcion">{{ props.descripcion }}</p>
  <span>{{ props.contador }}</span>
</template>
```

## 3.2 Valores por Defecto con `withDefaults`

Cuando una prop es opcional, `defineProps<Props>()` por sí solo no permite asignarle un valor por defecto. Para eso existe `withDefaults`.

```vue
<script setup lang="ts">
interface Props {
  titulo: string
  variante?: 'primario' | 'secundario'
  cerrable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variante: 'primario',
  cerrable: false
})
</script>
```

> **Nota:** los valores por defecto de objetos o arrays deben devolverse desde una función (`() => ({...})`) para evitar que todas las instancias del componente compartan la misma referencia.

## 3.3 Props de Solo Lectura

Un detalle que sorprende a quien viene de otros frameworks: **las props son de solo lectura**. Vue lanza un warning en desarrollo si intentas reasignarlas directamente.

```typescript
const props = defineProps<{ contador: number }>()

props.contador++ // ❌ Warning: intento de mutar una prop
```

Si necesitas una versión local editable, cópiala a un `ref` propio:

```typescript
const contadorLocal = ref(props.contador)
```

## 3.4 `defineEmits` — Eventos Tipados

Igual que `defineProps`, `defineEmits` es una macro del compilador. Tipar los eventos evita errores como emitir un evento con el nombre mal escrito o con el tipo de dato equivocado.

```vue
<script setup lang="ts">
const emit = defineEmits<{
  guardar: [id: number, texto: string]
  cancelar: []
}>()

function onGuardar() {
  emit('guardar', 1, 'Contenido')   // ✅ TypeScript valida los argumentos
}

function onCancelar() {
  emit('cancelar')
}
</script>

<template>
  <button @click="onGuardar">Guardar</button>
  <button @click="onCancelar">Cancelar</button>
</template>
```

El componente padre escucha estos eventos como cualquier evento nativo:

```vue
<MiFormulario @guardar="(id, texto) => console.log(id, texto)" @cancelar="cerrarFormulario" />
```

## 3.5 `v-model` en Componentes Personalizados

`v-model` en un elemento nativo (`<input v-model="texto">`) es en realidad azúcar sintáctico para `:value` + `@input`. Puedes replicar exactamente ese patrón en tus propios componentes.

**Componente hijo — `CampoTexto.vue`:**

```vue
<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [valor: string] }>()
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
```

**Uso desde el padre:**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import CampoTexto from './CampoTexto.vue'

const nombre = ref('')
</script>

<template>
  <CampoTexto v-model="nombre" />
  <p>Valor actual: {{ nombre }}</p>
</template>
```

`v-model="nombre"` se expande automáticamente a `:model-value="nombre" @update:model-value="nombre = $event"`.

## 3.6 Múltiples `v-model` en un Mismo Componente

Desde Vue 3 puedes tener más de un `v-model`, cada uno con su propio nombre de argumento.

```vue
<script setup lang="ts">
defineProps<{ nombre: string; apellido: string }>()
defineEmits<{
  'update:nombre': [valor: string]
  'update:apellido': [valor: string]
}>()
</script>

<template>
  <input :value="nombre" @input="$emit('update:nombre', ($event.target as HTMLInputElement).value)" />
  <input :value="apellido" @input="$emit('update:apellido', ($event.target as HTMLInputElement).value)" />
</template>
```

```vue
<FormularioNombre v-model:nombre="nombre" v-model:apellido="apellido" />
```

## 3.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Recibir datos del padre | `defineProps<Interfaz>()` |
| Un valor por defecto en una prop opcional | `withDefaults(defineProps<Interfaz>(), {...})` |
| Emitir un evento con datos tipados | `defineEmits<{ nombreEvento: [tipos] }>()` |
| `v-model` de un solo valor sobre un componente propio | Prop `modelValue` + evento `update:modelValue` |
| Varios `v-model` sobre el mismo componente | Prop/evento con el sufijo del nombre elegido (`v-model:nombre`) |

## 3.8 Errores Comunes

- **Mutar una prop directamente**: usa un `ref` local o emite un evento para que el padre decida el nuevo valor.
- **Olvidar declarar el evento en `defineEmits`**: aunque `emit('miEvento')` funcione sin declararlo, perderás el autocompletado y la validación de TypeScript.
- **Usar `props.valor` reactivamente fuera de `computed`/`watch`**: si desestructuras `const { titulo } = props`, pierdes la reactividad — usa `toRefs(props)` si necesitas desestructurar.
