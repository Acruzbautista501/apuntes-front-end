# Módulo 29: Proyecto Integrador — Configuración Vite Completa para una Aplicación Real

Has recorrido el camino completo: desde `npm create vite` hasta SSR, plugins propios y despliegue en producción. Este módulo no enseña conceptos nuevos; es un **plano de construcción** para aplicar todo lo anterior en un proyecto coherente y de nivel profesional.

## 29.1 El Encargo

Vas a configurar una aplicación completa con Vite, aplicando cada técnica cubierta en este curso, usando el framework de tu elección (Vue o React, según lo cubierto en los Módulos 12/13):

1. Un proyecto base con TypeScript, alias de rutas y variables de entorno por modo (desarrollo/staging/producción).
2. CSS con un preprocesador y CSS Modules para componentes específicos.
3. Code splitting por ruta, con al menos un componente cargado de forma perezosa.
4. Un plugin propio simple que resuelva una necesidad real del proyecto.
5. Una suite de tests con Vitest, incluyendo al menos un test de componente.
6. Análisis de bundle con `rollup-plugin-visualizer`, con al menos una optimización aplicada como resultado.
7. Un pipeline de CI que verifique tipos, tests y build en cada Pull Request.
8. Despliegue configurado correctamente (incluyendo `base` si aplica al subdirectorio elegido).

## 29.2 Checklist de Requisitos Técnicos

Cada punto remite al módulo donde se explicó la técnica. Autoevalúate antes de dar el proyecto por terminado.

### Fundamentos y Configuración
- [ ] El proyecto usa TypeScript con verificación de tipos separada del servidor de desarrollo (`tsc --noEmit` o `vue-tsc`, Módulo 11).
- [ ] Existen alias de rutas configurados tanto en `vite.config.ts` como sincronizados en `tsconfig.json` (Módulo 10).
- [ ] Las variables de entorno usan el prefijo `VITE_` correctamente, con al menos un modo personalizado además de development/production (Módulo 7).
- [ ] Ningún secreto real está expuesto con el prefijo `VITE_` (Módulo 7.9).

### CSS y Assets
- [ ] Se usa un preprocesador (Sass u otro) para al menos parte de los estilos (Módulo 9).
- [ ] Al menos un componente usa CSS Modules para evitar colisión de nombres de clases (Módulo 9.2).
- [ ] Los assets importados desde el código (no en `public/`) se benefician del hash de contenido automático (Módulo 8).

### Build y Rendimiento
- [ ] Al menos una ruta o componente usa carga perezosa (`import()` dinámico) (Módulo 16).
- [ ] Se ejecutó un análisis de bundle y se aplicó al menos una optimización identificable como resultado (Módulo 18).
- [ ] `base` está configurado correctamente para el destino de despliegue elegido (Módulo 15, 27).

### Extensibilidad
- [ ] Existe al menos un plugin propio, simple pero funcional, resolviendo una necesidad específica del proyecto (Módulo 22).

### Testing y CI/CD
- [ ] Vitest está configurado y comparte la configuración base de Vite, sin duplicación (Módulo 25).
- [ ] Existe al menos un test de componente, además de tests de funciones puras (Módulo 25).
- [ ] El pipeline de CI verifica tipos, ejecuta tests en modo `run` (no watch), y confirma que el build se genera sin errores (Módulo 27).
- [ ] El despliegue incluye una regla de redirección SPA si aplica (Módulo 27.3).

## 29.3 Estructura de Archivos Sugerida

```text
mi-proyecto-vite/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/            # Con al menos una ruta cargada perezosamente
│   ├── styles/
│   │   └── variables.scss
│   ├── plugins-vite/
│   │   └── mi-plugin.ts    # El plugin propio del requisito 4
│   ├── main.ts
│   └── vite-env.d.ts
├── tests/
│   ├── unidad/
│   └── componentes/
├── .env
├── .env.staging
├── .env.production
├── vite.config.ts
├── tsconfig.json
├── .github/workflows/ci.yml
└── package.json
```

## 29.4 Criterios de "Terminado" (Definition of Done)

1. **¿El servidor de desarrollo arranca en menos de un segundo, sin importar cuántas veces se reinicie?**
2. **¿Modificar un componente conserva su estado gracias a HMR, sin recargar la página completa?**
3. **¿El análisis de bundle identificó y resolvió al menos un problema real de tamaño (una dependencia pesada, código duplicado)?**
4. **¿El pipeline de CI falla correctamente si se introduce un error de tipos o un test roto?**
5. **¿El sitio desplegado funciona correctamente al recargar cualquier ruta interna directamente, sin errores 404?**

## 29.5 Siguientes Pasos

Con este proyecto terminado, ya tienes el criterio para:

* Configurar y optimizar cualquier proyecto Vite desde cero, con decisiones informadas sobre cada opción de configuración disponible.
* Diagnosticar problemas de rendimiento de build usando las herramientas de análisis correctas, en lugar de ajustes a ciegas.
* Escribir plugins propios cuando una necesidad específica del proyecto no esté cubierta por el ecosistema existente.
* Evaluar con criterio cuándo un framework meta (Nuxt, Astro) resolvería mejor una necesidad de SSR que una configuración manual.
* Conectar esta configuración con los proyectos de Vue o React de este sitio, aplicando cada optimización de build a esas aplicaciones ya construidas.
