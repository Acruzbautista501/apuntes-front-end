# Módulo 22: Estrategias de Branching (Git Flow, GitHub Flow, Trunk-Based)

Con los comandos de Git ya dominados, este módulo cubre cómo los equipos organizan sus ramas de forma coherente — las convenciones sobre cuándo crear una rama, cómo nombrarla, y cuándo/cómo fusionarla de vuelta.

## 22.1 Por Qué Importa una Estrategia Explícita

Sin una convención acordada, cada persona del equipo puede terminar organizando ramas de forma distinta — dificultando saber qué rama es segura para desplegar, cuál representa trabajo en progreso, y cuál está lista para producción. Una estrategia de branching es un acuerdo de equipo, no una funcionalidad de Git en sí misma.

## 22.2 Git Flow

```text
main         ●───────────────●───────── (solo releases estables)
              \             /
release        \    ●──●──●          (preparación de una versión)
                 \  /
develop    ●──●──●──●──●──●──●──●──●  (integración continua de funcionalidades)
            \    \        /    /
feature      ●────●      ●────●        (funcionalidades individuales)
```

| Rama | Propósito |
| :--- | :--- |
| `main` | Solo código en producción, cada commit representa una versión publicada |
| `develop` | Rama de integración, donde convergen las funcionalidades completas |
| `feature/*` | Una rama por funcionalidad, creada desde `develop` |
| `release/*` | Preparación final de una versión (ajustes menores, no funcionalidad nueva) |
| `hotfix/*` | Correcciones urgentes directamente sobre `main`, sin pasar por `develop` |

Git Flow es un modelo formal y estructurado, popularizado hace más de una década — funciona bien para software con ciclos de release programados (versiones de escritorio, aplicaciones móviles con revisión de tienda), pero su complejidad resulta excesiva para servicios web con despliegue continuo.

## 22.3 GitHub Flow: Simplicidad para Despliegue Continuo

```text
main    ●───●───●───●───●───●───●   (siempre desplegable)
             \         /
feature       ●───●───●              (una rama por cambio, vive poco tiempo)
```

```text
1. Crear una rama desde main
2. Hacer commits
3. Abrir un Pull Request temprano
4. Discutir y revisar
5. Desplegar la rama a un entorno de prueba (opcional)
6. Fusionar a main
7. main se despliega automáticamente
```

Solo una rama de larga duración (`main`), siempre en estado desplegable — cada funcionalidad vive en su propia rama de corta duración hasta fusionarse. Es el modelo dominante en proyectos con despliegue continuo (CI/CD, Módulo 25 del curso de Node.js), donde cada merge a `main` puede desplegarse a producción de inmediato.

## 22.4 Trunk-Based Development

```text
main    ●●●●●●●●●●●●●●●●●●●●●●●●●●●   (commits directos o ramas de VIDA MUY corta, <1 día)
```

Un paso más allá de GitHub Flow: commits directos a `main` (o ramas que viven horas, no días), combinados con **feature flags** para ocultar funcionalidad incompleta en producción sin necesitar una rama separada de larga duración. Requiere una suite de tests muy sólida y disciplina de equipo alta — es el modelo usado por organizaciones con despliegues muy frecuentes (múltiples veces al día).

## 22.5 Comparación

| | Git Flow | GitHub Flow | Trunk-Based |
| :--- | :--- | :--- | :--- |
| Complejidad | Alta | Baja | Baja, pero exige disciplina técnica |
| Ideal para | Releases programados, versiones con soporte paralelo | Despliegue continuo web | Despliegue muy frecuente, equipos maduros con feature flags |
| Ramas de larga duración | `main`, `develop` | Solo `main` | Solo `main` |

## 22.6 Elegir una Estrategia para un Proyecto Nuevo

Para la mayoría de proyectos web nuevos, **GitHub Flow** es el punto de partida recomendado: suficientemente simple para adoptarse sin fricción, compatible con CI/CD, y sin la sobrecarga de mantener ramas de larga duración como `develop`. Git Flow tiene sentido cuando el proyecto realmente necesita mantener varias versiones en paralelo (ej. soporte de versiones anteriores de una app móvil); Trunk-Based tiene sentido cuando el equipo ya tiene la madurez técnica (tests, feature flags) para sostenerlo.

## 22.7 Convenciones de Nombres Consistentes

```text
feature/nombre-descriptivo
fix/nombre-del-bug
hotfix/descripcion-urgente
release/v2.1.0
chore/actualizar-dependencias
```

Independientemente de la estrategia elegida, un prefijo consistente comunica de inmediato el propósito de una rama — se retoma junto con Conventional Commits (que sigue una filosofía similar de prefijos estructurados) en el Módulo 23.

## 22.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Mantener varias versiones en paralelo con releases programados | Git Flow |
| Despliegue continuo simple, sin complejidad innecesaria | GitHub Flow |
| Despliegues muy frecuentes con equipo técnicamente maduro | Trunk-Based Development |
| Comunicar el propósito de una rama solo con su nombre | Prefijos consistentes (`feature/`, `fix/`, `hotfix/`) |

## 22.9 Errores Comunes

- **Adoptar Git Flow "porque es el más conocido" sin necesitar su complejidad**: para un proyecto con despliegue continuo simple, mantener `develop` como rama adicional suele ser sobrecarga innecesaria sin beneficio real.
- **No tener ninguna convención de branching explícita en absoluto**: lleva a un desorden de nombres de ramas inconsistentes y ambigüedad sobre qué rama es segura para desplegar.
- **Dejar ramas de funcionalidad vivas durante semanas sin integrarlas**: contradice el espíritu de cualquiera de estos modelos — cuanto más tiempo vive una rama sin fusionarse, mayor la probabilidad de conflictos significativos al hacerlo.
