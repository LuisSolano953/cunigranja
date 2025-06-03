"use client"

import { useState } from "react"
import AlertModal from "@/components/utils/AlertModal"
import axiosInstance from "@/lib/axiosInstance"

const RegisterCage = ({ onCloseForm }) => {
  const [estado_cage, setEstadoCage] = useState("")
  const [cantidad_animales, setCantidadAnimales] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState("")

  // Función para validar entrada numérica
  const handleNumericInput = (e, setter) => {
    const value = e.target.value
    // Permitir solo números (sin decimales para estado_cage, con decimales para cantidad_animales)
    if (value === "" || /^\d+$/.test(value)) {
      setter(value)
    }
  }

  // Función para validar entrada numérica con decimales
  const handleDecimalInput = (e, setter) => {
    const value = e.target.value
    // Permitir números con decimales
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value)
    }
  }

  // Función para prevenir entrada de caracteres no numéricos
  const handleKeyPress = (e) => {
    // Permitir: backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return
    }
    // Asegurar que es un número
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  // Función para prevenir entrada de caracteres no numéricos (incluyendo punto decimal)
  const handleKeyPressDecimal = (e) => {
    // Permitir: backspace, delete, tab, escape, enter, punto decimal
    if (
      [8, 9, 27, 13, 46, 190, 110].indexOf(e.keyCode) !== -1 ||
      // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return
    }
    // Asegurar que es un número o punto decimal
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105) &&
      e.keyCode !== 190 &&
      e.keyCode !== 110
    ) {
      e.preventDefault()
    }
  }

  // Función para validar si el número de jaula ya existe
  const validateCageNumber = async (cageNumber) => {
    if (!cageNumber.trim()) {
      setValidationError("")
      return true
    }

    try {
      setIsValidating(true)
      const response = await axiosInstance.get("/Api/Cage/GetCage")

      if (response.status === 200) {
        const existingCages = response.data

        console.log("Validando número de jaula:", cageNumber)
        console.log(
          "Jaulas existentes:",
          existingCages.map((cage) => ({ id: cage.Id_cage, estado: cage.estado_cage })),
        )

        const cageExists = existingCages.some(
          (cage) => cage.estado_cage?.toString().toLowerCase() === cageNumber.toString().toLowerCase(),
        )

        if (cageExists) {
          setValidationError(`El número de jaula "${cageNumber}" ya está registrado`)
          return false
        } else {
          setValidationError("")
          return true
        }
      }
    } catch (error) {
      console.error("Error al validar número de jaula:", error)
      setValidationError("Error al validar el número de jaula")
      return false
    } finally {
      setIsValidating(false)
    }
  }

  // Manejar cambio en el número de jaula con validación numérica y de duplicados
  const handleCageNumberChange = async (e) => {
    const value = e.target.value

    // Solo permitir números
    if (value === "" || /^\d+$/.test(value)) {
      setEstadoCage(value)

      // Validar después de un pequeño delay para evitar muchas consultas
      if (value.trim()) {
        setTimeout(() => {
          validateCageNumber(value)
        }, 500)
      } else {
        setValidationError("")
      }
    }
  }

  async function handlerSubmit(e) {
    e.preventDefault()

    // Validaciones básicas
    if (!estado_cage.trim()) {
      setErrorMessage("El número de jaula es obligatorio.")
      setShowErrorAlert(true)
      return
    }

    if (!cantidad_animales.trim()) {
      setErrorMessage("La cantidad de animales es obligatoria.")
      setShowErrorAlert(true)
      return
    }

    // Validar que la cantidad de animales sea un número positivo
    const cantidadNum = Number.parseFloat(cantidad_animales)
    if (isNaN(cantidadNum) || cantidadNum < 0) {
      setErrorMessage("La cantidad de animales debe ser un número válido mayor o igual a 0.")
      setShowErrorAlert(true)
      return
    }

    setIsSubmitting(true)

    try {
      // Validar una vez más antes de enviar
      const isValid = await validateCageNumber(estado_cage)
      if (!isValid) {
        setErrorMessage(`El número de jaula "${estado_cage}" ya está registrado. Por favor, elija otro número.`)
        setShowErrorAlert(true)
        setIsSubmitting(false)
        return
      }

      console.log("Datos a enviar:", {
        estado_cage: estado_cage.trim(),
        cantidad_animales: cantidadNum,
      })

      const response = await axiosInstance.post("/Api/Cage/CreateCage", {
        estado_cage: estado_cage.trim(),
        cantidad_animales: cantidadNum,
      })

      if (response.status === 200) {
        setSuccessMessage(response.data.message || "Jaula registrada correctamente")
        setShowSuccessAlert(true)
        setEstadoCage("")
        setCantidadAnimales("")
        setValidationError("")
      }
    } catch (error) {
      console.error("Error al registrar la jaula:", error)

      let errorMsg = "Error desconocido al registrar la jaula."

      if (error.response) {
        if (error.response.status === 400) {
          errorMsg = error.response.data?.message || "Datos inválidos. Verifique la información ingresada."
        } else if (error.response.status === 409) {
          errorMsg = "El número de jaula ya existe. Por favor, elija otro número."
        } else {
          errorMsg = error.response.data?.message || `Error del servidor: ${error.response.status}`
        }
      } else if (error.request) {
        errorMsg = "No se pudo conectar con el servidor. Verifique su conexión."
      }

      setErrorMessage(errorMsg)
      setShowErrorAlert(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    setSuccessMessage("")
    if (onCloseForm) onCloseForm()
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setErrorMessage("")
    if (onCloseForm) onCloseForm()
  }

  return (
    <>
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        onSubmit={handlerSubmit}
        className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Registrar Nueva Jaula</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Número de jaula: <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={estado_cage}
              onChange={handleCageNumberChange}
              onKeyDown={handleKeyPress}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
                validationError ? "border-red-300 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Ej: 001, 123, etc."
              required
            />
            {isValidating && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          {validationError && <small className="text-red-500 mt-1 block">{validationError}</small>}
          {!validationError && <small className="text-gray-500">Ingrese solo números para identificar la jaula</small>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Cantidad de animales: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*\.?[0-9]*"
            value={cantidad_animales}
            onChange={(e) => handleDecimalInput(e, setCantidadAnimales)}
            onKeyDown={handleKeyPressDecimal}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            required
          />
          <small className="text-gray-500">Solo números - Cantidad actual de animales en la jaula</small>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isValidating}
          className={`w-full font-semibold py-3 rounded-lg transition-colors ${
            isSubmitting || isValidating
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-600"
          }`}
        >
          {isSubmitting ? "Registrando..." : isValidating ? "Validando..." : "Registrar Jaula"}
        </button>
      </form>
    </>
  )
}

export default RegisterCage
