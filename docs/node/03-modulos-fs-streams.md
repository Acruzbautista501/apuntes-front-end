# Módulo 3: Módulos, el Sistema de Archivos y Streams

Este módulo cubre tres piezas fundamentales del núcleo de Node.js: cómo organizar código en módulos (y la diferencia crítica entre los dos sistemas que coexisten en el ecosistema), cómo leer/escribir archivos, y qué son los streams — el mecanismo detrás de gran parte del I/O eficiente de Node.

## 3.1 CommonJS vs ES Modules — Los Dos Sistemas

```javascript
// CommonJS (el sistema histórico de Node.js)
const fs = require('fs')
module.exports = { miFuncion }
```

```typescript
// ES Modules (el estándar moderno, el mismo usado en el navegador y en Vite)
import fs from 'fs'
export function miFuncion() { }
```

Con la configuración del Módulo 2 (`"module": "NodeNext"`), el proyecto usa **ES Modules** — el mismo sistema `import`/`export` ya familiar de las secciones de Vue.js/React de este sitio. CommonJS sigue siendo extremadamente común en código y paquetes existentes, así que reconocerlo es necesario aunque el proyecto propio use ESM.

## 3.2 Habilitar ES Modules en Node.js

```json
// package.json
{
  "type": "module"
}
```

Sin `"type": "module"` en `package.json`, Node.js interpreta los archivos `.js` como CommonJS por defecto — un detalle de configuración que causa errores confusos ("`import` no está definido") si se olvida.

## 3.3 El Módulo `path` — Rutas Multiplataforma

```typescript
import path from 'node:path'

const rutaCompleta = path.join('carpeta', 'subcarpeta', 'archivo.txt')
// En Linux/Mac: "carpeta/subcarpeta/archivo.txt"
// En Windows: "carpeta\subcarpeta\archivo.txt" — path.join maneja la diferencia automáticamente

const extension = path.extname('imagen.png') // ".png"
const nombreBase = path.basename('/ruta/completa/archivo.txt') // "archivo.txt"
```

> El prefijo `node:` (`node:path`, `node:fs`) es la forma moderna recomendada de importar módulos nativos — deja explícito que es un módulo del núcleo de Node, no un paquete de NPM con el mismo nombre.

## 3.4 El Módulo `fs` — Sistema de Archivos

```typescript
import fs from 'node:fs/promises'

// Leer un archivo completo (versión basada en promesas, preferida sobre callbacks)
const contenido = await fs.readFile('datos.txt', 'utf-8')

// Escribir un archivo
await fs.writeFile('salida.txt', 'Contenido nuevo')

// Verificar si un archivo existe
try {
  await fs.access('archivo.txt')
  console.log('El archivo existe')
} catch {
  console.log('El archivo no existe')
}

// Leer el contenido de una carpeta
const archivos = await fs.readdir('./carpeta')
```

`fs/promises` (en lugar del `fs` con callbacks tradicional) permite usar `async`/`await` de forma natural — el patrón recomendado en código moderno de Node.js.

## 3.5 El Problema de Leer Archivos Grandes de una Sola Vez

```typescript
// ❌ Carga TODO el archivo en memoria antes de procesarlo — problemático con archivos de varios GB
const contenido = await fs.readFile('archivo-enorme.csv', 'utf-8')
```

Con un archivo de 5GB, `readFile` intenta cargar los 5GB completos en la memoria del proceso antes de devolver el resultado — para archivos grandes, esto es lento e incluso puede agotar la memoria disponible.

## 3.6 Streams — Procesar Datos por Fragmentos

Un **stream** procesa datos en pequeños fragmentos (*chunks*) a medida que llegan, sin necesitar cargar el archivo completo en memoria — la solución al problema de 3.5, y el mecanismo interno detrás de operaciones como servir un video o procesar una subida de archivo grande.

```typescript
import fs from 'node:fs'

const stream = fs.createReadStream('archivo-enorme.csv', { encoding: 'utf-8' })

stream.on('data', (chunk) => {
  console.log('Fragmento recibido:', chunk.length, 'caracteres')
})

stream.on('end', () => {
  console.log('Lectura completa')
})

stream.on('error', (error) => {
  console.error('Error al leer el archivo:', error)
})
```

## 3.7 Streams de Escritura y `pipe()`

```typescript
import fs from 'node:fs'

const lectura = fs.createReadStream('origen.txt')
const escritura = fs.createWriteStream('destino.txt')

lectura.pipe(escritura) // Conecta la salida de un stream directamente a la entrada de otro
```

`pipe()` conecta un stream de lectura con uno de escritura, manejando automáticamente el flujo de datos (incluyendo *backpressure*: pausar la lectura si la escritura no puede seguir el ritmo) — sin esta gestión automática, sería necesario coordinar manualmente ambos procesos.

## 3.8 Streams en el Contexto de una API (Anticipo)

Cuando se sirve una respuesta HTTP grande (un archivo de descarga, un video) desde Express (Módulo 6), el mismo principio de streams evita cargar el archivo completo en memoria antes de empezar a enviarlo al cliente — el envío comienza tan pronto como el primer fragmento está disponible.

## 3.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| El sistema de módulos moderno (`import`/`export`) | `"type": "module"` en `package.json` |
| Construir rutas de archivo multiplataforma | `path.join()` |
| Leer/escribir un archivo completo de forma simple | `fs/promises` con `readFile`/`writeFile` |
| Procesar un archivo grande sin agotar memoria | Streams (`createReadStream`/`createWriteStream`) |
| Conectar la salida de un stream a la entrada de otro | `.pipe()` |

## 3.10 Errores Comunes

- **Mezclar `require` e `import` en el mismo proyecto sin entender el sistema activo**: causa errores de sintaxis o de resolución de módulos confusos — el `"type"` en `package.json` determina el sistema por defecto de todo el proyecto.
- **Usar `readFile` para archivos potencialmente grandes** (subidas de usuarios, exportaciones de datos): puede agotar la memoria del servidor con archivos suficientemente grandes — los streams son la alternativa correcta.
- **No manejar el evento `'error'` en un stream**: un error no capturado en un stream puede terminar el proceso de Node.js completo de forma inesperada.
