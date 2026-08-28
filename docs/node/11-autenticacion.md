# Módulo 11: Autenticación y Autorización

**Autenticación** responde "¿quién eres?"; **autorización** responde "¿qué tienes permitido hacer?" — dos conceptos relacionados pero distintos. Este módulo cubre el patrón estándar de autenticación con JWT en APIs Node.js, junto con hash de contraseñas y control de acceso basado en roles.

## 11.1 Nunca Guardar Contraseñas en Texto Plano

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

```typescript
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function hashearPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function compararPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```

`bcrypt` genera un hash de un solo sentido (imposible de revertir) con un "salt" aleatorio incorporado — incluso si la base de datos se filtra, las contraseñas reales no quedan expuestas directamente. **Nunca** se debe usar un algoritmo de hash rápido genérico (MD5, SHA-256 sin salt) para contraseñas — están diseñados para ser rápidos, precisamente lo contrario de lo que se necesita para resistir ataques de fuerza bruta.

## 11.2 Registro de Usuario

```typescript
// src/services/auth.service.ts
import { hashearPassword } from '../utils/password.js'
import * as usuarioRepository from '../repositories/usuario.repository.js'

export async function registrar(email: string, password: string) {
  const existente = await usuarioRepository.buscarPorEmail(email)
  if (existente) throw new ValidationError('El correo ya está registrado')

  const passwordHasheado = await hashearPassword(password)

  return usuarioRepository.crear({ email, password: passwordHasheado })
}
```

## 11.3 JWT (JSON Web Tokens) — Cómo Funcionan

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

Un JWT es un token firmado digitalmente que contiene información del usuario (su ID, rol) — el servidor lo genera al iniciar sesión, el cliente lo guarda y lo envía en cada petición posterior, y el servidor lo **verifica** (sin necesitar consultar la base de datos en cada petición) para confirmar que sigue siendo válido y no ha sido alterado.

```typescript
import jwt from 'jsonwebtoken'
import { env } from '../config.js'

export function generarToken(usuarioId: string): string {
  return jwt.sign({ id: usuarioId }, env.JWT_SECRET, { expiresIn: '24h' })
}

export function verificarToken(token: string): { id: string } {
  return jwt.verify(token, env.JWT_SECRET) as { id: string }
}
```

## 11.4 Login — Generar y Devolver el Token

```typescript
export async function iniciarSesion(email: string, password: string) {
  const usuario = await usuarioRepository.buscarPorEmail(email)

  if (!usuario) throw new UnauthorizedError('Credenciales inválidas')

  const passwordValido = await compararPassword(password, usuario.password)
  if (!passwordValido) throw new UnauthorizedError('Credenciales inválidas') // Mismo mensaje en ambos casos

  const token = generarToken(usuario.id)

  return { token, usuario: { id: usuario.id, email: usuario.email } }
}
```

> **Detalle de seguridad importante**: el mensaje de error debe ser idéntico tanto si el correo no existe como si la contraseña es incorrecta — un mensaje distinto ("correo no encontrado" vs "contraseña incorrecta") permite a un atacante deducir qué correos están registrados en el sistema.

## 11.5 Middleware de Autenticación

```typescript
// src/middlewares/autenticar.ts
import type { Request, Response, NextFunction } from 'express'
import { verificarToken } from '../services/auth.service.js'
import { UnauthorizedError } from '../errors/AppError.js'

export interface RequestAutenticada extends Request {
  usuarioId?: string
}

export function autenticar(req: RequestAutenticada, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization // Formato esperado: "Bearer <token>"

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token no proporcionado'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verificarToken(token)
    req.usuarioId = payload.id // Disponible en los controladores posteriores de la cadena
    next()
  } catch {
    next(new UnauthorizedError('Token inválido o expirado'))
  }
}
```

```typescript
router.get('/perfil', autenticar, obtenerPerfil) // Solo accesible con un token válido
```

## 11.6 Autorización Basada en Roles

```typescript
// ForbiddenError sigue el mismo patrón de AppError visto en el Módulo 9, con statusCode 403
export function autorizar(...rolesPermitidos: string[]) {
  return (req: RequestAutenticada, res: Response, next: NextFunction) => {
    const usuario = req.usuario // Asumiendo que un middleware previo ya cargó el usuario completo

    if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
      return next(new ForbiddenError('No tienes permiso para esta acción'))
    }

    next()
  }
}
```

```typescript
router.delete('/productos/:id', autenticar, autorizar('admin'), eliminarProducto)
```

`autenticar` responde "¿quién eres?" (401 si no hay identidad válida); `autorizar` responde "¿tienes permiso?" (403 si la identidad es válida pero no tiene el rol necesario) — dos middlewares con responsabilidades distintas, casi siempre encadenados en ese orden.

## 11.7 Refresh Tokens — Sesiones de Larga Duración

Un token JWT con expiración corta (por seguridad) obligaría al usuario a re-autenticarse constantemente. El patrón estándar usa dos tokens: uno de **acceso** (corta duración, usado en cada petición) y uno de **refresco** (larga duración, guardado de forma más segura, usado solo para obtener nuevos tokens de acceso).

```typescript
export function generarTokens(usuarioId: string) {
  const accessToken = jwt.sign({ id: usuarioId }, env.JWT_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ id: usuarioId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
  return { accessToken, refreshToken }
}
```

## 11.8 Cookies HttpOnly vs `localStorage` para Guardar el Token

| Método | Ventaja | Riesgo |
| :--- | :--- | :--- |
| `localStorage` (frontend) | Simple de implementar | Vulnerable a robo vía XSS (JavaScript malicioso puede leerlo) |
| Cookie `httpOnly` | JavaScript del cliente no puede leerla, mitiga XSS | Requiere protección adicional contra CSRF |

```typescript
res.cookie('token', accessToken, {
  httpOnly: true,
  secure: true,      // Solo se envía sobre HTTPS
  sameSite: 'strict' // Mitiga ataques CSRF
})
```

Para APIs consumidas por un frontend propio (Vue.js/React, secciones ya cubiertas), las cookies `httpOnly` son generalmente la opción más segura frente a `localStorage`.

## 11.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Guardar contraseñas de forma segura | `bcrypt.hash()`, nunca texto plano ni hash sin salt |
| Identificar al usuario en cada petición sin consultar la BD cada vez | JWT firmado, verificado en un middleware |
| Proteger una ruta detrás de autenticación | Middleware `autenticar` |
| Restringir una ruta a ciertos roles | Middleware `autorizar('rol')`, después de `autenticar` |
| Sesiones de larga duración sin tokens de acceso peligrosamente largos | Access token corto + refresh token |

## 11.10 Errores Comunes

- **Guardar contraseñas en texto plano o con hash sin salt**: expone todas las contraseñas reales de los usuarios ante cualquier filtración de la base de datos.
- **Dar mensajes de error distintos entre "usuario no existe" y "contraseña incorrecta"**: filtra información que facilita ataques de enumeración de cuentas.
- **Guardar el JWT en `localStorage` sin considerar el riesgo de XSS**: cualquier script malicioso inyectado en la página puede robar el token directamente.
