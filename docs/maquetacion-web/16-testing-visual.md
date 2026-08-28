# Módulo 16: Testing Visual y de Regresión

El Módulo 9 cubrió compatibilidad cross-browser de forma manual. Este módulo cubre cómo **automatizar** la detección de cambios visuales no intencionados — el equivalente en maquetación a las pruebas automatizadas de lógica que ya se cubren en las secciones de Vue.js y React de este sitio.

## 16.1 Qué es el Testing de Regresión Visual

Un cambio en CSS compartido (una variable de espaciado, un selector demasiado amplio) puede alterar visualmente componentes en partes completamente distintas del sitio sin que nadie lo note hasta que un usuario reporta el problema. El testing de regresión visual compara capturas de pantalla **antes y después** de un cambio, señalando automáticamente cualquier diferencia píxel por píxel.

## 16.2 El Flujo Conceptual

```text
1. Se capturan "screenshots de referencia" (baseline) del estado actual y aprobado del sitio.
2. Se hace un cambio de código (CSS, HTML, contenido).
3. Antes de fusionar el cambio, se capturan nuevos screenshots.
4. Una herramienta compara automáticamente ambos conjuntos de capturas.
5. Cualquier diferencia se muestra visualmente para revisión humana:
   - Si el cambio es intencional → se aprueba como el nuevo baseline.
   - Si es una regresión no intencionada → se corrige antes de fusionar.
```

## 16.3 Percy — Testing Visual Integrado a CI/CD

```bash
npm install --save-dev @percy/cli @percy/playwright
```

```javascript
// test-visual.spec.js
import { test } from '@playwright/test'
import percySnapshot from '@percy/playwright'

test('captura visual de la página de inicio', async ({ page }) => {
  await page.goto('https://staging.ejemplo.com')
  await percySnapshot(page, 'Página de inicio')
})

test('captura visual del catálogo de productos', async ({ page }) => {
  await page.goto('https://staging.ejemplo.com/productos')
  await percySnapshot(page, 'Catálogo de productos')
})
```

```bash
npx percy exec -- npx playwright test
```

Percy captura las páginas especificadas en múltiples navegadores/resoluciones automáticamente, y muestra un resumen visual de diferencias directamente en el Pull Request correspondiente (Módulo 14) — el equipo revisa y aprueba/rechaza cada diferencia detectada antes de fusionar.

## 16.4 Chromatic — Integrado con Storybook

Para proyectos que ya usan Storybook (Módulo 15), Chromatic ofrece testing visual específicamente sobre cada "story" documentada, capturando automáticamente cada variante de cada componente sin necesitar escribir tests de captura por separado.

```bash
npx chromatic --project-token=<tu-token>
```

Cada vez que se publica el proyecto, Chromatic compara el render de cada story contra su versión aprobada anterior — particularmente efectivo porque las stories ya cubren sistemáticamente todas las variantes de cada componente (Módulo 15).

## 16.5 Testing Cross-Browser Automatizado con Playwright

Más allá del testing puramente visual, Playwright permite automatizar la verificación de comportamiento en múltiples navegadores dentro de un pipeline de CI/CD.

```javascript
// playwright.config.js
export default {
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ]
}
```

```bash
npx playwright test  # Ejecuta la misma suite de tests en los tres motores configurados
```

Correr el mismo test en Chromium, Firefox y WebKit automáticamente reduce significativamente la necesidad de verificación manual repetitiva descrita en el Módulo 9, aunque no la elimina completamente para casos visuales muy específicos.

## 16.6 Cuándo Vale la Pena Automatizar Testing Visual

| Escenario | Recomendación |
| :--- | :--- |
| Sitio pequeño, cambios poco frecuentes | Testing manual (Módulo 9) suele ser suficiente |
| Sistema de diseño compartido entre múltiples productos | Alta prioridad — un cambio no intencional se propaga a todos los consumidores |
| Equipo grande con cambios frecuentes al CSS compartido | Alta prioridad — reduce significativamente regresiones no detectadas |
| Proyecto en fase muy temprana, con el diseño todavía cambiando constantemente | Puede generar más ruido (falsos positivos por cambios intencionales) que valor en esta etapa |

## 16.7 Falsos Positivos y Cómo Manejarlos

El testing visual detecta **cualquier** diferencia de píxeles, incluyendo cambios completamente intencionales — la clave está en el flujo de revisión humana (16.2, paso 5): cada diferencia detectada requiere una decisión explícita de aprobar como nuevo baseline o corregir como regresión, no una falla automática ciega del pipeline.

## 16.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Detectar cambios visuales no intencionados automáticamente | Percy o Chromatic integrados al pipeline de CI/CD |
| Testing visual sobre componentes documentados en Storybook | Chromatic |
| Verificar comportamiento en múltiples motores de navegador automáticamente | Playwright con proyectos configurados por navegador |
| Aprobar cambios visuales intencionales | El flujo de revisión de la herramienta (nunca aprobar en automático sin revisión humana) |

## 16.9 Errores Comunes

- **Aprobar automáticamente todas las diferencias sin revisión humana**: elimina por completo el valor del testing visual — el punto es que un humano decida si cada diferencia es intencional o una regresión.
- **Implementar testing visual en un proyecto con el diseño todavía muy inestable**: genera más falsos positivos que valor real, hasta que el sistema de diseño se estabilice.
- **No excluir contenido dinámico no determinístico** (una fecha actual, un carrusel con posición aleatoria) de las capturas: genera diferencias falsas en cada ejecución, sin relación con ningún cambio de código real.
