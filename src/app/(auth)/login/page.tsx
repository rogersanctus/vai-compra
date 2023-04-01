'use client'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    setEmail('')
    setPassword('')
  }, [])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await fetch('/api/auth/login', {
        body: JSON.stringify({ email, password }),
        method: 'POST'
      })

      const loginData = await response.json()

      if ('error' in loginData) {
        return
      }

      if (loginData.loggedIn) {
        router.push('/')
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
          Fazer Login
        </span>
        <Input
          type="email"
          name="email"
          placeholder="Seu e-mail"
          className="w-full"
          onChange={(event) => setEmail(event?.target.value)}
          value={email}
        />
        <Input
          type="password"
          name="password"
          placeholder="Sua senha"
          className="w-full"
          onChange={(event) => setPassword(event?.target.value)}
          value={password}
        />
        <Button
          variant="primary"
          className="flex w-full items-center justify-center gap-2"
          size="lg"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
          <span>Entrar</span>
        </Button>
      </form>
    </div>
  )
}
