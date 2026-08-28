# Módulo 6: Introducción a Express con TypeScript

Node.js por sí solo (con su módulo nativo `http`) permite construir un servidor, pero de forma muy manual y verbosa. **Express** es el framework web más adoptado del ecosistema Node.js — simplifica drásticamente el manejo de rutas, peticiones y respuestas, y es la base sobre la que se construye la API de este curso.

## 6.1 Un Servidor con `http` Nativo (Para Entender el Problema)

```typescript
import http from 'node:http'

const servidor = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ mensaje: 'Hola' }))
  } else {
    res.writeHead(404)
    res.end('No encontrado')
  }
})

servidor.listen(3000, () => console.log('Servidor en el puerto 3000'))
```

Manejar rutas, parsear el body de una petición, y manejar distintos métodos HTTP manualmente con el módulo `http` nativo se vuelve rápidamente inmanejable a medida que la API crece — exactamente el problema que Express resuelve.

## 6.2 Instalación

```bash
npm install express
npm install -D @types/express
```

## 6.3 Tu Primer Servidor Express

```typescript
// src/index.ts
import express from 'express'

const app = express()
const PUERTO = 3000

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' })
})

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`)
})
```

```bash
npm run dev
curl http://localhost:3000
# {"mensaje":"API funcionando correctamente"}
```

## 6.4 Los Métodos HTTP y su Propósito

```typescript
app.get('/productos', (req, res) => { })       // Leer datos
app.post('/productos', (req, res) => { })       // Crear un recurso nuevo
app.put('/productos/:id', (req, res) => { })    // Reemplazar un recurso completo
app.patch('/productos/:id', (req, res) => { })  // Actualizar parcialmente un recurso
app.delete('/productos/:id', (req, res) => { }) // Eliminar un recurso
```

Estos cinco métodos, combinados con rutas semánticas, forman la base de una **API REST** — un estilo de diseño de API donde cada URL representa un recurso, y el método HTTP representa la acción sobre ese recurso.

## 6.5 Middleware para Parsear JSON

```typescript
import express from 'express'

const app = express()

app.use(express.json()) // Sin esto, req.body llega como undefined en peticiones JSON

app.post('/productos', (req, res) => {
  console.log(req.body) // Ahora sí contiene el JSON enviado por el cliente
  res.status(201).json({ mensaje: 'Producto creado', datos: req.body })
})
```

`express.json()` es un **middleware** (concepto central retomado a fondo en el Módulo 7) que interpreta el cuerpo de la petición como JSON y lo pone disponible en `req.body` — sin él, cualquier dato enviado en el body de una petición POST/PUT/PATCH simplemente no está disponible.

## 6.6 Parámetros de Ruta y Query

```typescript
// Parámetro de ruta: /productos/42
app.get('/productos/:id', (req, res) => {
  const id = req.params.id // "42" — siempre string
  res.json({ id })
})

// Query string: /productos?categoria=electronica&orden=precio
app.get('/productos', (req, res) => {
  const categoria = req.query.categoria // "electronica"
  const orden = req.query.orden          // "precio"
  res.json({ categoria, orden })
})
```

## 6.7 Tipar `req`/`res` Correctamente con TypeScript

```typescript
import type { Request, Response } from 'express'

interface ParametrosProducto {
  id: string
}

app.get('/productos/:id', (req: Request<ParametrosProducto>, res: Response) => {
  const { id } = req.params // TypeScript ahora sabe que "id" existe y es string
  res.json({ id })
})
```

Tipar explícitamente `Request`/`Response` (en lugar de dejar que TypeScript infiera tipos genéricos) da autocompletado preciso y detecta errores de tipeo en nombres de parámetros antes de ejecutar el código.

## 6.8 Códigos de Estado HTTP Correctos

```typescript
res.status(200).json({ datos: 'ok' })          // OK
res.status(201).json({ mensaje: 'Creado' })     // Created — al crear un recurso
res.status(204).send()                           // No Content — al eliminar exitosamente, sin body
res.status(400).json({ error: 'Datos inválidos' }) // Bad Request
res.status(401).json({ error: 'No autenticado' })   // Unauthorized
res.status(404).json({ error: 'No encontrado' })     // Not Found
res.status(500).json({ error: 'Error del servidor' }) // Internal Server Error
```

Usar el código de estado correcto (no simplemente `200` para todo) es parte fundamental de una API bien diseñada — le da al cliente información semántica sobre el resultado sin necesitar parsear el cuerpo de la respuesta.

## 6.9 Estructura Inicial Recomendada

```text
src/
├── index.ts          # Punto de entrada: crea la app, la inicia
├── app.ts             # Configuración de Express: middlewares, rutas
└── routes/
    └── productos.routes.ts
```

Separar `app.ts` (la configuración de Express) de `index.ts` (el arranque del servidor) facilita el testing (Módulo 17), donde se necesita la instancia de la app sin necesariamente iniciar el servidor real en un puerto.

## 6.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Crear la aplicación Express | `const app = express()` |
| Interpretar el body JSON de las peticiones | `app.use(express.json())` |
| Leer datos de la URL (`/productos/:id`) | `req.params` |
| Leer datos de la query string (`?categoria=x`) | `req.query` |
| Responder con el código de estado correcto | `res.status(codigo).json(datos)` |

## 6.11 Errores Comunes

- **Olvidar `express.json()`**: `req.body` llega `undefined` en cualquier petición con cuerpo JSON, un error muy común al empezar.
- **Devolver siempre `200` sin importar el resultado real**: dificulta que el cliente (frontend) maneje correctamente casos de error sin tener que inspeccionar el contenido específico de cada respuesta.
- **No tipar `Request`/`Response` explícitamente**: pierde autocompletado y validación de tipos en `req.params`/`req.body`, aumentando el riesgo de errores de tipeo no detectados.
