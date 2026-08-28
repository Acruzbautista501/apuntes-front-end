# Módulo 20: React Hook Form + Zod

Los formularios controlados del Módulo 5 funcionan bien para casos simples, pero un `useState` por campo (o un objeto grande con `onChange` compartido) se vuelve difícil de mantener en formularios con muchos campos, validación compleja y buen rendimiento. **React Hook Form** (RHF) es la librería estándar para resolver esto, combinada con **Zod** para definir esquemas de validación tipados.

## 20.1 El Problema de los Formularios Controlados a Gran Escala

Cada tecla en un input controlado (Módulo 5) dispara un `setState`, que re-renderiza el componente completo del formulario. En formularios pequeños es imperceptible; en formularios grandes con validación en cada campo, puede volverse notablemente lento.

## 20.2 Instalación

```bash
npm install react-hook-form zod @hookform/resolvers
```

## 20.3 Formulario Básico con `useForm`

```tsx
import { useForm } from 'react-hook-form'

interface DatosLogin {
  correo: string
  password: string
}

function FormularioLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<DatosLogin>()

  function alEnviar(datos: DatosLogin) {
    console.log('Datos válidos:', datos)
  }

  return (
    <form onSubmit={handleSubmit(alEnviar)}>
      <input {...register('correo', { required: 'El correo es obligatorio' })} />
      {errors.correo && <p className="error">{errors.correo.message}</p>}

      <input type="password" {...register('password', { required: 'La contraseña es obligatoria' })} />
      {errors.password && <p className="error">{errors.password.message}</p>}

      <button type="submit">Iniciar sesión</button>
    </form>
  )
}
```

`register('correo', {...})` conecta el input directamente con RHF, que gestiona internamente su valor **sin** provocar un re-render en cada tecla — a diferencia del patrón controlado del Módulo 5, los inputs son "no controlados" por React, pero completamente gestionados por RHF.

## 20.4 Validación con Zod

Zod define el esquema de validación como código TypeScript, y genera automáticamente el tipo de los datos del formulario — evitando mantener la interfaz y las reglas de validación por separado.

```typescript
// schemas/loginSchema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  correo: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres')
})

export type DatosLogin = z.infer<typeof loginSchema> // El tipo se deriva automáticamente del esquema
```

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type DatosLogin } from '../schemas/loginSchema'

function FormularioLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<DatosLogin>({
    resolver: zodResolver(loginSchema)
  })

  function alEnviar(datos: DatosLogin) {
    console.log('Datos válidos:', datos) // TypeScript sabe que "datos" cumple el esquema
  }

  return (
    <form onSubmit={handleSubmit(alEnviar)}>
      <input {...register('correo')} />
      {errors.correo && <p className="error">{errors.correo.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p className="error">{errors.password.message}</p>}

      <button type="submit">Iniciar sesión</button>
    </form>
  )
}
```

`handleSubmit` solo invoca `alEnviar` si el esquema Zod valida correctamente todos los campos — si hay errores, los coloca automáticamente en `errors` sin ejecutar la función de envío.

## 20.5 Esquemas Zod Más Ricos

```typescript
export const registroSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  correo: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmarPassword: z.string(),
  edad: z.number().min(18, 'Debes ser mayor de edad')
}).refine((datos) => datos.password === datos.confirmarPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarPassword'] // El error se asocia a este campo específico
})
```

`.refine()` permite validaciones que dependen de **varios campos a la vez**, algo difícil de expresar con reglas de validación por campo aisladas.

## 20.6 Campos Controlados con `Controller`

Componentes de terceros que no exponen una `ref` compatible con `register` (por ejemplo, un selector de fecha o un componente de una librería de UI) se integran con RHF a través de `Controller`.

```tsx
import { Controller, useForm } from 'react-hook-form'
import SelectorPersonalizado from './SelectorPersonalizado'

function Formulario() {
  const { control, handleSubmit } = useForm<{ pais: string }>()

  return (
    <form onSubmit={handleSubmit((datos) => console.log(datos))}>
      <Controller
        name="pais"
        control={control}
        render={({ field }) => (
          <SelectorPersonalizado valor={field.value} onCambio={field.onChange} />
        )}
      />
    </form>
  )
}
```

## 20.7 Arrays de Campos Dinámicos con `useFieldArray`

Para formularios donde el usuario puede agregar/quitar campos dinámicamente (una lista de teléfonos, líneas de un pedido).

```tsx
import { useForm, useFieldArray } from 'react-hook-form'

interface FormularioPedido {
  items: { producto: string; cantidad: number }[]
}

function FormularioPedido() {
  const { register, control, handleSubmit } = useForm<FormularioPedido>({
    defaultValues: { items: [{ producto: '', cantidad: 1 }] }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  return (
    <form onSubmit={handleSubmit((datos) => console.log(datos))}>
      {fields.map((campo, indice) => (
        <div key={campo.id}>
          <input {...register(`items.${indice}.producto`)} />
          <input type="number" {...register(`items.${indice}.cantidad`, { valueAsNumber: true })} />
          <button type="button" onClick={() => remove(indice)}>Eliminar</button>
        </div>
      ))}

      <button type="button" onClick={() => append({ producto: '', cantidad: 1 })}>
        Agregar línea
      </button>
    </form>
  )
}
```

`campo.id` (generado internamente por RHF) se usa como `key`, no el índice — evita los mismos bugs de reordenamiento vistos en el Módulo 6.

## 20.8 Tabla de Referencia Rápida

| Necesitas... | Usa... |
| :--- | :--- |
| Registrar un input sin re-render en cada tecla | `{...register('nombreCampo')}` |
| Validar el formulario completo con un esquema tipado | `zodResolver(esquema)` en `useForm` |
| Validación que depende de varios campos | `.refine()` en el esquema Zod |
| Integrar un componente de terceros que no acepta `register` | `<Controller name="..." control={control} render={...} />` |
| Un array de campos que el usuario agrega/quita dinámicamente | `useFieldArray` |

## 20.9 Errores Comunes

* **Mezclar formularios controlados (`useState`) con RHF en el mismo formulario sin necesidad**: complica el código; para nuevos formularios, RHF + Zod es preferible desde el inicio.
* **Usar el índice del array como `key` en `useFieldArray`**: usa siempre `campo.id`, generado automáticamente por RHF para mantener la identidad correcta de cada fila.
* **Duplicar la interfaz de TypeScript y el esquema Zod por separado**: usa `z.infer<typeof esquema>` para derivar el tipo directamente del esquema y evitar que ambos se desincronicen.
