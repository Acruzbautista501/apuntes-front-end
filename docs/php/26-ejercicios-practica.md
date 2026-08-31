# Módulo 26: Ejercicios de Práctica

Antes de abordar el Proyecto Integrador, conviene practicar cada bloque de conceptos por separado, en piezas pequeñas y autocontenidas. Cada ejercicio indica los módulos que pone en juego para que puedas repasarlos si te atoras.

## 26.0 Nota sobre el Entorno (Bazzite OS)

Bazzite es un sistema atómico (basado en `rpm-ostree`, con filesystem raíz inmutable). A diferencia de Node, PHP no tiene un gestor de versiones en espacio de usuario tan estándar, así que:

* **PHP + Composer**: crea un contenedor de desarrollo con **Distrobox** (Fedora o Debian) e instala ahí `php-cli`, `php-fpm`, `composer` y extensiones (`pdo_mysql`, `redis`, `xdebug`) con `dnf`/`apt` con normalidad — no toca el host inmutable. Si tu imagen de Bazzite trae Homebrew, `brew install php composer` también funciona en `$HOME` sin Distrobox.
* **Docker → Podman**: los ejercicios de Docker se resuelven igual con `podman`/`podman-compose`, sin cambiar el contenido del módulo.
* **MySQL y Redis**: levántalos como contenedores con Podman en vez de instalarlos nativos — te sirve de práctica adelantada para el Módulo 24.

## 26.1 Entorno y Sintaxis Básica (Módulos 1-2)

1. **Entorno funcionando.** Configura tu entorno (Distrobox o Homebrew) con PHP y Composer, y sirve un script con el servidor de desarrollo integrado (`php -S`).
2. **Tipado estricto.** Escribe un script con `declare(strict_types=1)` que use tipado opcional en parámetros y retorno, y una constante definida con `const`.

## 26.2 Control de Flujo y Funciones (Módulo 3)

3. **match y argumentos con nombre.** Reescribe un `switch` con múltiples `case` como `match`, y crea una función con argumentos con nombre y un tipo de retorno union (`int|string`).
4. **Variádicas y closures.** Crea una función variádica que sume un número indefinido de argumentos, y una arrow function equivalente que use una closure con `use` para acceder a una variable externa.

## 26.3 Arrays (Módulo 4)

5. **Transform, filter, reduce.** Dado un array asociativo de "productos" (nombre, precio, categoría), transforma, filtra y reduce con `array_map`/`array_filter`/`array_reduce` para obtener el total por categoría.
6. **Desestructuración y spread.** Practica desestructuración con `[]` y el operador de propagación para combinar dos arrays sin sobrescribir claves.

## 26.4 POO (Módulo 5)

7. **Jerarquía de clases.** Modela un dominio simple (ej. `Vehiculo`) con una clase abstracta, dos clases que la extiendan, promoción de propiedades en el constructor y visibilidad correcta (`private`/`protected`).
8. **Traits y Enums.** Crea un `Trait` reutilizable (ej. `TieneTimestamps`) usado por dos clases distintas, y un Enum nativo (PHP 8.1+) para un conjunto cerrado de estados (ej. `EstadoPedido`).

## 26.5 Errores y Excepciones (Módulo 6)

9. **Jerarquía de excepciones.** Diseña una jerarquía propia (`ApiException` → `NotFoundException`, `ValidationException`) y captura múltiples tipos con bloques `catch` distintos.

## 26.6 Composer (Módulo 7)

10. **Proyecto con dependencia real.** Inicializa un proyecto con `composer init`, instala una dependencia real (ej. `respect/validation`), y crea un script personalizado en `composer.json`.

## 26.7 PSR y Buenas Prácticas (Módulo 8)

11. **PSR-12 aplicado.** Formatea un archivo desordenado según PSR-12, y anota qué interfaz PSR usarías para loguear (PSR-3) en ese archivo.

## 26.8 Autoloading y Namespaces (Módulo 9)

12. **PSR-4 y punto de entrada único.** Organiza un mini-proyecto con namespaces por carpeta y autoloading PSR-4 en `composer.json`, con `public/index.php` como único punto de entrada.

## 26.9 Superglobales y HTTP (Módulo 10)

13. **Endpoint en PHP puro.** Escribe un endpoint que lea `$_GET`, parsee un body JSON de `php://input`, y devuelva una respuesta con el código de estado y cabeceras correctos.

## 26.10 Enrutamiento y Arquitectura (Módulo 11)

14. **Router manual y con librería.** Construye un router manual mínimo con al menos 4 rutas, y luego reemplázalo por `nikic/fast-route`.
15. **Capas y contenedor simple.** Separa ese mismo proyecto en capas (ruta → controlador → servicio) con un contenedor de dependencias simple.

## 26.11 PDO y Bases de Datos (Módulo 12)

16. **Repositorio con PDO.** Conecta con PDO a un MySQL en contenedor (Podman), y crea un repositorio con consultas preparadas para CRUD completo de una entidad.
17. **Transacciones.** Envuelve una operación de "transferencia" (dos updates relacionados) en una transacción, y provoca un fallo a propósito para verificar el rollback.

## 26.12 API REST en PHP Puro (Módulo 13)

18. **Mini-API de un recurso.** Une los bloques 9-11 en una mini-API REST (un solo recurso, CRUD completo) con un helper de respuesta JSON reutilizable.

## 26.13 Validación Centralizada (Módulo 14)

19. **Validación + manejador de errores.** Valida el body de un POST con `respect/validation`, lanzando tu `ValidationException` del Bloque 5 y capturándola en un manejador de errores centralizado.

## 26.14 JWT y Autenticación (Módulo 15)

20. **Login con JWT.** Implementa login con contraseñas hasheadas y generación de un access token JWT, verificándolo en un endpoint protegido.
21. **Refresh tokens.** Agrega refresh tokens al flujo anterior.

## 26.15 Autorización (Módulo 16)

22. **Roles y autorización por objeto.** Crea una capa de autorización reutilizable basada en roles, y reproduce (para corregirla después) una falla de autorización a nivel de objeto.

## 26.16 Capa de Acceso a Datos (Módulo 17)

23. **Query builder propio.** Construye un query builder mínimo que mapee filas a objetos de dominio, con paginación (`LIMIT`/`OFFSET`).

## 26.17 Middleware PSR-15 (Módulo 18)

24. **Middlewares encadenados.** Implementa el contrato PSR-15 con al menos 2 middlewares encadenados manualmente (ej. logging + autenticación), aplicados solo a ciertas rutas.

## 26.18 Seguridad (Módulo 19)

25. **Auditoría XSS/CSRF/CORS.** Audita un endpoint existente contra XSS, CSRF y CORS mal configurado, corrigiendo cada hallazgo.
26. **Rate limiting y cabeceras.** Agrega rate limiting básico y cabeceras de seguridad HTTP a tu API.

## 26.19 Testing con PHPUnit (Módulo 20)

27. **Test unitario con interfaz simulada.** Escribe un test unitario que simule una dependencia con una interfaz, sin base de datos real.
28. **Test de integración.** Escribe un test de integración contra una base de datos de prueba para un endpoint HTTP completo.

## 26.20 OpenAPI (Módulo 21)

29. **Swagger UI interactivo.** Documenta 2-3 endpoints con anotaciones OpenAPI y genera la especificación con Swagger UI.

## 26.21 Caché con Redis (Módulo 22)

30. **Cache-aside con claves compuestas.** Implementa el patrón cache-aside para un listado costoso, con invalidación al modificar datos y claves compuestas para distintos filtros.

## 26.22 Colas de Trabajo (Módulo 23)

31. **Cola sobre Redis.** Crea una cola simple sobre Redis con un worker como proceso separado, y reintentos ante fallos.

## 26.23 Docker/Podman (Módulo 24)

32. **Dockerfile multi-stage.** Escribe un Dockerfile multi-stage para tu API (Composer en una etapa, imagen final solo con lo necesario para ejecutar).
33. **Compose completo.** Levanta PHP-FPM + Nginx + MySQL + Redis juntos con `podman-compose`, con OPcache habilitado.

## 26.24 CI/CD (Módulo 25)

34. **Análisis estático en CI.** Crea un pipeline de GitHub Actions que corra PHPStan y PHP-CS-Fixer en cada PR.
35. **Tests y rama protegida.** Agrega PHPUnit al mismo pipeline y protege la rama principal para que no se pueda mergear si algo falla.

## 26.25 Cómo Usar Esta Lista

* No hace falta resolverlos en orden estricto, pero sí conviene no saltarse un bloque sin haber leído su módulo correspondiente.
* Cada ejercicio es independiente: no se acumulan entre sí ni forman un solo proyecto, a diferencia del Módulo 27.
* Cuando te sientas cómodo resolviendo estos ejercicios sueltos, estás listo para el Proyecto Integrador.
