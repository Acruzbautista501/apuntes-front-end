# Módulo 10: Vue Router

Ninguna aplicación real de una sola página funciona sin navegación entre vistas. Vue Router es la librería oficial de enrutamiento de Vue — mapea URLs a componentes, gestiona el historial del navegador y permite proteger rutas, todo integrado con TypeScript.

## 10.1 Instalación y Configuración Base

```bash
npm install vue-router@4
```

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '@/views/InicioView.vue'
import ContactoView from '@/views/ContactoView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'inicio', component: InicioView },
    { path: '/contacto', name: 'contacto', component: ContactoView }
  ]
})

export default router
```

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

```vue
<!-- App.vue -->
<template>
  <nav>
    <RouterLink to="/">Inicio</RouterLink>
    <RouterLink to="/contacto">Contacto</RouterLink>
  </nav>

  <RouterView />
</template>
```

`<RouterView>` es el "hueco" donde se renderiza el componente de la ruta actual; `<RouterLink>` genera un `<a>` que navega sin recargar la página.

## 10.2 Rutas con Parámetros Dinámicos

```typescript
{ path: '/productos/:id', name: 'producto-detalle', component: ProductoDetalleView }
```

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id // string | string[]
</script>

<template>
  <p>Mostrando el producto con ID: {{ id }}</p>
</template>
```

## 10.3 Navegación Programática

Además de `<RouterLink>`, se puede navegar desde el script — útil tras enviar un formulario o cerrar sesión.

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function irAlPerfil(id: number) {
  router.push(`/perfil/${id}`)
  // Equivalente y más explícito:
  router.push({ name: 'perfil', params: { id } })
}

function volver() {
  router.back()
}
</script>
```

`useRoute()` da información de la ruta **actual** (para leer); `useRouter()` da acceso al **enrutador** (para navegar).

## 10.4 Rutas Anidadas

Cuando una vista tiene sub-secciones con su propio contenido (una vista de "Ajustes" con pestañas de "Perfil" y "Seguridad"), se anidan rutas dentro de `children`.

```typescript
{
  path: '/ajustes',
  component: AjustesView,
  children: [
    { path: '', redirect: '/ajustes/perfil' },
    { path: 'perfil', component: AjustesPerfilView },
    { path: 'seguridad', component: AjustesSeguridadView }
  ]
}
```

`AjustesView.vue` necesita su propio `<RouterView>` interno para renderizar el hijo activo (`/ajustes/perfil` o `/ajustes/seguridad`).

## 10.5 Navigation Guards — Proteger Rutas

Los *guards* permiten ejecutar lógica antes de que una navegación se complete — el caso más común: redirigir a un usuario no autenticado.

```typescript
// router/index.ts
router.beforeEach((to, from) => {
  const estaAutenticado = !!localStorage.getItem('token')

  if (to.meta.requiereAuth && !estaAutenticado) {
    return { name: 'login' }
  }
})
```

```typescript
{ path: '/panel', component: PanelView, meta: { requiereAuth: true } }
```

`to.meta` acepta cualquier dato personalizado por ruta; tipar `meta` globalmente evita errores de tipeo:

```typescript
// router/index.ts
declare module 'vue-router' {
  interface RouteMeta {
    requiereAuth?: boolean
  }
}
```

## 10.6 Lazy Loading de Rutas (*Code Splitting*)

Importar cada vista de forma diferida evita que el navegador descargue el JavaScript de rutas que el usuario nunca visita — reduce el peso inicial de la aplicación.

```typescript
const routes = [
  {
    path: '/panel',
    component: () => import('@/views/PanelView.vue') // Se descarga solo al visitar esta ruta
  }
]
```

## 10.7 Layouts Distintos por Ruta

Un patrón común: rutas públicas usan un layout, rutas autenticadas usan otro. Se resuelve anidando las rutas bajo un componente de layout.

```typescript
const routes = [
  {
    path: '/',
    component: LayoutPublico,
    children: [
      { path: '', component: InicioView },
      { path: 'login', component: LoginView }
    ]
  },
  {
    path: '/app',
    component: LayoutPrivado,
    meta: { requiereAuth: true },
    children: [
      { path: 'panel', component: PanelView }
    ]
  }
]
```

## 10.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un enlace de navegación sin recargar la página | `<RouterLink to="...">` |
| El "hueco" donde se pinta la vista activa | `<RouterView />` |
| Leer parámetros de la URL actual | `useRoute().params` |
| Navegar desde el script | `useRouter().push(...)` |
| Proteger una ruta según autenticación | `router.beforeEach` + `meta.requiereAuth` |
| Reducir el peso inicial del bundle | Importar vistas con `() => import(...)` |

## 10.9 Errores Comunes

- **Confundir `useRoute` con `useRouter`**: `useRoute` (singular) es para leer la ruta actual; `useRouter` (plural) es para navegar.
- **No tipar `route.params.id`**: siempre es `string | string[]`, nunca `number` — conviértelo explícitamente si necesitas un número (`Number(route.params.id)`).
- **Olvidar el `<RouterView>` anidado en un layout con `children`**: sin él, las rutas hijas no tienen dónde renderizarse.
