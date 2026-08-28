# Módulo 13: Fundamentos de MongoDB y Modelado de Documentos

Hasta ahora, la API ha simulado operaciones de "base de datos" sin una implementación real. Este módulo introduce **MongoDB**, la base de datos NoSQL más usada del ecosistema Node.js — un modelo de datos fundamentalmente distinto al de las bases de datos relacionales tradicionales.

## 13.1 ¿Qué es una Base de Datos NoSQL?

MongoDB es una base de datos **orientada a documentos**: en lugar de tablas con filas y columnas rígidas, almacena información como documentos en formato similar a JSON (técnicamente BSON — *Binary JSON*), agrupados en **colecciones**.

```text
Terminología equivalente:
Base de datos relacional  →  MongoDB
Tabla                       →  Colección
Fila                          →  Documento
Columna                        →  Campo
```

## 13.2 Un Documento de Ejemplo

```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "nombre": "Teclado mecánico",
  "precio": 89.99,
  "categoria": "electronica",
  "etiquetas": ["gaming", "rgb", "mecanico"],
  "especificaciones": {
    "switches": "rojos",
    "conectividad": "inalámbrico"
  },
  "creadoEn": "2026-08-28T10:00:00Z"
}
```

Nótese que `etiquetas` (un array) y `especificaciones` (un objeto anidado) viven **directamente dentro** del documento — en una base de datos relacional, esto normalmente requeriría tablas separadas relacionadas por claves foráneas. `_id` es el identificador único generado automáticamente por MongoDB para cada documento.

## 13.3 Esquema Flexible — La Diferencia Fundamental

```json
// Documento 1 en la colección "productos"
{ "nombre": "Teclado", "precio": 89.99 }

// Documento 2 en la MISMA colección — con campos completamente distintos
{ "nombre": "Camiseta", "talla": "M", "color": "azul" }
```

MongoDB no exige que todos los documentos de una colección tengan la misma estructura — es "sin esquema" (*schemaless*) a nivel de la base de datos misma. En la práctica, casi todo proyecto real impone una estructura consistente a nivel de **aplicación** con Mongoose (Módulo 14), pero es importante entender que esa validación es una decisión del proyecto, no una limitación impuesta por la base de datos.

## 13.4 Instalación y Conexión

```bash
npm install mongodb
```

Para desarrollo local, se puede instalar MongoDB directamente, o usar **MongoDB Atlas** (el servicio en la nube oficial, con un tier gratuito) — la opción más común en proyectos reales, evitando gestionar la infraestructura de base de datos manualmente.

```typescript
// src/config/database.ts
import { MongoClient } from 'mongodb'
import { env } from './env.js'

const client = new MongoClient(env.DATABASE_URL)

export async function conectarBaseDatos() {
  await client.connect()
  console.log('Conectado a MongoDB')
  return client.db()
}
```

## 13.5 Operaciones Básicas con el Driver Nativo

```typescript
const db = await conectarBaseDatos()
const coleccion = db.collection('productos')

// Crear
const resultado = await coleccion.insertOne({ nombre: 'Mouse', precio: 29.99 })

// Leer
const producto = await coleccion.findOne({ _id: resultado.insertedId })
const todos = await coleccion.find({ categoria: 'electronica' }).toArray()

// Actualizar
await coleccion.updateOne({ _id: resultado.insertedId }, { $set: { precio: 24.99 } })

// Eliminar
await coleccion.deleteOne({ _id: resultado.insertedId })
```

El driver nativo funciona, pero carece de validación de esquema, tipado fuerte con TypeScript, y utilidades de modelado — por eso, en la práctica, la mayoría de proyectos Node.js usan **Mongoose** (Módulo 14) como capa sobre el driver nativo, no el driver directamente.

## 13.6 Diseñar Documentos: Incrustar vs Referenciar

La decisión de diseño más importante en MongoDB: ¿los datos relacionados viven **dentro** del mismo documento (incrustados), o en documentos separados **referenciados** por ID (similar a una clave foránea)?

```json
// Incrustado: los comentarios viven DENTRO del documento del post
{
  "titulo": "Mi primer post",
  "comentarios": [
    { "autor": "Ana", "texto": "Buen post" },
    { "autor": "Luis", "texto": "Gracias por compartir" }
  ]
}
```

```json
// Referenciado: el post solo guarda IDs; los comentarios viven en su propia colección
{ "_id": "post1", "titulo": "Mi primer post" }
{ "_id": "com1", "postId": "post1", "autor": "Ana", "texto": "Buen post" }
```

| Criterio | Incrustar | Referenciar |
| :--- | :--- | :--- |
| Los datos relacionados casi siempre se leen juntos | ✅ Preferible | |
| Los datos relacionados crecen sin límite (miles de comentarios) | | ✅ Preferible |
| Los datos relacionados se actualizan independientemente con frecuencia | | ✅ Preferible |
| Un documento MongoDB tiene un límite de 16MB | Relevante si la colección incrustada puede crecer mucho | No aplica igual |

Se retoma con más profundidad y ejemplos de Mongoose en el Módulo 16.

## 13.7 Índices — Por Qué Importan Desde el Diseño

```typescript
await coleccion.createIndex({ email: 1 }, { unique: true }) // Búsquedas rápidas + garantiza unicidad
```

Sin un índice, MongoDB debe recorrer **todos** los documentos de una colección para encontrar los que coinciden con una consulta — con miles o millones de documentos, esto se vuelve prohibitivamente lento. Se retoma a fondo en el Módulo 16.

## 13.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| El equivalente a una "tabla" en MongoDB | Una colección |
| El equivalente a una "fila" | Un documento (similar a JSON) |
| Datos relacionados que casi siempre se leen juntos | Incrustar dentro del mismo documento |
| Datos relacionados que crecen mucho o cambian independientemente | Referenciar por ID entre colecciones |
| Búsquedas rápidas en campos consultados frecuentemente | Crear un índice sobre ese campo |

## 13.9 Errores Comunes

- **Usar el driver nativo de MongoDB sin ninguna capa de validación**: sin Mongoose (Módulo 14) o validación manual, documentos con estructuras inconsistentes pueden terminar en la misma colección sin ningún aviso.
- **Incrustar datos que crecen sin límite** (todos los comentarios de un post viral dentro del mismo documento): puede acercarse al límite de 16MB por documento y degradar el rendimiento de lectura del documento completo.
- **No crear índices sobre campos consultados frecuentemente**: las consultas se vuelven progresivamente más lentas a medida que la colección crece, sin ningún error visible que lo señale directamente.
