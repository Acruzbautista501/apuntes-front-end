# Módulo 1: Fundamentos e Instalación

## 1.1 ¿Qué es Bootstrap 5?
Bootstrap es un **framework CSS** (un marco de trabajo) de código abierto. Imagina que en lugar de construir una casa ladrillo por ladrillo (CSS puro), tienes secciones pre-construidas como paredes, ventanas y puertas que solo necesitas ensamblar y pintar a tu gusto.

* **¿Para qué sirve?** Para crear sitios web **responsivos** (que se adaptan a celulares, tablets y PCs) de forma muy rápida.
* **¿Cómo funciona?** Utiliza un sistema de **clases** predefinidas. En lugar de ir a tu archivo `.css` y escribir `background-color: blue;`, simplemente le pones al elemento la clase `class="bg-primary"`.

## 1.2 Métodos de Instalación
Hay varias formas de incluir Bootstrap en tu proyecto. Para empezar, estas son las dos principales:

### A. Vía CDN (Content Delivery Network) - **La más fácil**
No necesitas descargar nada. Solo copias y pegas unos enlaces en tu HTML. Los archivos se cargan desde los servidores de Google o Bootstrap.

* **Pros:** Es instantáneo y mejora la velocidad de carga si el usuario ya visitó otro sitio que usaba el mismo enlace (caché).
* **Contras:** Si no tienes internet mientras programas, los estilos no se verán.

### B. Descarga Local
Descargas los archivos `.css` y `.js` desde el sitio oficial y los guardas en tu carpeta de proyecto.

* **Pros:** Puedes trabajar sin conexión a internet.
* **Contras:** Aumenta un poco el peso de tu carpeta de proyecto.

## 1.3 La Plantilla Base (HTML5)
Bootstrap requiere que tu HTML tenga una estructura específica para funcionar correctamente, especialmente para que se vea bien en móviles.

Aquí tienes el código esencial que debes tener en tu `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Primer Proyecto con Bootstrap</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

    <h1>¡Hola, Bootstrap!</h1>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

## 1.4 Conceptos Clave de Inicio

### El Meta Tag Viewport
Sin la línea `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, Bootstrap no sabrá cómo ajustar el tamaño de los elementos en una pantalla pequeña. Es como decirle al navegador: *"Usa el ancho real de la pantalla del dispositivo"*.

### Mobile-First
Bootstrap está diseñado bajo la filosofía **Mobile-First**. Esto significa que:
1.  Los estilos base están pensados para pantallas pequeñas.
2.  Mediante "Breakpoints" (puntos de quiebre), añadimos reglas para que el diseño cambie conforme la pantalla se hace más grande (tablet, luego PC).

### Archivos "Minified" (.min)
Verás que los archivos se llaman `bootstrap.min.css`. La palabra **.min** significa que el archivo está comprimido (le quitaron espacios y saltos de línea) para que pese menos y la web cargue más rápido. **No intentes leer el código dentro de un .min, está hecho para la computadora, no para humanos.**

## 1.5 Diferencia entre CSS y JS en Bootstrap
* **bootstrap.min.css:** Controla la apariencia (colores, tamaños, posiciones, botones).
* **bootstrap.bundle.min.js:** Controla la interactividad. Si olvidas este archivo, tus botones de menú (hamburguesa) o las ventanas emergentes (modales) no abrirán al hacer clic.

