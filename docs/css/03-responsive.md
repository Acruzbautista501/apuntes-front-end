
# Módulo 3: Diseño Adaptativo y Fluidez Moderna
El **Módulo 3** es lo que separa a un maquetador novato de un **Arquitecto Frontend**. Ya no se trata de que las cosas "quepan" en la pantalla, sino de que el diseño sea **fluido, inteligente y eficiente**.

## 3.1 El Cambio de Mentalidad: Mobile First
Históricamente, diseñábamos para escritorio y luego "parchábamos" para móvil. Hoy es al revés por una razón técnica: el código de móvil es más simple. Al escalar hacia arriba, solo añades reglas, no las sobrescribes constantemente.

### Teoría Explícita
* **Viewport Meta Tag:** Sin esto en tu HTML (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`), el navegador simulará una pantalla ancha y tu CSS responsivo no servirá de nada.
* **Media Queries de Min-Width:** Al usar `min-width`, le dices al navegador: "Aplica esto de aquí en adelante".

### Código de Aplicación
```css
/* 1. Estilos Base (Para móviles de 320px a 767px) */
.tarjeta-usuario {
  display: block; /* Se apilan verticalmente */
  width: 100%;
  padding: 1rem;
}

/* 2. Breakpoint Tablet (De 768px en adelante) */
@media (min-width: 768px) {
  .tarjeta-usuario {
    display: flex; /* Se ponen en fila */
    gap: 2rem;
    padding: 2.5rem;
  }
}

/* 3. Breakpoint Desktop (De 1024px en adelante) */
@media (min-width: 1024px) {
  .tarjeta-usuario {
    max-width: 900px; /* Limitamos el ancho para que no se estire infinito */
    margin: 0 auto;   /* Centramos el contenedor */
  }
}
```

## 3.2 . Tipografía y Espaciado Fluido (`clamp`)
El error común es cambiar el tamaño de letra con 5 media queries distintas. Con `clamp()`, la letra crece suavemente mientras arrastras el borde de la ventana.

### Teoría Explícita
La función `clamp(MÍNIMO, IDEAL, MÁXIMO)` calcula el valor en tiempo real.
* **Mínimo:** Lo más pequeño que puede ser (ej. en un iPhone SE).
* **Ideal:** Usamos unidades de viewport (`vw`) para que dependa del ancho de pantalla.
* **Máximo:** El límite para que en un monitor 4K no se vea gigante.

### Código de Aplicación
```css
:root {
  /* La fuente nunca será menor a 1.2rem ni mayor a 3rem. 
     En medio, será el 4% del ancho de la pantalla */
  --titulo-dinamico: clamp(1.2rem, 4vw + 1rem, 3rem);
  --espaciado-seccion: clamp(20px, 5dvh, 80px);
}

h1 {
  font-size: var(--titulo-dinamico);
  margin-bottom: var(--espaciado-seccion);
}
```

## 3.3 Variables de Entorno y Temas (Dark Mode)
Las **Custom Properties** son el pilar del diseño moderno porque permiten cambiar la identidad visual del sitio sin tocar 500 líneas de código.

### Teoría Explícita
A diferencia de las variables de SASS, las variables CSS se pueden redefinir dentro de un selector. Esto permite crear "temas" simplemente cambiando los valores en el `:root`.

### Código de Aplicación (Sistema de Temas)
```css
:root {
  --fondo: #ffffff;
  --texto: #1a1a1a;
  --primario: #3b82f6;
}

/* Si el usuario tiene el sistema en modo oscuro, sobreescribimos las variables */
@media (prefers-color-scheme: dark) {
  :root {
    --fondo: #121212;
    --texto: #f5f5f5;
    --primario: #60a5fa;
  }
}

body {
  background-color: var(--fondo);
  color: var(--texto);
  transition: background-color 0.3s ease; /* Transición suave al cambiar de modo */
}
```

## 3.4 Control de Aspecto e Imágenes (`aspect-ratio`)
Antes, para que un video de YouTube no se deformara, usábamos trucos horribles de padding. Ahora tenemos una propiedad nativa.

### Teoría Explícita
* **`aspect-ratio`**: Fija la proporción (ancho / alto).
* **`object-fit: cover`**: Evita que la imagen se "aplane" o "estire", la recorta inteligentemente para llenar el espacio.

### Código de Aplicación
```css
.contenedor-video {
  width: 100%;
  aspect-ratio: 16 / 9; /* Proporcion cinematográfica */
  background: #000;
}

.avatar-usuario {
  width: 80px;
  height: 80px; /* Forzamos un cuadrado */
  object-fit: cover; /* Si la foto es rectangular, no se deforma, se centra y recorta */
  border-radius: 50%;
}
```
## 3.5 El Contenedor Flexible Moderno
En lugar de fijar alturas con `px`, usamos las nuevas unidades de Viewport para que las interfaces ocupen exactamente lo que deben en dispositivos móviles.

### Teoría Explícita
* **`dvh` (Dynamic Viewport Height)**: Es vital en móviles. Cuando la barra de direcciones de Chrome o Safari aparece o desaparece, `dvh` se recalcula. El viejo `100vh` solía dejar los botones de abajo tapados por la barra del navegador.

### Código de Aplicación
```css
.pantalla-inicio {
  /* Ocupa el 100% de la pantalla real disponible */
  height: 100dvh; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, var(--primario), #1d4ed8);
}
```
### Resumen de Oro para el Módulo 3:
1.  **No uses `px` para fuentes ni anchos de contenedor:** Usa `rem`, `%` o `vw`.
2.  **Usa `max-width` en lugar de `width`:** Así permites que la caja se encoja en pantallas pequeñas.
3.  **Aprovecha `gap` en Flex y Grid:** Es mucho más limpio que pelear con `margin-right`.
4.  **Prueba con el inspector:** No asumas que porque se ve bien en tu monitor, se ve bien en un celular.

¿Te gustaría que pasemos al **Módulo 4** para darle vida a todo esto con **Animaciones y Transiciones**?