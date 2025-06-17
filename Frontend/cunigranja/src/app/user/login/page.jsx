"use client"

import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import PublicNav from "@/components/Nav/PublicNav"
import Footer from "@/components/Nav/footer"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/authContext"
import Link from "next/link"
import axiosInstance from "@/lib/axiosInstance"

function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showStars, setShowStars] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // ✅ Estado para controlar el loading de navegación
  const [isNavigating, setIsNavigating] = useState(false)

  const closeModal = () => {
    setErrorMessage("")
  }

  const closeSuccessModal = () => {
    setSuccessMessage("")
    // ✅ Activar el estado de navegación para mostrar loading
    setIsNavigating(true)

    // ✅ Pequeño delay para que se vea el loading antes de navegar
    setTimeout(() => {
      // Navegar al dashboard - esto activará el loading del layout
      router.push("/Dashboar")
    }, 100)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Si ya está enviando, no hacer nada
    if (isSubmitting) return

    setIsSubmitting(true)

    const formLogin = new FormData(event.currentTarget)
    const email = formLogin.get("email")
    const password = formLogin.get("password")

    const credentials = {
      Email: email,
      Password: password,
    }
    try {
      // Hacer la petición directamente
      const response = await axiosInstance.post("Api/User/Login", credentials)

      if (response.status === 200) {
        // Verificar si el usuario está activo
        try {
          // Buscar el usuario por email para verificar su estado
          const usersResponse = await axiosInstance.get("Api/User/AllUser")
          const users = usersResponse.data

          // Encontrar el usuario actual por su email
          const currentUser = users.find((user) => user.email_user === email)

          // Verificar si el usuario está inactivo
          if (currentUser && (currentUser.blockard === 1 || currentUser.estado === "Inactivo")) {
            setErrorMessage("Tu cuenta está inactiva. Por favor, contacta al administrador.")
            setIsSubmitting(false)
            // Limpiar el token si se había guardado
            localStorage.removeItem("token")
            return
          }

          // Si el usuario está activo, continuar con el proceso de login
          localStorage.setItem("token", response.data.token)

          // Actualizar el estado de autenticación
          await login(credentials)

          // Mostrar mensaje de éxito
          setSuccessMessage("¡Inicio de sesión exitoso! Bienvenido de vuelta.")
          setIsSubmitting(false)
        } catch (userCheckError) {
          console.error("Error al verificar el estado del usuario:", userCheckError)
          setErrorMessage("Error al verificar el estado de tu cuenta. Por favor, intenta nuevamente.")
          setIsSubmitting(false)
        }
      }
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response?.data?.message || "Error al iniciar sesión. Intente nuevamente.")
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (showStars) {
      const timer = setTimeout(() => setShowStars(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [showStars])

  // Add this useEffect to generate stars on the client side only
  useEffect(() => {
    const starContainer = document.getElementById("star-container")
    if (starContainer) {
      // Clear any existing stars
      starContainer.innerHTML = ""

      // Generate 20 stars with random properties
      for (let i = 0; i < 20; i++) {
        const star = document.createElement("div")
        star.className = "absolute rounded-full bg-white"

        // Set random styles
        const width = Math.random() * 8 + 2
        star.style.width = `${width}px`
        star.style.height = `${width}px`
        star.style.top = `${Math.random() * 100}%`
        star.style.left = `${Math.random() * 100}%`
        star.style.animation = `twinkle ${Math.random() * 5 + 2}s infinite alternate`

        starContainer.appendChild(star)
      }
    }
  }, []) // Empty dependency array means this runs once after initial render

  // ✅ Loading Screen Component para navegación
  const NavigationLoadingScreen = () => (
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
            {/* Logo con efecto */}
            <div className="relative w-28 h-28 mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute inset-0 border-2 border-blue-100 rounded-full"></div>
              <div className="relative flex items-center justify-center h-full">
                <img
                  src="/assets/img/CUNIGRANJA-1.png"
                  alt="CUNIGRANJA Logo"
                  className="w-20 h-20 object-contain drop-shadow-lg"
                />
              </div>
            </div>

            {/* Texto de carga con más estilo */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-1 tracking-tight relative">
              Accediendo al Dashboard
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </h2>
            <p className="text-gray-500 text-sm mb-8 italic">Preparando su experiencia</p>

            {/* Barra de progreso animada */}
            <div className="w-full mb-4 relative">
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 rounded-full animate-pulse"
                  style={{ width: "75%" }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                <span>Autenticado</span>
                <span>Cargando...</span>
                <span>Dashboard</span>
              </div>
            </div>

            {/* Mensaje de estado */}
            <div className="text-center text-sm text-gray-600">
              <span className="flex items-center justify-center gap-1 text-green-600 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirigiendo al dashboard...
              </span>
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

  // ✅ Si está navegando, mostrar el loading screen
  if (isNavigating) {
    return <NavigationLoadingScreen />
  }

  return (
    <>
      <PublicNav />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="relative w-full max-w-4xl">
          {/* Efecto de sombra decorativa */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-black/10 shadow-2xl rounded-2xl transform translate-x-2 translate-y-2"></div>

          <Card className="relative w-full flex flex-col md:flex-row overflow-hidden rounded-2xl border-0 shadow-2xl">
            {/* Panel izquierdo con logo y mensaje de bienvenida */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-900 to-blue-900 p-8 flex flex-col justify-center items-center text-white">
              <div className="absolute top-0 left-0 w-full h-full opacity-10" id="star-container">
                {/* Stars will be added via useEffect */}
              </div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStars(true)}
                className="mb-8 cursor-pointer relative w-40 h-40 group"
              >
                <div className="absolute inset-0 rounded-full bg-white/30 backdrop-blur-sm group-hover:bg-white/40 transition-all duration-300 transform group-hover:scale-110"></div>
                <img
                  src="/assets/img/CUNIGRANJA-2.png"
                  alt="Logo"
                  className="w-full h-full object-contain rounded-full p-2 relative z-10 drop-shadow-lg"
                />
              </motion.div>

              <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-md">Bienvenido</h2>
              <p className="text-lg text-gray-100/90 text-center leading-relaxed">
                Nos alegra verte de nuevo. Inicia sesión para acceder a tu cuenta y disfrutar de nuestros servicios.
              </p>
            </div>

            {/* Panel derecho con formulario */}
            <CardContent className="md:w-1/2 p-8 bg-white flex items-center justify-center">
              <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6 p-6 rounded-xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 relative">
                  Iniciar Sesión
                  <span className="block h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-full"></span>
                </h1>

                <div className="mb-4 group">
                  <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="email"
                      id="login"
                      placeholder="ejemplo@correo.com"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="mb-6 group">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 hover:bg-white pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Iniciando sesión...
                      </span>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </button>
                </div>

                <div className="mb-4">
                  <a
                    href="/user/register"
                    className={`block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg text-center transition duration-300 ease-in-out transform hover:-translate-y-1 ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
                  >
                    Crear cuenta nueva
                  </a>
                </div>
                <div className="mb-4">
                  <Link
                    href="/user/password"
                    className={`
      block w-full py-3 px-4
      bg-gray-100 hover:bg-gray-200
      text-black font-semibold
      rounded-lg shadow-lg
      text-center
      transition duration-300 ease-in-out transform
      hover:-translate-y-1
      ${isSubmitting ? "opacity-70 pointer-events-none" : ""}
    `}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de error mejorado */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-center mb-4 text-red-500">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Error</h2>
            <p className="text-center mb-6 text-gray-600">{errorMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}

      {/* Modal de éxito mejorado */}
      {successMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-center mb-4 text-green-500">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">¡Éxito!</h2>
            <p className="text-center mb-6 text-gray-600">{successMessage}</p>
            <button
              onClick={closeSuccessModal}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Continuar al Dashboard
            </button>
          </motion.div>
        </div>
      )}

      {/* Estilos para la animación de estrellas */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      <Footer />
    </>
  )
}

export default LoginPage
