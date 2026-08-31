# Módulo 23: Proyecto Integrador

Has recorrido el camino completo: desde `ref`/`reactive` hasta Pinia, Vue Router, testing y accesibilidad. Este módulo no enseña conceptos nuevos; es un **plano de construcción** para aplicar todo lo anterior en un solo proyecto coherente y de nivel profesional.

## 23.1 El Encargo

Vas a construir un **Gestor de Tareas Colaborativo** completo:

1. Autenticación (login/logout) con estado persistente entre recargas.
2. Listado de tareas con filtros (todas / pendientes / completadas) y búsqueda en tiempo real.
3. Creación y edición de tareas mediante un formulario validado, dentro de un modal accesible.
4. Organización en "proyectos" — rutas anidadas por proyecto (`/proyectos/:id/tareas`).
5. Estado global compartido (usuario, proyectos, tareas) con Pinia.
6. Componentes reutilizables con slots (una `BaseCard`, un `BaseModal` genérico).
7. Al menos un composable propio de datos (`useFetch` o similar) y un composable de UI (`useLocalStorage` o `useClickFuera`).
8. Transiciones al agregar/eliminar tareas de la lista.
9. Tests para al menos un componente, un composable y un store.

## 23.2 Checklist de Requisitos Técnicos

Cada punto remite al módulo donde se explicó la técnica. Autoevalúate antes de dar el proyecto por terminado.

### Fundamentos y Composition API
- [ ] Los componentes usan `<script setup lang="ts">` de forma consistente (Módulo 1, 2).
- [ ] El estado deriva correctamente con `computed` en lugar de recalcularse en el template (Módulo 2, Módulo 18).
- [ ] Ningún `reactive()` se desestructura sin `toRefs` (Módulo 2).

### Componentes
- [ ] Existe al menos un componente con props tipadas y valores por defecto (`withDefaults`) (Módulo 3).
- [ ] Existe un `v-model` personalizado sobre al menos un componente propio (Módulo 3).
- [ ] `BaseCard`/`BaseModal` usan slots (por defecto y nombrados) para ser genuinamente reutilizables (Módulo 4).
- [ ] Se usa un template ref para enfocar el primer campo del formulario al abrir el modal (Módulo 5).

### Lógica Reutilizable
- [ ] Existe al menos un composable propio con estado y funciones (Módulo 6).
- [ ] Los datos de tareas/proyectos se piden con un composable de fetch reutilizable, no con lógica repetida en cada vista (Módulo 13).

### Estado y Navegación
- [ ] Pinia gestiona el estado de usuario, proyectos y tareas (Módulo 12).
- [ ] Ningún store se desestructura sin `storeToRefs` (Módulo 12).
- [ ] Vue Router define rutas anidadas para proyectos/tareas, con al menos un `beforeEach` que protege rutas privadas (Módulo 10).
- [ ] Las vistas cargan con lazy loading (`() => import(...)`) (Módulo 10, Módulo 18).

### Interactividad y UX
- [ ] El formulario usa validación reactiva con `computed` y feedback progresivo (Módulo 8).
- [ ] La lista de tareas anima entrada/salida con `<TransitionGroup>` (Módulo 11).
- [ ] El modal usa `<Teleport to="body">` (Módulo 9).

### TypeScript
- [ ] Existen interfaces claras para `Usuario`, `Proyecto` y `Tarea`, reutilizadas en props, stores y composables (Módulo 14).
- [ ] Los emits de al menos un componente están tipados con la sintaxis de tupla (Módulo 3, Módulo 14).

### Accesibilidad
- [ ] El modal atrapa el foco y lo devuelve al cerrarse (Módulo 21).
- [ ] Los mensajes de error de formulario usan `aria-invalid`/`aria-describedby` (Módulo 21).
- [ ] El cambio de ruta anuncia el nuevo contenido o mueve el foco al encabezado principal (Módulo 21).

### Testing
- [ ] Al menos un componente tiene un test de renderizado e interacción con Vue Test Utils (Módulo 17).
- [ ] Al menos un composable tiene un test aislado (Módulo 17).
- [ ] Al menos un store de Pinia tiene un test con `setActivePinia` (Módulo 17).

## 23.3 Estructura de Archivos Sugerida

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/FormularioLogin.vue
│   │   ├── composables/useAuth.ts
│   │   └── stores/authStore.ts
│   ├── proyectos/
│   │   ├── components/TarjetaProyecto.vue
│   │   ├── stores/proyectosStore.ts
│   │   └── views/ProyectosView.vue
│   └── tareas/
│       ├── components/ListaTareas.vue
│       ├── components/FormularioTarea.vue
│       ├── composables/useTareas.ts
│       ├── stores/tareasStore.ts
│       └── views/TareasView.vue
├── shared/
│   ├── components/
│   │   ├── BaseCard.vue
│   │   ├── BaseModal.vue
│   │   └── BaseButton.vue
│   ├── composables/
│   │   └── useFetch.ts
│   └── directivas/
│       └── clickFuera.ts
├── router/
│   └── index.ts
├── types/
│   ├── usuario.types.ts
│   ├── proyecto.types.ts
│   └── tarea.types.ts
├── App.vue
└── main.ts
```

## 23.4 Criterios de "Terminado" (Definition of Done)

1. **¿Un usuario que navega solo con teclado puede crear, editar y eliminar una tarea sin perder el foco en ningún punto?**
2. **¿El estado de autenticación persiste tras recargar la página (F5)?**
3. **¿Los tests corren sin errores con `npm run test`?**
4. **¿`npm run build` genera un bundle sin errores de TypeScript?**
5. **¿Las vistas de proyectos y tareas cargan de forma diferida (visible en la pestaña Network del navegador, como archivos separados)?**

## 23.5 Siguientes Pasos

Con este proyecto terminado, ya tienes el criterio para:

* Auditar y mejorar aplicaciones Vue 3 escritas por otras personas, incluyendo su arquitectura y accesibilidad.
* Decidir con fundamento cuándo usar `provide`/`inject` frente a Pinia, o cuándo `<Suspense>` frente a un composable de fetch manual.
* Construir librerías de componentes internas reutilizables entre varios proyectos, con props, slots y tipado genérico bien diseñados.
* Integrar Vue con las demás tecnologías de este sitio: Tailwind CSS o Bootstrap para estilos, y TypeScript avanzado en toda la base de código.
