# Módulo 6: Fusionar Ramas (Merge)

Con dos ramas divergentes, `merge` es la forma más directa de combinar su trabajo de vuelta en una sola línea de historia. Este módulo cubre los dos tipos de merge y cuándo ocurre cada uno.

## 6.1 El Flujo Básico de un Merge

```bash
git switch main              # Debes estar EN la rama que RECIBE los cambios
git merge feature/login        # Fusiona feature/login DENTRO de main
```

## 6.2 Fast-Forward Merge

```text
Antes:   main: A---B
                     \
         feature:     C---D

Después: main: A---B---C---D  (main simplemente "avanza" hasta D)
```

```bash
git merge feature/login
# Updating a1b2c3d..e5f6g7h
# Fast-forward
```

Un *fast-forward* ocurre cuando la rama destino (`main`) no tuvo **ningún** commit nuevo desde que se creó la rama que se está fusionando — Git simplemente mueve el puntero de `main` hacia adelante, sin crear ningún commit de merge nuevo, porque no hay nada que combinar realmente.

## 6.3 Three-Way Merge (con Commit de Merge)

```text
main:      A---B-------F  (commit de merge)
                \     /
feature:         C---D
```

```bash
git merge feature/login
# Merge made by the 'recursive' strategy.
```

Cuando **ambas** ramas tienen commits nuevos desde que divergieron, Git no puede simplemente mover un puntero — crea un **commit de merge** especial con dos padres (`B` y `D`), que combina el trabajo de ambas líneas de historia. Este tipo de merge preserva el hecho de que hubo desarrollo paralelo, visible en `git log --graph`.

## 6.4 Merge sin Fast-Forward, Forzado

```bash
git merge --no-ff feature/login
```

Incluso cuando un fast-forward sería posible, `--no-ff` fuerza la creación de un commit de merge explícito — preserva en el historial el hecho de que "esto fue una funcionalidad desarrollada en su propia rama", información que un fast-forward silencioso perdería. Muchos equipos configuran esto como comportamiento por defecto en sus flujos de trabajo (Módulo 22).

## 6.5 Conflictos de Merge (Anticipo del Módulo 15)

```bash
git merge feature/login
# Auto-merging index.html
# CONFLICT (content): Merge conflict in index.html
# Automatic merge failed; fix conflicts and then commit the result.
```

Un conflicto ocurre cuando ambas ramas modificaron las **mismas líneas** de un archivo de forma distinta — Git no puede decidir automáticamente cuál versión es correcta, y requiere resolución manual, cubierta a fondo en el Módulo 15.

## 6.6 Abortar un Merge en Progreso

```bash
git merge --abort
```

Si un merge con conflictos resulta demasiado complicado o se inició por error, `--abort` revierte el repositorio exactamente al estado anterior al intento de merge — la salida segura mientras el conflicto aún no se ha resuelto ni confirmado.

## 6.7 Merge vs Rebase: una Primera Comparación

| | Merge | Rebase (Módulo 16) |
| :--- | :--- | :--- |
| Historial resultante | Preserva la forma real en que ocurrió el trabajo, incluidos commits de merge | Reescribe el historial como si el trabajo hubiera ocurrido de forma lineal |
| Seguridad | Nunca modifica commits existentes | Reescribe commits, requiere cuidado en ramas compartidas |
| Cuándo usarlo | Al integrar una rama de funcionalidad terminada a `main` | Al mantener una rama de funcionalidad actualizada con los últimos cambios de `main` |

Este módulo cubre solo merge — la comparación completa, con ejemplos de cuándo preferir cada uno, se retoma en el Módulo 16 una vez cubierto rebase en detalle.

## 6.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Fusionar una rama dentro de la actual | `git merge nombre-rama` |
| Forzar un commit de merge incluso si es posible fast-forward | `git merge --no-ff nombre-rama` |
| Cancelar un merge con conflictos sin resolverlos | `git merge --abort` |
| Ver el historial con la estructura de merges visible | `git log --oneline --graph --all` |

## 6.9 Errores Comunes

- **No estar en la rama correcta antes de hacer merge**: `git merge X` fusiona `X` **dentro de** la rama actual, no al revés — un error común es ejecutarlo desde la rama equivocada, fusionando en la dirección opuesta a la deseada.
- **Entrar en pánico ante un conflicto de merge**: es una situación normal y esperable en proyectos colaborativos, no un error — el Módulo 15 cubre exactamente cómo resolverlo con calma.
- **Eliminar la rama de funcionalidad antes de confirmar que el merge se completó correctamente**: verificar con `git log --graph` o probando el resultado antes de hacer limpieza de ramas (Módulo 5.5).
