---
title: Módulo 1 - Fundamentos de TypeScript
description: Aprende las bases de TypeScript enfocadas al desarrollo frontend profesional.
head:
  - - meta
    - name: keywords
      content: typescript, frontend, curso, principiantes, interfaces, types
---

# Módulo 1: Fundamentos de TypeScript

Perfecto. Vamos a hacerlo **bien y en serio**. Este no es un resumen rápido; es un curso diseñado para que entiendas la lógica detrás del código y cómo aplicarlo en proyectos reales.

::: info OBJETIVO DEL MÓDULO
Al finalizar esta sección, serás capaz de:
- Entender el flujo de trabajo de TypeScript.
- Tipar variables, objetos, arrays y funciones con precisión.
- Diferenciar entre `type` e `interface` con criterio profesional.
- Evitar el uso indiscriminado de `any`.
:::

## 1.1 ¿Qué es TypeScript?

**TypeScript** es un superconjunto de **JavaScript** que añade **tipado estático**. En palabras simples, le permite a tu código tener un "contrato" claro.

### Comparativa Rápida

| Característica | JavaScript | TypeScript |
| :--- | :--- | :--- |
| **Tipo de lenguaje** | Dinámico | Estático |
| **Detección de errores** | En tiempo de ejecución (Runtime) | En tiempo de compilación |
| **Autocompletado** | Limitado / Básico | Inteligente y preciso (IntelliSense) |
| **Curva de aprendizaje** | Baja | Media |

### El valor real en código
En JS, una suma puede fallar silenciosamente:
```js
function sumar(a, b) {
  return a + b;
}
sumar(10, 20) // 30
sumar(10, "20"); // Resultado: "1020" (Bug potencial)
````

En TS, el error se detiene antes de nacer:
```ts
function sumar(a: number, b: number): number {
  return a + b;
}
sumar(10, "20"); // ❌ Error: Argument of type 'string' is not assignable to 'number'
````

## 1.2 ¿Por qué aprender TypeScript si ya sé JavaScript?

Buena pregunta.

Porque **JavaScript funciona**, sí.  
Pero cuando tu proyecto crece, también crecen:

- los errores
- la complejidad
- las dependencias entre componentes
- los datos de APIs
- las validaciones
- los formularios
- los estados
- las pantallas
- las reglas de negocio

Entonces, **TypeScript te ayuda a tener control**.

:::tip Idea clave
**TypeScript no reemplaza JavaScript.**  
Lo que hace es ayudarte a escribir JavaScript **más seguro, más claro y más mantenible**.
:::

---

### ¿Qué problema resuelve TypeScript?

Cuando haces proyectos pequeños, muchas cosas parecen simples.

Pero en aplicaciones reales empiezan a aparecer preguntas como estas:

- ¿Qué estructura tiene este objeto?
- ¿Qué datos devuelve esta API?
- ¿Qué tipo de dato espera esta función?
- ¿Qué props recibe este componente?
- ¿Qué campos tiene este formulario?
- ¿Qué pasa si una propiedad viene `undefined`?
- ¿Qué ocurre si envío un `string` donde esperaba un `number`?

En JavaScript puro, muchos de esos errores se descubren **hasta que ejecutas la aplicación**.

En cambio, con TypeScript muchos errores se detectan **antes de correr el proyecto**.

:::warning En frontend real esto importa mucho
En aplicaciones modernas no trabajas solo con variables simples.  
Trabajas con:

- respuestas de APIs
- formularios complejos
- tablas
- filtros
- autenticación
- permisos
- componentes reutilizables
- estados globales
- reglas de negocio

Y ahí es donde TypeScript deja de ser “algo opcional” y se vuelve una **herramienta profesional**.
:::

---

### ¿Cómo te ayuda TypeScript en frontend real?

#### 1) Consumir APIs sin romper tu UI

Uno de los problemas más comunes en frontend es asumir que una API devuelve cierta estructura…  
y luego descubrir que no era así.

##### Sin TypeScript

```js
const user = await fetchUser()

console.log(user.name)
console.log(user.email)
````
Aquí tú asumes que user tiene name y email.

Pero si la API cambia, o si devuelve algo incompleto, tu interfaz puede romperse.

Con **TypeScript**:
```ts
interface User {
  id: number
  name: string
  email: string
}
````
Ahora ya sabes exactamente qué estructura debe tener ese usuario.
```ts
const user: User = await fetchUser()

console.log(user.name)
console.log(user.email)
````
:::info Ventaja real
Ya no trabajas “a ciegas”.
Ahora tu editor y TypeScript te ayudan a saber:

qué propiedades existen
cuáles son obligatorias
qué tipo de datos contiene cada una
:::

#### 2) Tipar formularios
Los formularios son una fuente clásica de errores.

Por ejemplo, en un login necesitas saber exactamente qué campos existen.
```ts
interface LoginForm {
  email: string
  password: string
}
````
Ahora puedes usar esa estructura como base para tu formulario:
```ts
const form: LoginForm = {
  email: '',
  password: ''
}
````
##### ¿Qué ganas con esto?
- Evitas nombres de campos mal escritos
- Mantienes consistencia en todo el proyecto
- Tus validaciones son más claras
- Tu autocompletado mejora muchísimo

:::tip Mentalidad profesional
Cuando defines el tipo de un formulario, no solo estás “tipando”.
Estás documentando la estructura real de tus datos.
:::

#### 3) Tipar listas y tablas
En frontend casi siempre vas a mostrar datos en listas, tarjetas o tablas.

Por ejemplo, una lista de clientes:
```ts
interface Client {
  id: number
  firstname: string
  lastname: string
  email: string
}
````
Ahora puedes tipar correctamente un arreglo de clientes:
```ts
const clients: Client[] = [
  {
    id: 1,
    firstname: 'Juan',
    lastname: 'Pérez',
    email: 'juan@email.com'
  }
]
````
Y recorrerlos con seguridad:
```ts
clients.forEach((client) => {
  console.log(client.firstname)
  console.log(client.lastname)
})
````
##### ¿Por qué esto importa?
Porque en una tabla real puedes tener:
- columnas
- filtros
- paginación
- acciones
- búsqueda
- edición
- eliminación
- exportación

#### 4) Tipar componentes, props y estado
Aquí es donde TypeScript se vuelve importantísimo en frameworks modernos como **Angular**, **Vue** y **React**.
Porque un componente casi siempre trabaja con:

- props
- eventos
- estado local
- datos externos
- lógica reutilizable

Por ejemplo, si un componente recibe un usuario:
```ts
interface User {
  id: number
  name: string
  email: string
}
````
Puedes usar ese tipo para indicar qué espera el componente.

Esto hace que:
- el componente sea más predecible
- sea más fácil reutilizarlo
- otros desarrolladores entiendan cómo usarlo
- se reduzcan errores por props mal enviadas

:::warning Error clásico sin TypeScript
Pasar una prop equivocada, olvidar una propiedad o usar un tipo incorrecto.

Eso en proyectos grandes pasa muchísimo.
:::

## 1.3 TypeScript NO reemplaza JavaScript

Y esto debes entenderlo desde ya:

**TypeScript no sustituye JavaScript.**  
**TypeScript se apoya en JavaScript.**

Es decir, **sigues programando en JavaScript**, pero ahora con una capa extra de seguridad, organización y claridad.

:::tip Idea clave
**Todo lo que haces en JavaScript sigue existiendo en TypeScript.**  
La diferencia es que ahora puedes trabajar con **tipos**, **autocompletado**, **validación temprana** y una mejor experiencia de desarrollo.
:::

### Entonces… ¿qué sigue siendo igual?

Cuando usas TypeScript:

- sigues escribiendo lógica JS
- sigues usando funciones JS
- sigues usando arrays
- sigues usando objetos
- sigues usando el DOM
- sigues usando eventos
- sigues usando `fetch`
- sigues usando `map`, `filter`, `find`, `reduce`
- sigues usando `async/await`

La gran diferencia es que ahora todo eso puede estar **mejor controlado**.

### JavaScript sigue siendo la base

TypeScript **no es un lenguaje separado del ecosistema web**.

En realidad, TypeScript fue creado para trabajar **encima de JavaScript**.

Eso significa que todo lo que ya sabes de JavaScript **te sigue sirviendo**.

:::info Importante
Aprender TypeScript **no significa volver a empezar desde cero**.

Significa aprender a escribir el mismo JavaScript que ya conoces,  
pero de una forma **más robusta y más profesional**.
:::

### Entonces, ¿qué agrega realmente TypeScript?
TypeScript agrega una capa de ayuda para que tu JavaScript sea:
- más seguro
- más predecible
- más claro
- más escalable
- más fácil de mantener

No cambia la esencia de cómo programas en frontend.
Lo que cambia es **la calidad del control que tienes sobre tu código**.

### La idea correcta que debes quedarte
No pienses:

*“Voy a dejar JavaScript y aprender otra cosa completamente distinta”.*

Piensa mejor así:

*“Voy a seguir usando JavaScript, pero ahora de una forma más profesional”.*

Ese cambio de mentalidad es importantísimo.

:::warning Error común
Mucha gente cree que TypeScript es “otro lenguaje totalmente diferente”.

Y no.

TypeScript es JavaScript con superpoderes de desarrollo.
:::

## 1.5 ¿Qué significa “tipado estático”?

Significa que **los tipos se validan antes de ejecutar el código**.

En otras palabras:

> TypeScript revisa tu código **antes de que corra en el navegador o en tu aplicación**  
> para detectar si estás usando mal los datos.

:::tip Idea clave
El **tipado estático** permite encontrar errores **antes de ejecutar tu programa**.

Eso significa menos errores en producción, menos bugs difíciles de detectar y más confianza al programar.
:::

## La idea simple

Cuando escribes código, TypeScript analiza cosas como estas:

- qué tipo de dato guarda una variable
- qué tipo espera una función
- qué tipo devuelve una función
- qué propiedades debe tener un objeto
- qué tipo de elementos contiene un arreglo

Si algo no coincide, TypeScript te avisa **de inmediato**.


## Ejemplo básico

```ts id="87556"
let edad: number = 25

edad = 30 // ✅
edad = "treinta" // ❌
````
