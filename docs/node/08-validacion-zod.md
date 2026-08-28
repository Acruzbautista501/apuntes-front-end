# Módulo 8: Validación de Datos con Zod

Nunca se debe confiar en los datos que llegan del cliente — un campo requerido puede faltar, un número puede llegar como texto, o el cliente puede simplemente enviar datos maliciosos. **Zod** (ya usado en la sección de React de este sitio, en el contexto de React Hook Form) es la librería estándar del ecosistema Node.js/TypeScript para validar datos externos con esquemas tipados.

## 8.1 El Problema sin Validación

```typescript
router.post('/productos', (req, res) => {
  const { nombre, precio } = req.body

  // Sin validación: ¿qué pasa si "nombre" no existe, o "precio" es un string, o negativo?
  crearProducto({ nombre, precio })

  res.status(201).json({ mensaje: 'Creado' })
})
```

Sin validación explícita, datos malformados llegan directamente a la lógica de negocio y a la base de datos, causando errores confusos más adelante en el flujo (o, peor, datos corruptos guardados silenciosamente).

## 8.2 Instalación y Esquema Básico

```bash
npm install zod
```

```typescript
import { z } from 'zod'

const esquemaProducto = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  precio: z.number().positive('El precio debe ser mayor a cero'),
  categoria: z.enum(['electronica', 'ropa', 'hogar']),
  descripcion: z.string().optional()
})

type Producto = z.infer<typeof esquemaProducto> // El tipo TypeScript se deriva automáticamente del esquema
```

## 8.3 Validar en un Middleware Reutilizable

```typescript
// src/middlewares/validar.ts
import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export function validar(esquema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = esquema.safeParse(req.body)

    if (!resultado.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: resultado.error.flatten().fieldErrors
      })
    }

    req.body = resultado.data // Reemplaza req.body con los datos ya validados y tipados
    next()
  }
}
```

```typescript
// src/routes/productos.routes.ts
import { validar } from '../middlewares/validar.js'
import { esquemaProducto } from '../schemas/producto.schema.js'

router.post('/', validar(esquemaProducto), crearProducto)
```

`safeParse` (en lugar de `parse`) devuelve un resultado que indica éxito/fallo sin lanzar una excepción — más apropiado dentro de un middleware, donde se necesita controlar exactamente cómo responder ante datos inválidos.

## 8.4 Validar Parámetros de Ruta y Query

```typescript
const esquemaIdParametro = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de MongoDB inválido') // Anticipo del Módulo 13
})

const esquemaQueryProductos = z.object({
  categoria: z.enum(['electronica', 'ropa', 'hogar']).optional(),
  pagina: z.coerce.number().int().positive().default(1), // coerce convierte el string de la query a número
  limite: z.coerce.number().int().positive().max(100).default(20)
})
```

```typescript
export function validarQuery(esquema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = esquema.safeParse(req.query)
    if (!resultado.success) {
      return res.status(400).json({ error: 'Query inválida', detalles: resultado.error.flatten().fieldErrors })
    }
    req.query = resultado.data as any
    next()
  }
}
```

`z.coerce.number()` es especialmente importante para query strings: `req.query` siempre llega como texto (el mismo comportamiento visto en las secciones de frontend), así que `coerce` convierte automáticamente antes de validar el rango numérico.

## 8.5 Esquemas Anidados y Arrays

```typescript
const esquemaDireccion = z.object({
  calle: z.string(),
  ciudad: z.string(),
  codigoPostal: z.string().length(5)
})

const esquemaPedido = z.object({
  items: z.array(z.object({
    productoId: z.string(),
    cantidad: z.number().int().positive()
  })).min(1, 'El pedido debe tener al menos un producto'),
  direccionEnvio: esquemaDireccion
})
```

## 8.6 Mensajes de Error Personalizados y Estructurados

```typescript
const resultado = esquemaProducto.safeParse(req.body)

if (!resultado.success) {
  const errores = resultado.error.issues.map((issue) => ({
    campo: issue.path.join('.'),
    mensaje: issue.message
  }))

  return res.status(400).json({ error: 'Datos inválidos', errores })
}
```

```json
{
  "error": "Datos inválidos",
  "errores": [
    { "campo": "precio", "mensaje": "El precio debe ser mayor a cero" },
    { "campo": "categoria", "mensaje": "Invalid enum value" }
  ]
}
```

Un formato de error consistente y estructurado facilita enormemente que el frontend (Vue.js/React, secciones ya cubiertas en este sitio) muestre los errores específicos junto a cada campo del formulario correspondiente.

## 8.7 Reutilizar Esquemas entre Validación y Tipos

```typescript
// src/schemas/producto.schema.ts
import { z } from 'zod'

export const esquemaCrearProducto = z.object({
  nombre: z.string().min(2),
  precio: z.number().positive()
})

export const esquemaActualizarProducto = esquemaCrearProducto.partial() // Todos los campos opcionales, para PATCH

export type CrearProductoDTO = z.infer<typeof esquemaCrearProducto>
export type ActualizarProductoDTO = z.infer<typeof esquemaActualizarProducto>
```

`.partial()` genera automáticamente una variante del esquema con todos los campos opcionales — perfecto para endpoints `PATCH` donde el cliente solo envía los campos que quiere modificar, sin duplicar la definición completa del esquema.

## 8.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Validar el body de una petición | `z.object({...})` + `safeParse()` en un middleware |
| Convertir query strings a números antes de validar | `z.coerce.number()` |
| Un esquema con todos los campos opcionales (para PATCH) | `.partial()` sobre un esquema existente |
| El tipo TypeScript derivado de un esquema | `z.infer<typeof esquema>` |
| Errores estructurados por campo | `resultado.error.flatten().fieldErrors` o `.issues` |

## 8.9 Errores Comunes

- **Confiar en los tipos de TypeScript como si validaran datos en tiempo de ejecución**: TypeScript se elimina completamente al compilar — no valida absolutamente nada sobre los datos reales que llegan de una petición HTTP en producción.
- **Usar `parse()` en lugar de `safeParse()` sin un `try`/`catch`**: `parse()` lanza una excepción ante datos inválidos, que debe manejarse explícitamente o terminará como un error 500 genérico y poco informativo.
- **Duplicar la definición de tipos e interfaces por separado del esquema Zod**: usa `z.infer` para derivar el tipo directamente del esquema, evitando que ambos se desincronicen con el tiempo.
