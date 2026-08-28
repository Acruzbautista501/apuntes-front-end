# Módulo 18: Deliverability Básica para Maquetadores

*Deliverability* (entregabilidad) es la probabilidad de que un email llegue a la bandeja de entrada principal, en lugar de a spam o de rebotar por completo. No es responsabilidad exclusiva del maquetador — depende en gran parte de la reputación del dominio y la configuración de infraestructura — pero el **código HTML** del email sí influye directamente, y evitar ciertos errores comunes está dentro del alcance de quien maqueta.

## 18.1 Lo que el Maquetador No Controla (pero Debe Conocer)

* **SPF, DKIM, DMARC**: registros DNS que autentican que el email realmente proviene del dominio que dice ser remitente — configurados por el equipo de infraestructura/marketing, no por el maquetador, pero su ausencia hunde la entregabilidad sin importar qué tan bien maquetado esté el email.
* **Reputación del dominio/IP de envío**: se construye con el tiempo según tasas de apertura, quejas de spam y rebotes históricos — un factor completamente externo al HTML individual de cualquier email.

## 18.2 Lo que el Maquetador SÍ Controla

### Proporción Texto/Imagen

Un email compuesto casi enteramente de una sola imagen grande (sin texto real en el HTML) es una señal clásica que los filtros de spam penalizan — además del problema de accesibilidad ya visto (Módulo 13), perjudica directamente la entregabilidad.

```html
<!-- ❌ Señal de spam: toda la comunicación vive dentro de una sola imagen -->
<img src="promocion-completa.jpg" alt="Oferta especial" style="width:100%;">

<!-- ✅ Texto real en el HTML, con imágenes de apoyo -->
<h2 style="font-family:Arial, sans-serif;">Oferta especial: 20% de descuento</h2>
<img src="banner-decorativo.jpg" alt="" style="width:100%; display:block;">
<p style="font-family:Arial, sans-serif;">Usa el código PROMO20 en tu próxima compra.</p>
```

### HTML Mal Formado

Etiquetas sin cerrar, atributos rotos o estructura inválida son señales adicionales que los filtros de spam consideran, además de causar directamente los problemas de renderizado vistos en módulos anteriores — un buen HTML no es solo una cuestión de compatibilidad visual.

### Palabras y Patrones que Disparan Filtros

Ciertas palabras ("GRATIS", "URGENTE", exceso de signos de exclamación) y patrones (todo el asunto en mayúsculas, exceso de emojis) siguen siendo señales que algunos filtros consideran, aunque su peso relativo ha disminuido frente a factores de reputación e infraestructura en los filtros modernos más sofisticados.

### Enlaces Rotos o Acortadores No Confiables

```html
<!-- ❌ Acortadores genéricos suelen estar en listas negras por abuso histórico -->
<a href="https://bit.ly/xyz123">Ver oferta</a>

<!-- ✅ Un dominio propio o del ESP, de reputación conocida -->
<a href="https://tienda.ejemplo.com/oferta-verano">Ver oferta</a>
```

### Relación de Peso Total del Email

Emails con imágenes sin comprimir (Módulo 6) o con demasiadas imágenes adjuntas directamente (en lugar de alojadas externamente) tardan más en cargar y son otra señal adicional considerada por algunos filtros.

## 18.3 El Enlace de Baja (*Unsubscribe*) — No Solo Legal, También de Deliverability

Además del requisito legal mencionado en el Módulo 14, un enlace de baja claro y funcional reduce las quejas de "marcar como spam" — cuando un usuario no encuentra fácilmente cómo darse de baja, es mucho más probable que reporte el email como spam directamente, lo cual sí daña seriamente la reputación del remitente a largo plazo.

```html
<tr>
  <td style="padding:20px; text-align:center; font-family:Arial, sans-serif; font-size:12px; color:#999999;">
    <a href="*|UNSUB|*" style="color:#999999;">Darse de baja</a>
    de estos correos en cualquier momento.
  </td>
</tr>
```

> El `href` debe apuntar al marcador de baja específico de tu ESP (Módulo 17) — `*|UNSUB|*` en el ejemplo sigue la sintaxis de Mailchimp; otros ESPs usan su propio marcador o sintaxis de plantilla equivalente.

## 18.4 Test de Spam Antes de Enviar

```text
Flujo recomendado (Módulo 14):
1. Enviar el HTML final a Mail Tester o el test de spam de Litmus/Email on Acid.
2. Revisar el puntaje y las recomendaciones específicas devueltas.
3. Corregir los problemas señalados (proporción texto/imagen, HTML inválido, etc.).
4. Repetir hasta obtener un puntaje aceptable antes del envío real.
```

## 18.5 Checklist de Deliverability para el Maquetador

* [ ] El email tiene texto real, no solo imágenes.
* [ ] El HTML es válido (Módulo 14).
* [ ] Las imágenes están comprimidas y alojadas externamente, no adjuntas.
* [ ] Los enlaces usan dominios de confianza, no acortadores genéricos.
* [ ] El enlace de baja es visible y funciona correctamente.
* [ ] El email pasó un test de spam con un puntaje aceptable.

## 18.6 Tabla de Referencia Rápida

| Factor | Bajo control del maquetador |
| :--- | :--- |
| SPF/DKIM/DMARC | No — infraestructura/equipo de marketing técnico |
| Reputación de dominio/IP | No — se construye con el tiempo, factor externo |
| Proporción texto/imagen | Sí |
| Validez del HTML | Sí |
| Enlaces confiables y funcionales | Sí |
| Enlace de baja visible | Sí |
| Peso total del email | Sí |

## 18.7 Errores Comunes

- **Diseñar un email compuesto casi enteramente de una sola imagen**: perjudica tanto la accesibilidad (Módulo 13) como la entregabilidad, además de no mostrar nada útil mientras las imágenes están bloqueadas (Módulo 6).
- **Usar acortadores de enlaces genéricos**: muchos están en listas negras por abuso histórico de otros remitentes, y esa reputación negativa se hereda al usarlos.
- **Asumir que un buen diseño visual garantiza buena entregabilidad**: son problemas relacionados pero distintos — un email perfectamente maquetado puede seguir terminando en spam por factores de infraestructura fuera del HTML.
