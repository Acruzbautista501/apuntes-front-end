# Módulo 15: Integración con Vue y React

Todo lo visto hasta ahora asume HTML "plano". Este sitio también enseña Vue y TypeScript para Frontend — este módulo cubre específicamente la fricción real que aparece al combinar Bootstrap con un framework moderno, y cómo resolverla.

## 15.1 El Problema de Fondo

Bootstrap fue diseñado para un mundo donde **JavaScript manipula el DOM directamente**: cuando abres un modal, el JS de Bootstrap literalmente agrega clases y atributos al elemento. Vue y React, en cambio, asumen que **ellos son los únicos dueños del DOM** — reconstruyen el árbol de elementos a partir de su estado interno (`ref`, `useState`) en cada render.

Cuando ambos intentan controlar el mismo elemento, pueden "pelear": Bootstrap modifica el DOM por fuera del conocimiento del framework, y en el siguiente render, el framework puede revertir ese cambio sin darse cuenta, causando bugs intermitentes (un modal que no cierra bien, un dropdown que se queda "fantasma" en el DOM).

## 15.2 Usar SOLO el CSS de Bootstrap (La Opción Más Simple)

La forma más segura de evitar el conflicto: **importa solo el CSS de Bootstrap, nunca su JavaScript**, y controla toda la interactividad (mostrar/ocultar un modal, un dropdown) con el propio estado reactivo del framework.

```typescript
// main.ts — Solo el CSS, sin el bundle de JS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
```

```vue
<script setup lang="ts">
import { ref } from 'vue';

const modalAbierto = ref(false);
</script>

<template>
  <button class="btn btn-primary" @click="modalAbierto = true">Abrir</button>

  <!-- Vue controla la visibilidad con v-if, NO con las clases de Bootstrap -->
  <div v-if="modalAbierto" class="modal d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar</h5>
          <button class="btn-close" @click="modalAbierto = false"></button>
        </div>
        <div class="modal-body">¿Deseas continuar?</div>
      </div>
    </div>
  </div>

  <!-- El fondo oscuro (backdrop) también lo dibuja Vue, no Bootstrap JS -->
  <div v-if="modalAbierto" class="modal-backdrop fade show"></div>
</template>
```

Con este patrón usas únicamente las **clases visuales** de Bootstrap (`.modal`, `.modal-dialog`, `.d-block`), mientras el framework controla el ciclo de vida real del componente. Es más código manual, pero elimina el conflicto por completo.

## 15.3 Usar el JavaScript de Bootstrap con `onMounted` / `useEffect`

Si prefieres seguir usando la librería JS de Bootstrap (por comodidad, o porque necesitas su comportamiento exacto de animaciones y accesibilidad), inicialízala en el "gancho" de ciclo de vida del framework, **después** de que el elemento ya exista en el DOM real — nunca antes.

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

const modalRef = ref<HTMLElement | null>(null);
let modalInstancia: Modal;

onMounted(() => {
  if (modalRef.value) {
    modalInstancia = new Modal(modalRef.value);
  }
});

function abrir() {
  modalInstancia?.show();
}
</script>

<template>
  <button class="btn btn-primary" @click="abrir">Abrir</button>

  <div ref="modalRef" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">Contenido del modal</div>
      </div>
    </div>
  </div>
</template>
```

```tsx
// Equivalente en React
import { useRef, useEffect } from 'react';
import { Modal } from 'bootstrap';

function MiModal() {
  const modalRef = useRef<HTMLDivElement>(null);
  const instancia = useRef<Modal | null>(null);

  useEffect(() => {
    if (modalRef.current) {
      instancia.current = new Modal(modalRef.current);
    }
    return () => instancia.current?.dispose(); // Limpieza al desmontar
  }, []);

  return (
    <div ref={modalRef} className="modal" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">Contenido</div>
      </div>
    </div>
  );
}
```

> **La regla clave:** importa las clases de componentes de Bootstrap (`Modal`, `Tooltip`, `Dropdown`) directamente desde `'bootstrap'`, en lugar del bundle global `bootstrap.bundle.min.js`. Nunca dejes que el HTML de un `data-bs-toggle` dispare el componente por sí solo dentro de un framework — siempre inícialo explícitamente en el ciclo de vida, y destrúyelo (`.dispose()`) cuando el componente de Vue/React se desmonte, para evitar fugas de memoria.

## 15.4 Alternativas Especializadas

Para proyectos grandes, existen librerías que reescriben los componentes de Bootstrap como componentes nativos del framework (sin usar el JS original de Bootstrap en absoluto), eliminando el problema de raíz:

| Framework | Librería |
| :--- | :--- |
| React | `react-bootstrap` |
| Vue | `bootstrap-vue-next` |

Estas librerías exponen `<Modal>`, `<Dropdown>`, etc. como componentes reales de Vue/React con props y eventos, controlados 100% por el sistema reactivo del framework — a costa de aprender su propia API, que no es idéntica al HTML+clases de Bootstrap puro.

## 15.5 Tabla de Referencia Rápida

| Escenario | Estrategia recomendada |
| :--- | :--- |
| Proyecto pequeño, pocos componentes interactivos | Solo CSS de Bootstrap + estado del framework (15.2) |
| Necesitas el comportamiento exacto de Bootstrap JS (animaciones, foco) | JS de Bootstrap inicializado en `onMounted`/`useEffect` (15.3) |
| Proyecto grande, muchos componentes interactivos, equipo grande | `react-bootstrap` o `bootstrap-vue-next` (15.4) |
