
# Módulo 1: Fundamentos de Tailwind CSS 4

## 1.1 ¿Qué es Tailwind CSS 4? La mentalidad "Utility-First"
A diferencia de los frameworks tradicionales como Bootstrap (que te dan componentes prefabricados como `.btn` o `.card`), Tailwind es un framework de **clases de utilidad**.

### El problema del CSS Tradicional
En el CSS estándar, sueles escribir nombres de clases arbitrarios y saltar de tu HTML a un archivo CSS constantemente:
```html
<div class="mi-contenedor-especial">Hola</div>

<style>
.mi-contenedor-especial {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
```

### La Solución: Utility-First
En Tailwind, aplicas clases pequeñas y de propósito único directamente en el HTML. 
* **Ventaja:** No inventas nombres de clases.
* **Ventaja:** Tu archivo CSS no crece infinitamente; el tamaño se mantiene constante.
* **Ventaja:** Sabes exactamente qué hace cada elemento solo con leer el HTML.

## 1.2 El Motor de Diseño "Radiant" (Novedad de la V4)
Tailwind 4 ha sido reescrito desde cero para ser increíblemente rápido. La principal diferencia con la versión 3 es que **ya no necesitas un archivo de configuración JavaScript (`tailwind.config.js`) obligatorio**.

Ahora, Tailwind se configura directamente en tu archivo **CSS principal** usando variables CSS nativas. Es más ligero, más moderno y detecta automáticamente tus archivos sin que tengas que decirle dónde están.

## 1.3 Instalación y Configuración (Vite + V4)
Para un desarrollador frontend moderno, la forma más eficiente de usar Tailwind 4 es mediante **Vite**.

### Paso 1: Instalar los paquetes
```bash
npm install tailwindcss @tailwindcss/vite
```

### Paso 2: Configurar Vite
Debes decirle a Vite que use el plugin de Tailwind en tu archivo `vite.config.ts` o `vite.config.js`:

```typescript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

### Paso 3: El punto de entrada CSS
En la versión 4, solo necesitas una línea en tu archivo CSS (por ejemplo, `src/style.css`):

```css
@import "tailwindcss";
```
Con esto, Tailwind importa automáticamente todos sus estilos base, componentes y utilidades.

## 1.4 La Directiva `@import "tailwindcss"` y el Preprocesado
Antiguamente usábamos directivas como `@tailwind base;`. En la V4, `@import "tailwindcss";` hace todo el trabajo pesado.

* **Detección Automática:** Tailwind 4 escanea automáticamente tus archivos `.html`, `.vue`, `.ts`, `.jsx` para encontrar qué clases estás usando y generar solo el CSS necesario.
* **Cero Configuración:** Si quieres usar los valores por defecto (colores, espaciados, etc.), no tienes que configurar nada más.

## 1.5 Teoría en Práctica: Tu primer componente
Vamos a construir una tarjeta (card) explicando qué hace cada clase. Este código es totalmente compatible con la sintaxis de Vue 3 o HTML plano.

### Código de ejemplo:
```html
<div class="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
  <div class="p-6">
    <h2 class="text-xl font-bold text-gray-900">Aprendiendo Tailwind 4</h2>
    <p class="mt-2 text-gray-600">
      Este es mi primer componente usando la arquitectura de utilidades. 
      Es limpio, rápido y escalable.
    </p>
    <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      ¡Empezar ahora!
    </button>
  </div>
</div>
```

### Explicación detallada de las utilidades:
| Clase | Función Teórica |
| :--- | :--- |
| `max-w-sm` | Define un ancho máximo pequeño (aprox. 384px) para que no ocupe toda la pantalla. |
| `mx-auto` | Centra el elemento horizontalmente (`margin-left: auto; margin-right: auto`). |
| `bg-white` | Aplica un fondo blanco sólido. |
| `rounded-xl` | Aplica un radio de borde pronunciado (esquinas redondeadas). |
| `shadow-lg` | Aplica una sombra suave que da sensación de profundidad (elevación). |
| `p-6` | Añade un relleno (padding) interno uniforme en los 4 lados. |
| `text-xl` | Aumenta el tamaño de la fuente (`extra large`). |
| `font-bold` | Aplica un grosor de fuente negrita. |
| `hover:bg-blue-700` | **Estado interactivo:** Cambia el color de fondo solo cuando el ratón pasa por encima. |
| `transition-colors` | Suaviza el cambio de color al hacer hover (animación fluida). |

## 1.6 ¿Cómo "pensar" en utilidades?
Para dominar el Módulo 1, debes dejar de pensar en:
> *"Quiero que este botón sea azul y redondeado"* (y crear una clase `.btn-azul`).

Y empezar a pensar en:
> *"Quiero que este elemento tenga un **fondo azul**, **texto blanco**, **padding horizontal**, **padding vertical** y **bordes redondeados**"*.

### Regla de Oro:
**No crees clases CSS a menos que sea estrictamente necesario.** Usa las utilidades de Tailwind directamente. Si repites mucho un patrón (como un botón), en frameworks modernos como Vue, lo que haces es crear un **Componente Reutilizable**, no una clase CSS global.


> **Nota:** En Tailwind 4, la velocidad de compilación es casi instantánea gracias al nuevo motor. Esto te permite ver los cambios en el navegador en milisegundos mientras guardas tu código.