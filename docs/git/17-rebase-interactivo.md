# Módulo 17: Rebase Interactivo (squash, fixup, reorder, edit)

El rebase interactivo va más allá de reaplicar commits sobre otra rama — permite editar, combinar, reordenar y eliminar commits de tu propio historial reciente antes de compartirlo. Este módulo cubre su uso completo.

## 17.1 Iniciar un Rebase Interactivo

```bash
git rebase -i HEAD~4   # Edita los últimos 4 commits
```

```text
pick a1b2c3d Agregar formulario de login
pick e5f6g7h Corregir typo en el formulario
pick i9j0k1l WIP: estilos del botón
pick m3n4o5p Terminar estilos del botón

# Rebase a1b2c3d..m3n4o5p onto a1b2c3d (4 commands)
#
# Commands:
# p, pick <commit> = usar el commit
# r, reword <commit> = usar el commit, pero editar su mensaje
# e, edit <commit> = usar el commit, pero detenerse para modificarlo
# s, squash <commit> = combinar con el commit ANTERIOR, uniendo los mensajes
# f, fixup <commit> = como squash, pero DESCARTA el mensaje de este commit
# d, drop <commit> = eliminar el commit por completo
```

Git abre el editor configurado (Módulo 2.4) con la lista de commits en orden cronológico — editar esta lista y guardar determina exactamente qué operación aplicar a cada commit.

## 17.2 Combinar Commits: `squash` y `fixup`

```text
pick a1b2c3d Agregar formulario de login
fixup e5f6g7h Corregir typo en el formulario
squash i9j0k1l WIP: estilos del botón
pick m3n4o5p Terminar estilos del botón
```

`fixup` combina el commit con el anterior en la lista, **descartando** su mensaje por completo — ideal para correcciones menores ("corregir typo") que no merecen su propia línea en el historial. `squash` hace lo mismo, pero **conserva** el mensaje, abriendo el editor para combinar ambos mensajes en uno solo — útil cuando ambos commits aportan contexto que vale la pena preservar.

## 17.3 Reordenar Commits

```text
pick m3n4o5p Terminar estilos del botón
pick a1b2c3d Agregar formulario de login
pick e5f6g7h Corregir typo en el formulario
```

Simplemente cambiar el orden de las líneas reordena los commits — Git los reaplica en el nuevo orden especificado. Debe hacerse con cuidado: si un commit posterior depende del contenido de uno que se movió después, el reordenamiento puede introducir conflictos.

## 17.4 Editar el Contenido de un Commit Específico: `edit`

```text
pick a1b2c3d Agregar formulario de login
edit e5f6g7h Corregir typo en el formulario
pick i9j0k1l WIP: estilos del botón
```

```bash
# El rebase se detiene justo después de aplicar "e5f6g7h"
# Modificar archivos, o agregar cambios adicionales:
git add archivo-corregido.js
git commit --amend --no-edit    # Modifica el commit detenido, sin cambiar su mensaje
git rebase --continue             # Reanuda el resto del proceso
```

`edit` pausa el rebase justo después de aplicar ese commit específico, dando la oportunidad de modificarlo (agregar cambios olvidados, dividirlo en varios commits) antes de continuar con el resto.

## 17.5 Eliminar un Commit por Completo: `drop`

```text
pick a1b2c3d Agregar formulario de login
drop e5f6g7h Commit experimental que ya no se necesita
pick i9j0k1l WIP: estilos del botón
```

Equivalente a simplemente borrar la línea del commit en el editor — ambas formas eliminan ese commit del historial reescrito.

## 17.6 Reescribir un Mensaje de Commit Pasado: `reword`

```text
pick a1b2c3d Agregar formulario de login
reword e5f6g7h corregir tyop  ← mensaje con error
pick i9j0k1l WIP: estilos del botón
```

Abre el editor solo para ese commit específico, permitiendo corregir su mensaje sin tocar ningún otro commit de la lista ni su contenido.

## 17.7 `--autosquash`: Automatizar Fixups

```bash
git commit --fixup a1b2c3d   # Crea un commit marcado explícitamente como "fixup" del commit a1b2c3d
git rebase -i --autosquash HEAD~5
```

Con `--fixup`, Git etiqueta el commit con el prefijo `fixup!` automáticamente — al iniciar un rebase interactivo con `--autosquash`, esos commits ya aparecen preordenados junto a su commit objetivo con la acción `fixup` preseleccionada, eliminando la necesidad de reordenar y marcar manualmente en el editor.

## 17.8 La Misma Regla de Oro que en el Módulo 16

Al igual que cualquier rebase, un rebase interactivo genera commits nuevos con hashes distintos — **nunca** debe aplicarse sobre commits que ya fueron compartidos con otras personas (subidos al remoto y potencialmente ya descargados por alguien más).

## 17.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Editar los últimos N commits | `git rebase -i HEAD~N` |
| Combinar un commit con el anterior, conservando ambos mensajes | `squash` |
| Combinar un commit con el anterior, descartando su mensaje | `fixup` |
| Detenerse a modificar un commit específico | `edit` |
| Eliminar un commit por completo | `drop` |
| Corregir solo el mensaje de un commit | `reword` |
| Automatizar la aplicación de correcciones marcadas | `git commit --fixup` + `rebase -i --autosquash` |

## 17.10 Errores Comunes

- **Aplicar un rebase interactivo sobre commits ya compartidos con el equipo**: la misma regla de oro del Módulo 16.4 — genera divergencias de historial que complican el trabajo de cualquiera que ya tuviera los commits originales.
- **Reordenar commits sin considerar sus dependencias**: mover un commit antes de otro del que depende su contenido puede introducir conflictos o incluso código roto en un estado intermedio del historial reescrito.
- **Usar `pick` cuando se quería `squash`/`fixup` por error tipográfico en el editor**: revisar cuidadosamente la lista completa antes de guardar y cerrar el editor, ya que un error aquí modifica el historial de forma no trivial de deshacer sin `reflog` (Módulo 19).
