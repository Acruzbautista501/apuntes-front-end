
# Módulo 2: Layout y Posicionamiento

Este módulo se centra en cómo las cajas (definidas en el Módulo 1) se organizan y se relacionan entre sí en el espacio de la pantalla.

Para que este **Módulo 2** sea tu guía definitiva, vamos a desglosar la "columna vertebral" de CSS combinando la lógica técnica con ejemplos de código listos para producción. Entender esto es la diferencia entre pelearte con los elementos y dominarlos.

## 2.1 El Sistema de Visualización (`display`)
Es la primera propiedad que el navegador consulta para saber cómo dibujar una caja. Define la "personalidad" de la etiqueta.

### Teoría Explícita
* **`block`**: Ocupa todo el ancho. Si pones dos `div`, el segundo siempre aparecerá abajo.
* **`inline`**: Solo ocupa su contenido. No puedes darle ancho (`width`) ni alto (`height`).
* **`inline-block`**: Permite que los elementos se sienten uno al lado del otro (como el texto), pero respetando dimensiones de caja.

### Código de Aplicación
```css
/* Creamos una hilera de botones que respetan tamaño */
.boton-navegacion {
  display: inline-block; 
  width: 120px;
  height: 40px;
  margin: 5px;
  background-color: #4f46e5;
  color: white;
  text-align: center;
  line-height: 40px; /* Centra el texto verticalmente */
  text-decoration: none;
  border-radius: 8px;
}
```

## 2.2 Posicionamiento Estratégico (`position`)
Determina si un elemento se queda en su sitio o si "vuela" a coordenadas específicas (`top`, `bottom`, `left`, `right`).

### Teoría Explícita
* **`relative`**: Mueve el elemento sin que los vecinos se den cuenta (su espacio original queda reservado). Su uso real es ser el "padre" de un elemento absoluto.
* **`absolute`**: El elemento se sale del flujo y busca al ancestro `relative` más cercano para posicionarse.
* **`fixed`**: Se pega a la pantalla del navegador (viewport).
* **`sticky`**: Se queda pegado solo cuando llega a un borde al hacer scroll.

### Código de Aplicación (El Badge de Notificación)
```css
.contenedor-icono {
  position: relative; /* El ancla */
  display: inline-block;
}

.badge {
  position: absolute; /* El satélite */
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}
```

## 2.3 Flexbox: Alineación Unidimensional
Flexbox es perfecto para componentes pequeños o alineaciones en una sola dirección (fila o columna).

### Teoría Explícita
Todo ocurre mediante la relación **Contenedor (Padre)** y **Items (Hijos)**.
* **`justify-content`**: Controla el eje horizontal (por defecto).
* **`align-items`**: Controla el eje vertical (por defecto).
* **`gap`**: Define la separación entre hijos sin usar márgenes.

### Código de Aplicación (Navbar Profesional)
```css
.header-principal {
  display: flex;
  justify-content: space-between; /* Logo a la izquierda, menú a la derecha */
  align-items: center;            /* Todo centrado verticalmente */
  padding: 1rem 2rem;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.menu-links {
  display: flex;
  gap: 20px; /* Espaciado uniforme */
  list-style: none;
}
```

## 2.4 CSS Grid: El Maestro de las Rejillas
Grid permite diseñar en dos dimensiones al mismo tiempo. Es la herramienta para la estructura global del sitio.

### Teoría Explícita
Se basa en definir una "malla" invisible. Usamos la unidad `fr` (fracción) para repartir el espacio de forma inteligente.

### Código de Aplicación (Dashboard de 3 Columnas)
```css
.dashboard-layout {
  display: grid;
  /* Columna 1: 250px fija | Columna 2: Flexible | Columna 3: 300px fija */
  grid-template-columns: 250px 1fr 300px;
  /* Fila 1: Altura del contenido | Fila 2: El resto del alto de pantalla */
  grid-template-rows: auto 1fr;
  gap: 15px;
  height: 100vh;
}

.sidebar {
  grid-row: 1 / 3; /* Ocupa desde la fila 1 hasta la 3 */
  background: #f3f4f6;
}
```

## 2.5 Z-Index y Profundidad (Eje Z)
Controla qué elemento se dibuja encima de otro.

### Teoría Explícita
Solo funciona en elementos que tengan un `position` definido (que no sea `static`). Se rige por el **Stacking Context** (Contexto de Apilamiento): las capas se calculan primero dentro de su contenedor padre.

### Código de Aplicación
```css
.modal-overlay {
  position: fixed;
  z-index: 9999; /* Valor alto para asegurar que tape todo */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
}

.contenido-pagina {
  position: relative;
  z-index: 1; /* Valor bajo */
}
```

### Resumen de Decisión Crítica
| Si quieres... | Usa... |
| :--- | :--- |
| Centrar un elemento al medio de todo | **Flexbox** (`justify` + `align` center) |
| Una rejilla de fotos (tipo Instagram) | **CSS Grid** (`repeat(auto-fill, ... )`) |
| Un botón que flote en la esquina | **Position: fixed** |
| Que el header no se mueva al bajar | **Position: sticky** |

¿Qué te parece si aplicamos todo esto en un pequeño proyecto para crear una **tarjeta de producto avanzada**?