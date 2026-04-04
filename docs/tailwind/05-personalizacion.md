
# Módulo 5: Personalización y Configuración (Theming)
Llegamos al **Módulo 5**, el punto donde dejas de usar Tailwind "tal cual viene" y lo conviertes en **tu propio framework**. En la versión 4, la personalización ha cambiado radicalmente: ya no editamos archivos `.js` complejos, sino que usamos **Variables CSS nativas** dentro de nuestro archivo de estilos.

Esto es fundamental para que tus proyectos tengan una identidad única y profesional.

## 5.1 La nueva configuración basada en CSS
En versiones anteriores, usábamos un archivo `tailwind.config.js`. En **Tailwind CSS 4**, la configuración ocurre directamente en tu archivo CSS mediante la directiva `@theme`.

### ¿Por qué este cambio?
* **Rendimiento:** El navegador entiende las variables CSS de forma nativa.
* **Simplicidad:** No necesitas aprender una sintaxis de objeto JavaScript complicada.
* **Escalabilidad:** Puedes cambiar un color en un solo lugar y se actualizará en todo el sitio instantáneamente.

## 5.2 Personalización de Colores y Fuentes
Para añadir tus propios estilos, usamos el bloque `@theme`. Aquí puedes **sobrescribir** los valores por defecto o **añadir** nuevos.

### A. Añadiendo Colores de Marca
Imagina que tu proyecto tiene un color corporativo específico (ej. un verde esmeralda `#2ecc71`).

```css
@import "tailwindcss";

@theme {
  /* Añadir un color nuevo */
  --color-brand-primary: #2ecc71;
  --color-brand-dark: #27ae60;

  /* Sobrescribir un color existente de Tailwind */
  --color-blue-500: #0077ff;
}
```

**Uso en el HTML:**
```html
<button class="bg-brand-primary hover:bg-brand-dark text-white p-4">
  Botón Corporativo
</button>
```

### B. Fuentes Personalizadas
Si quieres usar una fuente de Google Fonts (como 'Sora' o 'Inter'), primero la importas y luego la registras en el tema.

```css
@theme {
  --font-sans: "Sora", ui-sans-serif, system-ui;
  --font-display: "Montserrat", sans-serif;
}
```
## 5.3 Espaciado y Dimensiones Personalizadas
Aunque Tailwind tiene una escala excelente, a veces necesitas una medida muy específica para un diseño de maquetación (layout).

```css
@theme {
  /* Añadir una medida de espaciado personalizada */
  --spacing-13: 3.25rem; /* 52px */
  
  /* Definir un ancho máximo de contenedor propio */
  --width-container-pro: 1400px;
}
```

## 5.4 Arbitrary Values (Valores "al vuelo")
¿Qué pasa si solo necesitas un valor específico una sola vez y no quieres configurar todo el tema? Para eso existen los **Arbitrary Values**. Se escriben usando corchetes `[]`.

**Ejemplos comunes:**
* **Ancho exacto:** `w-[357px]`
* **Color exacto:** `bg-[#bada55]`
* **Posición exacta:** `top-[11.5rem]`
* **Grid complejo:** `grid-cols-[200px_1fr_100px]`

> **Regla de oro:** Si usas el mismo valor en corchetes más de 3 veces, es hora de moverlo al `@theme` en tu archivo CSS.

## 5.5 La directiva `@apply`: ¿Cuándo usarla?
La directiva `@apply` te permite "extraer" una lista de clases de Tailwind a una clase CSS tradicional.

**¡Cuidado!** Muchos principiantes abusan de esto y terminan escribiendo CSS tradicional otra vez. Úsalo solo para elementos que se repiten **cientos** de veces (como inputs o botones) si no estás usando un framework de componentes como Vue.

```css
/* En tu archivo CSS */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md;
}
```

## 5.6 Resumen Teórico: ¿Cómo elegir tu estrategia?
Para que tu configuración sea "limpia", sigue este orden de prioridad:

1.  **Usa lo que ya trae Tailwind:** El 90% de las veces, `blue-600` es suficiente.
2.  **Usa `@theme`:** Para colores de marca, fuentes del proyecto y constantes que definen la identidad visual.
3.  **Usa Arbitrary Values `[]`:** Para casos aislados (ej. una imagen de fondo específica o un ancho de sidebar único).

### Checklist de Personalización:
* ¿He definido mis colores principales en `@theme`?
* ¿He configurado mi fuente principal (Sans) para que coincida con el diseño?
* ¿He evitado el uso excesivo de `@apply` para mantener la flexibilidad de Tailwind?

¿Listo para el **Módulo 6**? En el último módulo veremos cómo organizar todo esto en componentes reales y cómo optimizarlo para que tu web vuele.