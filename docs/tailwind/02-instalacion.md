# MÓDULO 2: Instalación y Entorno

En este módulo, pasaremos de la teoría a la práctica. Configuraremos Tailwind CSS 4, aprovechando su nueva arquitectura que simplifica drásticamente el proceso de integración en comparación con la versión 3.

## 2.1 Formas de usar Tailwind

Tailwind se adapta a cualquier flujo de trabajo, desde prototipos rápidos hasta aplicaciones escalables.

* **CDN (Content Delivery Network):** Ideal para prototipos rápidos o archivos HTML simples. No requiere instalación.
    * *Uso:* Solo añades la etiqueta `<script src="https://cdn.tailwindcss.com"></script>`. No recomendado para producción porque descarga todo el motor al cliente.
* **CLI (Command Line Interface):** Permite procesar CSS sin depender de un framework. Es la forma más rápida de usar Tailwind en proyectos estáticos o *backend* puro (PHP, Django).
* **PostCSS:** Es la forma en que Tailwind se integra como un plugin dentro de herramientas más grandes. Es el "motor" que utiliza el resto de los métodos.
* **Vite:** La opción estándar de la industria. Vite proporciona un entorno de desarrollo ultra rápido y una integración perfecta con Tailwind mediante plugins.
* **Frameworks Modernos:** Integraciones nativas que abstraen la configuración, permitiendo que Tailwind "simplemente funcione" apenas inicias el proyecto.

## 2.2 Instalación en Proyectos Modernos

Tailwind 4 simplifica el proceso al eliminar gran parte de la configuración compleja necesaria en versiones anteriores. Aquí tienes los comandos y pasos necesarios.

### Instalación con Vite (General)
Este es el método "estándar" si estás usando Vite fuera de un framework específico:

1.  **Instalar dependencias:**
    ```bash
    npm install tailwindcss @tailwindcss/vite
    ```
2.  **Configurar `vite.config.ts`:**
    ```typescript
    import { defineConfig } from 'vite';
    import tailwindcss from '@tailwindcss/vite';

    export default defineConfig({
      plugins: [
        tailwindcss(),
      ],
    });
    ```
3.  **Importar en tu CSS principal:**
    ```css
    @import "tailwindcss";
    ```



### Instalación con Vue (Vite + Vue)
Si utilizas un proyecto de Vue creado con `npm create vue@latest`, el proceso es casi idéntico al anterior pero dentro de un entorno optimizado para componentes `.vue`:

1.  **Instalar:** `npm install tailwindcss @tailwindcss/vite`
2.  **Configurar `vite.config.ts`:** Asegúrate de incluir el plugin dentro del array `plugins` existente en tu archivo de configuración.
3.  **Uso:** Tailwind escaneará automáticamente tus archivos `.vue`. Puedes empezar a usar clases inmediatamente:
    ```html
    <template>
      <h1 class="text-3xl font-bold text-blue-600">Hola, Vue + Tailwind!</h1>
    </template>
    ```

### Instalación con React
Tailwind 4 detecta automáticamente tus archivos `.jsx` o `.tsx` sin necesidad de configurar rutas de escaneo.

1.  **Instalar:** `npm install tailwindcss @tailwindcss/vite`
2.  **Configurar `vite.config.ts`:** (Si usas Vite para React).
    * Si usas **CRA (Create React App)**, recuerda que Tailwind 4 recomienda encarecidamente migrar a Vite por rendimiento.
3.  **Uso:** Simplemente añade el `@import "tailwindcss";` en tu `index.css` y las clases funcionarán en cualquier componente.

### Instalación con Nuxt / Next.js
Para estos frameworks, la experiencia es la más sencilla, ya que los módulos oficiales se encargan de todo.

* **Next.js:**
    1.  `npm install tailwindcss @tailwindcss/postcss`
    2.  En tu archivo `app/globals.css` (o `styles/globals.css`):
        ```css
        @import "tailwindcss";
        ```
    3.  El motor de Tailwind 4 se encargará de purgar y optimizar el CSS automáticamente al construir para producción.

* **Nuxt:**
    1.  `npm install -D @nuxtjs/tailwindcss`
    2.  En `nuxt.config.ts`:
        ```typescript
        export default defineNuxtConfig({
          modules: ['@nuxtjs/tailwindcss']
        })
        ```
    3.  Nuxt configurará automáticamente el entorno para que Tailwind sea totalmente responsivo dentro de tus layouts y páginas.

---

### Resumen de la Estructura de "Build Process"
Independientemente del framework, el proceso que sigue el sistema es:
1.  **Carga del plugin:** Vite o el framework invoca el compilador de Rust.
2.  **Escaneo de archivos:** Se leen todos los archivos del proyecto (`.vue`, `.jsx`, `.tsx`, `.html`).
3.  **Análisis JIT:** Se extraen las clases, se calculan los estilos y se generan las reglas CSS finales.
4.  **Generación de salida:** Se crea un archivo CSS único, optimizado y listo para producción.

## 2.3 Estructura básica del proyecto (Vite Puro)

Cuando inicias un proyecto con `npm create vite@latest`, la estructura resultante es la base para mantener una aplicación escalable.

### Estructura Recomendada
Esta es la jerarquía estándar para un proyecto limpio donde Tailwind 4 se integra directamente:

```text
/nombre-del-proyecto
├── node_modules/         # Dependencias instaladas por NPM
├── public/               # Assets estáticos (logos, favicons)
├── src/                  # Código fuente
│   ├── assets/           # Imágenes, fuentes, estilos globales
│   │   └── index.css     # <--- AQUÍ va el @import "tailwindcss";
│   ├── main.js           # Punto de entrada de JavaScript
│   └── style.css         # (Opcional) Estilos personalizados extra
├── index.html            # Punto de entrada del navegador
├── package.json          # Gestión de scripts y dependencias
├── vite.config.ts        # Configuración del servidor y Tailwind
└── tsconfig.json         # Configuración de TypeScript
```

### Archivos de Configuración Clave

* **`vite.config.ts`**: Es el cerebro. Aquí es donde activas el plugin de Tailwind para que Vite sepa cómo procesar tus estilos.
    ```typescript
    import { defineConfig } from 'vite';
    import tailwindcss from '@tailwindcss/vite';

    export default defineConfig({
      plugins: [
        tailwindcss(), // Aquí es donde Tailwind 4 se conecta
      ],
    });
    ```
* **`src/assets/index.css`**: En la versión 4, este archivo es el centro de mando. Al escribir `@import "tailwindcss";`, le indicas al motor que debe escanear todo el proyecto en busca de clases utilitarias para generar el CSS final.

### Cómo funciona el *Build Process* en Vite
Para un desarrollador Frontend, es vital entender el ciclo de vida del *Build*:

1.  **Resolución de dependencias:** Vite identifica `@import "tailwindcss";`.
2.  **Escaneo de Archivos (Watcher):** Mientras programas (`npm run dev`), Vite vigila tus archivos `.html`, `.js` y `.ts`.
3.  **Compilación en memoria:** Cada vez que guardas un cambio, el motor JIT de Tailwind analiza el archivo guardado. Si escribes una clase nueva, como `grid-cols-4`, Tailwind la genera instantáneamente y la inyecta en el navegador.
4.  **Generación final (Bundle):** Cuando ejecutas `npm run build`, Vite toma todas las clases que realmente usaste, las minifica, les aplica prefijos de navegador automáticamente y genera un archivo CSS ultra optimizado en la carpeta `dist/`.

> **Nota técnica:** A diferencia de sistemas antiguos que requerían un archivo `tailwind.config.js` externo, en Vite + Tailwind 4, la configuración de temas se integra directamente en el CSS:
> ```css
> @import "tailwindcss";
> @theme {
>   --color-primary: #1e40af; /* Tu color de Liga de Fútbol */
> }
> ```