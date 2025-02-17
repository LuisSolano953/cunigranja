"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useState, useCallback } from "react"

async function SendData(Body) {
  const response = await axiosInstance.post("Api/Reproduction/CreateReproduction", Body)
  return response
}

const RegisterReproduction = () => {
  const [fecha_nacimiento, setFechaNacimiento] = useState("")
  const [total_conejos, setTotalConejos] = useState("")
  const [nacidos_vivos, setNacidosVivos] = useState("")
  const [nacidos_muertos, setNacidosMuertos] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      if (isSubmitting) return

      setIsSubmitting(true)
      setErrorMessage("")
      setSuccessMessage("")

      // Convertir la fecha al formato esperado por el backend (ISO 8601)
      const formattedDate = new Date(fecha_nacimiento).toISOString()

      const Body = {
        fecha_nacimiento: formattedDate,
        total_conejos: Number.parseInt(total_conejos),
        nacidos_vivos: Number.parseInt(nacidos_vivos),
        nacidos_muertos: Number.parseInt(nacidos_muertos),
      }

      try {
        const response = await SendData(Body)
        console.log("Respuesta del servidor:", response.data)
        setSuccessMessage(response.data.message)
        // Reset form fields
        setFechaNacimiento("")
        setTotalConejos("")
        setNacidosVivos("")
        setNacidosMuertos("")
      } catch (error) {
        console.error("Error al enviar datos:", error.response?.data || error.message)
        setErrorMessage(error.response?.data?.message || "Error en el registro. Por favor, intente nuevamente.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [fecha_nacimiento, total_conejos, nacidos_vivos, nacidos_muertos, isSubmitting],
  )

  const closeModal = useCallback(() => {
    setErrorMessage("")
    setSuccessMessage("")
  }, [])

  return (
    <>
      {/* Error Modal */}
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

      {/* Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Éxito</h2>
            <p className="text-center mb-6">{successMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registrar Reproducción</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="fecha_reproduction" className="block text-gray-700 font-medium mb-2">
              Fecha de Nacimiento:
            </label>
            <input
              type="date"
              value={fecha_nacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              name="fecha_reproduction"
              id="fecha_reproduction"
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <div>
            <label htmlFor="total_conejos" className="block text-gray-800 font-medium mb-2">
              Total de Conejos:
            </label>
            <input
              type="number"
              value={total_conejos}
              onChange={(e) => setTotalConejos(e.target.value)}
              name="total_conejos"
              id="total_conejos"
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              min="0"
              placeholder="Ingrese el total"
            />
          </div>

          <div>
            <label htmlFor="nacidos_vivos" className="block text-gray-800 font-medium mb-2">
              Nacidos Vivos:
            </label>
            <input
              type="number"
              value={nacidos_vivos}
              onChange={(e) => setNacidosVivos(e.target.value)}
              name="nacidos_vivos"
              id="nacidos_vivos"
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              min="0"
              placeholder="Ingrese nacidos vivos"
            />
          </div>

          <div>
            <label htmlFor="nacidos_muertos" className="block text-gray-800 font-medium mb-2">
              Nacidos Muertos:
            </label>
            <input
              type="number"
              value={nacidos_muertos}
              onChange={(e) => setNacidosMuertos(e.target.value)}
              name="nacidos_muertos"
              id="nacidos_muertos"
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              min="0"
              placeholder="Ingrese nacidos muertos"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrar Reproducción"}
          </button>
        </div>
      </form>
    </>
  )
}

export default RegisterReproduction

