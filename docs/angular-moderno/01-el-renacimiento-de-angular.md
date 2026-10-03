# Módulo 1: El Renacimiento de Angular (v17+) y el Nuevo Ecosistema

A finales de 2023, con el lanzamiento de la versión 17, el equipo de Google en Mountain View inauguró oficialmente una nueva época dorada bautizada como **"The Renaissance of Angular"** (El Renacimiento de Angular).

Angular 17, 18 y 19 representan la transformación más ambiciosa en la historia del framework: un nuevo logotipo e identidad visual, una nueva documentación interactiva oficial (`angular.dev`), un nuevo motor de empaquetado basado en **Vite y esbuild**, una sintaxis de plantilla nativa para control de flujo (`@if`, `@for`, `@defer`), reactividad de grano fino con **Signals** y el camino hacia la eliminación definitiva de Zone.js (**Zoneless**).

---

## 1.1 Comparativa Radical: Angular Clásico vs Angular Moderno

| Dimensión | Angular Clásico (v2 - v16) | Angular Moderno (v17 - v19+) |
| :--- | :--- | :--- |
| **Arquitectura Base** | `NgModule` obligatorio (o standalone opcional) | **Standalone por defecto absoluto** (cero `NgModule`) |
| **Control de Flujo** | Directivas estructurales (`*ngIf`, `*ngFor`) | **Bloques nativos:** `@if`, `@for`, `@switch` |
| **Carga Perezosa de Vistas** | Solo mediante rutas en el Router (`loadChildren`) | **Vistas diferidas declarativas:** `@defer` en plantillas |
| **Reactividad** | RxJS extensivo para todo y Zone.js | **Signals nativos** (`signal`, `computed`, `effect`) |
| **Comunicación Componentes** | Decoradores `@Input()`, `@Output()` | **Signal Inputs/Outputs:** `input()`, `output()`, `model()` |
| **Consultas al DOM** | `@ViewChild()`, `@ContentChild()` | **Signal Queries:** `viewChild()`, `contentChild()` |
| **Variables en Plantilla** | Hacks con `*ngIf="obs$ | async as x"` | **Sintaxis nativa `@let`** (Angular 18.1+) |
| **Detección de Cambios** | Zone.js y Dirty Checking completo | **Signals reactivos y modo Zoneless nativo** (v18+) |
| **Herramienta de Build** | Webpack tradicional | **Vite (Dev Server) + esbuild (Application Builder)** |

---

## 1.2 El Nuevo Motor de Compilación: Application Builder (Vite + esbuild)

En proyectos modernos de Angular, el empaquetador predeterminado en `angular.json` ya no es `@angular-devkit/build-angular:browser` (basado en Webpack), sino:

```json
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:application",
    "options": {
      "outputPath": "dist/mi-app-moderna",
      "index": "src/index.html",
      "browser": "src/main.ts",
      "polyfills": ["zone.js"]
    }
  }
}
```

### Ventajas de Rendimiento:
1. **Desarrollo ultrarrápido con Vite:** Recarga en caliente (*Hot Module Replacement*) instantánea en milisegundos gracias a la compilación nativa de TypeScript con esbuild.
2. **Compilación de producción hasta un 87% más rápida:** Reducción drástica de tiempos en pipelines de CI/CD.
3. **Soporte SSR y SSG unificado:** Generación estática y renderizado en servidor integrados directamente en el mismo comando de compilación sin paquetes adicionales complejos.

---

## 1.3 Instalación y Creación de Proyectos Modernos

```bash
# Instalar la versión más reciente del Angular CLI
npm install -g @angular/cli@latest

# Verificar versión (debe ser 17 o superior)
ng version

# Crear un proyecto moderno (Standalone por defecto)
ng new saas-moderno --style=scss --ssr=false
```

Al inspeccionar los archivos generados, notarás la ausencia total de `app.module.ts`:

```text
src/
├── main.ts            # Punto de arranque directo con bootstrapApplication
├── index.html         # HTML anfitrión
├── styles.scss        # Estilos globales
└── app/
    ├── app.config.ts  # Configuración unificada de proveedores de la aplicación
    ├── app.routes.ts  # Definición limpia de rutas
    ├── app.component.ts
    ├── app.component.html
    └── app.component.scss
```

---

## 1.4 La Filosofía de los Componentes Autónomos (*Standalone-First*)

A partir de Angular 17, cuando ejecutas `ng generate component`, el CLI crea automáticamente un componente con **`standalone: true`**:

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Importa solo lo que usa esta plantilla
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss' // Nota: styleUrl singular soportado desde v17
})
export class AppComponent {
  title = 'Angular Moderno';
}
```

> [!TIP]
> Observa que ya no es necesario importar `CommonModule` en la mayoría de los componentes si utilizas la nueva sintaxis de control de flujo (`@if`, `@for`), lo que reduce drásticamente el tamaño del código empaquetado.

---

## 🛠️ Reto Práctico del Módulo

1. Inicializa un nuevo proyecto con Angular CLI 17+: `ng new angular-renaissance --routing --style=scss`.
2. Revisa el archivo `angular.json` y constata el uso de `@angular-devkit/build-angular:application`.
3. Abre `src/app/app.config.ts` y comprueba cómo se centralizan los proveedores globales mediante la constante `ApplicationConfig`.
4. Ejecuta `ng serve` y comprueba la velocidad de compilación con Vite.
