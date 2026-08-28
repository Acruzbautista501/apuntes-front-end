# Módulo 21: Documentación de API con OpenAPI/Swagger

Igual que en el backend Node.js de este sitio, documentar una API con la especificación OpenAPI permite generar documentación interactiva y sirve como contrato explícito entre el backend y cualquier cliente. Este módulo cubre cómo aplicarlo en PHP puro.

## 21.1 Documentar Endpoints con Anotaciones

```bash
composer require --dev zircote/swagger-php
```

```php
<?php
/**
 * @OA\Get(
 *     path="/productos/{id}",
 *     summary="Obtener un producto por su ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Producto encontrado",
 *         @OA\JsonContent(ref="#/components/schemas/Producto")
 *     ),
 *     @OA\Response(response=404, description="Producto no encontrado")
 * )
 */
public function obtener(array $parametros): void
{
    // ...
}
```

`zircote/swagger-php` escanea los comentarios de documentación (`@OA\...`) del código y genera un archivo `openapi.json` a partir de ellos — el equivalente PHP a las anotaciones JSDoc usadas con `swagger-jsdoc` en el backend Node.js de este sitio.

## 21.2 Definir Esquemas Reutilizables

```php
<?php
/**
 * @OA\Schema(
 *     schema="Producto",
 *     required={"id", "nombre", "precio"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="nombre", type="string", example="Teclado mecánico"),
 *     @OA\Property(property="precio", type="number", format="float", example=89.99)
 * )
 */
class Producto
{
    // ...
}
```

Definir el esquema una sola vez y referenciarlo (`#/components/schemas/Producto`) desde múltiples endpoints evita duplicar la misma estructura en cada respuesta documentada.

## 21.3 Generar el Archivo de Especificación

```bash
vendor/bin/openapi src -o public/openapi.json
```

```php
<?php
// public/index.php — servir la especificación como JSON
if ($ruta === '/openapi.json') {
    Response::json(json_decode(file_get_contents(__DIR__ . '/openapi.json')));
    exit;
}
```

## 21.4 Documentación Interactiva con Swagger UI

```php
<?php
// public/docs.php
?>
<!doctype html>
<html>
<head><title>Documentación de la API</title></head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({ url: '/openapi.json', dom_id: '#swagger-ui' });
    </script>
</body>
</html>
```

Con esto, `/docs` sirve una interfaz interactiva donde cualquier consumidor de la API puede explorar y probar cada endpoint directamente desde el navegador — el mismo resultado que `/api-docs` en el backend Express de este sitio.

## 21.5 Autenticación en la Especificación

```php
<?php
/**
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
```

```php
<?php
/**
 * @OA\Get(
 *     path="/pedidos",
 *     security={{"bearerAuth": {}}},
 *     ...
 * )
 */
```

## 21.6 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Documentar un endpoint | Anotaciones `@OA\Get`, `@OA\Post`, etc. sobre el método del controlador |
| Definir un esquema de datos reutilizable | `@OA\Schema` sobre la clase del modelo |
| Generar el archivo de especificación | `vendor/bin/openapi src -o public/openapi.json` |
| Documentación interactiva navegable | Swagger UI apuntando al `openapi.json` generado |
| Documentar que un endpoint requiere autenticación | El atributo `security` referenciando `bearerAuth` (ver 21.5) |

## 21.7 Errores Comunes

- **Dejar que la documentación se desactualice respecto al código real**: al no generarse automáticamente desde el código (a diferencia de anotaciones vinculadas directamente a los métodos), cualquier cambio en un endpoint sin actualizar su anotación produce documentación engañosa.
- **No regenerar `openapi.json` como parte del pipeline de CI/CD** (Módulo 25): permite que la especificación publicada quede desactualizada respecto al código desplegado.
- **Omitir los esquemas de error (`404`, `422`) en la documentación**: una documentación completa debe describir tanto las respuestas exitosas como los errores esperables de cada endpoint.
