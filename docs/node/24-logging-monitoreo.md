# Módulo 24: Logging, Monitoreo y Observabilidad

Una API en producción sin logging estructurado ni monitoreo es una caja negra — cuando algo falla, no hay forma de saber qué ocurrió sin poder reproducirlo manualmente. Este módulo cubre cómo instrumentar una API Node.js para tener visibilidad real de su comportamiento en producción.

## 24.1 Por Qué `console.log` No es Suficiente en Producción

```typescript
// ❌ Sin estructura, sin nivel de severidad, sin contexto adicional
console.log('Usuario creado', usuario.email)
console.log('Error al procesar el pedido', error)
```

`console.log` funciona en desarrollo, pero en producción los logs se pierden (o se vuelven imposibles de buscar) sin: niveles de severidad (info/warning/error), formato estructurado (JSON, para poder consultarlo), y timestamps consistentes.

## 24.2 Logging Estructurado con Pino

```bash
npm install pino pino-http
```

```typescript
// src/config/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty' } // Formato legible en desarrollo
    : undefined                  // JSON puro en producción, ideal para sistemas de análisis de logs
})
```

```typescript
logger.info({ usuarioId: usuario.id }, 'Usuario registrado exitosamente')
logger.warn({ intento: 3 }, 'Múltiples intentos de login fallidos')
logger.error({ error, pedidoId }, 'Error al procesar el pago del pedido')
```

**Pino** es uno de los loggers más rápidos del ecosistema Node.js — genera logs en JSON estructurado por defecto, fácilmente consultables por herramientas de análisis de logs (24.6), a diferencia del texto plano de `console.log`.

## 24.3 Logging de Peticiones HTTP Automático

```typescript
import pinoHttp from 'pino-http'
import { logger } from './config/logger.js'

app.use(pinoHttp({ logger }))
```

Esto registra automáticamente cada petición HTTP (método, ruta, código de estado, tiempo de respuesta) sin necesitar loguear manualmente en cada controlador — una vista completa del tráfico real de la API.

## 24.4 Niveles de Log y Cuándo Usarlos

| Nivel | Cuándo usarlo |
| :--- | :--- |
| `debug` | Información detallada útil solo durante desarrollo activo |
| `info` | Eventos normales de negocio significativos (usuario creado, pedido completado) |
| `warn` | Algo inesperado pero no crítico (un reintento, un límite cercano a alcanzarse) |
| `error` | Un error que impidió completar una operación, requiere atención |
| `fatal` | Un error crítico que puede requerir terminar el proceso |

## 24.5 Nunca Loguear Información Sensible

```typescript
// ❌ Expone la contraseña y el token completo en los logs
logger.info({ email: usuario.email, password: req.body.password }, 'Login')

// ✅ Solo información no sensible necesaria para diagnóstico
logger.info({ email: usuario.email }, 'Intento de login')
```

Contraseñas, tokens completos, números de tarjeta de crédito — nada de esto debe aparecer en los logs, incluso en logs de error, ya que los sistemas de logging suelen tener retención larga y acceso más amplio que la propia base de datos de producción.

## 24.6 Agregación de Logs en Producción

En producción, los logs no deben quedarse solo en la consola del servidor — se envían a un servicio centralizado donde pueden buscarse, filtrarse y alertar automáticamente.

```text
Opciones comunes:
- Datadog, New Relic: plataformas completas de observabilidad (logs + métricas + traces)
- Better Stack (antes Logtail), Papertrail: especializados en agregación de logs, más simples
- La plataforma de hosting elegida (Módulo 23) a menudo incluye agregación de logs básica integrada
```

## 24.7 Monitoreo de Errores con Sentry

```bash
npm install @sentry/node
```

```typescript
// src/index.ts
import * as Sentry from '@sentry/node'

Sentry.init({ dsn: process.env.SENTRY_DSN })

app.use(Sentry.Handlers.requestHandler())
// ... rutas ...
app.use(Sentry.Handlers.errorHandler()) // Antes del errorHandler propio del Módulo 9
```

Sentry captura automáticamente excepciones no manejadas, con el stack trace completo, el contexto de la petición que la causó, y agrupa errores similares — mucho más útil que revisar logs manualmente para detectar patrones de fallos recurrentes.

## 24.8 Health Checks — Verificar que el Servicio Está Vivo

```typescript
router.get('/health', async (req, res) => {
  const estadoMongo = mongoose.connection.readyState === 1 ? 'ok' : 'error'
  const estadoRedis = await redis.ping().then(() => 'ok').catch(() => 'error')

  const saludable = estadoMongo === 'ok' && estadoRedis === 'ok'

  res.status(saludable ? 200 : 503).json({
    estado: saludable ? 'ok' : 'degradado',
    mongo: estadoMongo,
    redis: estadoRedis
  })
})
```

Un endpoint `/health` es usado por sistemas de orquestación (balanceadores de carga, Kubernetes, la plataforma de hosting del Módulo 23) para determinar si una instancia del servicio está funcionando correctamente antes de enviarle tráfico — o para reiniciarla automáticamente si deja de responder correctamente.

## 24.9 Métricas Básicas

```typescript
import client from 'prom-client'

const contadorPeticiones = new client.Counter({
  name: 'http_peticiones_total',
  help: 'Total de peticiones HTTP recibidas',
  labelNames: ['metodo', 'ruta', 'codigo']
})

app.use((req, res, next) => {
  res.on('finish', () => {
    contadorPeticiones.inc({ metodo: req.method, ruta: req.path, codigo: res.statusCode })
  })
  next()
})

app.get('/metricas', async (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.send(await client.register.metrics())
})
```

`prom-client` expone métricas en el formato que **Prometheus** (una herramienta estándar de monitoreo) puede consultar periódicamente — permitiendo construir dashboards de tendencias (peticiones por minuto, tasa de errores) más allá de logs individuales.

## 24.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Logs estructurados y con niveles de severidad | Pino |
| Registrar automáticamente cada petición HTTP | `pino-http` |
| Capturar y agrupar excepciones no manejadas | Sentry |
| Que un orquestador verifique el estado del servicio | Un endpoint `/health` |
| Métricas cuantitativas de tráfico y rendimiento | `prom-client` + Prometheus |

## 24.11 Errores Comunes

- **Usar `console.log` como única estrategia de logging en producción**: sin estructura ni niveles, se vuelve inutilizable a cualquier escala real de tráfico.
- **Loguear contraseñas, tokens o datos sensibles**: expone información crítica en un sistema con retención larga y a menudo con más personas con acceso que la propia base de datos.
- **No tener ningún endpoint de health check**: dificulta que sistemas automatizados (o incluso el propio equipo) detecten rápidamente que el servicio dejó de responder correctamente.
