
# Módulo 8: TypeScript en Frameworks Modernos

## 8.1 El concepto de Componentes Tipados
En el Front End moderno, un componente es esencialmente una función o clase que recibe datos (**Props**) y devuelve una interfaz. TypeScript asegura que quien use tu componente le pase los datos correctos.

### Tipado de Props (Propiedades)
Es la práctica más importante. Define una `interface` para lo que tu componente espera recibir.

```typescript
interface BotonProps {
  texto: string;
  color: 'primario' | 'peligro';
  deshabilitado?: boolean;
  alHacerClick: () => void;
}
```

## 8.2 Integración en Vue 3 (Composition API)
Vue 3 fue escrito en TypeScript, por lo que su integración es excelente, especialmente con el modo `<script setup lang="ts">`.

### DefineProps y DefineEmits
```vue
<script setup lang="ts">
// Tipando Props con macros
const props = defineProps<{
  titulo: string;
  likes: number;
}>();

// Tipando Emisiones (Eventos hacia el padre)
const emit = defineEmits<{
  (e: 'borrar', id: number): void;
}>();
</script>
```

### Refs y Reactive
```typescript
import { ref } from 'vue';

// Inferencia simple
const contador = ref(0); // ref<number>

// Tipado complejo (para objetos o nulos)
interface Usuario { nombre: string }
const usuarioActivo = ref<Usuario | null>(null);
```

## 8.3 Integración en React
React utiliza tipos específicos para sus elementos y hooks.

### Hooks: useState y useRef
```tsx
import { useState, useRef } from 'react';

// useState con tipos
const [usuarios, setUsuarios] = useState<User[]>([]);

// useRef para elementos del DOM
const inputRef = useRef<HTMLInputElement>(null);

const enfocar = () => {
  inputRef.current?.focus();
};
```

## 8.4 Gestión de Estado Global (Pinia / Redux)
Cuando los datos viajan por toda la aplicación, TypeScript es el "GPS" que evita que te pierdas.

* **Pinia (Vue):** Los estados se tipan automáticamente si inicializas valores.
* **Redux (React):** Requiere definir el tipo `RootState` para saber qué hay en toda la tienda de datos.

```typescript
// Ejemplo en un Store de Pinia
export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as Usuario | null,
    isLoggedIn: false
  }),
  actions: {
    setProfile(data: Usuario) {
      this.profile = data;
    }
  }
});
```

## 8.5 Tipado de Rutas (Vue Router / React Router)
Incluso la navegación puede ser segura. Puedes tipar los parámetros de la URL para que, si una página espera un `id: number`, no intentes navegar con un `id: string`.

```typescript
import { useRoute } from 'vue-router';

const route = useRoute();
const userId = Number(route.params.id); // Casting necesario desde string
```

## 8.6 Variables de Entorno
En Vite, las variables de entorno (como tu `API_KEY`) no tienen tipado por defecto. Puedes extender la interfaz `ImportMeta` para tener autocompletado en `import.meta.env`.

```typescript
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 🏆 Conclusión del Curso
Has pasado de configurar un `tsconfig.json` a dominar interfaces, genéricos, consumo de APIs con Axios y la integración en componentes. 