# Módulo 7: Rutas, Middlewares y Controladores

El Módulo 6 mostró rutas básicas directamente en `app.get()`. Un proyecto real necesita organizar esas rutas, y entender **middlewares** a fondo — el mecanismo central de Express para ejecutar lógica antes (o después) de que una petición llegue a su destino final.

## 7.1 ¿Qué es un Middleware?

Un middleware es una función con acceso a `req`, `res`, y una tercera función `next()` — se ejecuta **en medio** del camino entre la petición entrante y la respuesta final, y decide si continuar la cadena (`next()`) o responder directamente.

```typescript
import type { Request, Response, NextFunction } from 'express'

function miMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.url}`)
  next() // Sin esto, la petición se queda "colgada" — nunca llega a la siguiente función
}

app.use(miMiddleware)
```

Cada petición pasa por una **cadena** de middlewares en el orden en que se registraron — cada uno decide si la petición continúa hacia el siguiente, o si se detiene ahí (por ejemplo, respondiendo un error de autenticación).

## 7.2 Middlewares Integrados Comunes

```typescript
import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())           // Parsea el body JSON (Módulo 6)
app.use(express.urlencoded({ extended: true })) // Parsea datos de formularios HTML
app.use(cors())                    // Habilita peticiones desde otros orígenes (frontend en otro dominio/puerto)
```

`cors()` (paquete separado, `npm install cors`) es esencial en cualquier API consumida por un frontend en un dominio o puerto distinto — sin él, el navegador bloquea las peticiones por la política de mismo origen.

## 7.3 `express.Router()` — Organizar Rutas en Módulos

```typescript
// src/routes/productos.routes.ts
import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ mensaje: 'Lista de productos' })
})

router.get('/:id', (req, res) => {
  res.json({ mensaje: `Producto ${req.params.id}` })
})

router.post('/', (req, res) => {
  res.status(201).json({ mensaje: 'Producto creado' })
})

export default router
```

```typescript
// src/app.ts
import express from 'express'
import productosRouter from './routes/productos.routes.js'

const app = express()
app.use(express.json())

app.use('/api/productos', productosRouter) // Todas las rutas del router se prefijan con /api/productos

export default app
```

`Router()` crea un "mini-servidor Express" independiente, montado sobre un prefijo específico — así `router.get('/:id')` se convierte automáticamente en `GET /api/productos/:id` sin repetir el prefijo en cada ruta individual.

## 7.4 Separar Controladores de las Rutas

```typescript
// src/controllers/productos.controller.ts
import type { Request, Response } from 'express'

export function listarProductos(req: Request, res: Response) {
  res.json({ mensaje: 'Lista de productos' })
}

export function obtenerProducto(req: Request, res: Response) {
  res.json({ mensaje: `Producto ${req.params.id}` })
}

export function crearProducto(req: Request, res: Response) {
  res.status(201).json({ mensaje: 'Producto creado', datos: req.body })
}
```

```typescript
// src/routes/productos.routes.ts
import { Router } from 'express'
import { listarProductos, obtenerProducto, crearProducto } from '../controllers/productos.controller.js'

const router = Router()

router.get('/', listarProductos)
router.get('/:id', obtenerProducto)
router.post('/', crearProducto)

export default router
```

Este patrón — rutas que solo mapean URL+método a una función, y controladores que contienen la lógica real — es el primer paso hacia la arquitectura en capas completa del Módulo 10.

## 7.5 Middlewares con Parámetros (Middleware Factories)

```typescript
function verificarRol(rolRequerido: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const rolUsuario = req.headers['x-rol'] // Simplificado; en la práctica vendría de autenticación real (Módulo 11)

    if (rolUsuario !== rolRequerido) {
      return res.status(403).json({ error: 'No tienes permiso para esta acción' })
    }

    next()
  }
}

router.delete('/:id', verificarRol('admin'), eliminarProducto)
```

Una función que **devuelve** un middleware (en lugar de ser el middleware directamente) permite configurarlo con parámetros específicos por ruta — un patrón extremadamente común para autorización, validación, y limitación de tasa (Módulo 21).

## 7.6 Middlewares Aplicados a Rutas Específicas vs Globales

```typescript
// Global: se ejecuta en TODAS las rutas de la app
app.use(loggerMiddleware)

// Específico de un router: se ejecuta solo en las rutas de ese router
router.use(verificarAutenticacion)

// Específico de una sola ruta: se ejecuta solo ahí
router.get('/admin', verificarRol('admin'), listarTodosLosUsuarios)
```

## 7.7 Orden de los Middlewares — Importa Mucho

```typescript
// ❌ El middleware de autenticación se registra DESPUÉS de las rutas que debería proteger
app.use('/api/productos', productosRouter)
app.use(verificarAutenticacion)

// ✅ Los middlewares deben registrarse ANTES de las rutas que dependen de ellos
app.use(verificarAutenticacion)
app.use('/api/productos', productosRouter)
```

Express ejecuta middlewares y rutas **en el orden exacto en que se registran** — un middleware de autenticación registrado después de las rutas que debería proteger simplemente nunca se ejecuta para esas rutas.

## 7.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ejecutar lógica antes de que una petición llegue a su ruta | Un middleware con `(req, res, next)` |
| Organizar rutas relacionadas en un archivo separado | `express.Router()` |
| Separar la lógica de negocio de la definición de rutas | Controladores en archivos independientes |
| Un middleware configurable con parámetros | Una función que devuelve el middleware (middleware factory) |
| Habilitar peticiones desde otro origen (frontend) | El middleware `cors()` |

## 7.9 Errores Comunes

- **Olvidar llamar a `next()` dentro de un middleware**: la petición se queda colgada indefinidamente, sin nunca llegar a la ruta ni a otros middlewares posteriores.
- **Registrar middlewares de autenticación/validación después de las rutas que deberían proteger**: el orden de registro determina el orden de ejecución — un middleware fuera de orden simplemente no protege nada.
- **Poner toda la lógica de negocio directamente en las rutas**: dificulta el testing (Módulo 17) y la reutilización — separar en controladores (y más adelante en servicios, Módulo 10) es una inversión que se paga rápidamente en proyectos que crecen.
