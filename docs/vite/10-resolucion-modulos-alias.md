# Módulo 10: Resolución de Módulos y Alias de Rutas

Este módulo cubre cómo Vite resuelve las rutas de `import`, y cómo configurar alias para evitar rutas relativas largas y frágiles (`../../../components/Boton`).

## 10.1 El Problema de las Rutas Relativas Profundas

```ts
// src/pages/admin/usuarios/DetalleUsuario.tsx
import Boton from '../../../components/ui/Boton'
import { formatearFecha } from '../../../../utils/fechas'
```

En proyectos con carpetas anidadas profundamente, las rutas relativas se vuelven difíciles de leer y frágiles ante reorganizaciones de archivos — mover un archivo de carpeta obliga a actualizar manualmente cada ruta relativa que apunta hacia y desde él.

## 10.2 Configurar un Alias

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```ts
// Ahora, desde cualquier archivo del proyecto:
import Boton from '@/components/ui/Boton'
import { formatearFecha } from '@/utils/fechas'
```

`@` es la convención más común (heredada de Vue CLI y adoptada ampliamente), pero puede ser cualquier string — el alias le indica a Vite que reemplace ese prefijo por la ruta absoluta configurada al resolver cualquier `import`.

## 10.3 Múltiples Alias

```ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
```

## 10.4 Sincronizar el Alias con TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Crítico**: configurar el alias solo en `vite.config.ts` hace que el código funcione en tiempo de ejecución, pero TypeScript (y el editor) seguirán marcando el import como un error, sin saber cómo resolverlo — ambas configuraciones deben mantenerse sincronizadas manualmente, ya que Vite no lee `tsconfig.json` para sus propios alias (recordando el Módulo 3.8: Vite en general no consume `tsconfig.json` para transformación).

## 10.5 Extensiones Resueltas Automáticamente

```ts
import Boton from './Boton' // Resuelve automáticamente a Boton.tsx, Boton.ts, Boton.jsx, Boton.vue, etc.
```

```ts
// vite.config.ts — personalizar el orden de resolución si es necesario
export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
})
```

Vite prueba automáticamente una lista de extensiones al resolver un import sin extensión explícita — el orden de esta lista determina qué archivo gana si existieran, por ejemplo, tanto `Boton.js` como `Boton.ts` en la misma ubicación (un caso raro, pero configurable).

## 10.6 Resolución de `node_modules`

```ts
import { debounce } from 'lodash-es'
```

Los imports sin ruta relativa (sin `./` o `../`) que no coinciden con ningún alias configurado se resuelven contra `node_modules`, siguiendo el algoritmo estándar de Node.js — el mismo comportamiento esperado de cualquier herramienta JavaScript moderna, sin ninguna particularidad adicional de Vite.

## 10.7 Condiciones de Exportación (`exports` en package.json)

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

Vite respeta el campo `exports` de `package.json` de las dependencias (un estándar moderno de Node.js) para determinar qué archivo servir según el contexto — relevante al depurar por qué una biblioteca se comporta distinto entre Vite y una herramienta más antigua que no soporta completamente este campo.

## 10.8 Importar JSON Directamente

```ts
import datos from './configuracion.json'

console.log(datos.version)
```

Vite soporta importar archivos `.json` directamente como módulos, convirtiendo automáticamente su contenido en un objeto JavaScript utilizable — sin ninguna configuración adicional necesaria.

## 10.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Evitar rutas relativas largas | `resolve.alias` en `vite.config.ts` |
| Que TypeScript/el editor entiendan el alias | Sincronizar `paths` en `tsconfig.json` |
| Personalizar qué extensiones se resuelven automáticamente | `resolve.extensions` |
| Importar un archivo JSON como objeto | `import datos from './archivo.json'` |

## 10.10 Errores Comunes

- **Configurar el alias solo en `vite.config.ts`, olvidando `tsconfig.json`**: el código funciona al ejecutarse, pero el editor y `tsc` reportan errores de módulo no encontrado — ambos archivos deben mantenerse sincronizados manualmente.
- **Usar rutas relativas frágiles en un proyecto grande sin configurar ningún alias**: dificulta innecesariamente la reorganización de archivos y reduce la legibilidad de los imports en carpetas profundamente anidadas.
- **Esperar que Vite lea automáticamente los `paths` de `tsconfig.json`**: a diferencia de algunas otras herramientas, Vite no infiere su configuración de alias desde TypeScript — requiere su propia configuración explícita en `resolve.alias`.
