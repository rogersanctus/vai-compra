import { clientFetch } from '@/lib/clientFetch'
import { useAppSelector } from '@/stores'
import { actions } from '@/stores/actions'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const { authAction } = actions

type Timeout = ReturnType<typeof setTimeout>

export function AuthUserInfo() {
  const [doShowUserMenu, setDoShowUserMenu] = useState(false)
  const doShowUserMenuTimeout = useRef<Timeout | null>(null)
  const isOverMenu = useRef(false)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const user = useAppSelector((state) => state.auth.user)
  const router = useRouter()

  useEffect(() => {
    setDoShowUserMenu(false)
  }, [])

  async function onLogout() {
    try {
      await clientFetch('/api/auth/login', { method: 'DELETE' })

      authAction.reset()
      authAction.clearSession()
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  function onMouseEnterUserMenuTrigger() {
    doShowUserMenuTimeout.current = setTimeout(
      () => setDoShowUserMenu(true),
      350
    )
  }

  function onMouseLeaveUserMenuTrigger() {
    if (doShowUserMenuTimeout.current) {
      clearTimeout(doShowUserMenuTimeout.current)
    }

    setTimeout(() => {
      if (!isOverMenu.current) {
        setDoShowUserMenu(false)
      }
    }, 200)
  }

  function onClickUserMenuTrigger() {
    if (doShowUserMenuTimeout.current) {
      clearTimeout(doShowUserMenuTimeout.current)
    }

    setDoShowUserMenu(!doShowUserMenu)
  }

  function onMouseEnterUserMenu() {
    isOverMenu.current = true
    console.log('is over menu')
  }

  function onMouseLeaveUserMenu() {
    isOverMenu.current = false
    setDoShowUserMenu(false)
    console.log('is out menu')
  }

  if (isLoggedIn) {
    return (
      <>
        <div className="cursor-pointer relative">
          <div
            className="flex flex-col items-center"
            onMouseEnter={onMouseEnterUserMenuTrigger}
            onMouseLeave={onMouseLeaveUserMenuTrigger}
            onClick={onClickUserMenuTrigger}
          >
            <UserCircleIcon
              className="text-white w-8 h-8"
              title={isLoggedIn ? user?.name : ''}
            />
            <div className="inline-flex whitespace-nowrap items-center">
              <span className="text-white text-sm max-w-[6rem] overflow-hidden text-ellipsis">
                {user?.email}
              </span>
              <span>
                <ChevronDownIcon className="w-4 h-4 text-white" />
              </span>
            </div>
          </div>
          <div
            className={`absolute right-0 top-full cursor-default ${
              doShowUserMenu ? '' : 'hidden'
            }`}
          >
            <nav
              className="border border-zinc-300 rounded-sm shadow bg-slate-200 mt-1 py-4 text-slate-500 font-semibold min-w-[200px]"
              onMouseEnter={onMouseEnterUserMenu}
              onMouseLeave={onMouseLeaveUserMenu}
            >
              <ul>
                <li className="whitespace-nowrap">
                  <a
                    href="/user/purchases"
                    rel="nofollow"
                    className="inline-block w-full px-4 py-2 hover:text-slate-600 hover:bg-slate-300"
                  >
                    Minhas compras
                  </a>
                </li>
                <li>
                  <a
                    href="/user/favourites"
                    rel="nofollow"
                    className="inline-block w-full px-4 py-2 hover:text-slate-600 hover:bg-slate-300"
                  >
                    Favoritos
                  </a>
                </li>
                <li>
                  <a
                    role="button"
                    rel="nofollow"
                    onClick={onLogout}
                    className="inline-block w-full px-4 py-2 hover:text-slate-600 hover:bg-slate-300"
                  >
                    Sair
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="whitespace-nowrap text-purple-100 font-semibold text-xs">
      <div className="flex flex-col items-center">
        <UserCircleIcon
          className="text-white w-8 h-8"
          title={isLoggedIn ? user?.name : ''}
        />
      </div>
      <a href="/login" title="Fazer Login" className="mr-1">
        Login
      </a>
      /
      <a href="/signup" title="Cadastrar" className="ml-1">
        Cadastrar
      </a>
    </div>
  )
}
