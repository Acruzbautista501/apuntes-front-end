
# Módulo 3: Tipado de Objetos e Interfaces

## 3.1 Objetos Literales
En JavaScript, un objeto puede crecer o cambiar de forma caprichosamente. En TypeScript, definimos la "forma" (*shape*) del objeto para evitar que intentemos acceder a propiedades que no existen.

### Definición en línea:
```typescript
const usuario: { nombre: string; edad: number } = {
  nombre: "Aldair",
  edad: 25
};
```
*Si intentas agregar `usuario.email = "..."`, TS te dará un error porque `email` no fue definido en la estructura original.*


## 3.2 Interfaces
Las **Interfaces** son la forma preferida de definir objetos en TypeScript. Son potentes, extensibles y fáciles de leer. Imagínalas como un "contrato" que un objeto debe cumplir.

```typescript
interface Jugador {
  id: number;
  nombre: string;
  posicion: string;
  goles?: number;      // Propiedad opcional
  readonly liga: string; // No se puede modificar después de creado
}

const goleador: Jugador = {
  id: 10,
  nombre: "Lionel Messi",
  posicion: "Delantero",
  liga: "MLS"
};
```

### Características clave:
* **Opcionales (`?`):** No todos los datos son obligatorios (ej. un usuario puede no tener segundo nombre).
* **Solo lectura (`readonly`):** Protege datos que no deben cambiar (ej. un ID de base de datos).


## 3.3 Tipos Personalizados (`Type Aliases`)
El `type` es muy similar a la interfaz, pero se usa para definir cualquier tipo de dato, no solo objetos. 

```typescript
type ID = string | number; // Un alias para una unión
type EstadoCivil = "soltero" | "casado" | "divorciado"; // Tipos literales

interface Producto {
  id: ID;
  nombre: string;
}
```

### ¿Cuál usar: `interface` o `type`?
* **Usa `interface`** para definir la estructura de objetos, especialmente si planeas heredarlas o extenderlas (es el estándar en la mayoría de proyectos de Front End).
* **Usa `type`** para uniones complejos, funciones, o tipos primitivos combinados.


## 3.4 Unión de Tipos (`Union Types`)
Esta es una de las herramientas más usadas al consumir APIs. Permite que una variable sea de uno o varios tipos.

```typescript
type ResultadoAPI = "success" | "error" | "loading";

function mostrarEstado(estado: ResultadoAPI) {
  console.log(`El sistema está en: ${estado}`);
}

mostrarEstado("success"); // ✅ Correcto
// mostrarEstado("desconectado"); // ❌ Error: no está en la unión
```

## 3.5 Extensión de Interfaces (Herencia)
En el desarrollo de interfaces de usuario, a menudo tienes estructuras que comparten campos. Puedes "heredar" de una para crear otra más específica.

```typescript
interface Persona {
  nombre: string;
}

interface Desarrollador extends Persona {
  lenguajeFavorito: string;
  esRemoto: boolean;
}

const dev: Desarrollador = {
  nombre: "Aldair",
  lenguajeFavorito: "TypeScript",
  esRemoto: true
};
```

## 3.6 Tipado de Objetos Dinámicos (Index Signatures)
A veces no sabes exactamente qué llaves tendrá un objeto (por ejemplo, un objeto que sirve como diccionario o traducciones), pero sí sabes qué tipo de datos tendrá dentro.

```typescript
interface Traducciones {
  [key: string]: string; // La llave es un string, el valor es un string
}

const appText: Traducciones = {
  welcome: "Bienvenido",
  logout: "Cerrar sesión",
  // 1: "Error" // ❌ Error: La llave debe ser string
};
```

::: tip 💡 Tip para Front End
Cuando trabajes con frameworks como **Vue** o **React**, usa Interfaces para definir las `Props` que recibe un componente. Esto garantiza que quien use tu componente le pase exactamente los datos que necesita, ni más ni menos.
:::
