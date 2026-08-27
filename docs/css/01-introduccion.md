# Módulo 1: Fundamentos y Modelo de Caja

## 1.1 Introducción al Cómputo Visual
Para entender CSS, primero debemos entender qué pasa detrás de escena cuando abres una página web.

* **DOM (Document Object Model):** El navegador convierte tu HTML en un árbol de nodos.
* **CSSOM (CSS Object Model):** El navegador lee tus hojas de estilo y crea un mapa de reglas para esos nodos.
* **Render Tree:** El navegador combina el DOM y el CSSOM para saber qué elementos mostrar y con qué estilos. 
* **Painting:** Finalmente, el navegador "pinta" los píxeles en tu pantalla.

> **Nota:** Si el CSS está mal estructurado, el navegador tardará más en calcular el *Render Tree*, lo que afecta el rendimiento.

## 1.2 Formas de Vincular CSS

Antes de escribir tu primera regla, necesitas saber dónde vive ese CSS respecto a tu HTML. Hay tres formas, y solo una es recomendable en proyectos reales:

1.  **En línea (`inline`):** El estilo va directo en el atributo `style` del elemento (`<p style="color: red;">`). Tiene la especificidad más alta y es imposible de reutilizar. **Evítalo siempre que puedas.**
2.  **Interno (`internal`):** Un bloque `<style>` dentro del `<head>` del HTML. Útil solo para pruebas rápidas o emails HTML, nunca para un sitio real.
3.  **Externo (`external`):** Un archivo `.css` separado, enlazado con `<link rel="stylesheet" href="estilos.css">`. **Es el estándar profesional**: el navegador lo cachea, se reutiliza entre páginas y mantiene el HTML limpio.

```html
<head>
  <link rel="stylesheet" href="/css/estilos.css">
</head>
```

## 1.3 Sintaxis y Selectores
La unidad básica de CSS es la **regla**, compuesta por un **selector** y un **bloque de declaración**.

### Selectores Básicos
1.  **Universal (`*`):** Aplica a todos los elementos del documento. Se usa mucho para "resetear" márgenes.
2.  **De Tipo (Etiqueta):** Apunta a elementos HTML directamente (ej. `h1`, `p`, `div`).
3.  **De Clase (`.clase`):** El más usado en desarrollo profesional. Es reutilizable.
4.  **De ID (`#id`):** Único en toda la página. Tiene una jerarquía muy alta, por lo que se recomienda usarlo poco para estilos.

### Combinadores
Permiten seleccionar elementos basados en su relación con otros:
* **Descendiente (`espacio`):** `div p` selecciona todos los `<p>` que estén dentro de un `<div>`.
* **Hijo directo (`>`):** `ul > li` solo selecciona los hijos inmediatos.
* **Hermano adyacente (`+`):** `h1 + p` selecciona el primer `<p>` que aparece justo después de un `h1`.

## 1.4 La Cascada y Especificidad
CSS significa *Cascading Style Sheets*. La "Cascada" es el algoritmo que decide qué regla gana cuando hay un conflicto.

### Factores que determinan quién gana:
1.  **Origen:** (Estilos del navegador < Estilos del autor < Estilos con `!important`).
2.  **Especificidad:** Es un sistema de puntos.
    * Etiqueta: **1 punto**.
    * Clase: **10 puntos**.
    * ID: **100 puntos**.
    * Estilo en línea (dentro del HTML): **1000 puntos**.
3.  **Orden de aparición:** Si dos reglas tienen la misma especificidad, gana la que esté escrita al final del archivo.

### Herencia (`inheritance`)
Antes de pelear con la especificidad, entiende esto: **algunas propiedades pasan de padre a hijo automáticamente, y otras no.**

* **Propiedades que SÍ heredan (por defecto):** las relacionadas con texto — `color`, `font-family`, `font-size`, `line-height`, `text-align`. Por eso definir la tipografía en el `body` "baja" a todos los elementos.
* **Propiedades que NO heredan (por defecto):** las relacionadas con caja y layout — `margin`, `padding`, `border`, `width`, `display`. Tiene sentido: si el `padding` de un `div` se heredara, cada hijo anidado sumaría más y más espacio.
* **Forzar el comportamiento:** puedes usar la palabra clave `inherit` para obligar a heredar una propiedad que no lo hace por defecto, o `initial` para resetearla a su valor original del navegador.

```css
.tarjeta {
  border: 2px solid #ccc; /* NO se hereda a los hijos de .tarjeta */
  color: #1a1a1a;          /* SÍ se hereda a todos los textos internos */
}
```

## 1.5 Modelo de Caja (Box Model)
Este es el concepto más importante de CSS. **Todo en la web es una caja rectangular**, incluso si parece un círculo.

### Partes de la caja:
1.  **Content:** Donde vive el texto o la imagen.
2.  **Padding (Relleno):** Espacio interno entre el contenido y el borde.
3.  **Border (Borde):** La línea que rodea al padding y al contenido.
4.  **Margin (Margen):** Espacio externo que separa a esta caja de otras cajas.


### El gran problema: `box-sizing`
Por defecto, el navegador usa `content-box`. Esto significa que si le das a un div un `width: 300px` y un `padding: 20px`, el ancho total será de **340px** ($300 + 20 + 20$). Esto suele romper los diseños.

**La solución profesional:**
```css
* {
  box-sizing: border-box;
}
```
Con `border-box`, si defines `300px`, el navegador restará el padding y el borde del interior, manteniendo el tamaño total siempre en `300px`.

## 1.6 Unidades de Medida
Para que un sitio sea moderno, no podemos usar solo píxeles.

### Unidades Absolutas
* **px (Píxeles):** Son fijos. No cambian si el usuario aumenta el tamaño de la fuente en su navegador. Se usan para bordes o detalles que no deben variar.

### Unidades Relativas (Las preferidas)
* **rem:** Relativo al tamaño de fuente de la raíz (`<html>`). Si el estándar es 16px, `2rem` son 32px. Es vital para la **accesibilidad**.
* **em:** Relativo al tamaño de fuente del elemento padre. Útil para componentes modulares.
* **vw / vh:** Porcentaje del ancho (`vw`) o alto (`vh`) de la ventana del navegador. `100vh` ocupa toda la pantalla de alto.
* **%:** Relativo al tamaño del contenedor padre.

### Funciones Matemáticas (`calc`, `min`, `max`)
CSS no solo acepta valores fijos; puede **calcular** valores en tiempo real, incluso mezclando unidades distintas.

* **`calc()`:** Permite sumar, restar, multiplicar o dividir valores de distintas unidades en una sola expresión.
* **`min()`:** Usa el valor **más pequeño** de la lista que le des. Ideal para poner un límite superior flexible.
* **`max()`:** Usa el valor **más grande** de la lista. Ideal para poner un límite inferior flexible.

```css
.contenedor {
  /* El 100% del ancho, menos 40px fijos de márgenes laterales */
  width: calc(100% - 40px);
}

.tarjeta {
  /* Nunca más angosta que 300px, pero fluida hasta el 90% del contenedor */
  width: min(90%, 600px);
}

.titulo {
  /* Nunca más pequeño que 1.5rem, aunque el viewport sea diminuto */
  font-size: max(1.5rem, 4vw);
}
```

> **Nota:** `clamp(min, ideal, max)`, que verás en el Módulo 3, es en realidad un atajo que combina `min()` y `max()` en una sola función.

---

### Resumen Visual de un Reset Profesional
Al iniciar cualquier proyecto, es buena práctica aplicar estos apuntes en un archivo `base.css`:

```css
/* 1. Aplicamos border-box a todo */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 2. Usamos unidades relativas para que el usuario tenga control */
html {
  font-size: 16px; /* 1rem = 16px */
}

body {
  line-height: 1.5; /* Mejora la lectura */
  font-family: sans-serif;
}
```