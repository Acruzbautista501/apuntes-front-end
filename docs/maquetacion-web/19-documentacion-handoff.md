# Módulo 19: Documentación y Handoff a Desarrollo

Un maquetador raramente es el único que toca el código a lo largo de la vida de un proyecto — desarrolladores que agregan funcionalidad, otros maquetadores que dan mantenimiento, o incluso el propio maquetador seis meses después necesitan entender decisiones que en el momento parecían obvias. Este módulo cubre cómo documentar y entregar código de maquetación de forma profesional.

## 19.1 Comentarios en CSS — Cuándo Sí y Cuándo No

```css
/* ❌ No aporta nada que el código no diga ya por sí mismo */
/* Esto es el color de fondo */
.tarjeta {
  background-color: #f9f9f9;
}

/* ✅ Explica el POR QUÉ, algo no obvio solo con leer el código */
.tarjeta {
  /* z-index elevado para superponerse al banner sticky del header (ver #142) */
  z-index: 50;
}

/* ✅ Documenta una decisión de compatibilidad no evidente */
.contenedor {
  display: -webkit-box; /* Necesario para line-clamp en Safari, ver Módulo 8 */
  -webkit-line-clamp: 2;
}
```

La misma regla que aplica a comentarios de código en cualquier lenguaje: documenta el **por qué**, no el **qué** — el código ya comunica el qué por sí mismo si está bien escrito.

## 19.2 README de Proyecto

```markdown
# Proyecto: Sitio Corporativo

## Stack
- HTML5 + Sass + Vite
- Metodología BEM para nomenclatura de clases

## Estructura
- `src/styles/` — Sass organizado según ITCSS (ver Módulo 5)
- `src/components/` — Componentes HTML reutilizables

## Comandos
- `npm run dev` — Servidor de desarrollo
- `npm run build` — Build de producción

## Convenciones
- Mobile-first: todos los estilos base son para móvil, ampliados con `min-width`
- Colores/espaciados: siempre usar las variables de `src/styles/settings/_variables.scss`, nunca valores arbitrarios
```

Un README completo es lo primero que cualquier persona nueva en el proyecto lee — debe responder "¿cómo levanto este proyecto?" y "¿qué convenciones debo seguir?" sin necesitar preguntar directamente a quien lo construyó originalmente.

## 19.3 Documentar Componentes Individuales

```markdown
## Componente: Tarjeta de Producto

### Uso
\`\`\`html
<div class="tarjeta-producto">
  <img class="tarjeta-producto__imagen" src="..." alt="...">
  <h3 class="tarjeta-producto__titulo">Nombre</h3>
  <span class="tarjeta-producto__precio">$99.00</span>
</div>
\`\`\`

### Modificadores
- `.tarjeta-producto--oferta` — Muestra el badge de descuento
- `.tarjeta-producto--agotado` — Reduce opacidad y deshabilita interacción

### Notas
- El título se trunca a 2 líneas (ver Módulo 8, `texto-truncado` mixin)
- Requiere una imagen mínima de 400x400px para verse correctamente
```

## 19.4 Guía de Estilo Viva vs Documento Estático

Un documento de Word o PDF con capturas de pantalla del sistema de diseño se desactualiza rápidamente en cuanto el CSS real cambia. Una guía de estilo "viva" (generada directamente del código real, como Storybook — Módulo 15) nunca puede desincronizarse del código, porque literalmente **es** el código en ejecución.

## 19.5 Anotar Decisiones Responsivas No Evidentes

```markdown
## Breakpoints del proyecto

- `480px` — Punto de apilamiento de columnas en tarjetas
- `768px` — Cambio de menú hamburguesa a navegación horizontal
- `1200px` — Ancho máximo del contenedor principal

Estos valores están definidos en `src/styles/settings/_breakpoints.scss`
y NO deben modificarse sin actualizar también el sistema de diseño en Figma.
```

Documentar explícitamente por qué se eligió cada breakpoint (no solo cuáles son) evita que alguien los cambie arbitrariamente sin entender el impacto en el resto del sistema.

## 19.6 Handoff a un Equipo de Desarrollo (Vue/React)

Cuando la maquetación estática se entrega a un equipo que la convertirá en componentes de un framework (retomando las secciones de Vue.js/React de este sitio), la documentación debe anticipar esa transición:

* **Identificar claramente los "estados"** que el HTML estático no puede mostrar por sí solo (hover, focus, loading, error) para que el desarrollador sepa exactamente qué implementar.
* **Documentar el comportamiento esperado de interacciones** (qué pasa al hacer clic, qué se anima, qué valida) que el HTML/CSS estático solo puede aproximar visualmente.
* **Entregar los assets organizados y optimizados** (Módulo 6), no solo "tal cual salieron de Figma".

## 19.7 Registro de Decisiones Técnicas (ADR)

Para decisiones de arquitectura significativas (elegir Sass sobre CSS puro, adoptar BEM sobre utility-first), un *Architecture Decision Record* breve documenta el contexto y razonamiento, útil cuando alguien se pregunta meses después "¿por qué se hizo así?".

```markdown
# ADR-003: Adopción de metodología BEM

## Contexto
El proyecto creció a más de 40 componentes; el CSS sin convención de nombres
generaba conflictos de especificidad frecuentes.

## Decisión
Adoptar BEM para todo el CSS nuevo, sin refactorizar retroactivamente
el código existente salvo que se toque por otra razón.

## Consecuencias
- Nombres de clase más largos pero predecibles
- Curva de aprendizaje breve para nuevos miembros del equipo
```

## 19.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Documentar el propósito de un proyecto completo | Un README con stack, estructura y convenciones |
| Documentar cómo usar un componente específico | Documentación junto al componente (Markdown o Storybook) |
| Que la documentación nunca se desactualice del código real | Una guía de estilo viva (Storybook) en lugar de un documento estático |
| Explicar por qué se tomó una decisión técnica significativa | Un ADR breve |
| Preparar la maquetación para convertirse en componentes de framework | Documentar estados, interacciones y assets organizados explícitamente |

## 19.9 Errores Comunes

- **Documentar el "qué" en lugar del "por qué" en los comentarios de código**: si el código ya es legible, repetir lo que hace en un comentario no aporta valor real.
- **Dejar la documentación como una tarea "para después" que nunca se completa**: se vuelve exponencialmente más difícil de escribir con precisión cuanto más tiempo pasa desde que se tomaron las decisiones originales.
- **Entregar assets sin optimizar "tal cual" al equipo de desarrollo**: traslada un trabajo de optimización (Módulo 6) que es responsabilidad natural de la maquetación hacia otro equipo que no tiene el contexto completo del diseño original.
