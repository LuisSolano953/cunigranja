"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axiosInstance from "@/lib/axiosInstance"
import { KeyRound, Eye, EyeOff, ShieldCheck, Lock, AlertCircle, Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [tokenValidated, setTokenValidated] = useState(false)
  const [loadingToken, setLoadingToken] = useState(true)

  const closeModal = () => {
    setErrorMessage("")
  }

  useEffect(() => {
    if (!token) {
      setErrorMessage("Token inválido o no proporcionado.")
      setLoadingToken(false)
      return
    }

    const validateToken = async () => {
      try {
        console.log("Validando token:", token)
        const response = await axiosInstance.post("Api/User/ValidateToken", { Token: token })

        if (response.status === 200) {
          console.log("Token validado correctamente:", response.data)
          setTokenValidated(true)
        } else {
          setErrorMessage("Token expirado o inválido.")
        }
      } catch (error) {
        console.error("Error validando token:", error)

        // Mensaje de error más descriptivo
        if (error.code === "ERR_NETWORK") {
          setErrorMessage("No se pudo conectar con el servidor. Verifica que la API esté en ejecución y accesible.")
        } else if (error.response) {
          setErrorMessage(error.response.data?.message || `Error del servidor: ${error.response.status}`)
        } else {
          setErrorMessage("Error al validar el token. Verifica la conexión con el servidor.")
        }
      } finally {
        setLoadingToken(false)
      }
    }

    validateToken()
  }, [token])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage("") // Limpiar errores anteriores

    if (!password || !confirmPassword) {
      setErrorMessage("Por favor, complete todos los campos.")
      setSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.")
      setSubmitting(false)
      return
    }

    try {
      console.log("Enviando solicitud de restablecimiento de contraseña")
      const response = await axiosInstance.post("Api/User/ResetPasswordConfirm", {
        Token: token,
        NewPassword: password,
      })

      if (response.status === 200) {
        console.log("Contraseña restablecida correctamente:", response.data)
        setSuccessMessage("Contraseña restablecida con éxito. Redirigiendo al inicio de sesión...")

        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push("/user/login")
        }, 2000)
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)

      // Mensaje de error más descriptivo
      if (error.code === "ERR_NETWORK") {
        setErrorMessage("No se pudo conectar con el servidor. Verifica que la API esté en ejecución y accesible.")
      } else if (error.response) {
        setErrorMessage(error.response.data?.message || `Error del servidor: ${error.response.status}`)
      } else {
        setErrorMessage("Error al restablecer la contraseña. Verifica la conexión con el servidor.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Validando token...</p>
        </div>
      </div>
    )
  }

  if (!tokenValidated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <div className="text-center text-red-500 py-4">
            <AlertCircle className="inline-block mr-2 h-12 w-12 mb-2" />
            <h2 className="text-xl font-bold mb-4">Error de validación</h2>
            <p className="text-gray-700">{errorMessage || "Token inválido."}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Soluciones posibles:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Verifica que el servidor de la API esté en ejecución</li>
              <li>El enlace puede haber expirado (válido por 30 minutos)</li>
              <li>Intenta solicitar un nuevo enlace de restablecimiento</li>
            </ul>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => router.push("/user/password")}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-md"
            >
              Solicitar nuevo enlace
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">URL del servidor: https://localhost:7208</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-white p-4">
        <div className="max-w-md w-full">
          <form className="bg-white p-8 rounded-lg shadow-xl" onSubmit={handleSubmit}>
            {/* Título con animación */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white mb-4 shadow-md transform hover:scale-105 transition-transform duration-300">
                <KeyRound className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">Restablecer Contraseña</h2>
              <p className="text-sm text-gray-500 text-center mt-1">Ingrese los datos para restablecer su contraseña</p>
            </div>

            {/* Mensajes de éxito */}
            {successMessage && (
              <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start">
                <ShieldCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Nueva Contraseña */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="h-4 w-4 mr-1 text-gray-500" />
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                    id="password"
                    placeholder="Ingrese su nueva contraseña"
                    required
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="h-4 w-4 mr-1 text-gray-500" />
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full px-4 py-3 border ${
                      confirmPassword && password !== confirmPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    } rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-200`}
                    id="confirmPassword"
                    placeholder="Confirme su nueva contraseña"
                    required
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
                )}
              </div>

              {/* Botón Restablecer con efecto hover */}
              <div className="pt-4">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-md hover:from-blue-600 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </span>
                  ) : (
                    "Restablecer Contraseña"
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Información de seguridad */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 mr-1 text-gray-400" />
              Sus datos están protegidos con encriptación de extremo a extremo
            </p>
          </div>
        </div>
      </div>

      {/* Modal de error (estilo del login) */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Error</h2>
            <p className="text-center mb-6">{errorMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
