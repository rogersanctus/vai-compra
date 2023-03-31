import { Button } from './Button'
import { Input } from './Input'
import './footer.css'

export function Footer() {
  return (
    <footer className="bg-blue-800 p-0">
      <div className="flex bg-amber-500 px-10 py-4 items-center border-y border-amber-600 shadow">
        <div className="">
          <span className="ml-auto text-white text-lg font-bold">
            Fique por dentro de nossas Ofertas
          </span>
        </div>
        <form className="flex flex-grow ml-6">
          <Input
            type="text"
            name="name"
            placeholder="Qual seu nome?"
            className="flex-grow"
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="E o seu e-mail?"
            className="ml-4 flex-grow"
            required
          />
          <Button type="submit" className="ml-4 px-4 py-2" variant="success">
            Acompanhar
          </Button>
        </form>
      </div>
      <div className="relative px-20 py-8 pb-20">
        <div className="absolute fill-current left-0 top-0 bottom-0 right-0">
          <div className="bg-repeated w-full h-full" />
        </div>
        <div className="relative flex gap-6 justify-around">
          <div>
            <span className="text-xl uppercase text-white font-bold drop-shadow">
              Categorias
            </span>
            <ul className="text-sky-300 font-semibold mt-4">
              <li>Categoria A</li>
              <li>Categoria K</li>
              <li>Categoria X</li>
              <li>Categoria E</li>
            </ul>
          </div>
          <div>
            <span className="text-xl uppercase text-white font-bold drop-shadow">
              Ajuda
            </span>
            <ul className="text-sky-300 font-semibold mt-4">
              <li>Sobre</li>
              <li>Institucional</li>
              <li>Como navegar</li>
            </ul>
          </div>
          <div>
            <span className="text-xl uppercase text-white font-bold drop-shadow">
              Mídias Sociais
            </span>
            <ul className="text-sky-300 font-semibold mt-4">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
