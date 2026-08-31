# Módulo 2: Instalación y Primer Proyecto

Este módulo cubre cómo crear un proyecto Vite desde cero usando el andamiaje (*scaffolding*) oficial, y qué genera exactamente cada plantilla.

## 2.1 Requisitos Previos

```bash
node --version   # Vite requiere Node.js 18+ (verificar la versión mínima exacta en la documentación oficial)
```

Vite corre sobre Node.js durante el desarrollo (el servidor de desarrollo, la CLI) — no requiere ninguna instalación global adicional más allá de tener Node.js instalado, ya que se ejecuta a través de `npx`/`npm create` bajo demanda.

## 2.2 Crear un Proyecto Nuevo

```bash
npm create vite@latest mi-proyecto
```

```text
✔ Select a framework: › Vue
✔ Select a variant: › TypeScript
```

```bash
cd mi-proyecto
npm install
npm run dev
```

`npm create vite@latest` descarga y ejecuta el paquete de andamiaje oficial (`create-vite`), que hace preguntas interactivas sobre framework y variante antes de generar la estructura de archivos inicial.

## 2.3 Crear un Proyecto sin Modo Interactivo

```bash
npm create vite@latest mi-proyecto -- --template react-ts
```

```text
Plantillas disponibles: vanilla, vanilla-ts, vue, vue-ts, react, react-ts,
                          react-swc, react-swc-ts, preact, preact-ts,
                          lit, lit-ts, svelte, svelte-ts, solid, solid-ts, qwik, qwik-ts
```

El flag `--template` permite especificar directamente framework y variante (TypeScript o JavaScript), útil para scripts de automatización o cuando ya se sabe exactamente qué plantilla se necesita, sin pasar por las preguntas interactivas.

## 2.4 El Comando `dev`: Iniciar el Servidor

```bash
npm run dev
```

```text
  VITE v5.2.0  ready in 312 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

El tiempo de arranque ("ready in 312 ms") es una de las primeras diferencias notables frente a herramientas anteriores (Módulo 1.6) — permanece prácticamente constante sin importar el tamaño del proyecto, gracias a la estrategia de servir módulos ES nativos bajo demanda (Módulo 1.2).

## 2.5 Los Scripts Generados por Defecto

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

| Script | Qué hace |
| :--- | :--- |
| `dev` | Inicia el servidor de desarrollo con HMR (Módulo 4) |
| `build` | Genera el bundle optimizado de producción con Rollup (Módulo 15) |
| `preview` | Sirve localmente el resultado de `build`, para verificarlo antes de desplegar |

## 2.6 `npm run preview`: No Confundir con `dev`

```bash
npm run build
npm run preview
```

`preview` **no** es un servidor de desarrollo — sirve estáticamente los archivos ya generados por `build`, sin HMR ni recompilación — su único propósito es verificar localmente que el resultado final de producción funciona como se espera, antes de desplegarlo a un servidor real.

## 2.7 Instalar Vite en un Proyecto Existente (Sin Andamiaje)

```bash
npm install --save-dev vite
```

```json
// vite.config.js — el mínimo necesario para empezar (Módulo 6)
export default {}
```

Es posible agregar Vite a un proyecto que no partió del andamiaje oficial, aunque en la práctica casi siempre es más simple empezar con `npm create vite` y migrar el código existente a esa estructura, especialmente al integrar un framework específico.

## 2.8 Gestores de Paquetes Alternativos a NPM

```bash
pnpm create vite mi-proyecto
yarn create vite mi-proyecto
```

Vite funciona igual de bien con cualquier gestor de paquetes moderno — `pnpm` es particularmente popular en proyectos Vite por su eficiencia de espacio en disco (enlaces simbólicos compartidos entre proyectos), retomado en el contexto de monorepos en el Módulo 26.

## 2.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Crear un proyecto nuevo interactivamente | `npm create vite@latest` |
| Crear un proyecto con plantilla específica sin preguntas | `npm create vite@latest -- --template react-ts` |
| Iniciar el servidor de desarrollo | `npm run dev` |
| Generar el build de producción | `npm run build` |
| Verificar el build de producción localmente | `npm run preview` |

## 2.10 Errores Comunes

- **Confundir `npm run preview` con un servidor de desarrollo**: no tiene HMR ni recompila nada — solo sirve el resultado ya construido de `npm run build`, requiriendo ejecutar ese comando primero.
- **Usar una versión de Node.js demasiado antigua**: Vite depende de características modernas del runtime — verificar la versión mínima requerida en la documentación oficial antes de reportar errores de instalación como bugs.
- **Ejecutar `npm run dev` sin haber corrido `npm install` primero**: un error obvio pero frecuente al clonar un proyecto Vite existente — las dependencias (incluido Vite mismo) deben instalarse antes de poder iniciar el servidor.
