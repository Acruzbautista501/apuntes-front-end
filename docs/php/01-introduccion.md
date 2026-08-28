# Módulo 1: Introducción a PHP y Configuración del Entorno

PHP es uno de los lenguajes más usados del mundo para desarrollo backend — potencia una porción enorme de la web (WordPress, gran parte de plataformas de e-commerce, e innumerables APIs en producción) y sigue siendo una opción sólida y madura para construir servicios modernos. Este curso se enfoca en **PHP puro, sin frameworks**: entender a fondo cómo funciona el lenguaje y el modelo HTTP subyacente antes de depender de abstracciones de terceros. Este módulo cubre qué es PHP, cómo configurarlo, y tu primer script.

## 1.1 ¿Qué es PHP?

PHP (*PHP: Hypertext Preprocessor*, un acrónimo recursivo) es un lenguaje de programación **del lado del servidor**, diseñado específicamente para desarrollo web. A diferencia de Node.js (JavaScript ejecutándose en un runtime general), PHP nació exclusivamente para procesar peticiones HTTP y generar respuestas — esa especialización histórica explica muchas de sus características.

```text
Petición HTTP → Servidor web (Nginx/Apache) → PHP procesa la lógica → Respuesta (HTML/JSON) → Cliente
```

## 1.2 PHP Moderno vs la Reputación Antigua

PHP tiene una reputación heredada de código desordenado de los años 2000 (mezcla de HTML y lógica sin estructura) — el PHP moderno (versión 8+, la cubierta en este curso) es un lenguaje completamente distinto: tipado opcional pero robusto, programación orientada a objetos madura, un gestor de dependencias estándar (Composer, Módulo 7), y estándares de interoperabilidad (PSR, Módulo 8) que permiten construir aplicaciones con la misma disciplina arquitectónica que cualquier stack backend moderno, sin necesidad de un framework completo.

## 1.3 Instalación

```bash
# Verificar si ya está instalado
php --version
```

| Sistema | Método de instalación |
| :--- | :--- |
| macOS | `brew install php` |
| Linux (Ubuntu/Debian) | `sudo apt install php` |
| Windows | [XAMPP](https://www.apachefriends.org/) o WSL con Linux |

Se recomienda **PHP 8.2 o superior** — cada versión reciente ha traído mejoras significativas de rendimiento y características de lenguaje (tipado más estricto, propiedades de solo lectura, enums nativos) usadas a lo largo de este curso.

## 1.4 El Servidor de Desarrollo Integrado

```bash
php -S localhost:8000
```

PHP incluye un servidor web de desarrollo integrado — suficiente para aprender y prototipar sin necesitar configurar Apache o Nginx desde el principio. Se retoma su reemplazo por un servidor real en el Módulo 24 (Docker) y 25 (despliegue).

## 1.5 Tu Primer Script

```php
<?php
// hola.php
echo "Hola desde PHP\n";

$nombre = "Mundo";
echo "Hola, $nombre\n"; // La interpolación de variables funciona directamente dentro de strings con comillas dobles
```

```bash
php hola.php
```

`<?php` abre el modo de código PHP — cualquier texto **fuera** de esa etiqueta se trata como HTML plano y se envía directamente sin procesar, un vestigio de cuando PHP se mezclaba libremente con HTML (una práctica que el PHP moderno evita, prefiriendo separar la lógica de la presentación).

## 1.6 PHP en el Navegador (Servidor de Desarrollo)

```php
<?php
// index.php
header('Content-Type: application/json'); // Cabecera HTTP, algo que veremos a fondo en el Módulo 10
echo json_encode(['mensaje' => 'Hola desde una API PHP']);
```

```bash
php -S localhost:8000
curl http://localhost:8000
# {"mensaje":"Hola desde una API PHP"}
```

Un archivo `.php` en la raíz servida se ejecuta automáticamente al recibir una petición HTTP — este es el mecanismo básico (sin ningún framework todavía) sobre el que se construye todo lo demás en este curso.

## 1.7 Herramientas del Entorno

* **Editor**: VS Code con la extensión "PHP Intelephense" (autocompletado, detección de errores).
* **Composer** (Módulo 7): el gestor de paquetes de PHP, equivalente a NPM en el ecosistema Node.js.
* **`php.ini`**: el archivo de configuración global de PHP (límites de memoria, extensiones habilitadas) — normalmente no se toca en desarrollo temprano, pero relevante en despliegue (Módulo 25).

## 1.8 PHP vs Node.js — Diferencias Clave para Quien Ya Conoce Node

| Concepto | Node.js | PHP |
| :--- | :--- | :--- |
| Modelo de ejecución | Un proceso persistente, Event Loop asíncrono | Tradicionalmente, un proceso nuevo por petición (comparte-nada) |
| Estado entre peticiones | Vive en memoria mientras el proceso corre | Se reinicia en cada petición, salvo estado externo (sesión, BD, caché) |
| Enrutamiento de API | Express (ya cubierto en este sitio) | Enrutamiento propio, sin framework (Módulo 11) |
| Gestor de paquetes | NPM | Composer |
| Tipado | TypeScript (opcional, capa externa) | Tipado nativo opcional del propio lenguaje (desde PHP 7) |

El modelo "compartir-nada" (cada petición HTTP es procesada de forma aislada, sin estado compartido en memoria entre peticiones distintas) es la diferencia arquitectónica más importante frente a Node.js — explica por qué PHP nunca sufre fugas de memoria por estado acumulado entre peticiones, pero también por qué patrones como WebSockets persistentes (Módulo 23) requieren herramientas adicionales.

## 1.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Verificar la instalación de PHP | `php --version` |
| Un servidor de desarrollo rápido sin configuración | `php -S localhost:8000` |
| Ejecutar un script directamente | `php archivo.php` |
| Abrir el modo de código PHP en un archivo | `<?php` |

## 1.10 Errores Comunes

- **Usar una versión de PHP anterior a 8**: pierde acceso a características de lenguaje modernas (tipado de propiedades, *match expressions*, enums) usadas en gran parte del PHP idiomático actual.
- **Mezclar HTML y lógica PHP libremente sin estructura**: es la práctica que dio a PHP su reputación histórica — el enfoque moderno separa la lógica de negocio de la presentación, incluso sin un framework de por medio.
- **Olvidar la etiqueta de cierre `?>` en archivos que mezclan HTML** (aunque en archivos PHP puros de una API, se recomienda **omitirla** intencionalmente para evitar espacios en blanco accidentales después de ella que pueden romper las cabeceras HTTP).
