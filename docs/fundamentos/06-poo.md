# Módulo 6: Programación Orientada a Objetos (POO)

En TypeScript, las clases son mucho más poderosas que en JavaScript básico porque nos permiten controlar quién puede ver o modificar la información interna de nuestros objetos.

## 6.1 Clases y Constructores
Una clase es el molde. El **constructor** es la función especial que se ejecuta en el momento en que creas una "instancia" (un objeto real basado en ese molde).

```typescript
class Cuenta {
  titular: string;
  saldo: number;

  constructor(titular: string, saldo: number) {
    this.titular = titular;
    this.saldo = saldo;
  }

  presentar(): void {
    console.log(`Cuenta de: ${this.titular} - Saldo: ${this.saldo}`);
  }
}

const miCuenta = new Cuenta("Cuenta Principal", 0);
miCuenta.presentar();
```

## 6.2 Modificadores de Acceso (La seguridad de TS)
Esta es la característica estrella de TypeScript en las clases. Te permite decidir qué tan "privada" es la información:

* **`public` (Por defecto):** Todo el mundo puede leer y cambiar la propiedad desde fuera de la clase.
* **`private`:** Solo se puede leer o modificar **dentro** de la propia clase. Es ideal para proteger datos sensibles (como una contraseña o un ID interno).
* **`protected`:** Similar a private, pero permite que las clases que "heredan" de esta también tengan acceso.
* **`readonly`:** Solo se puede asignar valor en el constructor y nunca más puede cambiar.

::: tip 💡 Atajo de TypeScript (Parameter Properties)
Puedes definir e inicializar propiedades directamente en el constructor para escribir menos código:
:::

```typescript
class Empleado {
  // TypeScript crea las propiedades automáticamente al poner el modificador en el constructor
  constructor(
    public readonly id: number,
    public nombre: string,
    private _sueldo: number
  ) {}

  mostrarSueldo() {
    // Solo puedo acceder a _sueldo aquí adentro
    console.log(`El sueldo es de ${this._sueldo}`);
  }
}
```

### `protected`: el punto medio entre `private` y `public`

A diferencia de `private`, un miembro `protected` sí puede ser usado por las clases que heredan (`extends`) de la clase donde se definió, aunque sigue sin ser accesible desde fuera. Es la opción correcta cuando una clase hija necesita trabajar directamente con un dato "interno" del padre:

```typescript
class CuentaBase {
  protected saldo: number = 0;

  protected depositar(monto: number) {
    this.saldo += monto;
  }
}

class CuentaAhorro extends CuentaBase {
  agregarInteres() {
    // Como 'saldo' es protected (no private), la clase hija SÍ puede acceder a ella
    this.depositar(this.saldo * 0.05);
    console.log(`Nuevo saldo con interés: ${this.saldo}`);
  }
}

const ahorro = new CuentaAhorro();
ahorro.agregarInteres();
// ahorro.saldo = 1000; <--- Error: 'saldo' es protected, no es visible fuera de la clase.
```

## 6.3 Herencia (Extends)
La herencia nos permite crear una clase basada en otra. La clase hija hereda todas las propiedades y métodos de la clase padre, pero puede añadir los suyos propios.

```typescript
class Persona {
  constructor(public nombre: string) {}
}

class Gerente extends Persona {
  constructor(nombre: string, public departamento: string) {
    super(nombre); // Llamamos al constructor de Persona
  }

  asignarTarea() {
    console.log(`${this.nombre} dirige el equipo de ${this.departamento}`);
  }
}

const jefe = new Gerente("Aldair", "Desarrollo");
jefe.asignarTarea();
```

## 6.4 Getters y Setters
A veces no quieres que alguien cambie un valor directamente, sino que pase por una "validación". Los `get` y `set` actúan como filtros.

```typescript
class SalaDeEventos {
  private _aforo: number = 0;

  get aforo(): number {
    return this._aforo;
  }

  set aforo(valor: number) {
    if (valor < 0) throw new Error("El aforo no puede ser negativo");
    this._aforo = valor;
  }
}

const salaPrincipal = new SalaDeEventos();
salaPrincipal.aforo = 300; // Usa el 'set'
console.log(salaPrincipal.aforo); // Usa el 'get'
```

## 6.5 Clases Abstractas
Son clases que sirven **únicamente como base**. No puedes crear un objeto directamente de ellas (`new Base()`), sino que obligas a otras clases a heredar de ellas.

```typescript
abstract class Evento {
  abstract calcularCosto(): number; // Obligas a las hijas a implementar esto
}

class Conferencia extends Evento {
  calcularCosto() { return 5000; }
}

// const generico = new Evento(); <--- Error: No se puede instanciar una clase abstracta.
const conferenciaAnual = new Conferencia();
console.log(`Costo estimado: ${conferenciaAnual.calcularCosto()}`);
```

## 🛠️ Aplicación Práctica en tu `main.ts`:
Vamos a crear una clase para gestionar un módulo genérico de tu sistema:

```typescript
class ModuloRegistros {
  constructor(
    public nombre: string,
    private _registros: any[] = []
  ) {}

  agregarRegistro(item: any) {
    this._registros.push(item);
    console.log(`${this.nombre}: Nuevo registro agregado.`);
  }

  get totalRegistros(): number {
    return this._registros.length;
  }
}

const moduloClientes = new ModuloRegistros("Gestión de Clientes");
moduloClientes.agregarRegistro({ id: 1, nombre: "Ana" });
console.log(`Total: ${moduloClientes.totalRegistros}`);
```
