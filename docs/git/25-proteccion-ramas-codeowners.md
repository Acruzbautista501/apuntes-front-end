# Módulo 25: Protección de Ramas, CODEOWNERS y Revisión de Código

Con el equipo ya colaborando activamente, este módulo cubre las herramientas de gobernanza que las plataformas (GitHub/GitLab) ofrecen para hacer cumplir un proceso de calidad, en lugar de depender únicamente de la disciplina individual.

## 25.1 Protección de Ramas (Branch Protection)

```text
Configuración de GitHub para la rama "main":
☑ Require a pull request before merging
☑ Require approvals (mínimo: 1)
☑ Require status checks to pass before merging
    ☑ tests
    ☑ lint
    ☑ build
☑ Require branches to be up to date before merging
☑ Do not allow force pushes
☑ Do not allow deletions
```

La protección de ramas convierte reglas de proceso (que antes dependían de que cada persona las recordara) en restricciones técnicas **imposibles de saltarse** accidentalmente — nadie puede hacer push directo a `main`, fusionar sin aprobación, o fusionar con tests en rojo, sin importar sus permisos individuales de escritura sobre el repositorio.

## 25.2 Por Qué "Require Branches to be Up to Date"

```text
Tu PR fue aprobado hace 3 días.
Desde entonces, 15 commits nuevos entraron a main.
¿Tu código sigue siendo compatible con el estado ACTUAL de main?
```

Esta regla obliga a actualizar la rama del PR (merge o rebase desde `main`, Módulo 16) antes de permitir la fusión, incluso si ya fue aprobado y sus checks pasaron — evita que un PR aprobado contra una versión antigua de `main` introduzca una regresión que solo se manifiesta al combinarse con cambios más recientes de otras personas.

## 25.3 CODEOWNERS: Revisión Obligatoria por Área

```text
# .CODEOWNERS
/src/auth/          @equipo-seguridad
/src/pagos/          @equipo-pagos @ana-garcia
*.sql                 @equipo-database
/docs/                @equipo-documentacion
```

El archivo `CODEOWNERS` (en la raíz, `.github/`, o `docs/`) asigna automáticamente revisores obligatorios según qué archivos modifica un Pull Request — un cambio en `/src/pagos/` requerirá aprobación específica del equipo de pagos, sin importar quién más ya haya aprobado el resto del PR.

## 25.4 Combinar CODEOWNERS con Protección de Ramas

```text
☑ Require review from Code Owners
```

Sin esta opción activada en la configuración de protección de ramas, `CODEOWNERS` es solo informativo (sugiere revisores, pero no los exige) — activarla convierte la asignación en un requisito real que bloquea la fusión hasta obtener esa aprobación específica.

## 25.5 Reglas Específicas por Tipo de Rama

```text
main:      Máxima protección — requiere revisión, checks, actualización
develop:    Protección moderada — requiere checks, revisión opcional
feature/*: Sin restricciones — libertad total durante el desarrollo activo
```

No todas las ramas necesitan el mismo nivel de restricción — es común configurar reglas más estrictas conforme una rama se acerca a producción, dejando total libertad en ramas de funcionalidad individuales donde la iteración rápida es más valiosa que el proceso formal.

## 25.6 Revisión de Código Efectiva: Más Allá de la Herramienta

- **Revisar el *por qué*, no solo el *qué***: entender la intención del cambio (ayudada por una buena descripción de PR, Módulo 9.3) antes de evaluar si la implementación es correcta.
- **Distinguir bloqueos reales de preferencias personales**: un comentario "esto podría ser más elegante así" no debería bloquear un PR de la misma forma que "esto tiene un bug real".
- **Revisar con la misma prontitud que se espera recibir revisión**: un PR estancado días sin revisión es una de las fricciones más comunes en equipos con proceso de revisión formal.

## 25.7 Reglas Automáticas Adicionales

```text
☑ Require signed commits (Módulo 28)
☑ Require linear history (prohíbe merge commits, fuerza squash o rebase)
☑ Restrict who can push to matching branches
```

`Require linear history` es particularmente relevante junto con lo cubierto en el Módulo 9.5: fuerza a que toda fusión use squash o rebase, nunca un merge commit tradicional, manteniendo el historial de `main` completamente lineal por política, no solo por convención.

## 25.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Impedir push directo a una rama crítica | Protección de ramas: "Require a pull request before merging" |
| Exigir que los checks de CI pasen antes de fusionar | "Require status checks to pass" |
| Asignar revisores automáticamente por área del código | Un archivo `CODEOWNERS` |
| Hacer que CODEOWNERS sea obligatorio, no solo sugerido | "Require review from Code Owners" en protección de ramas |
| Forzar un historial lineal en `main` | "Require linear history" |

## 25.9 Errores Comunes

- **Configurar CODEOWNERS sin activar "Require review from Code Owners"**: el archivo queda como documentación pasiva sin ningún efecto de bloqueo real sobre las fusiones.
- **Proteger `main` pero dejar `develop` (u otra rama de integración) completamente abierta**: puede introducir regresiones tempranas que luego se propagan a `main` a través de un merge normal, sin haber pasado por ninguna verificación.
- **Reglas de protección tan estrictas que bloquean incluso el trabajo legítimo de administradores en una emergencia**: es recomendable tener un proceso documentado de excepción clara (y auditable) para situaciones genuinamente urgentes, en lugar de deshabilitar la protección por completo cada vez.
