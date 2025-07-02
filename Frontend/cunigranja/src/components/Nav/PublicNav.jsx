"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Loader2, Shield, Settings } from "lucide-react"
import { Sidebar } from "./Sidebar"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"

// Componente LoadingScreen interno
function LoadingScreen({ isLoading }) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-white" />
        <p className="text-lg sm:text-xl font-medium text-white">Cargando...</p>
      </div>
    </div>
  )
}

export function NavPrivada({ children }) {
  const goToHome = () => {
    router.push("/")
  }

  const [isLoading, setIsLoading] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const router = useRouter()

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
  }, []) // Remover pathname de las dependencias

  const handleLogout = () => {
    startLoading()
    logout()
    setTimeout(() => {
      router.push("/user/login")
    }, 300)
  }

  // Obtener la inicial del usuario para el avatar
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U"

  // Añadir un useEffect para actualizar la UI cuando cambie el email
  useEffect(() => {
    // Este efecto se ejecutará cada vez que cambie el email del usuario
    // No necesitamos hacer nada específico aquí, ya que React actualizará
    // automáticamente la UI cuando las props o el estado cambien
  }, [user?.email])

  // Añadir un useEffect para escuchar cambios en localStorage
  useEffect(() => {
    // Función para manejar cambios en el almacenamiento
    const handleStorageChange = () => {
      try {
        // Intentar obtener el usuario actualizado del localStorage
        const updatedUser = JSON.parse(localStorage.getItem("user") || "{}")
        // Si hay un cambio en el email, forzar una actualización de la UI
        if (updatedUser && updatedUser.email && user && updatedUser.email !== user.email) {
          // No podemos modificar directamente el objeto user del contexto,
          // pero podemos forzar una actualización del componente
          setIsLoading(true)
          setTimeout(() => setIsLoading(false), 100)
        }
      } catch (error) {
        console.error("Error al procesar cambios en localStorage:", error)
      }
    }

    // Escuchar el evento storage
    window.addEventListener("storage", handleStorageChange)

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [user])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Pantalla de carga */}
      <LoadingScreen isLoading={isLoading} />

      {/* Sidebar con la función de carga y pathname actual */}
      <Sidebar onNavigate={startLoading} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Encabezado */}
        <header className="bg-black shadow-md flex-shrink-0">
          <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
            {/* Logo - Oculto en móvil para dar espacio al menú */}
            <div className="relative w-32 sm:w-40 h-12 sm:h-16 hidden md:block"></div>

            {/* Espaciador en móvil */}
            <div className="flex-1 md:hidden"></div>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative p-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-300/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Borde brillante */}
                  <div className="absolute inset-0 rounded-full border border-blue-300/50 group-hover:border-blue-200/70 transition-colors duration-300"></div>
                  {/* Contenido del avatar */}
                  <div className="relative flex items-center justify-center w-full h-full">
                    {user ? (
                      <span className="text-white font-bold text-sm sm:text-lg drop-shadow-sm">{userInitial}</span>
                    ) : (
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-white/90 group-hover:text-white transition-colors duration-300" />
                    )}
                  </div>
                  {/* Indicador de admin (efecto de halo) */}
                  {isAdmin() && (
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 opacity-75 blur-sm animate-pulse"></div>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 sm:w-64 bg-black text-white border border-blue-500/70 rounded-lg shadow-lg shadow-blue-500/20 mr-2 sm:mr-0"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-3 sm:p-4 border-b border-blue-900/70">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full relative overflow-hidden flex-shrink-0">
                      {/* Fondo con gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700"></div>
                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-300/30 to-transparent"></div>
                      {/* Borde brillante */}
                      <div className="absolute inset-0 rounded-full border border-blue-300/50"></div>
                      {/* Contenido */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-lg drop-shadow-sm">{userInitial}</span>
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium leading-none text-white truncate">
                        {user?.email || "Usuario"}
                      </p>
                      <div className="mt-1 flex items-center w-fit">
                        <div className="relative px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md overflow-hidden">
                          {/* Fondo con gradiente animado */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 animate-gradient-x"></div>
                          {/* Brillo superior */}
                          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                          {/* Borde brillante */}
                          <div className="absolute inset-0 rounded-md border border-blue-300/30"></div>
                          {/* Contenido */}
                          <div className="relative flex items-center">
                            {/* Icono opcional solo si es Admin */}
                            {isAdmin() && <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 text-white" />}
                            <span className="text-xs font-medium text-white">
                              {isAdmin() ? "Administrador" : "Usuario"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                {/* Panel de Control - Visible para todos los usuarios */}
                <DropdownMenuSeparator className="bg-blue-900/50" />

                {/* Configuración de Usuario - Solo visible para usuarios normales (no administradores) */}
                {!isAdmin() && (
                  <DropdownMenuItem
                    className="p-2 sm:p-3 relative overflow-hidden group/settings"
                    onClick={() => {
                      startLoading()
                      router.push("/Dashboar/settings-user")
                    }}
                  >
                    {/* Fondo con gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 opacity-0 group-hover/settings:opacity-100 transition-opacity duration-300"></div>
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 opacity-0 group-hover/settings:opacity-30 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-transparent to-transparent blur-md"></div>
                    </div>
                    <div className="relative flex items-center z-10">
                      <Settings className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400 group-hover/settings:text-white transition-colors duration-300" />
                      <span className="text-xs sm:text-sm text-blue-100 group-hover/settings:text-white transition-colors duration-300">
                        Configuración de Usuario
                      </span>
                    </div>
                  </DropdownMenuItem>
                )}

                {/* Panel de Administración - Solo visible para administradores */}
                {isAdmin() && (
                  <>
                    <DropdownMenuSeparator className="bg-blue-900/50" />
                    <DropdownMenuItem
                      className="p-2 sm:p-3 relative overflow-hidden group/admin"
                      onClick={() => {
                        startLoading()
                        router.push("/admin")
                      }}
                    >
                      {/* Fondo con gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 opacity-0 group-hover/admin:opacity-100 transition-opacity duration-300"></div>
                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 opacity-0 group-hover/admin:opacity-30 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-transparent to-transparent blur-md"></div>
                      </div>
                      <div className="relative flex items-center z-10">
                        <Shield className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400 group-hover/admin:text-white transition-colors duration-300" />
                        <span className="text-xs sm:text-sm text-blue-100 group-hover/admin:text-white transition-colors duration-300">
                          Panel de Administración
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className="bg-blue-900/50" />

                <DropdownMenuItem className="p-2 sm:p-3 relative overflow-hidden group/logout" onClick={handleLogout}>
                  {/* Fondo animado de olas */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 opacity-0 group-hover/logout:opacity-100 transition-opacity duration-300"></div>
                  {/* Efecto de olas animadas */}
                  <div className="absolute inset-0 opacity-0 group-hover/logout:opacity-30 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent blur-md animate-pulse"></div>
                  </div>
                  <div className="relative flex items-center z-10">
                    <LogOut className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-300 group-hover/logout:text-white transition-colors duration-300" />
                    <span className="text-xs sm:text-sm text-blue-300 group-hover/logout:text-white transition-colors duration-300">
                      Cerrar sesión
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-2 sm:p-3 relative overflow-hidden group/page" onClick={goToHome}>
                  {/* Fondo animado de olas */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 opacity-0 group-hover/page:opacity-100 transition-opacity duration-300"></div>
                  {/* Efecto de olas animadas */}
                  <div className="absolute inset-0 opacity-0 group-hover/page:opacity-30 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent blur-md animate-pulse"></div>
                  </div>
                  {/* Contenido */}
                  <div className="relative flex items-center z-10">
                    <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-300 group-hover/page:text-white transition-colors duration-300" />
                    <span className="text-xs sm:text-sm text-blue-300 group-hover/page:text-white transition-colors duration-300">
                      Inicio
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Área de trabajo */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-white overflow-auto">{children}</main>
      </div>

      {/* Estilos personalizados - Corregido para usar template literal directamente */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 3s ease infinite;
        }
        
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default NavPrivada
