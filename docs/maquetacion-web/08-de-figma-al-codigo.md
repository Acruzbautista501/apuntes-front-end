# Módulo 8: De Figma/XD al Código

Recibir un diseño y convertirlo en HTML/CSS fiel no es un proceso de "copiar valores pixel por pixel" — es un proceso de **interpretación**: extraer un sistema consistente del diseño, y tomar decisiones donde el diseño estático no puede especificar todo (estados hover, comportamiento responsivo entre breakpoints, contenido con longitud variable). Este módulo cubre ese flujo de trabajo.

## 8.1 Inspeccionar el Diseño Antes de Maquetar

* **Modo de inspección de Figma** (ícono de código en el panel derecho) muestra valores exactos de CSS: color, tipografía, espaciado, sombras — sin necesitar adivinar visualmente.
* **Extraer tokens de diseño**: antes de escribir CSS, cataloga colores, tamaños de fuente, y valores de espaciado únicos que aparecen en el diseño completo. Es común encontrar que un diseño usa "24 tonos de gris ligeramente distintos" que en realidad deberían consolidarse en 5-6 valores reales — un maquetador con buen criterio identifica y corrige esas inconsistencias, en lugar de replicarlas literalmente.

## 8.2 Construir el Sistema de Diseño en CSS Primero

```css
:root {
  /* Colores extraídos y consolidados del diseño */
  --color-primario: #0066cc;
  --color-texto: #333333;
  --color-texto-secundario: #666666;
  --color-fondo: #f9f9f9;

  /* Escala tipográfica */
  --texto-sm: 0.875rem;
  --texto-base: 1rem;
  --texto-lg: 1.25rem;
  --texto-xl: 1.75rem;
  --texto-2xl: 2.5rem;

  /* Escala de espaciado */
  --espacio-1: 0.5rem;
  --espacio-2: 1rem;
  --espacio-3: 1.5rem;
  --espacio-4: 2rem;
  --espacio-6: 3rem;
}
```

Definir estas variables **antes** de maquetar cualquier componente específico asegura consistencia en todo el proyecto, y hace que ajustes globales (cambiar el color primario, ajustar la escala tipográfica) se apliquen en un solo lugar.

## 8.3 Qué Hacer Cuando el Diseño No Especifica un Estado

Un diseño estático (Figma) generalmente no incluye estados de `:hover`, `:focus`, o cómo se ve un botón deshabilitado — el maquetador debe **inferir** esos estados de forma consistente con la identidad visual del diseño, no simplemente inventar algo arbitrario.

```css
.btn-primario {
  background-color: var(--color-primario);
  transition: background-color 0.2s ease;
}

.btn-primario:hover {
  background-color: color-mix(in srgb, var(--color-primario) 85%, black); /* Ligeramente más oscuro, consistente con el color base */
}

.btn-primario:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
```

## 8.4 Contenido con Longitud Variable

Los diseños estáticos muestran texto de ejemplo con una longitud específica — el código real debe soportar textos más largos o más cortos sin romper el layout.

```css
.tarjeta__titulo {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Trunca a 2 líneas con puntos suspensivos si el texto es más largo */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

```css
.tarjeta {
  display: flex;
  flex-direction: column;
  min-height: 300px; /* Altura mínima consistente, aunque el contenido varíe */
}
```

## 8.5 Extraer Componentes Repetidos del Diseño

Antes de escribir CSS específico para cada instancia, identifica qué elementos se repiten en el diseño con variaciones menores — esos son candidatos directos a convertirse en clases reutilizables (siguiendo BEM u OOCSS, Módulo 5) en lugar de código duplicado.

```text
Ejemplo de análisis de un diseño de e-commerce:
- "Tarjeta de producto" aparece 12 veces en distintas páginas, con la misma estructura → un solo componente .tarjeta-producto
- "Badge de descuento" aparece dentro de varias tarjetas → un modificador .tarjeta-producto__badge--oferta
- "Botón de agregar al carrito" aparece en 3 contextos distintos → un componente .btn reutilizable (Módulo 5, OOCSS)
```

## 8.6 Exportar Assets Correctamente

* **Íconos**: exportar como SVG siempre que sea posible (escalan sin pérdida de calidad, Módulo 6) en lugar de PNG.
* **Imágenes fotográficas**: exportar en múltiples resoluciones para `srcset` (Módulo 6), no una sola versión de máxima calidad.
* **Nomenclatura de archivos consistente**: `nombre-descriptivo-800w.jpg`, no `Untitled-1-final-v2.jpg` heredado directamente de la herramienta de diseño.

## 8.7 Comunicación con el Equipo de Diseño

Cuando un diseño no es técnicamente viable tal cual (un efecto que no es posible en CSS sin JavaScript adicional, texto que se desborda en ciertos idiomas más largos que el original), la responsabilidad del maquetador es **comunicar la limitación con una alternativa concreta**, no simplemente aproximar el resultado en silencio sin avisar a quien diseñó originalmente.

## 8.8 Tabla de Referencia Rápida

| Necesitas... | Haz... |
| :--- | :--- |
| Valores exactos de CSS de un diseño en Figma | Usar el modo de inspección de Figma |
| Consistencia en colores/tipografía/espaciado | Consolidar en variables CSS antes de maquetar componentes específicos |
| Un estado hover/focus no especificado en el diseño | Inferirlo de forma consistente con la identidad visual existente |
| Que el layout no se rompa con contenido más largo del esperado | Truncamiento de texto, alturas mínimas, pruebas con contenido real variable |

## 8.9 Errores Comunes

- **Copiar valores de espaciado/color literalmente sin consolidar un sistema**: produce CSS con docenas de valores casi idénticos que deberían ser el mismo valor reutilizado.
- **Maquetar solo con el texto de ejemplo exacto del diseño**: el layout se rompe en producción cuando el contenido real es más largo o más corto de lo previsto en el mockup.
- **Aproximar en silencio un diseño técnicamente inviable sin comunicarlo**: el resultado final se desvía del diseño original sin que nadie del equipo de diseño lo sepa ni lo apruebe.
