# Módulo 20: Plugins y Configuración Global

Un *plugin* de Vue empaqueta funcionalidad para instalarla una sola vez y que quede disponible en toda la aplicación — componentes globales, directivas globales (Módulo 16), propiedades globales o configuración de librerías de terceros. Este módulo cubre cómo consumirlos y cómo escribir uno propio.

## 20.1 Anatomía de `main.ts`

Antes de escribir un plugin propio, vale la pena entender qué es exactamente lo que `.use()` ejecuta.

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(router)          // Cada .use() es un plugin instalándose sobre la instancia "app"
app.use(createPinia())

app.mount('#app')
```

## 20.2 Crear un Plugin Propio

Un plugin es un objeto con un método `install(app, opciones)`, o directamente una función con esa misma firma.

```typescript
// plugins/notificaciones.ts
import type { App } from 'vue'

interface OpcionesNotificaciones {
  duracion?: number
}

export default {
  install(app: App, opciones: OpcionesNotificaciones = {}) {
    const duracion = opciones.duracion ?? 3000

    app.config.globalProperties.$notificar = (mensaje: string) => {
      console.log(`[Notificación, ${duracion}ms]:`, mensaje)
      // Aquí iría la lógica real de mostrar un toast
    }
  }
}
```

```typescript
// main.ts
import notificaciones from './plugins/notificaciones'

app.use(notificaciones, { duracion: 5000 })
```

## 20.3 Tipar una Propiedad Global Agregada por un Plugin

`app.config.globalProperties` agrega algo a **toda instancia de componente**, pero TypeScript no lo sabe automáticamente — se declara mediante *module augmentation*.

```typescript
// plugins/notificaciones.ts
declare module 'vue' {
  interface ComponentCustomProperties {
    $notificar: (mensaje: string) => void
  }
}
```

Con esta declaración, `this.$notificar(...)` (en Options API) obtiene autocompletado y verificación de tipos.

## 20.4 Registrar Componentes Globalmente

Cuando un componente se usa en prácticamente toda la aplicación (un icono, un spinner de carga), registrarlo globalmente evita repetir su `import` en cada archivo — a costa de que ya no aparece explícitamente en el árbol de dependencias de cada componente que lo usa.

```typescript
// plugins/componentesBase.ts
import type { App } from 'vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseSpinner from '@/shared/components/BaseSpinner.vue'

export default {
  install(app: App) {
    app.component('BaseButton', BaseButton)
    app.component('BaseSpinner', BaseSpinner)
  }
}
```

> **Compromiso a considerar:** los componentes registrados globalmente no pueden eliminarse del bundle por *tree-shaking* aunque una página no los use. Para componentes usados en pocos lugares, un `import` local sigue siendo preferible.

## 20.5 Plugin que Provee un Composable (Alternativa Moderna)

En proyectos con Composition API, un patrón más idiomático que las propiedades globales es que el plugin haga `provide()` de un valor, consumible luego con un composable propio — mantiene la coherencia con el resto de la aplicación (Módulo 7).

```typescript
// plugins/notificaciones.ts
import type { App } from 'vue'
import { InjectionKey } from 'vue'

export interface Notificador {
  notificar: (mensaje: string) => void
}

export const notificadorKey: InjectionKey<Notificador> = Symbol('notificador')

export default {
  install(app: App) {
    const notificador: Notificador = {
      notificar: (mensaje) => console.log('Notificación:', mensaje)
    }
    app.provide(notificadorKey, notificador)
  }
}
```

```typescript
// composables/useNotificador.ts
import { inject } from 'vue'
import { notificadorKey } from '@/plugins/notificaciones'

export function useNotificador() {
  const notificador = inject(notificadorKey)
  if (!notificador) throw new Error('useNotificador() requiere el plugin de notificaciones instalado')
  return notificador
}
```

```vue
<script setup lang="ts">
import { useNotificador } from '@/composables/useNotificador'

const { notificar } = useNotificador()
</script>
```

## 20.6 Configuración Global de Manejo de Errores

Un patrón habitual en `main.ts`: capturar cualquier error no manejado en toda la aplicación, útil para enviarlo a un servicio de monitoreo.

```typescript
// main.ts
app.config.errorHandler = (error, instancia, info) => {
  console.error('Error capturado globalmente:', error, info)
  // enviarAServicioDeMonitoreo(error)
}
```

## 20.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Instalar una librería de terceros (router, Pinia) | `app.use(libreria)` |
| Empaquetar funcionalidad propia reutilizable entre proyectos | Un plugin con `install(app, opciones)` |
| Un componente disponible en toda la app sin import | `app.component('Nombre', Componente)` |
| Compartir una utilidad vía Composition API desde un plugin | `app.provide()` + composable propio (`useX`) |
| Capturar errores no manejados globalmente | `app.config.errorHandler` |

## 20.8 Errores Comunes

- **Registrar demasiados componentes globalmente**: aumenta el tamaño del bundle inicial y reduce la trazabilidad de dependencias entre archivos.
- **Usar `globalProperties` en un proyecto que ya usa Composition API en todos lados**: rompe la coherencia; un plugin que hace `provide()` + un composable (`useNotificador`) encaja mejor con el resto del código.
- **Olvidar `declare module 'vue'` al agregar una propiedad global**: TypeScript marcará como error cualquier uso de esa propiedad, aunque funcione correctamente en tiempo de ejecución.
