# Módulo 1: Introducción a Node.js y su Ecosistema

Todo lo cubierto hasta ahora en este sitio corre en el navegador. Node.js rompe esa barrera: es un **runtime de JavaScript fuera del navegador**, que permite usar el mismo lenguaje para construir servidores, APIs, scripts de línea de comandos y herramientas de build (como Vite, ya usado en las secciones de Vue.js y React).

## 1.1 ¿Qué es Node.js Exactamente?

Node.js **no es un lenguaje** — es un entorno de ejecución construido sobre el motor **V8** de Google Chrome (el mismo que ejecuta JavaScript en el navegador), con una capa adicional en C++ que expone APIs para interactuar con el sistema operativo: el sistema de archivos, la red, procesos, y más — cosas que el JavaScript del navegador nunca puede tocar por razones de seguridad.

```text
Navegador: JavaScript + APIs del DOM (document, window, fetch hacia el mismo origen con restricciones)
Node.js:    JavaScript + APIs del sistema (fs, net, process, sin restricciones de origen)
```

## 1.2 Por Qué Node.js Cambió el Desarrollo Web

* **Un solo lenguaje en todo el stack**: el mismo JavaScript/TypeScript que ya usas en Vue.js o React (secciones de Frameworks de este sitio) se usa también en el backend — sin cambiar de contexto mental entre lenguajes.
* **No bloqueante por diseño**: Node.js maneja miles de conexiones simultáneas de forma eficiente gracias a su modelo de I/O asíncrono (a fondo en el Módulo 4), a diferencia de modelos tradicionales que crean un hilo por conexión.
* **NPM**: el registro de paquetes más grande del mundo, con soluciones ya construidas para casi cualquier problema común (Módulo 5).

## 1.3 Instalación

```bash
# Verificar si ya está instalado
node --version
npm --version
```

Se recomienda instalar Node.js a través de un **gestor de versiones** en lugar de un instalador directo, para poder cambiar entre versiones según lo requiera cada proyecto.

```bash
# Con nvm (Node Version Manager) — el estándar recomendado
nvm install --lts
nvm use --lts
```

## 1.4 Versiones LTS vs Current

| Tipo de versión | Cuándo usarla |
| :--- | :--- |
| **LTS** (*Long Term Support*) | Recomendada para prácticamente todo proyecto real — estabilidad y soporte extendido |
| **Current** | Para experimentar con las características más recientes, no recomendada para producción |

## 1.5 Tu Primer Script de Node.js

```javascript
// hola.js
console.log('Hola desde Node.js')

const nombre = 'Mundo'
console.log(`Hola, ${nombre}`)
```

```bash
node hola.js
```

A diferencia del navegador, no hay `document` ni `window` — pero sí existen `console`, variables, funciones, y todo el JavaScript estándar del lenguaje (ES2015+), exactamente igual que en el navegador.

## 1.6 El Objeto Global `process`

```javascript
console.log(process.version)        // Versión de Node.js en ejecución
console.log(process.platform)       // Sistema operativo (linux, darwin, win32)
console.log(process.argv)            // Argumentos pasados al ejecutar el script
console.log(process.env.NODE_ENV)   // Variables de entorno
```

`process` es el equivalente conceptual a `window` en el navegador: un objeto global disponible en cualquier parte del código, con información y control sobre el proceso de Node.js en ejecución.

## 1.7 REPL — Ejecución Interactiva

```bash
node
> const x = 5
> x * 2
10
> .exit
```

El REPL (*Read-Eval-Print Loop*) permite ejecutar JavaScript línea por línea de forma interactiva, útil para probar fragmentos de código rápidamente sin crear un archivo.

## 1.8 Qué se Puede Construir con Node.js

* **APIs REST** (el foco principal de este curso, desde el Módulo 6 con Express).
* **Herramientas de línea de comandos (CLI)**.
* **Servidores en tiempo real** con WebSockets (Módulo 18).
* **Scripts de automatización y build** (los mismos que ya usaste indirectamente en Vite, en las secciones de Vue.js/React).
* **Aplicaciones de escritorio** (con Electron, fuera del alcance de este curso).

## 1.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Gestionar múltiples versiones de Node.js | `nvm` (Node Version Manager) |
| La versión recomendada para producción | La versión LTS más reciente |
| Ejecutar un archivo de JavaScript | `node archivo.js` |
| Información del entorno de ejecución | El objeto global `process` |
| Probar código rápidamente sin crear un archivo | El REPL (`node` sin argumentos) |

## 1.10 Errores Comunes

- **Instalar Node.js directamente sin un gestor de versiones**: dificulta cambiar entre versiones cuando distintos proyectos requieren versiones distintas de Node.js.
- **Usar la versión Current en un proyecto de producción**: prioriza siempre LTS para estabilidad, salvo que el proyecto realmente necesite una característica muy reciente no disponible en LTS.
- **Asumir que `window`/`document` están disponibles**: son específicos del navegador; Node.js tiene su propio conjunto de globales (`process`, `global`, `__dirname` en CommonJS).
