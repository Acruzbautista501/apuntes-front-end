# Módulo 2: El Sistema de Grid y Layout
El **Módulo 2** es el más importante de todos. Aquí aprenderás cómo Bootstrap organiza el espacio. Si entiendes cómo funciona el **Grid (rejilla)**, podrás maquetar cualquier sitio web, desde un blog sencillo hasta un dashboard complejo.

## 2.1 Los Contenedores (`.container`)
Antes de poner columnas, necesitas un "recipiente" que envuelva todo tu contenido. Los contenedores centran tu contenido y le dan márgenes laterales.

Existen dos tipos principales:
* **.container**: Tiene un ancho fijo que cambia según el tamaño de la pantalla (deja espacios en blanco a los lados en pantallas grandes).
* **.container-fluid**: Ocupa el **100% del ancho** de la pantalla siempre, sin importar el dispositivo.

## 2.2 La Anatomía del Grid (Filas y Columnas)
Bootstrap utiliza un sistema de **12 columnas imaginarias**. Para usarlas, debes seguir esta jerarquía obligatoria:
1.  **Contenedor** (`.container`)
2.  **Fila** (`.row`): Funciona como un envoltorio para las columnas.
3.  **Columna** (`.col-`): Donde realmente va tu contenido.

::: tip 💡 Regla de Oro: La suma de 12
Dentro de una `.row`, puedes dividir el espacio como quieras, siempre que los números sumen **12**.
* Si quieres dos mitades iguales: `.col-6` y `.col-6`.
* Si quieres tres partes iguales: `.col-4`, `.col-4` y `.col-4`.
* Si quieres una barra lateral pequeña y un contenido ancho: `.col-3` y `.col-9`.
:::

## 2.3 Breakpoints: El Secreto de la Responsividad
Aquí es donde ocurre la "magia". Queremos que en una PC se vean 3 columnas, pero en un celular se vea solo 1 (una encima de otra). Para eso usamos los prefijos de tamaño:

| Prefijo | Dispositivo | Tamaño de pantalla |
| :--- | :--- | :--- |
| `(ninguno)` | Celular (Extra small) | < 576px |
| `sm` | Celular horizontal (Small) | ≥ 576px |
| `md` | Tablets (Medium) | ≥ 768px |
| `lg` | Laptops/PC (Large) | ≥ 992px |
| `xl` | Pantallas grandes (X-Large) | ≥ 1200px |

### Ejemplo Práctico:
Imagina que quieres una tarjeta que ocupe todo el ancho en móvil, pero la mitad en una tablet:
```html
<div class="row">
    <div class="col-12 col-md-6"> Tarjeta 1 </div>
    <div class="col-12 col-md-6"> Tarjeta 2 </div>
</div>
```
* `col-12`: En móviles (por defecto), ocupa las 12 columnas.
* `col-md-6`: A partir de pantallas medianas (tablets), pasa a ocupar solo 6 columnas (la mitad).

## 2.4 Alineación con Flexbox
Bootstrap 5 utiliza **Flexbox** por detrás, lo que nos permite alinear cosas fácilmente usando clases en la fila (`.row`).

### Alineación Horizontal (`justify-content`)
Se aplican a la clase `.row`:
* `.justify-content-start`: Todo a la izquierda.
* `.justify-content-center`: Todo al centro.
* `.justify-content-end`: Todo a la derecha.
* `.justify-content-between`: Espacio igual entre las columnas.

### Alineación Vertical (`align-items`)
Si tus columnas tienen diferentes alturas, puedes alinearlas así:
* `.align-items-start`: Arriba.
* `.align-items-center`: Al centro vertical.
* `.align-items-end`: Abajo.

## 2.5 El concepto de "Gutter" (Espaciado)
El **Gutter** es el espacio (hueco) que hay entre las columnas para que el contenido no quede pegado.
* Bootstrap lo gestiona automáticamente, pero puedes cambiarlo con la clase `g-`.
* Ejemplo: `<div class="row g-3">` añade un espacio moderado. `<div class="row g-0">` elimina todo el espacio entre columnas.