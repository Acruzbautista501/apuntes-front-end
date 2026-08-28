# Módulo 16: Automatización del Build de Emails

Los módulos anteriores cubrieron piezas individuales: MJML/Foundation para generar el HTML, un *inliner* para el CSS, herramientas de testing para validar. Este módulo conecta todas esas piezas en un flujo de build automatizado, el mismo tipo de proceso que un maquetador de email profesional ejecuta en cada proyecto real.

## 16.1 Por Qué Automatizar

Sin automatización, cada cambio de diseño implica repetir manualmente: compilar MJML → aplicar CSS inline → verificar comentarios condicionales → subir a la plataforma de testing. Un flujo de build reduce ese proceso a un solo comando, y elimina errores humanos como olvidar un paso.

## 16.2 Estructura de un Proyecto de Build

```text
proyecto-emails/
├── src/
│   ├── plantillas/
│   │   ├── bienvenida.mjml
│   │   ├── confirmacion-pedido.mjml
│   │   └── newsletter.mjml
│   └── partials/
│       ├── header.mjml
│       └── footer.mjml
├── dist/                    # HTML final generado, listo para subir al ESP
├── gulpfile.js               # Orquesta el proceso de build completo
└── package.json
```

## 16.3 Un Flujo de Build con Gulp

```javascript
// gulpfile.js
import gulp from 'gulp'
import mjml from 'gulp-mjml'
import inlineCss from 'gulp-inline-css'

function compilarPlantillas() {
  return gulp.src('src/plantillas/*.mjml')
    .pipe(mjml())                          // MJML → HTML con tablas
    .pipe(inlineCss({ removeStyleTags: false })) // Asegura que todo CSS quede inline
    .pipe(gulp.dest('dist'))
}

function observarCambios() {
  gulp.watch('src/**/*.mjml', compilarPlantillas)
}

export const build = compilarPlantillas
export const dev = gulp.series(compilarPlantillas, observarCambios)
```

```bash
npx gulp build   # Compila una sola vez
npx gulp dev      # Compila y recompila automáticamente al guardar cambios
```

## 16.4 Componentes y Partials Reutilizables

Igual que en desarrollo web, repetir el mismo *header* y *footer* en cada plantilla de email es propenso a errores de sincronización. MJML soporta incluir archivos parciales.

```xml
<!-- src/partials/header.mjml -->
<mj-section background-color="#ffffff" padding="20px">
  <mj-column>
    <mj-image src="https://ejemplo.com/logo.png" width="150px" />
  </mj-column>
</mj-section>
```

```xml
<!-- src/plantillas/bienvenida.mjml -->
<mjml>
  <mj-body>
    <mj-include path="../partials/header.mjml" />

    <mj-section>
      <mj-column>
        <mj-text>Contenido específico de este email</mj-text>
      </mj-column>
    </mj-section>

    <mj-include path="../partials/footer.mjml" />
  </mj-body>
</mjml>
```

## 16.5 Variables de Plantilla con un Motor de Handlebars

Para plantillas que necesitan generarse con distintos datos de ejemplo durante el desarrollo (previo a conectar con el ESP real, Módulo 17), un motor de plantillas como Handlebars permite reutilizar la misma estructura HTML con datos variables.

```handlebars
<mj-text font-size="24px" font-weight="bold">
  Hola, {{ nombre }}
</mj-text>
```

```javascript
import Handlebars from 'handlebars'
import fs from 'fs'

const plantillaCompilada = Handlebars.compile(fs.readFileSync('dist/bienvenida.html', 'utf-8'))
const htmlConDatosDePrueba = plantillaCompilada({ nombre: 'Alex' })

fs.writeFileSync('dist/bienvenida-preview.html', htmlConDatosDePrueba)
```

> Este uso de Handlebars es para **previsualizar** localmente con datos de ejemplo durante el desarrollo — en producción, los mismos marcadores de doble llave se dejan intactos en el HTML final para que el ESP real (Módulo 17) los reemplace con los datos de cada destinatario.

## 16.6 Minificación del HTML Final

```bash
npm install -D html-minifier-terser
```

```javascript
import { minify } from 'html-minifier-terser'

const htmlMinificado = await minify(htmlOriginal, {
  collapseWhitespace: true,
  removeComments: false // Los comentarios condicionales de Outlook (Módulo 9) NUNCA deben eliminarse
})
```

> **Advertencia crítica:** cualquier proceso de minificación debe configurarse explícitamente para **preservar** los comentarios condicionales (`<!--[if mso]>`) — un minificador genérico que elimina "todos los comentarios HTML" por defecto rompe silenciosamente toda la compatibilidad con Outlook lograda en el Módulo 9.

## 16.7 Integración con Control de Versiones

```bash
# .gitignore
node_modules/
dist/
```

La carpeta `dist/` (HTML generado) generalmente se excluye del control de versiones — solo el código fuente (`src/`, archivos MJML/Handlebars) se versiona, y el HTML final se regenera con el build en cada entorno.

## 16.8 Pipeline Completo de Referencia

```text
1. Escribir/editar la plantilla en MJML (src/plantillas/*.mjml)
2. gulp build → compila MJML a HTML + aplica CSS inline
3. Previsualizar con datos de ejemplo (Handlebars local)
4. Subir el HTML de dist/ a Litmus/Email on Acid (Módulo 14)
5. Corregir problemas encontrados, repetir desde el paso 1 si es necesario
6. Subir el HTML final al ESP (Módulo 17)
```

## 16.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Automatizar MJML → HTML con CSS inline | Un pipeline de Gulp (`gulp-mjml` + `gulp-inline-css`) |
| Reutilizar header/footer entre plantillas | `<mj-include path="...">` |
| Previsualizar con datos de ejemplo antes de conectar el ESP real | Un motor de plantillas Handlebars local |
| Reducir el peso del HTML final | Un minificador configurado para preservar comentarios condicionales |

## 16.10 Errores Comunes

- **Minificar sin preservar los comentarios condicionales**: rompe silenciosamente toda la compatibilidad con Outlook lograda en módulos anteriores, sin ningún error visible durante el build.
- **Versionar la carpeta `dist/` generada**: causa conflictos de merge innecesarios en archivos que de todas formas se regeneran automáticamente.
- **No previsualizar con datos de ejemplo antes de subir al ESP**: errores en los marcadores de plantilla (Módulo 15) se detectan mucho más tarde, ya en el propio ESP o, peor, en un envío real.
