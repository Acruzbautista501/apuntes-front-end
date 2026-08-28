# Módulo 21: Seguridad en APIs

Los módulos anteriores ya cubrieron piezas de seguridad de forma dispersa (hash de contraseñas, JWT, validación con Zod). Este módulo las consolida junto con protecciones adicionales esenciales — el checklist de seguridad que cualquier API en producción debe cumplir como mínimo.

## 21.1 OWASP API Security Top 10 — El Marco de Referencia

El proyecto OWASP mantiene una lista actualizada de los riesgos de seguridad más comunes específicos de APIs. Los más relevantes para lo cubierto en este curso:

| Riesgo | Ya cubierto en |
| :--- | :--- |
| Autorización rota a nivel de objeto | Verificar que un usuario solo acceda a SUS propios recursos (21.2) |
| Autenticación rota | Módulo 11 (JWT, bcrypt) |
| Exposición excesiva de datos | Módulo 14 (`.select('-password')`) |
| Falta de límite de recursos y tasa | Este módulo (21.4) |
| Configuración de seguridad incorrecta | Este módulo (Helmet, CORS) |

## 21.2 Autorización a Nivel de Objeto — El Error Más Común

```typescript
// ❌ Solo verifica que el usuario esté autenticado, no que el recurso le pertenezca
router.get('/pedidos/:id', autenticar, async (req, res) => {
  const pedido = await PedidoModel.findById(req.params.id)
  res.json(pedido) // Cualquier usuario autenticado puede ver el pedido de CUALQUIER otro usuario
})
```

```typescript
// ✅ Verifica explícitamente que el pedido pertenezca al usuario autenticado
router.get('/pedidos/:id', autenticar, async (req: RequestAutenticada, res) => {
  const pedido = await PedidoModel.findById(req.params.id)

  if (!pedido || pedido.usuarioId.toString() !== req.usuarioId) {
    return res.status(404).json({ error: 'Pedido no encontrado' }) // 404, no 403 — evita confirmar que el recurso existe
  }

  res.json(pedido)
})
```

Este es, consistentemente, el riesgo de seguridad más común en APIs reales: autenticar correctamente **quién es** el usuario, pero olvidar verificar que **tiene derecho** sobre el recurso específico que está pidiendo.

## 21.3 Helmet — Cabeceras HTTP de Seguridad

```bash
npm install helmet
```

```typescript
import helmet from 'helmet'

app.use(helmet())
```

`helmet()` configura automáticamente varias cabeceras HTTP de seguridad (protección contra *clickjacking*, forzar HTTPS, prevenir que el navegador adivine el tipo de contenido) con buenos valores por defecto — una sola línea que reduce significativamente la superficie de ataque común.

## 21.4 Rate Limiting — Prevenir Abuso

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit'

const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                  // Máximo 100 peticiones por IP en esa ventana
  message: 'Demasiadas peticiones, intenta de nuevo más tarde'
})

app.use(limitadorGeneral)

// Límite más estricto específicamente para el login (previene fuerza bruta)
const limitadorLogin = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 })
router.post('/login', limitadorLogin, iniciarSesionController)
```

Sin *rate limiting*, un endpoint de login es vulnerable a ataques de fuerza bruta (probar miles de contraseñas automáticamente), y cualquier endpoint sin límite es vulnerable a abuso que puede degradar el servicio para usuarios legítimos.

## 21.5 CORS Configurado Correctamente

```typescript
import cors from 'cors'

// ❌ Permite peticiones desde CUALQUIER origen — rara vez es lo correcto en producción
app.use(cors())

// ✅ Restringe explícitamente a los orígenes esperados
app.use(cors({
  origin: ['https://miapp.com', 'https://admin.miapp.com'],
  credentials: true // Necesario si se usan cookies (Módulo 11)
}))
```

## 21.6 Prevenir Inyección de NoSQL

```typescript
// ❌ Vulnerable: un atacante puede enviar un objeto en lugar de un string
// { "email": { "$gt": "" }, "password": { "$gt": "" } } podría evadir la autenticación
router.post('/login', async (req, res) => {
  const usuario = await UsuarioModel.findOne({ email: req.body.email }) // Sin validar el TIPO del dato
})
```

```bash
npm install express-mongo-sanitize
```

```typescript
import mongoSanitize from 'express-mongo-sanitize'

app.use(mongoSanitize()) // Elimina cualquier clave que empiece con "$" o contenga "." de req.body/query/params
```

La validación con Zod (Módulo 8) ya mitiga gran parte de este riesgo al forzar que `email` sea específicamente un `string` — `express-mongo-sanitize` agrega una capa adicional de defensa específica contra este vector de ataque particular de MongoDB.

## 21.7 Limitar el Tamaño del Body

```typescript
app.use(express.json({ limit: '10kb' })) // Rechaza peticiones con un body mayor a 10kb
```

Sin un límite explícito, un atacante podría enviar peticiones con un body extremadamente grande, consumiendo memoria y ancho de banda del servidor de forma desproporcionada — un vector simple de denegación de servicio.

## 21.8 Nunca Confiar en Datos del Cliente para Autorización

```typescript
// ❌ El cliente decide su propio rol — trivialmente falsificable
router.post('/admin/productos', async (req, res) => {
  if (req.body.rolUsuario === 'admin') { // El cliente controla req.body completamente
    // ...
  }
})

// ✅ El rol se obtiene del token verificado en el servidor, nunca del body de la petición
router.post('/admin/productos', autenticar, autorizar('admin'), crearProducto)
```

## 21.9 Checklist de Seguridad Mínima

* [ ] Contraseñas hasheadas con bcrypt, nunca en texto plano (Módulo 11).
* [ ] Todos los inputs validados con Zod antes de procesarse (Módulo 8).
* [ ] Autorización a nivel de objeto verificada, no solo autenticación (21.2).
* [ ] `helmet()` habilitado.
* [ ] Rate limiting en endpoints sensibles (login, registro).
* [ ] CORS configurado con orígenes específicos, no `*` en producción.
* [ ] Variables sensibles solo en `.env`, nunca en el código (Módulo 5).
* [ ] Mensajes de error genéricos hacia el cliente, detalles solo en logs internos (Módulo 9, 24).

## 21.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Verificar que un usuario solo acceda a sus propios recursos | Comparar el ID del recurso contra `req.usuarioId` explícitamente |
| Cabeceras de seguridad HTTP con buenos valores por defecto | `helmet()` |
| Prevenir fuerza bruta y abuso de endpoints | `express-rate-limit` |
| Restringir qué orígenes pueden consumir la API | `cors({ origin: [...] })` |
| Mitigar inyección de operadores NoSQL | `express-mongo-sanitize` |

## 21.11 Errores Comunes

- **Verificar solo autenticación, sin verificar autorización sobre el recurso específico**: el error de seguridad más común en APIs reales — permite que cualquier usuario autenticado acceda a datos de otros usuarios.
- **Usar `cors()` sin restricciones en producción**: permite que cualquier sitio web consuma la API directamente desde el navegador de un usuario, potencialmente exponiendo datos si hay cookies de sesión involucradas.
- **Confiar en cualquier dato de autorización (rol, permisos) enviado directamente por el cliente**: el cliente puede modificar cualquier dato que envíe — la autorización siempre debe derivarse de información verificada en el servidor (el token, la sesión).
