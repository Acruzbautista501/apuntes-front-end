# Módulo 16: Rebase: Reescribir Historial

Rebase resuelve el mismo problema que merge —integrar cambios de una rama en otra— pero de una forma fundamentalmente distinta: reescribiendo el historial para que parezca lineal, en lugar de preservar la divergencia real. Este módulo cubre cómo funciona y cuándo usarlo con seguridad.

## 16.1 El Problema: Historial con Muchos Merges

```text
Con merge:
main:      A---B-------F-------I
                \     /       /
feature:         C---D---G---H

Con rebase:
main:      A---B---C'---D'---G'---H'
```

Un historial con muchos merges de ramas de funcionalidad puede volverse difícil de leer, con líneas cruzándose constantemente en `git log --graph` — rebase produce un historial lineal, como si cada commit de la rama de funcionalidad se hubiera escrito directamente sobre la última versión de `main`.

## 16.2 El Comando Básico

```bash
git switch feature/login
git rebase main
```

```text
Antes:  main: A---B---C
                       \
        feature:        D---E  (basado en A)

Después: main: A---B---C
                         \
         feature:         D'---E'  (rebasado, ahora basado en C)
```

Rebase toma cada commit de la rama actual (`D`, `E`) y los **reaplica uno por uno** sobre el último commit de la rama base (`C`) — el resultado son commits técnicamente **nuevos** (`D'`, `E'`, con hashes distintos), aunque el contenido de los cambios sea el mismo.

## 16.3 Por Qué los Commits Cambian de Hash

El hash de un commit se calcula, entre otras cosas, a partir de su commit padre (Módulo 26) — al rebasar, el padre de `D` cambia de `A` a `C`, por lo que Git debe generar un commit completamente nuevo (`D'`) con el mismo contenido pero un hash distinto. Esta es la razón fundamental por la que rebase se considera "reescribir" el historial, mientras que merge nunca modifica ningún commit existente.

## 16.4 La Regla de Oro del Rebase

> **Nunca rebasar una rama que otras personas ya tienen descargada y sobre la que están trabajando.**

Como el rebase genera commits nuevos con hashes distintos, cualquier persona que ya tuviera los commits originales (`D`, `E`) tendrá un historial que ya no coincide con el remoto tras el rebase — obligándola a resolver una divergencia confusa. Rebasar es seguro sobre ramas **propias**, aún no compartidas o compartidas solo contigo mismo.

## 16.5 Conflictos Durante un Rebase

```bash
git rebase main
# CONFLICT (content): Merge conflict in productos.js
```

```bash
# Resolver el conflicto manualmente, luego:
git add productos.js
git rebase --continue   # Continúa reaplicando el resto de commits

git rebase --skip        # Omite el commit actual por completo (raro, usar con cuidado)
git rebase --abort        # Cancela todo, vuelve al estado previo al rebase
```

A diferencia de un merge (un único punto de conflicto posible), un rebase puede presentar conflictos **repetidamente**, una vez por cada commit que se reaplica — cada uno se resuelve y continúa individualmente con `--continue`.

## 16.6 Merge vs Rebase: la Decisión en la Práctica

| Escenario | Recomendación |
| :--- | :--- |
| Actualizar tu rama de funcionalidad con los últimos cambios de `main` | Rebase (historial lineal y limpio) |
| Integrar una rama de funcionalidad ya terminada a `main` | Merge (preserva el contexto de que fue trabajo en paralelo) |
| La rama ya fue compartida y otras personas la tienen descargada | Merge (nunca reescribir historial compartido) |

## 16.7 Push Tras un Rebase

```bash
git push --force-with-lease origin feature/login
```

Como el rebase genera commits nuevos, un `push` normal será rechazado (el remoto tiene los commits "viejos") — requiere un push forzado (Módulo 8.6), y **solo** debe hacerse sobre una rama que nadie más esté usando activamente, siguiendo siempre `--force-with-lease` en lugar de `--force` a secas.

## 16.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Reaplicar tus commits sobre la última versión de otra rama | `git rebase main` |
| Continuar tras resolver un conflicto durante el rebase | `git rebase --continue` |
| Cancelar un rebase en progreso | `git rebase --abort` |
| Subir una rama tras rebasarla | `git push --force-with-lease` |

## 16.9 Errores Comunes

- **Rebasar una rama que otras personas ya descargaron**: genera una divergencia de historial confusa y difícil de resolver para el resto del equipo — la regla de oro (16.4) existe precisamente para prevenir esto.
- **Usar `git commit` en lugar de `git rebase --continue`** tras resolver un conflicto de rebase: puede dejar el proceso en un estado inconsistente — cada operación de integración tiene su propio comando de finalización correcto.
- **Usar `push --force` (sin `--with-lease`) tras un rebase**: sobrescribe el remoto sin verificar si alguien más subió cambios inesperados en el intervalo, con riesgo real de eliminar trabajo ajeno.
