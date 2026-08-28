# Módulo 18: WebSockets con Socket.io

Todo lo cubierto hasta ahora sigue el modelo petición-respuesta de HTTP: el cliente pide, el servidor responde, la conexión termina. Algunas funcionalidades (chat en tiempo real, notificaciones instantáneas, un tablero colaborativo) necesitan que el **servidor** pueda enviar datos al cliente en cualquier momento, sin que el cliente lo solicite primero. **WebSockets** resuelve esto con una conexión persistente y bidireccional.

## 18.1 HTTP vs WebSockets

```text
HTTP (petición-respuesta):
Cliente → petición → Servidor
Cliente ← respuesta ← Servidor
(la conexión termina)

WebSocket (conexión persistente):
Cliente ⟷ conexión abierta ⟷ Servidor
(cualquiera de los dos puede enviar datos en cualquier momento, sin cerrar la conexión)
```

## 18.2 Instalación de Socket.io

```bash
npm install socket.io
npm install -D @types/node
```

**Socket.io** es la librería estándar del ecosistema Node.js para WebSockets — añade reconexión automática, salas (*rooms*), y un mecanismo de respaldo (*fallback*) a *long polling* si el navegador o la red no soportan WebSockets nativos.

## 18.3 Configuración del Servidor

```typescript
// src/index.ts
import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

const app = express()
const servidorHttp = createServer(app) // Socket.io necesita el servidor HTTP nativo, no la app de Express directamente

const io = new Server(servidorHttp, {
  cors: { origin: 'http://localhost:5173' } // El origen del frontend (Vue.js/React)
})

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})

servidorHttp.listen(3000, () => console.log('Servidor con WebSockets en el puerto 3000'))
```

Nótese que ahora `servidorHttp.listen()` reemplaza a `app.listen()` — Socket.io necesita adjuntarse directamente al servidor HTTP nativo de Node para interceptar las conexiones WebSocket antes de que lleguen a Express.

## 18.4 Emitir y Escuchar Eventos

```typescript
io.on('connection', (socket) => {
  // Escuchar un evento enviado desde el cliente
  socket.on('mensaje-enviado', (datos: { texto: string; autor: string }) => {
    console.log('Mensaje recibido:', datos)

    // Reenviar el evento a TODOS los clientes conectados, incluyendo al que lo envió
    io.emit('nuevo-mensaje', datos)
  })
})
```

```typescript
// Cliente (Vue.js/React) — usando la librería socket.io-client
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

socket.emit('mensaje-enviado', { texto: 'Hola a todos', autor: 'Alex' })

socket.on('nuevo-mensaje', (datos) => {
  console.log('Nuevo mensaje recibido:', datos)
})
```

## 18.5 Tipar los Eventos con TypeScript

```typescript
interface EventosServidorACliente {
  'nuevo-mensaje': (datos: { texto: string; autor: string }) => void
}

interface EventosClienteAServidor {
  'mensaje-enviado': (datos: { texto: string; autor: string }) => void
}

const io = new Server<EventosClienteAServidor, EventosServidorACliente>(servidorHttp)

io.on('connection', (socket) => {
  socket.on('mensaje-enviado', (datos) => {
    // "datos" ya está tipado correctamente según EventosClienteAServidor
    io.emit('nuevo-mensaje', datos) // TypeScript valida que el evento y sus datos coincidan con EventosServidorACliente
  })
})
```

Tipar los eventos evita errores comunes como emitir un evento con un nombre mal escrito, o con datos que no coinciden con lo que el cliente espera recibir.

## 18.6 Salas (*Rooms*) — Comunicación Segmentada

Enviar un mensaje a **todos** los clientes conectados (`io.emit`) raramente es lo que se necesita en una aplicación real — las salas permiten agrupar sockets y enviar mensajes solo a un grupo específico.

```typescript
io.on('connection', (socket) => {
  socket.on('unirse-sala', (salaId: string) => {
    socket.join(salaId)
  })

  socket.on('mensaje-sala', (datos: { salaId: string; texto: string }) => {
    io.to(datos.salaId).emit('nuevo-mensaje', { texto: datos.texto }) // Solo a los sockets en esa sala
  })

  socket.on('salir-sala', (salaId: string) => {
    socket.leave(salaId)
  })
})
```

Útil para chats con múltiples canales/conversaciones, notificaciones específicas de un usuario (una "sala" con un solo socket, identificada por el ID del usuario), o colaboración en tiempo real limitada a un documento específico.

## 18.7 Autenticar Conexiones WebSocket

```typescript
import { verificarToken } from './services/auth.service.js'

io.use((socket, next) => {
  const token = socket.handshake.auth.token

  try {
    const payload = verificarToken(token)
    socket.data.usuarioId = payload.id // Disponible en todos los eventos posteriores de este socket
    next()
  } catch {
    next(new Error('Token inválido'))
  }
})
```

`io.use()` es el equivalente de Socket.io a un middleware de Express (Módulo 7) — se ejecuta antes de aceptar la conexión, permitiendo rechazar conexiones no autenticadas antes de que lleguen al handler `connection`.

## 18.8 Cuándo Usar WebSockets vs Peticiones HTTP Normales

| Escenario | Recomendación |
| :--- | :--- |
| Un chat en tiempo real, notificaciones instantáneas | WebSockets |
| Un tablero colaborativo con cambios de múltiples usuarios simultáneos | WebSockets |
| Un formulario, un CRUD estándar, la mayoría de una API típica | HTTP normal — WebSockets agregan complejidad innecesaria |
| Actualizaciones periódicas no críticas en tiempo (cada pocos minutos) | Polling con HTTP simple suele ser suficiente y más simple |

## 18.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Una conexión persistente y bidireccional | Socket.io, adjuntado al servidor HTTP nativo |
| Enviar un evento a todos los clientes conectados | `io.emit('evento', datos)` |
| Enviar un evento solo a un grupo específico | Salas: `socket.join()` + `io.to(sala).emit()` |
| Validar la conexión antes de aceptarla | `io.use()` como middleware de autenticación |
| Tipado seguro de los eventos emitidos/escuchados | Genéricos de TypeScript en `new Server<...>()` |

## 18.10 Errores Comunes

- **Usar `io.emit()` cuando el mensaje debería ir solo a un grupo específico**: envía datos innecesariamente a clientes que no deberían recibirlos, y puede filtrar información entre usuarios que no deberían verla.
- **No autenticar las conexiones WebSocket**: a diferencia de HTTP (donde cada petición puede validarse independientemente), una conexión WebSocket persiste — sin autenticación en la conexión inicial, cualquiera puede escuchar y emitir eventos.
- **Usar WebSockets para funcionalidad que no necesita tiempo real**: agrega complejidad de infraestructura (gestión de conexiones persistentes, escalado horizontal más complejo) sin beneficio real sobre HTTP tradicional.
