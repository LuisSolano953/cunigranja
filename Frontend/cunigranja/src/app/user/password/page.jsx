"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axiosInstance"
import PublicNav from "@/components/Nav/PublicNav"
import { Card, CardContent } from "@/components/ui/card"

function ResetPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setSubmitting] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const router = useRouter()

  const closeModal = () => {
    setModalMessage("")
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
        setModalMessage(response.data.message)
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
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNav />
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-gray-200 shadow-lg rounded-lg transform translate-x-2 translate-y-2"></div>
          <Card className="relative w-full shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">Recuperar Contraseña</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Ingrese su email"
                    className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Restablecer Contraseña"}
                </button>
              </form>
              <div className="mt-4 space-y-4">
                <button
                  onClick={() => router.push("/user/login")}
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {modalMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Restablecimiento de Contraseña</h2>
            <p className="text-center mb-6">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Ir al Login
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResetPassword

