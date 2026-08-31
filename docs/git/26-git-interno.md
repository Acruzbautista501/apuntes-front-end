# Módulo 26: Cómo Funciona Git Internamente (objetos, blobs, trees, commits)

Entender el modelo de datos interno de Git —no solo los comandos, sino qué representan realmente— convierte comandos que antes parecían mágicos (rebase, reflog, cherry-pick) en operaciones perfectamente lógicas. Este módulo abre la carpeta `.git/` y explica qué hay dentro.

## 26.1 Git es una Base de Datos de Objetos Direccionada por Contenido

```bash
echo "Hola Git" | git hash-object --stdin
# a1b2c3d4e5f6789...
```

En su núcleo, Git es una base de datos clave-valor: cada pieza de contenido se identifica por el **hash SHA-1** de su propio contenido (40 caracteres hexadecimales) — el mismo contenido exacto siempre produce el mismo hash, sin importar cuándo o dónde se calcule, y cualquier cambio, por mínimo que sea, produce un hash completamente distinto.

## 26.2 Los Cuatro Tipos de Objetos

| Objeto | Qué contiene |
| :--- | :--- |
| **blob** | El contenido de un archivo, sin nombre ni metadatos — solo los bytes |
| **tree** | Una lista de blobs y otros trees, con sus nombres y permisos — representa una carpeta |
| **commit** | Un puntero a un tree (el estado completo del proyecto), su(s) commit(s) padre, autor y mensaje |
| **tag** | Un puntero anotado a un commit específico (Módulo 14.2) |

```bash
git cat-file -p a1b2c3d   # Ver el contenido de cualquier objeto por su hash
git cat-file -t a1b2c3d    # Ver el tipo de objeto (blob, tree, commit, tag)
```

## 26.3 Un Commit no Contiene Cambios, Contiene un Estado Completo

```text
commit e5f6g7h
tree a1b2c3d           ← apunta al estado COMPLETO del proyecto en este punto
parent i9j0k1l          ← el commit anterior
author Alex <alex@ejemplo.com> 1705330200 -0600
committer Alex <alex@ejemplo.com> 1705330200 -0600

Agregar validación de formulario
```

Contrario a la intuición común, un commit **no** almacena "qué cambió" respecto al anterior — almacena un puntero al `tree` que representa el estado **completo** del proyecto en ese momento (consistente con el Módulo 1.5: Git guarda instantáneas, no diferencias). El "diff" que se ve en `git show`/`git diff` se **calcula** comparando dos trees completos, no se almacena directamente.

## 26.4 Cómo Ahorra Espacio pese a Guardar Instantáneas Completas

```text
Commit A → tree → [blob1, blob2, blob3]
Commit B → tree → [blob1, blob2_MODIFICADO, blob3]  ← blob1 y blob3 se REUTILIZAN, no se duplican
```

Como los objetos se identifican por el hash de su contenido, un archivo que no cambió entre dos commits produce el **mismo blob exacto** — Git simplemente reutiliza el objeto existente en lugar de duplicarlo, haciendo que el modelo de "instantáneas completas" sea sorprendentemente eficiente en espacio, ya que solo los archivos realmente modificados generan nuevos blobs.

## 26.5 Referencias: Ramas, HEAD y Tags son Solo Archivos

```bash
cat .git/refs/heads/main
# a1b2c3d4e5f6789...

cat .git/HEAD
# ref: refs/heads/main
```

Una rama (Módulo 5.1) es, literalmente, un archivo de texto plano dentro de `.git/refs/heads/` que contiene un único hash de commit — moverse a otro commit (un nuevo commit, un merge, un reset) simplemente reescribe el contenido de ese archivo. `HEAD` es, a su vez, un archivo que normalmente contiene una referencia simbólica ("estoy en la rama main"), o directamente un hash en estado *detached HEAD* (Módulo 14.9).

## 26.6 Por Qué Rebase y Cherry-pick Generan Hashes Nuevos

Con este modelo, ahora resulta evidente por qué el Módulo 16.3 explicaba que rebase produce commits nuevos: el hash de un commit se calcula a partir de su contenido completo, **incluyendo el hash de su padre** — cambiar el padre (de `A` a `C`, por ejemplo) cambia inevitablemente el hash resultante, aunque el `tree` (el contenido real de los archivos) sea idéntico.

## 26.7 El Área de Preparación (Index) es Otro Objeto Más

```bash
git ls-files --stage
```

```text
100644 a1b2c3d4... 0  index.html
100644 e5f6g7h8... 0  style.css
```

El área de preparación (Módulo 1.4) es, internamente, un archivo binario (`.git/index`) que ya referencia objetos blob por su hash — `git add` no "copia" el archivo a ningún lado visible, simplemente calcula su blob (si no existe ya) y actualiza esta referencia en el índice.

## 26.8 Explorar el Repositorio Directamente

```bash
find .git/objects -type f | head       # Ver los objetos almacenados físicamente
git count-objects -v                     # Estadísticas: cuántos objetos, tamaño total
git log --all --oneline --graph --decorate # El historial visual completo, con TODAS las referencias
```

## 26.9 Tabla de Referencia Rápida

| Concepto | Qué es realmente |
| :--- | :--- |
| Blob | El contenido crudo de un archivo, identificado por el hash de ese contenido |
| Tree | Una "carpeta": lista de blobs/trees con nombres y permisos |
| Commit | Un puntero a un tree completo, más metadatos (padre, autor, mensaje) |
| Rama | Un archivo de texto con un único hash de commit |
| HEAD | Un puntero al commit/rama actual |

## 26.10 Errores Comunes (Conceptuales)

- **Pensar que un commit almacena solo "lo que cambió"**: en realidad apunta a un estado completo del proyecto — el diff se calcula dinámicamente comparando dos estados completos, no se guarda como tal.
- **Asumir que Git duplica archivos sin cambios en cada commit**: el modelo de contenido direccionado por hash reutiliza automáticamente cualquier blob idéntico ya existente, sin necesidad de ninguna configuración especial.
- **No entender por qué operaciones como rebase "crean commits nuevos"**: una vez claro que el hash depende del padre del commit, resulta evidente que cualquier operación que cambie el padre (rebase, cherry-pick) necesariamente produce un hash distinto, incluso con contenido idéntico.
