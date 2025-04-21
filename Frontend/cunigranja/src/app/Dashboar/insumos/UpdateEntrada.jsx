"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"

const UpdateEntrada = ({ entradaData, onClose, onUpdate }) => {
  const [fecha_entrada, setFechaEntrada] = useState("")
  const [valor_entrada, setValorEntrada] = useState("")
  const [cantidad_entrada, setCantidadEntrada] = useState("")
  const [cantidad_entrada_original, setCantidadEntradaOriginal] = useState("")
  const [Id_food, setIdFood] = useState("")
  const [food, setFood] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingFood, setLoadingFood] = useState(true)
  const [selectedFood, setSelectedFood] = useState(null)

  // Campos calculados automáticamente - solo para mostrar al usuario
  const [valor_total, setValorTotal] = useState("")
  const [existencia_actual_kg, setExistenciaActualKg] = useState("")
  const [saldo_existente_original, setSaldoExistenteOriginal] = useState(0)

  // Constante para la conversión
  const KILOS_POR_BULTO = 40

  // Cargar los alimentos al montar el componente
  useEffect(() => {
    async function fetchFood() {
      try {
        setLoadingFood(true)
        const response = await axiosInstance.get("/Api/Food/GetFood")
        if (response.status === 200) {
          // Formatear los saldos para mostrar solo 2 decimales
          const formattedFood = response.data.map((item) => ({
            ...item,
            saldo_existente: Math.round(item.saldo_existente * 100) / 100,
          }))
          setFood(formattedFood)
        }
      } catch (error) {
        console.error("Error al obtener food:", error)
        setErrorMessage("Error al obtener food")
      } finally {
        setLoadingFood(false)
      }
    }

    fetchFood()
  }, [])

  // Initialize form with entrada data when component mounts
  useEffect(() => {
    console.log("entradaData recibido:", entradaData)
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
      setValorEntrada(entradaData["Valor unitario"]?.toString() || "")

      // Guardar la cantidad original para cálculos posteriores
      const cantidadOriginal = entradaData.Cantidad?.toString() || ""
      setCantidadEntrada(cantidadOriginal)
      setCantidadEntradaOriginal(cantidadOriginal)

      // Buscar el ID del alimento basado en el nombre
      if (entradaData.Alimento && food.length > 0) {
        const foundFood = food.find((item) => item.name_food === entradaData.Alimento)
        if (foundFood) {
          setIdFood((foundFood.Id_food || foundFood.id_food)?.toString() || "")
          setSelectedFood(foundFood)

          // Guardar el saldo existente original del alimento
          setSaldoExistenteOriginal(foundFood.saldo_existente)
        }
      }

      // Calcular valor total
      setValorTotal(entradaData["Valor total"]?.toString() || "")

      // Establecer existencia actual
      setExistenciaActualKg(entradaData["Existencia actual"]?.toString() || "")
    }
  }, [entradaData, food])

  // Cuando se carguen los alimentos y tengamos un ID de alimento, seleccionarlo
  useEffect(() => {
    if (Id_food && food && food.length > 0) {
      handleFoodChange(Id_food)
    }
  }, [Id_food, food])

  // Calcular valor total automáticamente cuando cambia valor_entrada o cantidad_entrada
  useEffect(() => {
    if (valor_entrada && cantidad_entrada) {
      const total = Number(valor_entrada) * Number(cantidad_entrada)
      setValorTotal(total.toString())
    } else {
      setValorTotal("")
    }
  }, [valor_entrada, cantidad_entrada])

  // Calcular existencia actual en kilogramos cuando cambia la cantidad o el alimento seleccionado
  useEffect(() => {
    if (cantidad_entrada && selectedFood && cantidad_entrada_original) {
      // Calcular la diferencia entre la cantidad nueva y la original (en bultos)
      const cantidadOriginalBultos = Number(cantidad_entrada_original)
      const nuevaCantidadBultos = Number(cantidad_entrada)
      const diferenciaBultos = nuevaCantidadBultos - cantidadOriginalBultos

      // Convertir la diferencia a kilogramos
      const diferenciaKg = diferenciaBultos * KILOS_POR_BULTO

      // Calcular el nuevo saldo basado en el saldo existente actual + la diferencia
      const nuevoSaldoTotal = Math.round((selectedFood.saldo_existente + diferenciaKg) * 100) / 100

      // Convertir a string y eliminar ceros finales innecesarios después del punto decimal
      const nuevoSaldoStr = nuevoSaldoTotal.toString()

      // Si tiene decimales, mostrar solo los necesarios
      setExistenciaActualKg(nuevoSaldoStr.includes(".") ? nuevoSaldoStr.replace(/\.?0+$/, "") : nuevoSaldoStr)

      console.log("Cálculo de existencia:", {
        cantidadOriginal: cantidadOriginalBultos,
        nuevaCantidad: nuevaCantidadBultos,
        diferencia: diferenciaBultos,
        diferenciaKg,
        saldoActual: selectedFood.saldo_existente,
        nuevoSaldo: nuevoSaldoTotal,
      })
    } else {
      setExistenciaActualKg("")
    }
  }, [cantidad_entrada, selectedFood, cantidad_entrada_original])

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

      // Si cambiamos de alimento, actualizar el saldo existente original
      if (foodSelected) {
        setSaldoExistenteOriginal(foodSelected.saldo_existente)
      }
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
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([key, value]) => `${key}: ${value.join(", ")}`)
          .join("; ")
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

    if (!fecha_entrada || !valor_entrada || !cantidad_entrada || !Id_food) {
      setErrorMessage("Todos los campos son obligatorios.")
      return
    }

    setIsLoading(true)
    try {
      // Formatear la fecha correctamente para el backend
      // Crear un objeto Date con la fecha seleccionada
      const fechaPartes = fecha_entrada.split("-")
      const año = Number.parseInt(fechaPartes[0])
      const mes = Number.parseInt(fechaPartes[1]) - 1 // Los meses en JavaScript son 0-11
      const dia = Number.parseInt(fechaPartes[2])

      // Crear fecha con hora 12:00 para evitar problemas de zona horaria
      const fechaObj = new Date(año, mes, dia, 12, 0, 0)

      // Formatear la fecha como string en formato yyyy-MM-dd
      const fechaFormateada = `${fechaObj.getFullYear()}-${String(fechaObj.getMonth() + 1).padStart(2, "0")}-${String(fechaObj.getDate()).padStart(2, "0")}`

      // Asegurarse de que los valores numéricos se envíen como números, no como strings
      const entradaDataToUpdate = {
        id_entrada: entradaData.ID, // Usar el ID de la entrada que estamos actualizando
        fecha_entrada: fechaFormateada,
        valor_entrada: Number(valor_entrada),
        cantidad_entrada: Number(cantidad_entrada),
        id_food: Number(Id_food),
        // No enviamos existencia_actual ni valor_total, el backend los calculará
      }

      console.log("Datos a enviar para actualización:", entradaDataToUpdate)

      const response = await axiosInstance.post("/Api/Entrada/UpdateEntrada", entradaDataToUpdate)

      if (response.status === 200) {
        setSuccessMessage(response.data.message || "Entrada actualizada correctamente")

        // Llamar al callback onUpdate para refrescar los datos
        if (typeof onUpdate === "function") {
          setTimeout(() => {
            onUpdate()
            if (typeof onClose === "function") {
              onClose()
            }
          }, 1500)
        }
      }
    } catch (error) {
      console.error("Error al actualizar la entrada:", error)
      const errorMsg = extractErrorMessage(error)
      setErrorMessage(errorMsg)

      // Mostrar detalles adicionales en la consola para depuración
      if (error.response && error.response.data && error.response.data.errors) {
        console.log("Detalles de errores de validación:", error.response.data.errors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setErrorMessage("")
    setSuccessMessage("")
    if (typeof onClose === "function") {
      onClose()
    }
  }

  return (
    <>
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

      <form
        onSubmit={handlerSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Actualizar Entrada de Alimento</h2>

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
                          {item.name_food} ({item.saldo_existente.toFixed(2)} kg)
                        </option>
                      ),
                  )}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="cantidad_entrada" className="block text-gray-700 font-medium mb-2">
              Cantidad de Entrada (bultos):
            </label>
            <input
              type="number"
              id="cantidad_entrada"
              value={cantidad_entrada}
              onChange={(e) => setCantidadEntrada(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              min="1"
              step="1" // Solo números enteros
            />
            <small className="text-gray-500">1 bulto = {KILOS_POR_BULTO} kg</small>
            {cantidad_entrada_original && cantidad_entrada !== cantidad_entrada_original && (
              <small className="block text-blue-600 mt-1">Cantidad original: {cantidad_entrada_original} bultos</small>
            )}
          </div>

          <div>
            <label htmlFor="valor_entrada" className="block text-gray-700 font-medium mb-2">
              Valor Unitario:
            </label>
            <input
              type="number"
              id="valor_entrada"
              value={valor_entrada}
              onChange={(e) => setValorEntrada(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              min="1"
              step="1" // Solo números enteros
            />
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
              value={existencia_actual_kg ? `${existencia_actual_kg} kg` : ""}
              readOnly
              className="w-full border border-gray-400 rounded-lg p-2 bg-gray-100 focus:outline-none"
            />
            <small className="text-gray-500">
              {Number(cantidad_entrada) > Number(cantidad_entrada_original)
                ? "Se añadirán kilos al inventario"
                : Number(cantidad_entrada) < Number(cantidad_entrada_original)
                  ? "Se restarán kilos del inventario"
                  : "Sin cambios en el inventario"}
            </small>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors w-full"
          >
            {isLoading ? "Actualizando..." : "Actualizar Entrada"}
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdateEntrada
