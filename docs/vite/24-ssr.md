# Módulo 24: Renderizado del Lado del Servidor (SSR) con Vite

Vite incluye soporte incorporado para SSR (Server-Side Rendering) — generar el HTML inicial de la aplicación en el servidor, en lugar de depender únicamente de JavaScript ejecutado en el navegador. Este módulo cubre el modelo de SSR de Vite, construyendo sobre el modo middleware del Módulo 23.

## 24.1 Por Qué SSR

```text
Sin SSR: el navegador recibe un HTML casi vacío, ejecuta JS, RECIÉN AHÍ aparece contenido
Con SSR:  el navegador recibe HTML ya con el contenido visible desde la primera respuesta
```

SSR mejora el tiempo hasta contenido visible (relevante para el rendimiento percibido y Core Web Vitals, Módulo 18.8) y el SEO (los rastreadores de buscadores reciben HTML con contenido real, no un documento vacío que depende de ejecutar JavaScript) — a costa de una arquitectura más compleja que un SPA puro.

## 24.2 Los Dos Puntos de Entrada de una App SSR

```text
src/
├── entry-client.ts    # Se ejecuta en el NAVEGADOR, "hidrata" el HTML ya renderizado
├── entry-server.ts      # Se ejecuta en el SERVIDOR, genera el HTML inicial
```

```ts
// entry-server.ts
import { createApp } from './main'
import { renderToString } from 'vue/server-renderer'

export async function render(url: string) {
  const { app } = createApp()
  const html = await renderToString(app)
  return html
}
```

```ts
// entry-client.ts
import { createApp } from './main'

const { app } = createApp()
app.mount('#app') // "Hidrata" el HTML ya presente, en lugar de crearlo desde cero
```

Una aplicación SSR necesita, casi siempre, dos puntos de entrada distintos: uno ejecutado en el servidor (genera el HTML) y otro en el cliente (toma ese HTML ya presente y lo hace interactivo, un proceso llamado *hidratación*).

## 24.3 El Servidor de Desarrollo SSR (Repaso del Módulo 23)

```ts
const vite = await createServer({ server: { middlewareMode: true } })

app.use('*', async (req, res) => {
  const { render } = await vite.ssrLoadModule('/src/entry-server.ts')
  const html = await render(req.originalUrl)

  let plantilla = fs.readFileSync('index.html', 'utf-8')
  plantilla = await vite.transformIndexHtml(req.originalUrl, plantilla)

  const paginaFinal = plantilla.replace('<!--app-html-->', html)
  res.status(200).set({ 'Content-Type': 'text/html' }).end(paginaFinal)
})
```

Este flujo combina exactamente los conceptos del Módulo 23: `ssrLoadModule` ejecuta el código de renderizado del servidor con soporte completo de HMR, y `transformIndexHtml` aplica las transformaciones necesarias sobre la plantilla base antes de insertar el HTML ya renderizado.

## 24.4 Build de Producción SSR: Dos Builds Separados

```json
{
  "scripts": {
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --ssr src/entry-server.ts --outDir dist/server"
  }
}
```

A diferencia de una SPA (un único build), una aplicación SSR en producción requiere **dos** builds independientes: uno del cliente (JavaScript/CSS/assets servidos al navegador) y otro del servidor (el módulo Node.js que genera HTML), cada uno con requisitos de optimización distintos.

## 24.5 Servir el Build de Producción SSR

```ts
// server.js — el servidor real de producción, sin Vite en modo middleware
import express from 'express'
import { render } from './dist/server/entry-server.js'

const app = express()
app.use(express.static('dist/client'))

app.get('*', async (req, res) => {
  const html = await render(req.url)
  res.send(plantillaConHtml(html))
})
```

En producción, ya no se usa `createServer`/`ssrLoadModule` de Vite (esas herramientas son específicas de desarrollo) — el servidor de producción simplemente importa directamente el módulo ya compilado del build del servidor, sirviendo los assets estáticos del build del cliente por separado.

## 24.6 Hidratación: el Cliente Debe Coincidir con el Servidor

```text
Servidor genera: <div id="app"><h1>Hola Mundo</h1></div>
Cliente espera:   EXACTAMENTE la misma estructura al montar
```

Un requisito crítico de SSR: el HTML generado por el servidor y el que produciría el cliente al renderizar el mismo estado deben coincidir **exactamente** — cualquier discrepancia (un dato distinto, contenido que depende de `window` no disponible en el servidor) produce advertencias de "hydration mismatch" y, en casos severos, contenido visualmente incorrecto tras la hidratación.

## 24.7 Frameworks Meta: Ahorrarse la Configuración Manual

```text
Nuxt (sobre Vue)      → SSR completamente configurado, sin escribir entry-client/entry-server manualmente
Next.js (sobre React, no usa Vite) → equivalente en el ecosistema React
Astro                  → SSR/SSG configurable, soporta múltiples frameworks de UI
```

Configurar SSR manualmente (como en este módulo) es valioso para entender el mecanismo subyacente, pero en proyectos reales la mayoría de los equipos usan un **framework meta** construido sobre la API programática de Vite (Módulo 23.7) que ya resuelve toda esta configuración — Nuxt para Vue, Astro como opción agnóstica de framework, siendo los más relevantes en el ecosistema Vite.

## 24.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Generar HTML con contenido real desde el servidor | Un punto de entrada de servidor con `renderToString` (u equivalente del framework) |
| Hacer interactivo el HTML ya renderizado en el cliente | Un punto de entrada de cliente que "hidrata" en lugar de crear desde cero |
| Servir SSR en desarrollo con HMR | Modo middleware + `ssrLoadModule` (Módulo 23) |
| Evitar configurar SSR manualmente | Un framework meta como Nuxt o Astro |

## 24.9 Errores Comunes

- **Acceder a APIs exclusivas del navegador (`window`, `document`) en código que también se ejecuta en el servidor**: produce errores directos, ya que esas APIs no existen en el entorno Node.js del servidor — código específico del navegador debe protegerse o diferirse hasta después de la hidratación.
- **Generar HTML en el servidor que no coincide con lo que el cliente renderizaría con el mismo estado**: produce "hydration mismatch" (24.6), un problema notoriamente difícil de depurar si la causa no es evidente a simple vista.
- **Implementar SSR manualmente desde cero para un proyecto que un framework meta ya resolvería mejor**: salvo una necesidad muy específica de control granular, adoptar Nuxt/Astro suele ser considerablemente más productivo que mantener la configuración manual de este módulo indefinidamente.
