"use client"

import { AuthProvider, useAuth } from "@/context/authContext"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import localFont from "next/font/local"
import "./globals.css"
import Image from "next/image"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

// Componente LoadingScreen con nuevo diseño
function LoadingScreen({ onMinProgressReached }) {
  const [progressValue, setProgressValue] = useState(0)
  const [loadingText, setLoadingText] = useState("Verificando acceso")
  const [isVisible, setIsVisible] = useState(true)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const minProgressReachedRef = useRef(false)

  // Efecto para animar la barra de progreso
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue((prev) => {
        // Notificar cuando alcanzamos el 50% de progreso
        if (prev >= 50 && !minProgressReachedRef.current) {
          minProgressReachedRef.current = true
          // Usar setTimeout para evitar actualizar el estado durante el renderizado
          setTimeout(() => {
            if (onMinProgressReached) {
              onMinProgressReached()
            }
          }, 0)
        }

        if (prev >= 100) {
          clearInterval(interval)
          setLoadingComplete(true)
          return 100
        }
        return prev + 0.5
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onMinProgressReached])

  // Efecto para mantener visible la pantalla durante 3 segundos después de completar la carga
  useEffect(() => {
    if (loadingComplete) {
      const timeout = setTimeout(() => {
        setIsVisible(false)
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [loadingComplete])

  // Efecto para cambiar el mensaje de carga cada cierto tiempo
  useEffect(() => {
    const messages = ["Verificando credenciales", "Cargando recursos", "Preparando dashboard", "Casi listo"]

    let index = 0
    const interval = setInterval(() => {
      setLoadingText(messages[index])
      index = (index + 1) % messages.length
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${5 + (i % 5) * 2}px`,
              height: `${5 + (i % 5) * 2}px`,
              top: `${(i * 5) % 100}%`,
              left: `${(i * 7 + 3) % 100}%`,
              animation: `pulse 5s ease-in-out infinite ${i % 5}s`,
              opacity: 0.2 + (i % 6) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Tarjeta principal con bordes iluminados */}
      <div className="relative max-w-md w-full mx-6">
        {/* Efecto de iluminación exterior */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-300 to-purple-500 rounded-2xl blur opacity-70 animate-pulse"></div>

        {/* Tarjeta blanca con más estilo interior */}
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Decoración de esquina superior */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent -mr-8 -mt-8 rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-transparent -ml-6 -mb-6 rounded-full opacity-40"></div>

          {/* Línea decorativa superior */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-purple-500"></div>

          <div className="p-8 flex flex-col items-center relative">
            {/* Logo con efecto - CORREGIDO PARA NEXT.JS 13+ */}
            <div className="relative w-28 h-28 mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute inset-0 border-2 border-blue-100 rounded-full"></div>
              <div className="relative flex items-center justify-center h-full">
                <Image
                  src="/assets/img/CUNIGRANJA-1.png"
                  alt="CUNIGRANJA Logo"
                  width={90}
                  height={90}
                  className="object-contain drop-shadow-lg"
                  priority={true}
                  sizes="90px"
                />
              </div>
            </div>

            {/* Texto de carga con más estilo */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-1 tracking-tight relative">
              {loadingText}
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </h2>
            <p className="text-gray-500 text-sm mb-8 italic">Preparando su experiencia</p>

            {/* Barra de progreso mejorada */}
            <div className="w-full mb-4 relative">
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
              {/* Etiquetas de progreso */}
              <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                <span>Iniciando</span>
                <span>En proceso</span>
                <span>Completando</span>
              </div>
            </div>

            {/* Mensaje de estado */}
            <div className="text-center text-sm text-gray-600">
              {loadingComplete ? (
                <span className="flex items-center justify-center gap-1 text-green-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Carga completa
                </span>
              ) : (
                <span>Por favor espere un momento...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para las animaciones */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.3; }
          50% { transform: scale(1.5) translate(10px, -10px); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

// Componente interno para verificar autenticación
function AuthCheck({ children }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [minProgressReached, setMinProgressReached] = useState(false)

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    "/",
    "/user/login",
    "/quienes-somos",
    "/contactanos",
    "/documentacion",
    "/unauthorized",
    "/resetpassword",
  ]

  // Rutas públicas que SÍ deben mostrar loading para mejor UX
  const publicRoutesWithLoading = ["/user/login","/user/register", "/user/password"]

  // Rutas que requieren rol de administrador
  const adminRoutes = ["/admin", "/admin/users", "/admin/settings"]

  // Rutas que requieren autenticación (cualquier usuario)
  const protectedRoutes = ["/Dashboar"]

  // Función para manejar cuando se alcanza el progreso mínimo
  const handleMinProgressReached = () => {
    setMinProgressReached(true)
  }

  // Efecto inicial para determinar si debe mostrar la pantalla de carga
  useEffect(() => {
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
    const isPublicWithLoading = publicRoutesWithLoading.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    )
    const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
    const isAdminRoute = adminRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

    // Si es una ruta pública normal (sin loading), no mostrar pantalla de carga
    if (isPublicRoute && !isPublicWithLoading) {
      setIsChecking(false)
      setShowLoadingScreen(false)
      setIsAuthenticated(true)
      return
    }

    // Si es una ruta pública con loading, protegida o de admin, mostrar loading
    if (isPublicWithLoading || isProtectedRoute || isAdminRoute) {
      setShowLoadingScreen(true)
    } else {
      // Para otras rutas no especificadas, permitir acceso sin pantalla de carga
      setIsChecking(false)
      setShowLoadingScreen(false)
      setIsAuthenticated(true)
    }
  }, [pathname])

  // Efecto para manejar la autenticación y redirecciones
  useEffect(() => {
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
    const isPublicWithLoading = publicRoutesWithLoading.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    )
    const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
    const isAdminRoute = adminRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

    // Si es una ruta pública normal, no necesitamos verificar autenticación
    if (isPublicRoute && !isPublicWithLoading) {
      return
    }

    // Para rutas públicas con loading, solo mostrar loading sin verificar autenticación
    if (isPublicWithLoading) {
      // Si no se ha alcanzado el progreso mínimo, esperar
      if (!minProgressReached && showLoadingScreen) {
        return
      }

      // Una vez alcanzado el progreso mínimo, permitir acceso
      setIsAuthenticated(true)
      setShowLoadingScreen(false)
      return
    }

    // Para rutas protegidas, verificar autenticación
    if (isProtectedRoute || isAdminRoute) {
      // Si todavía está cargando, esperar
      if (loading) {
        return
      }

      // Si no se ha alcanzado el progreso mínimo y se está mostrando la pantalla de carga, esperar
      if (!minProgressReached && showLoadingScreen) {
        return
      }

      // Verificación completa - Si no hay usuario, redirigir al login
      if (!user) {
        router.replace("/user/login")
        return
      }

      // Si es ruta de admin y el usuario no es admin, redirigir
      if (isAdminRoute && user?.tipo_user !== "administrador") {
        router.replace("/unauthorized")
        return
      }

      // Si llegamos aquí, el usuario está autenticado y autorizado
      setIsAuthenticated(true)
      setShowLoadingScreen(false)
      return
    }
  }, [pathname, user, loading, router, minProgressReached, showLoadingScreen])

  // Efecto separado para garantizar un tiempo máximo de carga
  useEffect(() => {
    // Si no se está mostrando la pantalla de carga, no hacer nada
    if (!showLoadingScreen) {
      return
    }

    // Establecer un tiempo máximo para mostrar la pantalla de carga (5 segundos)
    const timer = setTimeout(() => {
      setMinProgressReached(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [showLoadingScreen])

  // Mientras se muestra la pantalla de carga, mostrar el componente LoadingScreen
  if (showLoadingScreen) {
    return <LoadingScreen onMinProgressReached={handleMinProgressReached} />
  }

  // Solo mostrar el contenido si está autenticado
  return isAuthenticated ? children : null
}

// Componente principal del layout
export default function ClientLayout({ children }) {
  useEffect(() => {
    document.title = "CUNIGRANJA"
  }, [])

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <title>CUNIGRANJA</title>
        {/* Favicon optimizado - múltiples tamaños */}
        <link rel="icon" href="/assets/img/CUNIGRANJA-1.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/assets/img/CUNIGRANJA-1.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/CUNIGRANJA-1.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/CUNIGRANJA-1.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/CUNIGRANJA-1.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/assets/img/CUNIGRANJA-1.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/assets/img/CUNIGRANJA-1.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/assets/img/CUNIGRANJA-1.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/assets/img/CUNIGRANJA-1.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/assets/img/CUNIGRANJA-1.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/assets/img/CUNIGRANJA-1.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/assets/img/CUNIGRANJA-1.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/assets/img/CUNIGRANJA-1.png" />

        {/* Meta tags adicionales */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="description" content="CUNIGRANJA - Sistema de gestión" />
      </head>
      <body className="min-h-screen font-sans">
        <AuthProvider>
          <AuthCheck>{children}</AuthCheck>
        </AuthProvider>
      </body>
    </html>
  )
}
