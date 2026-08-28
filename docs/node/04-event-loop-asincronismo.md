# Módulo 4: El Event Loop y Asincronismo a Fondo

El **Event Loop** es, probablemente, el concepto más importante para entender por qué Node.js es capaz de manejar miles de conexiones simultáneas con un solo hilo principal de ejecución. Este módulo explica su mecánica y los patrones de asincronismo construidos sobre ella.

## 4.1 Node.js es de un Solo Hilo (Pero no Bloqueante)

JavaScript en Node.js ejecuta código en un **único hilo principal** — no hay hilos paralelos ejecutando tu código de aplicación simultáneamente (a diferencia de lenguajes como Java o Go). Sin embargo, Node.js **no se bloquea** esperando operaciones lentas (leer un archivo, consultar una base de datos, hacer una petición HTTP) gracias al Event Loop y a un pool de hilos interno para operaciones de I/O, gestionado por **libuv** (la librería en C que Node usa internamente).

## 4.2 El Problema que Resuelve: Código Bloqueante

```javascript
// ❌ Código síncrono/bloqueante: detiene TODO el servidor mientras se ejecuta
import fs from 'node:fs'

const contenido = fs.readFileSync('archivo-grande.txt', 'utf-8') // Bloquea el hilo completo
console.log('Listo')
```

Mientras `readFileSync` se ejecuta, **ninguna otra petición** al servidor puede procesarse — el único hilo de Node.js está completamente ocupado esperando esa operación.

```javascript
// ✅ Código asíncrono/no bloqueante: el hilo queda libre para atender otras tareas mientras espera
import fs from 'node:fs/promises'

const contenido = await fs.readFile('archivo-grande.txt', 'utf-8') // No bloquea el hilo
console.log('Listo')
```

## 4.3 Cómo Funciona el Event Loop (Modelo Conceptual)

```text
1. El código síncrono se ejecuta primero, de principio a fin.
2. Las operaciones asíncronas (I/O, timers) se "delegan" fuera del hilo principal.
3. El Event Loop revisa constantemente si alguna operación delegada ya terminó.
4. Cuando termina, su callback correspondiente se encola para ejecutarse.
5. El Event Loop ejecuta esos callbacks cuando el hilo principal está libre.
```

Esto explica por qué Node.js puede iniciar 1000 consultas a una base de datos "al mismo tiempo" sin crear 1000 hilos — cada consulta se delega, y el hilo principal simplemente procesa los resultados a medida que van llegando, sin esperar bloqueado por ninguna de ellas individualmente.

## 4.4 Callbacks — El Patrón Original

```javascript
import fs from 'node:fs'

fs.readFile('archivo.txt', 'utf-8', (error, contenido) => {
  if (error) {
    console.error('Error:', error)
    return
  }
  console.log(contenido)
})

console.log('Esto se imprime ANTES que el contenido del archivo')
```

El patrón de callback (una función que se ejecuta cuando la operación termina) fue el mecanismo original de Node.js — hoy en día se considera principalmente legado, reemplazado por promesas en código nuevo, pero sigue apareciendo en APIs antiguas y algunos paquetes de NPM.

## 4.5 *Callback Hell* — Por Qué se Abandonó

```javascript
// El problema clásico de anidar callbacks sucesivos
obtenerUsuario(id, (error, usuario) => {
  obtenerPedidos(usuario.id, (error, pedidos) => {
    obtenerDetallesPedido(pedidos[0].id, (error, detalles) => {
      // Cada vez más anidado, difícil de leer y de manejar errores consistentemente
    })
  })
})
```

## 4.6 Promesas — La Solución Moderna

```typescript
function obtenerUsuario(id: number): Promise<Usuario> {
  return new Promise((resolve, reject) => {
    // Lógica asíncrona; resolve(valor) en éxito, reject(error) en fallo
  })
}

obtenerUsuario(1)
  .then((usuario) => obtenerPedidos(usuario.id))
  .then((pedidos) => console.log(pedidos))
  .catch((error) => console.error('Error en la cadena:', error))
```

Una promesa representa un valor que estará disponible en el futuro (o un error) — encadenar `.then()` evita el anidamiento creciente del *callback hell*, aunque sigue siendo menos legible que `async`/`await`.

## 4.7 `async`/`await` — La Sintaxis Estándar Moderna

```typescript
async function obtenerDatosCompletos(id: number) {
  try {
    const usuario = await obtenerUsuario(id)
    const pedidos = await obtenerPedidos(usuario.id)
    const detalles = await obtenerDetallesPedido(pedidos[0].id)
    return detalles
  } catch (error) {
    console.error('Error en la cadena:', error)
    throw error
  }
}
```

`async`/`await` es azúcar sintáctico sobre promesas — el código se lee de forma secuencial (como código síncrono), pero sigue siendo completamente no bloqueante por debajo. Es el estándar recomendado para todo código nuevo en Node.js con TypeScript.

## 4.8 Ejecutar Operaciones en Paralelo con `Promise.all`

```typescript
// ❌ Secuencial: cada await espera a que termine el anterior, aunque no dependan entre sí
const usuario = await obtenerUsuario(1)
const productos = await obtenerProductos()
const configuracion = await obtenerConfiguracion()

// ✅ Paralelo: las tres operaciones se inician simultáneamente
const [usuario, productos, configuracion] = await Promise.all([
  obtenerUsuario(1),
  obtenerProductos(),
  obtenerConfiguracion()
])
```

Cuando varias operaciones asíncronas no dependen entre sí, `Promise.all` las ejecuta en paralelo, reduciendo significativamente el tiempo total de espera comparado con ejecutarlas una tras otra innecesariamente.

## 4.9 `Promise.allSettled` — Cuando Algunas Pueden Fallar

```typescript
const resultados = await Promise.allSettled([
  obtenerUsuario(1),
  obtenerUsuario(999) // Puede fallar si no existe
])

resultados.forEach((resultado) => {
  if (resultado.status === 'fulfilled') {
    console.log('Éxito:', resultado.value)
  } else {
    console.log('Falló:', resultado.reason)
  }
})
```

A diferencia de `Promise.all` (que falla por completo si **cualquiera** de las promesas falla), `Promise.allSettled` espera a que todas terminen, sin importar si algunas tuvieron éxito y otras fallaron.

## 4.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Que una operación no bloquee el hilo principal | Versiones asíncronas de las APIs (`fs/promises` en vez de `fs` síncrono) |
| Código asíncrono legible y secuencial | `async`/`await` |
| Ejecutar varias operaciones independientes en paralelo | `Promise.all([...])` |
| Ejecutar varias operaciones donde algunas pueden fallar sin detener las demás | `Promise.allSettled([...])` |
| Manejar errores en código asíncrono | `try`/`catch` alrededor de `await` |

## 4.11 Errores Comunes

- **Usar versiones síncronas de APIs de I/O en un servidor real** (`readFileSync`, `execSync`): bloquea el hilo principal, impidiendo que el servidor atienda otras peticiones mientras se ejecuta.
- **Encadenar `await` innecesariamente en operaciones independientes**: desperdicia tiempo esperando secuencialmente cuando `Promise.all` podría ejecutarlas en paralelo.
- **Olvidar `try`/`catch` alrededor de `await`**: una promesa rechazada sin manejar puede terminar el proceso de Node.js de forma abrupta, o dejar la petición HTTP colgada sin respuesta.
