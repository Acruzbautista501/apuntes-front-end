# Módulo 22: Ejercicios de Práctica

Antes de abordar el Proyecto Integrador, conviene practicar cada bloque de conceptos por separado, en piezas pequeñas y autocontenidas. Cada ejercicio indica los módulos que pone en juego para que puedas repasarlos si te atoras.

## 22.1 Introducción y Composition API (Módulos 1-2)

1. **De HTML a componente.** Convierte un fragmento HTML estático en un componente con `<script setup>`, usando `ref()` para el estado y `v-for` para iterar una lista.
2. **Contador derivado.** Construye un contador con un `computed()` derivado del estado y un `watch()` que muestre en consola el valor anterior y el nuevo.

## 22.2 Props/Emits/v-model y Slots (Módulos 3-4)

3. **BaseInput reutilizable.** Crea un `BaseInput` con `defineProps`/`defineEmits` tipados que soporte `v-model`, con slots nombrados para un ícono y un mensaje de ayuda.
4. **Doble v-model.** Construye un componente con dos `v-model` simultáneos (por ejemplo un selector de rango "desde"/"hasta").

## 22.3 Template Refs y Composables (Módulos 5-6)

5. **Medir un elemento.** Mide el ancho de un elemento con un template ref dentro de `onMounted`, y extrae esa lógica a un composable `useElementWidth`.
6. **Composables compuestos.** Crea `useLocalStorage` y compónlo con otro composable propio (por ejemplo un contador que persista su valor).

## 22.4 Provide/Inject (Módulo 7)

7. **Evitar prop drilling.** Resuelve un caso de *prop drilling* de al menos 3 niveles con `provide()`/`inject()` y un `InjectionKey` tipado.

## 22.5 Formularios (Módulo 8)

8. **Validación reutilizable.** Construye un formulario con validación reactiva (`computed`) para 3 campos, extrayendo la lógica a un composable reutilizable.

## 22.6 Componentes Dinámicos, KeepAlive y Teleport (Módulo 9)

9. **Pestañas con estado preservado.** Crea un sistema de pestañas con `<component :is>` envuelto en `<KeepAlive>` para preservar el estado de cada pestaña.
10. **Tooltip teletransportado.** Implementa un tooltip o menú contextual con `<Teleport>` renderizado fuera del árbol del componente.

## 22.7 Vue Router (Módulo 10)

11. **Rutas anidadas y protegidas.** Configura rutas anidadas con un parámetro dinámico, protegidas por un Navigation Guard que redirija si falta una sesión simulada.
12. **Lazy loading.** Implementa lazy loading en 2 rutas y verifica en DevTools que se generan chunks separados.

## 22.8 Transiciones (Módulo 11)

13. **Elemento y lista animados.** Anima la entrada/salida de un elemento con `<Transition>` (las seis clases) y el reordenamiento de una lista con `<TransitionGroup>`.

## 22.9 Pinia (Módulo 12)

14. **Store de carrito.** Crea un store de carrito de compras con estado, getters y acciones, consumido en 2 componentes con `storeToRefs`.
15. **Stores comunicados.** Haz que dos stores se comuniquen entre sí (por ejemplo "usuario" consultado por "carrito" al agregar un ítem).

## 22.10 Consumo de APIs (Módulo 13)

16. **useFetch cancelable.** Construye un `useFetch` genérico y tipado que cancele la petición anterior con `AbortController` cuando cambian sus parámetros.

## 22.11 TypeScript Avanzado (Módulo 14)

17. **Componente genérico.** Crea un componente genérico con `<script setup generic="T">` que reciba una lista de `T` y un scoped slot para renderizar cada ítem.

## 22.12 Suspense (Módulo 15)

18. **Carga con estados explícitos.** Implementa un componente asíncrono con `<Suspense>`, mostrando estado de carga mientras se resuelve y estado de error si falla.

## 22.13 Directivas Personalizadas (Módulo 16)

19. **Directiva local y global.** Crea dos directivas: una local (`v-enfocar`) y una global con argumento y valor (`v-color`).

## 22.14 Testing (Módulo 17)

20. **Test de componente.** Testea un componente con Vitest + Vue Test Utils: renderizado con props, un evento emitido al interactuar, y contenido de un slot.
21. **Test aislado.** Testea de forma aislada un composable propio y un store de Pinia, sin montar ningún componente.

## 22.15 Rendimiento (Módulo 18)

22. **Comparativa de listas largas.** Compara el rendimiento de una lista de 100+ ítems con y sin `v-memo`/virtualización, documentando la diferencia.

## 22.16 Arquitectura (Módulo 19)

23. **Reorganización por dominio.** Reorganiza un proyecto pequeño de estructura "por tipo" (`components/`, `views/`) a estructura "por dominio/feature".

## 22.17 Plugins (Módulo 20)

24. **Plugin propio.** Crea un plugin que registre un composable global (o una propiedad global tipada) instalable con `app.use()`.

## 22.18 Accesibilidad (Módulo 21)

25. **Auditoría de un modal.** Audita un modal existente: implementa focus trap, anuncia su apertura con `aria-live`, y respeta `prefers-reduced-motion` en su transición.

## 22.19 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto, a diferencia del Módulo 23.
* Cuando te sientas cómodo resolviendo estos ejercicios sueltos, estás listo para el Proyecto Integrador.
