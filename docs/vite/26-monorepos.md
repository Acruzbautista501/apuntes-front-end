# Módulo 26: Vite en Monorepos (Workspaces, pnpm/Turborepo)

Un monorepo aloja múltiples proyectos relacionados (varias aplicaciones, librerías compartidas) dentro de un único repositorio Git. Este módulo cubre cómo Vite se comporta e integra en ese contexto, con particularidades específicas frente a un proyecto único.

## 26.1 La Estructura Típica de un Monorepo

```text
mi-monorepo/
├── apps/
│   ├── web/              (proyecto Vite: aplicación principal)
│   └── admin/              (otro proyecto Vite: panel de administración)
├── packages/
│   ├── ui/                  (librería de componentes compartida, Módulo 20)
│   └── utils/                 (funciones compartidas)
├── package.json               (raíz, con "workspaces")
└── pnpm-workspace.yaml          (si se usa pnpm)
```

## 26.2 Workspaces: Vincular Paquetes del Mismo Monorepo

```json
// package.json raíz
{
  "workspaces": ["apps/*", "packages/*"]
}
```

```yaml
# pnpm-workspace.yaml (equivalente con pnpm)
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// apps/web/package.json
{
  "dependencies": {
    "@mi-monorepo/ui": "workspace:*"
  }
}
```

Los *workspaces* permiten que un proyecto dentro del monorepo (`apps/web`) dependa de otro (`packages/ui`) como si fuera un paquete de NPM normal, pero enlazado directamente vía symlinks en lugar de instalarlo desde un registro remoto — cualquier cambio en `packages/ui` se refleja inmediatamente en `apps/web` sin necesitar publicar ni reinstalar nada.

## 26.3 El Problema: Pre-Bundling y Paquetes del Workspace

```ts
// vite.config.ts en apps/web
export default defineConfig({
  optimizeDeps: {
    exclude: ['@mi-monorepo/ui'], // Evitar que se pre-empaquete como si fuera una dependencia externa
  },
})
```

Como se explicó en el Módulo 17.3, un paquete local enlazado (que cambia con frecuencia durante desarrollo activo) debe excluirse del pre-bundling — de otra forma, Vite podría servir una versión cacheada desactualizada de `packages/ui` en lugar de reflejar cambios recientes hechos en ese paquete durante la misma sesión de desarrollo.

## 26.4 pnpm: la Elección Popular para Monorepos con Vite

```text
node_modules/ con pnpm: estructura estricta con symlinks, evita "dependencias fantasma"
node_modules/ con npm/yarn clásico: estructura plana, más propensa a resolución ambigua
```

`pnpm` es particularmente popular en monorepos Vite por dos razones: eficiencia de espacio en disco (los paquetes se almacenan una sola vez globalmente, enlazados por proyecto) y una resolución de dependencias más estricta que previene que un paquete acceda accidentalmente a una dependencia que nunca declaró explícitamente (el problema de "dependencias fantasma").

## 26.5 Configuración Compartida entre Proyectos del Monorepo

```ts
// packages/vite-config-compartida/index.ts
import { defineConfig, mergeConfig, type UserConfig } from 'vite'

export function crearConfigBase(overrides: UserConfig = {}) {
  return mergeConfig(
    defineConfig({
      resolve: { alias: { '@': '/src' } },
    }),
    overrides,
  )
}
```

```ts
// apps/web/vite.config.ts
import { crearConfigBase } from '@mi-monorepo/vite-config-compartida'

export default crearConfigBase({
  plugins: [vue()],
})
```

`mergeConfig` (una utilidad exportada por Vite) combina profundamente dos configuraciones — útil para extraer configuración común (alias compartidos, opciones de build estándar del equipo) a un paquete reutilizable dentro del propio monorepo, evitando duplicarla manualmente en cada `vite.config.ts` individual.

## 26.6 Turborepo: Orquestar Builds entre Proyectos

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

```bash
npx turbo run build   # Construye TODOS los proyectos del monorepo, en el orden correcto de dependencias, con caché
```

Turborepo no reemplaza a Vite — orquesta **cuándo y en qué orden** ejecutar los comandos de Vite (`build`, `dev`) a través de múltiples proyectos del monorepo, con caché inteligente que evita reconstruir un paquete cuyo código no cambió desde el último build exitoso.

## 26.7 Ejecutar Múltiples Proyectos Vite en Paralelo

```json
{
  "scripts": {
    "dev": "turbo run dev --parallel"
  }
}
```

Durante desarrollo, es común necesitar que varios proyectos del monorepo corran simultáneamente (la app principal y el panel de administración, por ejemplo, cada uno en su propio puerto) — herramientas como Turborepo o `concurrently` gestionan la ejecución paralela de los distintos servidores de desarrollo de Vite.

## 26.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Vincular paquetes internos del monorepo entre sí | Workspaces (`workspace:*` con pnpm/npm/yarn) |
| Evitar servir una versión cacheada desactualizada de un paquete interno | `optimizeDeps.exclude` sobre ese paquete |
| Compartir configuración de Vite entre varios proyectos | `mergeConfig` con una configuración base exportada |
| Orquestar builds en el orden correcto de dependencias, con caché | Turborepo (u otra herramienta equivalente) |

## 26.9 Errores Comunes

- **No excluir paquetes del workspace del pre-bundling**: produce la misma experiencia frustrante del Módulo 17.10 (cambios en un paquete local que no se reflejan), ahora en el contexto específico de un monorepo.
- **Duplicar configuración de Vite manualmente en cada proyecto del monorepo**: dificulta mantener consistencia — extraer una configuración base compartida (26.5) reduce significativamente esa carga de mantenimiento.
- **Mezclar gestores de paquetes distintos dentro del mismo monorepo** (algunos proyectos con npm, otros con pnpm): puede producir resoluciones de dependencias inconsistentes entre proyectos — un monorepo debe estandarizar un único gestor de paquetes para todo el repositorio.
