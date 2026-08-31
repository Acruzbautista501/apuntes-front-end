# Módulo 10: Forks y Contribución a Proyectos de Terceros

Contribuir a un proyecto de código abierto en el que no tienes permisos de escritura directos requiere un flujo distinto al de un repositorio propio de equipo. Este módulo cubre forks y el ciclo completo de contribución externa.

## 10.1 ¿Qué es un Fork?

Un fork es una copia completa de un repositorio ajeno, creada bajo tu propia cuenta en la plataforma (GitHub/GitLab) — a diferencia de clonar (Módulo 8.1), un fork vive en el servidor remoto como un repositorio independiente sobre el que sí tienes permisos completos de escritura, manteniendo una relación registrada con el repositorio original.

## 10.2 El Flujo Completo de Contribución

```bash
# 1. Crear el fork desde la interfaz web (botón "Fork")

# 2. Clonar TU fork (no el repositorio original)
git clone git@github.com:tu-usuario/proyecto-popular.git
cd proyecto-popular

# 3. Agregar el repositorio original como remoto adicional (Módulo 7.5)
git remote add upstream git@github.com:autor-original/proyecto-popular.git

# 4. Crear una rama para tu contribución
git switch -c fix/error-en-validacion

# 5. Hacer los cambios, commitear
git add .
git commit -m "Corregir validación de email con dominios largos"

# 6. Subir la rama a TU fork (origin)
git push -u origin fix/error-en-validacion

# 7. Abrir un Pull Request desde tu fork hacia el repositorio original
```

## 10.3 Mantener el Fork Actualizado

```bash
git fetch upstream
git switch main
git merge upstream/main    # O "git rebase upstream/main" (Módulo 16)
git push origin main         # Actualiza TU fork con los cambios del proyecto original
```

Un fork no se actualiza automáticamente cuando el repositorio original recibe cambios nuevos — sincronizarlo periódicamente con `upstream` (7.5) evita que tu copia quede desactualizada, especialmente antes de empezar una nueva contribución.

## 10.4 Antes de Contribuir: Leer las Guías del Proyecto

```text
CONTRIBUTING.md   — Convenciones específicas del proyecto (estilo, proceso de PR)
CODE_OF_CONDUCT.md — Normas de comportamiento en la comunidad
```

La mayoría de los proyectos serios de código abierto documentan explícitamente cómo esperan que sean sus contribuciones (formato de commits, cómo correr los tests localmente, a qué rama dirigir el PR) — ignorar estas guías es la causa más común de que un PR externo sea rechazado sin revisión profunda.

## 10.5 Buenas Prácticas al Contribuir Externamente

- Abrir primero un **issue** describiendo el problema o la funcionalidad propuesta, antes de invertir tiempo en una implementación completa que podría no alinearse con la dirección del proyecto.
- Mantener el Pull Request **enfocado** en un solo cambio — los mantenedores de proyectos populares reciben muchas contribuciones y priorizan las que son fáciles de revisar.
- Responder a los comentarios de revisión con la misma cortesía y paciencia que se esperaría recibir — los mantenedores suelen ser voluntarios revisando contribuciones en su tiempo libre.

## 10.6 Sincronizar una Rama de Funcionalidad con `upstream` Durante el Desarrollo

```bash
git fetch upstream
git rebase upstream/main   # Mientras trabajas en tu rama de funcionalidad
```

Si el desarrollo de tu contribución toma tiempo y el proyecto original avanza mientras tanto, rebasar tu rama sobre los últimos cambios de `upstream` (en lugar de solo `origin`) mantiene tu PR actualizado y libre de conflictos innecesarios al momento de fusionarse.

## 10.7 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Obtener tu propia copia editable de un proyecto ajeno | Fork desde la interfaz web |
| Referenciar el repositorio original tras un fork | `git remote add upstream <url>` |
| Actualizar tu fork con los últimos cambios del original | `git fetch upstream` + `merge`/`rebase` + `push` |
| Proponer tu cambio al proyecto original | Un Pull Request desde tu fork hacia el repositorio original |

## 10.8 Errores Comunes

- **Clonar el repositorio original en lugar de tu fork**: sin permisos de escritura sobre el original, cualquier intento de `push` será rechazado — siempre clonar la URL de **tu** fork.
- **Nunca sincronizar el fork con `upstream`**: lleva a desarrollar sobre una base cada vez más desactualizada, generando conflictos innecesarios al momento de abrir el Pull Request.
- **Ignorar las guías de contribución del proyecto (`CONTRIBUTING.md`)**: la causa más frecuente de que un Pull Request externo, aunque técnicamente correcto, sea rechazado sin revisión detallada por no seguir el proceso esperado.
