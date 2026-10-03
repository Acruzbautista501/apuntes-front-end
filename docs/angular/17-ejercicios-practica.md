# Módulo 17: Ejercicios Prácticos de Angular Clásico (v14 - v16)

Pon a prueba los conceptos dominados a lo largo de este bloque mediante ejercicios con escenarios empresariales reales, código completo y explicaciones detalladas.

---

## Ejercicio 1: Flujo Completo de Autenticación con Guard e Interceptor Funcionales

### Enunciado:
En una aplicación de Angular 15/16, construye el mecanismo de seguridad que:
1. Almacene el token JWT en memoria y en `localStorage`.
2. Intercepte todas las peticiones salientes con un `HttpInterceptorFn` para adjuntar el encabezado `Authorization: Bearer <token>`.
3. Proteja la ruta `/admin` mediante un `CanActivateFn` que redirija a `/login?returnUrl=...` si no existe una sesión activa.

### Solución:

```typescript
// 1. auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private tokenKey = 'app_jwt_token';
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public login(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedInSubject.next(true);
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    return this.hasToken();
  }
}
```

```typescript
// 2. auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

```typescript
// 3. auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

---

## Ejercicio 2: Formulario Reactivo Tipado Dinámico con `FormArray`

### Enunciado:
Construye un formulario de registro de cotizaciones con **`Typed Forms`** y **`NonNullableFormBuilder`** donde el usuario pueda agregar dinámicamente múltiples conceptos de factura con `descripcion`, `cantidad` y `precioUnitario`, calculando el total automáticamente de forma reactiva.

### Solución:

```typescript
// cotizacion-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';

interface LineaConcepto {
  descripcion: FormControl<string>;
  cantidad: FormControl<number>;
  precio: FormControl<number>;
}

@Component({
  selector: 'app-cotizacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <h3>Cliente:</h3>
      <input formControlName="cliente" placeholder="Nombre de la empresa" />

      <h3>Conceptos:</h3>
      <div formArrayName="conceptos">
        <div *ngFor="let item of conceptos.controls; let i = index" [formGroupName]="i" class="fila-concepto">
          <input formControlName="descripcion" placeholder="Descripción del servicio" />
          <input type="number" formControlName="cantidad" placeholder="Cant." min="1" />
          <input type="number" formControlName="precio" placeholder="Precio ($)" min="0" />
          <button type="button" (click)="eliminarConcepto(i)">X</button>
        </div>
      </div>

      <button type="button" (click)="agregarConcepto()">+ Agregar Fila</button>

      <div class="resumen">
        <h4>Total Calculado: ${{ total }}</h4>
      </div>

      <button type="submit" [disabled]="form.invalid">Guardar Cotización</button>
    </form>
  `
})
export class CotizacionFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  public total: number = 0;

  public form = this.fb.group({
    cliente: ['', [Validators.required, Validators.minLength(3)]],
    conceptos: this.fb.array<FormGroup<LineaConcepto>>([])
  });

  get conceptos(): FormArray<FormGroup<LineaConcepto>> {
    return this.form.controls.conceptos;
  }

  ngOnInit(): void {
    this.agregarConcepto(); // Al menos un concepto inicial

    // Recalcular total automáticamente en cada pulsación de teclado
    this.form.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
  }

  agregarConcepto(): void {
    const nuevaFila = this.fb.group<LineaConcepto>({
      descripcion: this.fb.control('', Validators.required),
      cantidad: this.fb.control(1, [Validators.required, Validators.min(1)]),
      precio: this.fb.control(0, [Validators.required, Validators.min(0)])
    });
    this.conceptos.push(nuevaFila);
  }

  eliminarConcepto(index: number): void {
    if (this.conceptos.length > 1) {
      this.conceptos.removeAt(index);
    }
  }

  private calcularTotal(): void {
    this.total = this.conceptos.controls.reduce((acum, control) => {
      const cant = control.controls.cantidad.value || 0;
      const precio = control.controls.precio.value || 0;
      return acum + (cant * precio);
    }, 0);
  }

  guardar(): void {
    if (this.form.valid) {
      console.log('Cotización lista para enviar:', this.form.getRawValue());
    }
  }
}
```

---

## Ejercicio 3: Buscador Reactivo Asíncrono con Cancelación de Peticiones

### Enunciado:
Implementa una barra de búsqueda de productos conectada a un campo `FormControl` que:
1. No dispare peticiones en cada pulsación; espere `300ms` tras la última tecla (`debounceTime`).
2. Evite peticiones duplicadas si el término no cambió (`distinctUntilChanged`).
3. Cancele automáticamente la petición HTTP en vuelo si el usuario vuelve a escribir antes de que la anterior responda (`switchMap`).
4. Utilice `AsyncPipe` en la plantilla sin gestionar suscripciones manuales.

### Solución:

```typescript
// buscador-productos.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, startWith } from 'rxjs/operators';

interface Producto {
  id: number;
  title: string;
  price: number;
}

@Component({
  selector: 'app-buscador-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="buscador-container">
      <input [formControl]="searchControl" placeholder="Buscar productos..." />

      <ul *ngIf="productos$ | async as productos">
        <li *ngFor="let p of productos; trackBy: trackById">
          {{ p.title }} - <strong>\${{ p.price }}</strong>
        </li>
        <li *ngIf="productos.length === 0">No se encontraron resultados.</li>
      </ul>
    </div>
  `
})
export class BuscadorProductosComponent implements OnInit {
  private http = inject(HttpClient);

  public searchControl = new FormControl<string>('', { nonNullable: true });
  public productos$!: Observable<Producto[]>;

  ngOnInit(): void {
    this.productos$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query.trim()) {
          return of([]);
        }
        return this.http.get<Producto[]>(`https://fakestoreapi.com/products?limit=5`).pipe(
          catchError(() => of([]))
        );
      })
    );
  }

  trackById(index: number, item: Producto): number {
    return item.id;
  }
}
```
