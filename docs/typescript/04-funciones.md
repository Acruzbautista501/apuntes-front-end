
# Módulo 4: Funciones en el Front End

## 4.1 Tipado de Parámetros y Retorno
En JavaScript, una función puede recibir cualquier cosa y devolver cualquier cosa. En TypeScript, definimos qué entra y qué sale para evitar errores de lógica.

### Sintaxis básica:
```typescript
function calcularIva(precio: number): number {
  return precio * 0.16;
}

const total = calcularIva(100); // ✅ Correcto
// const error = calcularIva("cien"); // ❌ Error: Argumento debe ser 'number'
```

* **Parámetros:** Se tipan después del nombre de la variable (`precio: number`).
* **Retorno:** Se tipa después de los paréntesis de la función (`: number`).

## 4.2 Funciones de Flecha (Arrow Functions)
Son el estándar en frameworks modernos. La sintaxis de tipado es muy similar, pero se integra dentro de la declaración de la constante.

```typescript
const saludar = (nombre: string): string => {
  return `Hola, ${nombre}`;
};
```

Si la función no devuelve nada (por ejemplo, solo imprime un log o cambia una variable global), usamos el tipo **`void`**:

```typescript
const logError = (msg: string): void => {
  console.error(msg);
};
```

## 4.3 Parámetros Opcionales y por Defecto
Igual que con las interfaces, podemos marcar parámetros como opcionales con `?`, o asignarles un valor inicial.

```typescript
// Opcional
function crearMensaje(texto: string, usuario?: string): string {
  return usuario ? `${usuario}: ${texto}` : texto;
}

// Por defecto (TS infiere el tipo del valor inicial)
const login = (email: string, recordar: boolean = false) => {
  // lógica de login
};
```

## 4.4 Tipado de Eventos (Fundamental para Web)
Este es el punto donde muchos desarrolladores se confunden. Cuando usas `addEventListener`, TypeScript necesita saber qué tipo de evento estás manejando para darte el autocompletado correcto (como `target` o `value`).

### Eventos de Ratón (Clicks):
```typescript
const boton = document.querySelector('#btn-enviar');

boton?.addEventListener('click', (event: MouseEvent) => {
  console.log("Coordenada X:", event.clientX);
});
```

### Eventos de Formulario (Inputs):
Para obtener el valor de un input, necesitamos decirle a TS que el objetivo del evento es un elemento de entrada de HTML.

```typescript
const inputNombre = document.querySelector('#nombre');

const manejarInput = (event: Event) => {
  // Hacemos un "casting" o aserción para acceder a .value
  const target = event.target as HTMLInputElement;
  console.log("El usuario escribió:", target.value);
};
```

## 4.5 Funciones como Propiedades (Callbacks)
A menudo pasamos funciones como argumentos a otras funciones (común en componentes de Vue/React que emiten eventos al padre).

```typescript
interface BotonProps {
  texto: string;
  onClick: (id: number) => void; // Definimos que recibe un número y no retorna nada
}

const miBoton: BotonProps = {
  texto: "Eliminar",
  onClick: (id) => console.log(`Eliminando registro ${id}`)
};
```

## 4.6 El tipo `never`
A diferencia de `void` (que termina la función sin devolver nada), `never` se usa para funciones que **nunca terminan** o que siempre lanzan una excepción.

```typescript
function lanzarError(mensaje: string): never {
  throw new Error(mensaje);
}
```

::: tip 💡 Tip para Front End
Cuando definas manejadores de eventos en frameworks (como `@click` en Vue o `onClick` en React), intenta siempre tipar el evento. Esto evitará el molesto error de `"Property 'value' does not exist on type 'EventTarget'"` al intentar leer lo que alguien escribió en un buscador.
:::