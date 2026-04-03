# Módulo 1: Introducción y Configuración

## 1.1 ¿Por qué TypeScript en el Front End?
JavaScript es un lenguaje de **tipado dinámico**, lo que significa que las variables pueden cambiar de tipo en cualquier momento. Esto es flexible, pero en proyectos grandes genera errores difíciles de rastrear.

**TypeScript (TS)** es un superset de JavaScript que añade **tipado estático**. Sus principales ventajas son:

* **Detección temprana de errores:** Los errores aparecen mientras escribes el código (en tiempo de desarrollo), no cuando el usuario final está usando la web.
* **Autocompletado inteligente (IntelliSense):** Al saber exactamente qué propiedades tiene un objeto, el editor te sugiere qué escribir, reduciendo errores de dedo.
* **Documentación viva:** El código se explica a sí mismo. Si ves `function save(user: User)`, sabes exactamente qué estructura debe tener el argumento `user`.


## 1.2 Configuración del entorno con Vite
Para el desarrollo moderno (especialmente con frameworks como Vue o React), ya no se configura TypeScript desde cero manualmente; se utilizan herramientas de construcción como **Vite**.

### Pasos para iniciar un proyecto:
1.  **Crear el proyecto:**
    ```bash
    npm create vite@latest mi-proyecto-ts
    ```
2.  **Seleccionar el framework:** (Vue, React, Vanilla, etc.) y elegir la variante **TypeScript**.
3.  **Instalar dependencias:**
    ```bash
    cd mi-proyecto-ts
    npm install
    ```
4.  **Correr el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

Vite se encarga de "transpilar" (convertir) tu código TS a JS de forma ultrarrápida mientras trabajas.


## 1.3 El archivo `tsconfig.json`
Este es el cerebro de TypeScript. Define cómo debe comportarse el compilador. Si abres este archivo en tu proyecto, verás opciones clave bajo `compilerOptions`:

* **`target`:** Define a qué versión de JavaScript se convertirá tu código (ej. `ESNext` para lo más moderno o `ES2020` para mayor compatibilidad).
* **`lib`:** Indica qué librerías de tipos conoce TS. Para Front End, es vital que incluya `"DOM"` y `"DOM.Iterable"` para que TS entienda qué es un `document.querySelector`.
* **`strict: true`:** **Fundamental.** Activa todas las comprobaciones de seguridad. Te obliga a definir tipos y evita que las variables sean `null` o `undefined` por accidente.
* **`moduleResolution`:** En proyectos de Vite, suele estar en `"Node"`, indicando cómo debe buscar los archivos que importas.


## 1.4 Flujo de trabajo: Compilación vs. Ejecución
Es importante entender que **el navegador no entiende TypeScript**.

1.  **Desarrollo:** Escribes archivos `.ts`. El editor (VS Code) te marca errores en rojo si rompes las reglas.
2.  **Transpilación:** El compilador de TS (o Vite/Esbuild) toma tus archivos `.ts` y genera archivos `.js` limpios.
3.  **Ejecución:** El navegador lee los archivos `.js`.

> **Nota importante:** TypeScript solo existe en tu editor. Una vez que el código llega al navegador, es JavaScript puro. El "escudo" de protección funciona mientras programas.


## 1.5 Primeros pasos: Tu primer archivo TS
Si creas un archivo `main.ts` en tu proyecto:

```typescript
// Definimos una interfaz simple
interface Saludo {
  mensaje: string;
  id: number;
}

// Usamos el tipo
const bienvenida: Saludo = {
  mensaje: "Hola Mundo desde TS",
  id: 1
};

console.log(bienvenida.mensaje);

// Si intentaras hacer esto, TS te daría un error antes de guardar:
// bienvenida.id = "uno"; // ❌ Error: 'string' no es asignable a 'number'
```

### ¿Cómo probarlo rápido?
Gracias a Vite, solo necesitas importar este `main.ts` en tu `index.html` mediante una etiqueta script:
`<script type="module" src="/src/main.ts"></script>`. 

Cualquier error de tipado detendrá la compilación o mostrará una advertencia clara en la terminal, asegurando que tu código sea mucho más robusto.