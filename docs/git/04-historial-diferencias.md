# Módulo 4: Historial y Diferencias (log, diff, show)

Con varios commits ya en el repositorio, este módulo cubre cómo explorar el historial, comparar versiones y entender exactamente qué cambió y cuándo.

## 4.1 `git log`: el Historial Completo

```bash
git log
```

```bash
git log --oneline               # Una línea por commit, compacto
git log --oneline --graph --all # Con gráfico de ramas (muy usado en la práctica diaria)
git log -5                       # Solo los últimos 5 commits
git log --author="Alex"          # Filtrar por autor
git log --since="2 weeks ago"    # Filtrar por fecha
git log --oneline -- archivo.js  # Historial de un archivo específico
```

```text
* a1b2c3d (HEAD -> main) Corregir cálculo de totales
* e5f6g7h Agregar validación de formulario
* i9j0k1l Configuración inicial del proyecto
```

## 4.2 Formatos Personalizados de Log

```bash
git log --pretty=format:"%h - %an, %ar : %s"
```

| Marcador | Significado |
| :--- | :--- |
| `%h` | Hash corto del commit |
| `%an` | Nombre del autor |
| `%ar` | Fecha relativa ("hace 2 días") |
| `%s` | Asunto (primera línea del mensaje) |

## 4.3 `git diff`: Comparar Cambios No Confirmados

```bash
git diff                # Cambios en el directorio de trabajo NO preparados aún
git diff --staged        # Cambios YA preparados, pendientes de confirmar
git diff HEAD             # Todos los cambios (preparados o no) contra el último commit
```

```diff
diff --git a/index.html b/index.html
index a1b2c3d..e5f6g7h 100644
--- a/index.html
+++ b/index.html
@@ -10,7 +10,7 @@
-  <h1>Bienvenido</h1>
+  <h1>Bienvenido a mi sitio</h1>
```

Las líneas con `-` (rojo, en la mayoría de terminales) muestran el contenido eliminado; las líneas con `+` (verde) muestran el contenido agregado — el formato diff estándar, usado también al revisar Pull Requests (Módulo 9).

## 4.4 Comparar Dos Commits o Ramas

```bash
git diff a1b2c3d e5f6g7h        # Entre dos commits específicos
git diff main feature/login      # Entre dos ramas
git diff HEAD~2 HEAD              # Entre el commit actual y dos commits atrás
```

## 4.5 `git show`: los Detalles de un Commit Específico

```bash
git show a1b2c3d
```

Combina la información de `git log` (autor, fecha, mensaje) con el `diff` completo de ese commit específico contra su padre — el comando más directo para responder "¿qué cambió exactamente en este commit?".

## 4.6 Referencias Relativas: `HEAD`, `~` y `^`

```bash
HEAD          # El commit actual
HEAD~1         # Un commit antes de HEAD (el padre)
HEAD~3         # Tres commits antes de HEAD
HEAD^          # Equivalente a HEAD~1
HEAD^2         # El SEGUNDO padre (solo existe en commits de merge, Módulo 6)
```

`HEAD` es un puntero especial que siempre apunta al commit sobre el que estás parado actualmente — se retoma en profundidad, incluyendo su comportamiento al cambiar de rama, en el Módulo 5.

## 4.7 `git blame`: Quién Cambió Cada Línea

```bash
git blame archivo.js
```

```text
a1b2c3d4 (Alex 2024-01-15 10:30:00 -0600  12) function calcularTotal() {
e5f6g7h8 (Sam  2024-01-20 14:15:00 -0600  13)   return precio * cantidad;
```

Muestra, línea por línea, en qué commit y por quién fue modificada por última vez — útil para entender el contexto histórico de una línea de código específica antes de cambiarla, especialmente al investigar un bug.

## 4.8 Buscar en el Historial: `git log -S` y `-G`

```bash
git log -S"calcularTotal"      # Commits que agregaron o eliminaron la cadena "calcularTotal"
git log -G"calcularTotal\("     # Igual, pero con soporte de expresiones regulares
```

Útil para responder "¿en qué commit se introdujo (o eliminó) esta función/variable específica?" sin revisar el historial commit por commit manualmente.

## 4.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ver el historial completo, compacto | `git log --oneline` |
| Ver cambios aún no preparados | `git diff` |
| Ver cambios ya preparados | `git diff --staged` |
| Ver el detalle completo de un commit | `git show <hash>` |
| Referirte al commit anterior | `HEAD~1` |
| Ver quién cambió cada línea de un archivo | `git blame archivo` |
| Buscar cuándo se introdujo un texto específico | `git log -S"texto"` |

## 4.10 Errores Comunes

- **Confundir `git diff` con `git diff --staged`**: el primero muestra solo cambios sin preparar; si ya se ejecutó `git add`, esos cambios no aparecerán ahí — hay que usar `--staged` para verlos.
- **Interpretar mal las líneas `+`/`-` de un diff como "agregado/eliminado permanentemente"**: representan la diferencia entre dos versiones específicas comparadas, no necesariamente el commit más reciente del archivo.
- **No usar `git blame` antes de modificar código desconocido**: revisar el contexto histórico (commit, autor, mensaje asociado) de una línea antes de cambiarla puede revelar por qué se escribió así, evitando reintroducir un bug ya corregido antes.
