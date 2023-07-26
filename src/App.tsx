import { useForm, useFieldArray } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from './lib/supabase'

const createUserFormSchema = z.object({
  avatar: z.instanceof(FileList)
    .transform(list => list.item(0)!)
    .refine(file => file.size <= 5 * 1024 * 1024, 'Tamanho máximo de 5MB') , 
  name: z
    .string()
    .nonempty('Nome obrigatório')
    .transform(name => {
      return name
        .trim()
        .split(' ')
        .map(word => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('E-mail obrigatório')
    .email('Formato de E-email')
    .toLowerCase()
    .refine(email => {
      return email.endsWith('@gmail.com')
    }, 'E-mail precisa ser do gmail'),
  password: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
  techs: z.array(
    z.object({
      title: z.string().nonempty('Título obrigatório'),
      knowledge: z.coerce.number().min(1).max(100),
    })
  ).min(2, 'Precisa ter no mínimo duas tecnologias')
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors } // Access the validation errors from the formState object
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  })

  const { fields, append} = useFieldArray({
    control,
    name: 'techs'
  })

  function addNewTech() {
    append({ title: '', knowledge: 0 })
   }

  console.log(errors)

  const [output, setOutput] = useState('')

  async function createUsers(data: CreateUserFormData) {
    await supabase.storage.from('forms-react').upload(
      data.avatar.name,
      data.avatar)
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <div className="h-screen bg-zinc-60 flex items-center justify-center">
      <div className="flex h-screen items-center justify-center flex-col">
        <form onSubmit={handleSubmit(createUsers)} className="w-full">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="avatar"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Avatar
            </label>
            <input
              type="file"
              accept='image/*'
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                errors.name ? 'border-red-500' : 'focus:shadow-outline'
              }`}
              {...register('avatar')}
            />
            {errors.avatar && <span>{errors.avatar.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                errors.name ? 'border-red-500' : 'focus:shadow-outline'
              }`}
              {...register('name')}
            />
            {errors.name && <span>{errors.name.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              E-mail
            </label>
            <input
              type="email"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                errors.email ? 'border-red-500' : 'focus:shadow-outline'
              }`}
              {...register('email')}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                errors.password ? 'border-red-500' : 'focus:shadow-outline'
              }`}
              {...register('password')}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <div className="mb-4">
            <label
              htmlFor=""
              className=" text-gray-700 text-sm font-bold mb-2 flex items-center justify-between"
            >
              Tecnologias
              <button className="text-emerald-500 text-xs" onClick={addNewTech}>
                Adicionar
              </button>
            </label>
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <input
                    type="text"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                      errors.password
                        ? 'border-red-500'
                        : 'focus:shadow-outline'
                    }`}
                    {...register(`techs.${index}.title`)}
                  />

                  {errors.techs?.[index]?.title && (
                    <span>{errors.techs?.[index]?.title?.message}</span>
                  )}

                  <input
                    type="number"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                      errors.password
                        ? 'border-red-500'
                        : 'focus:shadow-outline'
                    }`}
                    {...register(`techs.${index}.knowledge`)}
                  />

                  {errors.techs?.[index]?.title && (
                    <span>{errors.techs?.[index]?.knowledge?.message}</span>
                  )}
                </div>
              )
            })}
            {errors.techs && <span>{errors.techs.message}</span>}
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Salvar
            </button>
          </div>
        </form>
        <pre>{output}</pre>
      </div>
    </div>
  )
}

export default App
