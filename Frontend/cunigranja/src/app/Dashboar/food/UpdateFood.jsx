"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"

const UpdateFood = ({ foodData, onClose, onUpdate }) => {
  const [name_food, setNameFood] = useState("")
  const [estado_food, setEstadoFood] = useState("Existente")
  const [valor_food, setValorFood] = useState("")
  const [unidad_food, setUnidadFood] = useState("kg") // Default to kg
  const [saldo_existente, setSaldoExistente] = useState("")
  const [originalSaldo, setOriginalSaldo] = useState("") // To compare changes
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [affectedRecords, setAffectedRecords] = useState([])
  const [showAffectedWarning, setShowAffectedWarning] = useState(false)

  // Initialize form with food data when component mounts
  useEffect(() => {
    if (foodData) {
      console.log("Datos recibidos para editar:", foodData)
      setNameFood(foodData.name_food || "")
      setSaldoExistente(foodData.saldo_existente || "")
      setOriginalSaldo(foodData.saldo_existente || "") // Save original balance
      setEstadoFood(foodData.estado_food || "Existente")
      setValorFood(foodData.valor_food || "")
      setUnidadFood(foodData.unidad_food || "kg") // Initialize unit
    }
  }, [foodData])

  // Function to check affected records when balance changes
  useEffect(() => {
    const checkAffectedRecords = async () => {
      // Only check if balance has changed and is less than original
      if (foodData && saldo_existente !== originalSaldo && Number(saldo_existente) < Number(originalSaldo)) {
        try {
          // Obtener el ID correcto
          const foodId = foodData.Id_food || foodData.id_food || foodData.id
          console.log("Verificando registros afectados para alimento ID:", foodId)

          // Intentar obtener registros de alimentación - omitir si falla
          try {
            const response = await axiosInstance.get(`/Api/Feeding/GetFeedingByFood/${foodId}`)

            if (response.status === 200 && response.data.length > 0) {
              console.log("Registros que podrían verse afectados:", response.data)
              setAffectedRecords(response.data)
              setShowAffectedWarning(true)
            } else {
              setAffectedRecords([])
              setShowAffectedWarning(false)
            }
          } catch (error) {
            console.log("No se encontraron registros de alimentación para este alimento o el endpoint no existe")
            // No mostrar error, simplemente continuar sin mostrar advertencia
            setAffectedRecords([])
            setShowAffectedWarning(false)
          }
        } catch (error) {
          console.error("Error al verificar registros afectados:", error)
        }
      } else {
        setShowAffectedWarning(false)
      }
    }

    // Run verification only if there's a change in balance
    if (saldo_existente !== originalSaldo) {
      checkAffectedRecords()
    }
  }, [saldo_existente, originalSaldo, foodData])

  // Function to handle balance changes and update status automatically
  const handleSaldoChange = (value) => {
    const numericValue = Number(value)
    setSaldoExistente(value)

    // Update status automatically based on balance
    if (numericValue <= 0) {
      setEstadoFood("Inactivo")
    } else if (numericValue <= 5) {
      setEstadoFood("Casi por acabar")
    } else {
      setEstadoFood("Existente")
    }
  }

  // Función para recalcular los saldos en registros relacionados
  const recalculateAffectedRecords = async () => {
    try {
      setIsLoading(true)
      const numericId = Number.parseInt(foodData.Id_food || foodData.id_food || foodData.id, 10)
      const newSaldoNum = Number(saldo_existente)

      console.log("Recalculando saldo para alimento ID:", numericId, "Nuevo saldo:", newSaldoNum)

      // Llamar al endpoint de recálculo
      try {
        const response = await axiosInstance.post(`/Api/Food/RecalculateFoodBalance`, {
          id_food: numericId,
          new_saldo: newSaldoNum,
        })

        if (response.status === 200) {
          console.log("Saldos recalculados correctamente:", response.data)
          return true
        }
      } catch (error) {
        // Si el endpoint no existe, simplemente continuamos con la actualización normal
        console.log("El endpoint de recálculo no existe, continuando con actualización normal")
        return true
      }

      return true
    } catch (error) {
      console.error("Error al recalcular saldos:", error)
      setErrorMessage("Error al recalcular saldos: " + (error.message || "Error desconocido"))
      return false
    } finally {
      setIsLoading(false)
    }
  }

  async function handlerSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(foodData.Id_food || foodData.id_food || foodData.id, 10)
      const saldoRedondeado = Math.round(Number(saldo_existente) * 100) / 100
      console.log("Intentando actualizar alimento con ID:", numericId)

      // Preparar los datos para enviar
      const foodDataToUpdate = {
        Id_food: numericId,
        name_food,
        estado_food,
        valor_food: Number(valor_food),
        unidad_food,
        saldo_existente: saldoRedondeado,
      }

      console.log("Datos a enviar:", foodDataToUpdate)

      // Siempre intentar recalcular si el saldo ha cambiado
      if (saldo_existente !== originalSaldo) {
        await recalculateAffectedRecords()
      }

      // Intentar primero con PUT
      let response
      try {
        response = await axiosInstance.put(`/Api/Food/UpdateFood`, foodDataToUpdate)
      } catch (putError) {
        console.log("Error con método PUT, intentando con POST:", putError)

        // Si PUT falla, intentar con POST
        try {
          response = await axiosInstance.post(`/Api/Food/UpdateFood`, foodDataToUpdate)
        } catch (postError) {
          console.log("Error con método POST, intentando con otro formato:", postError)

          // Si también falla, intentar con otro formato
          response = await axiosInstance.put(`/Api/Food/UpdateFood?id=${numericId}`, foodDataToUpdate)
        }
      }

      if (response && response.status === 200) {
        setSuccessMessage("Alimento actualizado correctamente")

        // Call the onUpdate callback to refresh the data
        if (typeof onUpdate === "function") {
          // Actualizar datos inmediatamente
          onUpdate()

          // Cerrar el modal después de un breve retraso
          setTimeout(() => {
            if (typeof onClose === "function") {
              onClose()
            }
          }, 1500)
        }
      }
    } catch (error) {
      console.error("Error al actualizar el alimento:", error)
      setErrorMessage(error.response?.data?.message || error.message || "Error desconocido al actualizar el alimento.")
    } finally {
      setIsLoading(false)
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
      {/* Error and success modals */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Error</h2>
            <p className="text-center mb-6">{errorMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
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
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handlerSubmit}
        className="p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Actualizar Alimento</h2>

        {/* Affected records alert */}
        {showAffectedWarning && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
            <h3 className="font-bold">¡Atención!</h3>
            <p>Este alimento está siendo utilizado en {affectedRecords.length} registro(s) de alimentación.</p>
            <p>Reducir el saldo podría afectar estos registros.</p>
          </div>
        )}

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
            <label className="block text-gray-800 font-medium mb-2">Unidad:</label>
            <select
              value={unidad_food}
              onChange={(e) => setUnidadFood(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            >
              <option value="kg">Kilogramos (kg)</option>
              <option value="g">Gramos (g)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-800 font-medium mb-2">Saldo existente (kg):</label>
            <input
              type="number"
              value={saldo_existente}
              onChange={(e) => handleSaldoChange(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              placeholder="Ingrese el saldo en kg"
              min="0"
              step="0.01" // Allow decimals (2 decimals)
            />
            <small className="text-gray-500">Ingrese el saldo en kilogramos. Saldo original: {originalSaldo} kg</small>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading ? "bg-gray-400" : "bg-black hover:bg-gray-600"
            } text-white font-semibold py-3 px-6 rounded-lg transition-colors`}
          >
            {isLoading ? "Procesando..." : "Actualizar Alimento"}
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdateFood