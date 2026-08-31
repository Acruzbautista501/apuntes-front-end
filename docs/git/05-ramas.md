# Módulo 5: Ramas (Branches): Crear, Cambiar, Eliminar

Las ramas son, posiblemente, la característica que hizo de Git el estándar de la industria — permiten desarrollar funcionalidades en paralelo sin afectar el código estable. Este módulo cubre su ciclo de vida completo.

## 5.1 ¿Qué es una Rama?

```text
main:     A---B---C
                    \
feature:             D---E
```

Una rama es, técnicamente, solo un **puntero móvil** a un commit específico — nada más. Crear una rama es una operación instantánea porque no copia ningún archivo; simplemente crea un nuevo puntero que avanza junto con cada nuevo commit hecho mientras esa rama está activa.

## 5.2 Crear y Listar Ramas

```bash
git branch                    # Lista las ramas existentes, marcando la actual con *
git branch feature/login       # Crea una rama nueva (sin cambiarte a ella)
git branch -a                  # Lista también ramas remotas (Módulo 8)
```

## 5.3 Cambiar de Rama: `checkout` y `switch`

```bash
git checkout feature/login    # Comando clásico, funciona también para archivos (Módulo 11)
git switch feature/login       # Comando moderno (Git 2.23+), dedicado exclusivamente a ramas
```

```bash
git checkout -b feature/login  # Crear Y cambiar en un solo paso
git switch -c feature/login     # Equivalente moderno
```

`git switch` se introdujo para separar la responsabilidad de `checkout`, que históricamente mezclaba "cambiar de rama" y "descartar cambios en un archivo" (Módulo 11) bajo el mismo comando, una fuente común de confusión — en proyectos y tutoriales modernos, `switch` es la opción recomendada para cambiar de rama.

## 5.4 Qué Pasa con `HEAD` al Cambiar de Rama

```text
Antes:  HEAD → main → C
Después de "git switch feature": HEAD → feature → E
```

Al cambiar de rama, Git actualiza tanto el puntero `HEAD` como **todos los archivos del directorio de trabajo** para reflejar el estado exacto de esa rama — es fundamental tener el trabajo actual confirmado (o guardado con `stash`, Módulo 12) antes de cambiar, o Git puede impedir el cambio si detecta que se perdería trabajo no guardado.

## 5.5 Renombrar y Eliminar Ramas

```bash
git branch -m nombre-viejo nombre-nuevo   # Renombrar (o "-m nuevo" si ya estás en ella)
git branch -d feature/login                # Eliminar, solo si ya fue fusionada (seguro)
git branch -D feature/login                # Eliminar forzosamente, aunque tenga cambios sin fusionar
```

`-d` (minúscula) es una eliminación segura: Git se niega si la rama tiene commits que no existen en ninguna otra rama, evitando perder trabajo por accidente — `-D` (mayúscula) omite esa verificación deliberadamente.

## 5.6 Convenciones de Nombres de Ramas

```text
feature/login-social
fix/error-calculo-total
hotfix/vulnerabilidad-critica
release/v2.1.0
```

Un prefijo consistente (`feature/`, `fix/`, `hotfix/`) comunica de inmediato el propósito de una rama solo con su nombre — se retoma en profundidad, junto con estrategias completas de branching a nivel de equipo, en el Módulo 22.

## 5.7 Ramas Locales vs Remotas (Anticipo)

```bash
git branch -v            # Ramas locales, con su último commit
git branch -vv            # Además, muestra con qué rama remota está vinculada cada una
```

Una rama creada localmente no existe en el remoto (GitHub) hasta que se sube explícitamente (`git push`, cubierto en el Módulo 8) — esta distinción entre el estado local y remoto de una rama es central para entender la colaboración con Git.

## 5.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ver en qué rama estás | `git branch` (marca la actual con `*`) |
| Crear una rama nueva | `git branch nombre` |
| Cambiar de rama | `git switch nombre` |
| Crear y cambiar en un paso | `git switch -c nombre` |
| Eliminar una rama ya fusionada | `git branch -d nombre` |
| Eliminar una rama sin fusionar (forzado) | `git branch -D nombre` |

## 5.9 Errores Comunes

- **Trabajar directamente sobre `main` en lugar de crear una rama de funcionalidad**: dificulta mantener `main` siempre en un estado estable y desplegable, y complica revertir un cambio específico sin afectar el resto.
- **Cambiar de rama con cambios sin confirmar y sin usar `stash`**: si los archivos modificados entran en conflicto con la rama destino, Git bloquea el cambio — entender `git stash` (Módulo 12) evita este bloqueo sin perder trabajo.
- **Usar `-D` por costumbre en lugar de `-d`**: eliminar una rama forzosamente sin verificar que ya fue fusionada puede perder commits que no existen en ningún otro lugar (aunque son recuperables temporalmente vía `reflog`, Módulo 19).
