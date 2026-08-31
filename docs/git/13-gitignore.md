# Módulo 13: .gitignore y Archivos Ignorados

No todo archivo de un proyecto debe rastrearse — dependencias instaladas, archivos de configuración local con credenciales, y artefactos de build son casos típicos. Este módulo cubre `.gitignore` y las herramientas relacionadas.

## 13.1 El Archivo `.gitignore`

```text
# .gitignore
node_modules/
dist/
.env
*.log
.DS_Store
```

Un archivo `.gitignore` en la raíz del repositorio (o dentro de cualquier subcarpeta) le indica a Git qué archivos y carpetas **nunca** debe rastrear ni mostrar en `git status`, incluso si existen físicamente en el disco.

## 13.2 Patrones Comunes

```text
node_modules/       # Una carpeta específica, en cualquier nivel
/dist                # Solo la carpeta "dist" en la RAÍZ del repositorio (el "/" inicial la ancla)
*.log                 # Cualquier archivo con extensión .log
!importante.log        # Excepción: SÍ rastrear este archivo específico, pese al patrón anterior
temp/**/*.tmp          # Cualquier archivo .tmp dentro de "temp", a cualquier profundidad
```

El `!` niega un patrón anterior — útil para ignorar una carpeta completa excepto un archivo específico dentro de ella, aunque el orden de las reglas importa: una excepción no puede "revivir" un archivo dentro de una carpeta ya ignorada por completo, solo archivos individuales.

## 13.3 `.gitignore` por Tecnología

```bash
# Generar un .gitignore apropiado desde la línea de comandos con gitignore.io, o usar
# las plantillas oficiales de GitHub al crear un repositorio nuevo
```

```text
# Node.js típico
node_modules/
dist/
.env
.env.local
npm-debug.log*
coverage/

# PHP típico
vendor/
.env
*.cache
```

Casi todo ecosistema tiene un conjunto de archivos generados que **no** deben versionarse — plantillas mantenidas en [github.com/github/gitignore](https://github.com/github/gitignore) cubren la mayoría de lenguajes y frameworks con las convenciones ya establecidas por la comunidad.

## 13.4 `.gitignore` No Afecta Archivos Ya Rastreados

```bash
# Si un archivo YA fue confirmado antes de agregarlo a .gitignore, seguirá rastreándose
echo "config.local.json" >> .gitignore
git status # config.local.json sigue apareciendo si ya estaba rastreado
```

```bash
git rm --cached config.local.json   # Deja de rastrearlo, SIN eliminarlo del disco
git commit -m "Dejar de rastrear config.local.json"
```

Este es el error más común con `.gitignore`: agregarlo a la lista **después** de que el archivo ya fue confirmado alguna vez no tiene efecto retroactivo — hay que quitarlo explícitamente del índice con `git rm --cached`.

## 13.5 Ignorar Archivos Solo Localmente (Sin Compartir la Regla)

```text
# .git/info/exclude — funciona igual que .gitignore, pero NO se versiona ni se comparte
archivo-personal-de-notas.md
```

Útil para ignorar archivos específicos de tu flujo de trabajo personal (notas propias, configuración de tu editor) sin imponer esa regla al resto del equipo a través de un `.gitignore` compartido en el repositorio.

## 13.6 Verificar por Qué un Archivo se Ignora

```bash
git check-ignore -v archivo.log
```

```text
.gitignore:4:*.log    archivo.log
```

Muestra exactamente qué regla, en qué archivo y línea, está causando que un archivo específico sea ignorado — útil cuando un patrón demasiado amplio ignora accidentalmente un archivo que sí debería rastrearse.

## 13.7 Archivos con Secretos: Más Allá de `.gitignore`

```text
.env              # Contiene credenciales reales — SIEMPRE en .gitignore
.env.example       # Plantilla SIN valores reales — SÍ se versiona, como referencia para el equipo
```

`.gitignore` previene que un archivo se agregue **por primera vez**, pero no protege contra un archivo con secretos que ya fue confirmado accidentalmente alguna vez — ese escenario requiere reescribir el historial (herramientas como `git filter-repo`, mencionadas en el Módulo 27) y rotar las credenciales expuestas, ya que simplemente eliminarlo en un commit posterior no borra su presencia en commits anteriores del historial.

## 13.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ignorar archivos/carpetas específicos del proyecto | Un archivo `.gitignore` con los patrones adecuados |
| Hacer una excepción dentro de un patrón ignorado | `!archivo` |
| Dejar de rastrear un archivo ya confirmado | `git rm --cached archivo` |
| Ignorar algo solo para ti, sin compartirlo con el equipo | `.git/info/exclude` |
| Diagnosticar por qué un archivo se ignora | `git check-ignore -v archivo` |

## 13.9 Errores Comunes

- **Agregar un archivo a `.gitignore` esperando que deje de rastrearse retroactivamente**: no tiene efecto sobre archivos ya confirmados — requiere `git rm --cached` explícitamente.
- **Confirmar accidentalmente un archivo `.env` con credenciales reales**: simplemente eliminarlo en un commit posterior no lo borra del historial — las credenciales expuestas deben considerarse comprometidas y rotarse de inmediato, independientemente de la limpieza del historial.
- **Usar un `.gitignore` genérico copiado sin revisar si aplica al proyecto**: puede ignorar accidentalmente archivos que sí deberían rastrearse, o dejar sin ignorar archivos generados específicos de las herramientas realmente usadas en el proyecto.
