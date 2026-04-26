# MÓDULO 11 — Animaciones y Transiciones

Si el Módulo 10 trataba sobre el "maquillaje" visual, el **Módulo 11 trata sobre la vida**. Una interfaz estática se siente muerta; una interfaz con microinteracciones bien ejecutadas se siente profesional, receptiva y cuidada. Las animaciones no son adornos; son guías visuales que le dicen al usuario qué está pasando en la pantalla.

## 11.1 Transition Basics (Fundamentos de Transiciones)

Las transiciones son la "columna vertebral" de la interactividad en la web moderna. Por defecto, los cambios de CSS en el navegador son instantáneos (ej. si cambias el color de un botón de azul a rojo, el cambio es abrupto). Una **transición** es la instrucción que le das al navegador para que interpole esos valores durante un tiempo determinado, creando un cambio suave y natural.

### La Anatomía de una Transición Profesional

Para que una transición pase de "básica" a "profesional", debes dominar los cuatro componentes que le dan forma. En Tailwind, cada uno de estos componentes es una clase utilitaria.

#### 1. Qué quieres animar (`transition-property`)
Tailwind te permite elegir qué propiedades se animarán. Es fundamental para el rendimiento:
* `transition-all`: Anima todo lo que cambia. **Úsalo con precaución**, ya que animar propiedades como `width` o `top` fuerza al navegador a recalcular el layout constantemente (causando "lag").
* `transition-colors`: Solo anima colores (fondo, borde, texto).
* `transition-transform`: Anima escalas, rotaciones y traslaciones. **Este es el recomendado**, ya que se procesa en la tarjeta gráfica (GPU).

#### 2. Duración (`duration-*`)
Define la velocidad.
* `duration-75`, `duration-100`, `duration-150` (Muy rápido, ideal para botones).
* `duration-300` (El "punto dulce" para casi cualquier interfaz de usuario).
* `duration-500` (Más lento, usado en menús complejos o modales).

#### 3. Easing (`ease-*`)
Define el **ritmo** del movimiento. No es lineal, sino que tiene personalidad:
* `ease-in`: Acelera conforme avanza. Se siente como un objeto "cayendo".
* `ease-out`: Empieza rápido y frena suavemente al final. **El mejor para elementos que entran en pantalla**.
* `ease-in-out`: Empieza suave, alcanza velocidad en medio y termina suave. El más **natural** para botones.
* `ease-linear`: Velocidad constante. Se siente robótico; evítalo en interfaces UI.

#### 4. Delay (`delay-*`)
Añade una pausa antes de empezar. Es vital para crear "staggering", donde los elementos aparecen en cascada en lugar de todos al mismo tiempo.

### Código: Implementación en *Soccer League Elite*

Para que tu aplicación se sienta "Premium", no basta con cambiar colores. Mira cómo unimos estas propiedades para crear una tarjeta de jugador profesional.

```html
<div class="
  bg-white p-6 rounded-xl border border-gray-200 shadow-md
  transition-all duration-300 ease-in-out
  hover:scale-105 hover:shadow-2xl hover:border-blue-500
  cursor-pointer
">
  <h3 class="font-bold text-lg">Nombre del Jugador</h3>
  <p class="text-gray-500">Haz hover para ver efecto</p>
</div>
```

### Ejemplo Avanzado: El "Botón de Registro"
Cuando el usuario presiona un botón, debe sentirse como si estuviera hundiendo un objeto físico. Aquí usamos `active:scale-95`.

```html
<button class="
  bg-blue-600 text-white font-bold py-3 px-6 rounded-lg
  transition-all duration-200 ease-in-out
  hover:bg-blue-700
  active:scale-95 active:shadow-inner
">
  Registrar Gol
</button>
```

::: tip 💡 Consejos del Diseñador Frontend:
1.  **La Regla de los 300ms:** Como norma general, si una animación dura más de 300ms, el usuario empezará a sentir que la aplicación es lenta. Si dura menos de 100ms, el usuario apenas notará el cambio. Mantén tus microinteracciones en ese rango.
2.  **No animes todo:** Si aplicas `transition-all` a todo tu sitio, consumirás recursos innecesarios del procesador y la batería del usuario. Sé específico: si solo vas a cambiar el color de fondo, usa `transition-colors`. Si vas a mover un elemento, usa `transition-transform`.
3.  **GPUs son tus amigas:** Siempre que puedas, anima `transform` (escala, rotación, traslación) y `opacity`. El navegador puede pasar estas tareas a la tarjeta gráfica (GPU), dejando el hilo principal de JavaScript libre para que tu aplicación nunca se trabe.
:::

## 11.2 Transform (Transformaciones)

Las **Transformaciones (Transforms)** son probablemente la herramienta más potente que tienes en tu arsenal para crear interfaces fluidas. A diferencia de modificar propiedades como `width`, `height` o `margin` —que obligan al navegador a recalcular la posición de cada elemento vecino (un proceso pesado llamado *Reflow/Layout*)—, las transformaciones se ejecutan directamente en la **GPU (tarjeta gráfica)** del usuario.

Esto significa que puedes animar cosas complejas manteniendo siempre los **60 cuadros por segundo (FPS)**, lo que resulta en una experiencia de usuario que se siente nativa, suave y profesional.

### Los 3 Pilares de las Transformaciones

#### 1. Scale (Escala)
Cambia el tamaño visual de un elemento sin alterar el espacio que ocupa en la página. Es ideal para dar énfasis o confirmar un estado.
* `scale-90`: Reduce al 90%.
* `scale-100`: Tamaño original.
* `scale-110`: Aumenta un 10%.
* *Nota:* Si el elemento crece, se dibujará encima de sus vecinos, pero no los empujará (porque no cambia su *box model* real).

#### 2. Rotate (Rotación)
Gira el elemento sobre su eje central.
* `rotate-45`: Gira 45 grados en sentido horario.
* `rotate-180`: Gira media vuelta.
* `rotate-[-10deg]`: (Valor arbitrario) Permite rotaciones específicas.

#### 3. Translate (Traslación)
Mueve el elemento de su posición original sin afectar el flujo del documento.
* `translate-x-4`: Mueve el elemento 16px (1rem) a la derecha.
* `translate-y-[-10px]`: Mueve 10px hacia arriba.

### Implementación Profesional: Dashboard de "Soccer League Elite"

Para que tu aplicación no se sienta estática, vamos a aplicar estas transformaciones en interacciones clave.

#### Ejemplo A: Tarjeta de Equipo (Efecto "Elevación")
Al pasar el ratón, la tarjeta debe crecer ligeramente y "elevarse". Esto comunica sutilmente al usuario que la tarjeta es interactiva.

```html
<div class="bg-white p-6 rounded-xl shadow-lg 
            transition-transform duration-300 
            hover:scale-105 hover:-translate-y-2 cursor-pointer">
  <h3 class="font-bold text-lg">Águilas FC</h3>
  <p class="text-gray-500">Haz clic para ver estadísticas</p>
</div>
```

#### Ejemplo B: Botón de "Acción Presionada"
Cuando un usuario hace clic en el botón de "Registrar Gol", este debe encogerse un poco para simular la presión física real.

```html
<button class="bg-blue-600 text-white px-6 py-2 rounded-lg 
               transition-transform duration-100 active:scale-95 shadow-md">
  Confirmar Gol
</button>
```

### El "Secreto Pro": Transform Origin
Por defecto, las transformaciones ocurren desde el centro (`transform-origin-center`). Pero, ¿qué pasa si quieres que un elemento rote como si fuera una puerta (desde el borde)? Aquí entra la utilidad `origin-*`.

* `origin-top-left`: El punto de pivote es la esquina superior izquierda.
* `origin-bottom`: El punto de pivote es la base.

**Ejemplo: Un menú lateral que se despliega desde la esquina superior izquierda:**

```html
<div class="origin-top-left transition-transform duration-300 scale-0 hover:scale-100">
  Opciones del Equipo
</div>
```

::: tip 💡 Consejos del Diseñador Frontend:
1.  **Encadenamiento:** Puedes combinar clases: `hover:scale-110 hover:rotate-2`. El orden no importa, pero la combinación de escala y rotación añade dinamismo a elementos como avatares de jugadores.
2.  **No fuerces el layout:** Como las transformaciones ocurren en una capa superior a la del diseño (el *compositing layer*), ten cuidado con el `z-index`. Si usas un `translate` muy grande, el elemento podría cubrir otros botones, bloqueando su acceso.
3.  **Animación de entrada:** Si quieres que una página de estadísticas cargue con estilo, aplica una transformación inicial: ponle `opacity-0` y `translate-y-10`, y usa una transición para llevarla a `opacity-100` y `translate-y-0`. Se verá como una entrada elegante y profesional.
:::

## 11.3 Animate Utilities (Utilidades de Animación)

Las utilidades de animación (`animate-*`) de Tailwind son "recetas" predefinidas de *keyframes* (fotogramas clave). En lugar de escribir toda la lógica de CSS para mover un elemento, Tailwind ya tiene empaquetadas las animaciones más comunes utilizadas en interfaces SaaS y aplicaciones web modernas.

Estas animaciones son **cíclicas** por defecto (se repiten infinitamente), por lo que son perfectas para dar feedback visual continuo al usuario.

### Desglose de Utilidades

| Clase | Efecto Visual | Caso de Uso en *Soccer League Elite* |
| :--- | :--- | :--- |
| `animate-spin` | Giro constante (360°) | Indicadores de carga al procesar resultados o registros. |
| `animate-pulse` | Opacidad oscilante | "Skeleton screens" (esquemas de carga) en tablas de posiciones. |
| `animate-ping` | Expansión suave (onda) | Notificaciones de "nuevo gol" o "partido en vivo". |
| `animate-bounce` | Salto vertical | Indicadores de "bajar para ver más" o botones de llamado a la acción. |


### Implementación Práctica

Para integrar estas animaciones en tu dashboard de *Soccer League Elite*, sigue estos ejemplos de implementación:

#### 1. `animate-spin` (Carga de Datos)
Ideal cuando el usuario hace clic en "Actualizar Tabla" y esperas la respuesta del servidor.

```html
<button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
  <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
  </svg>
  <span>Procesando...</span>
</button>
```

#### 2. `animate-ping` (Notificación de Evento)
Este efecto crea una onda que se expande, perfecto para resaltar un evento en vivo.

```html
<div class="relative flex h-3 w-3">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
</div>
<span class="ml-2 text-sm font-bold text-red-500">Partido en Vivo</span>
```

#### 3. `animate-pulse` (Skeleton Loader)
Los *Skeleton Screens* mejoran la percepción de velocidad de la app. Es mejor mostrar una forma gris animada que una pantalla en blanco.

```html
<div class="animate-pulse flex space-x-4 p-4 border-b">
  <div class="rounded-full bg-slate-200 h-10 w-10"></div>
  <div class="flex-1 space-y-3 py-1">
    <div class="h-2 bg-slate-200 rounded w-3/4"></div>
    <div class="h-2 bg-slate-200 rounded w-5/6"></div>
  </div>
</div>
```

::: tip 💡 Consejos del Diseñador Frontend:
1.  **No abuses del infinito:** Animaciones como `animate-spin` o `animate-pulse` son infinitas. Si tienes 20 elementos con estas animaciones activas al mismo tiempo, el navegador consumirá mucha batería y recursos del procesador (especialmente en móviles). **Úsalas solo cuando el estado lo requiera** (ej. mostrar el spinner solo mientras dura la petición HTTP).
2.  **Accesibilidad (Crucial):** Algunos usuarios experimentan mareos con animaciones continuas. Tailwind 4 respeta las preferencias del sistema. Si quieres ser un desarrollador senior, puedes añadir una clase de utilidad en tu CSS global para detener las animaciones en usuarios que prefieren "Reducción de Movimiento":

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

3.  **¿Spinning eterno?**: Si usas `animate-spin`, asegúrate de que el icono sea simple. Un SVG complejo girando constantemente es una pesadilla de rendimiento. Mantén los iconos de carga lo más simples posible.
:::

## 11.4 Custom Animations (Animaciones Personalizadas en Tailwind 4)

Si las utilidades `animate-spin` o `bounce` son los "bloques de construcción", las **Animaciones Personalizadas** son la arquitectura completa de tu aplicación. En **Tailwind CSS 4**, hemos dejado atrás la configuración pesada en archivos `tailwind.config.js`. Ahora, todo se maneja de forma nativa en tu CSS mediante la directiva `@theme`.

Este cambio no es solo estético; es una mejora de rendimiento y legibilidad. Defines tus reglas de animación una vez y Tailwind las convierte automáticamente en utilidades listas para usar en tu HTML.

### El Proceso: Del CSS al HTML

Para crear una animación personalizada, necesitas dos partes: el **Keyframe** (el dibujo del movimiento paso a paso) y la **Utility** (la asignación de ese movimiento a un nombre y duración).

#### Paso 1: Definir en tu CSS
Usamos la directiva `@theme` para registrar nuestra animación. Esto es "CSS puro" y es increíblemente rápido.

```css
@import "tailwindcss";

@theme {
  /* 1. Definimos la utilidad de animación (nombre: duracion + easing) */
  --animate-gol-celebracion: gol-entrada 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* 2. Definimos los fotogramas clave (Keyframes) */
  @keyframes gol-entrada {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
}
```

#### Paso 2: Usar en tu HTML
Gracias a Tailwind 4, la clase `animate-gol-celebracion` se genera automáticamente. Ahora puedes invocarla donde quieras.

```html
<div class="animate-gol-celebracion bg-yellow-400 p-6 rounded-2xl text-center shadow-2xl">
  <h1 class="text-4xl font-black text-black">¡GOL!</h1>
  <p>El partido se pone intenso</p>
</div>
```

### Caso de Estudio: "Entrada de Jugador" (Soccer League Elite)

Para que tu aplicación de *Fútbol Llanero* destaque, las tarjetas de los jugadores no deberían aparecer de forma aburrida. Hagamos que "deslicen y aparezcan" con un efecto suave.

#### CSS:
```css
@theme {
  /* Animation shorthand: nombre duración easing */
  --animate-slide-in-right: slide-in 0.5s ease-out forwards;

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
```

#### HTML (Implementación):
```html
<div class="animate-slide-in-right bg-white p-4 shadow-md rounded-lg border-l-4 border-blue-600">
  <h3 class="font-bold">Aldair Cruz Bautista</h3>
  <p class="text-sm">Delantero Centro</p>
</div>
```

::: tip 💡 Consejos del Diseñador Frontend:
1.  **El poder de `forwards`:** Nota que en el ejemplo de `slide-in` usamos la palabra clave `forwards`. Esto le dice al navegador que, una vez terminada la animación, el elemento debe **quedarse en el estado final** (en este caso, visible y en su lugar) en lugar de regresar al estado inicial. Es vital para animaciones de entrada.
2.  **Easing Personalizado (`cubic-bezier`):** No te limites a `ease-in` o `ease-out`. Si buscas efectos muy específicos (como un rebote elástico), usa sitios como [easings.net](https://easings.net) para generar tu propio `cubic-bezier`. Tailwind lo aceptará perfectamente.
3.  **Animaciones Compuestas:** Puedes aplicar múltiples clases de animación. Por ejemplo, `animate-fade-in` junto con `animate-slide-in-right` para un efecto más cinemático. Solo ten cuidado de no sobrecargar el navegador.
4.  **Mantenibilidad:** Si estás documentando esto en tu repositorio de *Apuntes Front End*, recuerda crear un archivo CSS separado (`animations.css`) solo para estas definiciones. Así mantendrás tu `style.css` principal limpio y modular.
:::

### El "Mindset" del Diseñador Frontend
1.  **Regla de oro:** Mantén las microinteracciones rápidas. **200ms a 300ms** es el "punto dulce" para casi cualquier transición de interfaz. Si es más lento, el usuario siente que la app es lenta.
2.  **No animes todo:** Si animes cada botón, la web se vuelve mareante. Reserva las animaciones para cambios de estado importantes (abrir un modal, mostrar un error, procesar un envío).
3.  **Accesibilidad:** Algunas personas tienen sensibilidad al movimiento. Si quieres ser un desarrollador senior, verifica la preferencia de usuario (`prefers-reduced-motion`) y desactiva las animaciones complejas en esos casos.
4.  **Uso de GPU:** Siempre que sea posible, prefiere animar `transform` y `opacity`. Evita animar propiedades como `top`, `left`, o `margin` dentro de animaciones, ya que causan "layout thrashing" y pueden degradar el rendimiento en dispositivos móviles.
