# Módulo 9: Ejercicios de Práctica

Ejercicios cortos y autocontenidos para reforzar cada módulo por separado. Cada uno indica el módulo que pone en juego.

## 9.1 Introducción y Configuración (Módulo 1)

1. **Compilación vs. ejecución.** Configura un proyecto con Vite + TypeScript desde cero, y compila un archivo `.ts` a mano con `tsc` para entender la diferencia entre compilación y ejecución.
2. **Modo estricto.** Activa `strict` mode en `tsconfig.json` y corrige los errores que aparezcan en un archivo con tipado laxo.

## 9.2 Tipado Básico y Primitivos (Módulo 2)

3. **Primitivos, arrays y tuplas.** Declara variables usando todos los tipos primitivos, un array tipado y una tupla, dejando que TypeScript infiera el tipo donde sea posible en vez de anotarlo explícitamente.
4. **Eliminar any.** Refactoriza una función que usa `any` para eliminarlo por completo, usando union types y manejo explícito de `null`/`undefined`.

## 9.3 Objetos e Interfaces (Módulo 3)

5. **Opcionales e index signatures.** Define una interfaz para un objeto de configuración con propiedades opcionales, y un index signature para un objeto que actúe como diccionario (ej. traducciones).
6. **Herencia y unión de tipos.** Crea dos interfaces relacionadas por herencia (`extends`) y una unión de tipos entre dos formas distintas de un mismo dato (ej. `Circulo | Cuadrado`).

## 9.4 Funciones en el Front End (Módulo 4)

7. **Eventos del DOM tipados.** Tipa correctamente el evento de un click y el evento de un input de formulario, usando los tipos de evento del DOM.
8. **Opcionales, por defecto y never.** Crea una función con parámetros opcionales y por defecto, y otra que use `never` como retorno para un caso que nunca debería alcanzarse (ej. un `switch` exhaustivo).

## 9.5 Tipado Avanzado y Control de Flujo (Módulo 5)

9. **Enums y Type Guards.** Crea un Enum para un conjunto cerrado de valores, y usa Type Guards con `typeof` e `in` para estrechar el tipo de una variable antes de operar con ella.
10. **Discriminated Union.** Modela una Discriminated Union (ej. distintos tipos de notificación con una propiedad `tipo` discriminante) y un `switch` exhaustivo sobre ella.

## 9.6 Genéricos (Módulo 6)

11. **Interfaz y función genéricas.** Crea una interfaz genérica para una respuesta de API (`ApiResponse<T>`), y una función genérica con una restricción (`extends`) que solo acepte objetos con una propiedad `id`.
12. **Tipos utilitarios.** Usa al menos 2 tipos utilitarios (`Partial`, `Pick`, `Omit`, `Readonly`) sobre un tipo propio ya definido.

## 9.7 Integración con APIs y el DOM (Módulo 7)

13. **Selección segura del DOM.** Selecciona un elemento del DOM de forma segura (verificando que no sea `null`) y tipa su valor correctamente.
14. **Fetch vs Axios.** Consume una misma API con Fetch y con Axios, tipando la respuesta y manejando el error con `unknown` en vez de `any`.

## 9.8 Frameworks Modernos (Módulo 8)

15. **Componente tipado.** Crea un componente tipado en Vue (Composition API) o React (a tu elección) con props e interfaces, y un evento tipado.
16. **Variable de entorno tipada.** Tipa una variable de entorno de tu framework (`VITE_...` o `import.meta.env`) y su acceso seguro en el código.

## 9.9 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto.
