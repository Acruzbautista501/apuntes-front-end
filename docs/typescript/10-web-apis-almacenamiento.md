# Módulo 10: Web APIs y Almacenamiento

El navegador ofrece una rica colección de APIs nativas (*Web APIs*) para interactuar con el sistema operativo y el hardware del usuario: almacenamiento local, detección de visibilidad en pantalla, el portapapeles y temporizadores. En este módulo aprenderás a utilizarlas con tipado estricto.

---

## 10.1 Almacenamiento Local (`localStorage` / `sessionStorage`)

La API nativa de `localStorage` tiene una limitación fundamental: **solo sabe almacenar cadenas de texto (`string`)**. Al leer con `.getItem()`, su tipo siempre es `string | null`:

```typescript
// La firma nativa de la Web API:
// localStorage.getItem(key: string): string | null;
```

Si intentas parsear directamente con `JSON.parse`, obtienes el tipo inseguro `any`.

### Creación de un Wrapper Genérico Seguro para `localStorage`:

```typescript
export class AlmacenamientoSeguro {
  // Guardar cualquier tipo de dato serializándolo a JSON:
  static setItem<T>(clave: string, valor: T): void {
    try {
      const serializado = JSON.stringify(valor);
      localStorage.setItem(clave, serializado);
    } catch (error) {
      console.error(`Error guardando en localStorage [${clave}]:`, error);
    }
  }

  // Leer un dato recuperando su tipo original:
  static getItem<T>(clave: string, valorPorDefecto: T): T {
    try {
      const item = localStorage.getItem(clave);
      if (item === null) return valorPorDefecto;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Error parseando localStorage [${clave}]. Usando valor por defecto.`);
      return valorPorDefecto;
    }
  }

  static removeItem(clave: string): void {
    localStorage.removeItem(clave);
  }
}

// Ejemplo de uso completamente tipado:
interface AjustesUsuario {
  tema: "claro" | "oscuro";
  sonido: boolean;
}

// Guardar:
AlmacenamientoSeguro.setItem<AjustesUsuario>("config", { tema: "oscuro", sonido: true });

// Leer con valor de respaldo si no existe:
const config = AlmacenamientoSeguro.getItem<AjustesUsuario>("config", { tema: "claro", sonido: false });
console.log(config.tema); // ✅ Autocompletado de AjustesUsuario
```

---

## 10.2 `IntersectionObserver`: Tipado de Scroll Infinito y Lazy Loading

El `IntersectionObserver` permite saber cuándo un elemento del DOM entra o sale del área visible (*viewport*) de la pantalla del usuario.

```typescript
const opciones: IntersectionObserverInit = {
  root: null, // Usa el viewport del navegador
  rootMargin: "0px",
  threshold: 0.5 // Se activa cuando el 50% del elemento es visible
};

// El callback recibe una lista tipada de IntersectionObserverEntry:
const callback: IntersectionObserverCallback = (entradas, observer) => {
  entradas.forEach((entrada: IntersectionObserverEntry) => {
    if (entrada.isIntersecting) {
      const elemento = entrada.target as HTMLImageElement;
      
      // Lazy Loading: Asignamos el src real guardado en data-src
      if (elemento.dataset.src) {
        elemento.src = elemento.dataset.src;
        observer.unobserve(elemento); // Dejamos de observar una vez cargada
      }
    }
  });
};

const observador = new IntersectionObserver(callback, opciones);

// Observamos todas las imágenes diferidas:
document.querySelectorAll<HTMLImageElement>(".lazy-img").forEach(img => {
  observador.observe(img);
});
```

---

## 10.3 Temporizadores: La Diferencia entre Navegador y Node.js

Uno de los errores más comunes de TypeScript al escribir `setTimeout` o `setInterval` es su tipo de retorno:

* En **Node.js**: Devuelve un objeto de clase `NodeJS.Timeout`.
* En el **Navegador**: Devuelve un identificador numérico simple (`number`).

```typescript
// ❌ Si el archivo compila en un entorno que mezcla tipos de Node y DOM:
// let timerId: NodeJS.Timeout; // Fallará en el navegador

// ✅ El estándar profesional para el navegador: Usar tipo 'number':
let debounceTimerId: number | null = null;

function ejecutarDebounce(accion: () => void, retrasoMs: number = 300) {
  if (debounceTimerId !== null) {
    window.clearTimeout(debounceTimerId); // Usar window.clearTimeout explícito
  }

  debounceTimerId = window.setTimeout(() => {
    accion();
    debounceTimerId = null;
  }, retrasoMs);
}
```

---

## 10.4 APIs Modernas: Portapapeles y Geolocalización

TypeScript incluye las definiciones oficiales para interactuar con las capacidades del hardware:

### 1. Copiar al Portapapeles (`Clipboard API`)
```typescript
async function copiarTextoAlPortapapeles(texto: string): Promise<boolean> {
  if (!navigator.clipboard) {
    console.error("El navegador no soporta Clipboard API");
    return false;
  }

  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (error) {
    console.error("Permiso denegado para copiar:", error);
    return false;
  }
}
```

### 2. Geolocalización Tipada
```typescript
function obtenerCoordenadas(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no soportada en este dispositivo"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicion: GeolocationPosition) => resolve(posicion.coords),
      (error: GeolocationPositionError) => reject(error)
    );
  });
}
```

---

## 🛠️ Reto Práctico del Módulo

**Ejercicio: Almacén con Expiración Temporal (Cache TTL en LocalStorage)**

Implementa una función `guardarConExpiracion<T>(clave: string, valor: T, minutosValidos: number): void` y su contraparte `leerConExpiracion<T>(clave: string): T | null` que:
1. Envuelva el dato junto con una marca de tiempo de expiración (`Date.now() + minutos * 60 * 1000`).
2. Al leer el dato, si la fecha actual ha superado la expiración, elimine automáticamente el elemento de `localStorage` con `.removeItem()` y devuelva `null`.
3. Si el dato aún es válido, devuelva el valor original con su tipo genérico `T`.
