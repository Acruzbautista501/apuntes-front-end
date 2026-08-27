# Módulo 17: Testing con Vitest y Vue Test Utils

Un proyecto Vue de nivel profesional necesita pruebas automatizadas que verifiquen que los componentes se comportan como se espera, incluso después de refactorizar. Este módulo cubre **Vitest** (el ejecutor de pruebas recomendado para proyectos con Vite) y **Vue Test Utils** (la librería oficial para testear componentes Vue).

## 17.1 Instalación

```bash
npm install -D vitest @vue/test-utils jsdom
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom' // Simula el DOM del navegador dentro de Node
  }
})
```

```json
// package.json
{
  "scripts": {
    "test": "vitest"
  }
}
```

## 17.2 Tu Primer Test: Renderizado y Props

```vue
<!-- Saludo.vue -->
<script setup lang="ts">
defineProps<{ nombre: string }>()
</script>

<template>
  <h1>Hola, {{ nombre }}</h1>
</template>
```

```typescript
// Saludo.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Saludo from './Saludo.vue'

describe('Saludo', () => {
  it('muestra el nombre recibido por props', () => {
    const wrapper = mount(Saludo, {
      props: { nombre: 'Alex' }
    })

    expect(wrapper.text()).toContain('Hola, Alex')
  })
})
```

`mount` renderiza el componente en un DOM simulado; `wrapper` da acceso a métodos para inspeccionar y manipular ese render.

## 17.3 Simular Interacción del Usuario

```vue
<!-- Contador.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const cuenta = ref(0)
</script>

<template>
  <p data-testid="valor">{{ cuenta }}</p>
  <button @click="cuenta++">Incrementar</button>
</template>
```

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Contador from './Contador.vue'

describe('Contador', () => {
  it('incrementa la cuenta al hacer clic', async () => {
    const wrapper = mount(Contador)

    await wrapper.find('button').trigger('click')

    expect(wrapper.get('[data-testid="valor"]').text()).toBe('1')
  })
})
```

> **`await` es obligatorio en `trigger`**: Vue actualiza el DOM de forma asíncrona (*nextTick*); sin `await`, la aserción se ejecuta antes de que el DOM refleje el cambio.

## 17.4 Verificar Eventos Emitidos

```typescript
it('emite el evento "guardar" con el texto correcto', async () => {
  const wrapper = mount(Formulario)

  await wrapper.find('input').setValue('Nueva tarea')
  await wrapper.find('button').trigger('click')

  expect(wrapper.emitted('guardar')).toBeTruthy()
  expect(wrapper.emitted('guardar')![0]).toEqual(['Nueva tarea'])
})
```

`wrapper.emitted('nombreEvento')` devuelve un array con cada emisión registrada; cada elemento es el array de argumentos con que se llamó ese `emit`.

## 17.5 Testear Slots

```typescript
it('renderiza el contenido pasado al slot por defecto', () => {
  const wrapper = mount(Tarjeta, {
    slots: {
      default: '<p>Contenido de prueba</p>'
    }
  })

  expect(wrapper.html()).toContain('Contenido de prueba')
})
```

## 17.6 Simular (*Mock*) Composables y `fetch`

Los tests unitarios no deben depender de una red real. Se sustituye `fetch` (o el composable que lo usa) por una versión simulada.

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ListaProductos from './ListaProductos.vue'

describe('ListaProductos', () => {
  it('muestra los productos obtenidos de la API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 1, nombre: 'Teclado' }])
    }) as unknown as typeof fetch

    const wrapper = mount(ListaProductos)
    await flushPromises() // Espera a que todas las promesas pendientes se resuelvan

    expect(wrapper.text()).toContain('Teclado')
  })
})
```

## 17.7 Testear un Composable de Forma Aislada

Como un composable es solo una función, puede probarse directamente sin montar ningún componente — más rápido y más simple.

```typescript
// useContador.spec.ts
import { describe, it, expect } from 'vitest'
import { useContador } from './useContador'

describe('useContador', () => {
  it('incrementa correctamente', () => {
    const { contador, incrementar } = useContador(5)

    incrementar()

    expect(contador.value).toBe(6)
  })
})
```

## 17.8 Testear un Store de Pinia

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useContadorStore } from '@/stores/contador'

describe('Store de contador', () => {
  beforeEach(() => {
    setActivePinia(createPinia()) // Un Pinia limpio antes de cada test
  })

  it('incrementa la cuenta', () => {
    const store = useContadorStore()
    store.incrementar()

    expect(store.cuenta).toBe(1)
  })
})
```

## 17.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Renderizar un componente para probarlo | `mount(Componente, { props, slots })` |
| Simular un clic, un input, etc. | `await wrapper.find(selector).trigger('click')` |
| Verificar eventos emitidos | `wrapper.emitted('nombreEvento')` |
| Esperar promesas pendientes (fetch simulado) | `await flushPromises()` |
| Probar un store aislado de componentes | `setActivePinia(createPinia())` en `beforeEach` |

## 17.10 Errores Comunes

- **Olvidar `await` en `trigger`/`setValue`**: la aserción corre antes de que Vue actualice el DOM, y el test falla de forma confusa aunque el código sea correcto.
- **Testear detalles internos de implementación** (variables privadas, estructura exacta del HTML) en vez de comportamiento observable (texto renderizado, eventos emitidos): hace que los tests se rompan con cualquier refactor, aunque el comportamiento siga siendo correcto.
- **No limpiar mocks entre tests** (`vi.fn()` en `global.fetch` sin restaurar): un mock de un test puede filtrarse y afectar silenciosamente a otro test que corre después.
