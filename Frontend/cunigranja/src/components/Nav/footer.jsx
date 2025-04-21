import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-3 md:mb-0 flex items-center">
            <div className="w-24 h-24 relative mr-2">
              <Image src="/assets/img/CUNIGRANJA-1.png" alt="Logo de CUNIGRANJA" layout="fill" objectFit="contain" />
            </div>
            <div>
             
              <p className="text-xs font-bold">Creando experiencias web increíbles.</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-3 md:mb-0">
            <h3 className="text-sm font-bold mb-1 text-white">Enlaces rápidos</h3>
            <ul className="text-xs">
              <li className="mb-1">
                <Link href="/" className="hover:text-white transition-colors duration-200 font-bold">
                  Inicio
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/quienes-somos" className="hover:text-white transition-colors duration-200 font-bold">
                  Quienes Somos
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/contactanos" className="hover:text-white transition-colors duration-200 font-bold">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h2 className="text-sm font-bold mb-1 text-white">Síguenos</h2>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-4 pt-3 text-xs text-center">
          <p className="font-bold">&copy; {new Date().getFullYear()} CUNIGRANJA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

