# Módulo 18: Cherry-pick

`git cherry-pick` aplica un commit **específico** de otra rama sobre la rama actual, sin fusionar el resto de esa rama — útil cuando se necesita exactamente un cambio puntual, no todo el trabajo acumulado en otra línea de desarrollo.

## 18.1 El Caso de Uso Típico

```text
main:      A---B---C
                     \
hotfix:               D---E---F
                       │
                  (solo D corrige el bug urgente,
                   E y F son otra funcionalidad no relacionada)
```

```bash
git switch main
git cherry-pick D
```

```text
main: A---B---C---D'  (una copia de D, aplicada sobre C)
```

Un escenario común: una rama de funcionalidad en progreso contiene, entre sus commits, uno que corrige un bug crítico que también afecta a producción (`main`) — cherry-pick permite llevar **solo ese commit específico** a `main` de inmediato, sin esperar a que el resto de la funcionalidad esté terminada.

## 18.2 El Comando Básico

```bash
git cherry-pick a1b2c3d
```

Al igual que rebase (Módulo 16.3), cherry-pick crea un commit **nuevo** con el mismo contenido pero un hash distinto — el commit original permanece sin cambios en su rama de origen.

## 18.3 Cherry-pick de Múltiples Commits

```bash
git cherry-pick a1b2c3d e5f6g7h    # Varios commits específicos, no necesariamente consecutivos
git cherry-pick a1b2c3d^..e5f6g7h    # Un RANGO de commits (nótese el "^" antes del primero, para incluirlo)
```

## 18.4 Cherry-pick sin Confirmar Automáticamente

```bash
git cherry-pick -n a1b2c3d   # Aplica los cambios, pero NO crea el commit automáticamente
# Permite revisar o modificar antes de confirmar
git commit -m "Aplicar corrección urgente (cherry-pick de a1b2c3d)"
```

Útil cuando se necesita ajustar algo del contenido antes de confirmar, o combinar el cherry-pick con cambios adicionales en un único commit final.

## 18.5 Conflictos Durante un Cherry-pick

```bash
git cherry-pick a1b2c3d
# CONFLICT (content): Merge conflict in productos.js
```

```bash
# Resolver manualmente (igual que en el Módulo 15), luego:
git add productos.js
git cherry-pick --continue

git cherry-pick --abort   # Cancelar por completo, volver al estado previo
```

## 18.6 Referenciar el Commit Original en el Mensaje

```bash
git cherry-pick -x a1b2c3d
```

```text
Corregir cálculo de impuestos

(cherry picked from commit a1b2c3d4e5f6...)
```

El flag `-x` añade automáticamente una línea al mensaje del commit indicando de qué commit original proviene — una práctica de trazabilidad útil, especialmente en flujos de trabajo con ramas de release (Módulo 22) donde un mismo fix suele aplicarse a varias ramas distintas.

## 18.7 Cherry-pick vs Merge vs Rebase

| | Trae... |
| :--- | :--- |
| `merge` | **Todo** el historial de la rama fusionada |
| `rebase` | **Todos** los commits de la rama actual, reaplicados sobre otra base |
| `cherry-pick` | **Solo el commit o commits específicos** elegidos, sin el resto de la rama de origen |

## 18.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Traer un commit específico de otra rama | `git cherry-pick <hash>` |
| Traer varios commits específicos | `git cherry-pick <hash1> <hash2>` |
| Aplicar cambios sin confirmar automáticamente | `git cherry-pick -n <hash>` |
| Registrar el commit original en el mensaje | `git cherry-pick -x <hash>` |
| Continuar tras resolver un conflicto | `git cherry-pick --continue` |

## 18.9 Errores Comunes

- **Usar cherry-pick para traer trabajo extenso en lugar de merge/rebase**: cherry-pick está pensado para commits puntuales y aislados — traer decenas de commits uno por uno es más propenso a conflictos y pérdida de contexto que un merge o rebase completo de la rama.
- **Cherry-pick de un commit que depende de otros commits no incluidos**: puede producir un estado inconsistente o roto si el commit elegido asume cambios previos de la misma rama que no se trajeron junto con él.
- **Perder la trazabilidad de que un commit es una copia de otro**: sin `-x`, puede volverse confuso más adelante identificar que dos commits en ramas distintas representan, en realidad, el mismo cambio aplicado dos veces.
