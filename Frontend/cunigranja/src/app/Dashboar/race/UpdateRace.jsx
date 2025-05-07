"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"

const UpdateRace = ({ raceData, onClose, onUpdate }) => {
  const [nombre_race, setNombreRace] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const races = ["Chinchilla", "Ruso Californiano", "Nueva Zelanda", "Mariposa"]

  // Initialize form with race data when component mounts
  useEffect(() => {
    if (raceData) {
      console.log("Cargando datos de raza:", raceData)
      setNombreRace(raceData.nombre_race || "")
    }
  }, [raceData])

  async function handlerSubmit(e) {
    e.preventDefault()

    try {
      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(raceData.id, 10)

      console.log("Intentando actualizar raza con ID:", numericId)
      console.log("Datos a enviar:", { nombre_race })

      // Enviar el ID en el cuerpo de la solicitud
      const response = await axiosInstance.post(`/Api/Race/UpdateRace`, {
        Id_race: numericId,
        nombre_race,
      })

      if (response.status === 200) {
        setSuccessMessage("Raza actualizada correctamente")

        // Solo actualizar los datos, pero no cerrar automáticamente
        if (typeof onUpdate === "function") {
          onUpdate()
        }
      }
    } catch (error) {
      console.error("Error al actualizar la raza:", error)
      setErrorMessage(error.response?.data?.message || "Error desconocido al actualizar la raza.")
    }
  }

  const closeModal = () => {
    setSuccessMessage("")
    setErrorMessage("")
    if (typeof onClose === "function") {
      onClose()
    }
  }

  return (
    <>
      {/* Modales de error y éxito */}
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
              <p className="text-center mb-6">{errorMessage ? errorMessage : successMessage}</p>
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
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Actualizar Raza
        </button>
      </form>
    </>
  )
}

export default UpdateRace
