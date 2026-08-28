# Módulo 11: MJML

Escribir tablas anidadas, comentarios condicionales y VML a mano, módulo tras módulo, es exactamente el tipo de trabajo repetitivo que un framework de maquetación de email puede automatizar. **MJML** (*Mailjet Markup Language*) es el framework open-source más adoptado de la industria: se escribe con etiquetas semánticas simples, y compila automáticamente a HTML de tablas compatible con todos los clientes, incluyendo todos los trucos vistos en los módulos anteriores.

## 11.1 Instalación

```bash
npm install -g mjml
```

```bash
mjml entrada.mjml -o salida.html
```

También existe una extensión oficial de VS Code con vista previa en vivo, y un [editor online](https://mjml.io/try-it-live) para prototipar sin instalar nada.

## 11.2 Estructura Básica de un Archivo MJML

```xml
<mjml>
  <mj-head>
    <mj-title>Newsletter de Bienvenida</mj-title>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="16px" color="#333333" line-height="24px" />
    </mj-attributes>
  </mj-head>

  <mj-body background-color="#f4f4f4">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-text font-size="24px" font-weight="bold">
          Bienvenido
        </mj-text>
        <mj-text>
          Gracias por unirte a nuestra comunidad.
        </mj-text>
        <mj-button background-color="#0066cc" href="https://ejemplo.com">
          Empezar ahora
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

Este código compila a un HTML completo con tablas anidadas, CSS inline, comentarios condicionales para Outlook y botones a prueba de balas — todo lo cubierto en los Módulos 2-9, generado automáticamente.

## 11.3 Los Componentes Principales

| Etiqueta | Equivale a |
| :--- | :--- |
| `<mj-section>` | Una fila de ancho completo (como una fila de tabla del Módulo 5) |
| `<mj-column>` | Una columna dentro de una sección — MJML calcula el ancho automáticamente según cuántas columnas haya |
| `<mj-text>` | Un bloque de texto con tipografía consistente |
| `<mj-image>` | Una imagen responsiva con todos los atributos correctos del Módulo 6 |
| `<mj-button>` | Un botón a prueba de balas equivalente al del Módulo 7, sin escribir VML manualmente |
| `<mj-divider>` | Una línea horizontal separadora |
| `<mj-spacer>` | Un espaciador vertical (equivalente a la fila espaciadora del Módulo 5) |

## 11.4 Layout de Múltiples Columnas

```xml
<mj-section>
  <mj-column width="50%">
    <mj-text>Columna izquierda</mj-text>
  </mj-column>
  <mj-column width="50%">
    <mj-text>Columna derecha</mj-text>
  </mj-column>
</mj-section>
```

MJML apila automáticamente las columnas en una sola columna en pantallas móviles — el equivalente al Módulo 8, sin escribir ninguna media query manualmente.

## 11.5 `<mj-attributes>` — Estilos Globales Reutilizables

```xml
<mj-head>
  <mj-attributes>
    <mj-all font-family="Georgia, serif" />
    <mj-button background-color="#0066cc" border-radius="6px" font-size="16px" />
    <mj-class name="destacado" color="#0066cc" font-weight="bold" />
  </mj-attributes>
</mj-head>

<mj-text mj-class="destacado">Texto destacado reutilizando el estilo global</mj-text>
```

En lugar de repetir los mismos atributos en cada componente, `<mj-attributes>` centraliza los estilos base de todo el documento — el equivalente conceptual a una hoja de estilos compartida.

## 11.6 CSS Personalizado Adicional

Cuando un componente MJML no cubre exactamente lo que necesitas, se puede inyectar CSS adicional directamente.

```xml
<mj-head>
  <mj-style>
    .texto-subrayado { text-decoration: underline; }
  </mj-style>
</mj-head>

<mj-text css-class="texto-subrayado">Este texto está subrayado</mj-text>
```

## 11.7 Componentes Condicionales por Cliente

```xml
<mj-raw>
  <!--[if mso]>
  Contenido específico solo para Outlook
  <![endif]-->
</mj-raw>
```

`<mj-raw>` permite insertar HTML arbitrario (incluyendo comentarios condicionales del Módulo 9) que MJML no procesa ni modifica — útil para casos límite que los componentes estándar no cubren.

## 11.8 Integración en un Flujo de Build

```json
// package.json
{
  "scripts": {
    "build:email": "mjml src/newsletter.mjml -o dist/newsletter.html"
  }
}
```

```javascript
// Uso programático con Node.js
import mjml2html from 'mjml'
import fs from 'fs'

const plantilla = fs.readFileSync('src/newsletter.mjml', 'utf-8')
const resultado = mjml2html(plantilla)

fs.writeFileSync('dist/newsletter.html', resultado.html)
if (resultado.errors.length) console.warn(resultado.errors)
```

## 11.9 MJML vs HTML Manual — Cuándo Usar Cada Uno

| Escenario | Recomendación |
| :--- | :--- |
| Emails de estructura estándar (newsletters, promociones) | MJML — mucho más rápido y menos propenso a errores |
| Diseños muy específicos que los componentes de MJML no cubren bien | HTML manual, o MJML + `<mj-raw>` para las partes específicas |
| Aprender los fundamentos de por qué el email funciona así | HTML manual primero (Módulos 1-10) — entender MJML sin esa base es memorizar sin comprender |
| Un equipo con múltiples maquetadores manteniendo muchas plantillas | MJML — consistencia y mantenibilidad mucho mayores |

## 11.10 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Una fila de ancho completo | `<mj-section>` |
| Una columna dentro de una fila | `<mj-column>` |
| Un botón a prueba de balas sin escribir VML | `<mj-button>` |
| Estilos globales reutilizables | `<mj-attributes>` |
| HTML/comentarios condicionales personalizados | `<mj-raw>` |

## 11.11 Errores Comunes

- **Usar MJML sin entender qué genera por debajo**: dificulta depurar un problema de renderizado específico de un cliente cuando aparece, porque no se reconoce el HTML resultante.
- **Anidar demasiadas `<mj-section>` para lograr un layout muy específico**: a veces un `<mj-raw>` con HTML manual es más simple que forzar la estructura de MJML a un diseño que no encaja naturalmente en su modelo.
- **No revisar `resultado.errors` al compilar programáticamente**: MJML puede generar HTML igualmente, pero con advertencias sobre atributos inválidos o mal ubicados que conviene corregir.
