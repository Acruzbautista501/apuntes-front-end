# Módulo 3: El Modelo de Caja Aplicado a Layouts Reales

CSS3 ya cubre el modelo de caja como concepto (`margin`, `border`, `padding`, `content`). Este módulo va un paso más allá: cómo ese modelo afecta decisiones reales de maquetación, y los patrones que un maquetador aplica constantemente para evitar los bugs de layout más comunes.

## 3.1 `box-sizing: border-box` como Base de Todo Proyecto

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Esta es, probablemente, la regla CSS más universal en cualquier proyecto profesional. Sin ella, `width: 300px` con `padding: 20px` produce un elemento de **340px** de ancho real (300 + 20 + 20) — con `border-box`, el `padding` y el `border` se descuentan del `width` declarado, así que un elemento de `width: 300px` mide exactamente 300px sin importar su padding o borde.

## 3.2 Colapso de Márgenes Verticales — El Bug que Confunde a Todos

```css
.parrafo-uno { margin-bottom: 30px; }
.parrafo-dos { margin-top: 20px; }
```

```html
<p class="parrafo-uno">Primer párrafo</p>
<p class="parrafo-dos">Segundo párrafo</p>
```

El espacio real entre ambos párrafos **no es 50px** (30+20) — es **30px**, el mayor de los dos valores. Los márgenes verticales adyacentes de elementos en flujo normal **colapsan**, tomando el valor más grande en lugar de sumarse.

```css
/* El colapso NO ocurre si hay padding, border, o un contexto de formato independiente entre ambos */
.contenedor {
  display: flow-root; /* Crea un nuevo contexto de formato, evita el colapso hacia elementos externos */
}
```

## 3.3 Márgenes Horizontales — Nunca Colapsan

A diferencia de los márgenes verticales, los márgenes horizontales **siempre se suman**, sin ninguna excepción — una fuente común de confusión para quien recién está aprendiendo el modelo de caja, al asumir que ambos ejes se comportan igual.

## 3.4 Centrar un Elemento Horizontalmente — Todas las Técnicas

```css
/* Técnica clásica: bloque de ancho fijo, márgenes automáticos */
.centrado-clasico {
  width: 600px;
  margin: 0 auto;
}

/* Con Flexbox: centra en ambos ejes fácilmente */
.contenedor-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Con Grid: la técnica más concisa para centrado en ambos ejes */
.contenedor-grid {
  display: grid;
  place-items: center;
}
```

## 3.5 El Problema de los Márgenes Negativos y `overflow`

```css
.tarjeta-superpuesta {
  margin-top: -40px; /* Superpone la tarjeta sobre el elemento anterior */
}

.contenedor-padre {
  overflow: hidden; /* ⚠️ Puede recortar visualmente elementos con margen negativo o posicionamiento absoluto */
}
```

`overflow: hidden` en un contenedor padre corta cualquier contenido de un hijo que se extienda más allá de sus límites — un bug de layout muy común es agregar `overflow: hidden` para resolver un problema no relacionado (como el colapso de márgenes, 3.6) y sin querer recortar un elemento superpuesto intencional.

## 3.6 `overflow: hidden`/`flow-root` para Contener Flotantes

Aunque `float` es poco usado como técnica de layout moderna (Flexbox/Grid lo reemplazan en la mayoría de casos), sigue apareciendo para envolver texto alrededor de una imagen — y produce un bug clásico: el contenedor padre "colapsa" a altura cero si todos sus hijos están flotados.

```css
.contenedor-con-flotantes {
  display: flow-root; /* Solución moderna: el contenedor se expande para contener sus hijos flotados */
}
```

`display: flow-root` es la solución moderna recomendada, reemplazando el viejo truco de `.clearfix::after { content: ""; display: table; clear: both; }`.

## 3.7 Unidades: Cuándo Usar Cada Una

| Unidad | Cuándo usarla |
| :--- | :--- |
| `px` | Bordes finos, sombras — valores que no deben escalar con la tipografía del usuario |
| `rem` | Tamaños de fuente, espaciados — escala junto con la preferencia de tamaño de fuente del navegador del usuario |
| `em` | Espaciados relativos al tamaño de fuente del elemento actual específico (no siempre el más predecible) |
| `%` | Anchos relativos al contenedor padre |
| `vw`/`vh` | Dimensiones relativas al viewport (con cuidado — pueden causar overflow inesperado) |
| `ch` | Ancho de texto legible (`max-width: 65ch` es un patrón común para párrafos) |

## 3.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Que `padding`/`border` no alteren el ancho declarado | `box-sizing: border-box` globalmente |
| Evitar sorpresas con espacio vertical entre elementos | Entender el colapso de márgenes (3.2) antes de "corregirlo" con hacks |
| Centrar un bloque horizontalmente | `margin: 0 auto` (ancho fijo) o Flexbox/Grid |
| Contener elementos flotados sin colapsar el contenedor | `display: flow-root` |
| Tamaños de fuente accesibles que respeten la configuración del usuario | `rem` en lugar de `px` |

## 3.9 Errores Comunes

- **No aplicar `box-sizing: border-box` desde el inicio del proyecto**: causa cálculos de ancho impredecibles en cualquier elemento con padding o borde.
- **"Arreglar" el colapso de márgenes agregando `overflow: hidden` sin entender la causa real**: puede recortar accidentalmente contenido superpuesto intencional en otra parte del layout.
- **Usar `px` para todos los tamaños de fuente**: ignora la preferencia de tamaño de fuente del usuario configurada a nivel de sistema/navegador, un problema real de accesibilidad.
