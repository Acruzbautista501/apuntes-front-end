# Módulo 19: Reflog y Recuperación de Commits Perdidos

`git reflog` es la red de seguridad de Git — un registro local de **todos** los movimientos de `HEAD`, incluidos commits "perdidos" por un `reset --hard`, una rama eliminada, o un rebase problemático. Este módulo cubre cómo usarlo para recuperar trabajo aparentemente perdido.

## 19.1 ¿Qué Registra el Reflog?

```bash
git reflog
```

```text
e5f6g7h HEAD@{0}: commit: Agregar validación de formulario
a1b2c3d HEAD@{1}: reset: moving to HEAD~1
i9j0k1l HEAD@{2}: commit: WIP: estilos del botón
m3n4o5p HEAD@{3}: checkout: moving from main to feature/login
```

A diferencia de `git log` (que muestra el historial de commits alcanzables desde la rama actual), `reflog` muestra **cada movimiento** de `HEAD` en este repositorio local: commits, cambios de rama, resets, rebases, merges — es un registro puramente local, nunca se sube al remoto ni se comparte con nadie más.

## 19.2 El Caso de Uso Clásico: Recuperar tras un `reset --hard`

```bash
git reset --hard HEAD~3   # Se perdieron 3 commits "por accidente"
```

```bash
git reflog
# a1b2c3d HEAD@{0}: reset: moving to HEAD~3
# e5f6g7h HEAD@{1}: commit: El último commit que "se perdió"
```

```bash
git reset --hard HEAD@{1}   # Vuelve exactamente al estado justo antes del reset accidental
# O, más seguro: crear una rama nueva desde ahí sin tocar la rama actual
git branch recuperado HEAD@{1}
```

Los commits "eliminados" por un `reset --hard` no se borran inmediatamente del repositorio — quedan sin ninguna rama apuntándolos (huérfanos), pero siguen existiendo físicamente hasta que Git los elimina en una limpieza posterior (`gc`, Módulo 27), normalmente semanas después.

## 19.3 Recuperar una Rama Eliminada

```bash
git branch -D feature/login   # Eliminada "por error"
```

```bash
git reflog | grep feature/login
# m3n4o5p HEAD@{5}: checkout: moving from main to feature/login
```

```bash
git branch feature/login m3n4o5p   # Recrea la rama apuntando al último commit conocido
```

## 19.4 Recuperar tras un Rebase Problemático

```bash
git rebase main   # Salió mal, resultado inesperado
```

```bash
git reflog
# a1b2c3d HEAD@{0}: rebase (finish): returning to refs/heads/feature/login
# e5f6g7h HEAD@{1}: rebase (pick): Segundo commit
# ...
# m3n4o5p HEAD@{7}: rebase: checkout main   ← el estado justo ANTES de iniciar el rebase
```

```bash
git reset --hard HEAD@{7}   # Vuelve exactamente al estado previo al rebase
```

## 19.5 Reflog es Local y Temporal

- **Local**: el reflog nunca se sube al remoto — solo existe en la copia local donde ocurrieron esos movimientos, no es una herramienta para recuperar trabajo perdido en la máquina de otra persona.
- **Temporal**: por defecto, las entradas del reflog expiran después de 90 días (commits alcanzables) o 30 días (commits inalcanzables) — no es un archivo permanente de respaldo indefinido, sino una red de seguridad de corto-mediano plazo.

## 19.6 Verificar Antes de Recuperar

```bash
git show HEAD@{1}          # Ver el contenido de una entrada del reflog antes de restaurarla
git log --oneline HEAD@{1} # Ver el historial completo desde ese punto
```

Siempre es recomendable inspeccionar una entrada del reflog antes de restaurarla con `reset --hard`, para confirmar que efectivamente es el estado que se busca recuperar.

## 19.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ver el historial completo de movimientos de HEAD | `git reflog` |
| Volver a un estado específico del reflog | `git reset --hard HEAD@{N}` |
| Recuperar una rama eliminada por error | `git branch <nombre> <hash-del-reflog>` |
| Verificar el contenido antes de restaurar | `git show HEAD@{N}` |

## 19.8 Errores Comunes

- **No saber que el reflog existe y darse por vencido tras un error grave**: la enorme mayoría de las situaciones de "perdí mi trabajo" en Git son recuperables a través del reflog, siempre que no haya pasado demasiado tiempo ni se haya ejecutado una limpieza manual (`git gc --prune`).
- **Confiar en el reflog como respaldo a largo plazo**: expira automáticamente (19.5) — no sustituye a tags, ramas o remotos como forma de preservar trabajo importante de forma permanente.
- **Restaurar directamente con `reset --hard` sin verificar primero el contenido**: usar `git show`/`git log` sobre la entrada del reflog antes de restaurar evita sobrescribir el estado actual con algo que no era lo que realmente se buscaba recuperar.
