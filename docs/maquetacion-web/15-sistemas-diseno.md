# Módulo 15: Sistemas de Diseño y Librerías de Componentes

Un sistema de diseño formaliza lo que el Módulo 8 (De Figma al Código) hace de forma manual proyecto por proyecto: un conjunto documentado y reutilizable de tokens visuales y componentes que garantiza consistencia a través de múltiples proyectos y equipos, no solo dentro de uno.

## 15.1 Design Tokens — La Base de Todo Sistema

Los *design tokens* son los valores atómicos de un sistema de diseño (colores, tipografía, espaciado, sombras) definidos una sola vez y consumidos en cualquier plataforma o tecnología.

```json
{
  "color": {
    "primario": { "value": "#0066cc" },
    "texto": {
      "principal": { "value": "#1a1a1a" },
      "secundario": { "value": "#666666" }
    }
  },
  "espaciado": {
    "sm": { "value": "8px" },
    "md": { "value": "16px" },
    "lg": { "value": "24px" }
  }
}
```

```css
/* Los mismos tokens, consumidos como variables CSS */
:root {
  --color-primario: #0066cc;
  --color-texto-principal: #1a1a1a;
  --espaciado-md: 16px;
}
```

Herramientas como **Style Dictionary** transforman una única fuente de tokens (JSON) en múltiples formatos de salida (CSS, Sass, JS, incluso valores para iOS/Android) — un cambio en el token fuente se propaga automáticamente a todas las plataformas que lo consumen.

## 15.2 Storybook — Documentar Componentes de Forma Aislada

Storybook renderiza cada componente de forma aislada, con controles interactivos para probar distintas props/variantes, sin necesitar navegar la aplicación completa para llegar a ese componente específico.

```bash
npx storybook init
```

```javascript
// Boton.stories.js
export default {
  title: 'Componentes/Boton',
  component: Boton
}

export const Primario = {
  args: { variante: 'primario', texto: 'Comprar ahora' }
}

export const Deshabilitado = {
  args: { variante: 'primario', texto: 'Agotado', disabled: true }
}
```

Cada "story" documenta una variante específica del componente, sirviendo simultáneamente como documentación viva y como entorno de desarrollo aislado — cambios al componente se ven reflejados instantáneamente en cada variante documentada.

## 15.3 Estructura de un Sistema de Diseño Completo

```text
sistema-diseno/
├── tokens/
│   ├── color.json
│   ├── tipografia.json
│   └── espaciado.json
├── componentes/
│   ├── Boton/
│   │   ├── Boton.css
│   │   ├── Boton.stories.js
│   │   └── README.md
│   └── Tarjeta/
│       ├── Tarjeta.css
│       ├── Tarjeta.stories.js
│       └── README.md
└── documentacion/
    └── principios-de-diseno.md
```

## 15.4 Documentar Más Allá del Código

Un buen sistema de diseño documenta no solo **cómo** usar un componente, sino **cuándo** — reglas de uso, ejemplos de mal uso, y el razonamiento detrás de decisiones visuales.

```markdown
## Botón Primario

Usa el botón primario para la acción principal de una pantalla — máximo uno por vista.

✅ Usar para: "Comprar ahora", "Crear cuenta"
❌ No usar para: acciones secundarias como "Cancelar" (usa el botón secundario)
```

## 15.5 Versionado de un Sistema de Diseño

Cuando un sistema de diseño se consume como un paquete instalable (`npm install @miempresa/sistema-diseno`) en múltiples proyectos, el versionado semántico (`MAJOR.MINOR.PATCH`) comunica el impacto de cada cambio.

```text
1.2.3 → 1.2.4: corrección de bug menor, sin cambios visuales significativos
1.2.3 → 1.3.0: nuevo componente agregado, retrocompatible
1.2.3 → 2.0.0: cambio que rompe compatibilidad (renombrar una clase existente, cambiar la API de un componente)
```

## 15.6 Cuándo Justifica Invertir en un Sistema de Diseño Formal

| Escenario | Recomendación |
| :--- | :--- |
| Un solo proyecto pequeño, un solo maquetador | Variables CSS organizadas (Módulo 8) son suficientes |
| Múltiples productos que comparten identidad visual | Un sistema de diseño formal, posiblemente con Storybook |
| Un equipo grande con maquetadores/desarrolladores rotando entre proyectos | Justifica fuertemente la inversión en documentación formal |
| Un producto que evoluciona rápido con necesidades cambiantes | Puede ser prematuro formalizar demasiado pronto — el sistema debe estabilizarse orgánicamente primero |

## 15.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Una única fuente de verdad para colores/tipografía/espaciado | Design tokens (JSON) + una herramienta de transformación (Style Dictionary) |
| Documentar y probar componentes de forma aislada | Storybook |
| Comunicar el impacto de cambios en un sistema compartido | Versionado semántico |
| Decidir si formalizar un sistema de diseño | Evaluar cuántos proyectos/equipos realmente lo comparten |

## 15.8 Errores Comunes

- **Construir un sistema de diseño elaborado para un solo proyecto pequeño**: la sobrecarga de mantenimiento no se justifica sin múltiples consumidores reales del sistema.
- **Documentar solo el "cómo" sin el "cuándo"**: un componente sin reglas de uso claras termina usándose de formas inconsistentes o incorrectas en distintas partes del producto.
- **No versionar los cambios que rompen compatibilidad**: actualizar silenciosamente un componente compartido puede romper visualmente proyectos que lo consumen sin ningún aviso previo.
