# Módulo 13: Enrutamiento y Navegación (*Angular Router*)

El **Angular Router** (`@angular/router`) gestiona la navegación entre diferentes vistas sin recargar la página completa en el navegador, preservando el estado de la aplicación y permitiendo la división de código en trozos descargables bajo demanda (*Code Splitting*).

---

## 13.1 Configuración de Rutas

Una ruta mapea una URL del navegador a un componente específico:

```typescript
// src/app/app-routing.module.ts (o app.routes.ts en Standalone)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { PaginaNoEncontradaComponent } from './shared/components/404/404.component';

export const routes: Routes = [
  // 1. Ruta por defecto con redirección obligatoria
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // 2. Ruta estática
  { path: 'home', component: HomeComponent },

  // 3. Ruta dinámica con parámetro (:id)
  { 
    path: 'usuarios/:id', 
    loadComponent: () => import('./features/usuarios/detalle/detalle.component').then(m => m.UsuarioDetalleComponent) 
  },

  // 4. Ruta comodín (Wildcard) para capturar errores 404 (SIEMPRE al final de la lista)
  { path: '**', component: PaginaNoEncontradaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

---

## 13.2 Navegación Declarativa vs Imperativa

### 1. Navegación Declarativa en Plantillas
Se realiza mediante la directiva `routerLink` y se marca la pestaña activa con `routerLinkActive`:

```html
<nav class="barra-navegacion">
  <!-- Navegación a ruta estática -->
  <a routerLink="/home" routerLinkActive="activo" [routerLinkActiveOptions]="{ exact: true }">
    Inicio
  </a>

  <!-- Navegación con segmentos dinámicos y query params -->
  <a [routerLink]="['/productos', producto.id]" [queryParams]="{ vista: 'cuadricula' }">
    Ver Producto
  </a>
</nav>

<!-- Punto de inserción donde el Router dibuja el componente de la ruta actual -->
<main>
  <router-outlet></router-outlet>
</main>
```

### 2. Navegación Imperativa desde TypeScript
Se utiliza el servicio inyectable `Router`:

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({...})
export class PanelAccionesComponent {
  private router = inject(Router);

  irADetalle(id: number): void {
    // Equivale a navegar a: /productos/45?descuento=true#resenas
    this.router.navigate(['/productos', id], {
      queryParams: { descuento: true },
      fragment: 'resenas'
    });
  }
}
```

---

## 13.3 Lectura de Parámetros con `ActivatedRoute`

Para leer los parámetros dinámicos (`:id`) y parámetros de consulta (`?busqueda=angular`):

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({...})
export class UsuarioDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // 1. Lectura por Snapshot (Foto fija en el momento de carga):
    // Útil si la página NUNCA cambia a otro usuario mientras sigue abierta
    const idFijo = this.route.snapshot.paramMap.get('id');
    console.log('ID inicial:', idFijo);

    // 2. Lectura Reactiva con Observable (Recomendado):
    // Imprescindible si la URL puede cambiar de /usuarios/1 a /usuarios/2 sin desmontar el componente
    this.route.paramMap.subscribe(params => {
      const nuevoId = params.get('id');
      this.cargarUsuario(nuevoId);
    });

    // Lectura de Query Params (?filtro=activos):
    this.route.queryParamMap.subscribe(queryParams => {
      const filtro = queryParams.get('filtro');
      console.log('Filtro activo:', filtro);
    });
  }

  private cargarUsuario(id: string | null): void { /* ... */ }
}
```

---

## 13.4 Carga Perezosa (*Lazy Loading*)

El *Lazy Loading* retrasa la descarga del código de una sección hasta que el usuario hace clic para entrar a esa ruta, acelerando la carga inicial de la aplicación:

### 1. Lazy Loading Clásico con `NgModule` (Angular 14 y anterior):
```typescript
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
}
```

### 2. Lazy Loading con Standalone Routes (Angular 15 y 16):
```typescript
{
  path: 'ventas',
  loadChildren: () => import('./features/ventas/ventas.routes').then(m => m.VENTAS_ROUTES)
}
```

---

## 13.5 Rutas Hijas (*Child Routes*)

Permite anidar múltiples `<router-outlet>` dentro de una sección para crear paneles laterales y pestañas:

```typescript
export const routes: Routes = [
  {
    path: 'ajustes',
    component: AjustesLayoutComponent,
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'perfil', component: AjustesPerfilComponent },
      { path: 'seguridad', component: AjustesSeguridadComponent }
    ]
  }
];
```

---

## 🛠️ Reto Práctico del Módulo

1. Configura un enrutador con rutas `/catalogo` y `/catalogo/:productoId`.
2. Dentro de `CatalogoDetalleComponent`, suscríbete a `route.paramMap` para capturar el `productoId`.
3. Añade dos botones en la plantilla para navegar a `/catalogo/101` y `/catalogo/102` y verifica que el componente actualiza la información sin necesidad de recargar la página.
