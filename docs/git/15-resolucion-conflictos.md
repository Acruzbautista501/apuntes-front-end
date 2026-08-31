# Módulo 15: Resolución de Conflictos de Merge

Los conflictos son una parte normal e inevitable de trabajar en equipo con Git — no un error a evitar a toda costa, sino una situación esperable que se resuelve con un proceso claro. Este módulo cubre cómo identificar, entender y resolver conflictos con confianza.

## 15.1 ¿Por Qué Ocurre un Conflicto?

Un conflicto ocurre cuando Git no puede combinar automáticamente dos cambios porque ambos modificaron **las mismas líneas** de un archivo de forma distinta — si los cambios estuvieran en líneas diferentes (incluso en el mismo archivo), Git los combina automáticamente sin ningún problema.

## 15.2 Anatomía de un Conflicto

```bash
git merge feature/precios
# CONFLICT (content): Merge conflict in productos.js
# Automatic merge failed; fix conflicts and then commit the result.
```

```js
<<<<<<< HEAD
const IVA = 0.16;
=======
const IVA = 0.21;
>>>>>>> feature/precios
```

| Marcador | Significado |
| :--- | :--- |
| `<<<<<<< HEAD` | Inicio de la versión de **tu rama actual** |
| `=======` | Separador entre ambas versiones |
| `>>>>>>> feature/precios` | Fin de la versión de **la rama que se está fusionando** |

## 15.3 El Proceso de Resolución

```bash
git status
# both modified: productos.js
```

```js
// Editar manualmente, eligiendo o combinando el contenido correcto, y ELIMINANDO los marcadores:
const IVA = 0.16; // Se decidió mantener el valor de la rama actual
```

```bash
git add productos.js    # Marca el conflicto como resuelto
git commit                # Sin -m: Git genera un mensaje de merge automático, editable si se desea
```

Resolver un conflicto es, en esencia, editar el archivo manualmente para dejarlo en el estado final deseado (eliminando los tres marcadores por completo) y luego confirmar esa resolución con `git add` + `git commit`, exactamente igual que cualquier otro cambio.

## 15.4 Conflictos con Múltiples Archivos

```bash
git status
```

```text
both modified: productos.js
both modified: carrito.js
```

Cuando hay varios archivos en conflicto, cada uno debe resolverse y prepararse (`git add`) individualmente antes de poder confirmar el merge completo — `git status` durante un conflicto siempre indica claramente qué archivos aún requieren resolución.

## 15.5 Herramientas Visuales de Resolución

```bash
git mergetool
```

VS Code (y la mayoría de editores modernos) muestran los conflictos con una interfaz visual que ofrece botones directos como "Aceptar cambio actual", "Aceptar cambio entrante" o "Aceptar ambos" — una alternativa considerablemente más cómoda que editar los marcadores de texto manualmente para conflictos complejos o numerosos.

## 15.6 Elegir un Lado Completo sin Combinar

```bash
git checkout --ours productos.js     # Descartar los cambios entrantes, quedarse con la versión de la rama actual
git checkout --theirs productos.js    # Descartar los cambios de la rama actual, quedarse con los entrantes
git add productos.js
```

Útil cuando el conflicto no requiere combinar contenido, sino simplemente decidir que una versión completa del archivo es la correcta y la otra debe descartarse por completo.

## 15.7 Conflictos Durante un Rebase (Anticipo del Módulo 16)

```bash
git rebase main
# CONFLICT (content): Merge conflict in productos.js
```

```bash
# Tras resolver manualmente:
git add productos.js
git rebase --continue    # NO se usa "git commit" durante un rebase
```

Un detalle importante: durante un `rebase` (a diferencia de un `merge`), tras resolver un conflicto se usa `git rebase --continue`, **no** `git commit` — el rebase gestiona los commits internamente conforme reaplica cada uno; se profundiza en esta diferencia en el Módulo 16.

## 15.8 Prevenir Conflictos Antes de que Ocurran

- Integrar los cambios de `main` en tu rama de funcionalidad **con frecuencia** (`git pull`/`git merge main`, o `git rebase main`), en lugar de dejar que la rama diverja durante semanas antes de fusionarla.
- Mantener los Pull Requests **pequeños y enfocados** (Módulo 9.9) — cuanto menos código toque una rama, menor la probabilidad de solapamiento con el trabajo de otra persona.
- Comunicar en el equipo cuando dos personas trabajarán sobre el mismo archivo o módulo al mismo tiempo.

## 15.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ver qué archivos tienen conflictos pendientes | `git status` |
| Marcar un conflicto como resuelto | `git add archivo` tras editarlo |
| Finalizar un merge con conflictos ya resueltos | `git commit` |
| Continuar un rebase tras resolver un conflicto | `git rebase --continue` |
| Quedarse con una versión completa sin combinar | `git checkout --ours/--theirs archivo` |
| Cancelar y volver al estado previo al conflicto | `git merge --abort` (Módulo 6.6) |

## 15.10 Errores Comunes

- **Dejar marcadores de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`) sin eliminar en el archivo resuelto**: produce código roto o inválido confirmado directamente en el historial — siempre revisar visualmente el archivo completo antes de `git add`.
- **Usar `git commit -m "mensaje"` durante un rebase en conflicto en lugar de `git rebase --continue`**: puede dejar el rebase en un estado inconsistente — cada herramienta de integración (merge, rebase) tiene su propio comando de finalización.
- **Resolver un conflicto sin entender realmente qué representa cada lado**: elegir aleatoriamente "el mío" o "el de ellos" sin revisar el contexto puede reintroducir un bug ya corregido, o descartar una funcionalidad nueva sin darse cuenta.
