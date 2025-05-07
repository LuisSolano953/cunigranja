"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"

const RegisterEntrada = ({ refreshData }) => {
  const [fecha_entrada, setFechaEntrada] = useState("")
  const [valor_entrada, setValorEntrada] = useState("")
  const [cantidad_entrada, setCantidadEntrada] = useState("")
  const [Id_food, setIdFood] = useState("")
  const [food, setFood] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingFood, setLoadingFood] = useState(true)
  const [selectedFood, setSelectedFood] = useState(null)

  // Campos calculados automáticamente - solo para mostrar al usuario
  const [valor_total, setValorTotal] = useState("")
  const [existencia_actual_g, setExistenciaActualG] = useState("")

  // Constante para la conversión
  const GRAMOS_POR_BULTO = 40000 // 40kg = 40000g

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

      // Calcular el nuevo saldo total (saldo existente + cantidad entrada) y redondear a 2 decimales
      const nuevoSaldoTotal = Math.round((saldoExistenteActual + cantidadGramos) * 100) / 100
      // Convertir a string y eliminar ceros finales innecesarios después del punto decimal
      const nuevoSaldoStr = nuevoSaldoTotal.toString()
      // Si tiene decimales, mostrar solo los necesarios (como en la tabla de alimentos)
      setExistenciaActualG(nuevoSaldoStr.includes(".") ? nuevoSaldoStr.replace(/\.?0+$/, "") : nuevoSaldoStr)
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
      const entradaData = {
        Id_entrada: 0, // Asegurarse de que se envía el ID (aunque sea 0 para nuevos registros)
        fecha_entrada: fechaFormateada,
        valor_entrada: Number(valor_entrada),
        cantidad_entrada: Number(cantidad_entrada),
        Id_food: Number(Id_food),
        // Agregar estos valores, aunque serán recalculados en el backend
        valor_total: Number(valor_total) || 0,
        existencia_actual: Number(existencia_actual_g) || 0,
      }

      console.log("Datos a enviar:", entradaData)

      const response = await axiosInstance.post("/Api/Entrada/CreateEntrada", entradaData)

      if (response.status === 200) {
        setSuccessMessage(response.data.message || "Registro exitoso")
        setFechaEntrada("")
        setValorEntrada("")
        setCantidadEntrada("")
        setIdFood("")
        setValorTotal("")
        setExistenciaActualG("")
        setSelectedFood(null)

        if (refreshData && typeof refreshData === "function") {
          refreshData()
        }
      }
    } catch (error) {
      console.error("Error al registrar la entrada:", error)
      setErrorMessage(extractErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setErrorMessage("")
    setSuccessMessage("")

    if (successMessage && refreshData && typeof refreshData === "function") {
      refreshData()
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
            <small className="text-gray-500">1 bulto = {GRAMOS_POR_BULTO} g</small>
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
            disabled={isLoading}
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors w-full"
          >
            {isLoading ? "Registrando..." : "Registrar Entrada"}
          </button>
        </div>
      </form>
    </>
  )
}

export default RegisterEntrada
