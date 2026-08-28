# Módulo 21: Testing con Vitest y React Testing Library

Un proyecto React de nivel profesional necesita pruebas automatizadas que verifiquen el comportamiento de los componentes, no su implementación interna. Este módulo cubre **Vitest** (ejecutor de pruebas, igual que en el ecosistema Vue) y **React Testing Library** (RTL), la librería estándar para testear componentes React desde la perspectiva del usuario.

## 21.1 Instalación

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom' // Agrega matchers como toBeInTheDocument()
```

## 21.2 La Filosofía de React Testing Library

RTL se basa en un principio explícito: **testea tu aplicación de la forma en que un usuario la usa**, no accediendo a detalles internos de implementación (variables de estado, nombres de props). Por eso sus consultas buscan elementos por texto visible, rol accesible o etiqueta — no por clases CSS ni estructura del DOM.

## 21.3 Tu Primer Test: Renderizado y Props

```tsx
// Saludo.tsx
function Saludo({ nombre }: { nombre: string }) {
  return <h1>Hola, {nombre}</h1>
}
```

```tsx
// Saludo.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Saludo from './Saludo'

describe('Saludo', () => {
  it('muestra el nombre recibido por props', () => {
    render(<Saludo nombre="Alex" />)

    expect(screen.getByText('Hola, Alex')).toBeInTheDocument()
  })
})
```

`render` monta el componente en un DOM simulado; `screen` da acceso a consultas globales sobre ese DOM renderizado.

## 21.4 Simular Interacción del Usuario

```tsx
// Contador.tsx
import { useState } from 'react'

function Contador() {
  const [cuenta, setCuenta] = useState(0)

  return (
    <div>
      <p>Cuenta: {cuenta}</p>
      <button onClick={() => setCuenta((c) => c + 1)}>Incrementar</button>
    </div>
  )
}
```

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contador from './Contador'

describe('Contador', () => {
  it('incrementa la cuenta al hacer clic', async () => {
    const usuario = userEvent.setup()
    render(<Contador />)

    await usuario.click(screen.getByRole('button', { name: 'Incrementar' }))

    expect(screen.getByText('Cuenta: 1')).toBeInTheDocument()
  })
})
```

`userEvent` (no el más antiguo `fireEvent`) es la forma recomendada de simular interacciones — dispara la secuencia completa de eventos del navegador (`pointerdown`, `pointerup`, `click`), igual que una interacción real.

## 21.5 Consultas Recomendadas: Prioriza lo Accesible

```tsx
// ✅ Prioridad alta: por rol accesible, como lo "vería" un lector de pantalla
screen.getByRole('button', { name: 'Enviar' })
screen.getByRole('textbox', { name: 'Correo electrónico' })

// ✅ Aceptable: por texto visible
screen.getByText('Bienvenido')

// ⚠️ Último recurso: por atributo de test específico, cuando no hay una alternativa accesible
screen.getByTestId('spinner-carga')
```

Preferir `getByRole` fuerza indirectamente a escribir HTML más accesible — si un elemento es difícil de consultar por rol, probablemente también sea difícil de usar con un lector de pantalla.

## 21.6 Testear un Formulario

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormularioLogin from './FormularioLogin'

describe('FormularioLogin', () => {
  it('llama a onEnviar con los datos ingresados', async () => {
    const usuario = userEvent.setup()
    const manejarEnvio = vi.fn()

    render(<FormularioLogin onEnviar={manejarEnvio} />)

    await usuario.type(screen.getByRole('textbox', { name: 'Correo' }), 'alex@correo.com')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(manejarEnvio).toHaveBeenCalledWith({ correo: 'alex@correo.com' })
  })
})
```

## 21.7 Simular (*Mock*) `fetch` y Peticiones a APIs

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ListaProductos from './ListaProductos'

describe('ListaProductos', () => {
  it('muestra los productos obtenidos de la API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 1, nombre: 'Teclado' }])
    }) as unknown as typeof fetch

    render(<ListaProductos />)

    await waitFor(() => {
      expect(screen.getByText('Teclado')).toBeInTheDocument()
    })
  })
})
```

`waitFor` reintenta la aserción hasta que se cumple (o hasta un tiempo límite) — necesario porque la petición simulada resuelve de forma asíncrona.

## 21.8 Testear un Custom Hook con `renderHook`

```typescript
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContador } from './useContador'

describe('useContador', () => {
  it('incrementa correctamente', () => {
    const { result } = renderHook(() => useContador(5))

    act(() => {
      result.current.incrementar()
    })

    expect(result.current.contador).toBe(6)
  })
})
```

`act()` asegura que todas las actualizaciones de estado disparadas dentro de él se procesen antes de continuar con la aserción — necesario porque las actualizaciones de React son asíncronas por naturaleza.

## 21.9 Testear un Componente que Usa Context

```tsx
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../contexts/AuthContext'
import PerfilUsuario from './PerfilUsuario'

function renderConAuth(ui: React.ReactElement) {
  return render(<AuthProvider>{ui}</AuthProvider>)
}

it('muestra el nombre del usuario autenticado', () => {
  renderConAuth(<PerfilUsuario />)
  // ...aserciones
})
```

Envolver el componente con sus `Provider`s necesarios en un *helper* de render propio evita repetir ese envoltorio en cada test.

## 21.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Renderizar un componente para probarlo | `render(<Componente />)` |
| Buscar un elemento como lo haría un usuario | `screen.getByRole(...)` (preferido sobre `getByTestId`) |
| Simular clics, escritura, etc. | `userEvent.setup()` + `await usuario.click(...)` |
| Esperar una actualización asíncrona (fetch, promesas) | `await waitFor(() => {...})` |
| Testear un custom hook de forma aislada | `renderHook(() => useMiHook())` + `act()` |

## 21.11 Errores Comunes

* **Usar `getByTestId` como primera opción**: hace que los tests dependan de detalles de implementación en vez del comportamiento real que un usuario experimenta — resérvalo para cuando no exista una consulta accesible razonable.
* **Olvidar `await` con `userEvent`**: todas sus interacciones son asíncronas; sin `await`, la aserción corre antes de que la interacción se complete.
* **Testear estado interno en lugar de comportamiento observable**: RTL deliberadamente no da acceso fácil al estado interno de un componente — es una señal de que el test debería enfocarse en lo que el usuario ve, no en cómo está implementado.
