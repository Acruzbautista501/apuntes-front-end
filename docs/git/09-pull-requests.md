# Módulo 9: Pull Requests / Merge Requests

Un Pull Request (GitHub/Bitbucket) o Merge Request (GitLab) es una funcionalidad de la **plataforma**, no de Git en sí mismo — el mecanismo estándar para proponer, revisar y discutir cambios antes de integrarlos a una rama principal. Este módulo cubre el flujo completo.

## 9.1 ¿Qué es un Pull Request?

Un Pull Request propone fusionar los commits de una rama (normalmente una rama de funcionalidad) dentro de otra (normalmente `main`) — pero, a diferencia de un `git merge` directo (Módulo 6), lo hace a través de una interfaz web que permite: revisar el diff completo, dejar comentarios línea por línea, ejecutar automáticamente tests (CI), y requerir aprobación explícita antes de permitir la fusión.

## 9.2 El Flujo Completo

```bash
git switch -c feature/agregar-carrito
# ... trabajo, varios commits ...
git push -u origin feature/agregar-carrito
```

```text
1. Crear la rama y hacer commits localmente
2. Subir la rama al remoto (git push)
3. Abrir un Pull Request desde la interfaz web, comparando feature/agregar-carrito → main
4. El equipo revisa, comenta, y solicita cambios si es necesario
5. Se aplican los cambios solicitados con commits adicionales en la misma rama
6. Una vez aprobado, se fusiona el Pull Request
7. Se elimina la rama de funcionalidad (ya integrada)
```

## 9.3 Escribir una Buena Descripción de Pull Request

```markdown
## Qué hace este cambio
Agrega la funcionalidad de carrito de compras persistente usando localStorage.

## Por qué
Los usuarios perdían su selección al recargar la página (issue #42).

## Cómo probarlo
1. Agregar un producto al carrito
2. Recargar la página
3. Verificar que el producto sigue en el carrito

## Capturas
[imagen del carrito funcionando]
```

Una buena descripción responde qué cambió, por qué era necesario, y cómo verificarlo — reduce significativamente el tiempo que la persona revisora necesita para entender el contexto sin tener que leer cada línea del diff sin guía.

## 9.4 Revisión de Código (Code Review)

```text
Alex comentó en la línea 42:
"¿No sería mejor extraer esto a una función auxiliar reutilizable?"

Sam respondió:
"Buen punto, lo extraje en el commit a1b2c3d."
```

Los comentarios de revisión se anclan a líneas específicas del diff — el autor puede responder, aplicar el cambio sugerido, o defender su decisión con contexto adicional. Es una conversación asíncrona centrada en el código, no una aprobación ciega.

## 9.5 Tres Formas de Fusionar un Pull Request

| Estrategia | Qué hace |
| :--- | :--- |
| **Merge commit** | Crea un commit de merge explícito (equivalente a `git merge --no-ff`, Módulo 6.4), preservando todos los commits individuales de la rama |
| **Squash and merge** | Combina TODOS los commits de la rama en un único commit nuevo sobre `main` — historial limpio, pero pierde el detalle de los commits individuales |
| **Rebase and merge** | Aplica cada commit de la rama individualmente sobre `main`, sin crear un commit de merge (equivalente a rebase, Módulo 16) |

La elección depende de la preferencia del equipo: *squash* es popular quando los commits intermedios de una rama de funcionalidad son ruido ("wip", "arreglo typo") que no aporta valor conservarlos individualmente en `main`.

## 9.6 Checks Automáticos: CI en un Pull Request

```text
✅ Tests (pasaron 142/142)
✅ Lint
❌ Build (falló)
```

La mayoría de los equipos configuran verificaciones automáticas (tests, linting, build) que corren en cada Pull Request y deben pasar antes de permitir la fusión — se retoma la configuración de protección de ramas que exige esto en el Módulo 25.

## 9.7 Draft Pull Requests

Un Pull Request marcado como "Draft" (borrador) señala explícitamente que el trabajo aún no está listo para revisión formal, pero permite compartirlo temprano para recibir retroalimentación inicial o simplemente visibilizar que ya está en progreso — se convierte en un PR normal ("Ready for review") cuando el autor lo considera terminado.

## 9.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Proponer cambios para revisión antes de integrarlos | Abrir un Pull Request comparando tu rama contra la rama destino |
| Comentar sobre una línea específica del código | La interfaz de revisión de diff de la plataforma |
| Compartir trabajo en progreso sin pedir revisión formal aún | Un Pull Request en modo "Draft" |
| Mantener el historial de `main` limpio de commits intermedios | La estrategia "Squash and merge" |

## 9.9 Errores Comunes

- **Abrir un Pull Request gigante que mezcla muchas funcionalidades no relacionadas**: dificulta enormemente la revisión — preferible varios PRs pequeños y enfocados sobre uno masivo difícil de evaluar en su totalidad.
- **Ignorar o descartar comentarios de revisión sin responder**: rompe la naturaleza colaborativa del proceso — cada comentario merece una respuesta, aunque sea para explicar por qué no se aplicará el cambio sugerido.
- **Fusionar un Pull Request con checks de CI en rojo**: normalmente indica un problema real (tests rotos, build fallido) que se propagará a `main` si se ignora — la protección de ramas (Módulo 25) puede impedir esto automáticamente.
