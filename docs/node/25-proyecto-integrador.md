# Módulo 25: Proyecto Integrador — API REST Completa

Has recorrido el camino completo: desde el Event Loop hasta Docker, CI/CD y observabilidad. Este módulo no enseña conceptos nuevos; es un **plano de construcción** para aplicar todo lo anterior en un solo proyecto coherente y de nivel profesional.

## 25.1 El Encargo

Vas a construir una **API de Gestión de Tareas Colaborativo** completa — el mismo dominio funcional de los proyectos integradores de Vue.js y React de este sitio, ahora desde el lado del backend que los alimentaría:

1. Registro e inicio de sesión con JWT (access + refresh tokens).
2. CRUD completo de proyectos y tareas, con autorización a nivel de objeto (cada usuario solo ve sus propios proyectos).
3. Relaciones entre usuarios, proyectos y tareas con Mongoose (`ref`/`populate`).
4. Notificaciones en tiempo real al asignar una tarea (WebSockets con Socket.io).
5. Envío de un correo de bienvenida al registrarse, procesado en segundo plano (BullMQ).
6. Caché de la lista de proyectos por usuario (Redis).
7. Documentación completa con Swagger.
8. Tests unitarios de servicios y de integración de endpoints críticos.
9. Contenerizado con Docker Compose (API + MongoDB + Redis).
10. Pipeline de CI que corre lint, build y tests en cada Pull Request.

## 25.2 Checklist de Requisitos Técnicos

Cada punto remite al módulo donde se explicó la técnica. Autoevalúate antes de dar el proyecto por terminado.

### Fundamentos y Configuración
- [ ] El proyecto usa TypeScript con `strict: true` y ES Modules (Módulo 2, 3).
- [ ] Las variables de entorno se validan con Zod al arrancar (Módulo 5, 8).
- [ ] Todo el código asíncrono usa `async`/`await`, sin callbacks anidados (Módulo 4).

### Arquitectura y Express
- [ ] La API sigue la arquitectura en capas: rutas → controladores → servicios → repositorios (Módulo 10).
- [ ] Todos los inputs se validan con Zod antes de llegar a la lógica de negocio (Módulo 8).
- [ ] Los errores se manejan con un middleware centralizado y clases de error personalizadas (Módulo 9).
- [ ] La API está documentada con Swagger, accesible en `/api-docs` (Módulo 12).

### Autenticación y Seguridad
- [ ] Las contraseñas se hashean con bcrypt (Módulo 11).
- [ ] Cada endpoint protegido verifica autorización a nivel de objeto, no solo autenticación (Módulo 21).
- [ ] `helmet()` y rate limiting están configurados (Módulo 21).
- [ ] CORS está restringido a los orígenes esperados, no abierto a todos (Módulo 21).

### MongoDB
- [ ] Los modelos usan esquemas de Mongoose tipados con TypeScript (Módulo 14).
- [ ] Las relaciones usuario-proyecto-tarea usan `ref`/`populate` correctamente (Módulo 16).
- [ ] Existen índices sobre los campos consultados con frecuencia (Módulo 16).
- [ ] Al menos una operación usa el pipeline de agregación (ej. estadísticas de tareas por proyecto) (Módulo 15).

### Funcionalidad Avanzada
- [ ] Las notificaciones de tareas asignadas usan Socket.io con salas por usuario (Módulo 18).
- [ ] El correo de bienvenida se procesa en una cola con BullMQ, no bloqueando el registro (Módulo 19).
- [ ] La lista de proyectos por usuario está cacheada con Redis, con invalidación correcta al modificarse (Módulo 20).

### Testing y Calidad
- [ ] Al menos un servicio tiene tests unitarios con un repositorio simulado (Módulo 17).
- [ ] Al menos un endpoint crítico (login, crear tarea) tiene un test de integración con Supertest (Módulo 17).
- [ ] Los tests usan `mongodb-memory-server` o una base de datos de prueba separada (Módulo 17).

### DevOps
- [ ] El proyecto tiene un `Dockerfile` multi-stage (Módulo 22).
- [ ] `docker-compose.yml` levanta API + MongoDB + Redis juntos (Módulo 22).
- [ ] Existe un pipeline de CI que corre lint, build y tests en cada PR (Módulo 23).
- [ ] La API expone un endpoint `/health` (Módulo 24).
- [ ] Los logs usan Pino de forma estructurada, sin datos sensibles (Módulo 24).

## 25.3 Estructura de Archivos Sugerida

```text
api-gestion-tareas/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── logger.ts
│   │   └── env.ts
│   ├── models/
│   │   ├── usuario.model.ts
│   │   ├── proyecto.model.ts
│   │   └── tarea.model.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   └── tarea.schema.ts
│   ├── repositories/
│   ├── services/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   │   ├── autenticar.ts
│   │   ├── validar.ts
│   │   └── errorHandler.ts
│   ├── queues/
│   │   └── correo.queue.ts
│   ├── workers/
│   │   └── correo.worker.ts
│   ├── sockets/
│   │   └── notificaciones.ts
│   ├── errors/
│   ├── app.ts
│   └── index.ts
├── tests/
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/ci.yml
└── package.json
```

## 25.4 Criterios de "Terminado" (Definition of Done)

1. **¿Un usuario solo puede ver y modificar sus propios proyectos y tareas, verificado explícitamente en cada endpoint?**
2. **¿El registro responde inmediatamente, sin esperar al envío real del correo de bienvenida?**
3. **¿`docker compose up` levanta todo el sistema funcional con un solo comando?**
4. **¿El pipeline de CI falla correctamente si se introduce un error de tipos o un test roto?**
5. **¿Los logs en producción están estructurados y no contienen contraseñas ni tokens completos?**

## 25.5 Siguientes Pasos

Con este proyecto terminado, ya tienes el criterio para:

* Auditar y mejorar APIs Node.js existentes, incluyendo su arquitectura, seguridad y observabilidad.
* Decidir con fundamento cuándo una funcionalidad necesita WebSockets, una cola de trabajo, o simplemente una petición HTTP normal.
* Conectar esta API con los proyectos integradores de Vue.js o React de este sitio, cerrando el círculo completo de un stack full-stack con TypeScript de extremo a extremo.
* Construir y mantener APIs en producción con la disciplina de testing, CI/CD y monitoreo que un entorno profesional real exige.
