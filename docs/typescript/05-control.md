
# Módulo 5: Tipado Avanzado y Control de Flujo

## 5.1 Enums (Enumeraciones)
Los `Enums` permiten definir un conjunto de constantes con nombre. Son ideales para representar estados de un pedido, roles de usuario o categorías fijas, haciendo el código más legible que usar simples números o strings.

```typescript
enum RolUsuario {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Lector = "LECTOR"
}

const miRol: RolUsuario = RolUsuario.Admin;

if (miRol === RolUsuario.Admin) {
  console.log("Tienes acceso total");
}
```
* **Ventaja:** Si cambias el valor en el Enum, se actualiza en todo tu proyecto automáticamente.


## 5.2 Type Assertions (`as`)
A veces, tú sabes más sobre el tipo de un valor que TypeScript. Por ejemplo, al obtener un elemento del DOM, TS sabe que es un `Element`, pero tú sabes que es específicamente un `HTMLCanvasElement`.

```typescript
const miCanvas = document.getElementById("main-canvas") as HTMLCanvasElement;

// Ahora tienes acceso a métodos específicos de canvas
miCanvas.getContext("2d");
```
> **Advertencia:** Úsalo con moderación. Si mientes a TypeScript (diciendo que algo es un canvas cuando no lo es), el código fallará en el navegador.


## 5.3 Type Guards (Guardias de Tipo)
Un **Type Guard** es una expresión lógica que permite estrechar (*narrowing*) el tipo de una variable dentro de un bloque condicional. Es la forma segura de manejar `Union Types`.

### Usando `typeof` (Para tipos primitivos):
```typescript
function procesarId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // Aquí TS sabe que es string
  } else {
    console.log(id.toFixed(2)); // Aquí TS sabe que es number
  }
}
```

### Usando `in` (Para propiedades en objetos):
```typescript
interface Perro { ladrar: () => void }
interface Gato { maullar: () => void }

function hacerSonido(animal: Perro | Gato) {
  if ("ladrar" in animal) {
    animal.ladrar();
  } else {
    animal.maullar();
  }
}
```

## 5.4 Literales de Cadena y Tipos de Unión
En el Front End, esto es extremadamente útil para definir estados de componentes (ej. colores de un botón o posiciones de un tooltip).

```typescript
type BotonColor = "primary" | "secondary" | "danger";

function crearBoton(color: BotonColor) {
  // ...
}

crearBoton("primary"); // ✅ Correcto
// crearBoton("verde"); // ❌ Error: no está permitido
```


## 5.5 Tipado de Intersección (`&`)
Mientras que la Unión (`|`) es "uno u otro", la **Intersección** combina múltiples tipos en uno solo. Es útil para "mezclar" configuraciones o plugins.

```typescript
interface ConNombre { nombre: string }
interface ConEdad { edad: number }

type PersonaCompleta = ConNombre & ConEdad;

const usuario: PersonaCompleta = {
  nombre: "Aldair",
  edad: 25
};
```

## 5.6 Discriminated Unions (Uniones Discriminadas)
Esta es una técnica avanzada pero muy común al manejar estados de carga en aplicaciones web. Consiste en usar una propiedad común (como `status` o `type`) para diferenciar interfaces.

```typescript
interface EstadoCargando { status: "loading" }
interface EstadoExito { status: "success"; data: string[] }
interface EstadoError { status: "error"; mensaje: string }

type EstadoAPI = EstadoCargando | EstadoExito | EstadoError;

function manejarRespuesta(estado: EstadoAPI) {
  switch (estado.status) {
    case "loading":
      return "Cargando...";
    case "success":
      return `Datos: ${estado.data.length}`;
    case "error":
      return `Error: ${estado.mensaje}`;
  }
}
```
::: tip 💡 Tip para Front End
Las **Uniones Discriminadas** son tu mejor aliado cuando trabajas con **Firebase** o **fetch**. Te permiten obligar a tu código a manejar el caso de error antes de intentar acceder a los datos, evitando que tu aplicación de Front End se rompa inesperadamente.
:::
