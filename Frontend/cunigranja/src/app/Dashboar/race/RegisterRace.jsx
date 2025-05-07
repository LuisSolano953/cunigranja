"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useState } from "react"

const RegisterRace = ({ onClose, onUpdate }) => {
  const [nombre_race, setNombreRace] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const races = ["Chinchilla", "Ruso Californiano", "Nueva Zelanda", "Mariposa"]

  async function handlerSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      console.log("Datos a enviar:", { nombre_race })

      // Corregimos el endpoint - usando el mismo patrón que UpdateRace
      const response = await axiosInstance.post(`/Api/Race`, {
        nombre_race,
      })

      if (response.status === 200) {
        setSuccessMessage("Raza registrada correctamente")
        setNombreRace("") // Limpiar el formulario

        // Solo actualizar los datos, pero no cerrar automáticamente
        if (typeof onUpdate === "function") {
          onUpdate()
        }
      }
    } catch (error) {
      console.error("Error al registrar la raza:", error)
      setErrorMessage(error.response?.data?.message || "Error desconocido al registrar la raza.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Implementamos exactamente la misma lógica de cierre que en UpdateRabbit
  const closeModal = () => {
    setSuccessMessage("")
    setErrorMessage("")
    if (typeof onUpdate === "function") {
      onUpdate() // Actualiza datos globales (ej. recarga tabla)
    }
    if (typeof onClose === "function") {
      onClose() // Cierra el formulario
    }
  }

  return (
    <>
      {/* Modales de error y éxito - Exactamente igual que en UpdateRabbit */}
      {(errorMessage || successMessage) && (
        <>
          {/* Overlay con cobertura extendida */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            style={{
              height: "125vh",
              width: "100%",
              top: 0,
              left: 0,
              position: "fixed",
              overflow: "hidden",
            }}
          ></div>

          {/* Contenedor del modal con posición ajustada */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none">
            <div
              className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full pointer-events-auto"
              style={{
                marginTop: "350px",
              }}
            >
              <h2 className="text-xl font-semibold text-center mb-4">{errorMessage ? "Error" : "Éxito"}</h2>
              <p className="text-center mb-6">
                {errorMessage
                  ? "Ha ocurrido un error en la operación. Por favor, inténtelo de nuevo."
                  : "La operación se ha completado con éxito."}
              </p>
              <button
                onClick={closeModal}
                className={`w-full py-2 px-4 ${
                  errorMessage ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                } text-white font-semibold rounded-lg shadow-md transition duration-300`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </>
      )}
      <form
        onSubmit={handlerSubmit}
        className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 border border-gray-200"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Seleccione la Raza:</label>
          <select
            value={nombre_race}
            onChange={(e) => setNombreRace(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Seleccione una raza
            </option>
            {races.map((race) => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          {isSubmitting ? "Registrando..." : "Registrar Raza"}
        </button>
      </form>
    </>
  )
}

export default RegisterRace
