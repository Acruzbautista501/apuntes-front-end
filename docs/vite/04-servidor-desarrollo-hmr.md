# Módulo 4: El Servidor de Desarrollo y Hot Module Replacement (HMR)

El servidor de desarrollo de Vite es donde su arquitectura de "servir ESM nativo bajo demanda" se vuelve más evidente en la práctica diaria. Este módulo cubre cómo funciona, y cómo funciona HMR — la actualización instantánea de código sin perder el estado de la aplicación.

## 4.1 Qué Pasa al Ejecutar `npm run dev`

```text
1. Vite inicia un servidor HTTP local
2. Sirve index.html sin modificar significativamente su estructura
3. El navegador solicita src/main.ts vía <script type="module">
4. Vite transforma SOLO ese archivo bajo demanda (con esbuild) y lo sirve
5. El navegador procesa sus imports, solicitando cada uno individualmente
6. Vite transforma y sirve cada módulo solicitado, uno por uno
```

Nada se empaqueta por adelantado — cada módulo se transforma **la primera vez que se solicita**, y Vite cachea el resultado en memoria para peticiones subsecuentes del mismo módulo sin cambios.

## 4.2 Hot Module Replacement (HMR): el Concepto

```text
Sin HMR: modificar un archivo → recargar la página completa → se pierde el estado
Con HMR:  modificar un archivo → SOLO ese módulo se reemplaza → el estado se conserva
```

HMR reemplaza el código de un módulo específico directamente en el navegador, sin recargar la página completa — el ejemplo más citado es modificar un componente con un formulario lleno de datos: sin HMR, cada guardado recarga la página y vacía el formulario; con HMR, el componente se actualiza visualmente al instante, preservando el estado que ya tenía.

## 4.3 HMR es (Casi) Instantáneo, Sin Importar el Tamaño del Proyecto

```text
Bundler tradicional con HMR: recompila el módulo Y potencialmente sus dependientes,
                               con overhead que crece con el tamaño del grafo
Vite: invalida SOLO el módulo específico, el navegador vuelve a solicitarlo directamente
```

Como Vite nunca empaquetó el proyecto en primer lugar, invalidar un módulo específico no requiere recalcular ningún bundle — simplemente le indica al navegador (vía una conexión WebSocket) que ese módulo específico cambió, y el navegador lo vuelve a importar directamente. Esta es la razón por la que la velocidad de HMR en Vite se mantiene constante incluso en proyectos con miles de módulos, a diferencia de bundlers tradicionales donde podía degradarse con el tamaño del proyecto.

## 4.4 La API de HMR (Uso Avanzado)

```ts
if (import.meta.hot) {
  import.meta.hot.accept((modificado) => {
    console.log('Este módulo se actualizó', modificado)
  })
}
```

Los plugins de framework (`@vitejs/plugin-vue`, `@vitejs/plugin-react`) implementan esta API internamente para lograr HMR con preservación de estado en componentes — en el código de aplicación normal, casi nunca es necesario interactuar con `import.meta.hot` directamente, salvo en casos avanzados de módulos con estado propio fuera de un framework.

## 4.5 Configurar el Servidor de Desarrollo

```ts
// vite.config.ts
export default defineConfig({
  server: {
    port: 3000,
    open: true,          // Abre el navegador automáticamente al iniciar
    host: true,            // Expone el servidor en la red local, no solo localhost
  },
})
```

```bash
npm run dev -- --port 3000 --open
```

Cualquier opción puede establecerse en el archivo de configuración (persistente) o pasarse como flag de línea de comandos (puntual) — se profundiza en el archivo de configuración completo en el Módulo 6.

## 4.6 Proxy de API Durante Desarrollo

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
```

Un patrón extremadamente común: el frontend corre en Vite (puerto 5173) mientras el backend corre por separado (puerto 4000) — configurar un proxy evita problemas de CORS durante desarrollo, haciendo que las peticiones a `/api/*` desde el frontend se redirijan transparentemente al backend real, como si ambos vivieran en el mismo origen.

## 4.7 Errores que Rompen HMR

```ts
// Un error de sintaxis detiene HMR con un overlay de error EN el navegador
function componenteRoto() {
  return <div>  // JSX sin cerrar, por ejemplo
}
```

Vite muestra errores de compilación directamente como un overlay superpuesto en el navegador (no solo en la terminal) — corregir el error y guardar de nuevo hace que el overlay desaparezca automáticamente y HMR se reanude, sin necesitar recargar manualmente la página.

## 4.8 Cuándo HMR Recurre a una Recarga Completa

```text
Casos donde Vite recarga la página COMPLETA en lugar de HMR selectivo:
- Cambios en vite.config.ts
- Cambios en archivos que el módulo actualizado no sabe cómo aceptar (sin límite HMR claro)
- La primera vez que se edita un archivo tras iniciar el servidor, en ciertos casos límite
```

HMR no es mágico ni universal — ciertos cambios estructurales (especialmente en la configuración misma) requieren reiniciar el estado completo de la aplicación, y Vite recurre automáticamente a una recarga completa del navegador en esos casos, sin necesitar intervención manual.

## 4.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Cambiar el puerto del servidor de desarrollo | `server.port` en `vite.config.ts` |
| Evitar problemas de CORS con un backend separado | `server.proxy` |
| Exponer el servidor en la red local | `server.host: true` |
| Entender por qué HMR es tan rápido | No hay bundle que recalcular; solo se invalida el módulo específico |

## 4.10 Errores Comunes

- **Esperar que HMR funcione igual en código fuera de un componente de framework**: la preservación de estado de HMR depende de que el plugin del framework sepa cómo "aceptar" la actualización de ese módulo específico — módulos JavaScript planos sin ese soporte simplemente disparan una recarga completa.
- **Modificar `vite.config.ts` y esperar que HMR lo recoja sin reiniciar**: los cambios de configuración requieren reiniciar el servidor de desarrollo completo, no solo HMR — Vite lo hace automáticamente en la mayoría de los casos, pero vale la pena saber por qué ocurre esa recarga completa.
- **No revisar el overlay de error en el navegador, solo la terminal**: Vite muestra errores directamente en el navegador con contexto útil (Módulo 4.7) — ignorarlo y buscar solo en la terminal puede hacer perder información relevante mostrada exclusivamente ahí.
