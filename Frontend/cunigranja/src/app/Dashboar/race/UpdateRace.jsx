"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"
import AlertModal from "@/components/utils/AlertModal"

const UpdateRace = ({ raceData, onClose, onUpdate }) => {
  const [nombre_race, setNombreRace] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Función para formatear el texto con la primera letra de cada palabra en mayúscula
  const formatRaceName = (text) => {
    if (!text) return ""

    // Dividir el texto en palabras, capitalizar la primera letra de cada palabra
    // y convertir el resto a minúsculas
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Manejar cambios en el input y formatear el texto
  const handleInputChange = (e) => {
    const formattedText = formatRaceName(e.target.value)
    setNombreRace(formattedText)
  }

  // Initialize form with race data when component mounts
  useEffect(() => {
    if (raceData) {
      console.log("Cargando datos de raza:", raceData)
      // Formatear el nombre de la raza al cargar los datos
      setNombreRace(formatRaceName(raceData.nombre_race || ""))
    }
  }, [raceData])

  async function handlerSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    // Formatear el nombre de la raza antes de enviarlo
    const formattedRaceName = formatRaceName(nombre_race.trim())

    try {
      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(raceData.id, 10)

      // Primero verificamos si ya existe otra raza con el mismo nombre
      const checkResponse = await axiosInstance.get(`/Api/Race/GetRace`)
      const existingRaces = checkResponse.data || []

      // Verificar si ya existe una raza con el mismo nombre (ignorando mayúsculas/minúsculas)
      // pero excluyendo la raza actual que estamos actualizando
      const raceExists = existingRaces.some((race) => {
        // Convertir ambos IDs a string para comparación segura
        const raceIdStr = String(race.id)
        const currentIdStr = String(numericId)

        console.log("Comparando:", {
          raceId: raceIdStr,
          currentId: currentIdStr,
          raceName: race.nombre_race.toLowerCase(),
          newName: formattedRaceName.toLowerCase(),
          isSameId: raceIdStr === currentIdStr,
          isSameName: race.nombre_race.toLowerCase() === formattedRaceName.toLowerCase(),
        })

        return race.nombre_race.toLowerCase() === formattedRaceName.toLowerCase() && raceIdStr !== currentIdStr
      })

      if (raceExists) {
        setErrorMessage(`La raza "${formattedRaceName}" ya está registrada.`)
        setShowErrorAlert(true)
        setIsSubmitting(false)
        return
      }

      console.log("Intentando actualizar raza con ID:", numericId)
      console.log("Datos a enviar:", { nombre_race: formattedRaceName })

      // Enviar el ID en el cuerpo de la solicitud
      const response = await axiosInstance.post(`/Api/Race/UpdateRace`, {
        Id_race: numericId,
        nombre_race: formattedRaceName,
      })

      if (response.status === 200) {
        setSuccessMessage("Raza actualizada correctamente")
        setShowSuccessAlert(true)

        // Solo actualizar los datos, pero no cerrar automáticamente
        if (typeof onUpdate === "function") {
          onUpdate()
        }
      }
    } catch (error) {
      console.error("Error al actualizar la raza:", error)
      setErrorMessage(error.response?.data?.message || "Error desconocido al actualizar la raza.")
      setShowErrorAlert(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    if (typeof onUpdate === "function") {
      onUpdate() // Actualiza datos globales
    }
    if (typeof onClose === "function") {
      onClose() // Cierra el formulario
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    // También cerrar el formulario cuando se cierra la alerta de error
    if (typeof onClose === "function") {
      onClose()
    }
  }

  return (
    <>
      {/* Alerta de éxito */}
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />

      {/* Alerta de error */}
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        onSubmit={handlerSubmit}
        className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 border border-gray-200"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Nombre de la Raza:</label>
          <input
            type="text"
            value={nombre_race}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el nombre de la raza"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            La primera letra de cada palabra será en mayúscula automáticamente.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Actualizando..." : "Actualizar Raza"}
        </button>
      </form>
    </>
  )
}

export default UpdateRace
