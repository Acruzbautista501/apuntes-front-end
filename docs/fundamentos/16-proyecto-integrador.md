# Módulo Final. Proyecto integrador

Has recorrido un camino extraordinario: desde comprender cómo piensa un programador hasta dominar variables, condicionales, ciclos, funciones, arreglos, objetos, asincronismo y programación orientada a objetos.

Ha llegado el momento de integrar todo el conocimiento adquirido en una aplicación real, funcional y cohesiva.

En este módulo no aprenderás conceptos nuevos, sino que aplicarás lo aprendido para construir un **Sistema de Punto de Venta y Gestión de Inventarios** en JavaScript puro, estructurado con clases, procesamiento asíncrono simulado y manipulación inmutable de datos.

## 1. El reto del proyecto

Vas a desarrollar un script modular que simule el núcleo lógico de una aplicación comercial de *e-commerce* o punto de venta (POS).

El sistema debe cumplir con los siguientes requisitos técnicos:

1. **Modelado con Clases (POO):** Utilizar clases para representar los productos del inventario y el carrito de compras.
2. **Inmutabilidad:** Actualizar carritos y catálogos sin mutar los datos originales utilizando el operador de propagación (`...`).
3. **Procesamiento de Arreglos:** Utilizar métodos modernos (`filter`, `map`, `find`, `reduce`) para calcular subtotales y aplicar reglas de negocio.
4. **Manejo de Errores y Asincronismo:** Simular la carga inicial de un catálogo remoto mediante una función asíncrona con `async`/`await` y `try...catch`.

## 2. Estructura de la aplicación

Divide tu solución en tres componentes lógicos principales:

* **Clase `Producto`:** Almacena los datos individuales (`id`, `nombre`, `precio`, `stock`).
* **Clase `Inventario`:** Administra el catálogo de productos disponibles y permite buscar o filtrar artículos.
* **Clase `Carrito`:** Gestiona los artículos seleccionados por el cliente, calcula subtotales, aplica descuentos y genera un ticket de compra formateado.

## 3. Código base de la solución

Crea un archivo llamado `app.js` en tu entorno de desarrollo y analiza cómo interactúan todas las piezas que has estudiado a lo largo del curso:

```javascript
// ==========================================
// 1. CLASE PRODUCTO (Modelado de entidades)
// ==========================================
class Producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }
}

// ==========================================
// 2. CLASE INVENTARIO (Gestión de catálogo)
// ==========================================
class Inventario {
  constructor() {
    this.productos = [];
  }

  agregarProducto(producto) {
    this.productos = [...this.productos, producto]; // Enfoque inmutable
  }

  // Simulación de carga asíncrona de productos externos
  async cargarCatalogoRemoto() {
    try {
      console.log("⏳ Conectando con el servidor para cargar inventario...");
      // Simulamos una demora de red con una Promesa
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Datos simulados de una API
      const datosRemotos = [
        new Producto(1, "Teclado Mecánico", 850, 12),
        new Producto(2, "Mouse Inalámbrico", 350, 25),
        new Producto(3, "Monitor LED 24\"", 2800, 5),
        new Producto(4, "Audífonos Gamer", 650, 8)
      ];

      this.productos = [...this.productos, ...datosRemotos];
      console.log("✅ ¡Catálogo cargado con éxito!\n");
    } catch (error) {
      console.error("⚠️ Error al cargar el inventario:", error.message);
    }
  }

  buscarPorId(id) {
    return this.productos.find((item) => item.id === id);
  }
}

// ==========================================
// 3. CLASE CARRITO (Lógica de compras y ticket)
// ==========================================
class Carrito {
  constructor() {
    this.items = []; // Estructura: { producto, cantidad }
  }

  agregarItem(producto, cantidad) {
    if (producto.stock < cantidad) {
      console.log(`⚠️ Stock insuficiente para ${producto.nombre}. Disponibles: ${producto.stock}`);
      return;
    }

    // Verificamos si el producto ya está en el carrito
    const itemExistente = this.items.find((i) => i.producto.id === producto.id);

    if (itemExistente) {
      // Actualizamos de forma inmutable
      this.items = this.items.map((i) =>
        i.producto.id === producto.id
          ? { ...i, cantidad: i.cantidad + cantidad }
          : i
      );
    } else {
      // Agregamos nuevo item de forma inmutable
      this.items = [...this.items, { producto, cantidad }];
    }

    console.log(`🛒 Agregado al carrito: ${cantidad}x ${producto.nombre}`);
  }

  calcularSubtotalGeneral() {
    return this.items.reduce((acumulador, item) => {
      return acumulador + (item.producto.precio * item.cantidad);
    }, 0);
  }

  generarTicket() {
    console.log("\n========== 🧾 TICKET DE COMPRA ==========");
    
    if (this.items.length === 0) {
      console.log("El carrito está vacío.");
      console.log("=========================================\n");
      return;
    }

    this.items.forEach((item) => {
      const subtotalItem = item.producto.precio * item.cantidad;
      console.log(`${item.cantidad}x ${item.producto.nombre} — $${item.producto.precio} c/u — Subtotal: $${subtotalItem}`);
    });

    const subtotal = this.calcularSubtotalGeneral();
    let descuento = 0;
    let porcentajeAplicado = 0;

    // Regla de negocio: Descuento del 10% si la compra supera los $2000
    if (subtotal >= 2000) {
      porcentajeAplicado = 10;
      descuento = subtotal * 0.10;
    }

    const totalFinal = subtotal - descuento;

    console.log("-----------------------------------------");
    console.log(`Subtotal general: $${subtotal}`);
    if (descuento > 0) {
      console.log(`Descuento aplicado (${porcentajeAplicado}%): -$${descuento}`);
    }
    console.log(`TOTAL A PAGAR: $${totalFinal}`);
    console.log("=========================================\n");
  }
}

// ==========================================
// 4. EJECUCIÓN DEL SISTEMA (Flujo principal)
// ==========================================
async function ejecutarSistema() {
  const miInventario = new Inventario();
  
  // Cargamos el inventario de forma asíncrona
  await miInventario.cargarCatalogoRemoto();

  const miCarrito = new Carrito();

  // El cliente selecciona productos del inventario
  const producto1 = miInventario.buscarPorId(1); // Teclado
  const producto2 = miInventario.buscarPorId(3); // Monitor

  if (producto1 && producto2) {
    miCarrito.agregarItem(producto1, 2); // 2 Teclados ($1700)
    miCarrito.agregarItem(producto2, 1); // 1 Monitor ($2800)
  }

  // Generamos el ticket final (Supera los $2000, aplicará el 10% de descuento)
  miCarrito.generarTicket();
}

// Arrancamos la aplicación
ejecutarSistema();

```

## 4. Resultado esperado en consola

Al ejecutar este script completo, obtendrás una salida estructurada y limpia que demuestra la integración armónica de todos los conceptos del curso:

```text
⏳ Conectando con el servidor para cargar inventario...
✅ ¡Catálogo cargado con éxito!

🛒 Agregado al carrito: 2x Teclado Mecánico
🛒 Agregado al carrito: 1x Monitor LED 24"

========== 🧾 TICKET DE COMPRA ==========
2x Teclado Mecánico — $850 c/u — Subtotal: $1700
1x Monitor LED 24" — $2800 c/u — Subtotal: $2800
-----------------------------------------
Subtotal general: $4500
Descuento aplicado (10%): -$450
TOTAL A PAGAR: $4050
=========================================

```

## 5. Experimenta y desafíate

Ahora que tienes la estructura base funcionando, intenta realizar las siguientes modificaciones por tu cuenta:

1. **Validación de stock:** Modifica el método `agregarItem` para que, si el usuario intenta comprar más unidades de las disponibles en el inventario, el sistema rechace la operación de forma segura.
2. **Nuevo descuento por categoría:** Añade una propiedad `categoria` a la clase `Producto` y aplica un descuento especial si el carrito incluye productos de una categoría específica (ej. `"Gamer"`).
3. **Manejo de errores defensivo:** Envuelve la selección de productos dentro de un bloque `try...catch` para evitar que la aplicación falle si se intenta buscar un ID de producto que no existe.


## 6. Conclusión de la guía

¡Felicidades! Has completado con éxito el temario de **Fundamentos de programación**.

Has transformado conceptos abstractos en herramientas prácticas, construyendo bases sólidas que te permitirán avanzar con total confianza hacia *frameworks* avanzados (como Vue.js o React), arquitecturas *backend* y el desarrollo de aplicaciones web profesionales. ¡Sigue programando y experimentando!