
# Módulo 1: Introducción y Configuración del Entorno

## 1.1 ¿Qué es TypeScript?
Para entender TypeScript, primero debemos mirar a **JavaScript (JS)**. JavaScript es el lenguaje que entienden todos los navegadores web. Es fantástico y flexible, pero tiene un problema: es de **tipado dinámico**. Esto significa que puedes guardar un número en una variable y, tres líneas más abajo, cambiarlo por un texto. El navegador no se quejará hasta que el código falle en producción frente al usuario.

**TypeScript (TS)** es un "superconjunto" (superset) de JavaScript creado por Microsoft. Básicamente, es el mismo JavaScript que ya conoces, pero con **superpoderes**, siendo el principal de ellos el **tipado estático**.

### 💡 Características Clave:
* **Tipado Estático:** Le dices al lenguaje qué tipo de dato debe ir en cada variable (número, texto, objeto). Si intentas poner algo diferente, el editor te avisará antes de que ejecutes el programa.
* **Transpilación:** Los navegadores no entienden TypeScript. Por lo tanto, el código de TS pasa por un proceso donde se "traduce" a JavaScript limpio y estándar.
* **Autocompletado Brutal:** Al saber exactamente qué tipo de datos estás usando, Visual Studio Code te sugerirá métodos y propiedades precisas, reduciendo drásticamente las veces que tienes que ir a revisar la documentación.


## 1.2 Vite: El estándar actual
Tradicionalmente, para trabajar con TypeScript y empaquetar una aplicación web para producción se usaban herramientas como **Webpack**. Aunque potentes, eran lentas de configurar y hacían que el servidor de desarrollo tardara segundos (o minutos) en recargar cada vez que hacías un cambio.

Aquí entra **Vite** (una palabra francesa que significa "rápido", pronunciada *vit*).

### ⚡ ¿Por qué usamos Vite?
1. **Arranque instantáneo:** No importa qué tan grande sea tu proyecto, el servidor de desarrollo arranca en milisegundos.
2. **HMR (Hot Module Replacement) ultra veloz:** Cuando guardas un archivo, solo se actualiza en el navegador la parte que cambiaste, sin recargar toda la página y de forma casi instantánea.
3. **Cero configuración inicial:** Viene listo para usar TypeScript, CSS moderno y assets sin tener que pelear con archivos de configuración gigantescos.


## 1.3 Instalación y Creación del Primer Proyecto
Para empezar a trabajar, necesitamos preparar nuestro ordenador. Sigue estos pasos:

### Paso 1: Requisitos previos
* **Node.js:** Es el entorno que nos permite ejecutar JavaScript en la computadora y usar el gestor de paquetes `npm`. (Descarga la versión LTS desde su web oficial).
* **Visual Studio Code:** El editor de código por excelencia para TypeScript.

### Paso 2: Crear el proyecto
Abre tu terminal (consola) en la carpeta donde guardas tus proyectos y ejecuta el siguiente comando:

```bash
npm create vite@latest mi-primer-proyecto
```

La terminal te hará unas preguntas. Responde así:
1. **Select a framework:** Elige `Vanilla` (JavaScript/TypeScript puro, sin frameworks como Vue o React por ahora).
2. **Select a variant:** Elige `TypeScript`.

### Paso 3: Instalar dependencias y arrancar
Entra a la carpeta que se acaba de crear, instala los paquetes necesarios y enciende el servidor de pruebas:

```bash
cd mi-primer-proyecto
npm install
npm run dev
```

¡Listo! La terminal te dará una dirección parecida a `http://localhost:5173/`. Ábrela en tu navegador para ver tu aplicación corriendo.


## 1.4 Estructura del Proyecto y Archivos Clave
Cuando abras la carpeta en Visual Studio Code, verás varios archivos. Vamos a desmitificar los más importantes:

### 📁 Carpetas
* **`node_modules/`**: Aquí viven todas las librerías que descargamos de internet. Nunca debes modificar nada aquí dentro y no se sube a repositorios como GitHub.
* **`public/`**: Contiene archivos estáticos que no cambian, como el favicon (el icono de la pestaña del navegador).

### 📄 Archivos de Configuración
* **`package.json`**: Es el "DNI" de tu proyecto. Dice cómo se llama, qué comandos puedes usar (como `dev` o `build`) y qué librerías necesita para funcionar.
* **`tsconfig.json`**: El archivo de reglas de TypeScript. Aquí le dices al compilador qué tan estricto quieres que sea con los tipos de datos o a qué versión de JavaScript debe traducir tu código.
* **`vite.config.ts`**: Si en el futuro necesitas añadir plugins a Vite (como soporte para cargar ciertos archivos especiales), se hace aquí.

### 🧩 Archivos de Código
* **`index.html`**: La puerta de entrada. Es un HTML muy simple que contiene un `div` con el id `app` y una etiqueta `<script>` que llama a nuestro archivo de TypeScript.
* **`src/main.ts`**: **Este es el archivo más importante para ti ahora mismo.** Es el punto de entrada de la lógica de tu aplicación. Todo lo que escribas aquí es lo que se ejecutará en la web. Borra todo lo que viene por defecto y escribe tu primer código:

```typescript
// src/main.ts
const saludo: string = "¡Hola Mundo desde TypeScript y Vite!";
console.log(saludo);

const appDiv = document.querySelector<HTMLDivElement>('#app');
if (appDiv) {
  appDiv.innerHTML = `<h1>${saludo}</h1>`;
}
```