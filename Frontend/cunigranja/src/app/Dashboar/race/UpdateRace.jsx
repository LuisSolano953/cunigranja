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
  const [isLoading, setIsLoading] = useState(true)

  // Función para validar que no contenga números
  const containsNumbers = (text) => {
    return /\d/.test(text)
  }

  // Función para formatear el texto con la primera letra de cada palabra en mayúscula
  const formatRaceName = (text) => {
    if (!text) return ""

    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Manejar cambios en el input y formatear el texto
  const handleInputChange = (e) => {
    const inputValue = e.target.value

    // Verificar si contiene números
    if (containsNumbers(inputValue)) {
      setErrorMessage("El nombre de la raza no puede contener números")
      setShowErrorAlert(true)
      return
    }

    // Si no contiene números, formatear y actualizar
    const formattedText = formatRaceName(inputValue)
    setNombreRace(formattedText)

    // Limpiar cualquier error previo
    if (errorMessage && showErrorAlert) {
      setErrorMessage("")
      setShowErrorAlert(false)
    }
  }

  // Initialize form with race data when component mounts
  useEffect(() => {
    console.log("=== DEBUG UpdateRace useEffect ===")
    console.log("raceData recibido:", raceData)

    if (raceData) {
      // Intentar diferentes posibles nombres de campos
      const possibleNames = [
        raceData.nombre_race,
        raceData.name,
        raceData.nombre,
        raceData.race_name,
        raceData.raceName,
      ]

      console.log("Posibles nombres encontrados:", possibleNames)

      // Encontrar el primer nombre válido
      const existingName = possibleNames.find((name) => name && typeof name === "string") || ""

      console.log("Nombre seleccionado:", existingName)

      // Verificar si los datos existentes contienen números
      if (containsNumbers(existingName)) {
        console.warn("Los datos existentes contienen números:", existingName)
        setErrorMessage("Los datos existentes contienen números. Por favor, corrija el nombre.")
        setShowErrorAlert(true)
      }

      // Formatear el nombre de la raza al cargar los datos
      const formattedName = formatRaceName(existingName)
      console.log("Nombre formateado:", formattedName)

      setNombreRace(formattedName)
      setIsLoading(false)
    } else {
      console.log("No se recibieron datos de raza")
      setIsLoading(false)
    }
  }, [raceData])

  async function handlerSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    // Formatear el nombre de la raza antes de enviarlo
    const formattedRaceName = formatRaceName(nombre_race.trim())

    // Validación final antes de enviar
    if (containsNumbers(formattedRaceName)) {
      setErrorMessage("El nombre de la raza no puede contener números")
      setShowErrorAlert(true)
      setIsSubmitting(false)
      return
    }

    // Validar que no esté vacío después del trim
    if (!formattedRaceName) {
      setErrorMessage("El nombre de la raza es obligatorio")
      setShowErrorAlert(true)
      setIsSubmitting(false)
      return
    }

    try {
      // Intentar obtener el ID de diferentes campos posibles
      const possibleIds = [raceData.id, raceData.Id_race, raceData.id_race, raceData.raceId]

      const raceId = possibleIds.find((id) => id !== undefined && id !== null)
      const numericId = Number.parseInt(raceId, 10)

      console.log("ID de raza encontrado:", raceId, "-> Numérico:", numericId)

      if (isNaN(numericId)) {
        setErrorMessage("No se pudo obtener el ID de la raza")
        setShowErrorAlert(true)
        setIsSubmitting(false)
        return
      }

      // Primero verificamos si ya existe otra raza con el mismo nombre
      const checkResponse = await axiosInstance.get(`/Api/Race/GetRace`)
      const existingRaces = checkResponse.data || []

      // Verificar si ya existe una raza con el mismo nombre (ignorando mayúsculas/minúsculas)
      // pero excluyendo la raza actual que estamos actualizando
      const raceExists = existingRaces.some((race) => {
        // Obtener el ID de la raza existente
        const existingRaceId = race.id || race.Id_race || race.id_race
        const raceIdStr = String(existingRaceId)
        const currentIdStr = String(numericId)

        // Obtener el nombre de la raza existente
        const existingRaceName = race.nombre_race || race.name || race.nombre || ""

        console.log("Comparando:", {
          raceId: raceIdStr,
          currentId: currentIdStr,
          raceName: existingRaceName.toLowerCase(),
          newName: formattedRaceName.toLowerCase(),
          isSameId: raceIdStr === currentIdStr,
          isSameName: existingRaceName.toLowerCase() === formattedRaceName.toLowerCase(),
        })

        return existingRaceName.toLowerCase() === formattedRaceName.toLowerCase() && raceIdStr !== currentIdStr
      })

      if (raceExists) {
        setErrorMessage(`La raza "${formattedRaceName}" ya está registrada.`)
        setShowErrorAlert(true)
        setIsSubmitting(false)
        return
      }

      console.log("Intentando actualizar raza con ID:", numericId)
      console.log("Datos a enviar:", { Id_race: numericId, nombre_race: formattedRaceName })

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
    // No cerrar el formulario automáticamente en errores de validación
    // Solo cerrar si es un error de servidor
    if (errorMessage.includes("Error desconocido") || errorMessage.includes("ya está registrada")) {
      if (typeof onClose === "function") {
        onClose()
      }
    }
  }

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 border border-gray-200">
        <div className="text-center">
          <p className="text-gray-500">Cargando datos de la raza...</p>
        </div>
      </div>
    )
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
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
              containsNumbers(nombre_race) ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Ingrese el nombre de la raza"
            required
          />
          <div className="mt-1 space-y-1">
            <p className="text-sm text-gray-500">La primera letra de cada palabra será en mayúscula automáticamente.</p>
            <p className="text-sm text-red-500 font-medium">⚠️ No se permiten números en el nombre de la raza.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || containsNumbers(nombre_race) || !nombre_race.trim()}
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Actualizando..." : "Actualizar Raza"}
        </button>
      </form>
    </>
  )
}

export default UpdateRace
