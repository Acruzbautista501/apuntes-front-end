
# Módulo 3: Responsive Design, Estados y Modo Oscuro
Si el Módulo 2 era la columna vertebral, el **Módulo 3** es el "superpoder" de Tailwind CSS. Aquí aprenderás a crear interfaces que se adaptan a cualquier pantalla (desde un iPhone SE hasta un monitor UltraWide) y a gestionar la interactividad sin escribir una sola línea de JavaScript para los estilos.

## 3.1 Mobile-First: La Filosofía de Diseño
Tailwind utiliza una estrategia **Mobile-First**. Esto significa que cualquier clase que pongas sin un prefijo se aplicará **primero a móviles** y luego se heredará hacia pantallas más grandes, a menos que la sobrescribas.

### Los Breakpoints (Puntos de interrupción)
Tailwind 4 viene con estos puntos de control por defecto:
* `sm:` (640px) - Tablets pequeñas.
* `md:` (768px) - Tablets grandes / Laptops pequeñas.
* `lg:` (1024px) - Laptops y Desktops.
* `xl:` (1280px) - Pantallas grandes.
* `2xl:` (1536px) - Monitores extra grandes.

### Ejemplo Práctico: Una cuadrícula adaptativa
Queremos que en móvil se vea 1 columna, en tablet 2 y en desktop 3.

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-blue-500 p-10">Tarjeta 1</div>
  <div class="bg-green-500 p-10">Tarjeta 2</div>
  <div class="bg-red-500 p-10">Tarjeta 3</div>
</div>
```

## 3.2 Estados Interactivos (Hover, Focus y más)
Tailwind te permite cambiar el estilo de un elemento según cómo interactúe el usuario con él usando **variantes**.

* `hover:` Cuando el ratón está encima.
* `focus:` Cuando el elemento está seleccionado (ej. un input).
* `active:` Mientras se hace clic.
* `disabled:` Cuando un botón o input está deshabilitado.

### Ejemplo de Botón Interactivo:
```html
<button class="bg-blue-600 text-white px-4 py-2 rounded-lg 
               hover:bg-blue-700 hover:shadow-lg
               focus:ring-4 focus:ring-blue-300
               active:scale-95 transition-all">
  Enviar Datos
</button>
```
> **Explicación:** `active:scale-95` hace que el botón se "hunda" un poco al hacer clic, dando un feedback visual muy profesional.


## 3.3 Relaciones: Group y Peer
A veces quieres cambiar el estilo de un hijo cuando pasas el ratón sobre el padre, o cambiar un elemento basado en el estado de su hermano.

### A. Variante `group` (Padre a Hijo)
Útil para tarjetas donde quieres que el texto cambie de color cuando pasas el ratón por cualquier parte de la tarjeta.
```html
<div class="group border p-4 hover:bg-blue-50">
  <h3 class="group-hover:text-blue-600">Título de la tarjeta</h3>
  <p class="text-gray-500">Pasa el ratón por la tarjeta para ver el cambio.</p>
</div>
```

### B. Variante `peer` (Entre Hermanos)
Ideal para validación de formularios sin JS.
```html
<input type="email" class="peer border p-2" placeholder="Tu email" />
<p class="mt-2 invisible peer-invalid:visible text-red-500">
  Por favor, introduce un correo válido.
</p>
```

## 3.4 Dark Mode (Modo Oscuro)
En Tailwind 4, el modo oscuro es más sencillo que nunca. Solo necesitas usar el prefijo `dark:`. Por defecto, Tailwind detecta la configuración del sistema operativo del usuario.

### Ejemplo de Tarjeta con Modo Oscuro:
```html
<div class="bg-white text-gray-900 p-6 rounded-lg 
            dark:bg-gray-800 dark:text-white border dark:border-gray-700">
  <h2 class="text-xl font-bold">Título Adaptativo</h2>
  <p class="mt-2 text-gray-600 dark:text-gray-400">
    Este texto cambia de color automáticamente según el tema del sistema.
  </p>
</div>
```

## 3.5 Teoría en Resumen: ¿Por qué esto es mejor?
Antiguamente, para hacer un diseño responsive, tenías que escribir consultas de medios (`@media queries`) en un archivo CSS separado, saltando de un lado a otro. Con Tailwind, tienes toda la lógica de diseño (el qué, el cómo y el cuándo) en un solo lugar.

::: tip Tips de oro:
1.  **Diseña primero para móvil:** No pongas `sm:` para todo. Pon las clases generales pensando en un iPhone SE y luego usa `md:` para pantallas más grandes.
2.  **No sobrecomplicar:** Si una tarjeta solo necesita ser una sola columna, no le pongas `grid-cols-1`. Solo pon `grid` y ya está.
3.  **Transiciones:** Usa siempre `transition-all` o `transition-colors` junto con `duration-300` para que los cambios de hover sean suaves y agradables al ojo humano.
:::