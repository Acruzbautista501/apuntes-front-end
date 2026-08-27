# Módulo 5: Interfaces y Tipos Personalizados

En este nivel, aprenderemos a definir "contratos". Una **Interface** o un **Type** le dice a tu programa: "Cualquier objeto que diga ser un *Usuario* DEBE tener estas propiedades específicas".

## 5.1 Interfaces: El Contrato de Objetos
Las interfaces se usan principalmente para definir la estructura de un **objeto**. Son ideales porque son extensibles y fáciles de leer.

```typescript
interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  descuento?: number; // Propiedad opcional
  readonly sku: string; // No se puede modificar después de creado
}

const nuevoProducto: Producto = {
  id: 1,
  nombre: "Auriculares Inalámbricos",
  categoria: "Audio",
  sku: "AUD-2024-001"
};

// nuevoProducto.sku = "OTRO"; <--- Error: Es de solo lectura.
```

## 5.2 Type Aliases (Alias de Tipo)
A diferencia de las interfaces, los `type` son más versátiles. No solo sirven para objetos, sino para crear **uniones** o combinaciones de tipos.

### Uniones de String (Literales)
Esto es extremadamente útil para limitar los valores que puede recibir una variable.

```typescript
type EstadoPedido = 'programado' | 'en_preparacion' | 'enviado' | 'cancelado';

let estadoActual: EstadoPedido = 'en_preparacion';
// estadoActual = 'enviando'; <--- Error: No existe en la unión.
```

## 5.3 Diferencias: ¿Cuándo usar Interface vs Type?

Aunque hacen cosas parecidas, hay reglas de oro para elegir:

| Característica | **Interface** | **Type** |
| :--- | :--- | :--- |
| **Uso principal** | Definir la forma de objetos. | Uniones, tuplas o tipos primitivos. |
| **Extensión** | Usa `extends` (herencia). | Usa el símbolo `&` (intersección). |
| **Declaración abierta** | Puedes declarar la misma interface dos veces y se combinan. | No se puede cambiar una vez definido. |

> **💡 Consejo Pro:** Usa **Interfaces** para la estructura de tus datos (modelos de API, objetos) y **Types** para lógica, estados y uniones.


## 5.4 Tipado de Objetos Anidados
En aplicaciones reales, los objetos están unos dentro de otros. Podemos usar interfaces dentro de otras interfaces para mantener el orden.

```typescript
interface Ubicacion {
  ciudad: string;
  latitud: number;
  longitud: number;
}

interface Sucursal {
  nombre: string;
  capacidadClientes: number;
  ubicacion: Ubicacion; // Interfaz anidada
}

const miSucursal: Sucursal = {
  nombre: "Sucursal Centro",
  capacidadClientes: 120,
  ubicacion: {
    ciudad: "CDMX",
    latitud: 19.30,
    longitud: -99.15
  }
};
```

## 5.5 Extensión de Interfaces
Si tienes una base común y quieres crear algo más específico, no repitas código; usa `extends`.

```typescript
interface Persona {
  nombre: string;
  correo: string;
}

interface Empleado extends Persona {
  sueldo: number;
  puesto: string;
}

const programador: Empleado = {
  nombre: "Aldair",
  correo: "hola@web.com",
  sueldo: 50000,
  puesto: "Frontend Developer"
};
```

## 🛠️ Aplicación Práctica en tu `main.ts`:
Imagina que estás modelando los datos de una tienda en línea. Vamos a crear una estructura limpia para los pedidos:

```typescript
type Resultado = 'Aprobado' | 'Rechazado' | 'Pendiente';

interface Pedido {
  cliente: string;
  producto: string;
  cantidad: number;
  precioTotal: number;
  procesado: boolean;
  veredicto?: Resultado; // Solo aparece si procesado es true
}

const pedidoReciente: Pedido = {
  cliente: "Laura Gómez",
  producto: "Monitor 27''",
  cantidad: 1,
  precioTotal: 250,
  procesado: true,
  veredicto: 'Aprobado'
};

console.log(`Resultado del pedido: ${pedidoReciente.veredicto}`);
```
