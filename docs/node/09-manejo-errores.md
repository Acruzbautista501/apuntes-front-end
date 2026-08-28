# Módulo 9: Manejo de Errores Centralizado

Manejar errores con `try`/`catch` dispersos en cada controlador, cada uno formateando la respuesta de error a su manera, produce una API inconsistente y propensa a fugas de información sensible. Este módulo cubre el patrón estándar de Express para centralizar el manejo de errores en un solo lugar.

## 9.1 El Problema de Manejar Errores por Todos Lados

```typescript
// ❌ Cada controlador maneja errores a su manera, sin consistencia
router.get('/:id', async (req, res) => {
  try {
    const producto = await buscarProducto(req.params.id)
    if (!producto) return res.status(404).json({ mensaje: 'No existe' }) // Formato distinto
    res.json(producto)
  } catch (error) {
    res.status(500).json({ err: 'Algo salió mal' }) // Formato distinto, y expone menos/más información inconsistentemente
  }
})
```

## 9.2 Clases de Error Personalizadas

```typescript
// src/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public mensaje: string,
    public statusCode: number = 500
  ) {
    super(mensaje)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends AppError {
  constructor(mensaje = 'Recurso no encontrado') {
    super(mensaje, 404)
  }
}

export class ValidationError extends AppError {
  constructor(mensaje = 'Datos inválidos') {
    super(mensaje, 400)
  }
}

export class UnauthorizedError extends AppError {
  constructor(mensaje = 'No autenticado') {
    super(mensaje, 401)
  }
}
```

Cada tipo de error de negocio tiene su propia clase con el `statusCode` HTTP correspondiente ya incorporado — el controlador simplemente lanza el error correcto, sin preocuparse por el formato de la respuesta.

## 9.3 Middleware de Manejo de Errores Centralizado

En Express, un middleware con **cuatro parámetros** (`error, req, res, next`) es tratado especialmente: solo se ejecuta cuando algo llama a `next(error)`, o cuando una excepción se lanza dentro de una ruta `async` (con Express 5, o usando un wrapper en Express 4, ver 9.5).

```typescript
// src/middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError.js'

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.mensaje })
  }

  console.error('Error no controlado:', error) // Registrar siempre errores inesperados (Módulo 24)

  res.status(500).json({ error: 'Error interno del servidor' }) // Nunca exponer detalles internos al cliente
}
```

```typescript
// src/app.ts — SIEMPRE al final, después de todas las rutas
app.use('/api/productos', productosRouter)
app.use(errorHandler)
```

El middleware de manejo de errores debe registrarse **después** de todas las rutas — Express lo reconoce automáticamente por tener 4 parámetros, y lo invoca cuando cualquier ruta anterior llama a `next(error)`.

## 9.4 Lanzar Errores desde un Controlador

```typescript
import { NotFoundError } from '../errors/AppError.js'

export async function obtenerProducto(req: Request, res: Response, next: NextFunction) {
  try {
    const producto = await buscarProductoPorId(req.params.id)

    if (!producto) {
      throw new NotFoundError('El producto solicitado no existe')
    }

    res.json(producto)
  } catch (error) {
    next(error) // Delega el error al middleware centralizado
  }
}
```

## 9.5 Evitar `try`/`catch` Repetido con un Wrapper Async

```typescript
// src/utils/asyncHandler.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express'

export function asyncHandler(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next) // Captura cualquier error y lo pasa a next()
  }
}
```

```typescript
import { asyncHandler } from '../utils/asyncHandler.js'

export const obtenerProducto = asyncHandler(async (req, res) => {
  const producto = await buscarProductoPorId(req.params.id)
  if (!producto) throw new NotFoundError()
  res.json(producto)
  // Sin try/catch manual — cualquier error se captura y se envía automáticamente al errorHandler
})
```

Este wrapper elimina la necesidad de repetir `try`/`catch` en cada controlador async — cualquier promesa rechazada dentro de la función se captura automáticamente y se reenvía al middleware de errores centralizado.

## 9.6 Ruta 404 — Recursos que No Existen en Absoluto

```typescript
// Después de todas las rutas definidas, antes del errorHandler
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
})

app.use(errorHandler)
```

Distinto del `NotFoundError` (9.2), que representa un **recurso específico** que no existe (`/productos/999`); este middleware captura peticiones a rutas que **no existen en absoluto** en la API (`/ruta-que-nunca-se-definio`).

## 9.7 Capturar Errores No Manejados a Nivel de Proceso

```typescript
// src/index.ts
process.on('uncaughtException', (error) => {
  console.error('Excepción no capturada:', error)
  process.exit(1) // Terminar el proceso — un estado inconsistente es peligroso para continuar
})

process.on('unhandledRejection', (razon) => {
  console.error('Promesa rechazada sin manejar:', razon)
  process.exit(1)
})
```

Estos son la última línea de defensa — errores que escaparon completamente del manejo normal de Express. En producción, siempre deben combinarse con un gestor de procesos (PM2, Docker con reinicio automático, retomado en el Módulo 22) que reinicie el servidor automáticamente tras un cierre inesperado.

## 9.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Errores de negocio con su código HTTP correspondiente | Clases personalizadas extendiendo `AppError` |
| Un único lugar que formatee todas las respuestas de error | Un middleware con 4 parámetros al final de `app.ts` |
| Evitar `try`/`catch` repetido en cada controlador async | Un wrapper `asyncHandler` |
| Manejar rutas completamente inexistentes | Un middleware 404 antes del `errorHandler` |
| La última línea de defensa contra errores no capturados | `process.on('uncaughtException'/'unhandledRejection')` |

## 9.9 Errores Comunes

- **Exponer el mensaje de error interno completo al cliente**: puede filtrar detalles de implementación (rutas de archivos, estructura de base de datos) útiles para un atacante — siempre distinguir entre errores esperados (con mensaje seguro) y errores inesperados (mensaje genérico, detalle solo en logs del servidor).
- **Olvidar registrar el middleware de errores al final, después de todas las rutas**: Express no lo reconocerá como manejador de errores si se registra antes de las rutas que debería capturar.
- **No terminar el proceso tras una excepción realmente no capturada**: continuar ejecutando en un estado potencialmente corrupto es más peligroso que reiniciar limpiamente con la ayuda de un gestor de procesos.
