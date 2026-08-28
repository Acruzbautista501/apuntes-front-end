# Módulo 12: Foundation for Emails

**Foundation for Emails** es el segundo framework más relevante del ecosistema, desarrollado por ZURB (los mismos creadores del framework CSS Foundation para web). A diferencia de MJML (Módulo 11), que usa una sintaxis propia tipo XML, Foundation for Emails se basa en **Sass** y una grilla similar a Bootstrap — una opción natural para quien ya viene de maquetación web con frameworks CSS tradicionales.

## 12.1 Instalación

```bash
npm install -g foundation-cli
foundation new --template email
cd nombre-del-proyecto
npm start
```

El comando `npm start` inicia un servidor de desarrollo con recarga en vivo, y compila automáticamente los estilos Sass e inserta el CSS inline al generar el HTML final.

## 12.2 Estructura del Proyecto

```text
proyecto-email/
├── src/
│   ├── pages/
│   │   └── index.html        # Plantilla de email
│   ├── layouts/
│   │   └── default.html      # Layout base compartido
│   ├── partials/              # Componentes reutilizables
│   ├── assets/
│   │   └── scss/
│   │       ├── app.scss       # Punto de entrada de Sass
│   │       └── _settings.scss # Variables de personalización
│   └── data/                  # Datos de ejemplo para desarrollo
├── config.yml
└── gulpfile.js
```

## 12.3 El Sistema de Grid

```html
<container>
  <row>
    <columns large="6" small="12">
      Columna izquierda
    </columns>
    <columns large="6" small="12">
      Columna derecha
    </columns>
  </row>
</container>
```

* `<container>`, `<row>` y `<columns>` son **componentes personalizados** que Foundation for Emails transpila a la estructura de tablas compatible con Outlook — la misma idea de MJML, pero con nombres inspirados directamente en el grid de Bootstrap/Foundation web.
* `large="6"` define el ancho en pantallas grandes (sobre 12 columnas totales, igual que Bootstrap); `small="12"` define el comportamiento en móvil — en este caso, apilar la columna a ancho completo.

## 12.4 Botones

```html
<button href="https://ejemplo.com/comprar" bgcolor="#0066cc">
  Comprar ahora
</button>
```

Genera automáticamente la técnica de botón a prueba de balas equivalente al Módulo 7 (incluyendo la alternativa VML para Outlook), sin necesitar escribirla manualmente.

## 12.5 Personalización con Variables Sass

```scss
// _settings.scss
$primary-color: #0066cc;
$body-background: #f4f4f4;
$global-font-family: Arial, Helvetica, sans-serif;
$global-font-color: #333333;

$button-radius: 6px;
$button-padding: 14px 28px 14px 28px;
```

Este enfoque será familiar a cualquiera que ya haya personalizado Bootstrap con Sass (ver la sección de Bootstrap 5 de este sitio) — el mismo patrón de variables centralizadas que generan el CSS final del framework.

## 12.6 Componentes Adicionales

```html
<callout class="primary">
  Un bloque de contenido destacado con fondo y borde predefinidos.
</callout>

<spacer size="20"></spacer>

<hr>
```

`<callout>`, `<spacer>` y otros componentes cubren patrones visuales comunes (cajas de aviso, espaciadores) sin tener que reconstruir manualmente las tablas espaciadoras del Módulo 5.

## 12.7 Inliner Integrado

Foundation for Emails incluye Juice (el mismo *inliner* mencionado en el Módulo 3) como parte de su proceso de build — el Sass/HTML que se escribe durante el desarrollo se convierte automáticamente a CSS inline en el HTML final, sin configuración adicional.

```bash
npm run build
# Genera dist/index.html con CSS ya inline, listo para enviar
```

## 12.8 MJML vs Foundation for Emails

| Criterio | MJML | Foundation for Emails |
| :--- | :--- | :--- |
| Sintaxis | Etiquetas propias tipo XML (`<mj-section>`) | HTML con componentes personalizados + Sass |
| Curva de aprendizaje | Baja, muy documentada | Media, requiere familiaridad con Sass |
| Personalización visual | Vía atributos por componente | Vía variables Sass, más flexible para sistemas de diseño grandes |
| Popularidad y comunidad | Mayor adopción actual en la industria | Sólida pero más reducida |
| Familiar para quien viene de... | Ningún framework en particular | Bootstrap/Foundation web (mismo patrón de grid y Sass) |

## 12.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Un layout de columnas responsivo | `<row>` + `<columns large="N" small="M">` |
| Un botón a prueba de balas | `<button href="..." bgcolor="...">` |
| Personalizar colores/tipografía globalmente | Variables en `_settings.scss` |
| Compilar a HTML final con CSS inline | `npm run build` |

## 12.10 Errores Comunes

- **Mezclar HTML de tablas manual con los componentes de Foundation sin entender qué generan**: puede romper la estructura de grid interna que el framework espera.
- **Modificar el CSS compilado directamente en lugar de las variables Sass**: los cambios se pierden en el siguiente build; toda personalización debe hacerse en `_settings.scss` o los parciales de Sass correspondientes.
- **Elegir Foundation for Emails solo por familiaridad con Bootstrap sin evaluar las necesidades reales del proyecto**: si el equipo no tiene experiencia con Sass, MJML suele tener una curva de aprendizaje más suave.
