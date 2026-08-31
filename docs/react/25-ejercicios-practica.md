# Módulo 25: Ejercicios de Práctica

Antes de abordar el Proyecto Integrador, conviene practicar cada bloque de conceptos por separado, en piezas pequeñas y autocontenidas. Cada ejercicio indica los módulos que pone en juego para que puedas repasarlos si te atoras.

## 25.1 Introducción, JSX y Componentes (Módulos 1-2)

1. **Fragmentos y clases condicionales.** Crea un proyecto con Vite + TypeScript y un componente que devuelva varios elementos hermanos con un Fragmento, con al menos una clase condicional.
2. **Interpolación dinámica.** Interpola valores dinámicos en JSX (texto, atributo, estilo en línea) dentro de un componente que use otro componente hijo.

## 25.2 Props y TypeScript (Módulo 3)

3. **Extender props nativas.** Crea un `Boton` que extienda las props nativas de `<button>` (`ButtonHTMLAttributes`), con una prop `variant` opcional y `children` tipado.
4. **Callbacks y arrays tipados.** Crea un componente que reciba una prop de función (callback) tipada y un array de objetos como prop.

## 25.3 useState (Módulo 4)

5. **Actualización funcional.** Construye un contador con `useState`, actualizando el valor basado en el estado anterior (forma funcional del setter).
6. **Objetos y arrays en estado.** Maneja el estado de un objeto y de un array (agregar/quitar un ítem) sin mutar directamente, tipando el estado explícitamente.

## 25.4 Eventos y Formularios (Módulo 5)

7. **Un manejador para varios campos.** Construye un formulario controlado con 3 tipos de campo distintos usando un solo manejador de cambio genérico.
8. **Evento de envío tipado.** Tipa correctamente el evento de envío (`FormEvent`) y previene el comportamiento por defecto.

## 25.5 Renderizado Condicional y Listas (Módulo 6)

9. **Listas con key correcta.** Renderiza una lista con `.map()`, usando `key` correctamente, filtrando y transformando los datos antes de renderizar.
10. **Tres formas de condicional.** Implementa renderizado condicional con ternario, `&&` y ocultamiento completo de un componente, en el mismo componente.

## 25.6 useEffect (Módulo 7)

11. **Evento del navegador con cleanup.** Usa `useEffect` para escuchar un evento del navegador con su función de limpieza correspondiente.
12. **Fetch reactivo y un caso innecesario.** Haz data fetching reaccionando a un cambio de prop/estado, e identifica un caso donde NO deberías usar `useEffect` (refactorízalo).

## 25.7 useRef (Módulo 8)

13. **Medir, guardar ID y forwardRef.** Usa `useRef` para medir un elemento del DOM y para guardar el ID de un `setInterval` sin causar re-renders; expón un método de un hijo con `forwardRef`.

## 25.8 Context API (Módulo 9)

14. **Evitar prop drilling.** Resuelve un caso de prop drilling de 3 niveles con Context, incluyendo estado y funciones en el valor del contexto.

## 25.9 Custom Hooks (Módulo 10)

15. **Primeros custom hooks.** Crea `useContador` y otro con `useEffect` (`useMousePosition`).
16. **Composición de hooks.** Crea `useLocalStorage` y compónlo con otro custom hook propio.

## 25.10 Consumo de APIs con Hooks (Módulo 11)

17. **useFetch disparado por acción.** Construye un `useFetch` genérico y tipado, disparado por una acción (no al montar), y encapsula un endpoint específico sobre él.

## 25.11 useReducer (Módulo 12)

18. **De useState a useReducer.** Refactoriza una lista de tareas con múltiples `useState` relacionados a un solo `useReducer`, y combínalo con Context como mini-Redux propio.

## 25.12 Rendimiento (Módulo 13)

19. **memo + useCallback.** Identifica un componente que se re-renderiza innecesariamente y corrígelo con `React.memo` + `useCallback`.
20. **useMemo con criterio.** Usa `useMemo` para un cálculo costoso, y documenta un caso donde NO valga la pena usar estas herramientas.

## 25.13 React Router (Módulo 14)

21. **Rutas anidadas y protegidas.** Configura rutas anidadas con `<Outlet>`, un parámetro dinámico y una ruta protegida.
22. **Lazy loading y 404.** Implementa lazy loading de 2 rutas y una ruta 404.

## 25.14 Estado Global (Módulo 15)

23. **Zustand con selectores.** Crea un store de Zustand para autenticación con persistencia, consumido con selectores en 2 componentes.
24. **El mismo store con Redux Toolkit.** Recrea el mismo store con Redux Toolkit y compara la cantidad de código.

## 25.15 TypeScript Avanzado (Módulo 16)

25. **Componente genérico.** Crea un componente genérico que reciba una lista de `T` y una función de renderizado por ítem.
26. **Props polimórficas.** Tipa props polimórficas con `as` (ej. un `Texto` que renderice como `p`, `span` o `h1`).

## 25.16 Patrones de Composición (Módulo 17)

27. **Compound component.** Construye un compound component (ej. `Tabs`/`Tab`) que comparta estado sin prop drilling.
28. **Portal y render prop.** Implementa un modal con Portal, y un componente con render prop donde el hijo decide cómo renderizar.

## 25.17 Code Splitting y Suspense (Módulo 18)

29. **Lazy, Suspense y precarga.** Aplica `React.lazy` + `Suspense` a 2 rutas, con un Error Boundary, y precarga un componente antes de que se necesite (ej. al hacer hover en un enlace).

## 25.18 TanStack Query (Módulo 19)

30. **useQuery y useMutation.** Usa `useQuery` con una `queryKey` bien diseñada, y `useMutation` para crear datos.
31. **Actualización optimista.** Implementa una actualización optimista en una mutación (ej. marcar una tarea como completada).

## 25.19 React Hook Form + Zod (Módulo 20)

32. **Campos dinámicos.** Construye un formulario con React Hook Form + Zod, con un array de campos dinámicos usando `useFieldArray`.

## 25.20 Testing (Módulo 21)

33. **Componente con RTL.** Testea un componente con RTL: renderizado, props e interacción del usuario con consultas accesibles.
34. **Hook y fetch simulados.** Testea un custom hook con `renderHook` y simula (`mock`) una petición `fetch`.

## 25.21 Accesibilidad (Módulo 22)

35. **Auditoría de un modal.** Audita un modal: atrapa el foco, anuncia su apertura con `aria-live`, y verifica que `eslint-plugin-jsx-a11y` no reporte errores.

## 25.22 Next.js (Módulo 23)

36. **Server y Client Components.** Crea un proyecto con Next.js App Router: un Server Component que haga fetch de datos y un Client Component que maneje interactividad.
37. **Combinarlos en un layout.** Combina Server y Client Components en un mismo layout, y compara cuándo usarías React Router vs Next.js.

## 25.23 Arquitectura de Proyectos (Módulo 24)

38. **De estructura por tipo a por dominio.** Reorganiza un proyecto pequeño de estructura "por tipo" a estructura "por dominio/feature", separando componentes "tontos" de "inteligentes" y configurando el alias `@/`.

## 25.24 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto, a diferencia del Módulo 26.
* Cuando te sientas cómodo resolviendo estos ejercicios sueltos, estás listo para el Proyecto Integrador.
