
# Módulo 5: Interfaces y Tipos Personalizados

En este nivel, aprenderemos a definir "contratos". Una **Interface** o un **Type** le dice a tu programa: "Cualquier objeto que diga ser un *Usuario* DEBE tener estas propiedades específicas".

## 5.1 Interfaces: El Contrato de Objetos
Las interfaces se usan principalmente para definir la estructura de un **objeto**. Son ideales porque son extensibles y fáciles de leer.

```typescript
interface Jugador {
  id: number;
  nombre: string;
  posicion: string;
  goles?: number; // Propiedad opcional
  readonly equipo: string; // No se puede modificar después de creado
}

const nuevoJugador: Jugador = {
  id: 1,
  nombre: "Aldair",
  posicion: "Delantero",
  equipo: "TypeScript FC"
};

// nuevoJugador.equipo = "Otro"; <--- Error: Es de solo lectura.
```

## 5.2 Type Aliases (Alias de Tipo)
A diferencia de las interfaces, los `type` son más versátiles. No solo sirven para objetos, sino para crear **uniones** o combinaciones de tipos.

### Uniones de String (Literales)
Esto es extremadamente útil para limitar los valores que puede recibir una variable.

```typescript
type EstadoPartido = 'programado' | 'en_curso' | 'finalizado' | 'suspendido';

let estadoActual: EstadoPartido = 'en_curso';
// estadoActual = 'jugando'; <--- Error: No existe en la unión.
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

interface Estadio {
  nombre: string;
  capacidad: number;
  ubicacion: Ubicacion; // Interfaz anidada
}

const miEstadio: Estadio = {
  nombre: "Estadio Azteca",
  capacidad: 87000,
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
Imagina que estás modelando los datos para tu liga de fútbol. Vamos a crear una estructura limpia para los resultados:

```typescript
type Resultado = 'Gana Local' | 'Gana Visitante' | 'Empate';

interface Partido {
  local: string;
  visitante: string;
  golesLocal: number;
  golesVisitante: number;
  finalizado: boolean;
  veredicto?: Resultado; // Solo aparece si finalizado es true
}

const partidoSemana: Partido = {
  local: "Vite FC",
  visitante: "Tailwind United",
  golesLocal: 2,
  golesVisitante: 1,
  finalizado: true,
  veredicto: 'Gana Local'
};

console.log(`Resultado del partido: ${partidoSemana.veredicto}`);
```
