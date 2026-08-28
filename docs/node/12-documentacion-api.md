# Módulo 12: Documentación de API con OpenAPI/Swagger

Una API sin documentación obliga a cualquier consumidor (un compañero de frontend, un cliente externo, tu propio yo del futuro) a leer el código fuente completo para entender qué endpoints existen y qué esperan recibir. **OpenAPI** (el estándar, antes llamado Swagger) resuelve esto con una especificación machine-readable que además genera documentación interactiva navegable.

## 12.1 Qué es OpenAPI

OpenAPI es una especificación (en YAML o JSON) que describe formalmente cada endpoint de una API: su ruta, método, parámetros esperados, formato del cuerpo de la petición, y las posibles respuestas. **Swagger UI** es la herramienta más común para renderizar esa especificación como una página web interactiva, donde se puede incluso probar la API directamente desde el navegador.

## 12.2 Instalación

```bash
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

## 12.3 Configuración Base

```typescript
// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Productos',
      version: '1.0.0',
      description: 'Documentación de la API REST de productos'
    },
    servers: [{ url: 'http://localhost:3000/api' }]
  },
  apis: ['./src/routes/*.ts'] // Archivos donde buscar comentarios de documentación
})
```

```typescript
// src/app.ts
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
```

Con esto, visitar `http://localhost:3000/api-docs` muestra la documentación interactiva generada.

## 12.4 Documentar un Endpoint con Comentarios JSDoc

```typescript
/**
 * @openapi
 * /productos:
 *   get:
 *     summary: Lista todos los productos
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtra por categoría
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 */
router.get('/', listarProductos)
```

Este comentario, colocado directamente encima de la ruta, es exactamente lo que `swaggerJsdoc` escanea (según la ruta configurada en `apis`, 12.3) para construir la especificación completa — la documentación vive junto al código que describe, reduciendo el riesgo de que se desactualice.

## 12.5 Documentar el Cuerpo de una Petición (POST/PUT)

```typescript
/**
 * @openapi
 * /productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, precio]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Teclado mecánico
 *               precio:
 *                 type: number
 *                 example: 89.99
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validar(esquemaCrearProducto), crearProducto)
```

## 12.6 Esquemas Reutilizables (`components`)

```typescript
// src/config/swagger.ts
export const swaggerSpec = swaggerJsdoc({
  definition: {
    // ...
    components: {
      schemas: {
        Producto: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nombre: { type: 'string' },
            precio: { type: 'number' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
})
```

```typescript
/**
 * @openapi
 * /productos/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 */
```

`$ref` reutiliza la definición del esquema `Producto` en cualquier endpoint que lo necesite, evitando repetir la misma estructura en cada ruta — el mismo principio de reutilización cubierto en Zod (Módulo 8) aplicado a la documentación.

## 12.7 Generar Esquemas OpenAPI Directamente desde Zod

Mantener manualmente la especificación OpenAPI sincronizada con los esquemas Zod reales del Módulo 8 es propenso a desincronizarse. `zod-to-openapi` genera automáticamente el esquema de documentación a partir del esquema Zod ya existente.

```bash
npm install @asteasolutions/zod-to-openapi
```

```typescript
import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

const esquemaProducto = z.object({
  nombre: z.string().openapi({ example: 'Teclado mecánico' }),
  precio: z.number().positive().openapi({ example: 89.99 })
}).openapi('Producto')
```

Este enfoque es preferible en proyectos con muchos endpoints — un único cambio en el esquema Zod se refleja automáticamente tanto en la validación real (Módulo 8) como en la documentación, sin mantener dos fuentes de verdad separadas.

## 12.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Documentación interactiva navegable de la API | Swagger UI (`/api-docs`) |
| Describir un endpoint específico | Comentarios `@openapi` sobre la ruta correspondiente |
| Reutilizar la definición de un objeto entre varios endpoints | `components.schemas` + `$ref` |
| Documentar que un endpoint requiere autenticación | `security: [{ bearerAuth: [] }]` |
| Evitar mantener Zod y OpenAPI como dos fuentes separadas | `zod-to-openapi` |

## 12.9 Errores Comunes

- **Dejar la documentación desactualizada respecto al código real**: una documentación incorrecta es peor que ninguna documentación — genera confianza falsa en consumidores de la API.
- **No documentar los códigos de error posibles de cada endpoint**: obliga a quien consume la API a descubrir por prueba y error qué errores puede recibir.
- **Exponer `/api-docs` públicamente en producción sin restricción**: puede revelar la estructura completa de la API (incluyendo endpoints administrativos) a cualquiera — considera protegerla o deshabilitarla fuera de entornos de desarrollo/staging.
