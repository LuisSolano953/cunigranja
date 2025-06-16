"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"
import AlertModal from "@/components/utils/AlertModal"

const UpdateEntrada = ({ entradaData, onClose, onUpdate }) => {
  const [fecha_entrada, setFechaEntrada] = useState("")
  const [valor_entrada, setValorEntrada] = useState("")
  const [cantidad_entrada, setCantidadEntrada] = useState("")
  const [cantidad_entrada_original, setCantidadEntradaOriginal] = useState("")
  const [Id_food, setIdFood] = useState("")
  const [food, setFood] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingFood, setLoadingFood] = useState(true)
  const [selectedFood, setSelectedFood] = useState(null)

  // NUEVO: Estado para controlar si el alimento está inactivo
  const [isSelectedFoodInactive, setIsSelectedFoodInactive] = useState(false)

  // Campos calculados automáticamente - solo para mostrar al usuario
  const [valor_total, setValorTotal] = useState("")
  const [existencia_actual_g, setExistenciaActualG] = useState("")
  const [saldo_existente_original, setSaldoExistenteOriginal] = useState(0)

  // Constante para la conversión
  const GRAMOS_POR_BULTO = 40000 // 40kg = 40000g

  // Función para validar que solo contenga números
  const containsLetters = (text) => {
    return /[a-zA-Z]/.test(text)
  }

  // Manejar cambios en la cantidad (solo números)
  const handleCantidadChange = (e) => {
    const inputValue = e.target.value

    // Verificar si contiene letras
    if (containsLetters(inputValue)) {
      setErrorMessage("La cantidad solo puede contener números")
      setShowErrorAlert(true)
      return // No actualizar el estado si contiene letras
    }

    // Si no contiene letras, actualizar
    setCantidadEntrada(inputValue)

    // Limpiar cualquier error previo
    if (errorMessage && showErrorAlert) {
      setErrorMessage("")
      setShowErrorAlert(false)
    }
  }

  // Manejar cambios en el valor unitario (solo números)
  const handleValorChange = (e) => {
    const inputValue = e.target.value

    // Verificar si contiene letras
    if (containsLetters(inputValue)) {
      setErrorMessage("El valor unitario solo puede contener números")
      setShowErrorAlert(true)
      return // No actualizar el estado si contiene letras
    }

    // Si no contiene letras, actualizar
    setValorEntrada(inputValue)

    // Limpiar cualquier error previo
    if (errorMessage && showErrorAlert) {
      setErrorMessage("")
      setShowErrorAlert(false)
    }
  }

  // Función para obtener el ID de la entrada de manera más robusta
  const getEntradaId = (data) => {
    // Lista de posibles nombres de propiedades para el ID
    const possibleIdFields = ["ID", "Id_entrada", "id", "Id", "id_entrada", "entrada_id", "entradaId", "ID_ENTRADA"]

    for (const field of possibleIdFields) {
      if (data && data[field] !== undefined && data[field] !== null) {
        console.log(`ID encontrado en campo '${field}':`, data[field])
        return data[field]
      }
    }

    console.error("No se encontró ID en ningún campo esperado")
    console.log("Datos disponibles:", data)
    console.log("Propiedades del objeto:", Object.keys(data || {}))
    return null
  }

  // Cargar los alimentos al montar el componente
  useEffect(() => {
    async function fetchFood() {
      try {
        setLoadingFood(true)
        const response = await axiosInstance.get("/Api/Food/GetFood")
        if (response.status === 200) {
          // CARGAR TODOS LOS ALIMENTOS (activos e inactivos) para poder mostrar el alimento actual
          // pero marcar cuáles están inactivos
          const formattedFood = response.data.map((item) => ({
            ...item,
            saldo_existente: Math.round(item.saldo_existente * 100) / 100,
            // Verificar diferentes posibles nombres de campo para el estado
            isActive: (() => {
              const estado = item.estado || item.Estado || item.status || item.Status
              return estado === "Activo" || estado === "activo" || estado === "ACTIVO"
            })(),
          }))

          setFood(formattedFood)
          console.log(`Alimentos cargados: ${formattedFood.length} total`)
        }
      } catch (error) {
        console.error("Error al obtener food:", error)
        setErrorMessage("Error al obtener food")
        setShowErrorAlert(true)
      } finally {
        setLoadingFood(false)
      }
    }

    fetchFood()
  }, [])

  // Initialize form with entrada data when component mounts
  useEffect(() => {
    console.log("=== DEBUGGING ENTRADA DATA ===")
    console.log("entradaData completo:", entradaData)
    console.log("Tipo de entradaData:", typeof entradaData)
    console.log("Es array?:", Array.isArray(entradaData))
    console.log("Propiedades disponibles:", Object.keys(entradaData || {}))

    if (entradaData) {
      // Formatear la fecha para el input date (YYYY-MM-DD)
      if (entradaData.Fecha) {
        const fecha = new Date(entradaData.Fecha)
        const fechaFormateada = fecha.toISOString().split("T")[0]
        setFechaEntrada(fechaFormateada)
      } else {
        setFechaEntrada("")
      }

      // Usar los nombres de propiedades que vienen del componente padre
      const valorUnitario = entradaData["Valor unitario"]?.toString() || ""
      if (containsLetters(valorUnitario)) {
        console.warn("El valor unitario contiene letras:", valorUnitario)
      }
      setValorEntrada(valorUnitario)

      // Guardar la cantidad original para cálculos posteriores
      const cantidadOriginal = entradaData.Cantidad?.toString() || ""
      if (containsLetters(cantidadOriginal)) {
        console.warn("La cantidad contiene letras:", cantidadOriginal)
      }
      setCantidadEntrada(cantidadOriginal)
      setCantidadEntradaOriginal(cantidadOriginal)

      // Buscar el ID del alimento basado en el nombre
      if (entradaData.Alimento && food.length > 0) {
        const foundFood = food.find((item) => item.name_food === entradaData.Alimento)
        if (foundFood) {
          setIdFood((foundFood.Id_food || foundFood.id_food)?.toString() || "")
          setSelectedFood(foundFood)

          // VERIFICAR SI EL ALIMENTO ESTÁ INACTIVO
          setIsSelectedFoodInactive(!foundFood.isActive)

          // Guardar el saldo existente original del alimento
          setSaldoExistenteOriginal(foundFood.saldo_existente)
        }
      }

      // Calcular valor total
      setValorTotal(entradaData["Valor total"]?.toString() || "")

      // Establecer existencia actual
      setExistenciaActualG(entradaData["Existencia actual"]?.toString() || "")
    }
  }, [entradaData, food])

  // Cuando se carguen los alimentos y tengamos un ID de alimento, seleccionarlo
  useEffect(() => {
    if (Id_food && food && food.length > 0) {
      handleFoodChange(Id_food)
    }
  }, [Id_food, food])

  const handleFoodChange = (foodId) => {
    const selected = food.find((item) => (item.Id_food || item.id_food)?.toString() === foodId)
    setSelectedFood(selected)

    // VERIFICAR SI EL ALIMENTO SELECCIONADO ESTÁ INACTIVO
    if (selected) {
      setIsSelectedFoodInactive(!selected.isActive)
    } else {
      setIsSelectedFoodInactive(false)
    }
  }

  // Calcular valor total automáticamente cuando cambian el valor unitario o la cantidad
  useEffect(() => {
    const valorUnitario = Number.parseFloat(valor_entrada) || 0
    const cantidad = Number.parseFloat(cantidad_entrada) || 0
    setValorTotal(Math.round(valorUnitario * cantidad).toString())
  }, [valor_entrada, cantidad_entrada])

  // Calcular existencia actual en gramos cuando cambia la cantidad o el alimento seleccionado
  useEffect(() => {
    if (cantidad_entrada && selectedFood && cantidad_entrada_original) {
      // Calcular la diferencia entre la cantidad nueva y la original (en bultos)
      const cantidadOriginalBultos = Number(cantidad_entrada_original)
      const nuevaCantidadBultos = Number(cantidad_entrada)
      const diferenciaBultos = nuevaCantidadBultos - cantidadOriginalBultos

      // Convertir la diferencia a gramos
      const diferenciaGramos = diferenciaBultos * GRAMOS_POR_BULTO

      // Calcular el nuevo saldo basado en el saldo existente actual + la diferencia
      const nuevoSaldoTotal = Math.round(selectedFood.saldo_existente + diferenciaGramos)

      setExistenciaActualG(nuevoSaldoTotal.toString())

      console.log("Cálculo de existencia:", {
        cantidadOriginal: cantidadOriginalBultos,
        nuevaCantidad: nuevaCantidadBultos,
        diferencia: diferenciaBultos,
        diferenciaGramos,
        saldoActual: selectedFood.saldo_existente,
        nuevoSaldo: nuevoSaldoTotal,
      })
    } else {
      setExistenciaActualG("")
    }
  }, [cantidad_entrada, selectedFood, cantidad_entrada_original])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // VALIDACIÓN: No permitir actualización si el alimento está inactivo
    if (isSelectedFoodInactive) {
      setErrorMessage(
        "No se puede actualizar una entrada cuando el alimento está inactivo. El alimento debe estar activo para realizar modificaciones.",
      )
      setShowErrorAlert(true)
      return
    }

    // Validaciones finales antes de enviar
    if (containsLetters(cantidad_entrada)) {
      setErrorMessage("La cantidad solo puede contener números")
      setShowErrorAlert(true)
      return
    }

    if (containsLetters(valor_entrada)) {
      setErrorMessage("El valor unitario solo puede contener números")
      setShowErrorAlert(true)
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Validar que los campos requeridos no estén vacíos
      if (!fecha_entrada || !valor_entrada || !cantidad_entrada || !Id_food) {
        setErrorMessage("Por favor, complete todos los campos.")
        setShowErrorAlert(true)
        return
      }

      // Obtener el ID de la entrada de manera más robusta
      const entradaId = getEntradaId(entradaData)

      if (!entradaId) {
        setErrorMessage(
          "Error: No se pudo identificar la entrada a actualizar. Verifica que los datos contengan un ID válido.",
        )
        setShowErrorAlert(true)
        return
      }

      // CORRECCIÓN: Crear objeto con los datos a enviar - todos como enteros
      const data = {
        Id_entrada: Number(entradaId),
        fecha_entrada: fecha_entrada,
        valor_entrada: Math.round(Number.parseFloat(valor_entrada)), // Convertir a entero
        cantidad_entrada: Math.round(Number.parseFloat(cantidad_entrada)), // Convertir a entero
        valor_total: Math.round(Number.parseFloat(valor_total)), // Convertir a entero
        Id_food: Number.parseInt(Id_food),
        existencia_actual: Math.round(Number.parseFloat(existencia_actual_g)), // Convertir a entero
      }

      console.log("=== DATOS DE LA PETICIÓN ===")
      console.log("ID de entrada:", entradaId)
      console.log("Datos a enviar:", data)
      console.log("Tipos de datos:")
      console.log("- Id_entrada:", typeof data.Id_entrada, data.Id_entrada)
      console.log("- fecha_entrada:", typeof data.fecha_entrada, data.fecha_entrada)
      console.log("- valor_entrada:", typeof data.valor_entrada, data.valor_entrada)
      console.log("- cantidad_entrada:", typeof data.cantidad_entrada, data.cantidad_entrada)
      console.log("- valor_total:", typeof data.valor_total, data.valor_total)
      console.log("- Id_food:", typeof data.Id_food, data.Id_food)
      console.log("- existencia_actual:", typeof data.existencia_actual, data.existencia_actual)
      console.log("============================")

      // Verificar que el endpoint existe antes de hacer la petición
      try {
        // Primero intentar obtener la entrada para verificar que existe
        const checkResponse = await axiosInstance.get(`/Api/Entrada/ConsultEntrada?id=${entradaId}`)
        console.log("Entrada encontrada:", checkResponse.data)
      } catch (checkError) {
        console.error("Error al verificar la entrada:", checkError)
        if (checkError.response?.status === 404) {
          setErrorMessage(`No se encontró la entrada con ID: ${entradaId}. Verifica que el ID sea correcto.`)
        } else {
          setErrorMessage("Error al verificar la entrada en el servidor.")
        }
        setShowErrorAlert(true)
        return
      }

      // Realizar la petición POST al API
      const response = await axiosInstance.post(`/Api/Entrada/UpdateEntrada`, data)

      if (response.status === 200) {
        setSuccessMessage("Entrada actualizada con éxito")
        setShowSuccessAlert(true)
      } else {
        setErrorMessage(`Error al actualizar la entrada. Código de estado: ${response.status}`)
        setShowErrorAlert(true)
      }
    } catch (error) {
      console.error("=== ERROR DETALLADO ===")
      console.error("Error completo:", error)
      console.error("Respuesta del servidor:", error.response)
      console.error("Estado HTTP:", error.response?.status)
      console.error("Datos de error:", error.response?.data)
      console.error("URL que falló:", error.config?.url)
      console.error("Método HTTP:", error.config?.method)
      console.error("======================")

      let errorMsg = "Error al actualizar la entrada"

      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMsg = `Endpoint no encontrado. Verifica que la URL '/Api/Entrada/UpdateEntrada/${getEntradaId(entradaData)}' sea correcta en tu backend.`
            break
          case 400:
            errorMsg = "Datos inválidos enviados al servidor."
            break
          case 500:
            errorMsg = "Error interno del servidor."
            break
          default:
            errorMsg = `Error del servidor: ${error.response.status} - ${error.response.statusText}`
        }
      } else if (error.request) {
        errorMsg = "No se pudo conectar con el servidor."
      }

      setErrorMessage(errorMsg)
      setShowErrorAlert(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    if (onUpdate) {
      onUpdate() // Refresh entrada list
    }
    if (onClose) {
      onClose() // Close the modal
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setErrorMessage("")
  }

  // Verificar si hay errores de validación
  const hasValidationErrors = containsLetters(cantidad_entrada) || containsLetters(valor_entrada)

  // Determinar si el botón debe estar deshabilitado
  const isSubmitDisabled =
    isLoading ||
    hasValidationErrors ||
    !fecha_entrada ||
    !valor_entrada ||
    !cantidad_entrada ||
    !Id_food ||
    isSelectedFoodInactive // NUEVO: Deshabilitar si el alimento está inactivo

  return (
    <>
      {/* Alerta de éxito */}
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />

      {/* Alerta de error */}
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        

        {/* NUEVO: Alerta de alimento inactivo */}
        {isSelectedFoodInactive && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Alimento Inactivo</h3>
                <p className="text-sm text-red-700 mt-1">
                  No se puede actualizar esta entrada porque el alimento "{selectedFood?.name_food}" está inactivo. Para
                  realizar modificaciones, el alimento debe estar activo.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Fecha de Entrada */}
          <div>
            <label htmlFor="fecha_entrada" className="block text-gray-700 font-medium mb-2">
              Fecha de la Entrada:
            </label>
            <input
              type="date"
              id="fecha_entrada"
              value={fecha_entrada}
              onChange={(e) => setFechaEntrada(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              disabled={isSelectedFoodInactive}
            />
          </div>

          {/* Alimento */}
          <div>
            <label htmlFor="Id_food" className="block text-gray-700 font-medium mb-2">
              Alimento:
            </label>
            {loadingFood ? (
              <div className="text-center py-2 border border-gray-300 rounded-lg bg-gray-50">Cargando...</div>
            ) : (
              <select
                id="Id_food"
                value={Id_food}
                onChange={(e) => {
                  setIdFood(e.target.value)
                  handleFoodChange(e.target.value)
                }}
                className={`w-full border rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-600 ${
                  isSelectedFoodInactive ? "bg-red-50 border-red-300" : "border-gray-400"
                }`}
                required
                disabled={isSelectedFoodInactive}
              >
                <option value="">Seleccione</option>
                {food.map((item) => (
                  <option
                    key={item.Id_food || item.id_food}
                    value={item.Id_food || item.id_food}
                    className={!item.isActive ? "text-red-500" : ""}
                  >
                    {item.name_food} ({item.saldo_existente.toFixed(2)} g) {!item.isActive ? "(INACTIVO)" : ""}
                  </option>
                ))}
              </select>
            )}
            {isSelectedFoodInactive && <p className="text-xs text-red-600 mt-1">❌ Este alimento está inactivo</p>}
          </div>

          {/* Cantidad de Entrada */}
          <div>
            <label htmlFor="cantidad_entrada" className="block text-gray-700 font-medium mb-2">
              Cantidad de Entrada (bultos):
            </label>
            <input
              type="text"
              id="cantidad_entrada"
              value={cantidad_entrada}
              onChange={handleCantidadChange}
              className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 ${
                containsLetters(cantidad_entrada)
                  ? "border-red-500 focus:ring-red-500"
                  : isSelectedFoodInactive
                    ? "border-red-300 bg-red-50"
                    : "border-gray-400 focus:ring-gray-600"
              }`}
              required
              placeholder="Ingrese la cantidad"
              disabled={isSelectedFoodInactive}
            />
            <p className="text-xs text-red-500 mt-1">⚠️ Solo se permiten números</p>
            <small className="text-gray-500">1 bulto = {GRAMOS_POR_BULTO} g</small>
          </div>

          {/* Valor Unitario */}
          <div>
            <label htmlFor="valor_entrada" className="block text-gray-700 font-medium mb-2">
              Valor Unitario:
            </label>
            <input
              type="text"
              id="valor_entrada"
              value={valor_entrada}
              onChange={handleValorChange}
              className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 ${
                containsLetters(valor_entrada)
                  ? "border-red-500 focus:ring-red-500"
                  : isSelectedFoodInactive
                    ? "border-red-300 bg-red-50"
                    : "border-gray-400 focus:ring-gray-600"
              }`}
              required
              placeholder="Ingrese el valor"
              disabled={isSelectedFoodInactive}
            />
            <p className="text-xs text-red-500 mt-1">⚠️ Solo se permiten números</p>
          </div>

          {/* Valor Total (Calculado) */}
          <div>
            <label htmlFor="valor_total" className="block text-gray-700 font-medium mb-2">
              Valor Total:
            </label>
            <input
              type="number"
              id="valor_total"
              value={valor_total}
              readOnly
              className="w-full border border-gray-400 rounded-lg p-2 bg-gray-100 focus:outline-none"
            />
            <small className="text-gray-500">Calculado automáticamente</small>
          </div>

          {/* Existencia Actual (Calculada) */}
          <div>
            <label htmlFor="existencia_actual" className="block text-gray-700 font-medium mb-2">
              Saldo Total Resultante:
            </label>
            <input
              type="text"
              id="existencia_actual"
              value={existencia_actual_g ? `${existencia_actual_g} g` : ""}
              readOnly
              className="w-full border border-gray-400 rounded-lg p-2 bg-gray-100 focus:outline-none"
            />
            <small className="text-gray-500">
              {Number(cantidad_entrada) > Number(cantidad_entrada_original)
                ? "Se añadirán gramos al inventario"
                : Number(cantidad_entrada) < Number(cantidad_entrada_original)
                  ? "Se restarán gramos del inventario"
                  : "Sin cambios en el inventario"}
            </small>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`font-semibold py-3 px-6 rounded-lg transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSelectedFoodInactive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-black text-white hover:bg-gray-600"
            }`}
          >
            {isLoading
              ? "Actualizando..."
              : isSelectedFoodInactive
                ? "No se puede actualizar (Alimento inactivo)"
                : "Actualizar Entrada"}
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdateEntrada
