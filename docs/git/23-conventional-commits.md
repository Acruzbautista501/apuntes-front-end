# Módulo 23: Conventional Commits y Buenas Prácticas de Mensajes

Un mensaje de commit bien escrito comunica intención a otras personas (y a tu propio yo futuro) — Conventional Commits estandariza ese formato lo suficiente como para que herramientas automatizadas también puedan interpretarlo. Este módulo cubre la convención completa.

## 23.1 El Formato

```text
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[pie opcional]
```

```text
feat(carrito): agregar persistencia con localStorage

El carrito se perdía al recargar la página. Ahora se guarda
automáticamente en localStorage y se restaura al cargar.

Closes #42
```

## 23.2 Tipos Estándar

| Tipo | Cuándo usarlo |
| :--- | :--- |
| `feat` | Una funcionalidad nueva |
| `fix` | Una corrección de bug |
| `docs` | Cambios solo en documentación |
| `style` | Formato de código (espacios, punto y coma), sin cambio de lógica |
| `refactor` | Reestructurar código sin cambiar su comportamiento externo |
| `perf` | Una mejora de rendimiento |
| `test` | Agregar o corregir tests |
| `chore` | Tareas de mantenimiento (dependencias, configuración) sin afectar código de producción |
| `ci` | Cambios en la configuración de integración continua |

## 23.3 Ámbito (Scope): Contexto Adicional

```text
feat(auth): agregar inicio de sesión con Google
fix(carrito): corregir cálculo de descuentos acumulados
docs(readme): actualizar instrucciones de instalación
```

El ámbito, entre paréntesis, especifica **qué parte** del proyecto afecta el cambio — opcional, pero especialmente útil en proyectos grandes con múltiples módulos, facilitando filtrar el historial por área (`git log --grep="^feat(auth)"`).

## 23.4 Cambios que Rompen Compatibilidad (Breaking Changes)

```text
feat(api)!: cambiar el formato de respuesta de /usuarios

BREAKING CHANGE: el campo "nombre" ahora se divide en
"nombreCompleto" y "apellido" por separado.
```

El símbolo `!` inmediatamente después del tipo/ámbito, o una línea `BREAKING CHANGE:` en el pie del mensaje, marca explícitamente un cambio que rompe compatibilidad hacia atrás — información crítica para herramientas de versionado automático (23.6) y para cualquiera que consuma ese código como dependencia.

## 23.5 Por Qué Esta Convención (No Solo Estilo)

Conventional Commits no es solo una preferencia estética — habilita **automatización real**:

- Generar un `CHANGELOG.md` automáticamente a partir del historial de commits, agrupado por tipo.
- Determinar automáticamente el siguiente número de versión semántica (Módulo 14.7): un `fix` incrementa PATCH, un `feat` incrementa MINOR, un `BREAKING CHANGE` incrementa MAJOR.
- Filtrar el historial de forma significativa (`git log --grep="^feat"` muestra solo funcionalidades nuevas).

## 23.6 Herramientas que Consumen esta Convención

```bash
npx semantic-release   # Determina automáticamente la versión siguiente y publica, basado en los mensajes de commit
npx conventional-changelog -p angular -i CHANGELOG.md -s   # Genera/actualiza el changelog automáticamente
```

Estas herramientas leen el historial de commits siguiendo la convención y automatizan tareas que, de otra forma, requerirían decisión manual humana en cada release — la razón principal por la que muchos equipos y proyectos de código abierto la adoptan formalmente.

## 23.7 Forzar la Convención con un Hook (Anticipo del Módulo 24)

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

`commitlint`, ejecutado a través de un git hook `commit-msg`, rechaza automáticamente cualquier commit cuyo mensaje no siga el formato esperado — asegura que la convención se cumpla de forma consistente en todo el equipo, sin depender únicamente de la disciplina individual.

## 23.8 Más Allá de Conventional Commits: Buenas Prácticas Generales

- **Modo imperativo, no descriptivo**: "Agregar validación", no "Agregando validación" ni "Agregué validación" — como si el commit fuera una instrucción que se está ejecutando.
- **Un commit, un propósito lógico**: evitar mezclar una corrección de bug con una refactorización no relacionada en el mismo commit.
- **El cuerpo explica el *por qué*, no el *qué***: el diff ya muestra exactamente qué cambió; el mensaje debe aportar contexto que el código por sí solo no comunica.

## 23.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Una funcionalidad nueva | `feat: descripción` |
| Una corrección de bug | `fix: descripción` |
| Especificar qué parte del proyecto afecta | `tipo(ámbito): descripción` |
| Marcar un cambio que rompe compatibilidad | `tipo!: descripción` + `BREAKING CHANGE:` en el pie |
| Generar un changelog automáticamente | `conventional-changelog` |
| Determinar versiones automáticamente | `semantic-release` |

## 23.10 Errores Comunes

- **Usar el tipo `fix` para cambios que en realidad son `feat` (o viceversa)**: distorsiona el versionado automático (23.5) — un `fix` incrementa solo PATCH, mientras que un `feat` incrementa MINOR, con implicaciones reales sobre qué comunica el número de versión.
- **Olvidar marcar un `BREAKING CHANGE` explícitamente**: puede provocar que consumidores de una API o biblioteca actualicen sin darse cuenta de que algo se rompió, al no reflejarse correctamente en el versionado semántico.
- **Adoptar la convención solo parcialmente, sin un hook que la haga cumplir**: sin `commitlint` u otra herramienta similar, la consistencia depende enteramente de la disciplina manual de cada persona del equipo, con probabilidad alta de erosionar con el tiempo.
