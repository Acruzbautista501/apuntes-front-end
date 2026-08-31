# Módulo 8: Clonar, Fetch, Pull y Push

Este módulo cubre los cuatro comandos que sincronizan un repositorio local con su remoto — la base de trabajar en equipo con Git.

## 8.1 `git clone`: Obtener una Copia Completa

```bash
git clone git@github.com:usuario/mi-proyecto.git
git clone git@github.com:usuario/mi-proyecto.git nombre-carpeta-personalizado
```

`clone` descarga el repositorio completo, incluyendo **todo** su historial de commits (no solo el estado actual de los archivos), y configura automáticamente el remoto `origin` y la rama principal ya vinculada — a diferencia de descargar un `.zip` del proyecto, un clon es un repositorio Git completamente funcional desde el primer momento.

## 8.2 `git fetch`: Descargar sin Aplicar

```bash
git fetch origin
```

`fetch` descarga los commits nuevos del remoto y actualiza las referencias remotas locales (`origin/main`), **sin** modificar ningún archivo del directorio de trabajo ni la rama actual — es una operación segura de "solo mirar qué hay de nuevo" antes de decidir qué hacer con esa información.

```bash
git log main..origin/main   # Ver qué commits trajo el fetch, sin haberlos aplicado aún
```

## 8.3 `git pull`: Fetch + Merge (o Rebase) en un Paso

```bash
git pull origin main
```

`pull` es, esencialmente, un `fetch` seguido automáticamente de un `merge` (Módulo 6) de `origin/main` dentro de la rama actual — la diferencia clave frente a `fetch` es que `pull` sí modifica el directorio de trabajo inmediatamente, integrando los cambios remotos.

```bash
git pull --rebase origin main # Usa rebase (Módulo 16) en lugar de merge para integrar los cambios
```

```bash
git config --global pull.rebase true # Hacer que "--rebase" sea el comportamiento por defecto de "git pull"
```

## 8.4 `git push`: Subir Commits Locales

```bash
git push origin main
git push               # Una vez vinculada la rama (-u, Módulo 7.4), sin especificar remoto/rama
```

```bash
git push origin feature/login   # Subir una rama nueva por primera vez
git push -u origin feature/login # Y vincularla al mismo tiempo
```

## 8.5 Cuando `push` es Rechazado

```bash
git push origin main
# ! [rejected]        main -> main (fetch first)
# error: failed to push some refs
```

Git rechaza un push cuando el remoto tiene commits que tu copia local no tiene — normalmente porque alguien más subió cambios primero. La solución correcta casi siempre es `git pull` (integrar esos cambios localmente primero) y luego intentar el `push` de nuevo, nunca forzar el push sin entender por qué fue rechazado.

## 8.6 Push Forzado: Cuándo y Por Qué Casi Nunca

```bash
git push --force              # Peligroso: sobrescribe el historial remoto sin verificar nada
git push --force-with-lease    # Más seguro: falla si alguien más subió cambios que aún no descargaste
```

`--force` sobrescribe el historial remoto incondicionalmente, pudiendo **eliminar permanentemente** commits de otra persona que ya estaban en el remoto — `--force-with-lease` verifica primero que nadie más haya subido cambios inesperados, siendo la opción mucho más segura cuando un push forzado es realmente necesario (típicamente tras un rebase, Módulo 16, sobre una rama propia).

## 8.7 Ramas de Seguimiento (Tracking Branches)

```bash
git branch -vv
```

```text
* main            a1b2c3d [origin/main] Último commit
  feature/login    e5f6g7h [origin/feature/login: ahead 2] Otro commit
```

`[origin/main]` indica que la rama local `main` está vinculada (*tracking*) con `origin/main` — `ahead 2` significa que la rama local tiene 2 commits que el remoto aún no tiene, información que `git status` también resume de forma más simple.

## 8.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Obtener una copia completa de un repositorio | `git clone <url>` |
| Descargar cambios remotos sin aplicarlos | `git fetch` |
| Descargar y aplicar cambios remotos | `git pull` |
| Subir commits locales al remoto | `git push` |
| Subir una rama nueva vinculándola | `git push -u origin <rama>` |
| Forzar un push de forma más segura | `git push --force-with-lease` |

## 8.9 Errores Comunes

- **Usar `git push --force` en una rama compartida por el equipo**: puede eliminar el trabajo de otra persona sin ninguna advertencia previa — reservar push forzado exclusivamente para ramas propias, y preferir siempre `--force-with-lease`.
- **Confundir `fetch` con `pull`**: `fetch` nunca modifica tus archivos locales, `pull` sí — usar `fetch` para "inspeccionar" cambios remotos antes de decidir integrarlos es una práctica más segura en situaciones inciertas.
- **Hacer `pull` con cambios locales sin confirmar**: puede producir conflictos innecesarios o bloquear la operación — confirmar o guardar con `stash` (Módulo 12) antes de un `pull` en la mayoría de los casos.
