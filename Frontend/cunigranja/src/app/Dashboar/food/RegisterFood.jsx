"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useState } from "react"

const RegisterFood = () => {
  const [name_food, setNameFood] = useState("")
  const [estado_food, setEstadoFood] = useState("Existente") // Valor por defecto
  const [valor_food, setValorFood] = useState("")
  const [saldo_existente, setSaldoExistente] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Función para extraer el mensaje de error de diferentes formatos de respuesta
  const extractErrorMessage = (error) => {
    if (!error) return "Error desconocido"

    // Si es un string, devolverlo directamente
    if (typeof error === "string") return error

    // Si es un objeto de respuesta de axios
    if (error.response) {
      // Si la respuesta tiene un mensaje de error en formato string
      if (typeof error.response.data === "string") {
        return error.response.data
      }

      // Si la respuesta tiene un objeto con mensaje
      if (error.response.data && typeof error.response.data.message === "string") {
        return error.response.data.message
      }

      // Si la respuesta tiene un objeto con title (común en errores ASP.NET Core)
      if (error.response.data && typeof error.response.data.title === "string") {
        return error.response.data.title
      }

      // Si hay errores detallados
      if (error.response.data && error.response.data.errors) {
        // Convertir el objeto de errores a un array de mensajes
        const errorMessages = Object.values(error.response.data.errors).flat().join(", ")
        return errorMessages || "Error de validación"
      }

      // Si no podemos extraer un mensaje específico
      return `Error ${error.response.status}: ${error.response.statusText}`
    }

    // Si es un error con mensaje
    if (error.message) return error.message

    // Si todo lo demás falla, convertir a string
    try {
      return JSON.stringify(error)
    } catch {
      return "Error desconocido"
    }
  }

  async function handlerSubmit(e) {
    e.preventDefault()

    // Siempre usar kg como unidad
    const unidad_food = "kg"

    try {
      // Redondear el saldo existente a 2 decimales
      const saldoRedondeado = Math.round(Number(saldo_existente) * 100) / 100

      const response = await axiosInstance.post("/Api/Food/CreateFood", {
        name_food,
        estado_food,
        valor_food: Number(valor_food),
        unidad_food,
        saldo_existente: saldoRedondeado,
      })

      if (response.status === 200) {
        setSuccessMessage(response.data.message || "Alimento registrado con éxito")
        setNameFood("")
        setSaldoExistente("")
        setEstadoFood("Existente")
        setValorFood("")
      }
    } catch (error) {
      console.error("Error al registrar el alimento:", error)
      setErrorMessage(extractErrorMessage(error))
    }
  }

  // Actualizar estado automáticamente basado en saldo existente (solo para UI)
  const handleSaldoChange = (value) => {
    setSaldoExistente(value)
    const saldoNum = Number(value)
    
    if (saldoNum <= 0) {
      setEstadoFood("Inactivo")
    } else if (saldoNum <= 5) {
      setEstadoFood("Casi por acabar")
    } else {
      setEstadoFood("Existente")
    }
  }

  const closeModal = () => {
    setErrorMessage("")
    setSuccessMessage("")
  }

  return (
    <>
      {/* Modales de error y éxito */}
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

      {/* Formulario */}
      <form
        onSubmit={handlerSubmit}
        className="p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registrar Alimento</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nombre del Alimento:</label>
            <input
              type="text"
              value={name_food}
              onChange={(e) => setNameFood(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              placeholder="Ingrese el nombre"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Estado:</label>
            <input
              type="text"
              value={estado_food}
              readOnly
              className="w-full border border-gray-400 rounded-lg p-2 bg-gray-100 focus:outline-none"
            />
            <small className="text-gray-500">Se actualiza automáticamente según el saldo</small>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Valor:</label>
            <input
              type="number"
              value={valor_food}
              onChange={(e) => setValorFood(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              placeholder="Ingrese el valor"
              min="1"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Saldo existente (kg):</label>
            <input
              type="number"
              value={saldo_existente}
              onChange={(e) => handleSaldoChange(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              placeholder="Ingrese el saldo inicial en kg"
              min="0"
              step="0.01" // Permitir decimales (2 decimales)
            />
            <small className="text-gray-500">Ingrese el saldo en kilogramos</small>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Registrar Alimento
          </button>
        </div>
      </form>
    </>
  )
}

export default RegisterFood