"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import axiosInstance from "@/lib/axiosInstance"
import { KeyRound, Eye, EyeOff, ShieldCheck, Lock, AlertCircle, Loader2, Wifi, WifiOff, Clock } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function ResetPasswordPage() {
   const [error, setError] = useState("")
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
  const [isModalOpen, setModalOpen] = useState(false)

  const [tokenValidated, setTokenValidated] = useState(false)
  const [loadingToken, setLoadingToken] = useState(true)
  const [connectionError, setConnectionError] = useState(false)

  const closeErrorModal = () => {
    setError("")
  }

  const closeSuccessModal = () => {
    setSuccessMessage("")
    router.push("/user/login")
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
          setConnectionError(true)
          setErrorMessage("No se pudo conectar con el servidor. Verifica que la API esté en ejecución y accesible.")
        } else if (error.response) {
          if (error.response.status === 401) {
            setErrorMessage("El token ha expirado o no es válido. Por favor, solicite un nuevo enlace.")
          } else {
            setErrorMessage(error.response.data?.message || `Error del servidor: ${error.response.status}`)
          }
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
        setModalOpen(true)

        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push("/user/login")
        }, 2000)
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)

      // Mensaje de error más descriptivo
      if (error.code === "ERR_NETWORK") {
        setConnectionError(true)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-md">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Validando Token</h2>
          <p className="text-gray-600 mb-6">Estamos verificando la validez de su token de restablecimiento...</p>

          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
            <div className="w-3 h-3 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "450ms" }}></div>
          </div>

          <div className="mt-8 text-sm text-gray-500 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 mr-1 text-gray-400" />
            Verificando seguridad de su solicitud
          </div>
        </div>
      </div>
    )
  }

  if (!tokenValidated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            {connectionError ? (
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-4">
                <WifiOff className="h-8 w-8" />
              </div>
            ) : errorMessage.includes("expirado") ? (
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-900">
              {connectionError
                ? "Error de Conexión"
                : errorMessage.includes("expirado")
                  ? "Token Expirado"
                  : "Error de Validación"}
            </h2>
            <p className="text-red-500 mt-2">{errorMessage}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">¿Qué puede hacer ahora?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              {connectionError ? (
                <>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span> Verifique su conexión a internet
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span> Intente recargar la página
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span> Solicite un nuevo enlace para restablecer su contraseña
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span> Asegúrese de usar el enlace más reciente enviado a su
                    correo
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span> Verifique que el servidor de la API esté en ejecución
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/user/password")}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
            >
              Solicitar Nuevo Enlace
            </Button>

            {connectionError && (
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                <Wifi className="mr-2 h-4 w-4" /> Reintentar Conexión
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <form className="bg-white p-8 rounded-lg shadow-lg border border-gray-100" onSubmit={handleSubmit}>
            {/* Título con animación */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white mb-4 shadow-md transform hover:scale-105 transition-transform duration-300">
                <KeyRound className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">Restablecer Contraseña</h2>
              <p className="text-sm text-gray-500 text-center mt-1">Ingrese los datos para restablecer su contraseña</p>
            </div>

            {/* Mensajes de error o éxito */}
            {errorMessage && !isModalOpen && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

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
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Procesando...
                    </div>
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
