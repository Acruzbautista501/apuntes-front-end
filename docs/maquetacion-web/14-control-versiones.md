# Módulo 14: Control de Versiones para Maquetadores

Git no es exclusivo de desarrolladores de backend o de aplicaciones complejas — cualquier maquetador que trabaje en equipo o en un proyecto que evoluciona con el tiempo necesita un flujo de trabajo de control de versiones sólido. Este módulo cubre el flujo práctico orientado específicamente a proyectos de maquetación.

## 14.1 Comandos Base del Día a Día

```bash
git status                          # Ver qué archivos cambiaron
git add archivo.css                 # Agregar un archivo específico al staging
git add .                           # Agregar todos los cambios (usar con cuidado)
git commit -m "Agrega estilos de la sección hero"
git push origin nombre-de-la-rama
git pull origin main                # Traer los últimos cambios de la rama principal
```

## 14.2 Ramas por Funcionalidad

```bash
git checkout -b feature/seccion-testimonios
# ... trabajo de maquetación ...
git add .
git commit -m "Maqueta la sección de testimonios con carrusel"
git push origin feature/seccion-testimonios
```

Trabajar en una rama separada para cada sección/página/funcionalidad, en lugar de directamente sobre `main`, permite que varios maquetadores trabajen en paralelo sin pisarse el trabajo entre sí, y facilita revisar cada cambio de forma aislada antes de integrarlo.

## 14.3 Convención de Nombres de Rama

| Prefijo | Uso |
| :--- | :--- |
| `feature/` | Una nueva sección o página |
| `fix/` | Corrección de un bug de maquetación |
| `style/` | Ajustes visuales que no cambian estructura |
| `refactor/` | Reorganización de CSS sin cambio visual |

```bash
git checkout -b fix/boton-desalineado-movil
git checkout -b style/actualizar-paleta-colores
```

## 14.4 Mensajes de Commit Descriptivos

```bash
# ❌ No comunica nada útil al revisar el historial después
git commit -m "cambios"
git commit -m "arreglos"
git commit -m "wip"

# ✅ Describe la acción y el alcance específico
git commit -m "Corrige el desbordamiento del menú móvil en pantallas menores a 360px"
git commit -m "Agrega soporte de modo oscuro al header y footer"
```

Un historial de commits descriptivo funciona como documentación del proyecto — meses después, permite entender **por qué** se hizo un cambio específico sin tener que preguntar a nadie ni adivinar.

## 14.5 Pull Requests para Revisión de Código

```text
Flujo estándar:
1. Crear una rama desde main.
2. Hacer los cambios de maquetación.
3. Abrir un Pull Request (PR) hacia main, describiendo qué se maquetó y cómo probarlo.
4. Un compañero revisa el PR (revisión de código visual y técnica).
5. Corregir el feedback si lo hay.
6. Fusionar (merge) el PR una vez aprobado.
```

Un PR de maquetación se beneficia especialmente de **capturas de pantalla o un enlace a un entorno de preview** (muchas plataformas de hosting como Netlify/Vercel generan automáticamente una URL de preview por cada PR) — mucho más útil para revisar cambios visuales que solo leer el diff de código.

## 14.6 Resolver Conflictos de Merge en CSS

```bash
git merge main
# Conflicto en styles/componentes/_tarjeta.scss
```

```scss
<<<<<<< HEAD
.tarjeta {
  padding: 1.5rem;
=======
.tarjeta {
  padding: 2rem;
  border-radius: 8px;
>>>>>>> main
}
```

Un conflicto de merge en CSS requiere decidir manualmente qué versión (o combinación de ambas) es la correcta — a diferencia de código de lógica, un conflicto visual a veces solo se resuelve con certeza revisando el resultado renderizado, no solo leyendo el código.

## 14.7 `.gitignore` para Proyectos de Maquetación

```text
node_modules/
dist/
.DS_Store
*.log
.vscode/
```

Excluir dependencias instaladas (`node_modules/`) y archivos generados por el build (`dist/`) del control de versiones — solo el código fuente se versiona, todo lo derivable de él se regenera con el build.

## 14.8 Git para Trabajar con Assets de Diseño

Los archivos de imagen/diseño (PSD, Figma exportado, imágenes de alta resolución) pesan mucho y cambian de forma binaria (no como texto), lo que Git no maneja tan eficientemente como el código. Para proyectos con muchos assets pesados, **Git LFS** (*Large File Storage*) es la extensión estándar que resuelve este problema.

```bash
git lfs install
git lfs track "*.psd"
git lfs track "*.png"
git add .gitattributes
```

## 14.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Trabajar en una sección sin afectar el trabajo de otros | Una rama nueva por funcionalidad |
| Un historial de cambios útil para el futuro | Mensajes de commit descriptivos y específicos |
| Que un compañero revise tus cambios de maquetación | Un Pull Request, idealmente con un enlace de preview |
| Resolver un conflicto de CSS con certeza | Revisar el resultado renderizado, no solo el código en conflicto |
| Versionar proyectos con muchos assets pesados | Git LFS |

## 14.10 Errores Comunes

- **Trabajar directamente sobre `main` sin ramas**: dificulta revisar y revertir cambios específicos, y genera conflictos constantes en equipos con más de una persona.
- **Mensajes de commit genéricos ("cambios", "fix")**: elimina el valor del historial como documentación — nadie puede entender qué cambió ni por qué sin revisar el diff completo.
- **Versionar `node_modules/` o archivos generados por el build**: infla innecesariamente el repositorio y genera conflictos de merge en archivos que de todas formas se regeneran automáticamente.
