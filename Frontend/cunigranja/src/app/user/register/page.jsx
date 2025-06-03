"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axiosInstance"
import PublicNav from "@/components/Nav/PublicNav"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff, Lock, Shield } from "lucide-react"

async function SendData(Body) {
  const response = await axiosInstance.post("Api/User/CreateUser", Body)
  return response
}

function Registrarse() {
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdminSection, setShowAdminSection] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const closeErrorModal = () => {
    setError("")
  }

  const closeSuccessModal = () => {
    setSuccessMessage("")
    router.push("/user/login")
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Si ya está enviando, no hacer nada
    if (isSubmitting) return

    setIsSubmitting(true)
    setError("")

    const form = new FormData(event.currentTarget)
    const name_user = form.get("name_user")
    const email_user = form.get("email_user")
    const password_user = form.get("password_user")
    const inputConfirmar = form.get("inputConfirmar")

    // Determinar el tipo de usuario
    let tipo_user = "usuario" // Por defecto, todos son usuarios normales

    // Si la sección de admin está abierta y se proporcionó la contraseña de admin
    if (showAdminSection && adminPassword) {
      // Contraseña de administrador predefinida
      const ADMIN_PASSWORD = "admin123" // Cambia esto por tu contraseña de administrador real

      if (adminPassword === ADMIN_PASSWORD) {
        tipo_user = "administrador"
      } else {
        setError("La contraseña de administrador es incorrecta")
        setIsSubmitting(false)
        return
      }
    }

    const Body = {
      name_user: name_user,
      email_user: email_user,
      password_user: password_user,
      tipo_user: tipo_user,
      estado: "Activo", // Añadimos el campo estado con valor "Activo" por defecto
      blockard: 0, // También añadimos blockard=0 para asegurar que el usuario esté activo
    }

    if (password_user !== inputConfirmar) {
      setError("La contraseña y la confirmación no coinciden")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Enviando datos:", Body)
      const response = await SendData(Body)
      console.log("Respuesta:", response)
      setSuccessMessage(response.data.message)
    } catch (error) {
      console.log("Error completo:", error)

      // Mostrar detalles del error para depuración
      if (error.response?.data?.errors) {
        console.log("Errores de validación:", error.response.data.errors)
        // Convertir los errores de validación a un mensaje legible
        const validationErrors = Object.entries(error.response.data.errors)
          .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
          .join("; ")
        setError(`Error de validación: ${validationErrors}`)
      } else if (error.response?.data && error.response.data.includes("Unknown column 'ResetToken'")) {
        setError(
          "Error en el servidor: La base de datos necesita ser actualizada. Por favor, contacte al administrador.",
        )
      } else if (error.response?.status === 400) {
        setError(
          "Error en el registro. Por favor, intente nuevamente. Detalles: " +
            (error.response?.data?.title || error.response?.data?.message || "Error 400"),
        )
      } else {
        setError(error.response?.data?.message || "Error en el servidor. Intente más tarde.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PublicNav />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="relative w-full max-w-md">
          {/* Efecto de sombra decorativa */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-black/10 shadow-2xl rounded-2xl transform translate-x-2 translate-y-2"></div>

          <Card className="relative w-full overflow-hidden rounded-2xl border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 relative inline-block">
                  Crear Cuenta
                  <span className="block h-1 w-full bg-blue-600 mt-2 rounded-full"></span>
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="group">
                  <label htmlFor="name_user" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name_user"
                    id="name_user"
                    placeholder="Crear nombre de usuario"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="group">
                  <label htmlFor="email_user" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email_user"
                    id="email_user"
                    placeholder="ejemplo@correo.com"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="group">
                  <label htmlFor="password_user" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password_user"
                      id="password_user"
                      placeholder="Crear contraseña"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 hover:bg-white pr-10"
                      required
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

                <div className="group">
                  <label htmlFor="inputConfirmar" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="inputConfirmar"
                      id="inputConfirmar"
                      placeholder="Confirmar contraseña creada"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 hover:bg-white pr-10"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowAdminSection(!showAdminSection)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    {showAdminSection ? "Ocultar opciones de administrador" : "¿Eres administrador?"}
                  </button>
                </div>

                {showAdminSection && (
                  <div className="p-4 border border-blue-200 rounded-md bg-blue-50/80 backdrop-blur-sm">
                    <div className="flex items-center mb-2">
                      <Lock className="h-4 w-4 text-blue-600 mr-2" />
                      <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                        Contraseña de administrador
                      </label>
                    </div>
                    <input
                      type="password"
                      id="adminPassword"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Ingrese la contraseña de administrador"
                      className="w-full p-3 border-2 border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Si olvidaste la contraseña de administrador, contacta a cunigranja@gmail.com
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Procesando...
                    </span>
                  ) : (
                    "Crear cuenta"
                  )}
                </button>
              </form>

              <div className="mt-6">
                <button
                  onClick={() => router.push("/user/login")}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg text-center transition duration-300 ease-in-out transform hover:-translate-y-1"
                  disabled={isSubmitting}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de error mejorado */}
      {error && (
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
            <p className="text-center mb-6 text-gray-600">{error}</p>
            <button
              onClick={closeErrorModal}
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
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Registro exitoso</h2>
            <p className="text-center mb-6 text-gray-600">{successMessage}</p>
            <button
              onClick={closeSuccessModal}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Ir al Login
            </button>
          </motion.div>
        </div>
      )}

      {/* Estilos para la animación */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default Registrarse
