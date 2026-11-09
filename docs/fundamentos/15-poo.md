
# Módulo 15. POO y organización del código

A medida que tus aplicaciones crecen en tamaño y complejidad, organizar funciones sueltas y variables globales deja de ser suficiente. Necesitas una forma de estructurar el código que imite entidades del mundo real, agrupando datos y comportamientos relacionados en un solo lugar.

La **Programación Orientada a Objetos (POO)** es un paradigma de programación que utiliza "clases" y "objetos" para modelar sistemas complejos de manera limpia, escalable y mantenible.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Comprender** qué es una clase y cómo funciona como una "plantilla" o molde.
- **Definir** constructores e inicializar propiedades dentro de una clase.
- **Crear** métodos (funciones internas) que otorgan comportamiento a los objetos.
- **Comprender** las bases de la organización modular del código en JavaScript.

## 1. ¿Qué es una clase? (El concepto del molde)

Imagina que estás construyendo una fábrica de automóviles. No diseñas cada auto desde cero; creas un plano o molde general (**clase**) que especifica qué propiedades tendrá el vehículo (color, marca, velocidad) y qué acciones podrá realizar (acelerar, frenar). A partir de ese único plano puedes fabricar cientos de automóviles independientes (**instancias u objetos**).

En JavaScript moderno, una **Clase** es una plantilla sintáctica para crear objetos con propiedades y comportamientos predefinidos.

Ejemplo básico de una clase:

```javascript
// Definición de la clase (por convención, la primera letra va en mayúscula)
class ProductoTienda {
  // El constructor es el método especial que inicializa las propiedades
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  // Método (comportamiento) asociado a la clase
  mostrarDetalle() {
    console.log(`Producto: ${this.nombre} | Precio: $${this.precio} | Stock: ${this.stock} unidades`);
  }
}

```

## 2. Creando instancias (Objetos a partir de la clase)

Para utilizar una clase, debemos "instanciarla" utilizando la palabra clave `new`. Cada vez que haces esto, la computadora genera un objeto independiente en memoria basado en la estructura de la clase.

```javascript
// Creamos objetos (instancias) independientes usando la clase ProductoTienda
const producto1 = new ProductoTienda("Teclado Mecánico", 850, 10);
const producto2 = new ProductoTienda("Mouse Inalámbrico", 350, 25);

// Invocamos el método de cada instancia
producto1.mostrarDetalle();
producto2.mostrarDetalle();

```

**Resultado:**

```text
Producto: Teclado Mecánico | Precio: $850 | Stock: 10 unidades
Producto: Mouse Inalámbrico | Precio: $350 | Stock: 25 unidades

```

::: tip ¿Qué significa `this`?
Dentro de una clase, la palabra clave `this` hace referencia directa a la instancia específica que se está creando o ejecutando en ese momento. Garantiza que `this.nombre` pertenezca exclusivamente al objeto que invocó la acción.
:::

## 3. Agregando métodos y lógica interna

Las clases no solo almacenan datos; su verdadero valor radica en encapsular la lógica de negocio relacionada con esos datos.

Ejemplo: Vamos a enriquecer nuestra clase para que permita vender unidades y verificar el stock de forma automática.

```javascript
class CarritoItem {
  constructor(producto, precio, cantidad) {
    this.producto = producto;
    this.precio = precio;
    this.cantidad = cantidad;
  }

  // Método para calcular el subtotal
  calcularSubtotal() {
    return this.precio * this.cantidad;
  }

  // Método para actualizar la cantidad de forma controlada
  actualizarCantidad(nuevaCantidad) {
    if (nuevaCantidad > 0) {
      this.cantidad = nuevaCantidad;
      console.log(`Cantidad actualizada a: ${this.cantidad}`);
    } else {
      console.log("⚠️ La cantidad debe ser mayor a cero.");
    }
  }
}

// Usando nuestra clase
const itemCarrito = new CarritoItem("Cuaderno Profesional", 45, 2);
console.log("Subtotal inicial:", itemCarrito.calcularSubtotal()); // 90

itemCarrito.actualizarCantidad(5);
console.log("Nuevo subtotal:", itemCarrito.calcularSubtotal()); // 225

```

**Resultado:**

```text
Subtotal inicial: 90
Cantidad actualizada a: 5
Nuevo subtotal: 225

```

## 4. Ejemplo práctico: Modelando usuarios de una plataforma

Vamos a estructurar un sistema sencillo para registrar y autenticar usuarios utilizando clases.

```javascript
class UsuarioSistema {
  constructor(nombre, correo, rol = "cliente") {
    this.nombre = nombre;
    this.correo = correo;
    this.rol = rol;
    this.activo = true;
  }

  // Método para simular el inicio de sesión
  saludar() {
    console.log(`Hola, soy ${this.nombre} y mi rol en el sistema es ${this.rol}.`);
  }

  // Método para desactivar la cuenta
  desactivarCuenta() {
    this.activo = false;
    console.log(`La cuenta de ${this.correo} ha sido desactivada.`);
  }
}

// Creación de objetos independientes
const usuario1 = new UsuarioSistema("Carlos Pérez", "carlos@email.com", "administrador");
const usuario2 = new UsuarioSistema("Sofía Gómez", "sofia@email.com"); // Usa el valor por defecto "cliente"

usuario1.saludar();
usuario2.saludar();

usuario2.desactivarCuenta();
console.log("¿Sofía sigue activa?", usuario2.activo);

```

**Resultado:**

```text
Hola, soy Carlos Pérez y mi rol en el sistema es administrador.
Hola, soy Sofía Gómez y mi rol en el sistema es cliente.
La cuenta de sofia@email.com ha sido desactivada.
¿Sofía sigue activa? false

```

## 5. Experimenta

Crea un archivo de pruebas en tu entorno y ejecuta el siguiente bloque:

```javascript
class Rectangulo {
  constructor(base, altura) {
    this.base = base;
    this.altura = altura;
  }

  calcularArea() {
    return this.base * this.altura;
  }

  calcularPerimetro() {
    return 2 * (this.base + this.altura);
  }
}

const miRectangulo = new Rectangulo(10, 5);
console.log("Área:", miRectangulo.calcularArea());
console.log("Perímetro:", miRectangulo.calcularPerimetro());

```

::: tip Preguntas para reflexionar

1. ¿Qué sucedería si creas una segunda instancia `new Rectangulo(20, 8)`? ¿Sus valores interfieren con `miRectangulo`? (Piénsalo: cada instancia vive en su propio espacio independiente en memoria).
2. ¿Por qué utilizamos la palabra `constructor` al declarar la clase?
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Olvidar la palabra clave `new`.**
Intentar invocar una clase como si fuera una función normal (`const obj = ProductoTienda(...)` sin `new`) provocará un error crítico de ejecución en JavaScript.
* **Error 2: Confundir funciones tradicionales con métodos de clase.**
Dentro de una clase no se utiliza la palabra `function` para declarar los métodos. Se escriben directamente con su nombre seguido de paréntesis (`metodo() { ... }`).
* **Error 3: Olvidar usar `this` dentro de los métodos.**
Intentar acceder a las propiedades internas escribiendo solo `nombre` en lugar de `this.nombre`, lo que provocará que JavaScript busque una variable local inexistente.
:::

## 7. Ejercicios prácticos

### Ejercicio 1: Creando una clase para cuentas bancarias

1. Crea una clase llamada `CuentaBancaria` que reciba en su constructor el titular y un saldo inicial `saldo` (por defecto `0`).
2. Añade un método `depositar(monto)` que incremente el saldo y muestre un mensaje con el nuevo total.
3. Añade un método `consultarSaldo()` que imprima el saldo actual en la consola.
4. Instancia un objeto, realiza un par de depósitos y consulta el saldo final.

## 8. Lo que aprendiste

| Concepto | Qué debes recordar |
| --- | --- |
| **Clase (`class`)** | Plantilla o molde estructural para crear objetos con propiedades y comportamientos comunes. |
| **Instancia** | Objeto individual creado a partir de una clase utilizando la palabra clave `new`. |
| **`constructor`** | Método especial encargado de inicializar las propiedades de cada instancia creada. |
| **`this`** | Referencia interna que apunta directamente a la instancia actual del objeto. |

::: tip ¡Siguiente paso!
Antes de avanzar al último módulo, asegúrate de dominar cómo estructurar clases y métodos. En el Módulo 16 concluiremos con el Proyecto Integrador, donde pondrás en práctica todo lo aprendido.
:::