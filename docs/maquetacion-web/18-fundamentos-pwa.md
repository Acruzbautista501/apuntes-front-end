# Módulo 18: Fundamentos de Maquetación para PWA

Una *Progressive Web App* (PWA) es un sitio web que puede instalarse como una app, funcionar sin conexión, y comportarse de forma más cercana a una aplicación nativa — sin necesitar una tienda de aplicaciones ni un framework complejo. Este módulo cubre las piezas base que un maquetador implementa, sin entrar en la lógica avanzada de sincronización en segundo plano (fuera del alcance de maquetación pura).

## 18.1 Los Tres Requisitos Mínimos de una PWA

1. **Servida por HTTPS** (requisito de seguridad no negociable para instalar cualquier PWA).
2. **Un Web App Manifest** (`manifest.json`) que describe la app.
3. **Un Service Worker** que habilita funcionalidad offline básica.

## 18.2 El Web App Manifest

```json
{
  "name": "Nombre Completo de la Aplicación",
  "short_name": "MiApp",
  "description": "Descripción breve de la aplicación",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0066cc",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

```html
<link rel="manifest" href="/manifest.json">
```

* `display: "standalone"` hace que la app se abra sin la barra de direcciones del navegador, pareciéndose visualmente a una app nativa.
* `theme_color` colorea la barra de estado del sistema operativo cuando la app está abierta (relacionado con el `<meta name="theme-color">` del Módulo 7).
* `purpose: "maskable"` indica un ícono diseñado para adaptarse a las máscaras de forma que distintos sistemas operativos aplican (círculo, cuadrado redondeado) sin recortar contenido importante del logo.

## 18.3 Múltiples Tamaños de Ícono

| Tamaño | Uso |
| :--- | :--- |
| 192x192 | Ícono mínimo requerido para instalación en Android |
| 512x512 | Pantalla de carga (splash screen) y tiendas de apps |
| 180x180 | `apple-touch-icon` para iOS (Módulo 7) |

## 18.4 El Service Worker — Registro Básico

```javascript
// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
```

```javascript
// sw.js — Un service worker mínimo con caché básico
const CACHE_NAME = 'mi-app-v1'
const ARCHIVOS_A_CACHEAR = ['/', '/estilos.css', '/app.js', '/offline.html']

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_A_CACHEAR))
  )
})

self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respuestaCacheada) => {
      return respuestaCacheada || fetch(evento.request).catch(() => caches.match('/offline.html'))
    })
  )
})
```

Este service worker mínimo cachea los archivos base al instalarse, y sirve la versión cacheada si la petición de red falla (sin conexión) — mostrando una página offline personalizada en lugar del error genérico "sin conexión" del navegador.

## 18.5 Una Página Offline Bien Diseñada

```html
<!-- offline.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Sin conexión</title>
  <link rel="stylesheet" href="/estilos.css">
</head>
<body>
  <main class="pagina-offline">
    <h1>Sin conexión a internet</h1>
    <p>Revisa tu conexión e intenta de nuevo.</p>
    <button onclick="location.reload()">Reintentar</button>
  </main>
</body>
</html>
```

Diseñar explícitamente esta página (en lugar de dejar el error genérico del navegador) es responsabilidad directa de maquetación — comunica la situación con la identidad visual del sitio, en lugar de una pantalla de error fría y desconectada del resto de la experiencia.

## 18.6 Prompt de Instalación Personalizado

```javascript
let promptDiferido

window.addEventListener('beforeinstallprompt', (evento) => {
  evento.preventDefault() // Evita el prompt automático del navegador
  promptDiferido = evento
  document.querySelector('#boton-instalar').hidden = false
})

document.querySelector('#boton-instalar').addEventListener('click', async () => {
  promptDiferido.prompt()
  const resultado = await promptDiferido.userChoice
  console.log('Resultado de instalación:', resultado.outcome)
})
```

Interceptar el evento `beforeinstallprompt` permite mostrar un botón de instalación diseñado con la identidad visual del sitio, en lugar de depender únicamente del prompt genérico del navegador, que muchos usuarios ignoran o ni siquiera notan.

## 18.7 Splash Screen (Pantalla de Carga)

En iOS, la pantalla de carga al abrir la PWA instalada se define con meta tags específicos de Apple (no derivados del manifest estándar).

```html
<link rel="apple-touch-startup-image" href="/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px)">
```

## 18.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Describir la app instalable | `manifest.json` + `<link rel="manifest">` |
| Funcionalidad offline básica | Un service worker con estrategia de caché |
| Una página offline con identidad visual propia | Una página HTML dedicada, servida por el service worker al fallar la red |
| Un botón de instalación personalizado | Interceptar `beforeinstallprompt` |
| Íconos correctos en distintas plataformas | Múltiples tamaños en el manifest + `apple-touch-icon` |

## 18.9 Errores Comunes

- **Registrar un service worker sin ninguna estrategia de caché real**: no aporta ningún beneficio offline si simplemente reenvía toda petición directamente a la red sin cachear nada.
- **No proveer una página offline dedicada**: el usuario ve el error genérico "sin conexión" del navegador, desconectado visualmente de la identidad del sitio.
- **Olvidar HTTPS en el entorno de desarrollo/producción**: los service workers requieren HTTPS (excepto en `localhost` para desarrollo) — sin él, ninguna funcionalidad de PWA está disponible.
