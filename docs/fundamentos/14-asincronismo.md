# Módulo 14. Asincronismo

Hasta ahora, todas las instrucciones que has escrito en tus programas se ejecutan de manera **sincrónica**: una línea tras otra, en orden estricto, esperando a que la instrucción anterior termine por completo antes de pasar a la siguiente.

Sin embargo, el desarrollo web moderno exige otra dinámica. ¿Qué sucede cuando necesitas solicitar datos a un servidor remoto (una API), consultar una base de datos o descargar una imagen? Estas operaciones toman tiempo impredecible. Si la computadora se detuviera por completo a esperar la respuesta de un servidor, la interfaz de usuario se congelaría y dejaría de responder.

El **asincronismo** es el mecanismo que permite a JavaScript realizar tareas demoradas en segundo plano mientras el resto de la aplicación continúa ejecutándose con total fluidez.

## ¿Qué aprenderás?

En este módulo aprenderás a:

- **Comprender** la diferencia fundamental entre código síncrono y asíncrono.
- **Entender** el funcionamiento del bucle de eventos (*Event Loop*) en JavaScript.
- **Manejar** operaciones asíncronas modernas utilizando `async` y `await`.
- **Gestionar** respuestas y errores de red mediante la función global `fetch()`.

## 1. Síncrono vs. Asíncrono: La metáfora del restaurante

Para entender este concepto de manera intuitiva, imagina dos escenarios en un restaurante:

### A. Modelo síncrono (Bloqueante)
El mesero toma tu orden, va a la cocina, se queda de pie esperando inmóvil hasta que el chef termine de cocinar tu platillo, y solo entonces regresa a entregártelo. Nadie más puede ser atendido mientras tanto.

En JavaScript, esto significaría que si una consulta de red tarda 3 segundos, la página web entera dejaría de responder durante esos 3 segundos.

### B. Modelo asíncrono (No bloqueante)
El mesero toma tu orden, la entrega en la cocina y continúa atendiendo a otras mesas. Cuando el chef termina el platillo, le avisa al mesero mediante una señal (una notificación o llamada) para que regrese a entregarlo.

JavaScript opera de esta manera: lanza una tarea pesada en segundo plano y continúa ejecutando el resto del código hasta que los datos están listos para ser procesados.

## 2. Promesas (Promises): El puente del asincronismo

En JavaScript moderno, una operación asíncrona se representa mediante un objeto llamado **Promesa** (*Promise*).

Una promesa es literalmente una promesa sobre un valor que aún no está disponible, pero que lo estará en el futuro. Puede encontrarse en tres estados posibles:

1. **Pending (Pendiente):** La operación está en curso y aún no hay resultado.
2. **Fulfilled (Cumplida):** La operación se completó con éxito y la promesa devuelve un valor.
3. **Rejected (Rechazada):** Ocurrió un error durante el proceso y la promesa devuelve una razón del fallo.

## 3. La sintaxis moderna: `async` y `await`

Aunque antiguamente se utilizaban métodos encadenados (`.then()` y `.catch()`), hoy en día el estándar de la industria es utilizar la sintaxis limpia y legible basada en `async` y `await`.

- **`async`**: Se coloca antes de declarar una función para indicarle a JavaScript que esa función contendrá operaciones asíncronas.
- **`await`**: Se coloca antes de una promesa para pausar exclusivamente la ejecución dentro de esa función hasta que la promesa se resuelva, permitiendo que el resto del programa siga fluyendo.

## 4. Ejemplo práctico: Consumiendo información de una API real con `fetch()`

Una API (*Application Programming Interface*) es un servicio remoto que expone datos estructurados (generalmente en formato JSON). Vamos a consumir una API pública de prueba para obtener información de usuarios de forma asíncrona.

```javascript
// Declaramos una función asíncrona usando async
const obtenerDatosUsuario = async () => {
  try {
    console.log("1. Solicitando información al servidor...");

    // fetch realiza la petición HTTP en segundo plano. 
    // await pausa la función hasta que el servidor responda.
    const respuesta = await fetch("[https://jsonplaceholder.typicode.com/users/1](https://jsonplaceholder.typicode.com/users/1)");

    // Convertimos la respuesta cruda del servidor a un formato JSON legible en JavaScript
    const usuario = await respuesta.json();

    console.log("2. ¡Datos recibidos con éxito!");
    console.log("Nombre del usuario:", usuario.name);
    console.log("Correo electrónico:", usuario.email);
    console.log("Ciudad de residencia:", usuario.address.city);

  } catch (error) {
    // Si ocurre un error de red o la API falla, el código salta de forma segura aquí
    console.error("⚠️ Error crítico al obtener los datos:", error.message);
  } finally {
    console.log("3. Proceso de solicitud finalizado.");
  }
};

// Invocamos la función
obtenerDatosUsuario();
console.log("Mensaje inmediato: Este texto aparece en consola ANTES de que termine la API.");

```

### Analiza el orden de salida en la consola:

```text
1. Solicitando información al servidor...
Mensaje inmediato: Este texto aparece en consola ANTES de que termine la API.
2. ¡Datos recibidos con éxito!
Nombre del usuario: Leanne Graham
Correo electrónico: Sincere@april.biz
Ciudad de residencia: Gwenborough
3. Proceso de solicitud finalizado.

```

¡Observa la magia del asincronismo! El mensaje inmediato se imprimió antes de que el servidor respondiera, demostrando que la aplicación nunca se congeló mientras esperaba los datos de la red.

## 5. Experimenta

Crea un archivo de pruebas en tu entorno o entorno de navegador y ejecuta una consulta a otra ruta de prueba:

```javascript
const consultarProductosAPI = async () => {
  try {
    const respuesta = await fetch("[https://jsonplaceholder.typicode.com/posts/1](https://jsonplaceholder.typicode.com/posts/1)");
    const datos = await respuesta.json();
    console.log("Título del post obtenido:", datos.title);
  } catch (error) {
    console.error("Error:", error);
  }
};

consultarProductosAPI();

```

::: tip Preguntas para reflexionar

1. ¿Por qué es obligatorio colocar la palabra `await` antes de `fetch()` y de `respuesta.json()`? (Piénsalo: porque ambas operaciones devuelven promesas y necesitamos esperar sus resultados antes de continuar).
2. ¿Qué sucedería si eliminamos el bloque `try...catch` y el servidor remoto se cae o no hay conexión a internet? (La aplicación arrojaría una excepción no controlada).
:::

## 6. Errores comunes al comenzar

::: danger Errores típicos

* **Error 1: Olvidar colocar la palabra `await`.**
Intentar leer el resultado de una promesa directamente sin usar `await` provocará que obtengas un objeto de tipo `Promise { <pending> }` en lugar de los datos reales que esperabas.
* **Error 2: Usar `await` fuera de una función `async`.**
La palabra clave `await` solo puede utilizarse dentro de funciones declaradas con `async`. Usarla en el ámbito global fuera de una función generará un error de sintaxis crítico.
* **Error 3: No manejar errores de red con `try...catch`.**
Asumir que las peticiones a servidores externos siempre funcionarán a la primera, dejando el código vulnerable a caídas de conexión imprevistas.
:::

## 7. Ejercicios prácticos

### Ejercicio 1: Simulando un retraso asíncrono con `setTimeout`

A veces necesitas simular demoras artificiales en tu código (como un indicador de carga o *spinner*).

1. Crea una función asíncrona llamada `esperarSegundos` que reciba un número de milisegundos.
2. Utiliza una Promesa junto con `setTimeout` para resolver la espera.
3. Escribe un flujo que imprima `"Cargando..."`, espere 2 segundos mediante `await`, y finalmente imprima `"¡Carga completa!"`.

## 8. Lo que aprendید

| Concepto | Qué debes recordar |
| --- | --- |
| **Síncrono vs Asíncrono** | El código síncrono bloquea la ejecución secuencial; el asíncrono permite procesar tareas en segundo plano. |
| **Promesa (`Promise`)** | Objeto que representa el resultado futuro (exitoso o fallido) de una operación asíncrona. |
| **`async` / `await**` | Sintaxis moderna para pausar y gestionar funciones asíncronas de manera limpia y legible. |
| **`fetch()`** | Función global nativa utilizada para realizar peticiones HTTP y consumir APIs en la web. |

::: tip ¡Siguiente paso!
Antes de avanzar al siguiente módulo, asegúrate de comprender cómo estructurar una función con `async/await` y `try...catch`. En el Módulo 15 exploraremos los fundamentos de la Programación Orientada a Objetos (POO) y la organización del código.
:::