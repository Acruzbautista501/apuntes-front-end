# Módulo 27: Rendimiento en Repositorios Grandes (shallow clone, sparse-checkout, gc, LFS)

Un repositorio con años de historia, miles de commits, o archivos binarios pesados presenta problemas de rendimiento específicos. Este módulo cubre las herramientas de Git diseñadas para escalar en esos escenarios.

## 27.1 Shallow Clone: Clonar sin Todo el Historial

```bash
git clone --depth 1 https://github.com/usuario/proyecto-enorme.git
```

Un clon superficial (*shallow*) descarga únicamente el commit más reciente de cada rama, sin el historial completo — reduce drásticamente el tiempo y espacio de un clone en repositorios con años de commits, a costa de no tener acceso al historial completo localmente (operaciones como `git log` más allá de ese punto, o `git blame` extendido, no funcionan sin descargar más profundidad).

```bash
git fetch --unshallow   # Convertir un clon superficial en uno completo, si se necesita después
git fetch --depth 50     # Profundizar un poco más, sin llegar al historial completo
```

Común en pipelines de CI/CD (Módulo 25 del curso de Node.js), donde solo se necesita el código actual para correr tests o hacer un build, sin ninguna necesidad del historial.

## 27.2 Sparse-Checkout: Descargar Solo Parte del Árbol de Archivos

```bash
git clone --filter=blob:none --sparse https://github.com/usuario/monorepo-enorme.git
cd monorepo-enorme
git sparse-checkout set apps/mi-equipo/ libs/compartidas/
```

En un monorepo con decenas de proyectos, la mayoría de los equipos solo necesitan trabajar con una porción específica del árbol de archivos — `sparse-checkout` descarga y materializa en el disco **solo** las carpetas especificadas, mientras `--filter=blob:none` evita descargar el contenido de archivos fuera de esas carpetas hasta que realmente se necesiten.

## 27.3 `git gc`: Compactación y Limpieza

```bash
git gc                # Limpieza estándar: compacta objetos sueltos en "packfiles"
git gc --aggressive    # Compactación más agresiva y lenta, para reducir el tamaño al máximo
git count-objects -v    # Ver cuántos objetos sueltos existen antes/después
```

Git ejecuta `gc` automáticamente de forma periódica en segundo plano, pero puede invocarse manualmente — combina múltiples objetos sueltos en archivos comprimidos (*packfiles*) de forma mucho más eficiente en espacio, y elimina objetos verdaderamente inalcanzables tras el período de expiración del reflog (Módulo 19.5).

## 27.4 Git LFS: Archivos Binarios Grandes

```bash
git lfs install
git lfs track "*.psd"
git lfs track "*.mp4"
git add .gitattributes   # El archivo que registra qué patrones gestiona LFS
```

Git fue diseñado para código fuente de texto, donde el modelo de diffs y compresión funciona muy bien — archivos binarios grandes (diseños de Photoshop, videos, datasets) no se benefician de ese modelo y **inflan** el repositorio permanentemente, incluso si se eliminan después (siguen en el historial). Git LFS (*Large File Storage*) reemplaza esos archivos con punteros de texto ligeros en el repositorio Git real, almacenando el contenido pesado en un servidor separado, descargado solo bajo demanda.

```bash
git lfs ls-files    # Ver qué archivos están gestionados por LFS
```

## 27.5 `git maintenance`: Mantenimiento Automatizado

```bash
git maintenance start   # Programa tareas de mantenimiento (gc, prefetch) automáticamente en segundo plano
```

Una alternativa moderna a ejecutar `git gc` manualmente de vez en cuando: `git maintenance` configura tareas periódicas (compactación, prefetch de remotos) que se ejecutan automáticamente sin intervención, manteniendo el repositorio en buen estado de forma continua.

## 27.6 Identificar Qué Hace Pesado un Repositorio

```bash
git count-objects -vH                                   # Tamaño total en formato legible
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sort -k3 -n -r | head -20                               # Los 20 objetos más pesados del historial completo
```

Este análisis identifica qué archivos específicos (a menudo binarios agregados por error años atrás y nunca gestionados con LFS) son responsables de la mayor parte del tamaño del repositorio — el primer paso antes de decidir si vale la pena una limpieza de historial (Módulo 13.7).

## 27.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Clonar rápido sin necesitar el historial completo | `git clone --depth 1` |
| Trabajar solo con parte de un monorepo | `git sparse-checkout set <carpetas>` |
| Compactar y limpiar el repositorio | `git gc` |
| Gestionar archivos binarios grandes correctamente | Git LFS |
| Automatizar el mantenimiento periódico | `git maintenance start` |
| Encontrar qué infla el tamaño del repositorio | `git rev-list --objects --all` + `cat-file --batch-check` |

## 27.8 Errores Comunes

- **Agregar archivos binarios grandes sin Git LFS "porque funciona igual"**: técnicamente funciona, pero infla el repositorio permanentemente (incluso tras eliminarlos después, siguen en el historial), degradando el rendimiento de clone/fetch para todo el equipo indefinidamente.
- **Usar `--depth 1` en un contexto donde luego se necesita el historial completo** (por ejemplo, antes de un `git bisect`, Módulo 20): produce errores o resultados incompletos hasta ejecutar `git fetch --unshallow`.
- **No investigar la causa raíz de un repositorio inusualmente pesado**: aplicar `gc --aggressive` repetidamente sin identificar (27.6) qué objetos específicos ocupan más espacio rara vez resuelve un problema causado por binarios mal gestionados desde el origen.
