# Módulo 21: Submódulos y Subtrees

Cuando un proyecto necesita incluir otro repositorio Git completo dentro de sí mismo (una biblioteca compartida, un proyecto relacionado), existen dos enfoques con compromisos distintos: submódulos y subtrees. Este módulo cubre ambos.

## 21.1 El Problema: Repositorios Dentro de Repositorios

```text
mi-proyecto/
├── src/
├── libs/
│   └── biblioteca-compartida/   ← este es, en sí mismo, otro repositorio Git completo
└── package.json
```

Cuando una biblioteca propia se mantiene en su propio repositorio (quizás usada por varios proyectos distintos), pero también necesita incluirse dentro de otro proyecto, Git ofrece dos mecanismos nativos para esto en lugar de simplemente copiar los archivos manualmente.

## 21.2 Submódulos: Agregar

```bash
git submodule add https://github.com/usuario/biblioteca-compartida.git libs/biblioteca-compartida
git commit -m "Agregar biblioteca-compartida como submódulo"
```

```text
# .gitmodules (generado automáticamente)
[submodule "libs/biblioteca-compartida"]
    path = libs/biblioteca-compartida
    url = https://github.com/usuario/biblioteca-compartida.git
```

Un submódulo registra, dentro del proyecto principal, una **referencia** a un commit específico de otro repositorio — el repositorio principal no contiene el código de la biblioteca directamente, solo apunta a un punto exacto de su historial.

## 21.3 Clonar un Proyecto con Submódulos

```bash
git clone --recurse-submodules https://github.com/usuario/mi-proyecto.git
```

```bash
# Si ya se clonó SIN ese flag:
git submodule update --init --recursive
```

Un `git clone` normal, sin `--recurse-submodules`, deja las carpetas de submódulos **vacías** — es uno de los errores más comunes al trabajar con submódulos por primera vez: el proyecto parece incompleto porque las dependencias de submódulo nunca se descargaron.

## 21.4 Actualizar un Submódulo a una Versión Más Reciente

```bash
cd libs/biblioteca-compartida
git pull origin main       # Actualiza el submódulo a la última versión de SU propia rama
cd ../..
git add libs/biblioteca-compartida
git commit -m "Actualizar biblioteca-compartida a la última versión"
```

Actualizar un submódulo es un proceso de **dos pasos**: primero actualizar el repositorio del submódulo en sí (como cualquier otro repositorio Git independiente), y luego confirmar en el proyecto principal que ahora apunta a ese nuevo commit — el proyecto principal nunca actualiza un submódulo automáticamente por su cuenta.

## 21.5 Subtree: la Alternativa sin Referencias Externas

```bash
git subtree add --prefix=libs/biblioteca-compartida https://github.com/usuario/biblioteca-compartida.git main --squash
```

A diferencia de un submódulo (que mantiene una referencia externa), un subtree **copia** el código de la biblioteca directamente dentro del historial del proyecto principal — el resultado es un repositorio autocontenido donde clonar el proyecto principal trae automáticamente todo el código, sin pasos adicionales.

## 21.6 Submódulo vs Subtree: la Decisión

| | Submódulo | Subtree |
| :--- | :--- | :--- |
| Clonar el proyecto principal | Requiere `--recurse-submodules` o un paso adicional | Funciona con un `clone` normal, sin pasos extra |
| Tamaño del repositorio principal | Pequeño (solo una referencia) | Aumenta (incluye todo el código copiado) |
| Curva de aprendizaje | Más comandos específicos, más propenso a confusión | Más simple para quien lo clona, pero comandos de sincronización menos conocidos |
| Actualizar la dependencia | Comando dedicado, workflow claro | `git subtree pull`, menos usado por el equipo en general |

En la práctica actual, muchos equipos prefieren evitar ambos cuando es posible, optando por gestores de paquetes (npm, Composer) para dependencias reales — submódulos y subtrees siguen siendo relevantes para casos específicos, como compartir configuración o código entre repositorios internos sin publicarlo como paquete formal.

## 21.7 Eliminar un Submódulo Correctamente

```bash
git submodule deinit -f libs/biblioteca-compartida
git rm -f libs/biblioteca-compartida
rm -rf .git/modules/libs/biblioteca-compartida
```

Eliminar un submódulo requiere estos tres pasos — simplemente borrar la carpeta o usar `git rm` sin `deinit` deja metadatos residuales en `.git/modules/` que pueden causar errores confusos más adelante.

## 21.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Agregar un repositorio externo como referencia | `git submodule add <url> <ruta>` |
| Clonar un proyecto incluyendo sus submódulos | `git clone --recurse-submodules <url>` |
| Descargar submódulos tras un clone normal | `git submodule update --init --recursive` |
| Copiar un repositorio externo completo dentro del historial | `git subtree add --prefix=<ruta> <url> <rama> --squash` |

## 21.9 Errores Comunes

- **Clonar sin `--recurse-submodules` y no darse cuenta de que las carpetas de submódulos están vacías**: causa errores de "archivo no encontrado" confusos hasta ejecutar `git submodule update --init`.
- **Modificar archivos directamente dentro de un submódulo sin hacer commit/push en SU propio repositorio**: los cambios quedan como modificaciones locales no confirmadas del submódulo, invisibles para cualquier otra persona que lo clone.
- **Elegir submódulos por defecto sin considerar si un gestor de paquetes real (npm, Composer) resolvería el problema de forma más simple**: submódulos y subtrees añaden complejidad operativa real — vale la pena confirmar que ningún gestor de dependencias estándar cubre el caso de uso antes de adoptarlos.
