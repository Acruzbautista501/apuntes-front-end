# Módulo 14: Container Queries

El Módulo 3 enseñó *media queries*: adaptar el diseño según el tamaño de la **pantalla completa**. Pero un componente reutilizable (una tarjeta, un widget) no vive siempre a pantalla completa — a veces está en un sidebar angosto, a veces en el área principal ancha. El viewport es el mismo en ambos casos; el espacio disponible, no. Las **Container Queries** permiten que un componente pregunte por el tamaño de **su propio contenedor**, no por el de la pantalla.

## 14.1 Declarar un Contenedor

Un elemento no puede responder a container queries hasta que un ancestro se declare explícitamente como contenedor, con `container-type`.

```css
.sidebar {
  container-type: inline-size; /* Habilita consultas basadas en el ancho */
}
```

| Valor de `container-type` | Qué mide |
| :--- | :--- |
| `inline-size` | Solo el ancho (el caso más común) |
| `size` | Ancho y alto |
| `normal` | Ninguno (valor por defecto, sin container queries) |

## 14.2 `@container`: La Media Query, pero para un Contenedor

Una vez declarado el contenedor, cualquier **descendiente** puede reaccionar a su tamaño con `@container`.

```css
.tarjeta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Cuando el CONTENEDOR (no la pantalla) mide 400px o más */
@container (min-width: 400px) {
  .tarjeta {
    flex-direction: row;
    align-items: center;
  }
}
```

Con esto, la misma `.tarjeta` se ve en columna dentro de un sidebar angosto, y en fila dentro del área principal ancha — automáticamente, sin duplicar el componente ni depender del ancho de la ventana.

## 14.3 Contenedores con Nombre

En layouts anidados puede haber más de un contenedor en juego. Para evitar ambigüedad, se les puede dar nombre con `container-name` (o el atajo `container`).

```css
.sidebar {
  container: layout-sidebar / inline-size; /* nombre / tipo, en un solo atajo */
}

.tarjeta-interna {
  container: tarjeta-interna / inline-size;
}

/* Reacciona específicamente al contenedor "layout-sidebar" */
@container layout-sidebar (min-width: 300px) {
  .widget { font-size: 1.1rem; }
}

/* Reacciona específicamente al contenedor "tarjeta-interna" */
@container tarjeta-interna (min-width: 350px) {
  .titulo { font-size: 1.5rem; }
}
```

## 14.4 Unidades de Contenedor (`cqw`, `cqh`)

Además de `@container` como *bloque condicional*, CSS expone unidades relativas al tamaño del contenedor, útiles para tipografía fluida **dentro** de un componente:

```css
.tarjeta-hero {
  container-type: inline-size;
}

.tarjeta-hero h2 {
  /* El título crece según el ancho del CONTENEDOR, no del viewport */
  font-size: clamp(1.25rem, 5cqw, 2.5rem);
}
```

## 14.5 Container Queries vs. Media Queries

| Escenario | Herramienta correcta |
| :--- | :--- |
| El layout general de la página (navbar, sidebar visible/oculto) | Media Query — depende del dispositivo |
| Un componente reutilizable colocado en distintos contextos | Container Query — depende de su espacio real |
| Un formulario que a veces va en un modal angosto, a veces a pantalla completa | Container Query |
| Cambiar cuántas columnas tiene el layout general del sitio | Media Query |

> **Regla mental simple:** si estás diseñando el **esqueleto** del sitio, usa media queries. Si estás diseñando un **componente aislado** que viajará por distintas partes de la interfaz (sidebar, modal, página completa), usa container queries. Antes de esta característica, un componente verdaderamente responsivo a su contexto era casi imposible sin JavaScript midiendo el DOM manualmente.
