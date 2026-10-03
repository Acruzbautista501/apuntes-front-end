# Módulo 8: La Nueva API de Comunicación: `input()`, `output()` y `model()`

En **Angular 17.1**, el equipo de Angular completó la integración de los Signals en la comunicación entre componentes. Los antiguos decoradores `@Input()` y `@Output()` con `EventEmitter` han sido sustituidos por una API basada en funciones: **Signal Inputs**, **Signal Outputs** y **Model Inputs**.

---

## 8.1 Signal Inputs: `input()` e `input.required()`

Un **Signal Input** expone una propiedad que recibe datos del componente padre, pero internamente se comporta como un **Signal de sólo lectura (`InputSignal<T>`)**:

```typescript
// tarjeta-usuario.component.ts (Hijo)
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-tarjeta-usuario',
  standalone: true,
  template: `
    <div class="tarjeta" [class.destacado]="esVip()">
      <h3>{{ nombreCompleto() }}</h3>
      <p>Rol: {{ rol() }}</p>
    </div>
  `
})
export class TarjetaUsuarioComponent {
  // 1. Input Opcional con valor por defecto:
  public rol = input<string>('Invitado');

  // 2. Input Obligatorio (Error de compilación si el padre lo omite):
  public nombre = input.required<string>();
  public apellido = input.required<string>();

  // 3. Input con transformación automática:
  public esVip = input(false, { transform: booleanAttribute });

  // ¡Podemos derivar computados directamente de los inputs sin ngOnChanges!
  public nombreCompleto = computed(() => `${this.nombre()} ${this.apellido()}`);
}
```

```html
<!-- En la plantilla del padre: -->
<app-tarjeta-usuario 
  [nombre]="'Carlos'" 
  [apellido]="'Santana'" 
  [rol]="'Administrador'" 
  esVip 
/>
```

### Ventajas de `input()` frente a `@Input()`:
1. **Sin `ngOnChanges`:** Al ser Signals, puedes conectarlos directamente a `computed()` o `effect()`.
2. **Transformadores nativos:** Con `{ transform: booleanAttribute }`, puedes pasar atributos HTML booleanos como `esVip` sin necesidad de escribir `[esVip]="true"`.
3. **Tipado estricto:** `input.required()` garantiza que nunca tendrás que lidiar con `undefined` involuntarios.

---

## 8.2 La Nueva Función `output()`

Para emitir eventos hacia el padre, la función **`output()`** reemplaza a `@Output()` y prescinde de `EventEmitter` de RxJS:

```typescript
// selector-cantidad.component.ts (Hijo)
import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-selector-cantidad',
  standalone: true,
  template: `
    <button (click)="cambiar(-1)">-</button>
    <span>{{ cantidad() }}</span>
    <button (click)="cambiar(1)">+</button>
  `
})
export class SelectorCantidadComponent {
  public cantidad = signal<number>(1);

  // Declaración del evento de salida:
  public cantidadCambiada = output<number>();

  cambiar(delta: number): void {
    this.cantidad.update(c => Math.max(1, c + delta));
    // Emisión del evento tipado:
    this.cantidadCambiada.emit(this.cantidad());
  }
}
```

```html
<!-- Consumo en el padre: -->
<app-selector-cantidad (cantidadCambiada)="onActualizarCarrito($event)" />
```

---

## 8.3 El Revolucionario Two-Way Binding con `model()`

En Angular clásico, para crear un componente con enlace bidireccional `[(valor)]`, tenías que escribir un `@Input() valor` y un `@Output() valorChange = new EventEmitter()`, manteniendo ambos sincronizados manualmente.

En Angular moderno, todo ese código se reduce a **una sola línea** gracias a **`model()`**:

```typescript
// toggle-switch.component.ts (Hijo)
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  template: `
    <button class="switch" [class.on]="activo()" (click)="alternar()">
      {{ activo() ? 'ENCENDIDO' : 'APAGADO' }}
    </button>
  `
})
export class ToggleSwitchComponent {
  // model() crea un Input Y un Output sincronizados internamente:
  public activo = model<boolean>(false);

  alternar(): void {
    // Al modificar el Signal con .update(), se actualiza el componente hijo
    // Y se notifica automáticamente al padre sin escribir ningún emit():
    this.activo.update(v => !v);
  }
}
```

```html
<!-- En el componente Padre (Two-Way Binding perfecto): -->
<app-toggle-switch [(activo)]="notificacionesHabilitadas" />
<p>Estado en el padre: {{ notificacionesHabilitadas() }}</p>
```

---

## 🛠️ Reto Práctico del Módulo

1. Crea un componente `app-slider-rango` que utilice `valor = model(50)`.
2. Añade un `min = input(0)` y un `max = input(100)`.
3. Vincula el componente en un padre con `[(valor)]="volumenAudio"`.
4. Muestra en el padre el valor en tiempo real y verifica cómo el Two-Way Binding funciona de forma nativa sin ningún `EventEmitter`.
