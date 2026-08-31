# Módulo 7: Repositorios Remotos: GitHub/GitLab/Bitbucket

Hasta ahora, todo el trabajo ha sido local. Este módulo introduce los repositorios remotos — copias del proyecto alojadas en un servidor, la base de toda colaboración con Git.

## 7.1 ¿Qué es un Remoto?

Un remoto es simplemente una URL que apunta a otra copia del mismo repositorio Git, normalmente alojada en una plataforma como GitHub, GitLab o Bitbucket. Un repositorio puede tener cero, uno, o varios remotos configurados — el nombre convencional del remoto principal es `origin`, pero es solo una convención, no un requisito técnico.

## 7.2 Crear un Repositorio Remoto y Conectarlo

```bash
# En GitHub: crear un repositorio vacío desde la interfaz web, copiar su URL

git remote add origin https://github.com/usuario/mi-proyecto.git
git remote -v # Verificar: muestra las URLs de fetch y push configuradas
```

```text
origin  https://github.com/usuario/mi-proyecto.git (fetch)
origin  https://github.com/usuario/mi-proyecto.git (push)
```

## 7.3 HTTPS vs SSH: Dos Formas de Autenticarse

```bash
# HTTPS: requiere usuario/token en cada operación (o un credential helper, Módulo 2.8)
git remote add origin https://github.com/usuario/mi-proyecto.git

# SSH: usa un par de claves criptográficas, sin pedir credenciales repetidamente
git remote add origin git@github.com:usuario/mi-proyecto.git
```

```bash
ssh-keygen -t ed25519 -C "tu@email.com"  # Genera un par de claves
cat ~/.ssh/id_ed25519.pub                  # Copiar esta clave pública a GitHub → Settings → SSH Keys
ssh -T git@github.com                       # Verificar que la conexión funciona
```

SSH es la opción recomendada para uso diario prolongado: una vez configurada la clave, no vuelve a pedir credenciales — HTTPS requiere autenticarse en cada operación (o depender de un gestor de credenciales del sistema operativo).

## 7.4 Subir un Repositorio Local por Primera Vez

```bash
git remote add origin git@github.com:usuario/mi-proyecto.git
git push -u origin main
```

El flag `-u` (`--set-upstream`) vincula la rama local `main` con `origin/main`, de forma que futuros `git push`/`git pull` en esa rama no necesiten especificar el remoto y la rama explícitamente — se retoma en detalle en el Módulo 8.

## 7.5 Gestionar Múltiples Remotos

```bash
git remote add upstream git@github.com:proyecto-original/repo.git
git remote -v
```

```text
origin    git@github.com:tu-usuario/repo.git (fetch/push)
upstream  git@github.com:proyecto-original/repo.git (fetch/push)
```

Un patrón común al contribuir a proyectos de terceros (Módulo 10): `origin` apunta a tu propio fork, mientras `upstream` apunta al repositorio original — permite mantener tu fork actualizado con los cambios del proyecto original sin perder tu propia copia.

## 7.6 Eliminar o Renombrar un Remoto

```bash
git remote rename origin origin-viejo
git remote remove origin-viejo
```

## 7.7 Clonar un Repositorio Existente (Anticipo del Módulo 8)

```bash
git clone git@github.com:usuario/mi-proyecto.git
```

`git clone` descarga un repositorio completo (todo su historial) y configura automáticamente el remoto `origin` apuntando a la URL clonada — la forma más común de empezar a trabajar en un proyecto ya existente, cubierta en detalle en el siguiente módulo.

## 7.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Conectar un repositorio local a uno remoto | `git remote add origin <url>` |
| Ver los remotos configurados | `git remote -v` |
| Subir una rama por primera vez, vinculándola | `git push -u origin main` |
| Configurar autenticación sin pedir credenciales repetidamente | Claves SSH (`ssh-keygen`) |
| Mantener una referencia al proyecto original tras un fork | `git remote add upstream <url>` |

## 7.9 Errores Comunes

- **Usar HTTPS sin configurar un credential helper**: obliga a introducir usuario y token/contraseña en cada `push`/`pull`, una fricción constante evitable con SSH o un gestor de credenciales configurado.
- **Confundir el orden de `git remote add`**: la sintaxis es `git remote add <nombre> <url>` — invertirlo produce un error o un remoto mal configurado.
- **Olvidar `-u` en el primer `push`**: sin vincular la rama local con la remota, cada operación posterior requiere especificar `origin main` explícitamente en lugar de solo `git push`.
