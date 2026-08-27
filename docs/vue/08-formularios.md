# Módulo 8: Formularios y Modificadores de `v-model`

El Módulo 2 mostró `v-model` en su forma más básica. Aquí se cubren los modificadores que ajustan su comportamiento, el manejo de todos los tipos de campos de un formulario, y patrones de validación con TypeScript.

## 8.1 Modificadores de `v-model`

| Modificador | Efecto |
| :--- | :--- |
| `.lazy` | Sincroniza en el evento `change` (al perder el foco) en lugar de en cada `input` |
| `.number` | Convierte automáticamente el valor a `Number` |
| `.trim` | Elimina espacios en blanco al inicio y final automáticamente |

```vue
<script setup lang="ts">
import { ref } from 'vue'

const busqueda = ref('')     // Se actualiza en cada tecla (por defecto)
const edad = ref(0)          // Siempre será un number, no un string
const nombre = ref('')       // Sin espacios sobrantes
</script>

<template>
  <input v-model.lazy="busqueda" />
  <input v-model.number="edad" type="number" />
  <input v-model.trim="nombre" />
</template>
```

Los modificadores pueden combinarse: `v-model.lazy.trim="nombre"`.

## 8.2 `v-model` en Todos los Tipos de Campo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const texto = ref('')
const aceptaTerminos = ref(false)
const intereses = ref<string[]>([])       // Varios checkboxes al mismo array
const genero = ref('')                     // Un solo valor entre radios
const pais = ref('')
</script>

<template>
  <input v-model="texto" type="text" />

  <input v-model="aceptaTerminos" type="checkbox" />

  <input v-model="intereses" type="checkbox" value="deportes" />
  <input v-model="intereses" type="checkbox" value="musica" />

  <input v-model="genero" type="radio" value="femenino" />
  <input v-model="genero" type="radio" value="masculino" />

  <select v-model="pais">
    <option disabled value="">Selecciona un país</option>
    <option value="mx">México</option>
    <option value="ar">Argentina</option>
  </select>

  <textarea v-model="texto"></textarea>
</template>
```

Cuando varios checkboxes comparten el mismo `v-model`, Vue detecta automáticamente que es un array y agrega/quita el `value` correspondiente.

## 8.3 Validación Reactiva con `computed`

El patrón más simple de validación: derivar el estado de "válido/inválido" con `computed`, sin librerías externas.

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const correo = ref('')
const password = ref('')

const correoValido = computed(() => /\S+@\S+\.\S+/.test(correo.value))
const passwordValido = computed(() => password.value.length >= 8)
const formularioValido = computed(() => correoValido.value && passwordValido.value)
</script>

<template>
  <input v-model="correo" type="email" :class="{ 'campo-invalido': correo && !correoValido }" />
  <p v-if="correo && !correoValido" class="error">Correo inválido</p>

  <input v-model="password" type="password" :class="{ 'campo-invalido': password && !passwordValido }" />
  <p v-if="password && !passwordValido" class="error">Mínimo 8 caracteres</p>

  <button :disabled="!formularioValido">Enviar</button>
</template>
```

## 8.4 Composable de Validación Reutilizable

Extraer la lógica de validación a un composable evita repetirla en cada formulario del proyecto.

```typescript
// composables/useCampoValidado.ts
import { ref, computed } from 'vue'

export function useCampoValidado(validador: (valor: string) => boolean, mensajeError: string) {
  const valor = ref('')
  const tocado = ref(false)

  const esValido = computed(() => validador(valor.value))
  const mostrarError = computed(() => tocado.value && !esValido.value)

  function marcarComoTocado() {
    tocado.value = true
  }

  return { valor, esValido, mostrarError, mensajeError, marcarComoTocado }
}
```

```vue
<script setup lang="ts">
import { useCampoValidado } from '@/composables/useCampoValidado'

const correo = useCampoValidado(v => /\S+@\S+\.\S+/.test(v), 'Correo inválido')
</script>

<template>
  <input v-model="correo.valor" @blur="correo.marcarComoTocado" />
  <p v-if="correo.mostrarError" class="error">{{ correo.mensajeError }}</p>
</template>
```

## 8.5 Envío del Formulario

`@submit.prevent` combina el manejo del evento nativo `submit` con `preventDefault()` — evita que el navegador recargue la página, que es el comportamiento nativo de un `<form>`.

```vue
<script setup lang="ts">
async function manejarEnvio() {
  if (!formularioValido.value) return

  try {
    await enviarDatos({ correo: correo.value, password: password.value })
  } catch (error) {
    console.error('Error al enviar el formulario', error)
  }
}
</script>

<template>
  <form @submit.prevent="manejarEnvio">
    <!-- campos -->
    <button type="submit" :disabled="!formularioValido">Enviar</button>
  </form>
</template>
```

## 8.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Sincronizar solo al perder el foco | `v-model.lazy` |
| Que el valor sea siempre número | `v-model.number` |
| Quitar espacios sobrantes automáticamente | `v-model.trim` |
| Varios checkboxes sobre un mismo array | `v-model` repetido apuntando al mismo `ref<string[]>` |
| Evitar el recargo de página al enviar | `@submit.prevent` |
| Reutilizar lógica de validación entre formularios | Un composable propio (`useCampoValidado`) |

## 8.7 Errores Comunes

- **Olvidar `.prevent` en `@submit`**: el navegador recarga la página completa y se pierde todo el estado de la SPA.
- **Usar `v-model` sin `.number` en campos numéricos**: el valor llega como string (`"25"` en vez de `25`), causando bugs sutiles en comparaciones o cálculos.
- **Validar solo al enviar, sin feedback progresivo**: marcar el campo como "tocado" (`@blur`) antes de mostrar errores mejora mucho la experiencia — evita mostrar errores en campos que el usuario ni siquiera ha tocado todavía.
