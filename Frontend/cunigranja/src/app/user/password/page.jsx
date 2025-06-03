"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axiosInstance"
import PublicNav from "@/components/Nav/PublicNav"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

function ResetPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
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
    setSubmitting(true)
    setError("")

    try {
      const response = await axiosInstance.post("/Api/User/ResetPassUser", { Email: email })
      console.log("Respuesta del servidor:", response.data)

      if (response.data && response.data.message) {
        setSuccessMessage(response.data.message)
      } else {
        setError("Respuesta inesperada del servidor. Por favor, inténtelo de nuevo.")
      }
    } catch (error) {
      console.error("Error detallado:", error)
      if (error.response) {
        setError(
          error.response.data.message ||
            "Ocurrió un error al restablecer la contraseña. Por favor, inténtelo de nuevo.",
        )
      } else if (error.request) {
        setError("No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo de nuevo.")
      } else {
        setError("Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo.")
      }
    } finally {
      setSubmitting(false)
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
                  Recuperar Contraseña
                  <span className="block h-1 w-full bg-blue-600 mt-2 rounded-full"></span>
                </h2>
                <p className="text-gray-600 mt-2">
                  Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="ejemplo@correo.com"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    "Restablecer Contraseña"
                  )}
                </button>
              </form>

              <div className="mt-6">
                <button
                  onClick={() => router.push("/user/login")}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg text-center transition duration-300 ease-in-out transform hover:-translate-y-1"
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
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Solicitud Enviada</h2>
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

export default ResetPassword
