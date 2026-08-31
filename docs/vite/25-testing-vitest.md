# Módulo 25: Testing con Vitest

Vitest es el framework de testing creado específicamente para proyectos Vite — reutiliza directamente la configuración de `vite.config.ts` (plugins, alias, transformaciones), eliminando la duplicación de configuración típica entre el bundler y el runner de tests. Este módulo cubre su uso completo.

## 25.1 Por Qué Vitest en Lugar de Jest

```text
Jest: requiere su propia configuración de transformación (Babel), separada de la de Vite
Vitest: REUTILIZA la configuración de Vite directamente — mismos alias, mismos plugins
```

Antes de Vitest, un proyecto Vite que usaba Jest para testing necesitaba mantener **dos** configuraciones de transformación de código en paralelo (una para Vite, otra para Jest vía `babel-jest` o similar) — frecuentemente desincronizadas entre sí. Vitest elimina ese problema al ejecutarse dentro del mismo pipeline de transformación de Vite.

## 25.2 Instalación y Configuración Básica

```bash
npm install -D vitest
```

```ts
// vite.config.ts — la configuración de test vive en el MISMO archivo
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,       // Permite usar describe/it/expect sin importarlos explícitamente
    environment: 'jsdom', // Simula un entorno de navegador para tests de componentes
  },
})
```

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

## 25.3 Escribir un Test Básico

```ts
// suma.test.ts
import { describe, it, expect } from 'vitest'
import { sumar } from './suma'

describe('sumar', () => {
  it('suma dos números correctamente', () => {
    expect(sumar(2, 3)).toBe(5)
  })

  it('maneja números negativos', () => {
    expect(sumar(-1, 1)).toBe(0)
  })
})
```

La API de Vitest es prácticamente idéntica a la de Jest (`describe`, `it`, `expect` con los mismos matchers) — quien ya conoce Jest puede migrar la mayoría de sus tests con cambios mínimos, principalmente en configuración, no en la sintaxis de los tests en sí.

## 25.4 Testing de Componentes Vue

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Contador from './Contador.vue'

describe('Contador', () => {
  it('incrementa al hacer clic', async () => {
    const wrapper = mount(Contador)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('1')
  })
})
```

`@vue/test-utils` sigue siendo la biblioteca de testing de componentes Vue estándar — Vitest simplemente reemplaza a Jest como el motor que ejecuta esos tests, sin cambiar la forma de escribirlos.

## 25.5 Testing de Componentes React

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Contador from './Contador'

describe('Contador', () => {
  it('incrementa al hacer clic', () => {
    render(<Contador />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText(/1/)).toBeInTheDocument()
  })
})
```

De la misma forma, Testing Library funciona igual con Vitest que con Jest — nuevamente, el cambio es de motor de ejecución, no de metodología de testing.

## 25.6 Modo UI Interactivo

```bash
npm install -D @vitest/ui
npx vitest --ui
```

Vitest incluye una interfaz web opcional que muestra los resultados de tests de forma visual e interactiva — útil para explorar fallos de tests con más contexto que la salida de terminal tradicional, incluyendo la posibilidad de re-ejecutar tests específicos individualmente desde la interfaz.

## 25.7 Cobertura de Código

```bash
npm install -D @vitest/coverage-v8
npx vitest run --coverage
```

```ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
```

## 25.8 Modo Watch: Testing Continuo Durante Desarrollo

```bash
npx vitest        # Por defecto, entra en modo "watch": re-ejecuta tests afectados al guardar
npx vitest run      # Ejecuta una sola vez y termina (usado típicamente en CI)
```

Similar en espíritu al HMR del servidor de desarrollo (Módulo 4): Vitest re-ejecuta automáticamente solo los tests relevantes a los archivos que cambiaron, en lugar de la suite completa, aprovechando la misma filosofía de velocidad que el resto del ecosistema Vite.

## 25.9 Mocking

```ts
import { vi } from 'vitest'

const mockFn = vi.fn().mockReturnValue(42)

vi.mock('./api', () => ({
  obtenerUsuarios: vi.fn().mockResolvedValue([{ id: 1, nombre: 'Alex' }]),
}))
```

`vi` es el objeto de utilidades de Vitest equivalente a `jest` en Jest (`vi.fn()`, `vi.mock()`, `vi.spyOn()`) — la API está deliberadamente alineada para minimizar fricción al migrar proyectos existentes.

## 25.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ejecutar tests con la misma configuración que Vite | Vitest, sin duplicar configuración de transformación |
| Simular un entorno de navegador para tests de componentes | `test.environment: 'jsdom'` |
| Una interfaz visual para explorar resultados de tests | `@vitest/ui` |
| Medir cobertura de código | `@vitest/coverage-v8` |
| Simular funciones y módulos | `vi.fn()`, `vi.mock()` |

## 25.11 Errores Comunes

- **Mantener Jest en un proyecto Vite "porque ya funcionaba"**: implica mantener dos configuraciones de transformación en paralelo, con riesgo real de desincronización — migrar a Vitest elimina esa duplicación por completo en la mayoría de los casos.
- **Olvidar configurar `test.environment: 'jsdom'` al testear componentes**: sin un entorno de navegador simulado, cualquier test que interactúe con el DOM falla con errores de `document`/`window` no definidos.
- **Ejecutar `vitest` (modo watch) en un pipeline de CI en lugar de `vitest run`**: el modo watch nunca termina por diseño, bloqueando indefinidamente cualquier pipeline automatizado que no use explícitamente el modo de ejecución única.
