# Módulo 15: Consultas Avanzadas y el Pipeline de Agregación

Las consultas del Módulo 14 (`find`, `findOne`) cubren la mayoría de casos simples. Cuando se necesita transformar, agrupar, calcular estadísticas, o combinar datos de varias colecciones, MongoDB ofrece el **pipeline de agregación** — una de sus características más potentes y distintivas.

## 15.1 Operadores de Consulta Más Allá de la Igualdad

```typescript
// Comparación
await ProductoModel.find({ precio: { $gt: 50 } })          // Mayor que
await ProductoModel.find({ precio: { $gte: 50, $lte: 200 } }) // Rango
await ProductoModel.find({ categoria: { $ne: 'ropa' } })    // Distinto de
await ProductoModel.find({ categoria: { $in: ['electronica', 'hogar'] } }) // Dentro de una lista

// Lógicos
await ProductoModel.find({
  $or: [{ categoria: 'electronica' }, { precio: { $lt: 20 } }]
})

// Existencia y tipo
await ProductoModel.find({ descripcion: { $exists: true } })

// Expresiones regulares (búsqueda de texto parcial)
await ProductoModel.find({ nombre: { $regex: 'teclado', $options: 'i' } }) // "i" = insensible a mayúsculas
```

## 15.2 Ordenar, Paginar y Limitar

```typescript
const productos = await ProductoModel.find()
  .sort({ precio: -1 })    // -1: descendente, 1: ascendente
  .skip((pagina - 1) * limite)
  .limit(limite)
```

Este patrón de paginación (`skip` + `limit`) es el más simple, pero se vuelve lento en páginas muy alejadas del inicio en colecciones grandes — para paginación de alto rendimiento, la alternativa es paginación basada en cursor (usando el `_id` del último documento visto como punto de partida).

## 15.3 El Pipeline de Agregación — Concepto

Una agregación es una secuencia de **etapas** (*stages*), donde la salida de una etapa es la entrada de la siguiente — similar a encadenar `.filter().map().reduce()` en un array de JavaScript, pero ejecutado directamente en la base de datos.

```typescript
const resultado = await ProductoModel.aggregate([
  { $match: { categoria: 'electronica' } },      // Etapa 1: filtrar (como find())
  { $group: { _id: null, precioPromedio: { $avg: '$precio' } } } // Etapa 2: agrupar y calcular
])
```

## 15.4 `$match` y `$group` — Las Etapas Más Comunes

```typescript
const ventasPorCategoria = await ProductoModel.aggregate([
  { $match: { disponible: true } },
  {
    $group: {
      _id: '$categoria',              // Agrupa por el valor de este campo
      totalProductos: { $sum: 1 },     // Cuenta cuántos documentos hay en cada grupo
      precioPromedio: { $avg: '$precio' },
      precioMaximo: { $max: '$precio' },
      precioMinimo: { $min: '$precio' }
    }
  },
  { $sort: { totalProductos: -1 } }
])
```

```json
[
  { "_id": "electronica", "totalProductos": 45, "precioPromedio": 156.30, "precioMaximo": 599.99, "precioMinimo": 19.99 },
  { "_id": "ropa", "totalProductos": 32, "precioPromedio": 42.10, "precioMaximo": 120.00, "precioMinimo": 15.00 }
]
```

## 15.5 `$project` — Dar Forma al Resultado

```typescript
await ProductoModel.aggregate([
  {
    $project: {
      nombre: 1,
      precio: 1,
      precioConIVA: { $multiply: ['$precio', 1.16] }, // Campo calculado dentro del pipeline
      _id: 0 // Excluir explícitamente el _id del resultado
    }
  }
])
```

## 15.6 `$lookup` — El Equivalente a un JOIN

Cuando los datos están **referenciados** en lugar de incrustados (Módulo 13), `$lookup` combina información de dos colecciones — el equivalente conceptual a un `JOIN` en una base de datos relacional.

```typescript
const pedidosConProductos = await PedidoModel.aggregate([
  {
    $lookup: {
      from: 'productos',       // La colección a unir
      localField: 'productoId', // El campo en la colección actual (pedidos)
      foreignField: '_id',       // El campo en la colección referenciada (productos)
      as: 'detalleProducto'       // El nombre del nuevo campo, siempre un array
    }
  },
  { $unwind: '$detalleProducto' } // Convierte el array de un solo elemento en un objeto directo
])
```

## 15.7 Pipeline Completo de Ejemplo: Reporte de Ventas Mensuales

```typescript
const reporteVentas = await PedidoModel.aggregate([
  { $match: { estado: 'completado' } },
  {
    $group: {
      _id: {
        anio: { $year: '$fecha' },
        mes: { $month: '$fecha' }
      },
      totalVentas: { $sum: '$total' },
      cantidadPedidos: { $sum: 1 }
    }
  },
  { $sort: { '_id.anio': -1, '_id.mes': -1 } },
  { $limit: 12 } // Últimos 12 meses
])
```

Este único pipeline reemplaza lo que, sin agregaciones, requeriría traer todos los pedidos a la aplicación y procesarlos manualmente en JavaScript — mucho más lento y con uso innecesario de memoria y ancho de banda de red.

## 15.8 Búsqueda de Texto

```typescript
// Requiere un índice de texto previo:
productoSchema.index({ nombre: 'text', descripcion: 'text' })
```

```typescript
await ProductoModel.find({ $text: { $search: 'teclado mecanico' } })
```

Para búsquedas de texto más sofisticadas (relevancia, tolerancia a errores tipográficos), servicios especializados como Elasticsearch o Atlas Search suelen ser preferibles a la búsqueda de texto nativa de MongoDB — pero para necesidades básicas, es suficiente y no requiere infraestructura adicional.

## 15.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Filtrar por rangos, listas o condiciones complejas | Operadores `$gt`/`$lt`/`$in`/`$or` en `find()` |
| Agrupar documentos y calcular estadísticas | `$match` + `$group` en `aggregate()` |
| Dar una forma específica al resultado, con campos calculados | `$project` |
| Combinar datos de colecciones referenciadas (como un JOIN) | `$lookup` + `$unwind` |
| Búsqueda de texto simple | Un índice `text` + `$text: { $search: ... }` |

## 15.10 Errores Comunes

- **Traer todos los documentos y procesarlos en JavaScript en lugar de usar agregaciones**: desperdicia ancho de banda y memoria — MongoDB puede realizar el procesamiento mucho más eficientemente del lado de la base de datos.
- **Usar `$regex` sin un índice para búsquedas frecuentes**: recorre la colección completa en cada búsqueda; para búsquedas frecuentes, un índice de texto (15.8) es mucho más eficiente.
- **Olvidar `$unwind` después de un `$lookup`**: el resultado queda como un array (incluso de un solo elemento), complicando el acceso a los datos combinados en el código posterior.
