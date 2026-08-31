# Módulo 12: Stash: Guardar Cambios Temporalmente

`git stash` resuelve una situación cotidiana: tienes cambios sin confirmar, pero necesitas cambiar de rama, hacer un `pull`, o atender algo urgente sin perder ese trabajo ni confirmarlo a medio terminar. Este módulo cubre su uso completo.

## 12.1 El Problema que Resuelve

```bash
git switch main
# error: Your local changes to the following files would be overwritten by checkout
```

Git impide cambiar de rama cuando hay cambios sin confirmar que entrarían en conflicto con la rama destino — confirmar un commit a medio terminar solo para poder cambiar de rama ensucia el historial innecesariamente. `stash` guarda esos cambios en un espacio temporal separado, dejando el directorio de trabajo limpio.

## 12.2 Guardar y Recuperar Cambios

```bash
git stash              # Guarda TODOS los cambios (preparados y sin preparar), limpia el directorio
git stash pop            # Recupera el stash más reciente Y lo elimina de la lista de stashes
git stash apply           # Recupera el stash más reciente, pero lo MANTIENE en la lista
```

```text
Saved working directory and index state WIP on main: a1b2c3d Último commit
```

`pop` es el comando más usado en el día a día: aplica los cambios guardados y limpia el stash automáticamente, ya que en la mayoría de los casos no se necesita conservarlo tras recuperarlo.

## 12.3 Múltiples Stashes

```bash
git stash list
```

```text
stash@{0}: WIP on main: a1b2c3d Último commit
stash@{1}: WIP on feature/login: e5f6g7h Otro commit
```

```bash
git stash pop stash@{1}   # Recuperar un stash específico, no necesariamente el más reciente
git stash drop stash@{0}   # Eliminar un stash sin aplicarlo
git stash clear             # Eliminar TODOS los stashes
```

## 12.4 Guardar con un Mensaje Descriptivo

```bash
git stash push -m "Trabajo a medias en el formulario de checkout"
```

Con múltiples stashes acumulados, un mensaje descriptivo (en lugar del genérico "WIP on...") facilita identificar cuál corresponde a qué, especialmente si pasa tiempo antes de recuperarlo.

## 12.5 Stash de Archivos Específicos

```bash
git stash push archivo1.js archivo2.js -m "Solo estos dos archivos"
```

Por defecto, `stash` guarda **todos** los cambios del directorio de trabajo — especificar archivos permite guardar solo un subconjunto, dejando el resto de cambios sin guardar (y potencialmente listos para confirmarse por separado).

## 12.6 Incluir Archivos Sin Rastrear

```bash
git stash -u    # Incluye también archivos NUEVOS sin rastrear (por defecto, se ignoran)
git stash -a     # Incluye TODO, incluso archivos ignorados por .gitignore (Módulo 13)
```

Por defecto, `stash` **no** guarda archivos completamente nuevos que nunca fueron agregados con `git add` — un olvido común que hace parecer que el stash "perdió" un archivo nuevo, cuando en realidad nunca se incluyó.

## 12.7 Ver el Contenido de un Stash sin Aplicarlo

```bash
git stash show -p stash@{0}   # Muestra el diff completo del stash, sin recuperarlo aún
```

## 12.8 Crear una Rama Directamente desde un Stash

```bash
git stash branch nueva-rama stash@{0}
```

Útil cuando un stash entra en conflicto al intentar aplicarse sobre el estado actual de la rama (porque avanzó demasiado desde que se guardó) — crea una rama nueva desde el commit donde se hizo el stash originalmente, y aplica los cambios ahí, evitando el conflicto.

## 12.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Guardar cambios y limpiar el directorio temporalmente | `git stash` |
| Recuperar el stash más reciente y eliminarlo de la lista | `git stash pop` |
| Recuperar sin eliminar de la lista | `git stash apply` |
| Ver todos los stashes guardados | `git stash list` |
| Incluir archivos nuevos sin rastrear | `git stash -u` |
| Guardar con un mensaje identificable | `git stash push -m "mensaje"` |

## 12.10 Errores Comunes

- **Olvidar que `stash` no incluye archivos nuevos por defecto**: un archivo recién creado (nunca agregado con `git add`) permanece en el directorio tras el stash, pudiendo causar confusión o conflictos inesperados al cambiar de rama.
- **Acumular stashes sin mensajes descriptivos y perder el rastro de qué contiene cada uno**: usar siempre `git stash push -m "..."` en lugar de `git stash` a secas cuando se prevé mantener varios simultáneamente.
- **Usar `stash` como sustituto de commits reales por periodos largos**: un stash no forma parte del historial del proyecto ni se sincroniza con el remoto — es una herramienta de corto plazo, no un lugar para "guardar trabajo" indefinidamente.
