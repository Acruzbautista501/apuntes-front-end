# Módulo 11: Vite con TypeScript

TypeScript funciona con Vite de una forma particular que sorprende a quien viene de configuraciones tradicionales basadas en `tsc` o Babel — este módulo aclara exactamente qué hace Vite con TypeScript, y qué no.

## 11.1 Vite Solo Transpila, Nunca Verifica Tipos

```ts
function sumar(a: number, b: string): number {
  return a + b // Error de tipos real, pero...
}
```

```bash
npm run dev
# El servidor arranca sin problema, sin reportar el error de tipos
```

Este es el punto más importante y menos intuitivo de todo el módulo: Vite (a través de esbuild) **elimina las anotaciones de tipo y transpila el código a JavaScript**, sin verificar en absoluto si esos tipos son correctos — esbuild es deliberadamente rápido porque omite por completo la fase de verificación de tipos, dejando esa responsabilidad a una herramienta separada.

## 11.2 Por Qué Esta Decisión de Diseño

```text
Verificación de tipos completa: lenta, requiere analizar TODO el proyecto
Transpilación pura: extremadamente rápida, archivo por archivo, sin contexto global
```

Verificar tipos correctamente requiere entender el proyecto completo (para resolver tipos importados de otros archivos) — es una operación fundamentalmente más lenta que transpilar un archivo de forma aislada. Separar ambas responsabilidades es lo que permite que HMR (Módulo 4) sea tan rápido: cada guardado no espera a una verificación de tipos completa del proyecto.

## 11.3 Dónde Ocurre la Verificación de Tipos Real

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "typecheck": "tsc --noEmit"
  }
}
```

La plantilla oficial de Vite con TypeScript incluye `tsc --noEmit` como parte del script `build` — verifica los tipos de todo el proyecto **antes** de generar el bundle de producción, fallando el build si hay errores de tipos, aunque esbuild por sí solo los hubiera ignorado silenciosamente.

## 11.4 El Editor Sigue Verificando Tipos en Tiempo Real

```text
VS Code + extensión de TypeScript → verificación de tipos EN VIVO mientras escribes
```

Aunque Vite no verifique tipos al ejecutar `dev`, el editor (a través del servidor de lenguaje de TypeScript) sigue mostrando errores de tipos en tiempo real mientras se escribe código — en la práctica, la mayoría de los errores de tipos se detectan ahí, no al ejecutar comandos de terminal.

## 11.5 Características de TypeScript que esbuild NO Soporta

```ts
// ❌ NO soportado por esbuild: los "const enum" requieren información de todo el programa
const enum Color {
  Rojo,
  Verde,
}
```

```ts
// ✅ Alternativa: un enum normal SÍ funciona
enum Color {
  Rojo,
  Verde,
}
```

Por su naturaleza de transpilación archivo-por-archivo sin contexto global, esbuild no puede soportar algunas características de TypeScript que requieren analizar el proyecto completo — `const enum` es el ejemplo más citado; la documentación oficial de Vite mantiene una lista actualizada de estas limitaciones específicas.

## 11.6 Configuración de `tsconfig.json` Relevante para Vite

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

`"isolatedModules": true` es particularmente relevante: fuerza a que cada archivo pueda transpilarse de forma aislada sin depender de información de otros archivos — exactamente la restricción que esbuild necesita para funcionar correctamente, y TypeScript la valida por adelantado para detectar patrones incompatibles antes de que causen errores silenciosos en tiempo de ejecución.

## 11.7 Path Mapping en TypeScript (Repaso del Módulo 10.4)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Como se cubrió en el Módulo 10.4, este mapeo debe replicarse manualmente en `resolve.alias` de `vite.config.ts` — TypeScript y Vite mantienen configuraciones de resolución de módulos completamente independientes entre sí.

## 11.8 Verificación de Tipos Durante Desarrollo (Opcional)

```bash
npm install -D vite-plugin-checker
```

```ts
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [checker({ typescript: true })],
})
```

Para quien prefiera ver errores de tipos directamente en el overlay del navegador durante desarrollo (no solo en el editor), `vite-plugin-checker` ejecuta la verificación de tipos en un proceso separado en paralelo, mostrando los resultados sin bloquear la velocidad de HMR del servidor principal.

## 11.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Verificar tipos antes de generar el build de producción | `tsc --noEmit` en el script `build` |
| Ver errores de tipos en tiempo real mientras se escribe | El editor (servidor de lenguaje de TypeScript) |
| Ver errores de tipos también en el navegador durante `dev` | `vite-plugin-checker` |
| Sincronizar alias entre TypeScript y Vite | Configurar ambos, `tsconfig.json` y `vite.config.ts`, manualmente |

## 11.10 Errores Comunes

- **Asumir que `npm run dev` sin errores significa que el código está libre de errores de tipos**: Vite/esbuild nunca verifican tipos (11.1) — un proyecto puede "funcionar" en desarrollo con errores de tipos reales presentes, detectables solo por el editor o `tsc`.
- **Omitir `tsc --noEmit` del script `build`**: sin este paso, es posible desplegar a producción código con errores de tipos que nunca fueron detectados en ningún punto del flujo de CI/CD.
- **Usar características de TypeScript incompatibles con transpilación aislada** (como `const enum`) sin saber por qué fallan específicamente con Vite: revisar la lista de limitaciones conocidas de esbuild antes de asumir un bug de configuración.
