# Módulo 7: Provide/Inject

Pasar props de un componente padre a un hijo directo es simple. El problema aparece cuando un dato debe atravesar **varios niveles** de componentes intermedios que no lo necesitan para nada — solo lo reciben para reenviarlo al siguiente nivel. Esto se conoce como *prop drilling*. `provide`/`inject` es el mecanismo nativo de Vue para evitarlo.

## 7.1 El Problema: *Prop Drilling*

```vue
<!-- App.vue -->
<Layout :usuario="usuario" />

<!-- Layout.vue — no usa "usuario" para nada, solo lo reenvía -->
<Sidebar :usuario="usuario" />

<!-- Sidebar.vue — tampoco lo usa -->
<PerfilUsuario :usuario="usuario" />

<!-- PerfilUsuario.vue — el único que realmente lo necesita -->
<p>{{ usuario.nombre }}</p>
```

Cada componente intermedio (`Layout`, `Sidebar`) tuvo que declarar la prop `usuario` solo para pasarla hacia abajo, aunque no le interesa.

## 7.2 `provide()` — El Ancestro Ofrece un Valor

Un componente ancestro (puede ser cualquier antepasado, no solo el padre directo) declara un valor disponible para toda su descendencia.

```vue
<script setup lang="ts">
// App.vue
import { provide, ref } from 'vue'

const usuario = ref({ nombre: 'Alex', rol: 'admin' })
provide('usuario', usuario)
</script>
```

## 7.3 `inject()` — Cualquier Descendiente lo Recibe

Sin importar cuántos niveles de profundidad haya, cualquier componente descendiente puede pedir ese valor directamente, sin que los intermedios sepan nada de él.

```vue
<script setup lang="ts">
// PerfilUsuario.vue — varios niveles por debajo de App.vue
import { inject } from 'vue'

const usuario = inject('usuario')
</script>

<template>
  <p>{{ usuario?.nombre }}</p>
</template>
```

`Layout.vue` y `Sidebar.vue` no necesitan mencionar `usuario` en ningún lado.

## 7.4 Tipado Seguro con `InjectionKey`

Usar un string plano como `'usuario'` es propenso a errores de tipeo y no da autocompletado. Vue recomienda usar un `Symbol` tipado con `InjectionKey`.

```typescript
// keys.ts
import type { InjectionKey, Ref } from 'vue'

interface Usuario { nombre: string; rol: string }

export const usuarioKey: InjectionKey<Ref<Usuario>> = Symbol('usuario')
```

```typescript
// App.vue
import { provide, ref } from 'vue'
import { usuarioKey } from './keys'

const usuario = ref({ nombre: 'Alex', rol: 'admin' })
provide(usuarioKey, usuario)
```

```typescript
// PerfilUsuario.vue
import { inject } from 'vue'
import { usuarioKey } from './keys'

const usuario = inject(usuarioKey) // Tipado como Ref<Usuario> | undefined automáticamente
```

## 7.5 Valor por Defecto en `inject`

Si un componente puede usarse tanto dentro como fuera del árbol que hace `provide`, conviene declarar un valor de respaldo — evita tener que comprobar `undefined` en todos lados.

```typescript
const usuario = inject(usuarioKey, ref({ nombre: 'Invitado', rol: 'visitante' }))
```

## 7.6 Hacer el Valor de Solo Lectura para el Descendiente

Un patrón común: el ancestro provee el estado **y** una función para modificarlo, en lugar del `ref` mutable directo — así los descendientes no pueden reasignar el estado libremente, solo a través de la API que el ancestro decide exponer.

```typescript
// App.vue
import { provide, readonly, ref } from 'vue'

const usuario = ref({ nombre: 'Alex', rol: 'admin' })

function actualizarNombre(nuevoNombre: string) {
  usuario.value.nombre = nuevoNombre
}

provide('usuario', readonly(usuario))
provide('actualizarNombre', actualizarNombre)
```

## 7.7 Composable + Provide/Inject: el Patrón "Store Local"

Combinar `provide`/`inject` dentro de un composable evita repetir las claves de inyección en cada componente y da una API limpia, similar a un mini-store sin necesitar Pinia.

```typescript
// composables/useUsuarioStore.ts
import { provide, inject, ref, readonly, InjectionKey, Ref } from 'vue'

interface Usuario { nombre: string }
const usuarioKey: InjectionKey<Ref<Usuario>> = Symbol('usuario')

export function proveerUsuario(inicial: Usuario) {
  const usuario = ref(inicial)
  provide(usuarioKey, usuario)
  return usuario
}

export function useUsuario() {
  const usuario = inject(usuarioKey)
  if (!usuario) throw new Error('useUsuario() debe usarse dentro de un proveedor')
  return usuario
}
```

## 7.8 ¿Provide/Inject o Pinia?

| Escenario | Recomendación |
| :--- | :--- |
| Estado compartido entre pocos componentes de un mismo árbol (un formulario multi-paso, un widget) | `provide`/`inject` |
| Estado global de toda la aplicación (usuario autenticado, carrito de compras) | Pinia (Módulo 12) |
| Necesitas DevTools, persistencia o testing sencillo del estado | Pinia |
| Quieres evitar una dependencia extra para algo pequeño y local | `provide`/`inject` |

## 7.9 Errores Comunes

- **Usar strings planos como clave en proyectos grandes**: sin `InjectionKey`, dos componentes distintos pueden usar la misma clave por accidente (colisión de nombres) y sin ningún aviso de TypeScript.
- **Proveer un `ref` mutable sin control**: cualquier descendiente puede modificarlo libremente; usa `readonly()` si el ancestro debe seguir siendo el único dueño del cambio.
- **Olvidar el valor por defecto en `inject`**: si el componente se usa fuera del árbol que provee el valor, `inject` devuelve `undefined` silenciosamente y el error aparece más tarde, lejos de la causa real.
