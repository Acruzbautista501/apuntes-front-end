# Módulo 14: Protección de Rutas con *Guards* y *Resolvers* (De Clases a Funciones)

Los **Guards** son guardianes de seguridad que interceptan los intentos de navegación del usuario para autorizar, denegar o redirigir el acceso a rutas protegidas.

Los **Resolvers** permiten precargar datos esenciales del servidor antes de que el componente de destino se instancie en pantalla, evitando pantallas intermedias en blanco.

---

## 14.1 Tipos de Guards en Angular

| Guard | Interfaz Clásica | Función Moderna (v15+) | Propósito |
| :--- | :--- | :--- | :--- |
| **Acceso a Ruta** | `CanActivate` | **`CanActivateFn`** | Determina si el usuario puede acceder a una ruta. |
| **Acceso a Hijas** | `CanActivateChild` | **`CanActivateChildFn`** | Protege en bloque todas las subrutas hijas. |
| **Salida de Ruta** | `CanDeactivate` | **`CanDeactivateFn`** | Pregunta al usuario si desea abandonar un formulario con cambios sin guardar. |
| **Carga Diferida** | `CanLoad` (Deprecado) | **`CanMatchFn`** (v14.4+) | Decide si se descarga el bundle de una ruta Lazy antes de hacer la petición de red. |

---

## 14.2 La Transición: De Guards de Clase a Guards Funcionales

Hasta Angular 14, un guard exigía crear una clase completa decorada con `@Injectable()` e implementar una interfaz:

```typescript
// ❌ Enfoque clásico basado en clases (Verbose):
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn()) return true;
    return this.router.parseUrl('/login');
  }
}
```

### La Revolución de los Guards Funcionales (`CanActivateFn` - Angular 15 y 16)
Angular 15 deprecó las interfaces de clases y las reemplazó por **funciones puras** que aprovechan `inject()`:

```typescript
// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true; // Acceso permitido
  }

  // Redirección segura devolviendo un UrlTree:
  console.warn('Acceso denegado: redirigiendo al login...');
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

*Asignación directa y limpia en las rutas:*
```typescript
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard] // Función directa sin clases
  }
];
```

---

## 14.3 Guard de Salida: `CanDeactivateFn`

Evita que un usuario pierda información crítica si intenta salir accidentalmente de un formulario sin guardar:

```typescript
// src/app/core/guards/formulario-guardado.guard.ts
import { CanDeactivateFn } from '@angular/router';

export interface FormularioConCambios {
  tieneCambiosPendientes(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<FormularioConCambios> = (component) => {
  if (component.tieneCambiosPendientes()) {
    return confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir de esta página?');
  }
  return true;
};
```

---

## 14.4 Precarga de Datos con `ResolveFn`

Un *Resolver* garantiza que el componente solo se cargue cuando los datos estén listos en memoria:

```typescript
// src/app/features/usuarios/resolvers/usuario.resolver.ts
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UsuariosService, Usuario } from '../services/usuarios.service';

export const usuarioResolver: ResolveFn<Usuario> = (route) => {
  const id = Number(route.paramMap.get('id'));
  return inject(UsuariosService).obtenerPorId(id);
};
```

```typescript
// En la ruta:
{
  path: 'usuarios/:id',
  component: UsuarioDetalleComponent,
  resolve: { usuario: usuarioResolver }
}
```

---

## 14.5 La Joya de Angular 16: `withComponentInputBinding()`

En Angular 16, ya no es necesario inyectar `ActivatedRoute` para leer parámetros de URL (`:id`), query params (`?tab=info`) o datos resueltos por resolvers. ¡Angular puede vincularlos automáticamente a propiedades **`@Input()`** con el mismo nombre!

### Activación en el Router:
```typescript
// main.ts (o app.module.ts)
import { provideRouter, withComponentInputBinding } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
});
```

### Consumo Simplificado en el Componente:
```typescript
// usuario-detalle.component.ts (Ruta: /usuarios/:id?tab=historial)
import { Component, Input } from '@angular/core';
import { Usuario } from '../services/usuarios.service';

@Component({...})
export class UsuarioDetalleComponent {
  // Recibe automáticamente el parámetro de ruta :id:
  @Input() id!: string;

  // Recibe automáticamente el query param ?tab:
  @Input() tab?: string;

  // Recibe automáticamente el dato resuelto por el Resolver:
  @Input() usuario!: Usuario;
}
```

---

## 🛠️ Reto Práctico del Módulo

1. Crea un `authGuard` funcional que valide si existe un token en `localStorage`.
2. Si no existe, redirige al usuario a `/login` devolviendo un `UrlTree`.
3. Protege una ruta `/dashboard` con el guard.
4. Intenta acceder desde el navegador escribiendo la URL directamente y comprueba la redirección.
