# Módulo 8: Selectores y Pseudo-clases Avanzadas

El Módulo 1 cubrió los 4 selectores básicos (universal, tipo, clase, ID) y 3 combinadores. Eso es suficiente para empezar, pero un desarrollador avanzado resuelve la mayoría de sus problemas de estilo **sin tocar el HTML ni JavaScript**, gracias a selectores más precisos.

## 8.1 Selectores de Atributo

Seleccionan elementos según un atributo HTML y, opcionalmente, su valor.

```css
/* Cualquier elemento con el atributo "disabled" */
[disabled] { opacity: 0.5; cursor: not-allowed; }

/* Inputs cuyo type sea exactamente "email" */
input[type="email"] { border-color: #3b82f6; }

/* Enlaces cuyo href empiece con "https" (externos seguros) */
a[href^="https"] { color: green; }

/* Enlaces cuyo href termine en ".pdf" */
a[href$=".pdf"]::after { content: " 📄"; }

/* Clases que CONTENGAN la palabra "warning" en cualquier parte */
[class*="warning"] { border-left: 4px solid orange; }
```

## 8.2 Pseudo-clases Estructurales

Seleccionan elementos según su **posición** dentro del padre, sin necesitar una clase extra en el HTML.

```css
/* El primer y último hijo */
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }

/* Todas las filas pares de una tabla (efecto cebra) */
tr:nth-child(even) { background: #f9fafb; }

/* Cada 3er elemento, empezando en el 1ro: 1, 4, 7... */
.item:nth-child(3n+1) { clear: both; }

/* El único hijo (útil para estilos condicionales de un solo elemento) */
.contenedor > p:only-child { text-align: center; }

/* Elementos sin ningún contenido (útil para ocultar contenedores vacíos) */
.alerta:empty { display: none; }
```

> **`nth-child` vs. `nth-of-type`:** `nth-child(2)` cuenta la posición del elemento entre **todos** sus hermanos, sin importar la etiqueta. `nth-of-type(2)` cuenta la posición solo entre hermanos del **mismo tipo de etiqueta**. Si un `<div>` tiene un `<h2>` seguido de dos `<p>`, `p:nth-of-type(1)` selecciona el primer párrafo; `p:nth-child(1)` no selecciona nada, porque el primer hijo real es el `<h2>`.

## 8.3 `:not()`, `:is()` y `:where()`

Estos tres selectores funcionales aceptan una **lista de selectores** como argumento, y son la clave para escribir CSS compacto y mantenible.

```css
/* :not() — Selecciona todo EXCEPTO lo que coincida */
.boton:not(.deshabilitado) { cursor: pointer; }
input:not([type="checkbox"]):not([type="radio"]) { width: 100%; }

/* :is() — Agrupa selectores largos en uno solo, sin repetir el contexto */
/* Antes: */
header h1, header h2, header h3 { font-family: "Sora"; }
/* Con :is(): */
header :is(h1, h2, h3) { font-family: "Sora"; }

/* :where() — Igual que :is(), pero con especificidad SIEMPRE en cero */
:where(h1, h2, h3) { margin-top: 0; }
```

**¿Por qué importa la diferencia entre `:is()` y `:where()`?** `:is()` toma la especificidad de su selector *más específico* interno; `:where()` siempre cuenta como cero puntos de especificidad. Esto hace que `:where()` sea ideal para escribir **estilos base fáciles de sobrescribir** (por ejemplo, en una librería de componentes), porque cualquier clase del proyecto que lo consuma podrá anularlo sin pelear con la especificidad.

## 8.4 `:has()`: El Selector de Padre

Durante años, CSS no podía seleccionar un elemento basándose en lo que contiene — solo podía "mirar hacia adelante" (descendientes), nunca "hacia atrás" (padres). `:has()` cambió eso por completo.

```css
/* Selecciona una .tarjeta SOLO SI contiene una imagen adentro */
.tarjeta:has(img) {
  padding-top: 0;
}

/* Un formulario que contiene un input inválido resalta completo */
form:has(input:invalid) {
  border: 2px solid #ef4444;
}

/* Un label se ve distinto si el checkbox que contiene está marcado */
label:has(input:checked) {
  background: #dbeafe;
  font-weight: bold;
}
```

::: tip 💡 Caso de uso real
`:has()` elimina la necesidad de JavaScript para patrones como "resaltar la tarjeta padre cuando su checkbox interno está marcado" o "cambiar el layout del grid si tiene más de 3 hijos" (`.grid:has(> :nth-child(4))`). Es, junto con Container Queries, uno de los cambios más importantes que ha recibido CSS en los últimos años.
:::

## 8.5 Pseudo-elementos

A diferencia de las pseudo-*clases* (que seleccionan un estado de un elemento existente), los pseudo-*elementos* seleccionan una parte **generada** que no existe como nodo HTML propio.

```css
/* ::before y ::after — Insertan contenido generado por CSS */
.requerido::after {
  content: " *";
  color: red;
}

.cita::before {
  content: "“";
  font-size: 2em;
  color: #9ca3af;
}

/* ::first-letter y ::first-line — Estilizan la tipografía inicial de un bloque */
.articulo p:first-of-type::first-letter {
  font-size: 3em;
  float: left;
  line-height: 0.8;
}

/* ::selection — Estiliza el texto que el usuario selecciona con el mouse */
::selection {
  background: #3b82f6;
  color: white;
}

/* ::placeholder — Estiliza el texto de ayuda de un input vacío */
input::placeholder {
  color: #9ca3af;
  font-style: italic;
}

/* ::marker — Estiliza el punto o número de una lista */
li::marker {
  color: #3b82f6;
  font-weight: bold;
}
```

## 8.6 Estados de Foco Modernos

```css
/* :focus-visible — Muestra el anillo de foco SOLO en navegación por teclado, no al hacer clic con mouse */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* :focus-within — El PADRE reacciona cuando cualquier hijo recibe foco */
.grupo-input:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
```

## 8.7 Tabla de Referencia Rápida

| Selector | Qué hace |
| :--- | :--- |
| `[attr^="valor"]` | Atributo que **empieza** con ese valor |
| `[attr$="valor"]` | Atributo que **termina** con ese valor |
| `[attr*="valor"]` | Atributo que **contiene** ese valor |
| `:nth-child(an+b)` | Posición matemática entre hermanos |
| `:not(selector)` | Excluye elementos que coincidan |
| `:is(a, b, c)` | Agrupa selectores, toma la especificidad más alta |
| `:where(a, b, c)` | Igual que `:is()`, pero con especificidad cero |
| `:has(selector)` | Selecciona el **padre** si contiene ese hijo |
| `::before` / `::after` | Contenido generado, no existe en el HTML |
| `:focus-visible` | Foco solo por teclado, no por clic |
| `:focus-within` | El padre reacciona al foco de un hijo |

> **Nota de rendimiento:** Selectores complejos anidados a muchos niveles (`div > ul > li > a > span`) son más difíciles de mantener y ligeramente más lentos de calcular que una clase directa. Prioriza siempre clases descriptivas; reserva los selectores avanzados de este módulo para casos donde de verdad no puedes tocar el HTML.
