# Módulo 14: Tags y Versionado Semántico

Un tag marca un commit específico como significativo de forma permanente — típicamente, una versión publicada del software. Este módulo cubre tags y la convención de versionado semántico usada junto a ellos.

## 14.1 ¿Qué es un Tag?

```text
main:  A---B---C---D---E
                    │
                  v1.0.0
```

A diferencia de una rama (Módulo 5.1), un tag **no se mueve** — apunta permanentemente a un commit específico, marcando un punto fijo en el historial, típicamente el momento exacto en que se publicó una versión del software.

## 14.2 Tags Ligeros vs Anotados

```bash
git tag v1.0.0                                    # Tag ligero: solo un puntero, sin metadatos propios
git tag -a v1.0.0 -m "Primera versión estable"    # Tag anotado: incluye autor, fecha y mensaje propios
```

Un tag anotado es un objeto Git completo por derecho propio (con su autor, fecha y mensaje, verificable independientemente del commit) — la opción recomendada para marcar versiones de software reales; los tags ligeros son más apropiados para marcadores personales temporales.

## 14.3 Etiquetar un Commit Pasado

```bash
git tag -a v0.9.0 -m "Versión beta" a1b2c3d   # Etiqueta un commit específico, no necesariamente el más reciente
```

## 14.4 Listar y Ver Tags

```bash
git tag                        # Lista todos los tags
git tag -l "v1.*"                # Filtrar por patrón
git show v1.0.0                  # Ver los detalles del tag y el commit al que apunta
```

## 14.5 Subir Tags al Remoto

```bash
git push origin v1.0.0     # Subir un tag específico
git push origin --tags       # Subir TODOS los tags locales que aún no están en el remoto
```

Los tags **no** se suben automáticamente con un `git push` normal — deben subirse explícitamente, un detalle que sorprende a quien espera que se comporten igual que los commits de una rama.

## 14.6 Eliminar Tags

```bash
git tag -d v1.0.0                    # Eliminar localmente
git push origin --delete v1.0.0        # Eliminar también del remoto
```

## 14.7 Versionado Semántico (SemVer)

```text
v2.4.1
 │ │ │
 │ │ └── PATCH: corrección de bugs, compatible hacia atrás
 │ └──── MINOR: nueva funcionalidad, compatible hacia atrás
 └────── MAJOR: cambios incompatibles con versiones anteriores
```

[Semantic Versioning](https://semver.org/) es la convención estándar de la industria para numerar versiones de software: incrementar `PATCH` para correcciones que no cambian ninguna interfaz pública, `MINOR` para funcionalidad nueva que no rompe nada existente, y `MAJOR` para cualquier cambio que rompa compatibilidad — permite a quien consume una dependencia entender de inmediato, solo por el número de versión, qué tipo de riesgo implica actualizar.

## 14.8 Generar un Changelog a partir de Tags

```bash
git log v1.0.0..v1.1.0 --oneline   # Todos los commits entre dos versiones etiquetadas
```

Comparar el rango de commits entre dos tags consecutivos es la base para generar automáticamente notas de versión (*changelog*) — herramientas como `conventional-changelog` (retomado en el Módulo 23) automatizan esto completamente cuando los mensajes de commit siguen una convención estructurada.

## 14.9 Checkout de un Tag (Estado Detached HEAD)

```bash
git checkout v1.0.0
```

```text
Note: switching to 'v1.0.0'.
You are in 'detached HEAD' state...
```

Al hacer checkout directamente de un tag (en lugar de una rama), Git entra en estado *detached HEAD* — es posible explorar el código exactamente como estaba en esa versión, pero cualquier commit nuevo hecho en ese estado no pertenece a ninguna rama y puede perderse fácilmente al cambiar de nuevo; para desarrollar a partir de un tag, siempre crear una rama nueva desde él (`git switch -c rama-nueva v1.0.0`).

## 14.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Marcar el commit actual como una versión | `git tag -a v1.0.0 -m "mensaje"` |
| Ver todos los tags existentes | `git tag` |
| Subir tags al remoto | `git push origin --tags` |
| Ver los commits entre dos versiones | `git log v1.0.0..v1.1.0` |
| Trabajar a partir de un tag sin perder los cambios | Crear una rama nueva desde el tag, no quedarse en *detached HEAD* |

## 14.11 Errores Comunes

- **Olvidar que los tags no se suben automáticamente con `git push`**: requiere `git push --tags` o especificar el tag explícitamente — un tag creado localmente puede pasar desapercibido si nadie recuerda subirlo.
- **Hacer commits nuevos en estado *detached HEAD* sin crear una rama**: esos commits pueden perderse al cambiar de rama, ya que no pertenecen a ninguna referencia estable (aunque temporalmente recuperables vía `reflog`, Módulo 19).
- **Usar tags ligeros para versiones de software en lugar de anotados**: pierde metadatos útiles (quién y cuándo se etiquetó, y por qué) que un tag anotado sí conserva de forma permanente y verificable.
