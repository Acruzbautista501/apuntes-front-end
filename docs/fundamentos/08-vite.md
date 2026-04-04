
# 🛠️ Módulo 8: El Ecosistema de Vite y Despliegue

Vite no es solo un servidor de desarrollo rápido; es una herramienta de construcción (build tool) completa que optimiza tu código para que cargue lo más rápido posible en el navegador del usuario.

## 8.1 Variables de Entorno (`.env`)
En aplicaciones reales, nunca debes escribir datos sensibles (como llaves de API de Firebase o URLs de bases de datos) directamente en el código. Para eso usamos archivos `.env`.

* **Archivo `.env`**: Aquí guardas tus variables.
* **Prefijo `VITE_`**: Para que Vite reconozca una variable y la incluya en tu código, **debe** empezar con este prefijo.

```env
# Archivo .env (en la raíz del proyecto)
VITE_API_URL=https://api.tu-liga-futbol.com
VITE_FIREBASE_KEY=123456789abc
```

Para usarlas en tu código TypeScript:
```typescript
const url = import.meta.env.VITE_API_URL;
console.log(`Conectando a: ${url}`);
```

## 8.2 Manejo de Assets (Imágenes y CSS)
Vite hace que importar archivos no sea un dolor de cabeza. Puedes importar archivos CSS o imágenes directamente en tus archivos `.ts`.

* **CSS Modules**: Si nombras un archivo como `estilos.module.css`, Vite lo tratará como un módulo, evitando que tus clases choquen con las de otros archivos.
* **Imágenes**: Al importar una imagen, Vite te devuelve la URL optimizada.

```typescript
import './style.css'; // Importación global
import logoEscudo from './assets/escudo-equipo.png';

const img = document.createElement('img');
img.src = logoEscudo;
document.body.appendChild(img);
```

## 8.3 Build para Producción
Cuando programas, tu código está lleno de comentarios, espacios y archivos separados para que tú los entiendas. Pero el navegador prefiere un solo archivo gigante y comprimido.

1.  **Comando**: Ejecuta `npm run build`.
2.  **Resultado**: Vite creará una carpeta llamada `dist/` (de *distribution*).
3.  **¿Qué hay en `dist/`?**: Contiene tu HTML, el JavaScript transpilado y minificado, y tus imágenes optimizadas. **Esto es lo único que subes al servidor.**

## 8.4 Despliegue (Hosting)
Hoy en día, desplegar una web con Vite es gratis y automático en plataformas como **Vercel**, **Netlify** o **GitHub Pages**.

### Pasos generales:
1.  Sube tu código a un repositorio en **GitHub**.
2.  Conecta tu cuenta de GitHub con Vercel o Netlify.
3.  Selecciona el repositorio. La plataforma detectará automáticamente que es un proyecto de Vite.
4.  ¡Haz clic en **Deploy** y tendrás una URL pública en segundos!

## 8.5 Introducción a Testing (Vitest)
Aunque es un tema avanzado, es bueno que sepas que Vite tiene un "hermano" llamado **Vitest**. Sirve para escribir pruebas automáticas que verifiquen que tus funciones (como la que calcula los puntos de la tabla) no fallen en el futuro.

```typescript
// Ejemplo de un test simple con Vitest
import { expect, test } from 'vitest';
import { sumarPuntos } from './logica-futbol';

test('debe sumar 3 puntos si el equipo gana', () => {
  expect(sumarPuntos(10, 'victoria')).toBe(13);
});
```

## 🛠️ Ejercicio Final: Checklist de Producción
Para dar por terminado tu curso, asegúrate de que tu proyecto en Vite cumpla con esto:

1.  **Limpia el `main.ts`**: Borra el código de ejemplo de Vite y deja solo tu lógica de fútbol o Pokémon.
2.  **Configura el `index.html`**: Cambia el `<title>` y asegúrate de que el `div#app` sea el correcto.
3.  **Variables de Entorno**: Si usas una API, muévela a un archivo `.env`.
4.  **Prueba el Build**: Ejecuta `npm run build` y luego `npm run preview` para ver cómo se verá tu web antes de subirla.
