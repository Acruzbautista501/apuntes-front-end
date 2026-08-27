# Módulo 7: Asincronismo y API Rest

El asincronismo permite que tu programa inicie una tarea larga y siga haciendo otras cosas mientras espera que esa tarea termine.

## 7.1 El Concepto de Promesa
Una **Promesa** es un objeto que representa un valor que estará disponible: **ahora, en el futuro o nunca**.

Tiene tres estados posibles:
1.  **Pending (Pendiente):** La tarea aún no termina.
2.  **Fulfilled (Resuelta):** La tarea terminó con éxito y tenemos los datos.
3.  **Rejected (Rechazada):** Algo salió mal (error de red, servidor caído).

## 7.2 Async / Await: La forma moderna
Antes se usaban muchos `.then()` y `.catch()`, lo que hacía el código difícil de leer. Hoy usamos `async` y `await`, que hacen que el código asíncrono parezca código normal y ordenado.

* **`async`**: Se coloca antes de la función para indicar que devolverá una promesa.
* **`await`**: Se coloca antes de una promesa para "esperar" a que se resuelva antes de pasar a la siguiente línea.

```typescript
async function obtenerDatos() {
  console.log("Cargando...");
  // El código se detiene aquí hasta que la promesa se resuelva
  const resultado = await algunaPromesa(); 
  console.log("Datos recibidos:", resultado);
}
```

## 7.3 Consumiendo APIs con `fetch`
`fetch` es la herramienta nativa del navegador para hacer peticiones HTTP. En TypeScript, es vital tipar lo que recibimos para no trabajar "a ciegas".

### Ejemplo práctico con una API real:
Imagina que queremos traer información de un Pokémon desde un JSON:

```typescript
interface Pokemon {
  id: number;
  name: string;
  height: number;
}

const getPokemon = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    
    if (!response.ok) throw new Error("No se encontró el recurso");

    const data: Pokemon = await response.json(); // Tipamos la respuesta
    console.log(`Nombre: ${data.name}, ID: ${data.id}`);
    
  } catch (error) {
    console.error("Hubo un error en la petición:", error);
  }
};

getPokemon(1); // Trae a Bulbasaur
```

## 7.4 Manejo de Errores con Try / Catch
Cuando trabajamos con redes, muchas cosas pueden fallar (te quedas sin internet, el servidor explota). Siempre debemos envolver nuestro código asíncrono en un bloque `try/catch`.

```typescript
try {
  // Intenta ejecutar este código
  const user = await fetchUser();
} catch (error) {
  // Si algo falla arriba, se ejecuta esto
  console.log("Error al obtener usuario");
} finally {
  // Esto se ejecuta SIEMPRE, haya error o no (ej. quitar un spinner de carga)
  console.log("Proceso terminado.");
}
```

## 7.5 Tipado de Respuestas Genéricas
A veces creamos funciones que traen datos de diferentes tipos. Podemos usar **Genéricos** para que la función sea reutilizable:

```typescript
interface Producto {
  nombre: string;
  precio: number;
}

async function peticionSegura<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return await res.json() as T;
}

// Uso:
const producto = await peticionSegura<Producto>('/api/producto/1');
```

## 🛠️ Aplicación Práctica en tu `main.ts`:
Para tu proyecto, podrías simular la carga de una lista de eventos desde un servidor (o un archivo JSON local en Vite):

```typescript
interface Evento {
  id: string;
  nombre: string;
  fecha: string;
}

const cargarEventos = async () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = '<p>Cargando eventos...</p>';

  try {
    // Simulamos una espera de 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const eventos: Evento[] = [
      { id: '1', nombre: 'Conferencia de TypeScript', fecha: '2026-09-10' },
      { id: '2', nombre: 'Taller de Vite', fecha: '2026-09-17' }
    ];

    app.innerHTML = '<ul>' + 
      eventos.map(e => `<li>${e.nombre} — ${e.fecha}</li>`).join('') + 
      '</ul>';

  } catch (err) {
    app.innerHTML = '<p>Error al cargar los eventos.</p>';
  }
};

cargarEventos();
```