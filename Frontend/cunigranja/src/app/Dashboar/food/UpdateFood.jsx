"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"
import AlertModal from "@/components/utils/AlertModal"

const UpdateFood = ({ foodData, onClose, onUpdate }) => {
  const [name_food, setNameFood] = useState("")
  const [estado_food, setEstadoFood] = useState("Existente")
  const [valor_food, setValorFood] = useState("")
  const [saldo_existente, setSaldoExistente] = useState("")
  const [originalSaldo, setOriginalSaldo] = useState("") // To compare changes
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [affectedRecords, setAffectedRecords] = useState([])
  const [showAffectedWarning, setShowAffectedWarning] = useState(false)

  // NUEVO: Estado para controlar si el alimento está inactivo
  const [isFoodInactive, setIsFoodInactive] = useState(false)
  const [originalEstado, setOriginalEstado] = useState("") // Para comparar el estado original

  // Función para validar que solo contenga letras y espacios
  const containsNumbers = (text) => {
    return /\d/.test(text)
  }

  // Función para validar que solo contenga números
  const containsLetters = (text) => {
    return /[a-zA-Z]/.test(text)
  }

  // Manejar cambios en el nombre del alimento (solo letras)
  const handleNameChange = (e) => {
    const inputValue = e.target.value

    // Verificar si contiene números
    if (containsNumbers(inputValue)) {
      setErrorMessage("El nombre del alimento no puede contener números")
      setShowErrorAlert(true)
      return // No actualizar el estado si contiene números
    }

    // Si no contiene números, actualizar
    setNameFood(inputValue)

    // Limpiar cualquier error previo
    if (errorMessage && showErrorAlert) {
      setErrorMessage("")
      setShowErrorAlert(false)
    }
  }

  // Manejar cambios en el valor (solo números)
  const handleValorChange = (e) => {
    const inputValue = e.target.value

    // Verificar si contiene letras
    if (containsLetters(inputValue)) {
      setErrorMessage("El valor solo puede contener números")
      setShowErrorAlert(true)
      return // No actualizar el estado si contiene letras
    }

    // Si no contiene letras, actualizar
    setValorFood(inputValue)

    // Limpiar cualquier error previo
    if (errorMessage && showErrorAlert) {
      setErrorMessage("")
      setShowErrorAlert(false)
    }
  }

  // Manejar cambios en el saldo existente (solo números)
  const handleSaldoChange = (e) => {
    const inputValue = e.target.value

    // Verificar si contiene letras
    if (containsLetters(inputValue)) {
      setErrorMessage("El saldo existente solo puede contener números")
      setShowErrorAlert(true)
      return // No actualizar el estado si contiene letras
    }

    // Si no contiene letras, actualizar
    setSaldoExistente(inputValue)
    const numericValue = Number(inputValue)

    // MODIFICADO: Solo actualizar estado automáticamente si el alimento NO estaba originalmente inactivo
    // Si estaba inactivo originalmente, mantener ese estado hasta que se actualice manualmente
    if (originalEstado !== "Inactivo") {
      // Update status automatically based on balance
      if (numericValue <= 0) {
        setEstadoFood("Inactivo")
      } else if (numericValue <= 5000) {
        // 5kg = 5000g
        setEstadoFood("Casi por acabar")
      } else {
        setEstadoFood("Existente")
      }
    }

    // Limpiar cualquier error previo
    if (errorMessage && showErrorAlert) {
      setErrorMessage("")
      setShowErrorAlert(false)
    }
  }

  // Initialize form with food data when component mounts
  useEffect(() => {
    if (foodData) {
      console.log("Datos recibidos para editar:", foodData)

      // Verificar si los datos existentes contienen caracteres inválidos
      const existingName = foodData.name_food || ""
      if (containsNumbers(existingName)) {
        console.warn("El nombre del alimento contiene números:", existingName)
      }

      const currentEstado = foodData.estado_food || "Existente"

      setNameFood(existingName)
      setSaldoExistente(foodData.saldo_existente || "")
      setOriginalSaldo(foodData.saldo_existente || "") // Save original balance
      setEstadoFood(currentEstado)
      setOriginalEstado(currentEstado) // NUEVO: Guardar estado original
      setValorFood(foodData.valor_food || "")

      // NUEVO: Verificar si el alimento está inactivo
      const isInactive = currentEstado === "Inactivo" || currentEstado === "inactivo" || currentEstado === "INACTIVO"
      setIsFoodInactive(isInactive)

      console.log("Estado del alimento:", currentEstado, "¿Está inactivo?", isInactive)
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
      setShowErrorAlert(true)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  async function handlerSubmit(e) {
    e.preventDefault()

    // NUEVA VALIDACIÓN: No permitir actualización si el alimento está inactivo
    if (isFoodInactive) {
      setErrorMessage(
        "No se puede actualizar un alimento cuando está inactivo. El alimento debe estar activo para realizar modificaciones.",
      )
      setShowErrorAlert(true)
      return
    }

    // Validaciones finales antes de enviar
    if (containsNumbers(name_food)) {
      setErrorMessage("El nombre del alimento no puede contener números")
      setShowErrorAlert(true)
      return
    }

    if (containsLetters(valor_food)) {
      setErrorMessage("El valor solo puede contener números")
      setShowErrorAlert(true)
      return
    }

    if (containsLetters(saldo_existente)) {
      setErrorMessage("El saldo existente solo puede contener números")
      setShowErrorAlert(true)
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(foodData.Id_food || foodData.id_food || foodData.id, 10)
      const saldoRedondeado = Math.round(Number(saldo_existente) * 100) / 100
      console.log("Intentando actualizar alimento con ID:", numericId)

      // Preparar los datos para enviar (sin unidad ya que no es editable)
      const foodDataToUpdate = {
        Id_food: numericId,
        name_food: name_food.trim(),
        estado_food,
        valor_food: Number(valor_food),
        unidad_food: "g", // Siempre gramos, no editable
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
        setShowSuccessAlert(true)
      }
    } catch (error) {
      console.error("Error al actualizar el alimento:", error)
      setErrorMessage(error.response?.data?.message || error.message || "Error desconocido al actualizar el alimento.")
      setShowErrorAlert(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    setSuccessMessage("")
    // Call the onUpdate callback to refresh the data
    if (typeof onUpdate === "function") {
      onUpdate()
    }
    // Cerrar el modal después de un breve retraso
    if (typeof onClose === "function") {
      onClose()
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setErrorMessage("")
  }

  // Verificar si hay errores de validación
  const hasValidationErrors =
    containsNumbers(name_food) || containsLetters(valor_food) || containsLetters(saldo_existente)

  // Determinar si el botón debe estar deshabilitado
  const isSubmitDisabled =
    isLoading || hasValidationErrors || !name_food.trim() || !valor_food || !saldo_existente || isFoodInactive // NUEVO: Deshabilitar si el alimento está inactivo

  return (
    <>
      {/* Alerta de éxito */}
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />

      {/* Alerta de error */}
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      {/* Form */}
      <form
        onSubmit={handlerSubmit}
        className="p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Actualizar Alimento</h2>

        {/* NUEVA: Alerta de alimento inactivo */}
        {isFoodInactive && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Alimento Inactivo</h3>
                <p className="text-sm text-red-700 mt-1">
                  No se puede actualizar este alimento porque está inactivo. Para realizar modificaciones, el alimento
                  debe estar activo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Affected records alert */}
        {showAffectedWarning && !isFoodInactive && (
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
              onChange={handleNameChange}
              className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 ${
                containsNumbers(name_food)
                  ? "border-red-500 focus:ring-red-500"
                  : isFoodInactive
                    ? "border-red-300 bg-red-50"
                    : "border-gray-400 focus:ring-gray-600"
              }`}
              required
              placeholder="Ingrese el nombre"
              disabled={isFoodInactive}
            />
            <p className="text-xs text-red-500 mt-1">⚠️ Solo se permiten letras y espacios</p>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Estado:</label>
            <input
              type="text"
              value={estado_food}
              readOnly
              className={`w-full border rounded-lg p-2 focus:outline-none ${
                isFoodInactive ? "border-red-300 bg-red-50 text-red-700" : "border-gray-400 bg-gray-100"
              }`}
            />
            <small className={`${isFoodInactive ? "text-red-600" : "text-gray-500"}`}>
              {isFoodInactive ? "❌ Estado: INACTIVO" : "Se actualiza automáticamente según el saldo"}
            </small>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Valor:</label>
            <input
              type="text"
              value={valor_food}
              onChange={handleValorChange}
              className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 ${
                containsLetters(valor_food)
                  ? "border-red-500 focus:ring-red-500"
                  : isFoodInactive
                    ? "border-red-300 bg-red-50"
                    : "border-gray-400 focus:ring-gray-600"
              }`}
              required
              placeholder="Ingrese el valor"
              disabled={isFoodInactive}
            />
            <p className="text-xs text-red-500 mt-1">⚠️ Solo se permiten números</p>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Saldo existente (gramos):</label>
            <input
              type="text"
              value={saldo_existente}
              onChange={handleSaldoChange}
              className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 ${
                containsLetters(saldo_existente)
                  ? "border-red-500 focus:ring-red-500"
                  : isFoodInactive
                    ? "border-red-300 bg-red-50"
                    : "border-gray-400 focus:ring-gray-600"
              }`}
              required
              placeholder="Ingrese el saldo en gramos"
              disabled={isFoodInactive}
            />
            <p className="text-xs text-red-500 mt-1">⚠️ Solo se permiten números</p>
            <small className="text-gray-500">Saldo original: {originalSaldo} g</small>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isFoodInactive
                ? "bg-red-500 text-white hover:bg-red-600"
                : isLoading || hasValidationErrors
                  ? "bg-gray-400 text-white"
                  : "bg-black text-white hover:bg-gray-600"
            }`}
          >
            {isLoading
              ? "Procesando..."
              : isFoodInactive
                ? "No se puede actualizar (Alimento inactivo)"
                : "Actualizar Alimento"}
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdateFood
