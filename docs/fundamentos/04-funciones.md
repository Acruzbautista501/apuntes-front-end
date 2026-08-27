# Módulo 4: Funciones en TypeScript

Una función en TypeScript no es solo un conjunto de pasos; es un **contrato**. Si dices que una función recibe un número, TypeScript se asegurará de que nadie le pase un texto por error.

## 4.1 Declaración, Parámetros y Retorno
La sintaxis básica incluye el tipado de los argumentos y el tipo de dato que la función devuelve (el *return*).

```typescript
function sumar(a: number, b: number): number {
  return a + b;
}

const resultado = sumar(10, 5); // Correcto
// const error = sumar("10", 5); <--- Error: 'string' no es 'number'.
```

### El tipo `void`
Si una función no devuelve nada (por ejemplo, solo imprime en consola o modifica el DOM), el tipo de retorno es `void`.

```typescript
function saludar(nombre: string): void {
  console.log(`Hola, ${nombre}`);
}
```
## 4.2 Parámetros Opcionales y por Defecto

No siempre necesitamos enviar todos los datos. TypeScript nos permite ser flexibles:

* **Opcionales (`?`)**: Se indica con un signo de interrogación. Si no se envía, su valor será `undefined`.
* **Por defecto (`=`)**: Si el usuario no envía el dato, la función toma un valor predefinido.

```typescript
function crearUsuario(nombre: string, edad?: number, pais: string = "México"): string {
  return `${nombre} tiene ${edad ?? "edad desconocida"} años y vive en ${pais}`;
}

console.log(crearUsuario("Aldair", 28)); // "Aldair tiene 28 años y vive en México"
console.log(crearUsuario("Nico"));       // "Nico tiene edad desconocida años y vive en México"
```

## 4.3 Arrow Functions (Funciones de Flecha)
Es la sintaxis más moderna y utilizada en el desarrollo con frameworks como Vue o React. Son más cortas y mantienen el contexto de `this`.

```typescript
const multiplicar = (x: number, y: number): number => x * y;

// Si solo tiene una línea, el return es implícito:
const cuadrado = (n: number): number => n * n;
```

## 4.4 Funciones de Orden Superior (Callbacks)
En el desarrollo web, es común pasar una función como argumento a otra (por ejemplo, al hacer clic en un botón o al recorrer un array).

```typescript
function procesarEntrada(nombre: string, callback: (n: string) => void): void {
  console.log("Iniciando proceso...");
  callback(nombre);
}

procesarEntrada("Aldair", (n) => {
  console.log(`Bienvenido al sistema, ${n}`);
});
```

## 4.5 Tipando la Firma de una Función
A veces querrás definir la "forma" de una función antes de crearla, usando un `type` o una `interface`. Esto es muy útil para mantener el orden en proyectos grandes.

```typescript
type OperacionMatematica = (a: number, b: number) => number;

const resta: OperacionMatematica = (a, b) => a - b;
const division: OperacionMatematica = (a, b) => a / b;
```

## 🛠️ Aplicación Práctica en tu `main.ts`:
Imagina que estás gestionando el programa de lealtad de una tienda. Vamos a crear una función que sume puntos a un cliente cuando realiza una compra:

```typescript
interface Cliente {
  nombre: string;
  puntos: number;
}

const sumarPuntos = (cliente: Cliente, compraRealizada: boolean): void => {
  if (compraRealizada) {
    cliente.puntos += 3;
    console.log(`¡Compra registrada! ${cliente.nombre} ahora tiene ${cliente.puntos} puntos.`);
  } else {
    cliente.puntos += 1;
    console.log(`${cliente.nombre} sumó puntos por su visita.`);
  }
};

const clienteFrecuente: Cliente = { nombre: "Ana", puntos: 10 };
sumarPuntos(clienteFrecuente, true);
```
