# Módulo 13: Formularios y Estados Interactivos

Los formularios son, junto con la navegación, el punto de contacto más crítico entre un usuario y una aplicación real. CSS tiene un juego completo de pseudo-clases pensadas específicamente para reflejar el estado de un formulario **sin una sola línea de JavaScript**.

## 13.1 Pseudo-clases de Validación Nativa

El navegador valida automáticamente atributos como `required`, `type="email"` o `pattern`, y expone el resultado como estado de CSS.

```css
input:required {
  border-left: 3px solid #f59e0b; /* Marca visualmente los campos obligatorios */
}

input:valid {
  border-color: #22c55e;
}

input:invalid {
  border-color: #ef4444;
}

/* Evita mostrar el error ANTES de que el usuario interactúe con el campo */
input:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
  background: #fef2f2;
}
```

> **El problema del `:invalid` prematuro:** si usas solo `input:invalid`, un campo vacío y obligatorio se verá "en error" desde que carga la página, antes de que el usuario haya escrito algo — una mala experiencia. La combinación `:invalid:not(:placeholder-shown)` es el patrón estándar para mostrar el error únicamente después de que el campo tuvo contenido y volvió a fallar.

## 13.2 Estados de Interacción

```css
/* :checked — Para checkboxes y radios marcados */
input[type="checkbox"]:checked + label {
  font-weight: bold;
  color: #3b82f6;
}

/* :disabled — Campos deshabilitados */
input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

/* :read-only — Campos de solo lectura (distinto a disabled: sí se puede seleccionar el texto) */
input:read-only {
  background: #f9fafb;
}

/* :in-range / :out-of-range — Para inputs numéricos con min/max */
input[type="number"]:out-of-range {
  border-color: #ef4444;
}

/* :placeholder-shown — Mientras el input está vacío y muestra su placeholder */
input:placeholder-shown {
  font-style: italic;
}
```

## 13.3 `accent-color`: Estilizar Controles Nativos sin Trucos

Antes, personalizar el color de un checkbox, radio o barra de progreso nativa requería ocultar el control original y construir uno falso con `::before`/`::after`. `accent-color` lo resuelve con una sola línea, manteniendo toda la accesibilidad nativa del control:

```css
input[type="checkbox"],
input[type="radio"],
input[type="range"],
progress {
  accent-color: #3b82f6; /* Todo el control adopta el color de marca */
}
```

## 13.4 `:focus-within` en Formularios

Ya se mencionó en el Módulo 8, pero su caso de uso más común es exactamente este: que un grupo completo de input + label reaccione cuando el usuario interactúa con el campo interno.

```css
.grupo-campo {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.grupo-campo:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.grupo-campo label {
  font-size: 0.75rem;
  color: #6b7280;
}
```

## 13.5 Patrón Completo: Campo con Validación Visual

```css
.campo {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.campo input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.campo input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.campo input:invalid:not(:placeholder-shown):not(:focus) {
  border-color: #ef4444;
}

.campo .mensaje-error {
  display: none;
  font-size: 0.8rem;
  color: #ef4444;
}

.campo:has(input:invalid:not(:placeholder-shown):not(:focus)) .mensaje-error {
  display: block; /* :has() muestra el mensaje de error usando el estado del input hermano */
}
```

## 13.6 Tabla de Referencia Rápida

| Pseudo-clase | Se activa cuando... |
| :--- | :--- |
| `:required` | El campo tiene el atributo `required` |
| `:valid` / `:invalid` | El navegador considera el valor válido/inválido |
| `:checked` | Un checkbox o radio está marcado |
| `:disabled` | El campo tiene el atributo `disabled` |
| `:read-only` | El campo tiene el atributo `readonly` |
| `:placeholder-shown` | El input está vacío y muestra su placeholder |
| `:in-range` / `:out-of-range` | El valor numérico respeta o no el `min`/`max` |
| `:focus-within` | Cualquier hijo del elemento tiene el foco |

> **Nota de accesibilidad:** Ninguna de estas técnicas reemplaza los mensajes de error accesibles vía `aria-describedby` y `aria-invalid`. CSS controla la **apariencia** del error; el HTML/ARIA correcto garantiza que un lector de pantalla también lo comunique.
