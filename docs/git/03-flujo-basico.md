# Módulo 3: El Flujo Básico: init, add, commit

Este módulo cubre el ciclo de trabajo más fundamental de Git: iniciar un repositorio, preparar cambios y confirmarlos — los tres comandos que se usan más que ningún otro en el día a día.

## 3.1 Iniciar un Repositorio

```bash
mkdir mi-proyecto && cd mi-proyecto
git init
```

```text
Initialized empty Git repository in /ruta/mi-proyecto/.git/
```

`git init` crea una carpeta oculta `.git/` dentro del proyecto — ahí vive **todo** el historial, configuración y metadatos del repositorio. Eliminar esa carpeta elimina el repositorio Git por completo (los archivos del proyecto permanecen, pero pierden todo su historial).

## 3.2 El Estado del Repositorio: `git status`

```bash
git status
```

```text
On branch main
No commits yet
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.html
```

`git status` es el comando más usado de todo Git — muestra qué archivos están modificados, cuáles están preparados para el próximo commit, y en qué rama te encuentras. Se ejecuta constantemente durante el trabajo normal, no solo al inicio.

## 3.3 Preparar Cambios: `git add`

```bash
git add index.html        # Prepara un archivo específico
git add carpeta/            # Prepara todos los cambios dentro de una carpeta
git add .                    # Prepara TODOS los cambios del directorio actual y subcarpetas
git add -p                   # Modo interactivo: elige qué partes de un archivo preparar
```

`git add` mueve cambios del *directorio de trabajo* al *área de preparación* (Módulo 1.4) — no crea ningún registro permanente todavía, solo marca qué se incluirá en el próximo commit. Es posible (y común) modificar un archivo, prepararlo, y luego seguir modificándolo: los cambios posteriores a `git add` no se incluyen automáticamente hasta prepararlos de nuevo.

## 3.4 Confirmar Cambios: `git commit`

```bash
git commit -m "Agregar estructura HTML inicial"
```

```bash
git commit # Sin -m: abre el editor configurado (Módulo 2.4) para escribir un mensaje más largo
```

Un commit toma **todo** lo que está en el área de preparación en ese momento y lo convierte en un registro permanente del historial, con un identificador único (un hash SHA-1, cubierto en el Módulo 26), autor, fecha y mensaje.

## 3.5 El Atajo `-am`

```bash
git commit -am "Corregir estilos del header"
```

`-a` prepara automáticamente **todos los archivos ya rastreados** que tengan cambios (equivalente a un `git add` de esos archivos específicos) antes de confirmar — pero **no** incluye archivos completamente nuevos (nunca antes agregados con `git add`), que deben prepararse explícitamente al menos una vez.

## 3.6 Mensajes de Commit: la Convención de Siete Reglas

```text
Agregar validación de formulario de contacto

- Valida formato de email con expresión regular
- Muestra mensajes de error específicos por campo
- Deshabilita el botón de envío mientras hay errores
```

Un buen mensaje de commit sigue algunas convenciones ampliamente adoptadas: primera línea en modo imperativo ("Agregar", no "Agregando" ni "Agregué"), menor a 50 caracteres, línea en blanco antes del cuerpo, y el cuerpo explicando el **por qué** más que el qué (el diff ya muestra el qué). Se retoma con más profundidad, incluyendo el estándar Conventional Commits, en el Módulo 23.

## 3.7 Ver el Historial: `git log`

```bash
git log
```

```text
commit a1b2c3d4e5f6... (HEAD -> main)
Author: Alex <alex@ejemplo.com>
Date:   Mon Jan 15 10:30:00 2024 -0600

    Agregar validación de formulario de contacto
```

Se profundiza en las opciones de `git log` en el Módulo 4.

## 3.8 El Flujo Completo en la Práctica

```bash
# 1. Modificar archivos con tu editor
# 2. Revisar qué cambió
git status
git diff

# 3. Preparar los cambios deseados
git add archivo-modificado.js

# 4. Confirmar con un mensaje descriptivo
git commit -m "Corregir cálculo de totales en el carrito"

# 5. Repetir
```

## 3.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Crear un repositorio nuevo | `git init` |
| Ver el estado actual de los archivos | `git status` |
| Marcar cambios para el próximo commit | `git add <archivo>` o `git add .` |
| Confirmar los cambios preparados | `git commit -m "mensaje"` |
| Preparar y confirmar archivos ya rastreados en un paso | `git commit -am "mensaje"` |

## 3.10 Errores Comunes

- **Usar `git commit -am` esperando que incluya archivos nuevos**: el flag `-a` solo afecta archivos **ya rastreados** — un archivo creado por primera vez siempre requiere un `git add` explícito al menos una vez.
- **Escribir mensajes de commit sin contexto** ("cambios", "fix", "wip"): dificulta entender el historial más adelante, tanto para otros colaboradores como para uno mismo semanas después.
- **Hacer commits enormes que mezclan cambios no relacionados**: dificulta revisar, revertir (Módulo 11) o hacer cherry-pick (Módulo 18) de un cambio específico sin arrastrar otros no relacionados — preferible varios commits pequeños y enfocados sobre uno gigante.
