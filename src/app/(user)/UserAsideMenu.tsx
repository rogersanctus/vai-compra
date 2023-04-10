export function UserAsideMenu() {
  return (
    <aside className="flex-grow max-w-[200px] py-10 bg-slate-100 border-r border-slate-200 shadow-xl">
      <nav>
        <ul className="">
          <li>
            <a
              href="/user"
              className="w-full px-8 py-2 inline-block hover:bg-slate-200 hover:border-r-2 border-sky-500"
            >
              Minha Conta
            </a>
          </li>
          <li>
            <a
              href="/user/purchases"
              className="w-full px-8 py-2 inline-block hover:bg-slate-200 hover:border-r-2 border-sky-500"
            >
              Compras
            </a>
          </li>
          <li>
            <a
              href="/cart"
              className="w-full px-8 py-2 inline-block hover:bg-slate-200 hover:border-r-2 border-sky-500"
            >
              Carrinho
            </a>
          </li>
          <li>
            <a
              href="/user/settings"
              className="w-full px-8 py-2 inline-block hover:bg-slate-200 hover:border-r-2 border-sky-500"
            >
              Configurações
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
