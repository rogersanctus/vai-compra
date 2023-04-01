'use client'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { UserPlusIcon } from '@heroicons/react/20/solid'
import { FormEvent, useEffect, useState } from 'react'

interface SignupError {
  passwordConfirmation?: string
}

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<SignupError>({})

  useEffect(() => {
    setName('')
    setEmail('')
    setBirthdate('')
    setPassword('')
    setPasswordConfirmation('')
  }, [])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()

    if (password !== passwordConfirmation) {
      setError({
        passwordConfirmation:
          'A confirmação da senha não bate com a senha informada'
      })
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          birthdate,
          password
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw data
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex h-full p-8 items-center justify-center">
      <form
        className="flex flex-col gap-4 min-w-[400px] items-center"
        onSubmit={onSubmit}
      >
        <span className="text-4xl text-sky-500 font-semibold drop-shadow-sm mb-4">
          Cadastrar usuário
        </span>
        <Input
          type="text"
          name="name"
          placeholder="Seu nome completo"
          className="w-full"
          onChange={(event) => setName(event?.target.value)}
          value={name}
        />
        <Input
          type="email"
          name="email"
          placeholder="Seu e-mail"
          className="w-full"
          onChange={(event) => setEmail(event?.target.value)}
          value={email}
        />
        <Input
          type="date"
          name="birthdate"
          placeholder="Sua data de nascimento"
          className="w-full"
          onChange={(event) => setBirthdate(event?.target.value)}
          value={birthdate}
        />
        <Input
          type="password"
          name="password"
          placeholder="Sua senha"
          className="w-full"
          onChange={(event) => setPassword(event?.target.value)}
          value={password}
        />
        <Input
          type="password"
          name="passwordConfirmation"
          placeholder="Confirme sua senha"
          className="w-full"
          onChange={(event) => setPasswordConfirmation(event?.target.value)}
          value={passwordConfirmation}
        />
        {error.passwordConfirmation ? (
          <div className="text-rose-500">
            <span>{error.passwordConfirmation}</span>
          </div>
        ) : null}
        <Button
          variant="primary"
          className="flex w-full items-center justify-center gap-2"
          size="lg"
        >
          <UserPlusIcon className="w-6 h-6" />
          <span>Cadastrar</span>
        </Button>
      </form>
    </div>
  )
}
