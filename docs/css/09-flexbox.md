# Módulo 9: Flexbox a Fondo

El Módulo 2 te mostró lo esencial de Flexbox (`justify-content`, `align-items`, `gap`) para resolver casos simples. Este módulo completa el modelo: cómo controlan los *hijos* su propio comportamiento dentro del contenedor, más allá de lo que dicta el padre.

## 9.1 El Contenedor: Eje Principal y Eje Cruzado

Todo en Flexbox gira en torno a dos ejes, y entenderlos es la clave para no memorizar propiedades sin lógica:

* **Eje principal (*main axis*):** La dirección en la que fluyen los elementos. Por defecto es horizontal (`row`).
* **Eje cruzado (*cross axis*):** Perpendicular al principal. Por defecto es vertical.

```css
.contenedor {
  display: flex;
  flex-direction: row;    /* row | row-reverse | column | column-reverse */
}
```

> **La regla de oro:** `justify-content` siempre controla el **eje principal**, y `align-items` siempre controla el **eje cruzado**. Si cambias `flex-direction` a `column`, los ejes se invierten: `justify-content` pasa a controlar el alto, y `align-items` el ancho.

## 9.2 `flex-wrap`: Cuando los Elementos No Caben

Por defecto, Flexbox intenta comprimir todos los elementos en **una sola línea**, aunque se vean aplastados.

```css
.galeria {
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos salten a una nueva línea */
  gap: 1rem;
}
```

Con múltiples líneas activas (`wrap`), aparece un tercer control: `align-content`, que distribuye el espacio **entre las líneas**, no entre los elementos de una sola línea.

## 9.3 Las Propiedades de los Hijos: `flex-grow`, `flex-shrink`, `flex-basis`

Esta es la parte que más suele faltar en tutoriales básicos, y es donde vive el verdadero poder de Flexbox: **cada hijo puede decidir cómo comportarse** ante el espacio disponible.

* **`flex-basis`**: El tamaño de partida del elemento, antes de repartir espacio extra o sobrante. Es como un `width` (o `height`, en `column`) pero con más prioridad para Flexbox.
* **`flex-grow`**: Un número que indica **cuánto** espacio sobrante debe absorber este elemento, en proporción a sus hermanos. `0` significa "no crezcas".
* **`flex-shrink`**: Un número que indica **cuánto** debe encogerse este elemento si no hay espacio suficiente. `0` significa "nunca me encojas".

```css
.item-a { flex-grow: 1; } /* Crece para llenar el espacio sobrante */
.item-b { flex-grow: 2; } /* Crece el DOBLE de rápido que .item-a */
.item-fijo { flex-grow: 0; flex-shrink: 0; flex-basis: 200px; } /* Nunca cambia de tamaño */
```

### El atajo `flex` (shorthand)
En la práctica casi nadie escribe las tres propiedades por separado; se usa el atajo `flex: grow shrink basis`.

```css
.sidebar {
  flex: 0 0 250px; /* No crece, no se encoge, base fija de 250px */
}

.contenido-principal {
  flex: 1 1 auto; /* Crece y se encoge libremente, ocupando el resto */
}

/* Atajo aún más común: */
.item {
  flex: 1; /* Equivale a: flex: 1 1 0% — reparte el espacio en partes iguales */
}
```

## 9.4 `align-self` y `order`: Excepciones Individuales

Cualquier hijo puede **desobedecer** la regla general del contenedor.

```css
.contenedor { display: flex; align-items: flex-start; }

.item-especial {
  align-self: center; /* Solo este hijo se centra, mientras los demás quedan arriba */
}

.item-vip {
  order: -1; /* Se mueve visualmente al inicio, sin tocar el HTML */
}
```

> **Nota:** `order` solo cambia el orden **visual**, no el orden en el DOM. Úsalo con cuidado: si reordenas visualmente pero un lector de pantalla sigue el orden del HTML, la experiencia de navegación por teclado/lectores puede volverse confusa.

## 9.5 Patrón Práctico: Navbar con Elemento que Empuja

Un truco muy usado: en lugar de `justify-content: space-between`, puedes darle `margin-left: auto` a un solo hijo para "empujarlo" hasta el final, dejando el resto agrupado a la izquierda.

```css
.navbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 2rem;
}

.navbar .logo { font-weight: bold; }

.navbar .boton-login {
  margin-left: auto; /* Empuja este elemento (y solo este) hasta el final */
}
```

## 9.6 Tabla de Referencia Rápida

| Propiedad | ¿Dónde va? | Qué controla |
| :--- | :--- | :--- |
| `flex-direction` | Contenedor | Dirección del eje principal |
| `flex-wrap` | Contenedor | Si los hijos saltan de línea |
| `justify-content` | Contenedor | Alineación en el eje principal |
| `align-items` | Contenedor | Alineación en el eje cruzado |
| `align-content` | Contenedor | Espacio entre líneas (con `wrap`) |
| `gap` | Contenedor | Separación entre hijos |
| `flex-grow` | Hijo | Cuánto crece ante espacio sobrante |
| `flex-shrink` | Hijo | Cuánto se encoge ante falta de espacio |
| `flex-basis` | Hijo | Tamaño de partida |
| `align-self` | Hijo | Sobrescribe `align-items` para ese hijo |
| `order` | Hijo | Reordena visualmente sin tocar el HTML |
