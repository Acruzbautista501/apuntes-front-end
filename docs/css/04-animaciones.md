
# Módulo 4: Animaciones y Experiencia de Usuario (UX)
El **Módulo 4** es el que separa una web estática de una **experiencia de usuario (UX) profesional**. Las animaciones no son solo "decoración"; sirven para dar *feedback* al usuario (saber si un botón se presionó) y para guiar su atención.

## 4.1 Transiciones: El Movimiento Suave
La transición es la forma más sencilla de animar. Le dice al navegador: "Cuando este valor cambie, no lo hagas de golpe, tómate un tiempo".

### Teoría Explícita
* **`transition-property`**: Qué quieres animar (ej. `background-color`, `transform`). Evita animar `width` o `height` porque consumen mucho procesador; prefiere `transform` y `opacity`.
* **`transition-duration`**: Cuánto tarda (ej. `0.3s`).
* **`transition-timing-function`**: La curva de velocidad. `ease-in-out` es la más natural.

### Código de Aplicación (Botón Interactivo)
```css
.btn-moderno {
  background-color: #3b82f6;
  padding: 12px 24px;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  
  /* Definimos la transición en el estado inicial */
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.btn-moderno:hover {
  background-color: #2563eb;
  transform: translateY(-3px); /* El botón "flota" un poco */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-moderno:active {
  transform: scale(0.95); /* Efecto de "clic" real al presionar */
}
```

## 4.2 Transformaciones 2D y 3D
La propiedad `transform` permite alterar la forma y posición de un elemento sin afectar el flujo de los vecinos (es decir, no mueve las otras cajas).

### Teoría Explícita
* **`translate(x, y)`**: Mueve el elemento.
* **`scale(n)`**: Agranda o achica (1.1 es 10% más grande).
* **`rotate(deg)`**: Gira el elemento.
* **`skew(deg)`**: Inclina o deforma.

### Código de Aplicación (Tarjeta con Efecto Zoom)
```css
.contenedor-foto {
  width: 300px;
  overflow: hidden; /* Corta lo que sobresalga al agrandar */
  border-radius: 15px;
}

.foto {
  width: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.contenedor-foto:hover .foto {
  transform: scale(1.15) rotate(2deg); /* Zoom y leve giro */
}
```

## 4.3 Animaciones con Keyframes
Si una transición es ir del Punto A al Punto B, una animación por `keyframes` es una película completa con muchos pasos intermedios.

### Teoría Explícita
1. **Definición (`@keyframes`)**: Creamos la línea de tiempo con porcentajes (0% al 100%).
2. **Asignación (`animation`)**: Se aplica al elemento indicando nombre, duración e iteraciones.

### Código de Aplicación (Cargador / Spinner)
```css
/* 1. Definimos el movimiento */
@keyframes girar {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 2. Aplicamos al elemento */
.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  
  /* Nombre | Duración | Velocidad | Repetición */
  animation: girar 1s linear infinite;
}
```

## 4.4 Filtros y Modos de Mezcla
Esto permite aplicar efectos de "Photoshop" directamente con código, lo cual es genial para interfaces oscuras o artísticas.

### Teoría Explícita
* **`filter`**: `blur()` (desenfoque), `grayscale()` (gris), `brightness()` (brillo).
* **`backdrop-filter`**: Aplica el efecto al fondo que está *detrás* del elemento. Es la clave para el efecto de **Glassmorphism** (vidrio esmerilado).

### Código de Aplicación (Efecto Cristal)
```css
.modal-glass {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  /* El efecto de desenfoque al fondo */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Soporte para Safari */
  
  padding: 2rem;
  border-radius: 20px;
  color: white;
}
```

## 4.5 Accesibilidad en Animaciones
Es vital respetar a los usuarios que sufren de cinetosis (mareos por movimiento).

### Teoría Explícita
Existe una media query llamada `prefers-reduced-motion`. Si el usuario tiene activada la opción de "reducir movimiento" en su Windows, Mac o Celular, debemos quitar las animaciones pesadas.

### Código de Aplicación
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Resumen del Módulo 4:
1. **Transiciones** para cambios de estado simples (`hover`, `focus`).
2. **Transform** para mover o escalar sin romper el layout.
3. **Keyframes** para bucles infinitos o secuencias complejas.
4. **Glassmorphism** con `backdrop-filter` para diseños modernos.
5. **Menos es más:** Una web con demasiadas animaciones marea y distrae. Úsalas con propósito.

¿Estamos listos para el **Módulo 5** donde veremos **Arquitectura y SASS** para organizar todo este código como un profesional?