"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useState } from "react"
import AlertModal from "@/components/utils/AlertModal"

const RegisterRace = ({ onCloseForm, onUpdate }) => {
  const [nombre_race, setNombreRace] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  // Función para validar que no contenga números
  const containsNumbers = (text) => {
    return /\d/.test(text)
  }

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
    const inputValue = e.target.value

    // Verificar si contiene números
    if (containsNumbers(inputValue)) {
      setErrorMessage("El nombre de la raza no puede contener números")
      setShowErrorAlert(true)
      return // No actualizar el estado si contiene números
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
      // Primero verificamos si la raza ya existe
      const checkResponse = await axiosInstance.get(`/Api/Race/GetRace`)
      const existingRaces = checkResponse.data || []

      // Verificar si ya existe una raza con el mismo nombre (ignorando mayúsculas/minúsculas)
      const raceExists = existingRaces.some(
        (race) => race.nombre_race.toLowerCase() === formattedRaceName.toLowerCase(),
      )

      if (raceExists) {
        setErrorMessage(`La raza "${formattedRaceName}" ya está registrada.`)
        setShowErrorAlert(true)
        setIsSubmitting(false)
        return
      }

      // Si no existe, procedemos a crear la raza
      const response = await axiosInstance.post(`/Api/Race/CreateRace`, {
        nombre_race: formattedRaceName,
      })

      if (response.status === 200) {
        setSuccessMessage("Raza registrada correctamente")
        setShowSuccessAlert(true)
        setNombreRace("") // Limpiar el formulario
      }
    } catch (error) {
      console.error("Error al registrar la raza:", error)
      setErrorMessage(error.response?.data?.message || "Error desconocido al registrar la raza.")
      setShowErrorAlert(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)

    // Primero actualizamos los datos si es necesario
    if (typeof onUpdate === "function") {
      onUpdate()
    }

    // Luego cerramos el formulario usando onCloseForm
    if (typeof onCloseForm === "function") {
      console.log("Cerrando formulario de raza...")
      onCloseForm()
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    // No cerrar el formulario automáticamente en errores de validación
    // Solo cerrar si es un error de servidor
    if (errorMessage.includes("Error desconocido") || errorMessage.includes("ya está registrada")) {
      if (typeof onCloseForm === "function") {
        console.log("Cerrando formulario de raza...")
        onCloseForm()
      }
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
          disabled={isSubmitting || containsNumbers(nombre_race)}
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Registrando..." : "Registrar Raza"}
        </button>
      </form>
    </>
  )
}

export default RegisterRace
