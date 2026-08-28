# Módulo 20: Caché con Redis

El Módulo 19 usó Redis como backend de colas de trabajo. Este módulo cubre su uso más común: **caché** — guardar temporalmente el resultado de operaciones costosas (consultas complejas de MongoDB, cálculos pesados, respuestas de APIs externas) para no repetirlas innecesariamente en cada petición.

## 20.1 Por Qué Cachear

```typescript
// Sin caché: cada petición ejecuta la agregación completa (Módulo 15) desde cero
router.get('/reportes/ventas', async (req, res) => {
  const reporte = await calcularReporteVentasComplejo() // Puede tardar varios segundos
  res.json(reporte)
})
```

Si ese reporte no cambia con cada petición (por ejemplo, se actualiza solo una vez por hora), recalcularlo en cada visita desperdicia recursos del servidor y hace esperar innecesariamente a cada usuario que lo consulta.

## 20.2 Instalación

```bash
npm install ioredis
```

```typescript
// src/config/redis.ts
import Redis from 'ioredis'

export const redis = new Redis({ host: 'localhost', port: 6379 })
```

## 20.3 Operaciones Básicas de Redis

```typescript
// Guardar un valor con expiración (TTL — Time To Live)
await redis.set('clave', 'valor', 'EX', 3600) // Expira en 3600 segundos (1 hora)

// Leer un valor
const valor = await redis.get('clave') // null si no existe o ya expiró

// Eliminar una clave manualmente
await redis.del('clave')

// Guardar/leer objetos (Redis solo almacena strings, hay que serializar)
await redis.set('usuario:1', JSON.stringify({ nombre: 'Alex' }), 'EX', 3600)
const usuario = JSON.parse((await redis.get('usuario:1')) ?? '{}')
```

## 20.4 Patrón Cache-Aside — El Más Común

```typescript
async function obtenerReporteVentas() {
  const clave = 'reporte:ventas'

  const cacheado = await redis.get(clave)
  if (cacheado) {
    return JSON.parse(cacheado) // Cache hit: devuelve el resultado guardado, sin recalcular
  }

  const reporte = await calcularReporteVentasComplejo() // Cache miss: calcula y guarda para la próxima vez
  await redis.set(clave, JSON.stringify(reporte), 'EX', 3600)

  return reporte
}
```

Este patrón ("primero revisa la caché; si no está, calcula y guarda") se llama *cache-aside* y es, con diferencia, el patrón de caché más usado en aplicaciones backend.

## 20.5 Middleware de Caché Reutilizable para Rutas GET

```typescript
// src/middlewares/cache.ts
import type { Request, Response, NextFunction } from 'express'
import { redis } from '../config/redis.js'

export function cachearRespuesta(segundosTTL: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const clave = `cache:${req.originalUrl}`
    const cacheado = await redis.get(clave)

    if (cacheado) {
      return res.json(JSON.parse(cacheado))
    }

    const jsonOriginal = res.json.bind(res)
    res.json = (datos) => {
      redis.set(clave, JSON.stringify(datos), 'EX', segundosTTL) // Guarda antes de responder
      return jsonOriginal(datos)
    }

    next()
  }
}
```

```typescript
router.get('/productos', cachearRespuesta(300), listarProductos) // Cachea la respuesta por 5 minutos
```

## 20.6 Invalidar la Caché al Modificar Datos

```typescript
export async function actualizarProducto(id: string, datos: ActualizarProductoDTO) {
  const producto = await productoRepository.actualizar(id, datos)

  await redis.del(`cache:/api/productos`)        // Invalida la lista completa
  await redis.del(`cache:/api/productos/${id}`)   // Invalida el detalle específico

  return producto
}
```

El problema más difícil de cualquier sistema de caché no es guardar los datos — es **saber cuándo invalidarlos**. Si un producto se actualiza pero la caché de la lista de productos no se invalida, los usuarios seguirán viendo datos obsoletos hasta que el TTL expire naturalmente.

## 20.7 Elegir un TTL Apropiado

| Tipo de dato | TTL sugerido |
| :--- | :--- |
| Datos que cambian raramente (catálogo de categorías) | Horas o incluso días |
| Datos que cambian con frecuencia moderada (lista de productos) | Minutos |
| Datos casi en tiempo real (stock disponible, precios dinámicos) | Segundos, o evitar cachear directamente |
| Datos específicos de un usuario autenticado | TTL corto + invalidación explícita al modificar |

## 20.8 Rate Limiting con Redis (Anticipo del Módulo 21)

```typescript
async function limitarPeticiones(ip: string, limite: number, ventanaSegundos: number): Promise<boolean> {
  const clave = `rate-limit:${ip}`
  const conteo = await redis.incr(clave) // Incrementa atómicamente

  if (conteo === 1) {
    await redis.expire(clave, ventanaSegundos) // Solo establece expiración en el primer incremento
  }

  return conteo <= limite
}
```

Redis es también la base de datos estándar detrás de la mayoría de implementaciones de *rate limiting* (limitación de tasa de peticiones), gracias a su velocidad y a operaciones atómicas como `INCR` — se retoma en el Módulo 21.

## 20.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Guardar un resultado costoso temporalmente | `redis.set(clave, valor, 'EX', segundos)` |
| Evitar recalcular si el dato ya está en caché | El patrón cache-aside |
| Cachear automáticamente respuestas de endpoints GET | Un middleware de caché reutilizable |
| Que los datos cacheados no queden obsoletos tras una actualización | Invalidar explícitamente al modificar (`redis.del`) |
| Contadores atómicos (rate limiting, contadores de visitas) | `redis.incr()` |

## 20.10 Errores Comunes

- **Cachear datos sin invalidarlos al modificarse**: los usuarios ven información obsoleta hasta que el TTL expira naturalmente, generando confusión o incluso decisiones erróneas basadas en datos incorrectos.
- **Cachear datos específicos de un usuario con una clave genérica compartida**: puede filtrar los datos de un usuario a otro si la clave no incluye un identificador único por usuario.
- **Elegir un TTL demasiado largo para datos que cambian con frecuencia**: los usuarios ven información desactualizada por más tiempo del razonable — ajusta el TTL a la frecuencia real de cambio del dato específico.
