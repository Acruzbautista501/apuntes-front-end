# Módulo 17: Optimización de Dependencias (Dependency Pre-Bundling)

El Módulo 5.2 introdujo el pre-bundling de dependencias de forma general — este módulo profundiza en cómo controlarlo explícitamente, útil al depurar comportamientos inesperados con dependencias específicas.

## 17.1 Repaso: Qué Resuelve el Pre-Bundling

```text
Sin pre-bundling: importar "lodash-es" podría requerir CIENTOS de peticiones HTTP
                    (una por cada módulo interno de la biblioteca)
Con pre-bundling:  Vite combina todo en un único archivo antes de servirlo
```

Como se explicó en el Módulo 5.2, Vite usa esbuild para pre-empaquetar cada dependencia de `node_modules` en un único archivo, cacheado en `node_modules/.vite/deps/` — este módulo cubre cómo influir directamente en ese proceso.

## 17.2 Forzar la Inclusión de una Dependencia

```ts
export default defineConfig({
  optimizeDeps: {
    include: ['una-libreria-con-muchos-submodulos'],
  },
})
```

Vite detecta automáticamente la mayoría de las dependencias a pre-empaquetar analizando los imports del código durante el arranque inicial — pero algunas dependencias, especialmente aquellas importadas dinámicamente o de forma indirecta (a través de otra dependencia), pueden no detectarse automáticamente. `include` las fuerza explícitamente.

## 17.3 Excluir una Dependencia del Pre-Bundling

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['mi-paquete-local-enlazado'],
  },
})
```

Un caso de uso común para `exclude`: paquetes locales vinculados durante desarrollo (vía `npm link`, o en un monorepo, Módulo 26) que cambian con frecuencia — pre-empaquetarlos podría hacer que Vite sirva una versión cacheada desactualizada en lugar de reflejar los cambios más recientes del paquete local.

## 17.4 Síntomas de un Problema de Pre-Bundling

```text
"Este módulo puede no ser compatible con... importación dinámica no soportada"
"Multiple instances of Vue detected"  ← comportamiento inconsistente entre instancias del mismo paquete
```

Cuando el pre-bundling detecta incorrectamente (o no detecta) una dependencia, los síntomas suelen ser errores de importación confusos, o comportamiento inconsistente de bibliotecas con estado interno (como detectar "múltiples instancias" de un mismo framework) — el primer paso de diagnóstico casi siempre es revisar si `optimizeDeps.include`/`exclude` resuelve el síntoma.

## 17.5 Forzar la Regeneración de la Caché (Repaso del Módulo 5.7)

```bash
npm run dev -- --force
```

Como se mencionó en el Módulo 5.7, esto elimina y regenera completamente la caché de pre-bundling — el primer paso de diagnóstico rápido ante cualquier comportamiento extraño relacionado con dependencias, antes de investigar configuraciones más específicas.

## 17.6 Pre-Bundling de CommonJS

```text
node_modules/una-libreria-antigua/  ← escrita en CommonJS (module.exports), no ESM
```

Como Vite sirve ESM nativo durante desarrollo (Módulo 1.2), las dependencias escritas en CommonJS (el formato más antiguo de Node.js, con `require`/`module.exports`) necesitan convertirse a ESM antes de poder servirse — el pre-bundling con esbuild también realiza esta conversión automáticamente como parte del mismo proceso, sin configuración adicional en la mayoría de los casos.

## 17.7 `optimizeDeps.esbuildOptions`: Opciones Avanzadas de esbuild

```ts
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
})
```

Expone opciones directas de esbuild específicamente para la fase de pre-bundling, distintas de las opciones de build de producción (Módulo 15) — relevante en casos límite donde una dependencia específica requiere una configuración de transformación distinta al resto del proyecto.

## 17.8 Deshabilitar el Pre-Bundling por Completo (Raro)

```ts
export default defineConfig({
  optimizeDeps: {
    disabled: false, // El valor por defecto; deshabilitarlo casi nunca es recomendable
  },
})
```

Deshabilitar el pre-bundling elimina su beneficio principal (reducir peticiones HTTP internas de dependencias con muchos módulos, 17.1) — una opción que existe principalmente para depuración puntual, no como configuración recomendada de ningún proyecto real.

## 17.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Forzar que una dependencia se pre-empaquete | `optimizeDeps.include` |
| Evitar que una dependencia (ej. un paquete local) se pre-empaquete | `optimizeDeps.exclude` |
| Regenerar la caché de pre-bundling desde cero | `vite --force` |
| Diagnosticar "múltiples instancias" de una misma librería | Revisar configuración de `optimizeDeps` y duplicados en `node_modules` |

## 17.10 Errores Comunes

- **No usar `--force` como primer paso de diagnóstico ante comportamiento extraño con dependencias**: muchos problemas aparentemente complejos se resuelven simplemente regenerando una caché de pre-bundling desactualizada.
- **Pre-empaquetar un paquete local enlazado durante desarrollo activo**: produce la frustrante experiencia de editar el paquete local y no ver los cambios reflejados, porque Vite sigue sirviendo la versión cacheada — `optimizeDeps.exclude` es la solución directa.
- **Asumir que cualquier error de importación de una dependencia es un bug de esa dependencia**: antes de reportarlo, vale la pena verificar si `optimizeDeps.include`/`exclude` o `--force` resuelven el síntoma, ya que muchos casos son configuración de pre-bundling, no un error real del paquete.
