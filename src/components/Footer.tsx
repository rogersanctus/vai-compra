import { Button } from './Button'
import { Input } from './Input'
import './footer.css'
import { Facebook } from './svgs/Facebook'
import { Instagram } from './svgs/Instagram'
import { Linkedin } from './svgs/Linkedin'
import { Twitter } from './svgs/Twitter'

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
              <li>
                <a href="#" title="" className="hover:text-sky-100">
                  Categoria A
                </a>
              </li>
              <li>
                <a href="#" title="" className="hover:text-sky-100">
                  Categoria K
                </a>
              </li>
              <li>
                <a href="#" title="" className="hover:text-sky-100">
                  Categoria X
                </a>
              </li>
              <li>
                <a href="#" title="" className="hover:text-sky-100">
                  Categoria E
                </a>
              </li>
            </ul>
          </div>
          <div>
            <span className="text-xl uppercase text-white font-bold drop-shadow">
              Ajuda
            </span>
            <ul className="text-sky-300 font-semibold mt-4">
              <li>
                <a
                  href="#"
                  title=""
                  className="hover:text-sky-100 transition-colors"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="hover:text-sky-100 transition-colors"
                >
                  Como navegar
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="hover:text-sky-100 transition-colors"
                >
                  Políticas de Cookies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="hover:text-sky-100 transition-colors"
                >
                  Políticas de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="https://www.procon.df.gov.br/wp-content/uploads/2019/08/Codigo-do-consumidor-FINAL.pdf"
                  title="PDF do Código de defesa do consumidor"
                >
                  Código de defesa do consumidor
                </a>
              </li>
            </ul>
          </div>
          <div>
            <span className="text-xl uppercase text-white font-bold drop-shadow">
              Mídias Sociais
            </span>
            <ul className="text-sky-400 font-semibold mt-5 flex flex-col gap-3">
              <li>
                <a
                  href="#"
                  title="Nosso Instagram"
                  className="flex gap-2 fill-current hover:text-sky-100 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="Nosso Facebook"
                  className="flex gap-2 fill-current hover:text-sky-100 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="Acompanhe nossos Tweets"
                  className="flex gap-2 fill-current hover:text-sky-100 transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="Conheça nossa empresa"
                  className="flex gap-2 fill-current hover:text-sky-100 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                  <span>Linkedin</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
