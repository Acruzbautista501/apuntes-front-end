# Módulo 9: Ejercicios de Práctica

Cada módulo anterior ya trae un mini-ejercicio guiado al final. Estos ejercicios son adicionales: piezas más completas y autocontenidas para reforzar cada tema por separado antes de encarar un proyecto propio más grande. Cada uno indica el módulo que pone en juego.

## 9.1 Introducción y Entorno (Módulo 1)

1. **Proyecto desde cero.** Crea un proyecto con Vite + TypeScript sin usar una plantilla ya armada, y describe en un comentario qué hace cada archivo de configuración (`tsconfig.json`, `vite.config.ts`, `package.json`).
2. **Corregir un error de tipado real.** Identifica y corrige un error de tipado que TypeScript te marque al compilar (ej. asignar un `string` a una variable `number`), sin recurrir a `any`.

## 9.2 Tipado Básico y Estructuras (Módulo 2)

3. **Tuplas, Enums y uniones.** Declara un array de tuplas para coordenadas GPS (`[number, number]`), un Enum para días de la semana, y una unión de tipos para un campo `string | number`.
4. **Type narrowing con unknown.** Escribe una función que reciba un parámetro `unknown` y, con type narrowing, determine de forma segura si es `string` o `number` antes de operar con él.

## 9.3 Control de Flujo (Módulo 3)

5. **Filter, map y forEach encadenados.** Dado un array de objetos "tarea" (nombre, prioridad, completada), encadena `.filter()`, `.map()` y `.forEach()` para mostrar solo las pendientes de alta prioridad.
6. **De if/else a switch.** Reescribe una cadena de `if/else if` de al menos 4 ramas como `switch`, y explica en un comentario por qué elegirías una sobre la otra.

## 9.4 Funciones (Módulo 4)

7. **Tu propio map.** Crea una función de orden superior que reciba un array y un callback, aplicándolo a cada elemento (tu propia versión simplificada de `.map()`).
8. **Firma de función completa.** Tipa la firma completa (parámetros, valor por defecto, retorno) de una función que calcule el precio final de un producto con descuento opcional.

## 9.5 Interfaces y Tipos (Módulo 5)

9. **Objeto anidado y extensión.** Define una interfaz con un objeto anidado (ej. `Usuario` con `direccion: Direccion`), y extiéndela para crear una variante (ej. `UsuarioAdmin`).
10. **Unión de literales.** Crea un `type` con una unión de literales de string (ej. `'activo' | 'inactivo' | 'suspendido'`) y una función que solo acepte esos valores.

## 9.6 POO (Módulo 6)

11. **Clase con getter/setter validado.** Modela una clase con constructor, modificadores de acceso (`private`/`protected`/`public`) y un getter/setter para una propiedad validada.
12. **Clase abstracta con dos implementaciones.** Crea una clase abstracta con al menos un método sin implementar, y dos clases que la extiendan con implementaciones distintas.

## 9.7 Asincronismo (Módulo 7)

13. **Consumo de API tipado.** Consume una API pública real con `fetch` + `async/await`, tipando la respuesta con una interfaz.
14. **Manejo de errores de red.** Provoca un error de red a propósito (URL inválida) y manéjalo con `try/catch`, mostrando un mensaje claro en vez de romper la app.

## 9.8 Vite y Despliegue (Módulo 8)

15. **Variable de entorno en dev y build.** Mueve una URL de API hardcodeada a una variable de entorno (`VITE_...`) y verifica que funcione en desarrollo y en el build de producción (`npm run build` + `npm run preview`).
16. **Primer test con Vitest.** Escribe un test para una función pura de tu proyecto (ej. una que calcule un total).

## 9.9 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto.
* Combínalos con los mini-ejercicios embebidos en cada módulo para tener doble práctica por tema.
