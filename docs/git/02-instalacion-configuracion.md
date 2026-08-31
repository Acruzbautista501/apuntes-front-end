# Módulo 2: Instalación y Configuración Inicial

Antes del primer commit, Git necesita saber quién eres y algunas preferencias básicas. Este módulo cubre la instalación y la configuración inicial obligatoria.

## 2.1 Instalación

```bash
# macOS (con Homebrew)
brew install git

# Linux (Ubuntu/Debian)
sudo apt install git

# Windows
# Descargar desde https://git-scm.com/ (incluye Git Bash, una terminal tipo Unix)
```

```bash
git --version # Verificar la instalación
```

## 2.2 Identidad: Nombre y Email

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

Esta configuración es **obligatoria** antes del primer commit — Git registra el autor de cada commit usando estos valores, y sin ellos rechaza confirmar cambios (o los confirma con datos genéricos poco útiles). El flag `--global` aplica esta configuración a todos los repositorios del usuario en la máquina; sin él, la configuración aplicaría solo al repositorio actual.

## 2.3 Niveles de Configuración

```bash
git config --system  # Aplica a TODOS los usuarios de la máquina (raro, requiere permisos de administrador)
git config --global  # Aplica a todos los repositorios del usuario actual
git config --local   # Aplica solo al repositorio actual (por defecto, sin ningún flag)
```

```bash
# Ejemplo: usar un email distinto solo para un proyecto de trabajo
cd proyecto-trabajo/
git config user.email "tu@empresa.com" # Sin --global: sobrescribe SOLO en este repositorio
```

Los niveles se aplican en orden de especificidad: `local` sobrescribe a `global`, que sobrescribe a `system` — útil para usar un email personal por defecto y uno distinto solo en repositorios de trabajo.

## 2.4 El Editor por Defecto

```bash
git config --global core.editor "code --wait" # VS Code como editor para mensajes de commit
```

Git abre un editor de texto en ciertas operaciones (mensajes de commit largos, rebase interactivo del Módulo 17) — sin configurarlo explícitamente, usa el editor por defecto del sistema (a menudo Vim, cuya salida no es obvia para quien no lo conoce: se sale con `:wq`).

## 2.5 La Rama Principal por Defecto

```bash
git config --global init.defaultBranch main
```

Desde 2020, la convención de la comunidad cambió el nombre por defecto de la rama principal de `master` a `main` — esta configuración asegura que cualquier repositorio nuevo (`git init`, Módulo 3) use ese nombre automáticamente, sin tener que renombrarla después.

## 2.6 Ver la Configuración Actual

```bash
git config --list           # Todas las configuraciones activas, con su origen
git config user.email        # El valor de una clave específica
git config --global --edit  # Abre el archivo de configuración global directamente en el editor
```

## 2.7 Alias: Atajos para Comandos Frecuentes

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --all"
```

```bash
git st   # Equivale a "git status"
git lg    # Un historial compacto y visual
```

Los alias son puramente una conveniencia personal — no cambian el comportamiento de Git, solo acortan comandos que se escriben con mucha frecuencia.

## 2.8 Autenticación con Repositorios Remotos (Anticipo)

```bash
# HTTPS: pide usuario/token en cada operación, salvo que se cachee la credencial
git config --global credential.helper cache

# SSH: alternativa sin pedir credenciales repetidamente, cubierta en el Módulo 7
```

## 2.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Configurar tu identidad (obligatorio) | `git config --global user.name/user.email` |
| Ver toda la configuración activa | `git config --list` |
| Cambiar el editor de mensajes de commit | `git config --global core.editor "..."` |
| Crear un atajo para un comando | `git config --global alias.NOMBRE "comando"` |
| Configurar solo para el repositorio actual | Omitir `--global` |

## 2.10 Errores Comunes

- **Olvidar configurar `user.name`/`user.email` antes del primer commit**: produce commits con datos de autor incorrectos o genéricos, difíciles de corregir retroactivamente sin reescribir el historial (Módulo 17).
- **Usar el email personal en repositorios de trabajo, o viceversa**: sin una configuración `--local` específica por repositorio, todos los commits usan la configuración `--global`, mezclando identidades de forma no intencional.
- **No saber cómo salir de Vim** al abrirse como editor por defecto en una operación inesperada: `Esc` seguido de `:wq` (guardar y salir) o `:q!` (salir sin guardar) — o simplemente configurar un editor distinto (2.4) desde el principio.
