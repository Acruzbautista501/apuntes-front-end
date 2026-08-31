# Módulo 20: Git Bisect: Depuración por Bisección

`git bisect` automatiza la búsqueda del commit exacto que introdujo un bug, usando búsqueda binaria sobre el historial — encuentra el culpable en un puñado de pasos, incluso entre miles de commits, en lugar de revisar el historial uno por uno.

## 20.1 El Problema que Resuelve

```text
"Esta funcionalidad funcionaba hace un mes, y ahora está rota.
 ¿En cuál de los ~200 commits desde entonces se rompió?"
```

Revisar 200 commits uno por uno es impracticable — bisect usa búsqueda binaria: prueba el commit intermedio del rango, según el resultado descarta la mitad restante, y repite. Con 200 commits, encuentra el culpable en aproximadamente **8 pasos** (log₂ 200 ≈ 7.6), no 200.

## 20.2 El Flujo Completo

```bash
git bisect start
git bisect bad                    # El commit ACTUAL tiene el bug
git bisect good v1.2.0             # Este commit/tag anterior NO tenía el bug
```

```text
Bisecting: 97 revisions left to test after this (roughly 7 steps)
[a1b2c3d...] Commit intermedio automáticamente seleccionado
```

Git hace checkout automáticamente al commit intermedio entre el rango "bueno" y "malo" — corresponde probar manualmente si el bug está presente en ese punto específico.

```bash
# Tras probar manualmente la funcionalidad en este commit intermedio:
git bisect good   # Si el bug NO está presente aquí
# O
git bisect bad     # Si el bug SÍ está presente aquí
```

Git repite automáticamente el proceso, reduciendo el rango a la mitad en cada paso, hasta identificar el commit exacto:

```text
a1b2c3d4e5f6... is the first bad commit
```

## 20.3 Finalizar la Sesión

```bash
git bisect reset   # Vuelve al commit/rama donde estabas antes de iniciar el bisect
```

**Siempre** finalizar con `reset` al terminar — mientras la sesión de bisect está activa, el repositorio permanece en estado *detached HEAD* (Módulo 14.9) saltando entre distintos commits del historial.

## 20.4 Automatizar con un Script: `git bisect run`

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.2.0
git bisect run npm test -- --grep "cálculo de totales"
```

Si existe un test automatizado que falla exactamente cuando el bug está presente, `bisect run` automatiza el proceso **completo** sin intervención manual: ejecuta el comando en cada commit intermedio, interpreta un código de salida `0` como "good" y cualquier otro como "bad", y reporta el commit culpable directamente.

```bash
#!/bin/bash
# script-de-verificacion.sh — código de salida 0 = good, distinto de 0 = bad
npm test -- --grep "carrito de compras"
```

```bash
git bisect run ./script-de-verificacion.sh
```

## 20.5 Marcar Commits que no se Pueden Probar

```bash
git bisect skip   # El commit actual no se puede probar (ej. no compila por razones no relacionadas al bug)
```

Cuando un commit intermedio específico no puede evaluarse de forma confiable (por ejemplo, un estado de build roto por otra razón), `skip` lo excluye de la búsqueda sin invalidar el proceso completo.

## 20.6 Ver el Progreso en Cualquier Momento

```bash
git bisect log      # Historial completo de good/bad marcados hasta ahora
git bisect visualize # Abre gitk (o el visor configurado) mostrando el rango restante
```

## 20.7 Guardar y Reproducir una Sesión

```bash
git bisect log > sesion-bisect.txt
```

```bash
git bisect replay sesion-bisect.txt   # Reproduce exactamente los mismos pasos, útil para compartir el proceso
```

## 20.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Iniciar la búsqueda de un commit problemático | `git bisect start` |
| Marcar el punto de partida conocido como malo/bueno | `git bisect bad` / `git bisect good <hash>` |
| Marcar el commit actual tras probarlo manualmente | `git bisect good` / `git bisect bad` |
| Automatizar la búsqueda completa con un test | `git bisect run <comando>` |
| Finalizar la sesión y volver al estado original | `git bisect reset` |

## 20.9 Errores Comunes

- **Olvidar `git bisect reset` al terminar**: deja el repositorio en estado *detached HEAD* indefinidamente, generando confusión en operaciones posteriores.
- **Probar el bug de forma inconsistente entre pasos** (ej. con datos de prueba distintos cada vez): produce resultados contradictorios que invalidan la búsqueda binaria — la condición de prueba debe ser exactamente la misma en cada paso.
- **No usar `bisect run` cuando existe un test automatizable**: revisar manualmente decenas de commits cuando un simple script podría automatizar por completo el proceso es un desperdicio de tiempo evitable.
