# Módulo 5: Directivas Estructurales Clásicas (`*ngIf`, `*ngFor`, `*ngSwitch`)

A diferencia de las directivas de atributo (que solo modifican el estilo o comportamiento de un elemento existente), las **directivas estructurales** alteran drásticamente la estructura del DOM: agregan, eliminan o manipulan árboles enteros de nodos.

En Angular tradicional (v2 a v16), las directivas estructurales se reconocen por el prefijo de **asterisco (`*`)**, que activa la microsintaxis de plantillas de Angular.

---

## 5.1 La Microsintaxis y el Desazucarado (*De-sugaring*)

El asterisco `*` es azúcar sintáctico (*syntactic sugar*). El compilador de Angular transforma internamente cualquier elemento con asterisco en una etiqueta **`<ng-template>`**:

```html
<!-- Código escrito por el desarrollador: -->
<div *ngIf="autenticado">Contenido privado</div>

<!-- Código transformado internamente por el compilador de Angular: -->
<ng-template [ngIf]="autenticado">
  <div>Contenido privado</div>
</ng-template>
```

---

## 5.2 `*ngIf`: Renderizado Condicional

Elimina físicamente el elemento del DOM si la condición es falsa (a diferencia de ocultarlo visualmente con CSS `display: none`):

```html
<!-- 1. Condicional simple -->
<div *ngIf="cargando" class="spinner">Cargando datos...</div>

<!-- 2. Condicional con bloque else mediante <ng-template> -->
<div *ngIf="usuario; else noUsuarioTemplate">
  <h3>Bienvenido, {{ usuario.nombre }}</h3>
</div>

<ng-template #noUsuarioTemplate>
  <button (click)="iniciarSesion()">Iniciar Sesión</button>
</ng-template>

<!-- 3. Asignación de alias con 'as' (crucial con el AsyncPipe) -->
<div *ngIf="usuario$ | async as user">
  <p>Correo verificado: {{ user.email }}</p>
</div>
```

---

## 5.3 `*ngFor`: Renderizado de Listas y la Regla `trackBy`

Itera sobre colecciones iterables (arrays) y clona el nodo por cada elemento:

```html
<ul>
  <li *ngFor="let producto of productos; 
              let i = index; 
              let esPrimero = first; 
              let esPar = even">
    #{{ i + 1 }} - {{ producto.nombre }} 
    <span *ngIf="esPrimero">(Líder de ventas)</span>
  </li>
</ul>
```

### Variables Exportadas de `*ngFor`:
- **`index: number`:** Índice base cero del elemento actual.
- **`first: boolean`:** `true` si es el primer elemento.
- **`last: boolean`:** `true` si es el último elemento.
- **`even: boolean`:** `true` si el índice es par.
- **`odd: boolean`:** `true` si el índice es impar.
- **`count: number`:** La longitud total de la colección.

### ⚠️ El Pecado Capital del Rendimiento: Olvidar `trackBy`
Por defecto, cuando el array en el componente cambia (por ejemplo, tras una recarga de datos por API), Angular no sabe qué elementos cambiaron por referencia de memoria y **destruye y recrea todos los nodos del DOM de la lista**. Esto provoca parpadeos visuales y pérdida de foco.

**La Solución:** Definir una función `trackBy` que devuelva un identificador único (ID):

```typescript
// En el componente:
@Component({...})
export class ListaProductosComponent {
  public productos: Producto[] = [];

  // Función que indica a Angular cómo identificar únicamente cada fila:
  public trackPorId(index: number, producto: Producto): number {
    return producto.id;
  }
}
```

```html
<!-- En la plantilla: -->
<ul>
  <li *ngFor="let producto of productos; trackBy: trackPorId">
    {{ producto.nombre }} - ${{ producto.precio }}
  </li>
</ul>
```

---

## 5.4 `*ngSwitch`: Selección Múltiple

Funciona como la sentencia `switch` de programación:

```html
<div [ngSwitch]="rolUsuario">
  <app-panel-admin *ngSwitchCase="'ADMIN'"></app-panel-admin>
  <app-panel-editor *ngSwitchCase="'EDITOR'"></app-panel-editor>
  <app-panel-lector *ngSwitchCase="'LECTOR'"></app-panel-lector>
  <p *ngSwitchDefault>Acceso denegado: rol desconocido.</p>
</div>
```

---

## 5.5 `<ng-container>` vs `<ng-template>`

| Elemento | ¿Se renderiza en el DOM? | Propósito Principal |
| :--- | :---: | :--- |
| **`<ng-container>`** | **No** (es invisible) | Agrupar elementos para aplicar directivas estructurales sin añadir un `<div>` extra que rompa el layout (CSS Grid / Flexbox). |
| **`<ng-template>`** | **No** (inactivo hasta instanciarse) | Declarar un fragmento de plantilla inerte para ser instanciado bajo demanda por `*ngIf; else` o `ViewContainerRef`. |

```html
<!-- Evita divs innecesarios que arruinen tu Flexbox o Grid: -->
<ng-container *ngIf="mostrarDetalles">
  <h2>Detalles de la Orden</h2>
  <p>Fecha: 2026-09-27</p>
</ng-container>
```

---

## 🛠️ Reto Práctico del Módulo

1. Construye una tabla HTML de usuarios (`<table>`) iterada con `*ngFor`.
2. Utiliza las variables `even` y `odd` para pintar filas alternadas (*striped table*).
3. Añade una función `trackBy` obligatoria en el componente asociada al `id` de cada usuario.
4. Muestra un `<ng-container>` con un mensaje amigable si la lista de usuarios está vacía (`usuarios.length === 0`).
