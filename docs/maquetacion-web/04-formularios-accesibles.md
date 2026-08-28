# Módulo 4: Formularios Accesibles y Validación Nativa HTML5

Un formulario es, probablemente, el componente donde más fácilmente se pierde accesibilidad — y donde HTML5 ya resuelve gran parte del trabajo de validación sin necesitar JavaScript. Este módulo cubre ambos aspectos juntos, porque están profundamente relacionados.

## 4.1 `<label>` — Nunca Opcional

```html
<!-- ❌ Un placeholder no es un label; desaparece al escribir y no es anunciado consistentemente -->
<input type="email" placeholder="Correo electrónico">

<!-- ✅ Label asociado explícitamente -->
<label for="campo-correo">Correo electrónico</label>
<input type="email" id="campo-correo" name="correo">
```

El atributo `for` del `<label>` debe coincidir exactamente con el `id` del campo — esta asociación permite que un clic en el texto de la etiqueta enfoque el campo automáticamente, y que un lector de pantalla anuncie el propósito del campo al enfocarlo.

## 4.2 Tipos de Input Semánticos

```html
<input type="email">    <!-- Teclado con @ en móvil, validación básica de formato -->
<input type="tel">       <!-- Teclado numérico en móvil -->
<input type="url">       <!-- Validación de formato de URL -->
<input type="number">    <!-- Teclado numérico, controles de incremento -->
<input type="date">      <!-- Selector de fecha nativo -->
<input type="search">    <!-- Semántica de búsqueda, a veces con botón de limpiar nativo -->
```

Usar el tipo correcto no es solo semántico — cambia directamente el teclado que aparece en dispositivos móviles, mejorando la experiencia sin ningún JavaScript adicional.

## 4.3 Validación Nativa con Atributos HTML5

```html
<form>
  <label for="nombre">Nombre completo</label>
  <input type="text" id="nombre" name="nombre" required minlength="2" maxlength="100">

  <label for="correo">Correo electrónico</label>
  <input type="email" id="correo" name="correo" required>

  <label for="edad">Edad</label>
  <input type="number" id="edad" name="edad" min="18" max="120">

  <label for="telefono">Teléfono</label>
  <input type="tel" id="telefono" name="telefono" pattern="[0-9]{10}" title="Ingresa 10 dígitos sin espacios">

  <button type="submit">Enviar</button>
</form>
```

* `required` impide el envío si el campo está vacío, mostrando un mensaje nativo del navegador.
* `minlength`/`maxlength` validan longitud de texto sin JavaScript.
* `pattern` acepta una expresión regular para validación de formato personalizado; `title` define el mensaje de error mostrado.
* `min`/`max` en campos numéricos y de fecha validan rangos automáticamente.

## 4.4 Personalizar Mensajes de Validación Nativa

```html
<input
  type="email"
  required
  oninvalid="this.setCustomValidity('Por favor ingresa un correo válido')"
  oninput="this.setCustomValidity('')"
>
```

`setCustomValidity` personaliza el mensaje de error nativo del navegador; debe reiniciarse a un string vacío en `oninput`, o el campo permanecerá marcado como inválido incluso después de corregirse.

## 4.5 Pseudo-clases CSS de Estado de Formulario

```css
input:required {
  border-left: 3px solid #cc0000;
}

input:valid {
  border-color: #00aa00;
}

input:invalid:not(:placeholder-shown) {
  border-color: #cc0000; /* Solo se marca inválido después de que el usuario haya escrito algo */
}

input:focus-visible {
  outline: 2px solid #0066cc;
}
```

`:invalid:not(:placeholder-shown)` es un patrón muy usado: evita marcar en rojo un campo vacío que el usuario todavía no ha tocado, mostrando el error solo una vez que empieza a interactuar con él.

## 4.6 Agrupar Campos Relacionados con `<fieldset>`

```html
<fieldset>
  <legend>Método de envío</legend>

  <label>
    <input type="radio" name="envio" value="estandar" checked>
    Estándar (5-7 días)
  </label>

  <label>
    <input type="radio" name="envio" value="express">
    Express (1-2 días)
  </label>
</fieldset>
```

`<fieldset>` + `<legend>` agrupa semánticamente un conjunto de campos relacionados (típicamente radios/checkboxes) — un lector de pantalla anuncia el `<legend>` como contexto antes de cada opción individual del grupo.

## 4.7 Asociar Mensajes de Error con `aria-describedby`

```html
<label for="password">Contraseña</label>
<input
  type="password"
  id="password"
  aria-describedby="ayuda-password"
  aria-invalid="true"
>
<p id="ayuda-password">Debe tener al menos 8 caracteres, una mayúscula y un número.</p>
```

`aria-describedby` conecta el campo con su texto de ayuda/error, para que un lector de pantalla lo anuncie junto con la etiqueta al enfocar el campo — no solo cuando el usuario navega manualmente hasta ese texto.

## 4.8 Botones de Envío Claros

```html
<!-- ❌ Genérico, no comunica qué acción específica ocurre -->
<button type="submit">Enviar</button>

<!-- ✅ Describe la acción real -->
<button type="submit">Crear cuenta</button>
```

## 4.9 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Asociar un texto descriptivo con un campo | `<label for="id-del-campo">` |
| El teclado correcto en móvil según el tipo de dato | `type="email"`, `type="tel"`, `type="number"`, etc. |
| Validación sin JavaScript | `required`, `pattern`, `minlength`/`maxlength`, `min`/`max` |
| Un mensaje de error personalizado | `setCustomValidity()` |
| Agrupar radios/checkboxes relacionados | `<fieldset>` + `<legend>` |
| Conectar un campo con su mensaje de ayuda/error | `aria-describedby` |

## 4.10 Errores Comunes

- **Usar `placeholder` como sustituto de `<label>`**: el placeholder desaparece al escribir, y varios lectores de pantalla no lo anuncian de forma consistente como reemplazo de una etiqueta real.
- **Reinventar la validación con JavaScript cuando HTML5 ya la resuelve**: `required`, `pattern`, `type="email"` cubren la mayoría de casos sin ninguna dependencia adicional — JavaScript debería reservarse para validación que realmente requiere lógica más compleja (confirmar contra una API, comparar dos campos).
- **No probar el formulario navegando solo con teclado**: `Tab`, `Enter`, y las flechas en grupos de radio deben funcionar de forma predecible sin necesitar el mouse.
