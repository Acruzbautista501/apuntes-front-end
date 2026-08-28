# Módulo 5: Metodologías CSS — BEM, OOCSS e ITCSS

Sin una convención de nomenclatura, el CSS de un proyecto que crece más allá de un puñado de páginas se vuelve difícil de mantener: nombres de clase ambiguos, especificidad impredecible, y miedo a modificar un estilo por no saber qué más se rompe. Este módulo cubre las tres metodologías más influyentes de la industria — no como reglas rígidas, sino como herramientas de pensamiento que se pueden combinar.

## 5.1 BEM — Block, Element, Modifier

BEM es la metodología de nomenclatura más adoptada en la industria, especialmente fuera del ecosistema de utility-first (Tailwind).

```css
/* Block: un componente independiente */
.tarjeta { }

/* Element: una parte del block, unida con __ */
.tarjeta__titulo { }
.tarjeta__imagen { }
.tarjeta__boton { }

/* Modifier: una variación del block o element, unida con -- */
.tarjeta--destacada { }
.tarjeta__boton--deshabilitado { }
```

```html
<div class="tarjeta tarjeta--destacada">
  <img class="tarjeta__imagen" src="producto.jpg" alt="Producto">
  <h3 class="tarjeta__titulo">Nombre del producto</h3>
  <button class="tarjeta__boton tarjeta__boton--deshabilitado">Agotado</button>
</div>
```

**La regla de oro de BEM**: un `element` nunca se anida dentro de otro `element` en el nombre de la clase (nunca `.tarjeta__titulo__texto`) — todos los elements son "planos" respecto a su block, sin importar cuán anidados estén visualmente en el HTML.

## 5.2 Por Qué BEM Evita el Problema de la Especificidad

```css
/* ❌ Sin BEM: especificidad creciente y frágil según el contexto de anidamiento */
.sidebar .tarjeta .titulo { color: #333; }
.sidebar .tarjeta.destacada .titulo { color: #0066cc; } /* Cada vez más específico para ganar */

/* ✅ Con BEM: especificidad plana, siempre una sola clase */
.tarjeta__titulo { color: #333; }
.tarjeta--destacada .tarjeta__titulo { color: #0066cc; }
```

Con selectores anidados por contexto, cada nueva excepción requiere aumentar la especificidad para "ganarle" a la regla anterior — un problema que escala mal. BEM mantiene virtualmente toda la especificidad en el mismo nivel (una sola clase), haciendo que el orden de las reglas en el archivo sea lo que determina el resultado final, no una guerra de especificidad.

## 5.3 OOCSS — Object-Oriented CSS

OOCSS propone separar **estructura** de **apariencia** (*skin*), permitiendo reutilizar la estructura de un componente con distintas apariencias visuales.

```css
/* Estructura: cómo se comporta el layout del botón, sin definir colores */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
}

/* Apariencia (skin): combinable con la estructura anterior */
.btn-primario {
  background-color: #0066cc;
  color: #ffffff;
}

.btn-secundario {
  background-color: transparent;
  border: 2px solid #0066cc;
  color: #0066cc;
}
```

```html
<button class="btn btn-primario">Comprar</button>
<button class="btn btn-secundario">Cancelar</button>
```

La misma clase estructural `.btn` se combina con distintas clases de apariencia — evita duplicar `padding`, `border-radius` y `font-weight` en cada variante de botón.

## 5.4 ITCSS — Inverted Triangle CSS

ITCSS no es una convención de nombres como BEM, sino una forma de **organizar el orden en que se cargan los archivos CSS**, de lo más genérico y de menor especificidad, a lo más específico y de mayor especificidad — evitando que el orden de importación cause conflictos impredecibles.

```text
styles/
├── 01-settings/       # Variables (colores, espaciados) — sin generar CSS real
│   └── _variables.css
├── 02-tools/            # Mixins, funciones — sin generar CSS real
├── 03-generic/           # Reset/normalize — especificidad mínima
│   └── _reset.css
├── 04-elements/           # Estilos de etiquetas HTML puras (h1, a, p) sin clases
│   └── _elementos.css
├── 05-objects/             # Patrones de layout reutilizables (OOCSS, 5.3)
│   └── _objetos.css
├── 06-components/           # Componentes específicos con nombres BEM (5.1)
│   └── _tarjeta.css
└── 07-utilities/              # Clases de utilidad con !important, máxima especificidad
    └── _utilidades.css
```

Cada capa tiene, en promedio, **mayor especificidad y menor alcance** que la anterior — las capas tempranas (settings, generic) afectan a todo el proyecto de forma amplia; las capas finales (utilities) afectan un solo elemento de forma muy específica.

## 5.5 Combinar las Tres Metodologías en un Proyecto Real

```text
- ITCSS define el ORDEN de los archivos (settings → generic → ... → utilities).
- OOCSS define cómo separar estructura de apariencia dentro de la capa "objects".
- BEM define cómo NOMBRAR las clases dentro de la capa "components".
```

No son mutuamente excluyentes — en la práctica, muchos proyectos profesionales usan las tres combinadas: la organización de archivos de ITCSS, el principio de reutilización de OOCSS, y la convención de nombres de BEM.

## 5.6 Metodologías vs Utility-First (Tailwind)

Este sitio ya cubre Tailwind CSS 4 en profundidad — vale la pena situarlo en este contexto: Tailwind representa un enfoque distinto (*utility-first*), donde las clases describen una sola propiedad CSS (`p-4`, `text-center`) en lugar de un componente completo con nombre semántico como BEM. Ambos enfoques resuelven el problema de mantenibilidad de formas distintas — la elección depende del proyecto, el equipo y sus preferencias, no de que uno sea universalmente superior al otro.

## 5.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Nombres de clase predecibles y sin conflictos de especificidad | BEM (Block\_\_Element--Modifier) |
| Reutilizar estructura de layout con distintas apariencias | OOCSS (separar estructura de skin) |
| Un orden de carga de CSS que evite conflictos de especificidad impredecibles | ITCSS (organización en capas) |

## 5.8 Errores Comunes

- **Anidar elements de BEM dentro de otros elements** (`.bloque__elemento__subelemento`): rompe la convención — todos los elements deben ser planos respecto a su block, sin importar la anidación visual del HTML.
- **Mezclar convenciones sin un criterio claro en el mismo proyecto**: algunas clases en BEM, otras con nombres arbitrarios — dificulta que cualquier persona nueva en el equipo entienda el sistema.
- **Adoptar una metodología "porque es lo profesional" sin que el equipo la entienda o la necesite**: para un sitio pequeño con pocos componentes, la sobrecarga de una convención elaborada puede no justificarse.
