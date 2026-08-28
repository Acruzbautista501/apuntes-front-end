# Módulo 1: Introducción a la Maquetación Web Profesional

Este sitio ya cubre CSS3, Tailwind y Bootstrap en profundidad — la sintaxis para escribir estilos. Lo que falta es el **oficio** alrededor de esa sintaxis: cómo se estructura un proyecto real, qué hace un maquetador antes de escribir la primera línea de CSS, y qué prácticas separan un sitio que "se ve bien en mi navegador" de uno production-ready. Esta sección cubre exactamente eso.

## 1.1 ¿Qué Hace Realmente un Maquetador Web?

* **Traduce un diseño** (Figma, XD, Sketch) **a código funcional**, no solo visualmente idéntico, sino semánticamente correcto y accesible.
* **Garantiza consistencia entre navegadores y dispositivos**, sin asumir que todos los usuarios tienen el mismo navegador o tamaño de pantalla que el equipo de desarrollo.
* **Optimiza para rendimiento y SEO** desde la maquetación misma, no como un paso posterior.
* **Documenta y entrega código mantenible** a un equipo de desarrollo que construirá funcionalidad sobre esa base.

## 1.2 El Flujo de Trabajo Estándar

```text
1. Recibir el diseño (Figma/XD) y los assets exportados.
2. Analizar el diseño: breakpoints, tipografía, espaciados, componentes repetidos.
3. Planificar la estructura semántica del HTML antes de escribir CSS.
4. Elegir una metodología de nomenclatura CSS (Módulo 5).
5. Maquetar mobile-first o desktop-first, según el proyecto.
6. Optimizar imágenes y assets (Módulo 6).
7. Verificar accesibilidad y SEO técnico (Módulos 11-12).
8. Probar en distintos navegadores y dispositivos (Módulo 9).
9. Documentar y entregar al equipo de desarrollo (Módulo 19).
```

## 1.3 Herramientas del Oficio

| Categoría | Herramientas comunes |
| :--- | :--- |
| Diseño | Figma, Adobe XD |
| Editor de código | VS Code con extensiones de linting/formateo |
| Inspección de diseño | DevTools del navegador, extensión de Figma para medir distancias |
| Control de versiones | Git (Módulo 14) |
| Testing cross-browser | BrowserStack, Can I Use |
| Auditoría de calidad | Lighthouse, axe DevTools |

## 1.4 Maquetación Web vs Desarrollo Frontend — Dónde Está la Línea

No hay una frontera absoluta — en muchos equipos la misma persona hace ambas cosas — pero conceptualmente:

| Maquetación Web | Desarrollo Frontend (frameworks) |
| :--- | :--- |
| HTML semántico, CSS, JavaScript básico de interacción | Lógica de aplicación, estado, componentes con Vue/React |
| El resultado es la interfaz visual completa y funcional | El resultado es una aplicación interactiva compleja |
| El navegador es el único "runtime" | Herramientas de build, frameworks, gestión de estado |

Este sitio cubre ambos mundos por separado: esta sección se enfoca en el oficio de maquetación pura, mientras que Vue.js y React (secciones de Frameworks y Ecosistema) cubren la capa de aplicación construida sobre esa base.

## 1.5 Mobile-First vs Desktop-First

```css
/* Mobile-first: el estilo base es para móvil, se amplía hacia pantallas grandes */
.tarjeta {
  width: 100%;
}

@media (min-width: 768px) {
  .tarjeta {
    width: 50%;
  }
}
```

```css
/* Desktop-first: el estilo base es para escritorio, se reduce hacia móvil */
.tarjeta {
  width: 50%;
}

@media (max-width: 767px) {
  .tarjeta {
    width: 100%;
  }
}
```

**Mobile-first es el estándar recomendado hoy en día**: la mayoría del tráfico web es móvil, y `min-width` obliga a diseñar primero la experiencia más restrictiva (que suele ser la más difícil de acertar), en lugar de tratarla como un ajuste posterior.

## 1.6 El Rol del Diseño Antes de Maquetar

Antes de escribir cualquier código, un maquetador profesional analiza el diseño para extraer un sistema consistente, en lugar de copiar valores arbitrarios pixel por pixel de cada pantalla:

* **Escala tipográfica**: ¿el diseño usa 8-10 tamaños de fuente distintos, o se puede consolidar en una escala de 5-6 valores?
* **Sistema de espaciado**: ¿los márgenes/paddings siguen una escala consistente (8px, 16px, 24px, 32px...) o son valores arbitrarios sin patrón?
* **Paleta de color**: ¿cuántos colores únicos aparecen realmente, y cuáles son variaciones de opacidad del mismo color base?
* **Componentes repetidos**: ¿qué elementos (tarjetas, botones, badges) se repiten con variaciones menores, candidatos a convertirse en componentes reutilizables?

## 1.7 Tabla de Referencia Rápida

| Necesitas... | Enfoque |
| :--- | :--- |
| Diseñar primero para la experiencia más común hoy | Mobile-first con `min-width` |
| Un sistema de espaciado consistente | Escala numérica (8px, 16px, 24px...) extraída del diseño, no valores arbitrarios |
| Verificar que el sitio funcione en varios navegadores | Testing cross-browser antes de dar por terminado (Módulo 9) |

## 1.8 Errores Comunes

- **Empezar a escribir CSS sin analizar el sistema de diseño completo primero**: produce código inconsistente, con decenas de valores de espaciado y tamaño de fuente ligeramente distintos que deberían haber sido los mismos.
- **Maquetar solo pensando en el navegador y resolución del propio equipo**: la audiencia real usa una variedad mucho mayor de dispositivos y navegadores.
- **Tratar el mobile-first como opcional "si da tiempo"**: en la mayoría de proyectos, la experiencia móvil recibe más tráfico real que la de escritorio.
