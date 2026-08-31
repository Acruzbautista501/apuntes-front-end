# Módulo 11: Deshacer Cambios: checkout, restore, reset y revert

Deshacer cambios es una de las tareas donde Git ofrece más comandos con comportamientos sutilmente distintos — este módulo aclara exactamente cuándo usar cada uno, y por qué la elección incorrecta puede perder trabajo.

## 11.1 Descartar Cambios No Preparados: `git restore`

```bash
git restore archivo.js          # Descarta cambios NO preparados en un archivo, volviendo a la última versión confirmada
git restore .                     # Descarta cambios no preparados en TODOS los archivos
```

`git restore` (Git 2.23+) es el comando moderno y recomendado para esta operación — antes se usaba `git checkout -- archivo.js`, que sigue funcionando pero es más ambiguo (el mismo comando `checkout` también cambia de rama, Módulo 5.3).

## 11.2 Quitar Archivos del Área de Preparación

```bash
git restore --staged archivo.js   # Mueve el archivo de "preparado" de vuelta a "modificado", SIN descartar el cambio
```

Distinción clave: `git restore` (sin `--staged`) **descarta** el contenido del cambio; `git restore --staged` solo lo **despreparar**, dejando el contenido modificado intacto en el directorio de trabajo — dos operaciones muy distintas que comparten el mismo comando base.

## 11.3 `git reset`: Mover `HEAD` (y Opcionalmente Más)

```bash
git reset --soft HEAD~1    # Deshace el último commit, PERO mantiene los cambios preparados
git reset --mixed HEAD~1    # (por defecto) Deshace el commit Y lo despreparar, manteniendo los cambios en el directorio
git reset --hard HEAD~1     # Deshace el commit Y descarta los cambios por completo — PELIGROSO
```

```text
--soft:   Commit deshecho → cambios quedan en "staged"
--mixed:  Commit deshecho → cambios quedan en "modificado" (sin preparar)
--hard:   Commit deshecho → cambios ELIMINADOS por completo
```

`--hard` es el único de los tres que **pierde datos** de forma directa (aunque el commit sigue siendo recuperable temporalmente vía `reflog`, Módulo 19) — los otros dos solo mueven dónde "viven" los cambios, sin descartar ningún contenido.

## 11.4 `reset` sobre un Rango de Commits

```bash
git reset --soft HEAD~3   # Deshace los últimos 3 commits, combinando sus cambios en el área de preparación
git commit -m "Combinar tres commits en uno solo"
```

Esta es una forma simple de combinar varios commits recientes en uno solo, alternativa más directa que un rebase interactivo (Módulo 17) cuando solo se necesita aplanar los commits más recientes de la rama actual, aún no compartidos con nadie más.

## 11.5 `git revert`: Deshacer sin Reescribir Historial

```bash
git revert a1b2c3d
```

```text
main:  A---B---C---D  (D es un nuevo commit que "invierte" los cambios de C)
```

A diferencia de `reset`, `revert` **no elimina ni modifica** ningún commit existente — crea un commit **nuevo** que aplica el cambio inverso al commit especificado. Es la única forma segura de deshacer un cambio en una rama **ya compartida** con otras personas (como `main`), porque no reescribe historial que otros ya puedan tener descargado.

## 11.6 Reset vs Revert: Cuándo Usar Cada Uno

| | `reset` | `revert` |
| :--- | :--- | :--- |
| Reescribe el historial existente | Sí | No, agrega un commit nuevo |
| Seguro en ramas compartidas | No | Sí |
| Uso típico | Deshacer commits recientes en una rama **propia**, aún no compartida | Deshacer un cambio ya presente en una rama **compartida** (ej. `main`) |

## 11.7 Descartar Archivos Sin Rastrear

```bash
git clean -n    # Simula: muestra qué archivos SIN RASTREAR se eliminarían (sin eliminar nada aún)
git clean -f     # Elimina realmente los archivos sin rastrear listados
git clean -fd     # Incluye también carpetas sin rastrear
```

`git clean` afecta únicamente a archivos que **nunca** han sido agregados con `git add` — no revierte cambios en archivos ya rastreados (eso corresponde a `restore`/`reset`). Siempre ejecutar `-n` primero para revisar qué se eliminaría antes de confirmar con `-f`.

## 11.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Descartar cambios no preparados en un archivo | `git restore archivo` |
| Despreparar un archivo sin perder el cambio | `git restore --staged archivo` |
| Deshacer el último commit, conservando los cambios | `git reset --soft HEAD~1` |
| Deshacer el último commit y descartar todo | `git reset --hard HEAD~1` (¡peligroso!) |
| Deshacer un commit ya compartido con el equipo | `git revert <hash>` |
| Eliminar archivos sin rastrear del directorio | `git clean -n` (revisar) luego `git clean -f` |

## 11.9 Errores Comunes

- **Usar `git reset --hard` sin haber revisado antes qué se va a perder**: es la forma más directa de perder trabajo de forma permanente (aunque recuperable vía `reflog` por un tiempo limitado, Módulo 19) — siempre verificar con `git status`/`git diff` antes.
- **Usar `reset` en lugar de `revert` sobre una rama ya compartida**: reescribe el historial que otras personas ya descargaron, causando divergencias confusas y potencialmente forzando a todo el equipo a resincronizar manualmente.
- **Confundir `git restore` con `git restore --staged`**: son operaciones distintas sobre el mismo comando — el primero descarta el cambio, el segundo solo lo despreparar sin perder nada.
