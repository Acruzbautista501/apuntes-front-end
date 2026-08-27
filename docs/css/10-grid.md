# Módulo 10: CSS Grid a Fondo

El Módulo 2 mostró columnas fijas con `grid-template-columns` y expansión con `grid-row`. Grid es mucho más grande que eso: es el único sistema de CSS diseñado desde cero para pensar en **dos dimensiones** (filas y columnas) al mismo tiempo, y este módulo cubre las herramientas que lo hacen realmente poderoso en proyectos reales.

## 10.1 `repeat()` y `minmax()`: Rejillas que No Repites a Mano

Escribir `grid-template-columns: 1fr 1fr 1fr 1fr` es tedioso y frágil. `repeat()` lo resume:

```css
.grid-simple {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columnas iguales */
  gap: 1rem;
}
```

`minmax(mínimo, máximo)` define un rango válido para el tamaño de una columna o fila, en lugar de un valor fijo:

```css
.grid-cards {
  display: grid;
  /* Cada columna: mínimo 200px, máximo 1 fracción del espacio */
  grid-template-columns: repeat(3, minmax(200px, 1fr));
}
```

## 10.2 `auto-fit` y `auto-fill`: Rejillas Verdaderamente Responsivas

Este es, probablemente, el patrón más útil de todo CSS Grid: una rejilla que **decide sola** cuántas columnas caben, sin una sola media query.

```css
.galeria-responsiva {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}
```

Esto se lee así: *"Repite tantas columnas de mínimo 220px como quepan; si sobra espacio, repártelo (`1fr`) entre las columnas existentes."* Cuando la pantalla se achica y ya no cabe una columna de 220px, automáticamente se reacomoda con una columna menos.

> **`auto-fit` vs. `auto-fill`:** Con pocos elementos y espacio de sobra, `auto-fit` **estira** las columnas existentes para llenar el espacio vacío. `auto-fill` en cambio **deja huecos vacíos** del tamaño de una columna, sin estirar las que ya existen. En el 90% de los casos (galerías, tarjetas), `auto-fit` es lo que quieres.

## 10.3 `grid-template-areas`: Layouts Nombrados

En lugar de calcular en qué fila/columna cae cada elemento con números, puedes **dibujar** el layout con nombres, directamente en el CSS.

```css
.pagina {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "sidebar header"
    "sidebar contenido"
    "sidebar footer";
  min-height: 100vh;
  gap: 1rem;
}

.header    { grid-area: header; }
.sidebar   { grid-area: sidebar; }
.contenido { grid-area: contenido; }
.footer    { grid-area: footer; }
```

Cada fila de texto entre comillas representa una **fila visual** de la rejilla; cada palabra, una columna. Es, literalmente, un mapa ASCII de tu layout dentro del propio CSS — y es trivial redefinirlo dentro de una media query para cambiar el layout completo en móvil:

```css
@media (max-width: 768px) {
  .pagina {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "contenido"
      "sidebar"
      "footer";
  }
}
```

## 10.4 Rejilla Implícita vs. Explícita

* **Rejilla explícita:** La que defines a mano con `grid-template-columns`/`grid-template-rows`.
* **Rejilla implícita:** Las filas o columnas que Grid **crea automáticamente** cuando hay más contenido del que cabe en la rejilla explícita.

```css
.tablero {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Rejilla explícita: 3 columnas */
  grid-auto-rows: 150px;                 /* Cada fila NUEVA (implícita) medirá 150px */
  grid-auto-flow: row;                   /* row (por defecto) | column | dense */
}
```

`grid-auto-flow: dense` reordena el algoritmo de colocación para **rellenar huecos** dejados por elementos de distinto tamaño (útil en layouts tipo *masonry*), al costo de desconectar el orden visual del orden del HTML.

## 10.5 Alineación: Los 4 Ejes de Grid

Grid tiene el doble de propiedades de alineación que Flexbox, porque controla **dos dimensiones** en dos niveles (contenedor e ítem individual).

```css
.contenedor {
  display: grid;
  justify-items: center;  /* Alinea el CONTENIDO de cada celda, eje horizontal */
  align-items: center;    /* Alinea el CONTENIDO de cada celda, eje vertical */

  justify-content: center; /* Alinea TODA LA REJILLA dentro del contenedor, si sobra espacio */
  align-content: center;

  /* Atajos que combinan ambos ejes */
  place-items: center;    /* = justify-items + align-items */
  place-content: center;  /* = justify-content + align-content */
}

.item-especial {
  justify-self: end;  /* Sobrescribe justify-items SOLO para este ítem */
  align-self: start;
}
```

## 10.6 Subgrid: Alineación Entre Niveles de Anidamiento

Cuando anidas un `grid` dentro de una celda de otro `grid`, el hijo crea tradicionalmente **su propia** rejilla independiente — sus columnas no se alinean con las del padre. `subgrid` hace que el hijo **herede** las líneas de la rejilla del padre.

```css
.tarjeta-padre {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.contenido-interno {
  grid-column: span 4;
  display: grid;
  grid-template-columns: subgrid; /* Usa las 4 columnas del padre, no crea las suyas */
}
```

Es la herramienta correcta cuando necesitas que varias tarjetas independientes (cada una con su propio grid interno) alineen sus columnas entre sí perfectamente, como en una tabla de datos construida con componentes.

## 10.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Columnas iguales sin repetir código | `repeat(N, 1fr)` |
| Un rango de tamaño válido por columna | `minmax(min, max)` |
| Una rejilla que se autoajusta sin media queries | `repeat(auto-fit, minmax(...))` |
| Dibujar el layout con nombres, no números | `grid-template-areas` |
| Definir el tamaño de filas creadas dinámicamente | `grid-auto-rows` |
| Rellenar huecos en layouts tipo *masonry* | `grid-auto-flow: dense` |
| Alinear el contenido de todas las celdas a la vez | `place-items` |
| Alinear un solo ítem distinto al resto | `justify-self` / `align-self` |
| Que un grid anidado comparta columnas con el padre | `grid-template-columns: subgrid` |

> **¿Flexbox o Grid?** Si solo necesitas alinear elementos en **una** dirección (una fila de botones, un menú), usa Flexbox. Si necesitas controlar **filas y columnas simultáneamente** (la estructura general de una página, una tabla, un dashboard), usa Grid. No son competidores: la mayoría de las interfaces reales usan Grid para el esqueleto general y Flexbox dentro de cada componente individual.
