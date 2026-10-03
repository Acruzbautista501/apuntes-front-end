# Módulo 2: Arquitectura *Standalone-First* y Configuración de Aplicación

En Angular moderno, el concepto de `NgModule` queda reservado únicamente para interoperabilidad con librerías legadas. La arquitectura de toda la aplicación gira en torno a **Componentes Standalone** y un objeto de configuración centralizado llamado **`ApplicationConfig`**.

---

## 2.1 El Punto de Entrada: `main.ts` y `app.config.ts`

El arranque de la aplicación ya no pasa por `platformBrowserDynamic`. En su lugar, `src/main.ts` es extremadamente conciso:

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

Toda la configuración técnica global (enrutamiento, peticiones HTTP, animaciones y detección de cambios) se declara de forma funcional en `src/app/app.config.ts`:

```typescript
// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Optimización del ciclo de Zone.js (coalescencia de eventos)
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 2. Enrutador moderno con View Transitions nativas del navegador y binding a Inputs
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions() // Activa transiciones fluidas de página en navegadores Chromium
    ),

    // 3. Cliente HTTP optimizado utilizando la API Fetch nativa del navegador
    provideHttpClient(
      withFetch(), // Habilita la API fetch para mejor rendimiento y soporte SSR
      withInterceptors([authInterceptor])
    ),

    // 4. Animaciones asíncronas (carga el bundle de animaciones solo cuando se usan)
    provideAnimationsAsync()
  ]
};
```

---

## 2.2 Anatomía de un Componente Standalone Moderno

En Angular 17+, la propiedad `standalone: true` es el comportamiento por defecto y puede omitirse en versiones recientes, aunque se recomienda mantenerla explícita por claridad:

```typescript
// src/app/features/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { MetricCardComponent } from './components/metric-card/metric-card.component';
import { SalesChartComponent } from './components/sales-chart/sales-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Solo importamos los componentes específicos que la plantilla consume:
  imports: [
    MetricCardComponent,
    SalesChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Lógica del componente
}
```

> [!IMPORTANT]
> **Adiós al `CommonModule`:** Con el nuevo flujo de control nativo (`@if`, `@for`, `@switch`), ya **no necesitas importar `CommonModule`** en tus componentes standalone, a menos que utilices directivas antiguas como `ngClass` o `ngStyle` o pipes nativos (`date`, `currency`).

---

## 2.3 Composición de Directivas con `hostDirectives`

Angular moderno promueve la composición sobre la herencia. Si un componente necesita comportamientos de accesibilidad, arrastre o efectos visuales, puede incorporar directivas directamente en su definición de host:

```typescript
// Directivas standalone especializadas:
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input() tooltipText: string = '';
}

@Directive({
  selector: '[appRipple]',
  standalone: true
})
export class RippleDirective { /* Efecto material ripple al hacer clic */ }

// Componente que compone ambas directivas sin ensuciar la plantilla:
@Component({
  selector: 'app-action-button',
  standalone: true,
  hostDirectives: [
    RippleDirective,
    {
      directive: TooltipDirective,
      inputs: ['tooltipText: ayudaTexto'] // Renombra o expone el input al exterior
    }
  ],
  template: `<button class="btn"><ng-content></ng-content></button>`
})
export class ActionButtonComponent {}
```

```html
<!-- El consumidor usa el input de la directiva compuesta como si fuera del botón: -->
<app-action-button [ayudaTexto]="'Eliminar registro permanentemente'">
  Eliminar
</app-action-button>
```

---

## 🛠️ Reto Práctico del Módulo

1. Crea un servicio `ThemeService` con `providedIn: 'root'`.
2. En `app.config.ts`, añade una llamada inicial para aplicar el tema guardado en el navegador utilizando un `APP_INITIALIZER` funcional.
3. Genera un componente de navegación con `ng g c shared/components/navbar --standalone`.
4. Importa `RouterLink` y `RouterLinkActive` directamente en sus `imports` y verifica que los enlaces naveguen fluidamente con `withViewTransitions()`.
