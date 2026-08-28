# Módulo 19: Colas de Trabajo con BullMQ + Redis

Algunas tareas (enviar un correo, procesar una imagen, generar un reporte pesado) son demasiado lentas para ejecutarse directamente dentro de una petición HTTP — el cliente quedaría esperando varios segundos innecesariamente. Este módulo cubre las **colas de trabajo**, el patrón estándar para delegar ese procesamiento a segundo plano.

## 19.1 El Problema: Tareas Lentas Bloqueando la Respuesta

```typescript
// ❌ El cliente espera hasta que el correo termine de enviarse (puede tardar segundos)
router.post('/registro', async (req, res) => {
  const usuario = await crearUsuario(req.body)
  await enviarCorreoBienvenida(usuario.email) // Bloquea la respuesta innecesariamente
  res.status(201).json(usuario)
})
```

```typescript
// ✅ La tarea se encola y se procesa en segundo plano; el cliente recibe respuesta inmediata
router.post('/registro', async (req, res) => {
  const usuario = await crearUsuario(req.body)
  await colaCorreos.add('bienvenida', { email: usuario.email }) // No espera a que el correo se envíe realmente
  res.status(201).json(usuario)
})
```

## 19.2 ¿Qué es Redis y Por Qué lo Necesita BullMQ?

**Redis** es una base de datos en memoria extremadamente rápida, usada tanto para colas de trabajo (este módulo) como para caché (Módulo 20). BullMQ usa Redis internamente para **persistir** el estado de la cola — si el servidor se reinicia, los trabajos pendientes no se pierden porque viven en Redis, no en la memoria del proceso de Node.

```bash
# Instalación local de Redis (o usar un servicio gestionado como Redis Cloud/Upstash)
docker run -d -p 6379:6379 redis
```

## 19.3 Instalación de BullMQ

```bash
npm install bullmq
```

## 19.4 Crear una Cola

```typescript
// src/queues/correo.queue.ts
import { Queue } from 'bullmq'

export const colaCorreos = new Queue('correos', {
  connection: { host: 'localhost', port: 6379 }
})
```

```typescript
// src/services/registro.service.ts
import { colaCorreos } from '../queues/correo.queue.js'

export async function registrarUsuario(datos: RegistroDTO) {
  const usuario = await usuarioRepository.crear(datos)

  await colaCorreos.add('bienvenida', { email: usuario.email, nombre: usuario.nombre })

  return usuario
}
```

`colaCorreos.add()` agrega un trabajo a la cola de forma prácticamente instantánea — el envío real del correo ocurre después, de forma completamente desacoplada de la petición HTTP original.

## 19.5 Crear un Worker — El Proceso que Ejecuta los Trabajos

```typescript
// src/workers/correo.worker.ts
import { Worker } from 'bullmq'
import { enviarCorreoBienvenida } from '../services/correo.service.js'

const worker = new Worker(
  'correos',
  async (job) => {
    if (job.name === 'bienvenida') {
      await enviarCorreoBienvenida(job.data.email, job.data.nombre)
    }
  },
  { connection: { host: 'localhost', port: 6379 } }
)

worker.on('completed', (job) => {
  console.log(`Trabajo ${job.id} completado`)
})

worker.on('failed', (job, error) => {
  console.error(`Trabajo ${job?.id} falló:`, error)
})
```

El **worker** es un proceso separado (puede correr en el mismo servidor, o en uno completamente distinto) que escucha la cola y ejecuta cada trabajo — la separación entre "agregar a la cola" (rápido, dentro de la petición HTTP) y "procesar el trabajo" (lento, en el worker) es la esencia del patrón.

## 19.6 Reintentos Automáticos

```typescript
await colaCorreos.add(
  'bienvenida',
  { email: usuario.email },
  {
    attempts: 3,                          // Reintentar hasta 3 veces si falla
    backoff: { type: 'exponential', delay: 5000 } // Espera creciente entre reintentos
  }
)
```

Si el servicio de correo falla temporalmente (una caída momentánea de red, un límite de tasa alcanzado), BullMQ reintenta automáticamente con un tiempo de espera creciente entre intentos, en lugar de perder el trabajo por completo.

## 19.7 Trabajos Programados y Diferidos

```typescript
// Ejecutar un trabajo dentro de 24 horas (por ejemplo, un correo de recordatorio)
await colaRecordatorios.add('recordatorio-carrito', { usuarioId }, { delay: 24 * 60 * 60 * 1000 })

// Trabajos recurrentes con un patrón cron
await colaReportes.add(
  'reporte-diario',
  {},
  { repeat: { pattern: '0 8 * * *' } } // Todos los días a las 8:00 AM
)
```

## 19.8 Monitorear las Colas

```bash
npm install -D @bull-board/express @bull-board/api
```

```typescript
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import { ExpressAdapter } from '@bull-board/express'

const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/colas')

createBullBoard({ queues: [new BullMQAdapter(colaCorreos)], serverAdapter })

app.use('/admin/colas', serverAdapter.getRouter()) // Dashboard visual de trabajos pendientes/completados/fallidos
```

Un dashboard visual (protegido con autenticación en producción, nunca expuesto públicamente) facilita enormemente diagnosticar trabajos atascados o fallidos, sin necesitar consultar Redis directamente.

## 19.9 Casos de Uso Típicos

| Tarea | Por qué encolarla |
| :--- | :--- |
| Envío de correos transaccionales | No debe bloquear la respuesta al usuario |
| Procesamiento/redimensionado de imágenes subidas | Operación intensiva en CPU |
| Generación de reportes/exportaciones grandes | Puede tardar minutos, inviable dentro de una petición HTTP |
| Sincronización con servicios externos (webhooks salientes) | Debe reintentarse automáticamente ante fallos temporales |

## 19.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Delegar una tarea lenta fuera de la petición HTTP | `Queue.add()` para encolar, un `Worker` para procesar |
| Persistencia de trabajos pendientes ante reinicios | Redis como backend de BullMQ |
| Reintentar automáticamente trabajos fallidos | La opción `attempts` + `backoff` |
| Ejecutar un trabajo en el futuro o de forma recurrente | `delay` o `repeat` con patrón cron |
| Visualizar el estado de las colas | Bull Board |

## 19.11 Errores Comunes

- **Ejecutar tareas lentas directamente dentro de la petición HTTP**: el cliente espera innecesariamente, y una tarea que falla puede hacer fallar toda la respuesta de la API.
- **No manejar el evento `'failed'` del worker**: los trabajos que agotan sus reintentos sin ningún registro quedan como fallos silenciosos, difíciles de detectar sin monitoreo activo.
- **Exponer el dashboard de Bull Board sin autenticación en producción**: revela información operativa interna (y potencialmente datos sensibles dentro de los trabajos) a cualquiera que encuentre la ruta.
