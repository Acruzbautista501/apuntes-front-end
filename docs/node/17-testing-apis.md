# Módulo 17: Testing de APIs (Vitest + Supertest)

Este sitio ya cubre testing en las secciones de Vue.js y React con Vitest — el mismo ejecutor de pruebas funciona igual de bien en backend. Este módulo cubre cómo testear una API Express de forma efectiva: tests unitarios de servicios aislados, y tests de integración que verifican endpoints HTTP completos con **Supertest**.

## 17.1 Instalación

```bash
npm install -D vitest supertest @types/supertest
```

```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## 17.2 Tests Unitarios de un Servicio (Sin Base de Datos Real)

Gracias a la separación de capas (Módulo 10), un servicio puede probarse de forma completamente aislada, sustituyendo el repositorio real por una versión simulada.

```typescript
// src/services/producto.service.test.ts
import { describe, it, expect, vi } from 'vitest'
import { crearProductoService } from './producto.service.js'

describe('productoService.crear', () => {
  it('lanza un error si el precio es inválido', async () => {
    const repositorioSimulado = { crear: vi.fn() }
    const servicio = crearProductoService(repositorioSimulado as any)

    await expect(servicio.crear({ nombre: 'Test', precio: -10 })).rejects.toThrow('Precio inválido')
    expect(repositorioSimulado.crear).not.toHaveBeenCalled() // Nunca debe llegar a guardar datos inválidos
  })

  it('crea el producto cuando los datos son válidos', async () => {
    const repositorioSimulado = { crear: vi.fn().mockResolvedValue({ id: '1', nombre: 'Test', precio: 50 }) }
    const servicio = crearProductoService(repositorioSimulado as any)

    const resultado = await servicio.crear({ nombre: 'Test', precio: 50 })

    expect(repositorioSimulado.crear).toHaveBeenCalledWith({ nombre: 'Test', precio: 50 })
    expect(resultado.id).toBe('1')
  })
})
```

Este test corre en milisegundos porque no toca ninguna base de datos real — verifica exclusivamente la lógica de negocio del servicio, exactamente el patrón que justificó la arquitectura en capas del Módulo 10.

## 17.3 Tests de Integración con Supertest

Los tests de integración verifican el comportamiento real de un endpoint HTTP completo: rutas, middlewares, validación, y (opcionalmente) una base de datos real de prueba.

```typescript
// src/routes/producto.routes.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../app.js' // La instancia de Express, SIN app.listen() (Módulo 6)

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL_TEST!) // Base de datos separada, solo para tests
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('POST /api/productos', () => {
  it('crea un producto con datos válidos', async () => {
    const respuesta = await request(app)
      .post('/api/productos')
      .send({ nombre: 'Teclado', precio: 89.99, categoria: 'electronica' })

    expect(respuesta.status).toBe(201)
    expect(respuesta.body.nombre).toBe('Teclado')
  })

  it('rechaza un producto sin nombre', async () => {
    const respuesta = await request(app)
      .post('/api/productos')
      .send({ precio: 89.99 })

    expect(respuesta.status).toBe(400)
    expect(respuesta.body.error).toBeDefined()
  })
})
```

`supertest` envía peticiones HTTP reales directamente a la instancia de Express (`app`), sin necesitar que el servidor esté realmente escuchando en un puerto — más rápido y más simple que levantar un servidor real para cada test.

## 17.4 Testear Rutas Protegidas por Autenticación

```typescript
describe('GET /api/productos/admin', () => {
  it('rechaza la petición sin un token', async () => {
    const respuesta = await request(app).get('/api/productos/admin')
    expect(respuesta.status).toBe(401)
  })

  it('permite el acceso con un token válido de administrador', async () => {
    const token = generarToken('id-usuario-admin') // Generado directamente para el test, sin login real

    const respuesta = await request(app)
      .get('/api/productos/admin')
      .set('Authorization', `Bearer ${token}`)

    expect(respuesta.status).toBe(200)
  })
})
```

## 17.5 Limpiar la Base de Datos Entre Tests

```typescript
import { beforeEach } from 'vitest'
import { ProductoModel } from '../models/producto.model.js'

beforeEach(async () => {
  await ProductoModel.deleteMany({}) // Empieza cada test con una colección vacía
})
```

Sin limpiar el estado entre tests, un test puede depender accidentalmente de datos dejados por otro test anterior — produciendo resultados inconsistentes según el orden de ejecución, uno de los problemas más comunes y confusos en testing de integración.

## 17.6 Bases de Datos de Prueba: Real vs En Memoria

```bash
npm install -D mongodb-memory-server
```

```typescript
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServidor: MongoMemoryServer

beforeAll(async () => {
  mongoServidor = await MongoMemoryServer.create()
  await mongoose.connect(mongoServidor.getUri())
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongoServidor.stop()
})
```

`mongodb-memory-server` levanta una instancia real de MongoDB completamente en memoria, sin necesitar una base de datos externa configurada — ideal para CI/CD (Módulo 23), donde no siempre es práctico tener una base de datos persistente disponible.

## 17.7 Cobertura de Código

```bash
npm install -D @vitest/coverage-v8
```

```json
// vitest.config.ts
{
  "test": {
    "coverage": {
      "provider": "v8",
      "reporter": ["text", "html"]
    }
  }
}
```

```bash
npx vitest run --coverage
```

La cobertura mide qué porcentaje del código se ejecuta durante los tests — útil como señal, pero un 100% de cobertura **no** garantiza ausencia de bugs; es más importante testear los casos límite y de error que perseguir un número exacto de cobertura.

## 17.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Testear lógica de negocio aislada, sin base de datos real | Un servicio con un repositorio simulado (`vi.fn()`) |
| Testear un endpoint HTTP completo | Supertest sobre la instancia de `app` (sin `listen()`) |
| Una base de datos de prueba sin infraestructura externa | `mongodb-memory-server` |
| Evitar que los tests interfieran entre sí | Limpiar la base de datos en `beforeEach` |
| Medir qué código se ejecuta durante los tests | `@vitest/coverage-v8` |

## 17.9 Errores Comunes

- **Testear contra la base de datos de producción o desarrollo real**: puede borrar o corromper datos reales — siempre usa una base de datos separada dedicada exclusivamente a testing.
- **No limpiar el estado entre tests**: produce resultados inconsistentes que dependen del orden de ejecución, dificultando enormemente diagnosticar fallos intermitentes.
- **Solo escribir tests de integración, sin tests unitarios de servicios**: los tests de integración son más lentos y más difíciles de diagnosticar cuando fallan — los tests unitarios de la lógica de negocio siguen siendo valiosos por su velocidad y precisión.
