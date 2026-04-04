
# Módulo 4: Estilización Visual (Colores, Tipografía y Efectos)
Si los módulos anteriores construyeron la estructura y el comportamiento de tu sitio, el **Módulo 4** es el que le da el **alma y la identidad visual**. En Tailwind CSS 4, la estilización visual ha dado un salto enorme gracias a la integración nativa con variables CSS, permitiendo un control mucho más fino de la estética.

## 4.1 El Sistema de Colores (The Palette)
Tailwind 4 incluye una paleta de colores curada profesionalmente. Cada color (como `blue`, `red`, `slate`) tiene una escala del **50 al 950**.

### A. Aplicación de Colores
* **Fondo:** `bg-{color}-{intensidad}` (ej. `bg-blue-500`)
* **Texto:** `text-{color}-{intensidad}` (ej. `text-gray-800`)
* **Bordes:** `border-{color}-{intensidad}` (ej. `border-red-200`)

### B. Opacidad de Colores
Puedes añadir transparencia a cualquier color usando una barra diagonal `/` y el porcentaje:
```html
<div class="bg-blue-500/50 p-4 text-white">
  Contenido con fondo semitransparente
</div>
```

## 4.2 Tipografía Profesional
El texto es el 90% de la web. Tailwind te da herramientas para que se vea legible y elegante.

### A. Tamaño y Peso (`Font Size & Weight`)
* **Tamaño:** `text-xs` (pequeño) hasta `text-9xl` (gigante). Lo estándar para párrafos es `text-base`.
* **Peso:** `font-thin` (fino), `font-normal`, `font-bold` (negrita), `font-black` (muy grueso).

### B. Espaciado y Alineación
* **Leading (Interlineado):** `leading-tight` (junto), `leading-relaxed` (separado). Fundamental para la lectura de párrafos largos.
* **Tracking (Espaciado entre letras):** `tracking-tighter` o `tracking-widest`.
* **Alineación:** `text-left`, `text-center`, `text-justify`.

```html
<article class="max-w-prose">
  <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
    Diseño Tipográfico en la V4
  </h1>
  <p class="mt-4 text-lg text-slate-600 leading-relaxed">
    El interlineado relajado hace que los textos largos sean más fáciles de digerir para el usuario.
  </p>
</article>
```

## 4.3 Bordes, Sombras y Formas
Estos elementos crean la ilusión de profundidad (Z-index visual) y jerarquía.

### A. Border Radius (Esquinas redondeadas)
* `rounded-sm`, `rounded-md`, `rounded-lg`.
* `rounded-full`: Crea círculos perfectos o botones tipo "pastilla".

### B. Box Shadows (Sombras)
Las sombras en Tailwind 4 son muy realistas.
* `shadow-sm`: Apenas perceptible.
* `shadow-md`: Estándar para tarjetas.
* `shadow-2xl`: Para modales o elementos que "flotan" muy por encima del fondo.

### C. Ring (Anillos de borde)
A diferencia del borde normal, el `ring` es un outline que no ocupa espacio en el modelo de caja. Es ideal para estados de enfoque o botones destacados.
```html
<button class="rounded-full px-6 py-2 bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-200">
  Botón con Anillo
</button>
```

## 4.4 Filtros y Efectos Modernos
Tailwind 4 destaca en efectos que antes requerían mucho CSS complejo.

### A. Backdrop Blur (Desenfoque de fondo)
Es el famoso efecto "Glassmorphism" (vidrio esmerilado). Se aplica al contenedor, pero afecta a lo que hay *detrás*.
```html
<nav class="sticky top-0 bg-white/70 backdrop-blur-md border-b border-gray-200 p-4">
  Navegación Efecto Cristal
</nav>
```

### B. Filters (Filtros de imagen)
Puedes editar imágenes directamente con clases:
* `grayscale`: Escala de grises.
* `blur-sm`: Desenfocar la imagen.
* `sepia`: Tono antiguo.

## 4.5 Resumen Teórico: La Estética de Tailwind
La clave del Módulo 4 es entender que **menos es más**. Tailwind te ofrece una paleta limitada para evitar que uses 50 tonos de azul distintos. Al ceñirte a la escala (ej. usar solo `gray-50`, `gray-400` y `gray-900`), tu diseño se verá **coherente y profesional** automáticamente.

### Checklist de Estilización:
1.  **Contraste:** Asegúrate de que el `text-color` resalte sobre el `bg-color` (ej. texto oscuro en fondo claro).
2.  **Jerarquía:** Los títulos deben ser más grandes (`text-2xl+`) y pesados (`font-bold`) que el cuerpo.
3.  **Suavidad:** Usa `rounded-lg` y `shadow-md` para que tu interfaz no se vea "tosca" o anticuada.