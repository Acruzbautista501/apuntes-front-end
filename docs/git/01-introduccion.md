# Módulo 1: Introducción a Git y Control de Versiones

Git es el sistema de control de versiones más usado del mundo — la herramienta que registra el historial de cambios de un proyecto, permite trabajar en paralelo sin pisarse el trabajo entre personas, y hace posible volver atrás a cualquier punto anterior del proyecto. Este módulo cubre qué problema resuelve Git y los conceptos base antes de tocar un solo comando.

## 1.1 ¿Qué Problema Resuelve el Control de Versiones?

Sin control de versiones, colaborar en un proyecto implica archivos como `proyecto_final.zip`, `proyecto_final_v2.zip`, `proyecto_final_v2_DEFINITIVO.zip` — sin forma clara de saber qué cambió entre versiones, quién lo cambió, ni cómo combinar el trabajo de dos personas sobre el mismo archivo. Un sistema de control de versiones resuelve esto registrando cada cambio de forma estructurada, con autor, fecha y motivo.

## 1.2 Git vs GitHub/GitLab: una Confusión Común

| Concepto | Qué es |
| :--- | :--- |
| **Git** | El programa que corre en tu computadora y gestiona el historial de versiones de un proyecto |
| **GitHub / GitLab / Bitbucket** | Plataformas web que alojan repositorios Git de forma remota y añaden herramientas de colaboración (Pull Requests, issues, CI/CD) |

Git funciona completamente **sin** GitHub — es posible usar Git de forma local, sin conexión a internet ni ninguna cuenta en ningún servicio. GitHub es solo el lugar más común donde alojar una copia remota de un repositorio Git, cubierto a partir del Módulo 7.

## 1.3 Control de Versiones Distribuido vs Centralizado

```text
Centralizado (ej. SVN):          Distribuido (Git):
                                   
   Servidor central                Servidor remoto (GitHub)
        │                                │
   ┌────┼────┐                    ┌──────┼──────┐
   PC1  PC2  PC3                  PC1    PC2    PC3
                                 (historial   (historial
                                  completo)    completo)
```

En un sistema centralizado, solo el servidor tiene el historial completo — cada persona solo descarga los archivos actuales. En Git (distribuido), **cada copia local es un repositorio completo** con todo el historial — se puede hacer commits, ver el historial completo y crear ramas sin ninguna conexión de red, y sincronizar con el remoto solo cuando sea necesario.

## 1.4 Los Tres Estados de un Archivo en Git

```text
Directorio de Trabajo → Área de Preparación (Staging) → Repositorio (.git)
   (Working Directory)        (Index / Stage)              (Commits)
```

| Estado | Qué significa |
| :--- | :--- |
| **Modificado** | El archivo cambió en el disco, pero Git aún no lo está rastreando para el próximo commit |
| **Preparado (staged)** | El cambio fue marcado explícitamente (`git add`) para incluirse en el próximo commit |
| **Confirmado (committed)** | El cambio quedó guardado permanentemente en el historial del repositorio |

Este flujo de tres pasos —modificar, preparar, confirmar— es la base de **todo** lo que sigue en este curso, y lo que distingue a Git de simplemente "guardar" un archivo: cada commit es una decisión deliberada sobre qué cambios específicos incluir, no un volcado automático de todo lo que cambió.

## 1.5 Instantáneas (Snapshots), no Diferencias

A diferencia de otros sistemas que almacenan solo la diferencia entre versiones consecutivas de un archivo, Git guarda —conceptualmente— una **instantánea completa** del estado de todos los archivos en cada commit. Internamente lo hace de forma eficiente (reutilizando archivos que no cambiaron, cubierto en el Módulo 26), pero pensar en cada commit como "una foto completa del proyecto en ese momento" es el modelo mental correcto desde el principio.

## 1.6 Tabla de Referencia Rápida

| Concepto | Qué es |
| :--- | :--- |
| Repositorio | El proyecto completo con todo su historial, dentro de una carpeta `.git` |
| Commit | Una instantánea guardada del proyecto en un momento específico |
| Working Directory | Los archivos tal como existen actualmente en el disco |
| Staging Area | Los cambios marcados para incluirse en el próximo commit |
| Remoto | Una copia del repositorio alojada en otro lugar (ej. GitHub) |

## 1.7 Errores Comunes (Conceptuales)

- **Confundir Git con GitHub**: Git es la herramienta de control de versiones; GitHub es una plataforma que aloja repositorios Git de forma remota — son dos cosas relacionadas pero distintas.
- **Asumir que Git guarda cambios automáticamente**: nada se registra en el historial hasta que se ejecuta explícitamente un `commit` (Módulo 3) — modificar un archivo por sí solo no crea ningún registro permanente.
- **Pensar que se necesita conexión a internet para usar Git**: la enorme mayoría del trabajo diario (commits, ramas, historial) ocurre completamente en local, sin ninguna red involucrada.
