# Módulo 10: Arquitectura en Capas de una API REST

Los módulos anteriores separaron rutas de controladores. Este módulo completa el patrón con una **capa de servicios** — la arquitectura estándar de la industria para APIs Node.js mantenibles, donde cada capa tiene una responsabilidad única y clara.

## 10.1 Las Tres Capas

```text
Petición HTTP
    ↓
┌─────────────┐
│    Rutas     │  Define qué URL/método ejecuta qué controlador (Módulo 7)
└──────┬───────┘
       ↓
┌─────────────┐
│ Controladores │  Extrae datos de req, llama al servicio, formatea la respuesta HTTP
└──────┬───────┘
       ↓
┌─────────────┐
│  Servicios   │  Contiene la LÓGICA DE NEGOCIO real, sin saber nada de HTTP/Express
└──────┬───────┘
       ↓
┌─────────────┐
│ Repositorios │  Acceso directo a la base de datos (MongoDB, Módulo 13-16)
└─────────────┘
```

## 10.2 Por Qué Separar Servicios de Controladores

Un controlador que contiene lógica de negocio directamente está **acoplado a Express** — no puede reutilizarse desde otro contexto (un script de línea de comandos, un job programado, un test unitario) sin arrastrar `req`/`res` innecesariamente.

```typescript
// ❌ Lógica de negocio mezclada directamente en el controlador
export async function crearProducto(req: Request, res: Response) {
  if (req.body.precio <= 0) {
    return res.status(400).json({ error: 'Precio inválido' })
  }
  const producto = await ProductoModel.create(req.body) // Acceso directo a la base de datos aquí también
  res.status(201).json(producto)
}
```

```typescript
// ✅ El controlador delega toda la lógica al servicio
export async function crearProducto(req: Request, res: Response, next: NextFunction) {
  try {
    const producto = await productoService.crear(req.body)
    res.status(201).json(producto)
  } catch (error) {
    next(error)
  }
}
```

## 10.3 La Capa de Servicios

```typescript
// src/services/producto.service.ts
import { ValidationError, NotFoundError } from '../errors/AppError.js'
import * as productoRepository from '../repositories/producto.repository.js'
import type { CrearProductoDTO } from '../schemas/producto.schema.js'

export async function crear(datos: CrearProductoDTO) {
  if (datos.precio <= 0) {
    throw new ValidationError('El precio debe ser mayor a cero')
  }

  return productoRepository.crear(datos)
}

export async function obtenerPorId(id: string) {
  const producto = await productoRepository.buscarPorId(id)

  if (!producto) {
    throw new NotFoundError('El producto solicitado no existe')
  }

  return producto
}

export async function listarConDescuento(porcentaje: number) {
  const productos = await productoRepository.listarTodos()

  // Lógica de negocio pura, sin ninguna dependencia de HTTP
  return productos.map((p) => ({
    ...p,
    precioConDescuento: p.precio * (1 - porcentaje / 100)
  }))
}
```

El servicio no sabe nada de `req`/`res`/códigos de estado HTTP — solo recibe datos, aplica reglas de negocio, y devuelve resultados o lanza errores de dominio. Esto lo hace **testeable de forma aislada** (Módulo 17) sin necesitar simular una petición HTTP completa.

## 10.4 La Capa de Repositorio

```typescript
// src/repositories/producto.repository.ts
import { ProductoModel } from '../models/producto.model.js' // Mongoose, Módulo 14

export async function crear(datos: CrearProductoDTO) {
  return ProductoModel.create(datos)
}

export async function buscarPorId(id: string) {
  return ProductoModel.findById(id)
}

export async function listarTodos() {
  return ProductoModel.find()
}
```

El repositorio es la **única** capa que conoce los detalles específicos de la base de datos (Mongoose, en este curso). Si algún día el proyecto migrara a otra base de datos, solo el repositorio necesitaría cambiar — los servicios y controladores permanecen intactos.

## 10.5 Estructura de Carpetas Completa

```text
src/
├── routes/
│   └── producto.routes.ts
├── controllers/
│   └── producto.controller.ts
├── services/
│   └── producto.service.ts
├── repositories/
│   └── producto.repository.ts
├── models/
│   └── producto.model.ts
├── schemas/
│   └── producto.schema.ts
├── middlewares/
│   ├── validar.ts
│   └── errorHandler.ts
├── errors/
│   └── AppError.ts
├── app.ts
└── index.ts
```

## 10.6 Inyección de Dependencias Simple (Sin un Framework de DI)

```typescript
// Para facilitar el testing, los servicios pueden recibir el repositorio como parámetro
// en lugar de importarlo directamente, permitiendo sustituirlo por una versión simulada en tests

export function crearProductoService(repositorio: typeof productoRepository) {
  return {
    async crear(datos: CrearProductoDTO) {
      if (datos.precio <= 0) throw new ValidationError('Precio inválido')
      return repositorio.crear(datos)
    }
  }
}
```

Este patrón (pasar dependencias explícitamente en lugar de importarlas de forma fija) facilita sustituir el repositorio real por uno simulado durante el testing (Módulo 17), sin necesitar un framework de inyección de dependencias complejo como los usados en NestJS.

## 10.7 Cuándo esta Arquitectura es Excesiva

| Escenario | Recomendación |
| :--- | :--- |
| Un prototipo pequeño o script de un solo uso | Lógica directamente en el controlador es aceptable |
| Una API con pocos endpoints simples (CRUD básico) | Controladores + un servicio delgado puede ser suficiente, sin repositorio separado |
| Una API con lógica de negocio real (cálculos, reglas condicionales, validaciones complejas) | La arquitectura completa en capas se justifica claramente |
| Un proyecto que crecerá y será mantenido por un equipo a largo plazo | La inversión inicial en capas se recupera rápidamente en mantenibilidad |

## 10.8 Tabla de Referencia Rápida

| Capa | Responsabilidad | Conoce sobre HTTP | Conoce sobre la base de datos |
| :--- | :--- | :--- | :--- |
| Rutas | Mapear URL+método a un controlador | Sí | No |
| Controladores | Extraer datos de `req`, formatear `res` | Sí | No |
| Servicios | Lógica de negocio | No | No |
| Repositorios | Acceso a datos | No | Sí |

## 10.9 Errores Comunes

- **Poner lógica de negocio directamente en el controlador**: acopla las reglas de negocio a Express, dificultando testing y reutilización.
- **Que el servicio acceda directamente al modelo de base de datos**: rompe la separación de responsabilidades — el servicio debe pasar siempre por el repositorio, nunca importar el modelo de Mongoose directamente.
- **Aplicar esta arquitectura completa a un proyecto trivial de 3 endpoints**: la sobrecarga de organización puede no justificarse en proyectos realmente pequeños — usa el criterio de la tabla 10.7.
