
# Módulo 2: Diseño y Maquetación (The Layout Engine)
El **Módulo 2** es la "columna vertebral" de Tailwind CSS. Aquí es donde dejas de mover elementos "a ojo" y empiezas a utilizar un sistema de diseño profesional. Dominar el **Layout (Maquetación)** te permitirá crear cualquier interfaz que imagines.

Dividiremos este módulo en los 4 pilares fundamentales del diseño moderno.

## 2.1 El Modelo de Caja (Box Model)
Antes de posicionar elementos, debemos controlar su tamaño y el espacio que los rodea. Tailwind utiliza una escala numérica donde `1 unidad = 0.25rem` (normalmente 4px).

### A. Padding (Interno) y Margin (Externo)
* **Padding (`p-{n}`):** Espacio dentro del borde.
* **Margin (`m-{n}`):** Espacio fuera del borde.

**Direcciones comunes:**
* `pt-4` (Padding Top), `pb-4` (Bottom), `pl-4` (Left), `pr-4` (Right).
* `px-6` (Eje X: Izquierda y Derecha).
* `py-2` (Eje Y: Arriba y Abajo).

### B. Border y Box-Sizing
En Tailwind 4, todos los elementos tienen `box-border` por defecto, lo que significa que el padding y el borde no aumentan el ancho total del elemento.

```html
<div class="m-8 border-2 border-blue-500 p-4">
  Contenido protegido por el padding.
</div>
```

## 2.2 Display y Posicionamiento
El "Display" determina cómo se comporta un elemento en el flujo del documento.

* **`block`:** Ocupa todo el ancho disponible (ej. un `<div>`).
* **`inline-block`:** Fluye con el texto pero permite definir ancho y alto.
* **`hidden`:** Desaparece el elemento por completo.

### Posicionamiento Relativo y Absoluto
Es vital para crear elementos superpuestos (como una notificación sobre un icono).
* **`relative`:** Crea un marco de referencia.
* **`absolute`:** Saca al elemento del flujo y lo coloca respecto al padre `relative`.

```html
<div class="relative w-16 h-16">
  <img src="avatar.jpg" class="rounded-full">
  <span class="absolute top-0 right-0 block w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
</div>
```

## 2.3 Flexbox: El Rey de la Alineación Unidimensional
Flexbox se usa para alinear elementos en una sola dirección (fila o columna). Es la herramienta más usada en el frontend moderno.

### Conceptos Clave:
1.  **`flex`:** Activa el contenedor flex.
2.  **`flex-row` / `flex-col`:** Define la dirección (Fila por defecto).
3.  **`justify-{pos}`:** Alinea en el **eje principal** (horizontal si es fila).
    * `justify-start`, `justify-center`, `justify-end`, `justify-between` (separa los elementos).
4.  **`items-{pos}`:** Alinea en el **eje secundario** (vertical si es fila).
    * `items-start`, `items-center`, `items-end`.

**Ejemplo: Una barra de navegación profesional**
```html
<nav class="flex justify-between items-center p-4 bg-gray-800 text-white">
  <div class="font-bold">MiLogo</div>
  
  <ul class="flex gap-4"> <li>Inicio</li>
    <li>Proyectos</li>
    <li>Contacto</li>
  </ul>
</nav>
```

## 2.4 Grid Layout: El Maestro de las Rejillas Bidimensionales
A diferencia de Flexbox, Grid es ideal para estructuras de filas **y** columnas al mismo tiempo (como una galería o un dashboard).

### Conceptos Clave:
1.  **`grid`:** Activa el contenedor grid.
2.  **`grid-cols-{n}`:** Define cuántas columnas tendrá la rejilla.
3.  **`col-span-{n}`:** Indica cuántas columnas debe ocupar un hijo específico.
4.  **`gap-{n}`:** Espaciado entre celdas.

**Ejemplo: Una rejilla de 3 columnas donde un elemento destaca**
```html
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2 bg-blue-200 p-4">Contenido Principal (Ancho 2/3)</div>
  <div class="bg-gray-200 p-4">Lateral (Ancho 1/3)</div>
  <div class="bg-gray-200 p-4">Footer 1</div>
  <div class="bg-gray-200 p-4">Footer 2</div>
  <div class="bg-gray-200 p-4">Footer 3</div>
</div>
```

## 2.5 Dimensiones (Width & Height)
Controlar el tamaño exacto es crucial para la estabilidad visual.

* **Ancho (`w-{n}`):** Puede ser fijo (`w-64`), porcentual (`w-1/2` para 50%) o total (`w-full`).
* **Alto (`h-{n}`):** Igual que el ancho. `h-screen` hace que el elemento ocupe toda la altura de la pantalla.
* **Max/Min:** `max-w-7xl` (ancho máximo común para secciones centrales) o `min-h-0`.

::: tip 💡 Resumen para tus apuntes:
1.  Usa **Margin** para separar elementos entre sí, **Padding** para dar aire dentro de un elemento.
2.  Usa **Flexbox** para componentes pequeños (botones, filas de iconos, menús sencillos).
3.  Usa **Grid** para la estructura general de la página o galerías de tarjetas.
4.  El **Posicionamiento Absoluto** requiere siempre que el padre sea **Relative**.
:::