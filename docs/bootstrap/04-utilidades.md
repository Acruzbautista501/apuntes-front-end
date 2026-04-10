# Módulo 4: Utilidades (Espaciado, Bordes y Visibilidad)
El **Módulo 4** trata sobre las **Utilidades**. Si el Grid es el esqueleto y los Componentes son los órganos, las Utilidades son los detalles finales: el maquillaje, la distancia entre objetos y el control de qué se ve y qué no.

Lo mejor de este módulo es que te permite ajustar el diseño **sin escribir una sola línea de CSS propio**.

## 4.1 El Sistema de Espaciado (`m-` y `p-`)
Bootstrap utiliza una notación abreviada para asignar `margin` (espacio exterior) y `padding` (espacio interior).

**La fórmula es: `{propiedad}{lados}-{tamaño}`**

1.  **Propiedad:**
    * `m` - para **margin**.
    * `p` - para **padding**.
2.  **Lados:**
    * `t` - **top** (arriba).
    * `b` - **bottom** (abajo).
    * `s` - **start** (izquierda/inicio).
    * `e` - **end** (derecha/final).
    * `x` - **eje X** (izquierda y derecha a la vez).
    * `y` - **eje Y** (arriba y abajo a la vez).
    * *(Nada)* - Aplica a los **4 lados**.
3.  **Tamaño:**
    * Va del `0` al `5` (donde `0` es nada y `5` es el máximo espacio predefinido).
    * `auto` - Para centrar elementos (solo en márgenes).

**Ejemplos rápidos:**
* `mt-3`: Margen arriba de nivel 3.
* `px-5`: Padding lateral grande.
* `m-0`: Quita todos los márgenes.
* `mx-auto`: Centra un bloque horizontalmente (si tiene un ancho definido).

## 4.2 Bordes y Sombras
Ya no necesitas pelear con `border-radius` o `box-shadow` en CSS.

* **Bordes:**
    * `.border`: Añade un borde gris suave.
    * `.border-top`, `.border-end`, etc.: Añade borde solo a un lado.
    * `.border-primary`: Cambia el color del borde.
* **Redondeado (Rounded):**
    * `.rounded`: Esquinas ligeramente curvas.
    * `.rounded-circle`: Crea un círculo perfecto (útil para fotos de perfil).
    * `.rounded-pill`: Crea bordes tipo "pastilla" (extremos muy curvos).
* **Sombras (Shadows):**
    * `.shadow-sm`: Sombra sutil.
    * `.shadow`: Sombra normal.
    * `.shadow-lg`: Sombra profunda para dar mucha elevación.

## 4.3 Dimensiones (Ancho y Alto)
Para controlar el tamaño de una imagen o un div rápidamente:

* **Ancho (Width):** `.w-25`, `.w-50`, `.w-75`, `.w-100` (representan porcentajes).
* **Alto (Height):** `.h-25`, `.h-50`, `.h-75`, `.h-100`.
* **Ancho de pantalla:** `.vw-100` (ocupa todo el ancho visible del navegador).

## 4.4 Utilidades de Display (Visibilidad)
Esta es una de las herramientas más potentes para el diseño responsivo. Te permite mostrar u ocultar elementos según el dispositivo.

**Sintaxis:** `d-{valor}` o `d-{breakpoint}-{valor}`

* `.d-none`: Oculta el elemento por completo.
* `.d-block`: Lo muestra como un bloque.
* `.d-flex`: Lo convierte en un contenedor Flexbox.

**¿Cómo ocultar algo solo en móvil?**
* Usa `.d-none .d-md-block`.
* *Traducción:* "Ocúltalo en todo (`none`), pero a partir de pantallas medianas (`md`), muéstralo como bloque (`block`)".

## 4.5 Alineación de Texto
* `.text-start`: Alineado a la izquierda.
* `.text-center`: Centrado.
* `.text-end`: Alineado a la derecha.
* `.text-lowercase / .text-uppercase / .text-capitalize`: Cambia el formato de las letras.

> **Resumen del Módulo 4:**
> Las utilidades son como "clases quirúrgicas". En lugar de crear una clase `.mi-boton-separado { margin-top: 20px; }`, simplemente le añades `mt-4` a tu botón de Bootstrap y listo. 
> 
> **Consejo:** No abuses del espaciado `5`. El diseño web moderno suele verse mejor con espacios equilibrados (niveles `2`, `3` o `4`).
