# Módulo 2: JSX, Renderizado y Componentes

JSX es una extensión de sintaxis de JavaScript que permite escribir estructuras similares a HTML directamente dentro del código. No es HTML real ni un string — se compila a llamadas de JavaScript (`React.createElement(...)`) que construyen la estructura que React debe renderizar.

## 2.1 Sintaxis Básica de JSX

```tsx
function Saludo() {
  return <h1>Hola, mundo</h1>
}
```

JSX se parece a HTML pero tiene reglas propias importantes:

* **Un solo elemento raíz**: un componente debe devolver un único nodo. Si necesitas varios elementos hermanos, se envuelven en un fragmento.
* **Los atributos usan camelCase**: `class` se escribe `className`, `onclick` se escribe `onClick`, `for` se escribe `htmlFor`.
* **Las etiquetas sin contenido deben cerrarse**: `<img />`, `<br />`, `<input />`.

## 2.2 Fragmentos — Devolver Varios Elementos sin un `<div>` Extra

```tsx
function Lista() {
  return (
    <>
      <h2>Título</h2>
      <p>Descripción</p>
    </>
  )
}
```

`<>...</>` es la sintaxis abreviada de `<React.Fragment>...</React.Fragment>` — agrupa elementos sin agregar un nodo real adicional al DOM.

## 2.3 Interpolar Valores de JavaScript con `{ }`

Cualquier expresión de JavaScript puede insertarse dentro de una sola llave.

```tsx
function Perfil() {
  const nombre = 'Alex'
  const edad = 28

  return (
    <div>
      <p>Nombre: {nombre}</p>
      <p>Edad: {edad}</p>
      <p>Mayor de edad: {edad >= 18 ? 'Sí' : 'No'}</p>
      <p>Suma: {2 + 2}</p>
    </div>
  )
}
```

Dentro de `{ }` solo se aceptan **expresiones** (algo que produce un valor) — no declaraciones como `if` o `for`. Para lógica condicional se usan operadores como el ternario (visto en el Módulo 6).

## 2.4 Atributos Dinámicos

```tsx
function Imagen() {
  const url = '/logo.png'
  const descripcion = 'Logo de la aplicación'

  return <img src={url} alt={descripcion} />
}
```

## 2.5 Estilos en Línea — La Sintaxis de Doble Llave

Un caso especial que suele confundir a quien empieza: `style` recibe un **objeto** de JavaScript, así que se escribe con doble llave — la llave externa es la interpolación de JSX, la interna es la sintaxis literal de un objeto.

```tsx
function Alerta() {
  const estilos = {
    color: 'white',
    backgroundColor: 'crimson',
    padding: '8px'
  }

  return <div style={estilos}>Mensaje de error</div>
}
```

También puede escribirse el objeto directamente en línea:

```tsx
<div style={{ color: 'white', backgroundColor: 'crimson' }}>Mensaje de error</div>
```

Las propiedades CSS con guion se escriben en camelCase (`background-color` → `backgroundColor`).

## 2.6 Clases Condicionales

```tsx
function Boton({ activo }: { activo: boolean }) {
  return <button className={activo ? 'btn btn-activo' : 'btn'}>Enviar</button>
}
```

Para combinar varias clases condicionalmente en proyectos más grandes, una librería como `clsx` simplifica mucho la sintaxis (se retoma en el Módulo 3).

## 2.7 Componentes que Usan Otros Componentes

```tsx
function Encabezado() {
  return <header>Mi Aplicación</header>
}

function Pie() {
  return <footer>© 2026</footer>
}

function App() {
  return (
    <div>
      <Encabezado />
      <main>Contenido principal</main>
      <Pie />
    </div>
  )
}
```

Un componente se "usa" en JSX exactamente igual que una etiqueta HTML, pero con mayúscula inicial — así React distingue `<Encabezado />` (un componente) de `<header>` (una etiqueta nativa del DOM).

## 2.8 Comentarios Dentro de JSX

```tsx
function App() {
  return (
    <div>
      {/* Esto es un comentario dentro de JSX */}
      <p>Contenido visible</p>
    </div>
  )
}
```

Los comentarios `//` y `/* */` normales de JavaScript no funcionan directamente dentro del JSX — deben envolverse en `{ }`.

## 2.9 Tabla de Referencia Rápida

| HTML | JSX |
| :--- | :--- |
| `class="..."` | `className="..."` |
| `for="..."` | `htmlFor="..."` |
| `onclick="..."` | `onClick={funcion}` |
| `style="color: red"` | `style` recibe un objeto (ver 2.5) |
| `<!-- comentario -->` | `{/* comentario */}` |
| Varios elementos raíz | `<>...</>` (Fragmento) |

## 2.10 Errores Comunes

* **Devolver varios elementos sin envolverlos**: `return <h1>...</h1><p>...</p>` produce un error de sintaxis — siempre debe haber un único elemento raíz (o un Fragmento).
* **Usar `class` en lugar de `className`**: React lo acepta silenciosamente en el HTML resultante, pero no aplicará los estilos ni las clases correctamente, y la consola mostrará un warning.
* **Olvidar la doble llave en `style`**: escribir `style="color: red"` (como en HTML puro) no funciona en JSX — siempre requiere un objeto de JavaScript.
