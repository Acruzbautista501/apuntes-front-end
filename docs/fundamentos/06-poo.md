
# Módulo 6: Programación Orientada a Objetos (POO)

En TypeScript, las clases son mucho más poderosas que en JavaScript básico porque nos permiten controlar quién puede ver o modificar la información interna de nuestros objetos.

## 6.1 Clases y Constructores
Una clase es el molde. El **constructor** es la función especial que se ejecuta en el momento en que creas una "instancia" (un objeto real basado en ese molde).

```typescript
class Equipo {
  nombre: string;
  puntos: number;

  constructor(nombre: string, puntos: number) {
    this.nombre = nombre;
    this.puntos = puntos;
  }

  presentar(): void {
    console.log(`Equipo: ${this.nombre} - Puntos: ${this.puntos}`);
  }
}

const miEquipo = new Equipo("Vite FC", 0);
miEquipo.presentar();
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
class Jugador {
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

## 6.3 Herencia (Extends)
La herencia nos permite crear una clase basada en otra. La clase hija hereda todas las propiedades y métodos de la clase padre, pero puede añadir los suyos propios.

```typescript
class Persona {
  constructor(public nombre: string) {}
}

class Entrenador extends Persona {
  constructor(nombre: string, public estrategia: string) {
    super(nombre); // Llamamos al constructor de Persona
  }

  darInstrucciones() {
    console.log(`${this.nombre} ordena jugar con un ${this.estrategia}`);
  }
}

const dt = new Entrenador("Aldair", "4-3-3");
dt.darInstrucciones();
```

## 6.4 Getters y Setters
A veces no quieres que alguien cambie un valor directamente, sino que pase por una "validación". Los `get` y `set` actúan como filtros.

```typescript
class Estadio {
  private _capacidad: number = 0;

  get capacidad(): number {
    return this._capacidad;
  }

  set capacidad(valor: number) {
    if (valor < 0) throw new Error("La capacidad no puede ser negativa");
    this._capacidad = valor;
  }
}

const azteca = new Estadio();
azteca.capacidad = 87000; // Usa el 'set'
console.log(azteca.capacidad); // Usa el 'get'
```

## 6.5 Clases Abstractas
Son clases que sirven **únicamente como base**. No puedes crear un objeto directamente de ellas (`new Base()`), sino que obligas a otras clases a heredar de ellas.

```typescript
abstract class Torneo {
  abstract calcularPremios(): number; // Obligas a las hijas a implementar esto
}

class LigaLocal extends Torneo {
  calcularPremios() { return 5000; }
}
```

## 🛠️ Aplicación Práctica en tu `main.ts`:
Vamos a crear una clase para gestionar los módulos de tu sistema de fútbol:

```typescript
class ModuloFutbol {
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

const moduloEquipos = new ModuloFutbol("Gestión de Equipos");
moduloEquipos.agregarRegistro({ id: 1, nombre: "Tigres" });
console.log(`Total: ${moduloEquipos.totalRegistros}`);
```
