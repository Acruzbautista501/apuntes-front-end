# Módulo 22: Crear un Plugin Propio

Con el modelo de plugins ya entendido conceptualmente (Módulo 21), este módulo construye un plugin funcional completo, paso a paso, cubriendo los hooks más usados en la práctica.

## 22.1 La Estructura Mínima de un Plugin

```ts
// vite-plugin-mi-ejemplo.ts
import type { Plugin } from 'vite'

export function miPlugin(): Plugin {
  return {
    name: 'vite-plugin-mi-ejemplo', // Requerido, usado en mensajes de error/depuración
  }
}
```

```ts
// vite.config.ts
import { miPlugin } from './vite-plugin-mi-ejemplo'

export default defineConfig({
  plugins: [miPlugin()],
})
```

Un plugin es, en su forma más simple, un objeto (o una función que devuelve un objeto, permitiendo aceptar opciones) con un campo `name` obligatorio y cualquier combinación de hooks opcionales.

## 22.2 Ejemplo Práctico: Reemplazar un Marcador de Texto

```ts
import type { Plugin } from 'vite'

export function reemplazarBanner(mensaje: string): Plugin {
  return {
    name: 'reemplazar-banner',
    transform(codigo, id) {
      if (id.endsWith('.ts') && codigo.includes('__BANNER__')) {
        return codigo.replace('__BANNER__', mensaje)
      }
    },
  }
}
```

```ts
// En cualquier archivo .ts del proyecto:
console.log('__BANNER__') // Se reemplaza automáticamente durante la transformación
```

`transform` recibe el código fuente y el `id` (ruta) de cada módulo procesado — devolver un string reemplaza el contenido del módulo; devolver `undefined`/nada deja el módulo sin cambios, permitiendo que el plugin actúe selectivamente solo sobre los archivos que le interesan.

## 22.3 Ejemplo: un Módulo Virtual con `resolveId` + `load`

```ts
const ID_VIRTUAL = 'virtual:config-app'
const ID_RESUELTO = '\0' + ID_VIRTUAL // El prefijo \0 es una convención para IDs virtuales

export function configVirtual(): Plugin {
  return {
    name: 'config-virtual',
    resolveId(id) {
      if (id === ID_VIRTUAL) return ID_RESUELTO
    },
    load(id) {
      if (id === ID_RESUELTO) {
        return `export default { version: '1.0.0', entorno: 'produccion' }`
      }
    },
  }
}
```

```ts
// En cualquier archivo del proyecto:
import config from 'virtual:config-app'
console.log(config.version)
```

Un "módulo virtual" no corresponde a ningún archivo real en el disco — se genera completamente en memoria por el plugin. El prefijo `\0` es una convención adoptada por Rollup/Vite para señalar explícitamente que un ID no debe tratarse como una ruta de archivo real por ningún otro plugin en la cadena.

## 22.4 Ejemplo: Middleware del Servidor de Desarrollo con `configureServer`

```ts
export function endpointDebug(): Plugin {
  return {
    name: 'endpoint-debug',
    configureServer(servidor) {
      servidor.middlewares.use('/__debug', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ momento: new Date().toISOString() }))
      })
    },
  }
}
```

`configureServer` da acceso directo al servidor HTTP interno de Vite (basado en Connect) durante desarrollo — permite agregar rutas o middleware personalizado, útil para endpoints de utilidad exclusivos de desarrollo (nunca presentes en el build de producción, ya que este hook nunca se ejecuta ahí).

## 22.5 Opciones Configurables en un Plugin

```ts
interface OpcionesMiPlugin {
  prefijo?: string
}

export function miPlugin(opciones: OpcionesMiPlugin = {}): Plugin {
  const prefijo = opciones.prefijo ?? '__DEFAULT__'

  return {
    name: 'mi-plugin',
    transform(codigo) {
      if (codigo.includes(prefijo)) {
        // ...
      }
    },
  }
}
```

Aceptar un objeto de opciones (con valores por defecto sensatos) es el patrón estándar que permite que el mismo plugin se reutilice con comportamiento distinto entre proyectos, o incluso entre distintas instancias dentro del mismo proyecto.

## 22.6 Depurar un Plugin Propio

```ts
transform(codigo, id) {
  if (id.includes('mi-archivo-especifico')) {
    console.log('Procesando:', id)
  }
}
```

```bash
DEBUG=vite:* npm run dev   # Logs internos detallados de Vite, útiles para entender el orden de ejecución de hooks
```

## 22.7 Publicar un Plugin Propio en NPM

```json
{
  "name": "vite-plugin-mi-utilidad",
  "peerDependencies": {
    "vite": "^5.0.0"
  }
}
```

Siguiendo el mismo enfoque del Módulo 20 (modo librería): Vite debe declararse como `peerDependency`, nunca empaquetarse dentro del plugin — el proyecto consumidor siempre aporta su propia instancia de Vite.

## 22.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Modificar el código de módulos específicos | El hook `transform` |
| Crear un módulo que no existe como archivo real | `resolveId` + `load`, con el prefijo `\0` |
| Agregar una ruta personalizada al servidor de desarrollo | `configureServer` + `servidor.middlewares.use` |
| Permitir configuración personalizada del plugin | Aceptar un objeto de opciones con valores por defecto |
| Ver logs internos detallados de Vite | `DEBUG=vite:* npm run dev` |

## 22.9 Errores Comunes

- **Olvidar el prefijo `\0` en IDs de módulos virtuales**: sin esa convención, otros plugins en la cadena podrían intentar tratar el ID como una ruta de archivo real, causando errores de resolución inesperados.
- **Usar `configureServer` esperando que también afecte al build de producción**: este hook es exclusivo del servidor de desarrollo — cualquier comportamiento equivalente necesario en producción debe implementarse por separado, normalmente a nivel del servidor que sirve los archivos finales.
- **No devolver `undefined` explícitamente en `transform` cuando el módulo no debe modificarse**: aunque en JavaScript no retornar nada ya es `undefined` implícitamente, es una buena práctica hacerlo evidente para futuros lectores del código del plugin.
