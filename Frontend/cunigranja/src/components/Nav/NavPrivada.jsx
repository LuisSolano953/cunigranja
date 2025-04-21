"use client"

import { useState, useEffect } from "react"
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
import { User, Settings, LogOut, Loader2 } from 'lucide-react'
import { Sidebar } from "./Sidebar"

// Componente LoadingScreen interno
function LoadingScreen({ isLoading }) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-16 w-16 animate-spin text-white" />
        <p className="text-xl font-medium text-white">Cargando...</p>
      </div>
    </div>
  )
}

export function NavPrivada({ children }) {
  const [isLoading, setIsLoading] = useState(false)

  // Función para iniciar la carga
  const startLoading = () => setIsLoading(true)
  
  // Función para detener la carga
  const stopLoading = () => setIsLoading(false)

  // Detener la carga cuando el componente se monta (página cargada)
  useEffect(() => {
    // Pequeño retraso para asegurar que la UI se haya renderizado
    const timer = setTimeout(() => {
      stopLoading()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-screen">
      {/* Pantalla de carga */}
      <LoadingScreen isLoading={isLoading} />

      {/* Sidebar con la función de carga */}
      <Sidebar onNavigate={startLoading} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Encabezado */}
        <header className="bg-black shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <div className="relative w-40 h-16">
              
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