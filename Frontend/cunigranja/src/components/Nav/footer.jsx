import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-3 md:mb-0 flex items-center">
            <Image
              src="/CUNIGRANJA-1.png" // Asegúrate de reemplazar esto con la ruta correcta a tu logo
              alt="Logo de CUNIGRANJA"
              width={40}
              height={40}
              className="mr-2"
            />
            <div>
              <h2 className="text-base font-semibold mb-1 text-white">CUNIGRANJA</h2>
              <p className="text-xs">Creando experiencias web increíbles.</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-3 md:mb-0">
            <h3 className="text-sm font-semibold mb-1 text-white">Enlaces rápidos</h3>
            <ul className="text-xs">
              <li className="mb-1"><Link href="/" className="hover:text-white transition-colors duration-200">Inicio</Link></li>
              <li className="mb-1"><Link href="/quienes-somos" className="hover:text-white transition-colors duration-200">Quienes Somos</Link></li>
              <li className="mb-1"><Link href="/contactanos" className="hover:text-white transition-colors duration-200">Contacto</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-sm font-semibold mb-1 text-white">Síguenos</h3>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
                <Facebook size={16} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
                <Twitter size={16} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
                <Instagram size={16} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
                <Github size={16} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-4 pt-4 text-xs text-center">
          <p>&copy; {new Date().getFullYear()} CUNIGRANJA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

