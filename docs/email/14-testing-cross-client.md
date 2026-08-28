# Módulo 14: Testing Cross-Client

Todo lo cubierto en los módulos anteriores — tablas, VML, comentarios condicionales, modo oscuro — existe precisamente porque el testing en clientes reales revela inconsistencias que ninguna cantidad de conocimiento teórico puede predecir con certeza al 100%. Este módulo cubre cómo validar un email antes de enviarlo a una audiencia real.

## 14.1 Por Qué Nunca Confiar Solo en el Navegador

Abrir el archivo `.html` del email directamente en Chrome o Firefox **no** predice cómo se verá en Outlook, Gmail o Apple Mail — el navegador no reproduce ninguna de las limitaciones específicas de esos clientes (Módulo 1). Es útil únicamente para una revisión rápida de que el HTML no tiene errores evidentes, nunca como validación final.

## 14.2 Litmus y Email on Acid — Servicios de Testing Dedicados

Ambas son plataformas de pago (con planes de prueba gratuitos limitados) que renderizan tu HTML en decenas de combinaciones reales de cliente/dispositivo/modo de color, sin necesitar cuentas de correo en cada uno.

```text
Flujo típico:
1. Subir el HTML final (ya con CSS inline, Módulo 3) a la plataforma.
2. Esperar las capturas de pantalla generadas por cada cliente configurado.
3. Revisar cada captura: Outlook 2016, Outlook 365, Gmail (web/iOS/Android),
   Apple Mail (macOS/iOS), Yahoo Mail, Samsung Mail...
4. Corregir los problemas encontrados y volver a subir el HTML.
```

Estas plataformas también incluyen un **test de spam** (Módulo 18) y validación de enlaces rotos como parte del mismo flujo.

## 14.3 Clientes Prioritarios Según la Audiencia

No es necesario (ni práctico) probar absolutamente todos los clientes existentes — la estrategia estándar es priorizar según los datos reales de apertura de la audiencia (disponibles en la mayoría de ESPs, Módulo 17).

| Prioridad | Clientes típicamente más usados |
| :--- | :--- |
| Alta (siempre probar) | Gmail (web + apps), Apple Mail (iOS + macOS), Outlook (versión de escritorio más reciente) |
| Media | Outlook.com, Yahoo Mail, Samsung Mail |
| Baja (según audiencia específica) | Clientes corporativos legacy, webmails regionales |

## 14.4 Envíos de Prueba Reales

Además de las capturas automatizadas, enviar el email a una lista de direcciones de prueba propias (una cuenta real de Gmail, Outlook, una app móvil) detecta problemas que las capturas estáticas no siempre revelan: comportamiento de scroll, interacción real con enlaces, y renderizado de animaciones GIF.

## 14.5 Checklist de Validación Antes de Enviar

* [ ] El email se ve correctamente en los clientes prioritarios de la audiencia (14.3).
* [ ] Todos los enlaces apuntan a las URLs correctas (sin `localhost` ni URLs de prueba olvidadas).
* [ ] El *preheader* (Módulo 2) muestra el texto esperado, no contenido residual.
* [ ] Las imágenes tienen `alt` descriptivo y el email tiene sentido con las imágenes bloqueadas (Módulo 6).
* [ ] El modo oscuro no rompe la legibilidad (Módulo 10).
* [ ] El comportamiento responsivo funciona en un dispositivo móvil real, no solo en una vista simulada (Módulo 8).
* [ ] El enlace de "Darse de baja" (*unsubscribe*) está presente y funciona — requerido legalmente en la mayoría de jurisdicciones.
* [ ] El correo pasa un test de spam básico (Módulo 18).

## 14.6 Validación de HTML

```bash
npx html-validate salida-final.html
```

Un HTML mal formado (etiquetas sin cerrar, atributos mal escritos) puede renderizarse "aceptablemente" en el navegador de desarrollo pero fallar de forma impredecible en Outlook, cuyo motor (Word) es mucho menos tolerante a errores de sintaxis que un navegador moderno.

## 14.7 Herramientas Gratuitas Complementarias

* **Mail Tester** (mail-tester.com): envía el email a una dirección generada y devuelve un puntaje de spam junto con recomendaciones específicas.
* **Google Postmaster Tools**: si el volumen de envío es significativo, da visibilidad sobre reputación de dominio directamente desde la perspectiva de Gmail.
* **Extensiones de accesibilidad del navegador** (axe DevTools): aunque el navegador no represente el renderizado final, sigue siendo útil para detectar problemas de accesibilidad (Módulo 13) durante el desarrollo.

## 14.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Ver el email renderizado en decenas de clientes reales | Litmus o Email on Acid |
| Detectar errores de sintaxis HTML antes de enviar | Un validador de HTML |
| Verificar la probabilidad de terminar en spam | Mail Tester o el test de spam integrado de Litmus/EOA |
| Validar interacción real (scroll, GIFs, enlaces) | Un envío de prueba a una cuenta real |

## 14.9 Errores Comunes

- **Confiar solo en la vista previa del navegador**: no representa cómo lo verán los clientes reales de la audiencia — nunca es un sustituto de un testing dedicado.
- **Probar solo en los clientes que el propio maquetador usa**: la audiencia real puede usar clientes completamente distintos — prioriza según datos reales, no preferencia personal.
- **Enviar sin verificar el enlace de baja (*unsubscribe*)**: además del problema de experiencia de usuario, en muchas jurisdicciones es un requisito legal (CAN-SPAM, GDPR) cuya ausencia tiene consecuencias reales.
