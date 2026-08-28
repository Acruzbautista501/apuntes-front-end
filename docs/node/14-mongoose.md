# Módulo 14: Mongoose con TypeScript

**Mongoose** es una librería de modelado de objetos (ODM — *Object Document Mapper*) construida sobre el driver nativo de MongoDB (Módulo 13). Añade exactamente lo que el driver nativo no tiene: esquemas con validación, tipado fuerte con TypeScript, middlewares de ciclo de vida, y una API mucho más expresiva para trabajar con documentos.

## 14.1 Instalación y Conexión

```bash
npm install mongoose
```

```typescript
// src/config/database.ts
import mongoose from 'mongoose'
import { env } from './env.js'

export async function conectarBaseDatos() {
  await mongoose.connect(env.DATABASE_URL)
  console.log('Conectado a MongoDB con Mongoose')
}
```

```typescript
// src/index.ts
import { conectarBaseDatos } from './config/database.js'

await conectarBaseDatos()
app.listen(PUERTO, () => console.log('Servidor iniciado'))
```

## 14.2 Definir un Esquema

```typescript
// src/models/producto.model.ts
import mongoose, { Schema } from 'mongoose'

const productoSchema = new Schema({
  nombre: { type: String, required: true, minlength: 2 },
  precio: { type: Number, required: true, min: 0 },
  categoria: { type: String, enum: ['electronica', 'ropa', 'hogar'], required: true },
  disponible: { type: Boolean, default: true },
  creadoEn: { type: Date, default: Date.now }
})

export const ProductoModel = mongoose.model('Producto', productoSchema)
```

A diferencia del esquema "sin reglas" del driver nativo (Módulo 13), Mongoose **sí** valida la estructura del documento antes de guardarlo — `required`, `min`, `enum` son reglas aplicadas automáticamente en cada `save()`.

## 14.3 Tipar el Esquema con TypeScript

```typescript
// src/models/producto.model.ts
import mongoose, { Schema, type Document } from 'mongoose'

export interface IProducto extends Document {
  nombre: string
  precio: number
  categoria: 'electronica' | 'ropa' | 'hogar'
  disponible: boolean
  creadoEn: Date
}

const productoSchema = new Schema<IProducto>({
  nombre: { type: String, required: true, minlength: 2 },
  precio: { type: Number, required: true, min: 0 },
  categoria: { type: String, enum: ['electronica', 'ropa', 'hogar'], required: true },
  disponible: { type: Boolean, default: true },
  creadoEn: { type: Date, default: Date.now }
})

export const ProductoModel = mongoose.model<IProducto>('Producto', productoSchema)
```

`Schema<IProducto>` conecta la definición del esquema con la interfaz TypeScript — cualquier consulta (`findOne`, `create`) devuelve automáticamente resultados tipados como `IProducto`, con autocompletado completo.

## 14.4 Operaciones CRUD con Mongoose

```typescript
// Crear
const producto = await ProductoModel.create({ nombre: 'Teclado', precio: 89.99, categoria: 'electronica' })

// Leer
const todos = await ProductoModel.find()
const filtrados = await ProductoModel.find({ categoria: 'electronica', precio: { $lt: 100 } })
const uno = await ProductoModel.findById(id)
const unoConCondicion = await ProductoModel.findOne({ nombre: 'Teclado' })

// Actualizar
await ProductoModel.findByIdAndUpdate(id, { precio: 79.99 }, { new: true }) // new: true devuelve el documento YA actualizado

// Eliminar
await ProductoModel.findByIdAndDelete(id)
```

## 14.5 Validación Personalizada

```typescript
const productoSchema = new Schema<IProducto>({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'], // Mensaje de error personalizado
    validate: {
      validator: (valor: string) => valor.trim().length >= 2,
      message: 'El nombre debe tener al menos 2 caracteres sin contar espacios'
    }
  },
  precio: { type: Number, required: true, min: [0, 'El precio no puede ser negativo'] }
})
```

## 14.6 Middlewares de Mongoose (Hooks)

```typescript
productoSchema.pre('save', function (next) {
  this.nombre = this.nombre.trim() // Normaliza el dato justo antes de guardarlo
  next()
})

productoSchema.post('save', function (doc) {
  console.log(`Producto creado: ${doc.nombre}`)
})
```

Los hooks `pre`/`post` permiten ejecutar lógica automáticamente en momentos específicos del ciclo de vida de un documento (`save`, `remove`, `find`...) — útil para normalización de datos, logging, o disparar efectos secundarios (como invalidar una caché, Módulo 20) sin repetir esa lógica en cada lugar donde se guarda un documento.

## 14.7 Métodos y Propiedades Virtuales

```typescript
productoSchema.methods.aplicarDescuento = function (porcentaje: number) {
  return this.precio * (1 - porcentaje / 100)
}

productoSchema.virtual('precioConIVA').get(function () {
  return this.precio * 1.16
})
```

```typescript
const producto = await ProductoModel.findById(id)
producto.aplicarDescuento(20)     // Método de instancia
producto.precioConIVA              // Propiedad calculada, no almacenada en la base de datos
```

Las propiedades **virtuales** son valores calculados que no se guardan físicamente en el documento — se recalculan cada vez que se accede a ellas, útiles para valores derivados que no deberían duplicarse en la base de datos.

## 14.8 Selección y Exclusión de Campos

```typescript
// Solo devolver nombre y precio, excluyendo el resto
const productos = await ProductoModel.find().select('nombre precio')

// Excluir un campo sensible explícitamente
const usuarios = await UsuarioModel.find().select('-password')
```

Excluir campos sensibles (como `password`) directamente en la consulta es más seguro que filtrarlos manualmente después de recibir el resultado completo — reduce el riesgo de olvidar excluirlo en algún endpoint nuevo.

## 14.9 Conectar Mongoose con la Arquitectura en Capas (Módulo 10)

```typescript
// src/repositories/producto.repository.ts
import { ProductoModel } from '../models/producto.model.js'
import type { CrearProductoDTO } from '../schemas/producto.schema.js'

export async function crear(datos: CrearProductoDTO) {
  return ProductoModel.create(datos)
}

export async function buscarPorId(id: string) {
  return ProductoModel.findById(id)
}
```

El repositorio (Módulo 10) es exactamente donde vive todo el código de Mongoose de esta sección — el servicio y el controlador nunca importan `ProductoModel` directamente.

## 14.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Definir la estructura y reglas de un documento | `new Schema<Interfaz>({...})` |
| Un modelo tipado con TypeScript | `mongoose.model<Interfaz>('Nombre', schema)` |
| Lógica automática antes/después de guardar | `schema.pre('save', ...)` / `schema.post('save', ...)` |
| Un valor calculado no almacenado en la BD | Una propiedad `virtual` |
| Excluir un campo sensible de los resultados | `.select('-campo')` |

## 14.11 Errores Comunes

- **No tipar el esquema con la interfaz TypeScript**: pierde autocompletado y validación de tipos en cada consulta, aumentando el riesgo de errores de tipeo en nombres de campo no detectados hasta ejecutar el código.
- **Olvidar `{ new: true }` en `findByIdAndUpdate`**: por defecto, Mongoose devuelve el documento **antes** de la actualización, no después — un error sutil que hace parecer que la actualización no funcionó.
- **No excluir campos sensibles (`password`, tokens) en las consultas que devuelven datos al cliente**: expone información que nunca debería salir de la API, incluso si el frontend simplemente la ignora visualmente.
