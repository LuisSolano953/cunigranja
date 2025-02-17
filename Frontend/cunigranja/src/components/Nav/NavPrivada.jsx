import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from "lucide-react"
import { Sidebar } from "./Sidebar"

export function NavPrivada({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Encabezado */}
        <header className="bg-black shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <div className="relative w-40 h-16">
              <Image src="/assets/img/CUNIGRANJA-1.png" alt="Logo de CUNIGRANJA" layout="fill" objectFit="contain" />
            </div>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full group focus:outline-none">
                  <User className="h-10 w-10 text-white group-hover:text-white group-hover:stroke-black stroke-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black text-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Usuario</p>
                    <p className="text-xs leading-none text-gray-400">usuario@ejemplo.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="focus:bg-gray-900 focus:text-white hover:bg-gray-900">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración de cuenta</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-900 focus:text-white hover:bg-gray-900">
                  <LogOut className="mr-2 h-4 w-4" />
                  <a href="/user/login">Cerrar sesión</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Área de trabajo */}
        <main className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold mb-4"></h1>
          {children}
        </main>
        <style jsx global>{`
          .lucide-user {
            transition: all 0.3s ease;
          }
        `}</style>
      </div>
    </div>
  )
}

export default NavPrivada

