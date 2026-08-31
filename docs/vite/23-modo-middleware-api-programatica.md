# Módulo 23: Vite en Modo Middleware y su API Programática

Más allá del CLI (`vite`, `vite build`), Vite expone una API de JavaScript completa para controlarlo programáticamente — este módulo cubre el modo middleware (integrar Vite dentro de un servidor Node.js existente) y la API programática general.

## 23.1 El Caso de Uso: Integrar Vite en un Servidor Existente

```text
Escenario típico: un servidor Express que maneja rutas de API,
                    y que ADEMÁS debe servir el frontend con HMR de Vite durante desarrollo
```

El modo middleware permite montar el servidor de desarrollo de Vite **dentro** de otro servidor Node.js (Express, Fastify, Connect), en lugar de ejecutarlo como un proceso HTTP independiente — el caso de uso principal es SSR (Módulo 24), donde el mismo servidor necesita tanto renderizar HTML del lado del servidor como servir los módulos de Vite con HMR.

## 23.2 Crear un Servidor Vite en Modo Middleware

```ts
import express from 'express'
import { createServer } from 'vite'

async function iniciarServidor() {
  const app = express()

  const vite = await createServer({
    server: { middlewareMode: true }, // No inicia su propio servidor HTTP
  })

  app.use(vite.middlewares) // Monta Vite como middleware de Express

  app.get('/api/usuarios', (req, res) => {
    res.json([{ id: 1, nombre: 'Alex' }])
  })

  app.listen(3000)
}

iniciarServidor()
```

`middlewareMode: true` le indica a Vite que no debe crear su propio servidor HTTP — en su lugar, expone `vite.middlewares` (un middleware compatible con Connect/Express) que se integra directamente en el servidor ya existente, combinando las rutas de API propias con el servicio de módulos de Vite en un único proceso.

## 23.3 La API Programática Completa

```ts
import { createServer, build, preview } from 'vite'
```

| Función | Equivalente en CLI |
| :--- | :--- |
| `createServer()` | `vite` (modo desarrollo) |
| `build()` | `vite build` |
| `preview()` | `vite preview` |

Toda la funcionalidad accesible desde la línea de comandos también está disponible programáticamente — útil para scripts de automatización personalizados, herramientas de testing, o integraciones donde invocar el CLI directamente no es viable.

## 23.4 Build Programático

```ts
import { build } from 'vite'

async function construirProyecto() {
  await build({
    build: {
      outDir: 'dist-personalizado',
    },
  })
  console.log('Build completado')
}
```

Permite ejecutar el proceso de build como parte de un script Node.js más amplio (por ejemplo, un pipeline de despliegue personalizado que hace pasos adicionales antes/después del build), en lugar de invocar `vite build` como un comando de shell separado.

## 23.5 Transformar HTML con `vite.transformIndexHtml`

```ts
app.use('*', async (req, res) => {
  let plantilla = fs.readFileSync('index.html', 'utf-8')
  plantilla = await vite.transformIndexHtml(req.originalUrl, plantilla)
  res.status(200).set({ 'Content-Type': 'text/html' }).end(plantilla)
})
```

En modo middleware, servir `index.html` manualmente requiere pasarlo explícitamente por `vite.transformIndexHtml` — este paso aplica las transformaciones que Vite normalmente haría automáticamente (inyectar el cliente de HMR, resolver rutas de scripts), esencial para que HMR funcione correctamente en este modelo de integración manual.

## 23.6 Cargar Módulos del Servidor con `ssrLoadModule`

```ts
const { render } = await vite.ssrLoadModule('/src/entry-server.ts')
const html = await render(req.url)
```

`ssrLoadModule` permite que el código del **servidor** Node.js importe y ejecute módulos del proyecto exactamente como Vite los transformaría para el navegador (incluyendo soporte de TypeScript, alias, etc.) — la pieza central que hace posible SSR con HMR en desarrollo, cubierto en profundidad en el Módulo 24.

## 23.7 Cuándo Usar la API Programática vs el CLI

| Escenario | Recomendación |
| :--- | :--- |
| Proyecto frontend estándar, sin necesidades especiales de servidor | El CLI (`vite`, `vite build`) es suficiente y más simple |
| SSR con un servidor Node.js personalizado | Modo middleware, necesario para integrar ambos |
| Scripts de automatización/CI con lógica adicional alrededor del build | La API programática (`build()`) |
| Herramientas que construyen sobre Vite (frameworks meta como Astro, Nuxt) | La API programática, como base de su propia implementación |

## 23.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Integrar Vite dentro de un servidor Express/Fastify existente | `createServer({ server: { middlewareMode: true } })` |
| Ejecutar un build desde un script Node.js | `import { build } from 'vite'` |
| Servir `index.html` manualmente con las transformaciones de Vite aplicadas | `vite.transformIndexHtml` |
| Ejecutar módulos del proyecto desde código de servidor, como lo haría Vite | `vite.ssrLoadModule` |

## 23.9 Errores Comunes

- **Usar modo middleware sin una necesidad real de integración con otro servidor**: para un proyecto frontend estándar, el CLI normal es más simple y no requiere gestionar manualmente la integración con Express/Connect.
- **Olvidar `vite.transformIndexHtml` al servir HTML manualmente en modo middleware**: sin este paso, el cliente de HMR nunca se inyecta, y el HMR deja de funcionar silenciosamente sin ningún error obvio.
- **Confundir `ssrLoadModule` con un import normal de Node.js**: es una función específica de la API de Vite que aplica las mismas transformaciones (TypeScript, alias) que el servidor de desarrollo — un `import()` nativo de Node.js no entiende esos mismos archivos sin pasar antes por Vite.
