'use client'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { UserPlusIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { MIN_PASSWORD_LENGTH } from '../consts'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { clientFetch } from '@/lib/clientFetch'

const signupSchema = z
  .object({
    name: z.string().nonempty('O nome é obrigatório'),
    email: z
      .string()
      .nonempty('O e-mail é obrigatório')
      .email('E-mail inválido'),
    birthdate: z.coerce.date(),
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `A senha deve possuir no mínimo ${MIN_PASSWORD_LENGTH}`
      ),
    passwordConfirmation: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `A senha deve possuir no mínimo ${MIN_PASSWORD_LENGTH}`
      )
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'A confirmação da senha não bate com a senha informada',
    path: ['passwordConfirmation']
  })

type SignupSchema = z.infer<typeof signupSchema>

export default function Signup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema)
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(false)
    reset()
  }, [reset])

  const onSubmit: SubmitHandler<SignupSchema> = async (formData) => {
    try {
      setIsLoading(true)

      const response = await clientFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw data
      }
    } catch (error) {
      toast(
        'Falha ao tentar realizar cadastro. Por favor, tente novamente mais tarde.',
        {
          type: 'error',
          position: 'bottom-right'
        }
      )
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full p-8 items-center justify-center relative">
      <LoadingOverlay isLoading={isLoading} />
      <form
        className="flex flex-col gap-4 min-w-[400px] items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <span className="text-4xl text-sky-500 font-semibold drop-shadow-sm mb-4">
          Cadastrar usuário
        </span>
        <div className="w-full">
          <Input
            type="text"
            placeholder="Seu nome completo"
            hasError={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <span className="text-sm text-rose-500 font-semibold">
              {errors.name?.message}
            </span>
          )}
        </div>
        <div className="w-full">
          <Input
            type="email"
            placeholder="Seu e-mail"
            hasError={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <span className="text-sm text-rose-500 font-semibold">
              {errors.email?.message}
            </span>
          )}
        </div>
        <div className="w-full">
          <Input
            type="date"
            placeholder="Sua data de nascimento"
            hasError={!!errors.birthdate}
            {...register('birthdate')}
          />
          {errors.birthdate && (
            <span className="text-sm text-rose-500 font-semibold">
              {errors.birthdate?.message}
            </span>
          )}
        </div>
        <div className="w-full">
          <Input
            type="password"
            placeholder="Sua senha"
            hasError={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <span className="text-sm text-rose-500 font-semibold">
              {errors.password?.message}
            </span>
          )}
        </div>
        <div className="w-full">
          <Input
            type="password"
            placeholder="Confirme sua senha"
            hasError={!!errors.passwordConfirmation}
            {...register('passwordConfirmation')}
          />
          {errors.passwordConfirmation && (
            <span className="text-sm text-rose-500 font-semibold">
              {errors.passwordConfirmation?.message}
            </span>
          )}
        </div>
        <Button
          variant="primary"
          className="flex w-full items-center justify-center gap-2"
          size="lg"
          disabled={isSubmitting || isLoading}
        >
          <UserPlusIcon className="w-6 h-6" />
          <span>Cadastrar</span>
        </Button>
      </form>
    </div>
  )
}
