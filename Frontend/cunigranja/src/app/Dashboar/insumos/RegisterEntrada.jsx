"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"
import AlertModal from "@/components/utils/AlertModal"

const RegisterEntrada = ({ refreshData, onCloseForm }) => {
  const [fecha_entrada, setFechaEntrada] = useState("")
  const [valor_entrada, setValorEntrada] = useState("")
  const [cantidad_entrada, setCantidadEntrada] = useState("")
  const [Id_food, setIdFood] = useState("")
  const [food, setFood] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingFood, setLoadingFood] = useState(true)
  const [selectedFood, setSelectedFood] = useState(null)

  // Campos calculados automáticamente - solo para mostrar al usuario
  const [valor_total, setValorTotal] = useState("")
  const [existencia_actual_g, setExistenciaActualG] = useState("")

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

  useEffect(() => {
    async function fetchFood() {
      try {
        setLoadingFood(true)
        const response = await axiosInstance.get("/Api/Food/GetFood")
        if (response.status === 200) {
          // MODIFICADO: Filtrar alimentos por estados permitidos
          const availableFoods = response.data.filter((item) => {
            // Verificar diferentes posibles nombres de campo para el estado
            const estado = item.estado_food || item.estado || item.Estado || item.status || item.Status || ""

            // Normalizar el estado a minúsculas para comparación insensible a mayúsculas/minúsculas
            const estadoLower = estado.toLowerCase()

            // Permitir solo estados "Existente" y "Casi por acabar"
            return (
              estadoLower === "existente" ||
              estadoLower === "casi por acabar" ||
              estadoLower === "casi agotado" ||
              estadoLower === "casi por agotarse"
            )
          })

          // Formatear los saldos para mostrar solo 2 decimales
          const formattedFood = availableFoods.map((item) => ({
            ...item,
            saldo_existente: Math.round(item.saldo_existente * 100) / 100,
          }))

          setFood(formattedFood)
          console.log(`Alimentos cargados: ${response.data.length} total, ${formattedFood.length} disponibles`)
        }
      } catch (error) {
        console.error("Error al obtener food:", error)
        setErrorMessage("Error al obtener alimentos")
        setShowErrorAlert(true)
      } finally {
        setLoadingFood(false)
      }
    }

    fetchFood()
  }, [])

  // Calcular valor total automáticamente cuando cambia valor_entrada o cantidad_entrada
  useEffect(() => {
    if (valor_entrada && cantidad_entrada) {
      const total = Number(valor_entrada) * Number(cantidad_entrada)
      setValorTotal(total.toString())
    } else {
      setValorTotal("")
    }
  }, [valor_entrada, cantidad_entrada])

  // Calcular existencia actual en gramos cuando cambia la cantidad o el alimento seleccionado
  useEffect(() => {
    if (cantidad_entrada && selectedFood) {
      // La cantidad_entrada está en bultos, convertir a gramos
      const cantidadBultos = Number(cantidad_entrada)
      const cantidadGramos = cantidadBultos * GRAMOS_POR_BULTO

      // Obtener el saldo existente actual del alimento
      const saldoExistenteActual = selectedFood.saldo_existente

      // Calcular el nuevo saldo total (saldo existente + cantidad entrada) y redondear a entero
      const nuevoSaldoTotal = Math.round(saldoExistenteActual + cantidadGramos)
      setExistenciaActualG(nuevoSaldoTotal.toString())
    } else {
      setExistenciaActualG("")
    }
  }, [cantidad_entrada, selectedFood])

  // Obtener detalles del alimento seleccionado
  const handleFoodChange = (foodId) => {
    setIdFood(foodId)
    // Solo buscar si tenemos un ID y si food tiene elementos
    if (foodId && food && food.length > 0) {
      const foodSelected = food.find(
        (item) =>
          item && (item.Id_food?.toString() === foodId.toString() || item.id_food?.toString() === foodId.toString()),
      )
      setSelectedFood(foodSelected || null)
    } else {
      setSelectedFood(null)
    }
  }

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

  // Función para validar todos los campos numéricos
  const validateAllNumericFields = () => {
    const errors = []

    if (containsLetters(valor_entrada)) {
      errors.push("El valor unitario solo puede contener números")
    }

    if (containsLetters(cantidad_entrada)) {
      errors.push("La cantidad solo puede contener números")
    }

    // Validar que Id_food sea un número válido
    if (Id_food && (isNaN(Number(Id_food)) || Number(Id_food) <= 0)) {
      errors.push("Debe seleccionar un alimento válido")
    }

    return errors
  }

  async function handlerSubmit(e) {
    e.preventDefault()

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

    if (!fecha_entrada || !valor_entrada || !cantidad_entrada || !Id_food) {
      setErrorMessage("Todos los campos son obligatorios.")
      setShowErrorAlert(true)
      return
    }

    // Validación completa de todos los campos numéricos
    const numericErrors = validateAllNumericFields()
    if (numericErrors.length > 0) {
      setErrorMessage(numericErrors.join(". "))
      setShowErrorAlert(true)
      return
    }

    setIsLoading(true)
    try {
      // Formatear la fecha correctamente para el backend
      const fechaPartes = fecha_entrada.split("-")
      const año = Number.parseInt(fechaPartes[0])
      const mes = Number.parseInt(fechaPartes[1]) - 1 // Los meses en JavaScript son 0-11
      const dia = Number.parseInt(fechaPartes[2])

      // Crear fecha con hora 12:00 para evitar problemas de zona horaria
      const fechaObj = new Date(año, mes, dia, 12, 0, 0)

      // Formatear la fecha como string en formato yyyy-MM-dd
      const fechaFormateada = `${fechaObj.getFullYear()}-${String(fechaObj.getMonth() + 1).padStart(2, "0")}-${String(fechaObj.getDate()).padStart(2, "0")}`

      // CORRECCIÓN: Enviar todos los valores como enteros para evitar errores de validación
      const entradaData = {
        Id_entrada: 0,
        fecha_entrada: fechaFormateada,
        valor_entrada: Math.round(Number(valor_entrada)), // Convertir a entero
        cantidad_entrada: Math.round(Number(cantidad_entrada)), // Convertir a entero
        Id_food: Number(Id_food),
        valor_total: Math.round(Number(valor_total)) || 0, // Convertir a entero
        existencia_actual: Math.round(Number(existencia_actual_g)) || 0, // Convertir a entero
      }

      console.log("Datos a enviar:", entradaData)

      const response = await axiosInstance.post("/Api/Entrada/CreateEntrada", entradaData)

      if (response.status === 200) {
        setSuccessMessage(response.data.message || "Registro exitoso")
        setShowSuccessAlert(true)
        setFechaEntrada("")
        setValorEntrada("")
        setCantidadEntrada("")
        setIdFood("")
        setValorTotal("")
        setExistenciaActualG("")
        setSelectedFood(null)
      }
    } catch (error) {
      console.error("Error al registrar la entrada:", error)
      setErrorMessage(extractErrorMessage(error))
      setShowErrorAlert(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    setSuccessMessage("")

    if (refreshData && typeof refreshData === "function") {
      refreshData()
    }

    if (onCloseForm && typeof onCloseForm === "function") {
      onCloseForm()
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setErrorMessage("")
  }

  // Verificar si hay errores de validación
  const hasValidationErrors = containsLetters(cantidad_entrada) || containsLetters(valor_entrada)

  return (
    <>
      {/* Alerta de éxito */}
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />

      {/* Alerta de error */}
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        onSubmit={handlerSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registrar Entrada de Alimento</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Alimento:</label>
            {loadingFood ? (
              <div className="text-center py-2 border border-gray-300 rounded-lg bg-gray-50">Cargando...</div>
            ) : (
              <select
                value={Id_food}
                onChange={(e) => handleFoodChange(e.target.value)}
                className="w-full border border-gray-400 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                required
              >
                <option value="">Seleccione</option>
                {food &&
                  food.length > 0 &&
                  food.map(
                    (item) =>
                      item &&
                      (item.Id_food || item.id_food) && (
                        <option key={item.Id_food || item.id_food} value={item.Id_food || item.id_food}>
                          {item.name_food} ({item.saldo_existente.toFixed(2)} g)
                          {/* Mostrar el estado del alimento */}
                          {item.estado_food ? ` - ${item.estado_food}` : ""}
                        </option>
                      ),
                  )}
              </select>
            )}
            <p className="text-xs text-green-600 mt-1">
              ✅ Solo se muestran alimentos disponibles ({food.length} disponibles)
            </p>
            <p className="text-xs text-gray-500">Estados permitidos: &quot;Existente&quot; y &quot;Casi por acabar&quot;</p>
          </div>

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
                  : "border-gray-400 focus:ring-gray-600"
              }`}
              required
              placeholder="Ingrese la cantidad"
            />
            <p className="text-xs text-red-500 mt-1">⚠️ Solo se permiten números</p>
            <small className="text-gray-500">1 bulto = {GRAMOS_POR_BULTO} g</small>
          </div>

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
                  : "border-gray-400 focus:ring-gray-600"
              }`}
              required
              placeholder="Ingrese el valor"
            />
            <p className="text-xs text-red-500 mt-1">⚠️ Solo se permiten números</p>
          </div>

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
            <small className="text-gray-500">Saldo existente + nueva entrada (en g)</small>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={
              isLoading ||
              hasValidationErrors ||
              !fecha_entrada ||
              !valor_entrada ||
              !cantidad_entrada ||
              !Id_food ||
              containsLetters(valor_entrada) ||
              containsLetters(cantidad_entrada)
            }
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registrando..." : "Registrar Entrada"}
          </button>
        </div>
      </form>
    </>
  )
}

export default RegisterEntrada
