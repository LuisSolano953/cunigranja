// Modificar el componente UpdateEntrada para usar gramos
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
  const [existencia_actual_g, setExistenciaActualG] = useState("")
  const [saldo_existente_original, setSaldoExistenteOriginal] = useState(0)

  // Constante para la conversión
  const GRAMOS_POR_BULTO = 40000 // 40kg = 40000g

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
  }

  // Calcular valor total automáticamente cuando cambian el valor unitario o la cantidad
  useEffect(() => {
    const valorUnitario = Number.parseFloat(valor_entrada) || 0
    const cantidad = Number.parseFloat(cantidad_entrada) || 0
    setValorTotal((valorUnitario * cantidad).toFixed(2))
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
      const nuevoSaldoTotal = Math.round((selectedFood.saldo_existente + diferenciaGramos) * 100) / 100

      // Convertir a string y eliminar ceros finales innecesarios después del punto decimal
      const nuevoSaldoStr = nuevoSaldoTotal.toString()

      // Si tiene decimales, mostrar solo los necesarios
      setExistenciaActualG(nuevoSaldoStr.includes(".") ? nuevoSaldoStr.replace(/\.?0+$/, "") : nuevoSaldoStr)

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
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Validar que los campos requeridos no estén vacíos
      if (!fecha_entrada || !valor_entrada || !cantidad_entrada || !Id_food) {
        setErrorMessage("Por favor, complete todos los campos.")
        return
      }

      // Crear objeto con los datos a enviar
      const data = {
        Id_entrada: entradaData?.Id_entrada,
        Fecha: fecha_entrada,
        "Valor unitario": Number.parseFloat(valor_entrada),
        Cantidad: Number.parseFloat(cantidad_entrada),
        "Valor total": Number.parseFloat(valor_total),
        Id_food: Number.parseInt(Id_food),
        "Existencia actual": Number.parseFloat(existencia_actual_g),
      }

      // Realizar la petición PUT al API
      const response = await axiosInstance.put(`/Api/Entrada/UpdateEntrada/${entradaData?.Id_entrada}`, data)

      if (response.status === 200) {
        setSuccessMessage("Entrada actualizada con éxito")
        onUpdate() // Refresh entrada list
        onClose() // Close the modal
      } else {
        setErrorMessage("Error al actualizar la entrada")
      }
    } catch (error) {
      console.error("Error al actualizar la entrada:", error)
      setErrorMessage("Error al actualizar la entrada")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {/* Fecha de Entrada */}
      <div className="mb-4">
        <label htmlFor="fecha_entrada" className="block text-gray-700 text-sm font-bold mb-2">
          Fecha de Entrada:
        </label>
        <input
          type="date"
          id="fecha_entrada"
          value={fecha_entrada}
          onChange={(e) => setFechaEntrada(e.target.value)}
          className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Alimento */}
      <div className="mb-4">
        <label htmlFor="Id_food" className="block text-gray-700 text-sm font-bold mb-2">
          Alimento:
        </label>
        <select
          id="Id_food"
          value={Id_food}
          onChange={(e) => {
            setIdFood(e.target.value)
            handleFoodChange(e.target.value)
          }}
          className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Seleccione un alimento</option>
          {loadingFood ? (
            <option disabled>Cargando alimentos...</option>
          ) : (
            food.map((item) => (
              <option key={item.Id_food || item.id_food} value={item.Id_food || item.id_food}>
                {item.name_food} ({item.saldo_existente.toFixed(2)} g)
              </option>
            ))
          )}
        </select>
      </div>

      {/* Valor Unitario */}
      <div className="mb-4">
        <label htmlFor="valor_entrada" className="block text-gray-700 text-sm font-bold mb-2">
          Valor Unitario:
        </label>
        <input
          type="number"
          id="valor_entrada"
          value={valor_entrada}
          onChange={(e) => setValorEntrada(e.target.value)}
          className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Cantidad de Entrada */}
      <div className="mb-4">
        <label htmlFor="cantidad_entrada" className="block text-gray-700 text-sm font-bold mb-2">
          Cantidad (bultos):
        </label>
        <input
          type="number"
          id="cantidad_entrada"
          value={cantidad_entrada}
          onChange={(e) => setCantidadEntrada(e.target.value)}
          className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:border-blue-500"
        />
        <small className="text-gray-500">1 bulto = {GRAMOS_POR_BULTO} g</small>
      </div>

      {/* Valor Total (Calculado) */}
      <div className="mb-4">
        <label htmlFor="valor_total" className="block text-gray-700 text-sm font-bold mb-2">
          Valor Total:
        </label>
        <input
          type="text"
          id="valor_total"
          value={valor_total}
          readOnly
          className="w-full border border-gray-400 rounded-lg p-2 bg-gray-100 focus:outline-none"
        />
      </div>

      {/* Existencia Actual (Calculada) */}
      <div className="mb-4">
        <label htmlFor="existencia_actual" className="block text-gray-700 text-sm font-bold mb-2">
          Existencia Actual:
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

      {/* Mensajes de Error y Éxito */}
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {/* Botones */}
      <div className="flex justify-between">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isLoading ? "Actualizando..." : "Actualizar Entrada"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default UpdateEntrada
