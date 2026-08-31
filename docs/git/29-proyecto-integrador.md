# Módulo 29: Proyecto Integrador — Flujo de Trabajo Git Completo en Equipo

Has recorrido el camino completo: desde `git init` hasta el modelo interno de objetos de Git, pasando por rebase, resolución de conflictos y gobernanza de repositorios. Este módulo no enseña conceptos nuevos; es un **plano de aplicación práctica** para consolidar todo lo anterior en un flujo de trabajo realista de equipo.

## 29.1 El Encargo

Vas a simular el ciclo de vida completo de una funcionalidad, tal como ocurriría en un equipo de desarrollo real, aplicando cada práctica cubierta en este curso:

1. Configurar un repositorio nuevo con convenciones de equipo desde el inicio.
2. Desarrollar una funcionalidad completa en una rama, con commits siguiendo Conventional Commits.
3. Mantener la rama actualizada con `main` usando rebase, sin reescribir historial ya compartido.
4. Resolver al menos un conflicto de merge de forma deliberada.
5. Abrir un Pull Request con una descripción completa, pasar por revisión simulada.
6. Aplicar hooks locales que verifiquen calidad antes de cada commit.
7. Configurar protección de ramas y CODEOWNERS sobre el repositorio.
8. Etiquetar una versión siguiendo versionado semántico tras fusionar.
9. Practicar recuperar un commit "perdido" usando reflog, de forma deliberada.
10. Usar bisect para encontrar un bug introducido intencionalmente en el historial.

## 29.2 Checklist de Requisitos Técnicos

Cada punto remite al módulo donde se explicó la técnica. Autoevalúate antes de dar el proyecto por terminado.

### Configuración y Fundamentos
- [ ] El repositorio tiene `user.name`/`user.email` configurados correctamente (Módulo 2).
- [ ] Existe un `.gitignore` apropiado para la tecnología del proyecto, sin archivos generados rastreados por error (Módulo 13).
- [ ] El historial usa mensajes de commit siguiendo Conventional Commits (Módulo 23).

### Ramas y Colaboración
- [ ] Se siguió una estrategia de branching explícita y consistente (GitHub Flow recomendado para este ejercicio, Módulo 22).
- [ ] La rama de funcionalidad se mantuvo actualizada con `main` vía rebase durante el desarrollo (Módulo 16).
- [ ] Se resolvió al menos un conflicto de merge real, con los marcadores correctamente eliminados (Módulo 15).
- [ ] Se abrió un Pull Request con una descripción completa (qué, por qué, cómo probarlo) (Módulo 9).

### Automatización y Calidad
- [ ] Existe al menos un git hook (`pre-commit` o `commit-msg`) configurado con Husky, versionado en el proyecto (Módulo 24).
- [ ] El repositorio remoto tiene protección de ramas configurada sobre `main` (Módulo 25).
- [ ] Existe un archivo `CODEOWNERS` asignando revisores por área (Módulo 25).

### Versionado y Recuperación
- [ ] Se creó un tag anotado siguiendo versionado semántico tras una fusión relevante (Módulo 14).
- [ ] Se practicó deliberadamente perder un commit (`reset --hard`) y recuperarlo con `reflog` (Módulo 19).
- [ ] Se usó `git bisect` (manual o con `--run`) para encontrar un commit específico que introdujo un bug simulado (Módulo 20).

### Comprensión Interna
- [ ] Puedes explicar, sin consultar documentación, por qué un rebase cambia el hash de un commit (Módulo 26).
- [ ] Puedes explicar la diferencia práctica entre `git fetch` y `git pull` sin dudar (Módulo 8).

## 29.3 Escenario Sugerido para Practicar

```text
1. Crear un repositorio "tienda-online" con un README básico.
2. Configurar .gitignore, Husky con un hook pre-commit de lint.
3. Crear una rama "feature/carrito-compras" desde main.
4. Hacer 4-5 commits siguiendo Conventional Commits mientras desarrollas.
5. Mientras tanto, simular trabajo de un "compañero": hacer un commit
   directo a main desde otra copia clonada del repo, modificando
   el MISMO archivo que tu rama.
6. Intentar hacer rebase de tu rama sobre main → resolver el conflicto resultante.
7. Subir la rama, abrir un PR (si usas GitHub/GitLab realmente).
8. Fusionar con squash, eliminar la rama.
9. Etiquetar el resultado como v1.0.0.
10. Deliberadamente: git reset --hard HEAD~2, luego recuperar con reflog.
11. Introducir un bug a propósito en un commit intermedio del historial,
    y usar git bisect para encontrarlo comparando contra la versión anterior.
```

## 29.4 Criterios de "Terminado" (Definition of Done)

1. **¿El historial del repositorio es legible y sigue una convención de mensajes consistente de principio a fin?**
2. **¿Podrías explicarle a otra persona, sin dudar, la diferencia entre merge y rebase, y cuándo usar cada uno?**
3. **¿Lograste recuperar exitosamente un commit "perdido" usando únicamente el reflog, sin deshacer manualmente?**
4. **¿La protección de ramas configurada realmente impide un push directo a `main` sin pasar por Pull Request?**
5. **¿Identificaste correctamente, con `git bisect`, el commit exacto que introdujo el bug simulado?**

## 29.5 Siguientes Pasos

Con este proyecto terminado, ya tienes el criterio para:

* Colaborar con confianza en repositorios de equipo reales, incluyendo situaciones de conflicto y recuperación de errores.
* Diseñar o ajustar la estrategia de branching y las reglas de protección de un repositorio según las necesidades reales de un equipo.
* Diagnosticar y depurar historiales de Git complejos usando bisect, reflog y el modelo interno de objetos, en lugar de recurrir a soluciones improvisadas.
* Aplicar Git como una herramienta de disciplina de ingeniería —no solo de almacenamiento de código— en cualquier proyecto de este sitio, desde los de frontend hasta los backends de Node.js y PHP.
