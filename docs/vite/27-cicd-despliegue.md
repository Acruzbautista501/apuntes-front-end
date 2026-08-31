# Módulo 27: CI/CD y Despliegue de Proyectos Vite

Con el proyecto ya desarrollado y optimizado, este módulo cubre cómo automatizar su verificación y despliegue — desde un pipeline de CI básico hasta las particularidades de las plataformas de hosting más comunes para proyectos Vite.

## 27.1 Pipeline de CI Básico con GitHub Actions

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run typecheck
      - run: npx vitest run
      - run: npm run build
```

Un pipeline mínimo pero completo: instalar dependencias de forma reproducible (`npm ci`, no `npm install`), verificar tipos (Módulo 11.3), correr tests en modo de ejecución única (`vitest run`, Módulo 25.8), y finalmente confirmar que el build de producción se genera sin errores.

## 27.2 Cachear la Caché de Pre-Bundling en CI

```yaml
      - uses: actions/cache@v4
        with:
          path: node_modules/.vite
          key: vite-${{ hashFiles('package-lock.json') }}
```

Cachear `node_modules/.vite` (la caché de pre-bundling del Módulo 5.6) entre ejecuciones de CI puede acelerar builds subsecuentes, aunque el impacto real varía según el proyecto — vale la pena medir si aporta una mejora significativa antes de mantenerlo como parte permanente del pipeline.

## 27.3 Desplegar en Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

La regla de redirección es esencial para SPAs (Módulo 19.6): sin ella, recargar la página en una ruta interna de una SPA (como `/perfil`) produce un 404, porque el servidor no tiene ningún archivo real en esa ruta — solo `index.html` gestiona esas rutas internamente vía JavaScript.

## 27.4 Desplegar en Vercel

```json
// vercel.json (frecuentemente ni siquiera necesario; Vercel detecta proyectos Vite automáticamente)
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Vercel reconoce automáticamente proyectos Vite (mediante la presencia de `vite.config.ts`) y configura el comando de build y directorio de salida correctos sin intervención manual en la mayoría de los casos.

## 27.5 Desplegar en GitHub Pages

```ts
// vite.config.ts
export default defineConfig({
  base: '/nombre-del-repositorio/', // Repaso del Módulo 15.3, crítico aquí
})
```

```yaml
- run: npm run build
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

GitHub Pages sirve el sitio desde un subdirectorio (`usuario.github.io/repositorio/`), no desde la raíz del dominio — como se cubrió en el Módulo 15.3, olvidar configurar `base` correctamente aquí es la causa más común de un despliegue con todos los assets rotos.

## 27.6 Variables de Entorno en el Pipeline de CI/Despliegue

```yaml
- run: npm run build
  env:
    VITE_API_URL: ${{ secrets.API_URL_PRODUCCION }}
```

Las variables `VITE_*` (Módulo 7.2) deben estar disponibles en el entorno **durante el build**, no en tiempo de ejecución del servidor — a diferencia de un backend Node.js tradicional, un build de Vite "hornea" esos valores directamente en los archivos estáticos generados; cambiar una variable de entorno en el servidor de hosting después del build no tiene ningún efecto sin reconstruir.

## 27.7 Previsualizaciones de Pull Request

```text
Netlify/Vercel: cada Pull Request obtiene automáticamente una URL de previsualización única,
                  con su propio build desplegado temporalmente
```

Una funcionalidad extremadamente valiosa de plataformas modernas de hosting: cada PR se despliega automáticamente en una URL aislada, permitiendo revisar visualmente los cambios de una funcionalidad antes de fusionarla (retomando el proceso de revisión de código del curso de Git de este sitio) sin necesitar desplegarlo manualmente.

## 27.8 Health Check Post-Despliegue

```yaml
- run: npm run build
- run: npx vite preview --port 4173 &
- run: npx wait-on http://localhost:4173
- run: curl -f http://localhost:4173 || exit 1
```

Verificar que el build de producción realmente sirve contenido correcto (más allá de solo "el build no falló") antes de considerarlo listo para desplegar — un paso opcional pero valioso en pipelines con requisitos de fiabilidad más altos.

## 27.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Verificar el proyecto automáticamente en cada PR | Un pipeline de CI con typecheck, tests y build |
| Evitar 404 en rutas internas de una SPA desplegada | Una regla de redirección/rewrite hacia `index.html` |
| Desplegar en un subdirectorio (GitHub Pages) | Configurar `base` correctamente antes del build |
| Variables que dependen del entorno de despliegue | `VITE_*` disponibles durante el paso de build, no después |

## 27.10 Errores Comunes

- **Olvidar la regla de redirección SPA en el hosting elegido**: produce errores 404 al recargar cualquier ruta interna distinta de la raíz, aunque la navegación normal dentro de la app (sin recargar) funcione perfectamente.
- **Cambiar una variable de entorno en la plataforma de hosting sin volver a desplegar**: como el valor ya quedó "horneado" en los archivos estáticos del build anterior, el cambio no tiene ningún efecto hasta que se genere un nuevo build.
- **No configurar `base` al desplegar en un subdirectorio, incluso tras haberlo hecho funcionar en desarrollo local**: en desarrollo, la aplicación normalmente corre desde la raíz (`localhost:5173/`) — el problema de rutas rotas solo se manifiesta al desplegar en un subdirectorio real, si `base` no se configuró de antemano.
