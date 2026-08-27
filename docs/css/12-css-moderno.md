# Módulo 12: CSS Moderno — Nesting, `@layer` y `@supports`

Este módulo cubre tres adiciones al lenguaje CSS mismo (no propiedades visuales, sino **sintaxis y arquitectura**) que cambian cómo se organiza y se escribe una hoja de estilos grande. Antes, resolver estos problemas requería un preprocesador como SASS; hoy son CSS nativo.

## 12.1 CSS Nesting Nativo

Puedes anidar selectores dentro de otros directamente en CSS estándar, sin SASS ni ninguna herramienta de build.

```css
.tarjeta {
  padding: 1.5rem;
  border-radius: 12px;
  background: white;

  /* El "&" representa al selector padre (.tarjeta) */
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  & .titulo {
    font-size: 1.25rem;
    font-weight: bold;
  }

  & .boton {
    margin-top: 1rem;

    &:disabled {
      opacity: 0.5;
    }
  }
}
```

Se compila (conceptualmente) a exactamente lo mismo que escribirías por separado: `.tarjeta:hover { ... }`, `.tarjeta .titulo { ... }`, `.tarjeta .boton:disabled { ... }`.

> **Diferencia con SASS:** en el nesting nativo de CSS, el `&` es **obligatorio** para combinar directamente con el padre (como en `&:hover`). Si omites el `&` y solo escribes un selector de descendiente (como `.titulo` dentro de `.tarjeta`), no hace falta el `&` porque el espacio ya implica "descendiente". El nesting nativo también respeta reglas de anidamiento válidas (no puedes anidar cualquier cosa en cualquier lugar), a diferencia de SASS que es más permisivo por ser un preprocesador.

## 12.2 `@layer`: Capas de Cascada

Cuando combinas CSS de distintas fuentes (tus estilos base, un framework de componentes, utilidades sueltas), el **orden de carga** determina silenciosamente qué gana en caso de empate de especificidad. Esto genera bugs difíciles de rastrear. `@layer` resuelve esto dándole **prioridad explícita** a cada grupo, sin importar el orden en que se escribió el archivo.

```css
/* Declaras el orden de prioridad UNA VEZ, al inicio del archivo */
@layer reset, base, componentes, utilidades;

@layer reset {
  * { margin: 0; padding: 0; box-sizing: border-box; }
}

@layer base {
  body { font-family: system-ui; line-height: 1.5; }
  h1 { font-size: 2rem; }
}

@layer componentes {
  .boton { padding: 0.5rem 1rem; border-radius: 8px; background: gray; }
}

@layer utilidades {
  .bg-azul { background: blue; } /* SIEMPRE gana sobre .boton, aunque tenga la misma especificidad */
}
```

**La regla clave:** una capa declarada más tarde en la lista de prioridad **siempre** gana sobre una declarada antes, **sin importar la especificidad** de los selectores dentro de cada capa. Esto significa que un simple `.bg-azul` en la capa `utilidades` puede vencer a un selector complejísimo `#header .nav ul li a` si ese selector vive en la capa `base`.

> **Por qué esto es revolucionario:** antes de `@layer`, "ganarle" a los estilos de un framework externo (como Bootstrap) a veces requería `!important` o inflar artificialmente la especificidad de tus selectores. Con capas, simplemente pones el CSS del framework en una capa temprana y el tuyo en una posterior, y listo — sin trucos.

## 12.3 `@supports`: CSS a Prueba de Futuro

`@supports` (también llamado *feature query*) te permite aplicar CSS **solo si el navegador soporta** una propiedad determinada. Es el equivalente en CSS de "revisar si algo existe" antes de usarlo.

```css
/* Estilo de respaldo para TODOS los navegadores */
.galeria {
  display: block;
}

/* Se sobrescribe SOLO si el navegador soporta CSS Grid con subgrid */
@supports (grid-template-columns: subgrid) {
  .galeria {
    display: grid;
    grid-template-columns: subgrid;
  }
}

/* También puedes combinar condiciones */
@supports (backdrop-filter: blur(10px)) and (display: grid) {
  .panel-cristal {
    backdrop-filter: blur(10px);
  }
}

/* O negar una condición */
@supports not (aspect-ratio: 1) {
  .avatar {
    padding-bottom: 100%; /* Truco antiguo, solo para navegadores sin aspect-ratio */
  }
}
```

Esto permite adoptar características nuevas de CSS **el mismo día que salen**, sin miedo a romper el sitio en navegadores más viejos: defines primero un estilo base funcional, y luego mejoras progresivamente la experiencia solo donde el navegador lo permite (*progressive enhancement*).

## 12.4 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Anidar selectores sin instalar SASS | Nesting nativo con `&` |
| Que tus estilos ganen siempre sobre un framework externo, sin `!important` | `@layer`, poniendo tu capa al final |
| Organizar reset/base/componentes/utilidades con prioridad clara | `@layer nombre1, nombre2, ...;` |
| Usar una propiedad nueva sin romper navegadores viejos | `@supports (propiedad: valor) { ... }` |

> **Nota práctica:** Puedes combinar los tres. Es común envolver capas completas (`@layer componentes { ... }`) con nesting nativo adentro, y usar `@supports` para activar una capa de "mejoras modernas" solo en navegadores compatibles.
