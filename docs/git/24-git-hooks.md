# Módulo 24: Git Hooks

Los hooks de Git ejecutan scripts automáticamente en momentos específicos del flujo de trabajo — antes de un commit, antes de un push, después de un merge. Este módulo cubre cómo funcionan y cómo gestionarlos de forma compartida con el equipo.

## 24.1 ¿Qué es un Hook?

```text
.git/hooks/
├── pre-commit.sample
├── commit-msg.sample
├── pre-push.sample
└── post-merge.sample
```

Cada repositorio Git tiene una carpeta `.git/hooks/` con scripts de ejemplo (`.sample`) para cada evento posible — renombrar uno quitando `.sample` y hacerlo ejecutable lo activa. Git ejecuta ese script automáticamente cuando ocurre el evento correspondiente, y si el script termina con un código de salida distinto de cero, Git **cancela** la operación en curso.

## 24.2 Hooks del Lado del Cliente Más Usados

| Hook | Se ejecuta... | Uso típico |
| :--- | :--- | :--- |
| `pre-commit` | Antes de crear el commit | Correr linter, formatear código automáticamente |
| `commit-msg` | Tras escribir el mensaje, antes de confirmar | Validar el formato del mensaje (Conventional Commits, Módulo 23) |
| `pre-push` | Antes de subir commits al remoto | Correr la suite de tests completa |
| `post-merge` | Después de un merge/pull exitoso | Reinstalar dependencias si `package.json` cambió |

## 24.3 Un Hook Simple: `pre-commit`

```bash
#!/bin/sh
# .git/hooks/pre-commit
npx eslint . --max-warnings=0

if [ $? -ne 0 ]; then
  echo "El linter encontró errores. Commit cancelado."
  exit 1
fi
```

```bash
chmod +x .git/hooks/pre-commit   # Debe ser ejecutable
```

Si `eslint` encuentra errores, el script termina con código distinto de cero, y Git cancela el commit automáticamente — nadie puede confirmar código que no pasa el linter, sin depender de que cada persona recuerde ejecutarlo manualmente.

## 24.4 El Problema: los Hooks No se Versionan por Defecto

`.git/` es una carpeta local que **nunca** se sube al remoto (Módulo 3.1) — cualquier hook creado manualmente ahí existe solo en tu máquina, no se comparte automáticamente con el resto del equipo al clonar el repositorio. Esto motiva el uso de una herramienta dedicada para gestionar hooks compartidos.

## 24.5 Husky: Hooks Compartidos y Versionados

```bash
npm install --save-dev husky
npx husky init
```

```bash
# .husky/pre-commit (SÍ se versiona, vive dentro del proyecto, no en .git/)
npx lint-staged
```

Husky resuelve el problema de 24.4 configurando Git para leer hooks desde una carpeta versionada del proyecto (`.husky/`) en lugar de `.git/hooks/` — al clonar el repositorio e instalar dependencias (`npm install`), los hooks quedan activos automáticamente para todo el equipo, sin ningún paso manual adicional.

## 24.6 `lint-staged`: Aplicar Verificaciones Solo a Archivos Modificados

```json
{
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"],
    "*.css": ["prettier --write"]
  }
}
```

Ejecutar el linter/formateador sobre **todo** el proyecto en cada commit sería lento en proyectos grandes — `lint-staged` limita la verificación únicamente a los archivos que realmente están en el área de preparación (Módulo 1.4) de ese commit específico.

## 24.7 Hooks del Lado del Servidor (Anticipo)

Además de los hooks locales cubiertos en este módulo, Git soporta hooks del lado del servidor (`pre-receive`, `update`, `post-receive`) que se ejecutan en el servidor remoto al recibir un push — usados por plataformas como GitHub para funcionalidad como la protección de ramas (Módulo 25) y disparar pipelines de CI/CD automáticamente.

## 24.8 Omitir Hooks Deliberadamente

```bash
git commit --no-verify -m "mensaje"   # Salta pre-commit y commit-msg
git push --no-verify                    # Salta pre-push
```

Existe para casos excepcionales legítimos (un commit de emergencia bloqueado por un hook con falso positivo) — usarlo de forma habitual anula por completo el propósito de tener hooks configurados, y normalmente indica que el hook necesita ajustarse en lugar de evadirse sistemáticamente.

## 24.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ejecutar un script automáticamente antes de cada commit | Un hook `pre-commit` |
| Validar el formato del mensaje de commit | Un hook `commit-msg` |
| Compartir hooks con todo el equipo, versionados | Husky |
| Aplicar linter/formateador solo a archivos modificados | `lint-staged` |
| Saltar un hook en un caso excepcional | `--no-verify` |

## 24.10 Errores Comunes

- **Crear hooks manualmente en `.git/hooks/` esperando que se compartan con el equipo**: esa carpeta nunca se versiona — cualquier hook ahí existe solo localmente, de ahí la necesidad de Husky u otra herramienta equivalente.
- **Hooks `pre-commit` demasiado lentos** (ejecutar la suite completa de tests en cada commit, por ejemplo): genera fricción que empuja al equipo a usar `--no-verify` habitualmente, anulando el propósito del hook — reservar verificaciones pesadas para `pre-push` o CI.
- **Usar `--no-verify` como hábito en lugar de excepción**: convierte los hooks en una formalidad ignorable en la práctica, perdiendo por completo su valor como red de seguridad automatizada.
