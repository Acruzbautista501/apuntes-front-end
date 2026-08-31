# Módulo 27: Proyecto Integrador — API REST Completa en PHP Puro

Has recorrido el camino completo: desde `$nombre` hasta Docker y CI/CD, sin depender de ningún framework. Este módulo no enseña conceptos nuevos; es un **plano de construcción** para aplicar todo lo anterior en un solo proyecto coherente y de nivel profesional.

## 27.1 El Encargo

Vas a construir una **API de Gestión de Tareas Colaborativo** en PHP puro — el mismo dominio funcional de los proyectos integradores de Vue.js, React y Node.js de este sitio, ahora implementado sin ningún framework:

1. Registro e inicio de sesión con JWT (access + refresh tokens).
2. CRUD completo de proyectos y tareas, con autorización a nivel de objeto (cada usuario solo ve sus propios proyectos).
3. Relaciones entre usuarios, proyectos y tareas con PDO (claves foráneas en MySQL/PostgreSQL).
4. Envío de un correo de bienvenida al registrarse, procesado en segundo plano con una cola sobre Redis.
5. Caché de la lista de proyectos por usuario (Redis, patrón cache-aside).
6. Documentación completa con OpenAPI/Swagger.
7. Tests unitarios de servicios (con dependencias simuladas) y de integración de endpoints críticos.
8. Contenerizado con Docker Compose (Nginx + PHP-FPM + MySQL + Redis + worker).
9. Pipeline de CI que corre análisis estático, estilo de código y tests en cada Pull Request.

## 27.2 Checklist de Requisitos Técnicos

Cada punto remite al módulo donde se explicó la técnica. Autoevalúate antes de dar el proyecto por terminado.

### Fundamentos y Estructura
- [ ] El proyecto usa `declare(strict_types=1)` en todos los archivos y tipado explícito en funciones y métodos (Módulo 2).
- [ ] La estructura de carpetas separa `public/`, `src/` y `tests/`, con `public/` como única raíz servida (Módulo 9).
- [ ] Las clases siguen namespaces y autoloading PSR-4 correctamente (Módulo 9).
- [ ] El código cumple PSR-12, verificado con `php-cs-fixer` (Módulo 8, 25).

### Arquitectura y Enrutamiento
- [ ] El enrutamiento usa `nikic/fast-route`, sin condicionales manuales por ruta (Módulo 11).
- [ ] La API sigue la arquitectura en capas: controladores → servicios → repositorios (Módulo 11).
- [ ] Los errores se manejan con una jerarquía de excepciones propia (`ApiException`) y un manejador centralizado (Módulo 6, 14).
- [ ] La API está documentada con OpenAPI, accesible en `/docs` (Módulo 21).

### Autenticación y Seguridad
- [ ] Las contraseñas se hashean con `password_hash()` (Módulo 15).
- [ ] Cada endpoint protegido verifica autorización a nivel de objeto, no solo autenticación (Módulo 16).
- [ ] Todas las consultas SQL usan parámetros vinculados con PDO, sin excepción (Módulo 12, 19).
- [ ] CORS está restringido a orígenes específicos, nunca `*` (Módulo 19).
- [ ] Existe rate limiting en el endpoint de login (Módulo 19).

### Base de Datos
- [ ] Las relaciones usuario-proyecto-tarea usan claves foráneas correctamente definidas (Módulo 12).
- [ ] Existen índices sobre los campos consultados con frecuencia.
- [ ] Las operaciones que modifican múltiples tablas relacionadas usan transacciones (Módulo 12).

### Funcionalidad Avanzada
- [ ] El correo de bienvenida se procesa en un worker separado con una cola sobre Redis, no bloqueando el registro (Módulo 23).
- [ ] La lista de proyectos por usuario está cacheada con Redis, con invalidación correcta al modificarse (Módulo 22).

### Testing y Calidad
- [ ] Al menos un servicio tiene tests unitarios con un repositorio simulado vía interfaz (Módulo 20).
- [ ] Al menos un endpoint crítico (login, crear tarea) tiene un test de integración (Módulo 20).
- [ ] Los tests usan SQLite en memoria o una base de datos de test separada (Módulo 20).
- [ ] PHPStan pasa en nivel 6 o superior, sin errores (Módulo 25).

### DevOps
- [ ] El proyecto tiene un `Dockerfile` multi-stage con Composer en una etapa separada (Módulo 24).
- [ ] `docker-compose.yml` levanta Nginx + PHP-FPM + MySQL + Redis + worker juntos (Módulo 24).
- [ ] Existe un pipeline de CI que corre lint, análisis estático y tests en cada PR (Módulo 25).

## 27.3 Estructura de Archivos Sugerida

```text
api-gestion-tareas-php/
├── public/
│   ├── index.php
│   └── openapi.json
├── src/
│   ├── Config/
│   ├── Controladores/
│   ├── Servicios/
│   ├── Repositorios/
│   │   └── Contratos/
│   ├── Modelos/
│   ├── Middlewares/
│   ├── Excepciones/
│   ├── Colas/
│   └── Http/
├── worker.php
├── tests/
│   ├── Unit/
│   ├── Integration/
│   └── Feature/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .github/workflows/ci.yml
├── composer.json
└── phpunit.xml
```

## 27.4 Criterios de "Terminado" (Definition of Done)

1. **¿Un usuario solo puede ver y modificar sus propios proyectos y tareas, verificado explícitamente en cada endpoint?**
2. **¿El registro responde inmediatamente, sin esperar al envío real del correo de bienvenida?**
3. **¿`docker compose up` levanta todo el sistema funcional (Nginx, PHP-FPM, MySQL, Redis, worker) con un solo comando?**
4. **¿El pipeline de CI falla correctamente si se introduce un error de tipos o un test roto?**
5. **¿Ninguna consulta SQL en todo el proyecto interpola valores directamente sin parámetros vinculados?**

## 27.5 Siguientes Pasos

Con este proyecto terminado, ya tienes el criterio para:

* Auditar y mejorar APIs PHP existentes, incluyendo su arquitectura, seguridad y observabilidad, con o sin framework.
* Decidir con fundamento cuándo un proyecto se beneficia de adoptar un framework completo (Laravel, Symfony) frente a mantener una base en PHP puro.
* Conectar esta API con los proyectos integradores de Vue.js o React de este sitio, cerrando el círculo completo de un stack full-stack alternativo con PHP en el backend.
* Construir y mantener APIs PHP en producción con la disciplina de testing, CI/CD y seguridad que un entorno profesional real exige.
