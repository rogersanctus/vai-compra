'use client'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { actions } from '@/stores/actions'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MIN_PASSWORD_LENGTH } from '../consts'
import { toast } from 'react-toastify'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import {
  UserLoginError,
  getLoginErrorMessage
} from '@/lib/errors/UserLoginError'

const { authAction } = actions

const loginSchema = z.object({
  email: z.string().nonempty('O e-mail é obrigatório').email('E-mail inválido'),
  password: z
    .string()
    .nonempty('Informe sua senha')
    .min(
      MIN_PASSWORD_LENGTH,
      `A senha deve possuir no mínimo ${MIN_PASSWORD_LENGTH}`
    )
})

type LoginSchema = z.infer<typeof loginSchema>

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    reset()
    setIsLoading(false)
  }, [reset])

  const onSubmit: SubmitHandler<LoginSchema> = async (formData) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/auth/login', {
        body: JSON.stringify(formData),
        method: 'POST'
      })

      const loginData = await response.json()

      if ('error' in loginData) {
        if (response.status === 403) {
          throw new UserLoginError(loginData.error)
        }
        throw loginData.error
      }

      if (loginData.loggedIn) {
        authAction.setIsLoggedIn(true)
        authAction.setUser(null)
        router.push('/')
      }
    } catch (error) {
      console.error(error)

      if (error instanceof UserLoginError) {
        const message = getLoginErrorMessage(error.reason)
        toast(message, { position: 'bottom-right', type: 'error' })
      } else {
        toast(
          'Falha ao tentar efetuar o login. Por favor, tente novamente mais tarde.',
          { position: 'bottom-right', type: 'error' }
        )
      }
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
          Fazer Login
        </span>
        <div className="w-full">
          <Input
            type="email"
            placeholder="Seu e-mail"
            {...register('email')}
            hasError={!!errors.email}
          />
          {errors.email && (
            <span className="text-sm text-rose-500 font-semibold">
              {errors.email?.message}
            </span>
          )}
        </div>
        <div className="w-full">
          <Input
            type="password"
            placeholder="Sua senha"
            {...register('password')}
            hasError={!!errors.password}
          />
          {errors.password && (
            <span className="text-sm text-rose-500 font-semibold">
              {errors.password?.message}
            </span>
          )}
        </div>
        <Button
          variant="primary"
          className="flex w-full items-center justify-center gap-2"
          size="lg"
          disabled={isSubmitting || isLoading}
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
          <span>Entrar</span>
        </Button>
      </form>
    </div>
  )
}
