# Módulo 4: El Bucle `@for` Nativo, la Obligatoriedad de `track` y `@empty`

Renderizar listas de datos de manera eficiente es uno de los mayores desafíos en cualquier framework frontend. En Angular clásico, el bucle `*ngFor` permitía omitir la función `trackBy`, lo que causaba que millones de aplicaciones en producción sufrieran problemas de rendimiento al destruir y recrear el DOM innecesariamente.

Con **Angular 17**, el nuevo bloque **`@for`** resuelve este problema de raíz: **el seguimiento de identidad (`track`) es estrictamente obligatorio por diseño del compilador**, y el rendimiento del algoritmo de reconciliación es hasta un **90% más rápido** que `*ngFor`.

---

## 4.1 Anatomía del Bloque `@for`

```html
<ul class="lista-usuarios">
  @for (usuario of usuarios; track usuario.id) {
    <li class="usuario-item">
      <span>{{ usuario.nombre }}</span>
      <span class="email">{{ usuario.email }}</span>
    </li>
  } @empty {
    <li class="sin-datos">
      <p>No se encontraron usuarios registrados en la base de datos.</p>
    </li>
  }
</ul>
```

```mermaid
flowchart TD
    Data["Array: usuarios"] --> Check{"¿El array tiene elementos?"}
    Check -->|Sí (length > 0)| Loop["Itera con @for<br/>(Alineación óptima mediante 'track')"]
    Check -->|No (length === 0)| Empty["Renderiza directamente el bloque nativo @empty"]
```

---

## 4.2 La Regla de Oro: ¿Por Qué `track` es Obligatorio?

Si intentas escribir `@for (item of items)` sin la cláusula `track`, el compilador de Angular **rechazará la compilación inmediatamente**.

### ¿Cómo Funciona la Cláusula `track`?
Cuando el array cambia (por ejemplo, se agrega un nuevo elemento al inicio o se reordenan las filas), Angular utiliza el valor retornado por `track` para comparar los nodos existentes en el DOM con los nuevos datos en memoria:
- Si el ID ya existe en el DOM, **reutiliza el elemento del DOM existente** y solo actualiza sus propiedades.
- Si el ID es nuevo, inserta el nuevo nodo en la posición exacta.
- Si un ID desaparece, remueve únicamente ese nodo.

```html
<!-- 1. En colecciones con identificador único (La mejor opción): -->
@for (producto of productos; track producto.id) { ... }

<!-- 2. En arrays de elementos primitivos únicos (cadenas, números): -->
@for (categoria of categorias; track categoria) { ... }

<!-- 3. Si no existe ID y los datos son estáticos (Último recurso): -->
@for (item of items; track $index) { ... }
```

> [!WARNING]
> Usar `track $index` en listas dinámicas donde los elementos se pueden borrar, filtrar o reordenar puede provocar que Angular confunda qué elemento debe actualizarse. Utiliza siempre un identificador único real del objeto si está disponible.

---

## 4.3 Variables Contextuales Implícitas

Al iterar con `@for`, Angular pone a tu disposición un conjunto de variables de contexto prefijadas con el signo dólar (`$`):

| Variable | Tipo | Descripción |
| :--- | :---: | :--- |
| **`$index`** | `number` | Índice de base cero del elemento actual. |
| **`$count`** | `number` | Cantidad total de elementos en la colección iterada. |
| **`$first`** | `boolean` | `true` si es el primer elemento de la lista. |
| **`$last`** | `boolean` | `true` si es el último elemento de la lista. |
| **`$even`** | `boolean` | `true` si el índice actual es par ($0, 2, 4\dots$). |
| **`$odd`** | `boolean` | `true` si el índice actual es impar ($1, 3, 5\dots$). |

### Ejemplo Práctico:

```html
<div class="tabla-metricas">
  @for (registro of logs; track registro.timestamp; let i = $index, esUltimo = $last, esPar = $even) {
    <div class="fila" [class.fila-par]="esPar" [class.borde-final]="esUltimo">
      <span class="numero">#{{ i + 1 }}</span>
      <span class="mensaje">{{ registro.mensaje }}</span>
      @if (esUltimo) {
        <span class="tag-reciente">Más reciente</span>
      }
    </div>
  }
</div>
```

---

## 4.4 El Bloque de Respaldo Nativo: `@empty`

En Angular clásico, para mostrar un mensaje cuando un array estaba vacío, se tenía que añadir un elemento adicional con `*ngIf="items.length === 0"`, lo que duplicaba la lógica.

En Angular moderno, el bloque **`@empty`** se renderiza automáticamente si:
1. El array está vacío (`items.length === 0`).
2. El valor es `null` o `undefined` (por ejemplo, mientras carga un Observable con el `AsyncPipe`).

```html
@for (noticia of noticias$ | async; track noticia.id) {
  <app-noticia-card [noticia]="noticia" />
} @empty {
  <div class="empty-state">
    <img src="/assets/inbox-empty.svg" alt="Bandeja vacía" />
    <p>No tienes notificaciones pendientes.</p>
  </div>
}
```

---

## 🛠️ Reto Práctico del Módulo

1. Crea un array de productos tecnológicos con `id`, `nombre`, `precio` y `stock`.
2. Utiliza `@for` con `track producto.id` para renderizarlos en tarjetas de producto.
3. Si el stock es 0, añade una clase `.agotado` y muestra una insignia utilizando `$first` en el producto más vendido.
4. Vacía el array mediante un botón "Limpiar catálogo" y comprueba cómo el bloque `@empty` se activa de forma automática e instantánea.
