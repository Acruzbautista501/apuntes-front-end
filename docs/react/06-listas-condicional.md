# Módulo 6: Renderizado Condicional y Listas

React no tiene directivas como `v-if` o `v-for` — el renderizado condicional y la iteración se resuelven con **JavaScript puro** dentro del JSX. Este módulo cubre los patrones idiomáticos para ambos casos.

## 6.1 Renderizado Condicional con Operador Ternario

```tsx
function Estado({ conectado }: { conectado: boolean }) {
  return <p>{conectado ? 'En línea' : 'Desconectado'}</p>
}
```

El ternario es la forma preferida cuando hay **dos** posibles resultados, ambos con JSX o texto.

## 6.2 Renderizado Condicional con `&&`

Cuando solo quieres mostrar algo si una condición es verdadera (sin un "else"), el operador `&&` es más conciso que un ternario con `null` en el segundo caso.

```tsx
function Notificacion({ hayMensajes, cantidad }: { hayMensajes: boolean; cantidad: number }) {
  return (
    <div>
      {hayMensajes && <span className="badge">{cantidad} mensajes nuevos</span>}
    </div>
  )
}
```

> **Cuidado con el número `0`:** `{cantidad && <span>...}` cuando `cantidad` es `0` renderiza literalmente el número `0` en la pantalla (porque `0` es "falsy" pero no es `false` ni `null`). La forma segura es convertir explícitamente a booleano: `{cantidad > 0 && <span>...}`.

## 6.3 Renderizado Condicional con una Variable

Para lógica condicional más compleja (varias ramas, cálculos previos), es más legible calcular el contenido en una variable antes del `return`.

```tsx
function Estado({ codigo }: { codigo: 'cargando' | 'error' | 'listo' }) {
  let contenido

  if (codigo === 'cargando') {
    contenido = <p>Cargando...</p>
  } else if (codigo === 'error') {
    contenido = <p className="error">Ocurrió un error</p>
  } else {
    contenido = <p>Contenido listo</p>
  }

  return <div>{contenido}</div>
}
```

## 6.4 Ocultar un Componente por Completo

Devolver `null` desde un componente es válido en React — simplemente no renderiza nada, sin dejar ningún nodo vacío en el DOM (a diferencia de `v-show`, que oculta con CSS pero mantiene el elemento).

```tsx
function Banner({ visible }: { visible: boolean }) {
  if (!visible) return null

  return <div className="banner">Aviso importante</div>
}
```

## 6.5 Renderizar Listas con `.map()`

```tsx
interface Tarea { id: number; texto: string }

function ListaTareas({ tareas }: { tareas: Tarea[] }) {
  return (
    <ul>
      {tareas.map((tarea) => (
        <li key={tarea.id}>{tarea.texto}</li>
      ))}
    </ul>
  )
}
```

`.map()` transforma cada elemento del array en un elemento JSX — es el equivalente exacto de `v-for`, pero usando el método nativo de arrays de JavaScript en lugar de una directiva especial.

## 6.6 La Prop `key` — Por Qué es Obligatoria

React usa `key` para identificar de forma estable cada elemento de una lista entre renders — le permite saber cuáles elementos cambiaron, se agregaron o se eliminaron, sin tener que volver a crear todo el DOM de la lista completa.

```tsx
// ❌ Sin key: React muestra un warning en consola y puede tener bugs de estado al reordenar
{tareas.map((tarea) => (
  <li>{tarea.texto}</li>
))}

// ✅ key con un identificador único y estable
{tareas.map((tarea) => (
  <li key={tarea.id}>{tarea.texto}</li>
))}
```

> **Nunca uses el índice del array como `key`** si la lista puede reordenarse, filtrarse o tener elementos insertados en medio — causa bugs sutiles donde React reutiliza el estado interno del elemento equivocado. El índice solo es seguro en listas estáticas que nunca cambian de orden ni de tamaño.

## 6.7 Filtrar y Transformar Antes de Renderizar

```tsx
function ListaPendientes({ tareas }: { tareas: Tarea[] }) {
  const pendientes = tareas.filter((t) => !t.completada)

  return (
    <ul>
      {pendientes.map((tarea) => (
        <li key={tarea.id}>{tarea.texto}</li>
      ))}
    </ul>
  )
}
```

`.filter()`, `.map()`, `.sort()` — cualquier método de array de JavaScript funciona sin ninguna sintaxis especial de React; simplemente se encadenan antes de renderizar.

## 6.8 Listas Anidadas

```tsx
interface Categoria { id: number; nombre: string; productos: { id: number; nombre: string }[] }

function Categorias({ categorias }: { categorias: Categoria[] }) {
  return (
    <div>
      {categorias.map((categoria) => (
        <div key={categoria.id}>
          <h3>{categoria.nombre}</h3>
          <ul>
            {categoria.productos.map((producto) => (
              <li key={producto.id}>{producto.nombre}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

Cada nivel de `.map()` necesita su propia `key`, única dentro de ese nivel específico de anidamiento (no necesita ser única en toda la aplicación).

## 6.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Mostrar A o B según una condición | Operador ternario `condicion ? A : B` |
| Mostrar algo solo si es verdadero (sin "else") | `condicion && <Elemento />` |
| Ocultar un componente por completo | `if (!condicion) return null` |
| Iterar un array y renderizar cada elemento | `.map()` + `key` única y estable |
| Mostrar solo algunos elementos de una lista | `.filter()` antes de `.map()` |

## 6.10 Errores Comunes

* **Olvidar `key` en `.map()`**: React funciona pero muestra un warning y puede tener errores de re-renderizado en listas dinámicas.
* **Usar el índice del array como `key` en listas que cambian de orden**: causa que el estado interno (inputs, checkboxes) se mezcle entre elementos al reordenar o eliminar.
* **Usar `{cantidad && <Componente />}` sin convertir a booleano**: si `cantidad` es `0`, React renderiza literalmente el texto "0" en pantalla en lugar de nada.
