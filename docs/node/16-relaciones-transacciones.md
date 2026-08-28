# Módulo 16: Relaciones, Transacciones e Índices en MongoDB

Este módulo profundiza en tres piezas avanzadas ya mencionadas de pasada: cómo modelar relaciones reales con Mongoose (`ref`/`populate`), cómo garantizar que varias operaciones se completen juntas o no se completen en absoluto (transacciones), y cómo diseñar índices con criterio, no solo por intuición.

## 16.1 Relaciones con `ref` y `populate`

```typescript
// src/models/pedido.model.ts
import mongoose, { Schema, type Document, type Types } from 'mongoose'

interface IPedido extends Document {
  usuario: Types.ObjectId
  productos: Types.ObjectId[]
  total: number
}

const pedidoSchema = new Schema<IPedido>({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productos: [{ type: Schema.Types.ObjectId, ref: 'Producto' }],
  total: { type: Number, required: true }
})

export const PedidoModel = mongoose.model<IPedido>('Pedido', pedidoSchema)
```

`ref: 'Usuario'` le dice a Mongoose que ese campo referencia documentos del modelo `Usuario` — sin esto, solo se guardaría un ID sin ninguna relación explícita para Mongoose.

```typescript
// Sin populate: solo devuelve los IDs
const pedido = await PedidoModel.findById(id)
console.log(pedido.usuario) // ObjectId("64f1...")

// Con populate: reemplaza el ID por el documento completo referenciado
const pedidoConDatos = await PedidoModel.findById(id).populate('usuario')
console.log(pedidoConDatos.usuario) // { _id: ..., nombre: 'Alex', email: '...' }
```

`populate()` es el equivalente de Mongoose a `$lookup` (Módulo 15) — internamente ejecuta una consulta adicional para "rellenar" la referencia con el documento completo.

## 16.2 `populate` Selectivo y Anidado

```typescript
// Solo traer campos específicos del documento referenciado
const pedido = await PedidoModel.findById(id).populate('usuario', 'nombre email -_id')

// Populate anidado: el usuario referencia a su vez otro documento
const pedidoCompleto = await PedidoModel.findById(id).populate({
  path: 'usuario',
  populate: { path: 'direccion' }
})
```

## 16.3 Transacciones — Cuándo Son Necesarias

Una transacción garantiza que un conjunto de operaciones se ejecuten **todas juntas o ninguna** — crítico cuando varias escrituras relacionadas deben mantenerse consistentes entre sí.

```typescript
// Ejemplo: transferir stock entre dos productos debe ser atómico
import mongoose from 'mongoose'

async function transferirStock(origenId: string, destinoId: string, cantidad: number) {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const origen = await ProductoModel.findById(origenId).session(session)
    if (!origen || origen.stock < cantidad) {
      throw new Error('Stock insuficiente')
    }

    await ProductoModel.findByIdAndUpdate(origenId, { $inc: { stock: -cantidad } }, { session })
    await ProductoModel.findByIdAndUpdate(destinoId, { $inc: { stock: cantidad } }, { session })

    await session.commitTransaction() // Confirma AMBAS operaciones
  } catch (error) {
    await session.abortTransaction() // Revierte AMBAS operaciones si algo falló
    throw error
  } finally {
    session.endSession()
  }
}
```

Sin la transacción, si la segunda actualización fallara después de que la primera ya se ejecutó, el sistema quedaría en un estado inconsistente (stock descontado del origen, pero nunca agregado al destino) — la transacción garantiza que eso nunca ocurra.

## 16.4 Cuándo NO Necesitas una Transacción

```typescript
// Una sola operación de escritura NUNCA necesita una transacción explícita —
// MongoDB garantiza atomicidad a nivel de un solo documento por diseño
await ProductoModel.findByIdAndUpdate(id, { $inc: { stock: -1 } })
```

Las transacciones tienen un costo de rendimiento — úsalas solo cuando **múltiples documentos** (potencialmente en distintas colecciones) deben modificarse de forma atómica juntos; una única actualización siempre es atómica por defecto en MongoDB.

## 16.5 Diseñar Índices con Criterio

```typescript
// Índice simple sobre un campo consultado frecuentemente
productoSchema.index({ categoria: 1 })

// Índice compuesto: optimiza consultas que filtran por AMBOS campos juntos
productoSchema.index({ categoria: 1, precio: -1 })

// Índice único: además de acelerar búsquedas, garantiza que no haya duplicados
usuarioSchema.index({ email: 1 }, { unique: true })
```

Un índice compuesto (`{ categoria: 1, precio: -1 }`) optimiza consultas que filtran por `categoria` **y** ordenan/filtran por `precio` juntos — pero no ayuda igual de bien a una consulta que solo filtra por `precio` sin `categoria` (el orden de los campos en el índice importa).

## 16.6 Analizar el Rendimiento de una Consulta

```typescript
const explicacion = await ProductoModel.find({ categoria: 'electronica' }).explain('executionStats')
console.log(explicacion.executionStats.totalDocsExamined) // Cuántos documentos tuvo que revisar
```

`explain()` muestra si una consulta está usando un índice eficientemente, o si está haciendo un "collection scan" (revisar todos los documentos uno por uno) — la herramienta de diagnóstico fundamental antes de decidir agregar un índice nuevo.

## 16.7 El Costo de los Índices

Los índices aceleran lecturas, pero **ralentizan escrituras** (cada `insert`/`update` debe actualizar también todos los índices relevantes) y consumen espacio en disco adicional — no se debe indexar cada campo "por si acaso"; solo los campos realmente consultados con frecuencia.

## 16.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Relacionar documentos entre colecciones | `ref` en el esquema + `.populate()` en la consulta |
| Que varias operaciones se completen juntas o ninguna | Una transacción con `session.startTransaction()`/`commitTransaction()` |
| Acelerar consultas frecuentes sobre un campo específico | Un índice simple |
| Acelerar consultas que combinan varios campos | Un índice compuesto, en el orden correcto |
| Diagnosticar si una consulta usa un índice eficientemente | `.explain('executionStats')` |

## 16.9 Errores Comunes

- **Usar transacciones para operaciones que no las necesitan**: agrega overhead de rendimiento innecesario en operaciones que MongoDB ya garantiza atómicas por sí solas (una sola escritura a un documento).
- **No manejar el `abortTransaction()` en el bloque `catch`**: deja la transacción abierta indefinidamente si ocurre un error no anticipado, causando bloqueos.
- **Indexar campos que casi nunca se consultan**: ralentiza cada escritura sin ningún beneficio real de lectura correspondiente — cada índice tiene un costo, no es gratuito.
