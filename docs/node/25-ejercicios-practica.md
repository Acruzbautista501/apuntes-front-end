# Módulo 25: Ejercicios de Práctica

Antes de abordar el Proyecto Integrador, conviene practicar cada bloque de conceptos por separado, en piezas pequeñas y autocontenidas. Cada ejercicio indica los módulos que pone en juego para que puedas repasarlos si te atoras.

## 25.0 Nota sobre el Entorno (Bazzite OS)

Bazzite es un sistema atómico (basado en `rpm-ostree`, con filesystem raíz inmutable), así que conviene evitar instalar Node, Docker, MongoDB o Redis directamente en el host con `dnf`:

* **Node**: instálalo con `nvm` o `fnm` en tu `$HOME` — no toca el sistema, no requiere `rpm-ostree install` ni reinicio.
* **Docker → Podman**: Bazzite trae Podman de base (rootless, compatible con la CLI de Docker). Los ejercicios que piden `docker`/`docker-compose` se resuelven igual con `podman` y `podman-compose` (o el plugin `podman compose`), sin cambiar el contenido del módulo.
* **MongoDB y Redis para desarrollo**: en vez de instalarlos nativos, levántalos como contenedores con Podman (`podman run -d -p 27017:27017 mongo`, etc.) — te sirve además de práctica adelantada para el Módulo 22.
* Si necesitas herramientas de sistema que sí requieren paquetes nativos, usa un contenedor de desarrollo con **Distrobox** en vez de capas de `rpm-ostree` sobre el host.

## 25.1 Introducción y Configuración (Módulos 1-2)

1. **Primer script con TypeScript.** Instala Node vía `nvm`, crea un proyecto con TypeScript desde cero (`tsconfig.json`, ESLint/Prettier, scripts de `package.json`) y haz que un script imprima `process.version` y `process.platform`.
2. **Variables de entorno validadas.** Configura `.env`/`.env.example`, validando al arrancar que una variable requerida (ej. `PORT`) exista, y que el proceso falle con un mensaje claro si no.

## 25.2 Módulos/FS/Streams y Event Loop (Módulos 3-4)

3. **Transformar un archivo grande por streams.** Lee un archivo grande con un stream de lectura, transfórmalo (ej. a mayúsculas) y escríbelo con `pipe()` a otro archivo, sin cargarlo completo en memoria.
4. **De callbacks a async/await.** Convierte una cadena de 3 llamadas encadenadas con callbacks a `async`/`await`, y ejecuta 2 de esas operaciones en paralelo con `Promise.all`.

## 25.3 NPM y Dependencias (Módulo 5)

5. **npx y devDependencies.** Crea un script en `package.json` que use `npx` para ejecutar una herramienta sin instalarla globalmente, y documenta la diferencia entre una dependencia y una `devDependency` en tu proyecto.

## 25.4 Express, Rutas y Middlewares (Módulos 6-7)

6. **http nativo vs Express.** Construye una API mínima con `http` nativo, y luego la misma API con Express — compara la cantidad de código.
7. **Router y middleware factory.** Organiza rutas con `express.Router()`, separa controladores de rutas, y crea un middleware factory (ej. `requireRole('admin')`) aplicado solo a ciertas rutas.

## 25.5 Validación con Zod (Módulo 8)

8. **Body, params y query tipados.** Valida el body, los params y el query de un endpoint con esquemas Zod reutilizados también como tipos TypeScript (`z.infer`), devolviendo errores estructurados.

## 25.6 Manejo de Errores (Módulo 9)

9. **Errores centralizados.** Crea clases de error personalizadas (`NotFoundError`, `ValidationError`), un middleware de manejo centralizado, y un wrapper `asyncHandler` para evitar `try`/`catch` repetido.

## 25.7 Arquitectura en Capas (Módulo 10)

10. **Refactor a capas.** Refactoriza un endpoint que hace todo en el controlador (lógica + acceso a datos), separándolo en controlador → servicio → repositorio.

## 25.8 Autenticación (Módulo 11)

11. **Registro, login y roles.** Implementa registro/login con contraseñas hasheadas y JWT, con un middleware que proteja rutas y un endpoint que devuelva 403 si el rol no es el correcto.
12. **Refresh tokens.** Agrega refresh tokens y decide (justificando) si los guardas en cookie `HttpOnly` o en el cliente.

## 25.9 Documentación OpenAPI (Módulo 12)

13. **Swagger desde Zod.** Documenta 2-3 endpoints con Swagger/OpenAPI, generando el esquema del body directamente desde tus esquemas Zod del Bloque 5.

## 25.10 MongoDB y Mongoose (Módulos 13-14)

14. **Driver nativo.** Conecta a Mongo (contenedor con Podman), inserta/consulta documentos con el driver nativo, y decide un caso de incrustar vs. referenciar para tu modelo.
15. **El mismo modelo con Mongoose.** Recrea el modelo anterior con Mongoose: esquema tipado, un middleware `pre('save')` y un método virtual.

## 25.11 Agregaciones y Relaciones (Módulos 15-16)

16. **Pipeline de agregación.** Construye un pipeline con `$match`, `$group` y `$project` para un reporte simple (ej. totales por categoría).
17. **Lookup y populate.** Agrega un `$lookup` para unir dos colecciones, y resuelve el mismo caso con `populate` selectivo en Mongoose.

## 25.12 Testing (Módulo 17)

18. **Test unitario de servicio.** Escribe tests unitarios de un servicio sin base de datos real, usando un repositorio simulado.
19. **Test de integración.** Escribe un test de integración con Supertest para una ruta protegida por autenticación, limpiando la base de datos de prueba entre tests.

## 25.13 WebSockets (Módulo 18)

20. **Chat con salas.** Implementa un chat mínimo con Socket.io: salas (`rooms`) separadas y autenticación de la conexión antes de unirse.

## 25.14 Colas con BullMQ + Redis (Módulo 19)

21. **Worker con reintentos.** Crea una cola que procese una tarea "lenta" simulada (ej. envío de email) en un worker aparte, con reintentos automáticos si falla.

## 25.15 Caché con Redis (Módulo 20)

22. **Cache-aside.** Implementa el patrón cache-aside en una ruta GET costosa, con invalidación al modificar el recurso y un TTL justificado.

## 25.16 Seguridad en APIs (Módulo 21)

23. **Checklist OWASP.** Audita un endpoint contra la checklist del módulo: agrega Helmet, rate limiting, CORS correcto, y verifica que no confías en datos del cliente para autorización.
24. **Falla de autorización a nivel de objeto.** Reproduce, en un endpoint de prueba, un usuario accediendo al recurso de otro por ID, y corrígela.

## 25.17 Docker/Podman (Módulo 22)

25. **Dockerfile multi-stage.** Escribe un `Dockerfile` multi-stage para tu API y constrúyelo/ejecútalo con Podman.
26. **Compose con API + Mongo + Redis.** Levanta API, MongoDB y Redis juntos con `podman-compose` (o `podman compose`), usando un volumen para persistir los datos de Mongo.

## 25.18 CI/CD (Módulo 23)

27. **Pipeline con GitHub Actions.** Crea un pipeline que corra lint + tests en cada PR, y protege la rama principal para que no se pueda mergear si falla.

## 25.19 Logging y Monitoreo (Módulo 24)

28. **Logging estructurado.** Reemplaza tus `console.log` por logging estructurado con Pino, agregando logging automático de peticiones HTTP.
29. **Health check sin datos sensibles.** Agrega un endpoint de health check y verifica que ningún nivel de log expone contraseñas o tokens.

## 25.20 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto, a diferencia del Módulo 26.
* Cuando te sientas cómodo resolviendo estos ejercicios sueltos, estás listo para el Proyecto Integrador.
